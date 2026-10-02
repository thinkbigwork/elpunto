// Convierte la semilla JSON del libro web (seed/) en páginas Markdown con índice GitBook.
// Uso único: node herramientas/exportar-libro.js <carpeta-seed> libro
const fs = require('fs'), path = require('path');
const [seed, out] = process.argv.slice(2);
const rd = d => fs.readdirSync(path.join(seed, d)).map(f => ({ id: f.replace('.json', ''), ...JSON.parse(fs.readFileSync(path.join(seed, d, f))) }));
const cats = rd('categories').sort((a, b) => a.order - b.order);
const pages = rd('pages');
const log = rd('changelog').sort((a, b) => b.order - a.order);
const meta = JSON.parse(fs.readFileSync(path.join(seed, 'meta/site.json')));
const where = Object.fromEntries(pages.map(p => [p.id, p.cat]));
const fix = (body, depth) => body.replace(/\]\(#([a-z0-9-]+)\)/g, (m, id) => {
  const up = depth ? '../' : '';
  if (id === 'registro-de-cambios') return `](${up}CAMBIOS.md)`;
  if (!where[id]) { console.warn('enlace sin destino:', id); return m; }
  return `](${up}${where[id]}/${id}.md)`;
});
let sum = `# Índice\n\n* [El Punto](README.md)\n`;
for (const c of cats) {
  fs.mkdirSync(path.join(out, c.id), { recursive: true });
  sum += `\n## ${c.title}\n\n`;
  for (const p of pages.filter(p => p.cat === c.id).sort((a, b) => a.order - b.order)) {
    fs.writeFileSync(path.join(out, c.id, p.id + '.md'), `# ${p.title}\n\n${fix(p.body, 1)}\n\n---\n_Actualizado: ${p.updated}_\n`);
    sum += `* [${p.title}](${c.id}/${p.id}.md)\n`;
  }
}
sum += `\n## Registro\n\n* [Registro de cambios](CAMBIOS.md)\n`;
fs.writeFileSync(path.join(out, 'SUMMARY.md'), sum);
let ch = `# Registro de cambios\n\nVersión actual del libro: **${meta.version}** (${meta.updated}).\n`;
for (const e of log) ch += `\n## ${e.version} · ${e.title}\n\n_${e.date}_\n\n${e.items.map(i => '- ' + i).join('\n')}\n\nPáginas: ${e.pages.map(id => where[id] ? `[${id}](${where[id]}/${id}.md)` : id).join(', ')}\n`;
fs.writeFileSync(path.join(out, 'CAMBIOS.md'), ch);
fs.writeFileSync(path.join(out, 'README.md'), `# Libro de El Punto\n\nDocumento de diseño del juego (GDD), versión **${meta.version}**. Es la fuente de verdad del proyecto: si algo cambia, cambia acá.\n\nEmpezá por el [Resumen](vision/resumen.md), mirá el [índice](SUMMARY.md) o el [registro de cambios](CAMBIOS.md).\n`);
console.log(cats.length, 'categorías,', pages.length, 'páginas,', log.length, 'cambios');
