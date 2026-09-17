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

const reportSubpages = ['pending-invoice', 'upload-invoice-report', 'ai-report'];

function findElement(html, id) {
  const openRe = new RegExp(`<([a-zA-Z][\\w:-]*)\\b[^>]*\\bid=["']${id}["'][^>]*>`, 'i');
  const match = openRe.exec(html);
  if (!match) return null;

  const tag = match[1];
  const start = match.index;
  const openEnd = start + match[0].length;
  const tokenRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  tokenRe.lastIndex = openEnd;

  let depth = 1;
  let token;
  while ((token = tokenRe.exec(html))) {
    const text = token[0];
    if (text.startsWith('</')) depth--;
    else if (!/\/\\s*>$/.test(text)) depth++;

    if (depth === 0) {
      const end = tokenRe.lastIndex;
      return {
        start,
        end,
        tag,
        openEnd,
        content: html.slice(start, end),
        inner: html.slice(openEnd, end - (`</${tag}>`).length)
      };
    }
  }

  throw new Error(`Unclosed <${tag}> for #${id}`);
}

function isHostPresent(html, id) {
  return new RegExp(`class=["'][^"']*\\bpage-module-host\\b[^"']*["'][^>]*data-page-module=["']${id}["']`, 'i').test(html)
    || new RegExp(`data-page-module=["']${id}["'][^>]*class=["'][^"']*\\bpage-module-host\\b`, 'i').test(html);
}

function writeText(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function writeIfMissing(file, content) {
  if (!fs.existsSync(file)) writeText(file, content);
}

const original = fs.readFileSync(indexPath, 'utf8');
let working = original;
const extracted = {};

for (const [id] of Object.entries(pageMap)) {
  if (isHostPresent(working, id)) continue;

  const found = findElement(working, id);
  if (!found) throw new Error(`Required page section #${id} was not found in index.html`);

  extracted[id] = found.inner;
  working = working.slice(0, found.start)
    + `<!-- GSTUI page module: ${id}; loaded by pages/module-loader.js -->\n<div id="${id}" class="page-section page-module-host" data-page-module="${id}"></div>\n`
    + working.slice(found.end);
}

for (const [id, meta] of Object.entries(pageMap)) {
  const dir = path.join(pagesRoot, meta.dir);
  fs.mkdirSync(dir, { recursive: true });

  if (extracted[id] !== undefined) {
    writeText(path.join(dir, meta.html), extracted[id]);
  } else {
    writeIfMissing(path.join(dir, meta.html), `<!-- ${id} page module -->\n`);
  }

  writeIfMissing(
    path.join(dir, meta.css),
    `/* ${id} page-specific styles. Shared theme/layout remains in ../../style.css. */\n`
  );
  writeIfMissing(
    path.join(dir, meta.js),
    `/* ${id} page-specific behavior. Common navigation remains in ../../app.js. */\n`
  );
}

// Keep Report subpages as independent modules.
if (extracted.reports !== undefined) {
  for (const id of reportSubpages) {
    const found = findElement(extracted.reports, id);
    if (!found) continue;

    const dir = path.join(pagesRoot, 'report');
    writeText(path.join(dir, `${id}.html`), found.inner);
    writeIfMissing(path.join(dir, `${id}.css`), `/* Report > ${id} page-specific styles. */\n`);
    writeIfMissing(path.join(dir, `${id}.js`), `/* Report > ${id} page-specific behavior. */\n`);
  }
}

// Ensure module-loader.js is included once.
if (!/pages\/module-loader\.js/.test(working)) {
  const script = '<script src="pages/module-loader.js"></script>\n';
  const appScript = working.search(/<script[^>]+src=["'][^"']*app\.js[^"']*["'][^>]*><\/script>/i);

  if (appScript >= 0) {
    const end = working.indexOf('>', appScript) + 1;
    working = working.slice(0, end) + '\n' + script + working.slice(end);
  } else {
    working = working.replace(/<\/body>/i, script + '</body>');
  }
}

if (working !== original) writeText(indexPath, working);
console.log('GSTUI modular page extraction completed successfully.');
