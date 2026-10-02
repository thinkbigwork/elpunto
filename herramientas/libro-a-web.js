// Convierte el libro en Markdown (libro/) en los JSON que lee la versión web del libro (libro-web/).
// Uso: node herramientas/libro-a-web.js libro salida-web
// Después, Claude sube los JSON a la base de datos del artefacto web (colecciones categories, pages, changelog, meta).
const fs = require('fs'), path = require('path');
const [src, out] = process.argv.slice(2);
const sum = fs.readFileSync(path.join(src, 'SUMMARY.md'), 'utf8');
const back = b => b.replace(/\]\((?:\.\.\/)?CAMBIOS\.md\)/g, '](#registro-de-cambios)').replace(/\]\((?:\.\.\/)?[a-z0-9-]+\/([a-z0-9-]+)\.md\)/g, '](#$1)');
const w = (dir, id, obj) => { fs.mkdirSync(path.join(out, dir), { recursive: true }); fs.writeFileSync(path.join(out, dir, id + '.json'), JSON.stringify(obj)); };
let catOrder = 0, cur = null, n = 0;
const titles = {};
for (const line of sum.split('\n')) {
  let m;
  if ((m = line.match(/^## (.+)/)) && m[1] !== 'Registro') { cur = { title: m[1], order: ++catOrder, k: 0 }; continue; }
  if ((m = line.match(/^\* \[(.+)\]\(([a-z0-9-]+)\/([a-z0-9-]+)\.md\)/)) && cur) {
    const [, title, cat, id] = m;
    if (!cur.id) { cur.id = cat; w('categories', cat, { title: cur.title, order: cur.order }); }
    const md = fs.readFileSync(path.join(src, cat, id + '.md'), 'utf8');
    const mm = md.match(/^# .+\n\n([\s\S]*?)\n\n---\n_Actualizado: (\d{4}-\d{2}-\d{2})_\n?$/);
    if (!mm) throw new Error('formato inesperado en ' + cat + '/' + id + '.md');
    w('pages', id, { title, cat, order: ++cur.k, updated: mm[2], body: back(mm[1]) }); n++;
  }
}
const ch = fs.readFileSync(path.join(src, 'CAMBIOS.md'), 'utf8');
const ver = ch.match(/\*\*([\d.]+)\*\* \((\d{4}-\d{2}-\d{2})\)/);
w('meta', 'site', { version: ver[1], updated: ver[2], project: 'El Punto' });
const secs = ch.split(/\n## /).slice(1);
secs.forEach((s, i) => {
  const [head, ...rest] = s.split('\n');
  const [, version, title] = head.match(/^([\d.]+) · (.+)$/);
  const body = rest.join('\n');
  const date = body.match(/_(\d{4}-\d{2}-\d{2})_/)[1];
  const items = [...body.matchAll(/^- (.+)$/gm)].map(x => x[1]);
  const pages = [...(body.match(/^Páginas: (.+)$/m)?.[1] || '').matchAll(/\[([a-z0-9-]+)\]|(?:^|, )([a-z0-9-]+)(?=,|$)/g)].map(x => x[1] || x[2]);
  const order = secs.length - i;
  w('changelog', 'c' + String(order).padStart(3, '0'), { order, date, version, title, items, pages });
});
console.log(catOrder, 'categorías,', n, 'páginas,', secs.length, 'cambios →', out);
