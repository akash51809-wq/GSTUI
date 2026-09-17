const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const pagesRoot = path.join(root, 'pages');

const pageMap = {
  dashboard: { dir: 'dashboard', html: 'dashboard.html', css: 'dashboard.css', js: 'dashboard.js' },
  upload: { dir: 'upload', html: 'upload.html', css: 'upload.css', js: 'upload.js' },
  reports: { dir: 'report', html: 'report.html', css: 'report.css', js: 'report.js' },
  parties: { dir: 'parties', html: 'parties.html', css: 'parties.css', js: 'parties.js' },
  settings: { dir: 'settings', html: 'settings.html', css: 'settings.css', js: 'settings.js' }
};

function findElement(html, id) {
  const openRe = new RegExp(`<([a-zA-Z][\\w:-]*)\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
  const m = openRe.exec(html);
  if (!m) return null;

  const tag = m[1];
  const start = m.index;
  const openEnd = start + m[0].length;
  const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tokenRe.lastIndex = openEnd;

  let depth = 1;
  let token;
  while ((token = tokenRe.exec(html))) {
    const text = token[0];
    if (/^<\\//.test(text)) depth--;
    else if (!/\\/\\s*>$/.test(text)) depth++;
    if (depth === 0) {
      return {
        start,
        end: tokenRe.lastIndex,
        tag,
        content: html.slice(start, tokenRe.lastIndex)
      };
    }
  }

  throw new Error(`Unclosed <${tag}> for #${id}`);
}

function writeIfMissing(file, content) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, content, 'utf8');
}

const original = fs.readFileSync(indexPath, 'utf8');
let working = original;
const extracted = {};

for (const [id] of Object.entries(pageMap)) {
  const found = findElement(working, id);
  if (!found) throw new Error(`Required page section #${id} was not found in index.html`);

  extracted[id] = found.content;
  working = working.slice(0, found.start)
    + `<!-- GSTUI page module: ${id}; loaded by pages/module-loader.js -->\\n<div id="${id}" class="page-section page-module-host" data-page-module="${id}"></div>\\n`
    + working.slice(found.end);
}

for (const [id, meta] of Object.entries(pageMap)) {
  const dir = path.join(pagesRoot, meta.dir);
  fs.mkdirSync(dir, { recursive: true });

  const htmlFile = path.join(dir, meta.html);
  if (!fs.existsSync(htmlFile) || fs.readFileSync(htmlFile, 'utf8').includes('module placeholder')) {
    fs.writeFileSync(htmlFile, extracted[id], 'utf8');
  }

  writeIfMissing(
    path.join(dir, meta.css),
    `/* ${id} page-specific styles. Shared theme/layout remains in ../../style.css. */\\n`
  );
  writeIfMissing(
    path.join(dir, meta.js),
    `/* ${id} page-specific behavior. Common navigation remains in ../../app.js. */\\n`
  );
}

// Keep Report subpages as independent modules too.
for (const id of ['pending-invoice', 'upload-invoice-report', 'ai-report']) {
  const found = findElement(extracted.reports, id);
  if (!found) continue;

  const dir = path.join(pagesRoot, 'report');
  const htmlFile = path.join(dir, `${id}.html`);
  if (!fs.existsSync(htmlFile) || fs.readFileSync(htmlFile, 'utf8').includes('module placeholder')) {
    fs.writeFileSync(htmlFile, found.content, 'utf8');
  }

  writeIfMissing(path.join(dir, `${id}.css`), `/* Report > ${id} page-specific styles. */\\n`);
  writeIfMissing(path.join(dir, `${id}.js`), `/* Report > ${id} page-specific behavior. */\\n`);
}

// Ensure module-loader.js is included once.
if (!/pages\\/module-loader\\.js/.test(working)) {
  const script = '<script src="pages/module-loader.js"></script>\\n';
  const appScript = working.search(/<script[^>]+src=["'][^"']*app\\.js[^"']*["'][^>]*><\\/script>/i);

  if (appScript >= 0) {
    const end = working.indexOf('>', appScript) + 1;
    working = working.slice(0, end) + '\\n' + script + working.slice(end);
  } else {
    working = working.replace(/<\\/body>/i, script + '</body>');
  }
}

fs.writeFileSync(indexPath, working, 'utf8');
console.log('GSTUI modular page extraction completed successfully.');
