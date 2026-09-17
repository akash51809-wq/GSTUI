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
      return { start, end: tokenRe.lastIndex, tag, content: html.slice(start, tokenRe.lastIndex) };
    }
  }
  throw new Error(`Unclosed <${tag}> for #${id}`);
}

function innerMarkup(element) {
  const first = element.content.indexOf('>');
  const last = element.content.lastIndexOf('</');
  return first >= 0 && last > first ? element.content.slice(first + 1, last) : element.content;
}

function writeIfMissing(file, content) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, content, 'utf8');
}

const original = fs.readFileSync(indexPath, 'utf8');
let working = original;
const extracted = {};

for (const [id, meta] of Object.entries(pageMap)) {
  const found = findElement(working, id);
  if (!found) throw new Error(`Required page section #${id} was not found in index.html`);
  extracted[id] = found.content;
  working = working.slice(0, found.start) + `<!-- GSTUI page module: ${id}; loaded by pages/module-loader.js -->\n<div id="${id}" class="page-section page-module-host" data-page-module="${id}"></div>\n` + working.slice(found.end);
}

for (const [id, meta] of Object.entries(pageMap)) {
  const dir = path.join(pagesRoot, meta.dir);
  fs.mkdirSync(dir, { recursive: true });
  const existingHtml = path.join(dir, meta.html);
  if (!fs.existsSync(existingHtml)) {
    fs.writeFileSync(existingHtml, extracted[id], 'utf8');
  } else {
    const existing = fs.readFileSync(existingHtml, 'utf8').trim();
    if (!existing || existing.includes('module placeholder')) fs.writeFileSync(existingHtml, extracted[id], 'utf8');
  }
  writeIfMissing(path.join(dir, meta.css), `/* ${id} page-specific styles. Keep shared theme/layout in ../../style.css. */\n`);
  writeIfMissing(path.join(dir, meta.js), `/* ${id} page-specific behavior. Keep common navigation in ../../app.js. */\n(function(){\n  window.GSTUIPageModules = window.GSTUIPageModules || {};\n  window.GSTUIPageModules['${id}'] = window.GSTUIPageModules['${id}'] || {};\n})();\n`);
}

// Split the three Report subpages when they exist inside the extracted report module.
const report = extracted.reports;
for (const id of ['pending-invoice', 'upload-invoice-report', 'ai-report']) {
  const found = findElement(report, id);
  if (!found) continue;
  const dir = path.join(pagesRoot, 'report');
  fs.writeFileSync(path.join(dir, `${id}.html`), found.content, 'utf8');
  writeIfMissing(path.join(dir, `${id}.css`), `/* Report > ${id} page-specific styles. */\n`);
  writeIfMissing(path.join(dir, `${id}.js`), `/* Report > ${id} page-specific behavior. */\n`);
}

// Do not touch the existing visual CSS/JS during this migration. The loader restores
// the exact extracted markup into the same IDs/classes before app.js navigation runs.
fs.writeFileSync(indexPath, working, 'utf8');
console.log('GSTUI modular page extraction completed.');
