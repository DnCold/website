import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import './styles.css';

type PostFile = {
  path: string;
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  draft: boolean;
  library: string[];
  body: string;
};

type BuildResult = {
  ok: boolean;
  output: string;
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('DanCold Desk could not mount.');

app.innerHTML = `
  <header class="topbar">
    <div>
      <p class="eyebrow">DANCOLD // LOCAL ARCHIVE DESK</p>
      <h1>Write the next page.</h1>
    </div>
    <div class="topbar-actions">
      <button class="button quiet" data-action="refresh">Reload files</button>
      <button class="button" data-action="new">New post</button>
    </div>
  </header>
  <main class="workspace">
    <aside class="sidebar panel">
      <label class="field-label" for="project-root">Astro project folder</label>
      <div class="root-row">
        <input id="project-root" placeholder="C:\\path\\to\\website" spellcheck="false" />
        <button class="icon-button" data-action="refresh" title="Load project">↻</button>
      </div>
      <p class="helper">The app only reads and writes inside this folder.</p>
      <div class="sidebar-heading">
        <span>Chronicler posts</span>
        <span data-post-count>0</span>
      </div>
      <nav class="post-list" aria-label="Posts" data-post-list></nav>
    </aside>
    <section class="editor panel">
      <div class="editor-toolbar">
        <div>
          <p class="eyebrow">MARKDOWN EDITOR</p>
          <p class="path" data-current-path>No file selected</p>
        </div>
        <div class="toolbar-actions">
          <button class="button quiet" data-action="build">Check build</button>
          <button class="button" data-action="save">Save draft</button>
          <button class="button publish" data-action="publish">Publish via PR</button>
        </div>
      </div>
      <div class="metadata-grid">
        <label class="field"><span>Title</span><input data-field="title" /></label>
        <label class="field"><span>Slug / filename</span><input data-field="slug" spellcheck="false" /></label>
        <label class="field wide"><span>Description</span><textarea data-field="description" rows="2"></textarea></label>
        <label class="field wide"><span>Archivist references (comma-separated IDs)</span><input data-field="library" placeholder="sketchbook, motion-room" /></label>
        <label class="field"><span>Publication date</span><input data-field="pubDate" type="date" /></label>
        <label class="check-field"><input data-field="draft" type="checkbox" /> Keep as draft</label>
      </div>
      <div class="split-editor">
        <label class="markdown-pane">
          <span class="pane-label">Markdown</span>
          <textarea data-field="body" spellcheck="true" placeholder="Start writing in Markdown..."></textarea>
        </label>
        <section class="preview-pane" aria-label="Markdown preview">
          <span class="pane-label">Preview</span>
          <article data-preview class="prose"><p class="empty-preview">Your preview will appear here.</p></article>
        </section>
      </div>
    </section>
  </main>
  <footer class="statusbar"><span data-status>Ready. Choose your project folder to begin.</span><span>local credentials · no public admin route</span></footer>
`;

const rootInput = document.querySelector<HTMLInputElement>('#project-root')!;
const postList = document.querySelector<HTMLElement>('[data-post-list]')!;
const status = document.querySelector<HTMLElement>('[data-status]')!;
const preview = document.querySelector<HTMLElement>('[data-preview]')!;
const currentPath = document.querySelector<HTMLElement>('[data-current-path]')!;
const count = document.querySelector<HTMLElement>('[data-post-count]')!;
const fields = {
  title: document.querySelector<HTMLInputElement>('[data-field="title"]')!,
  slug: document.querySelector<HTMLInputElement>('[data-field="slug"]')!,
  description: document.querySelector<HTMLTextAreaElement>('[data-field="description"]')!,
  pubDate: document.querySelector<HTMLInputElement>('[data-field="pubDate"]')!,
  draft: document.querySelector<HTMLInputElement>('[data-field="draft"]')!,
  library: document.querySelector<HTMLInputElement>('[data-field="library"]')!,
  body: document.querySelector<HTMLTextAreaElement>('[data-field="body"]')!,
};

let posts: PostFile[] = [];
let activePath = '';

const setStatus = (message: string, tone: 'normal' | 'error' | 'success' = 'normal') => {
  status.textContent = message;
  status.dataset.tone = tone;
};

const projectRoot = () => rootInput.value.trim();

const yamlString = (value: string) => `'${value.replaceAll("'", "''")}'`;

const composeMarkdown = () => {
  const libraryIds = fields.library.value.split(',').map((id) => id.trim()).filter(Boolean);
  const libraryLine = `library: [${libraryIds.map(yamlString).join(', ')}]`;
  return [
    '---',
    `title: ${yamlString(fields.title.value.trim() || 'Untitled field note')}`,
    `description: ${yamlString(fields.description.value.trim() || 'A new field note from the road.')}`,
    `pubDate: ${yamlString(fields.pubDate.value || new Date().toISOString().slice(0, 10))}`,
    `draft: ${fields.draft.checked}`,
    libraryLine,
    '---',
    '',
    fields.body.value.trim(),
    '',
  ].join('\n');
};

const renderPreview = async () => {
  const markdown = fields.body.value.trim();
  preview.innerHTML = markdown
    ? await marked.parse(markdown)
    : '<p class="empty-preview">Your preview will appear here.</p>';
};

const fillEditor = (post: PostFile) => {
  activePath = post.path;
  currentPath.textContent = post.path;
  fields.title.value = post.title;
  fields.slug.value = post.slug;
  fields.description.value = post.description;
  fields.pubDate.value = post.pubDate;
  fields.draft.checked = post.draft;
  fields.library.value = post.library.join(', ');
  fields.body.value = post.body;
  void renderPreview();
};

const renderPostList = () => {
  count.textContent = String(posts.length).padStart(2, '0');
  postList.innerHTML = posts.length
    ? posts.map((post) => `
      <button class="post-item ${post.path === activePath ? 'active' : ''}" data-path="${post.path}">
        <span>${post.draft ? 'DRAFT' : 'FILED'}</span>
        <strong>${post.title || post.slug}</strong>
        <small>${post.pubDate || 'undated'}</small>
      </button>
    `).join('')
    : '<p class="empty-list">No Markdown files loaded yet.</p>';
};

const loadPosts = async () => {
  if (!projectRoot()) {
    setStatus('Add the local Astro project folder first.', 'error');
    return;
  }

  try {
    posts = await invoke<PostFile[]>('list_posts', { root: projectRoot() });
    renderPostList();
    setStatus(`${posts.length} post${posts.length === 1 ? '' : 's'} loaded.`, 'success');
    if (posts[0] && !activePath) fillEditor(posts[0]);
  } catch (error) {
    setStatus(String(error), 'error');
  }
};

const save = async (shouldPublish = false) => {
  if (!projectRoot()) {
    setStatus('Add the local Astro project folder first.', 'error');
    return;
  }

  const slug = fields.slug.value.trim().replace(/[^a-z0-9-]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  if (!slug) {
    setStatus('Give the post a slug before saving.', 'error');
    return;
  }

  const path = activePath || `src/content/blog/${slug}.md`;
  const content = composeMarkdown();

  try {
    if (shouldPublish) {
      const result = await invoke<string>('publish_post', {
        root: projectRoot(),
        path,
        content,
        title: fields.title.value.trim() || slug,
      });
      setStatus(result, 'success');
    } else {
      await invoke('save_post', { root: projectRoot(), path, content });
      activePath = path;
      currentPath.textContent = path;
      setStatus(`Saved ${path}.`, 'success');
      await loadPosts();
    }
  } catch (error) {
    setStatus(String(error), 'error');
  }
};

const newPost = () => {
  activePath = '';
  currentPath.textContent = 'New unsaved note';
  fields.title.value = '';
  fields.slug.value = 'new-field-note';
  fields.description.value = '';
  fields.pubDate.value = new Date().toISOString().slice(0, 10);
  fields.draft.checked = true;
  fields.library.value = '';
  fields.body.value = '# New field note\n\nWrite what you found beyond the map.\n';
  renderPostList();
  void renderPreview();
  setStatus('New note ready. Save it when you are happy with the draft.');
};

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
  const postButton = target.closest<HTMLButtonElement>('[data-path]');

  if (postButton) {
    const post = posts.find((candidate) => candidate.path === postButton.dataset.path);
    if (post) {
      fillEditor(post);
      renderPostList();
    }
  }

  if (action === 'refresh') void loadPosts();
  if (action === 'new') newPost();
  if (action === 'save') void save();
  if (action === 'publish') void save(true);
  if (action === 'build') {
    if (!projectRoot()) {
      setStatus('Add the local Astro project folder first.', 'error');
      return;
    }
    setStatus('Running npm run build…');
    void invoke<BuildResult>('run_build', { root: projectRoot() }).then((result) => {
      setStatus(result.ok ? 'Astro build passed.' : result.output, result.ok ? 'success' : 'error');
    }).catch((error) => setStatus(String(error), 'error'));
  }
});

fields.body.addEventListener('input', () => void renderPreview());
rootInput.value = localStorage.getItem('dancold-project-root') ?? '';
rootInput.addEventListener('change', () => localStorage.setItem('dancold-project-root', projectRoot()));
renderPostList();
