// Prueba de regresión del juego. Uso: npm test
// Crea una copia de prueba del juego con un gancho window.__t (nunca se agrega al juego publicado)
// y recorre: orden aleatorio de figuras, zapatillas de ida y vuelta, encierro de cazadores,
// salida del laberinto y final con zoom. Termina con código 1 si algo falla.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..');
const TMP = path.join(__dirname, '.tmp'); fs.mkdirSync(TMP, { recursive: true });
const HOOK = ' window.__t = { P, city, lab, cajas, inv, powers, stats, order, get hunters(){return hunters}, get cur(){return cur}, get won(){return won} };';
const src = fs.readFileSync(path.join(RAIZ, 'juego/el-punto.html'), 'utf8');
if (!src.includes('cv.focus();')) throw new Error('No encuentro dónde enganchar la prueba (cv.focus();)');
const PRUEBA = path.join(TMP, 'juego-prueba.html');
fs.writeFileSync(PRUEBA, src.split('cv.focus();').join('cv.focus();' + HOOK));
const URL = 'file://' + PRUEBA;
const fallas = []; const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fallas.push(msg); };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const errs = []; const K = { R: 'ArrowRight', L: 'ArrowLeft', U: 'ArrowUp', D: 'ArrowDown' };

  console.log('Orden de las figuras');
  const orders = new Set();
  for (let i = 0; i < 5; i++) { const q = await b.newPage(); await q.goto(URL); await q.waitForTimeout(150); orders.add((await q.evaluate(() => __t.order)).join(',')); await q.close(); }
  ok(orders.size > 1, `cambia entre partidas (${orders.size} órdenes distintos en 5)`);

  const p = await b.newPage({ viewport: { width: 900, height: 600 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL); await p.waitForTimeout(300); await p.keyboard.press('Space'); await p.waitForTimeout(300);
  const ev = (f, a) => p.evaluate(f, a);
  const go = async (seq, w = 130) => { for (const c of seq) { await p.keyboard.press(K[c]); await p.waitForTimeout(w); } };
  const tp = (x, y) => ev(([x, y]) => { __t.P.x = x; __t.P.y = y }, [x, y]);
  const find = ch => ev(ch => { const o = []; __t.city.grid.forEach((r, y) => r.forEach((c, x) => { if (c === ch) o.push([x, y]) })); return o }, ch);

  console.log('Ciudad');
  ok(await ev(() => __t.city.grid[0].length === 61 && __t.city.grid.length === 48), 'mide 61 × 48');

  console.log('Zapatillas');
  const [fx, fy] = (await find('>'))[0]; await tp(fx, fy - 1); await go('D');
  ok(await ev(() => __t.powers.has('zapatillas')), 'la baldosa > acelera');
  const [sx, sy] = (await find('<'))[0]; await tp(sx, sy - 1); await go('D');
  ok(!(await ev(() => __t.powers.has('zapatillas'))), 'la baldosa < vuelve a velocidad normal');
  ok((await find('>')).length === 1 && (await find('<')).length === 1, 'las dos baldosas siguen en su lugar');

  console.log('Laberinto y cazadores');
  await ev(() => { [...__t.city.doors.values()].find(d => d.kind === 'grieta').open = true });
  const [gx, gy] = await ev(() => { const d = [...__t.city.doors.values()].find(d => d.kind === 'grieta'); return [d.x, d.y] });
  await tp(gx, gy + 1); await go('U'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name) === 'laberinto', 'se entra por la grieta');
  await tp(20, 8); await go('D'); await go('D');
  ok(await ev(() => __t.lab.boxes.some(b => b.x === 20 && b.y === 11)), 'el bloque baja de (20,10) a (20,11) y sella la guarida');
  await tp(19, 14); await go('D'); await p.waitForTimeout(3000);
  ok(await ev(() => __t.stats.trapped) === 2, 'los dos cazadores quedan encerrados');
  await p.waitForTimeout(400); await tp(2, 1); await go('L'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name) !== 'laberinto', 'se puede salir del laberinto');
  ok(await ev(([x, y]) => __t.P.x === x && __t.P.y === y, [gx, gy + 1]), 'al salir se aparece junto a la grieta');

  console.log('Final');
  await ev(() => { __t.city.doors.forEach(d => { if (d.kind === 'reja' || d.kind === 'vitrina') d.open = true }) });
  const goal = await ev(() => [__t.city.goal.x, __t.city.goal.y]); await tp(goal[0] - 1, goal[1]); await go('R'); await p.waitForTimeout(6500);
  ok(await ev(() => __t.won), 'se llega a la meta');
  await p.screenshot({ path: path.join(TMP, 'final.png') });

  ok(errs.length === 0, 'sin errores en la consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
  console.log(fallas.length ? `\n${fallas.length} falla(s).` : '\nTodo bien.');
  process.exit(fallas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
