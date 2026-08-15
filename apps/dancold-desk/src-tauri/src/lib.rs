use serde::Serialize;
use std::fs;
use std::path::{Component, Path, PathBuf};
use std::process::Command;

#[derive(Debug, Serialize)]
struct PostFile {
    path: String,
    slug: String,
    title: String,
    description: String,
    #[serde(rename = "pubDate")]
    pub_date: String,
    draft: bool,
    library: Vec<String>,
    body: String,
}

#[derive(Debug, Serialize)]
struct BuildResult {
    ok: bool,
    output: String,
}

fn project_root(root: &str) -> Result<PathBuf, String> {
    let root = Path::new(root)
        .canonicalize()
        .map_err(|error| format!("Cannot open project folder: {error}"))?;
    if !root.join("package.json").is_file() || !root.join("src/content/blog").is_dir() {
        return Err("Choose the root of the Astro project (it must contain package.json and src/content/blog).".to_string());
    }
    Ok(root)
}

fn safe_post_path(root: &Path, relative: &str) -> Result<PathBuf, String> {
    let relative_path = Path::new(relative);
    if relative_path.is_absolute()
        || relative_path.components().any(|component| matches!(component, Component::ParentDir))
        || !relative.replace('\\', "/").starts_with("src/content/blog/")
    {
        return Err("The editor can only access files inside src/content/blog/.".to_string());
    }

    let extension = relative_path.extension().and_then(|value| value.to_str());
    if !matches!(extension, Some("md") | Some("mdx")) {
        return Err("Posts must use the .md or .mdx extension.".to_string());
    }

    let path = root.join(relative_path);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| format!("Cannot create post folder: {error}"))?;
    }
    Ok(path)
}

fn frontmatter_value(frontmatter: &str, key: &str) -> String {
    frontmatter
        .lines()
        .find_map(|line| {
            let (name, value) = line.split_once(':')?;
            if name.trim() != key {
                return None;
            }
            Some(value.trim().trim_matches(['\'', '"']).to_string())
        })
        .unwrap_or_default()
}

fn frontmatter_list(frontmatter: &str, key: &str) -> Vec<String> {
    let lines: Vec<&str> = frontmatter.lines().collect();
    let Some(key_index) = lines.iter().position(|line| line.split_once(':').map(|(name, _)| name.trim() == key).unwrap_or(false)) else {
        return Vec::new();
    };
    let inline = lines[key_index].split_once(':').map(|(_, value)| value.trim()).unwrap_or_default();
    if !inline.is_empty() {
        return inline
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|item| item.trim().trim_matches(['\'', '"']).to_string())
            .filter(|item| !item.is_empty())
            .collect();
    }

    lines
        .iter()
        .skip(key_index + 1)
        .take_while(|line| line.trim_start().starts_with('-'))
        .map(|line| line.trim_start().trim_start_matches('-').trim().trim_matches(['\'', '"']).to_string())
        .filter(|item| !item.is_empty())
        .collect()
}

fn parse_post(root: &Path, path: &Path) -> Result<PostFile, String> {
    let source = fs::read_to_string(path).map_err(|error| format!("Cannot read {}: {error}", path.display()))?;
    let mut sections = source.splitn(3, "---");
    let _before = sections.next().unwrap_or_default();
    let frontmatter = sections.next().unwrap_or_default();
    let body = sections.next().unwrap_or(source.as_str()).trim().to_string();
    let relative = path
        .strip_prefix(root)
        .map_err(|_| "Post is outside the selected project.".to_string())?
        .to_string_lossy()
        .replace('\\', "/");
    let slug = path.file_stem().and_then(|value| value.to_str()).unwrap_or_default().to_string();

    Ok(PostFile {
        path: relative,
        slug,
        title: frontmatter_value(frontmatter, "title"),
        description: frontmatter_value(frontmatter, "description"),
        pub_date: frontmatter_value(frontmatter, "pubDate"),
        draft: frontmatter_value(frontmatter, "draft") == "true",
        library: frontmatter_list(frontmatter, "library"),
        body,
    })
}

fn collect_posts(root: &Path, folder: &Path, posts: &mut Vec<PostFile>) -> Result<(), String> {
    for entry in fs::read_dir(folder).map_err(|error| format!("Cannot list posts: {error}"))? {
        let entry = entry.map_err(|error| format!("Cannot read post entry: {error}"))?;
        let path = entry.path();
        if path.is_dir() {
            collect_posts(root, &path, posts)?;
        } else if matches!(path.extension().and_then(|value| value.to_str()), Some("md") | Some("mdx")) {
            posts.push(parse_post(root, &path)?);
        }
    }
    Ok(())
}

#[tauri::command]
fn list_posts(root: String) -> Result<Vec<PostFile>, String> {
    let root = project_root(&root)?;
    let mut posts = Vec::new();
    collect_posts(&root, &root.join("src/content/blog"), &mut posts)?;
    posts.sort_by(|left, right| right.pub_date.cmp(&left.pub_date).then(left.title.cmp(&right.title)));
    Ok(posts)
}

#[tauri::command]
fn save_post(root: String, path: String, content: String) -> Result<(), String> {
    let root = project_root(&root)?;
    let path = safe_post_path(&root, &path)?;
    fs::write(path, content).map_err(|error| format!("Cannot save post: {error}"))
}

fn command_output(root: &Path, program: &str, args: &[&str]) -> Result<String, String> {
    let output = Command::new(program)
        .args(args)
        .current_dir(root)
        .output()
        .map_err(|error| format!("Could not run {program}: {error}"))?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    let combined = format!("{stdout}{stderr}").trim().to_string();
    if output.status.success() {
        Ok(combined)
    } else {
        Err(if combined.is_empty() { format!("{program} exited with {}", output.status) } else { combined })
    }
}

#[tauri::command]
fn run_build(root: String) -> Result<BuildResult, String> {
    let root = project_root(&root)?;
    let result = if cfg!(target_os = "windows") {
        command_output(&root, "npm.cmd", &["run", "build"])
    } else {
        command_output(&root, "npm", &["run", "build"])
    };
    match result {
        Ok(output) => Ok(BuildResult { ok: true, output }),
        Err(output) => Ok(BuildResult { ok: false, output }),
    }
}

#[tauri::command]
fn publish_post(root: String, path: String, content: String, title: String) -> Result<String, String> {
    let root = project_root(&root)?;
    let post_path = safe_post_path(&root, &path)?;
    fs::write(&post_path, content).map_err(|error| format!("Cannot save post before publishing: {error}"))?;

    let build = run_build(root.to_string_lossy().to_string())?;
    if !build.ok {
        return Err(format!("Build failed. Nothing was pushed.\n{}", build.output));
    }

    let slug = post_path.file_stem().and_then(|value| value.to_str()).unwrap_or("field-note");
    let branch = format!("content/{slug}");
    command_output(&root, "git", &["switch", "-c", &branch])
        .or_else(|_| command_output(&root, "git", &["switch", &branch]))?;
    let relative = post_path.strip_prefix(&root).map_err(|_| "Post is outside the selected project.".to_string())?.to_string_lossy().replace('\\', "/");
    command_output(&root, "git", &["add", "--", &relative])?;
    command_output(&root, "git", &["commit", "-m", &format!("content: publish {title}")])?;
    command_output(&root, "git", &["push", "-u", "origin", &branch])?;
    let pr = command_output(&root, "gh", &["pr", "create", "--fill", "--base", "main"])?;
    Ok(format!("Published branch {branch}. Pull Request created.\n{pr}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_posts, save_post, run_build, publish_post])
        .run(tauri::generate_context!())
        .expect("error while running DanCold Desk");
}
