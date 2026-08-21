import { invoke } from '@tauri-apps/api/core';
import { marked } from 'marked';
import './styles.css';

type CollectionName = 'blog' | 'writing';

type PostFile = {
  path: string;
  collection: CollectionName;
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate: string;
  draft: boolean;
  kind: string;
  featured: boolean;
  tags: string[];
  heroImage: string;
  library: string[];
  body: string;
};

type BuildResult = { ok: boolean; output: string };

const collectionLabels: Record<CollectionName, string> = {
  blog: 'The Chronicler',
  writing: 'The Storykeeper',
};

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('DanCold Desk could not mount.');

app.innerHTML = [
  '<header class="topbar">',
  '  <div><p class="eyebrow">DANCOLD // LOCAL ARCHIVE DESK</p><h1>Write the next page.</h1></div>',
  '  <div class="topbar-actions"><button class="button quiet" data-action="refresh">Reload files</button><button class="button" data-action="new">New post</button></div>',
  '</header>',
  '<main class="workspace">',
  '  <aside class="sidebar panel">',
  '    <label class="field-label" for="project-root">Astro project folder</label>',
  '    <div class="root-row"><input id="project-root" placeholder="D:\\\\DanColdCafe" spellcheck="false" /><button class="icon-button" data-action="refresh" title="Load project">↻</button></div>',
  '    <p class="helper">The app only reads and writes inside the selected Astro project.</p>',
  '    <div class="collection-switch" role="tablist" aria-label="Writing collection">',
  '      <button class="collection-tab active" data-collection="blog" role="tab" aria-selected="true">Chronicler</button>',
  '      <button class="collection-tab" data-collection="writing" role="tab" aria-selected="false">Storykeeper</button>',
  '    </div>',
  '    <div class="sidebar-heading"><span data-collection-label>The Chronicler</span><span data-post-count>0</span></div>',
  '    <nav class="post-list" aria-label="Posts" data-post-list></nav>',
  '  </aside>',
  '  <section class="editor panel">',
  '    <div class="editor-toolbar">',
  '      <div><p class="eyebrow">MARKDOWN EDITOR</p><p class="path" data-current-path>No file selected</p></div>',
  '      <div class="toolbar-actions"><button class="button quiet" data-action="build">Check build</button><button class="button" data-action="save">Save draft</button><button class="button publish" data-action="publish">Publish via PR</button></div>',
  '    </div>',
  '    <div class="metadata-grid">',
  '      <label class="field"><span>Title</span><input data-field="title" /></label>',
  '      <label class="field"><span>Slug / filename</span><input data-field="slug" spellcheck="false" /></label>',
  '      <label class="field wide"><span>Description</span><textarea data-field="description" rows="2"></textarea></label>',
  '      <label class="field" data-only="writing"><span>Type</span><select data-field="kind"><option value="poem">Poem</option><option value="story">Story</option><option value="fragment">Fragment</option><option value="note">Note</option></select></label>',
  '      <label class="field" data-only="writing"><span>Tags (comma-separated)</span><input data-field="tags" placeholder="night, memory" /></label>',
  '      <label class="check-field" data-only="writing"><input data-field="featured" type="checkbox" /> Feature near the lamp</label>',
  '      <label class="field" data-only="blog"><span>Updated date</span><input data-field="updatedDate" type="date" /></label>',
  '      <label class="field" data-only="blog"><span>Hero image path</span><input data-field="heroImage" placeholder="../../assets/..." /></label>',
  '      <label class="field wide" data-only="blog"><span>Archivist references (comma-separated IDs)</span><input data-field="library" placeholder="sketchbook, motion-room" /></label>',
  '      <label class="field"><span>Publication date</span><input data-field="pubDate" type="date" /></label>',
  '      <label class="check-field"><input data-field="draft" type="checkbox" /> Keep as draft</label>',
  '    </div>',
  '    <div class="split-editor"><label class="markdown-pane"><span class="pane-label">Markdown</span><textarea data-field="body" spellcheck="true" placeholder="Start writing in Markdown..."></textarea></label><section class="preview-pane" aria-label="Markdown preview"><span class="pane-label">Preview</span><article data-preview class="prose"><p class="empty-preview">Your preview will appear here.</p></article></section></div>',
  '  </section>',
  '</main>',
  '<footer class="statusbar"><span data-status>Ready. Choose your project folder to begin.</span><span>local credentials · no public admin route</span></footer>',
].join('\n');

const rootInput = document.querySelector<HTMLInputElement>('#project-root')!;
const postList = document.querySelector<HTMLElement>('[data-post-list]')!;
const status = document.querySelector<HTMLElement>('[data-status]')!;
const preview = document.querySelector<HTMLElement>('[data-preview]')!;
const currentPath = document.querySelector<HTMLElement>('[data-current-path]')!;
const count = document.querySelector<HTMLElement>('[data-post-count]')!;
const collectionLabel = document.querySelector<HTMLElement>('[data-collection-label]')!;
const fields = {
  title: document.querySelector<HTMLInputElement>('[data-field="title"]')!,
  slug: document.querySelector<HTMLInputElement>('[data-field="slug"]')!,
  description: document.querySelector<HTMLTextAreaElement>('[data-field="description"]')!,
  pubDate: document.querySelector<HTMLInputElement>('[data-field="pubDate"]')!,
  updatedDate: document.querySelector<HTMLInputElement>('[data-field="updatedDate"]')!,
  heroImage: document.querySelector<HTMLInputElement>('[data-field="heroImage"]')!,
  draft: document.querySelector<HTMLInputElement>('[data-field="draft"]')!,
  kind: document.querySelector<HTMLSelectElement>('[data-field="kind"]')!,
  featured: document.querySelector<HTMLInputElement>('[data-field="featured"]')!,
  tags: document.querySelector<HTMLInputElement>('[data-field="tags"]')!,
  library: document.querySelector<HTMLInputElement>('[data-field="library"]')!,
  body: document.querySelector<HTMLTextAreaElement>('[data-field="body"]')!,
};

let collection: CollectionName = localStorage.getItem('dancold-collection') === 'writing' ? 'writing' : 'blog';
let posts: PostFile[] = [];
let activePath = '';

const setStatus = (message: string, tone: 'normal' | 'error' | 'success' = 'normal') => {
  status.textContent = message;
  status.dataset.tone = tone;
};

const projectRoot = () => rootInput.value.trim();
const yamlString = (value: string) => "'" + value.replaceAll("'", "''") + "'";
const yamlList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean).map(yamlString);

const composeMarkdown = () => {
  const lines = [
    '---',
    'title: ' + yamlString(fields.title.value.trim() || 'Untitled page'),
    'description: ' + yamlString(fields.description.value.trim() || 'A new page from the DanCold archive.'),
  ];

  if (collection === 'writing') {
    lines.push(
      'kind: ' + yamlString(fields.kind.value || 'note'),
      'pubDate: ' + yamlString(fields.pubDate.value || new Date().toISOString().slice(0, 10)),
      'draft: ' + fields.draft.checked,
      'featured: ' + fields.featured.checked,
      'tags: [' + yamlList(fields.tags.value).join(', ') + ']',
    );
  } else {
    lines.push('pubDate: ' + yamlString(fields.pubDate.value || new Date().toISOString().slice(0, 10)));
    if (fields.updatedDate.value) lines.push('updatedDate: ' + yamlString(fields.updatedDate.value));
    lines.push('draft: ' + fields.draft.checked);
    if (fields.heroImage.value.trim()) lines.push('heroImage: ' + yamlString(fields.heroImage.value.trim()));
    lines.push('library: [' + yamlList(fields.library.value).join(', ') + ']');
  }

  lines.push('---', '', fields.body.value.trim(), '');
  return lines.join('\n');
};

const renderPreview = async () => {
  const markdown = fields.body.value.trim();
  preview.innerHTML = markdown ? await marked.parse(markdown) : '<p class="empty-preview">Your preview will appear here.</p>';
};

const fillEditor = (post: PostFile) => {
  activePath = post.path;
  currentPath.textContent = post.path;
  fields.title.value = post.title;
  fields.slug.value = post.slug;
  fields.description.value = post.description;
  fields.pubDate.value = post.pubDate;
  fields.updatedDate.value = post.updatedDate;
  fields.heroImage.value = post.heroImage;
  fields.draft.checked = post.draft;
  fields.kind.value = post.kind || 'note';
  fields.featured.checked = post.featured;
  fields.tags.value = post.tags.join(', ');
  fields.library.value = post.library.join(', ');
  fields.body.value = post.body;
  void renderPreview();
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character] ?? character));

const renderPostList = () => {
  count.textContent = String(posts.length).padStart(2, '0');
  postList.innerHTML = posts.length
    ? posts.map((post) => '<button class="post-item ' + (post.path === activePath ? 'active' : '') + '" data-path="' + escapeHtml(post.path) + '"><span>' + (post.draft ? 'DRAFT' : 'FILED') + ' · ' + escapeHtml(post.kind || collectionLabels[post.collection]) + '</span><strong>' + escapeHtml(post.title || post.slug) + '</strong><small>' + escapeHtml(post.pubDate || 'undated') + '</small></button>').join('')
    : '<p class="empty-list">No Markdown files loaded yet.</p>';
};

const syncCollectionUI = () => {
  collectionLabel.textContent = collectionLabels[collection];
  document.querySelectorAll<HTMLButtonElement>('[data-collection]').forEach((button) => {
    const selected = button.dataset.collection === collection;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  document.querySelectorAll<HTMLElement>('[data-only]').forEach((field) => {
    field.hidden = field.dataset.only !== collection;
  });
};

const loadPosts = async () => {
  if (!projectRoot()) {
    setStatus('Add the local Astro project folder first.', 'error');
    return;
  }

  try {
    posts = await invoke<PostFile[]>('list_posts', { root: projectRoot(), collection });
    renderPostList();
    setStatus(posts.length + ' ' + collectionLabels[collection] + ' page' + (posts.length === 1 ? '' : 's') + ' loaded.', 'success');
    if (posts.length > 0 && (!activePath || !posts.some((post) => post.path === activePath))) fillEditor(posts[0]);
  } catch (error) {
    setStatus(String(error), 'error');
  }
};

const setCollection = (nextCollection: CollectionName) => {
  if (collection === nextCollection) return;
  collection = nextCollection;
  localStorage.setItem('dancold-collection', collection);
  activePath = '';
  currentPath.textContent = 'No file selected';
  syncCollectionUI();
  renderPostList();
  void loadPosts();
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

  const path = activePath || 'src/content/' + collection + '/' + slug + '.md';
  const content = composeMarkdown();

  try {
    if (shouldPublish) {
      const result = await invoke<string>('publish_post', {
        root: projectRoot(),
        path,
        content,
        title: fields.title.value.trim() || slug,
        collection,
      });
      setStatus(result, 'success');
    } else {
      await invoke('save_post', { root: projectRoot(), path, content, collection });
      activePath = path;
      currentPath.textContent = path;
      setStatus('Saved ' + path + '.', 'success');
      await loadPosts();
    }
  } catch (error) {
    setStatus(String(error), 'error');
  }
};

const newPost = () => {
  activePath = '';
  currentPath.textContent = 'New unsaved page';
  fields.title.value = '';
  fields.slug.value = collection === 'writing' ? 'new-storykeeper-page' : 'new-field-note';
  fields.description.value = '';
  fields.pubDate.value = new Date().toISOString().slice(0, 10);
  fields.updatedDate.value = '';
  fields.heroImage.value = '';
  fields.draft.checked = true;
  fields.kind.value = 'poem';
  fields.featured.checked = false;
  fields.tags.value = '';
  fields.library.value = '';
  fields.body.value = '';
  renderPostList();
  void renderPreview();
  setStatus('New ' + collectionLabels[collection] + ' page ready. Write only what you want to keep.');
};

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
  const collectionButton = target.closest<HTMLButtonElement>('[data-collection]');
  const postButton = target.closest<HTMLButtonElement>('[data-path]');

  if (collectionButton && (collectionButton.dataset.collection === 'blog' || collectionButton.dataset.collection === 'writing')) {
    setCollection(collectionButton.dataset.collection);
    return;
  }

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
rootInput.addEventListener('change', () => {
  localStorage.setItem('dancold-project-root', projectRoot());
  activePath = '';
  void loadPosts();
});
syncCollectionUI();
renderPostList();
if (projectRoot()) void loadPosts();
