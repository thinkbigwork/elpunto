// Prueba de regresión del juego. Uso: npm test
// Crea una copia de prueba del juego con un gancho window.__t (nunca se agrega al juego publicado)
// y recorre: orden aleatorio de figuras, control de consola, portones del barrio central, el nivel 2 (galpón, sótano,
// trampas y tobogán), el progreso guardado, zapatillas de ida y vuelta, encierro de cazadores,
// salida del laberinto y final con zoom. Termina con código 1 si algo falla.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..');
const TMP = path.join(__dirname, '.tmp'); fs.mkdirSync(TMP, { recursive: true });
const HOOK = ' window.__t = { P, city, lab, cajas, galpon, sotano, inv, powers, stats, order, get hunters(){return hunters}, get cur(){return cur}, get won(){return won}, get nivelGanado(){return nivelGanado} };';
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

  console.log('Control de consola');
  {
    const q = await b.newPage();
    // un control falso con la distribución estándar: 17 botones y 4 ejes
    await q.addInitScript(() => {
      window.__pad = { connected: true, index: 0, mapping: 'standard', buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] };
      navigator.getGamepads = () => [window.__pad];
    });
    q.on('pageerror', e => errs.push(e.message));
    await q.goto(URL); await q.waitForTimeout(200);
    const pos = () => q.evaluate(() => [__t.P.x, __t.P.y]);
    const btn = (i, v) => q.evaluate(([i, v]) => { __pad.buttons[i].pressed = v; __pad.buttons[i].value = v ? 1 : 0; }, [i, v]);
    const p0 = await pos();
    await btn(15, true); await q.waitForTimeout(300);
    ok((await pos()).join() === p0.join(), 'dormido, la cruceta no mueve');
    await btn(15, false); await btn(0, true); await q.waitForTimeout(200); await btn(0, false); await q.waitForTimeout(100);
    ok((await pos()).join() === p0.join(), 'un botón despierta sin mover');
    await btn(15, true); await q.waitForTimeout(400); await btn(15, false);
    const p1 = await pos();
    ok(p1[0] > p0[0] && p1[1] === p0[1], `la cruceta mueve a la derecha (${p0} → ${p1})`);
    await q.evaluate(() => { __pad.axes[0] = -0.9; }); await q.waitForTimeout(250); await q.evaluate(() => { __pad.axes[0] = 0; });
    const p2 = await pos();
    ok(p2[0] < p1[0] && p2[1] === p1[1], `la palanca izquierda mueve a la izquierda (${p1} → ${p2})`);
    await q.close();
  }

  const p = await b.newPage({ viewport: { width: 900, height: 600 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL); await p.waitForTimeout(300); await p.keyboard.press('Space'); await p.waitForTimeout(300);
  const ev = (f, a) => p.evaluate(f, a);
  const go = async (seq, w = 130) => { for (const c of seq) { await p.keyboard.press(K[c]); await p.waitForTimeout(w); } };
  const tp = (x, y) => ev(([x, y]) => { __t.P.x = x; __t.P.y = y }, [x, y]);
  const find = ch => ev(ch => { const o = []; __t.city.grid.forEach((r, y) => r.forEach((c, x) => { if (c === ch) o.push([x, y]) })); return o }, ch);

  console.log('Ciudad');
  ok(await ev(() => __t.city.grid[0].length === 61 && __t.city.grid.length === 48), 'mide 61 × 48');

  console.log('Barrio central');
  const st = await ev(() => [__t.city.start.x, __t.city.start.y]);
  ok(Math.abs(st[0] - 30) <= 6 && Math.abs(st[1] - 24) <= 4, `el inicio está en el medio del mapa (${st})`);
  const [nx, ny] = await ev(() => { const d = [...__t.city.doors.values()].filter(d => d.kind === 'porton').sort((a, b) => a.y - b.y)[0]; return [d.x, d.y]; });
  await tp(nx, ny + 1); await go('U');
  ok(await ev(() => __t.P.y) === ny + 1, 'sin el libro, el portón norte no deja pasar');
  await ev(() => __t.powers.add('libro'));
  await tp(nx + 1, ny + 1); await go('L'); await go('U'); await go('U');
  ok(await ev(() => __t.P.y) === ny - 1, 'con el libro, el portón se abre al llegar al lado');
  await ev(() => __t.powers.delete('libro'));

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

  console.log('Nivel 2: el galpón');
  const nivel = () => ev(() => (JSON.parse(localStorage.getItem('punto.progreso') || 'null') || {}).nivel);
  const enInicio = () => ev(() => __t.cur.name === 'galpon' && __t.P.x === __t.galpon.start.x && __t.P.y === __t.galpon.start.y);
  ok(await nivel() === 2, 'al terminar el nivel 1 se guarda el progreso');
  await p.waitForTimeout(3000); await go('L'); await p.waitForTimeout(2900);
  ok(await ev(() => __t.cur.name) === 'galpon', 'al cerrar el resumen del nivel 1, la trampilla baja sola al galpón');
  await tp(6, 10); await go('R'); await go('L'); await go('R'); await p.waitForTimeout(1300);
  ok(await enInicio() && await ev(() => __t.stats.caidas) === 1, 'la baldosa floja aguanta una pisada; a la segunda se vuelve al inicio del nivel');
  const comp = () => ev(() => [...__t.galpon.doors.values()].find(d => d.kind === 'compuerta').open);
  await tp(36, 3); await go('U'); const c1 = await comp(); await go('D'); const c2 = await comp();
  ok(c1 && !c2, 'la placa abre la compuerta solo mientras alguien la pisa');
  await ev(() => { __t.inv.piedra = 1 }); await go('U'); await go('D'); await go('D');
  ok(await comp() && await ev(() => __t.inv.piedra) === 0, 'con la piedra encima, la compuerta queda abierta');
  await tp(30, 17); await go('R'); await p.waitForTimeout(1300);
  ok(await enInicio(), 'sin cuerda, el pozo devuelve al inicio del nivel');
  await ev(() => __t.powers.add('cuerda')); await tp(30, 17); await go('R'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name) === 'sotano', 'con la cuerda, el pozo baja al sótano');
  await tp(22, 4); await go('R'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name === 'galpon' && __t.P.x === 30 && __t.P.y === 17), 'la escalera del sótano sube junto al pozo');
  let caidas = await ev(() => __t.stats.caidas); await tp(34, 13); await p.waitForTimeout(2600);
  ok(await ev(() => __t.stats.caidas) === caidas + 1 && await enInicio(), 'quedarse sobre la cinta lleva al pozo');
  const golpes = await ev(() => __t.stats.hits); await tp(38, 17); await p.waitForTimeout(2700);
  ok(await ev(() => __t.stats.hits) === golpes + 1 && await enInicio(), 'la prensa golpea con su ritmo y devuelve al inicio del nivel');
  await tp(36, 11); await go('R'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name === 'ciudad' && __t.P.x === __t.city.start.x && __t.P.y === __t.city.start.y && __t.stats.tobogan === 1), 'el tobogán devuelve a la plaza del inicio del nivel 1');
  ok(await ev(() => __t.powers.has('cuerda')), 'la caída al nivel 1 no quita nada');
  await tp(goal[0] - 1, goal[1]); await go('R'); await p.waitForTimeout(1300);
  ok(await ev(() => __t.cur.name) === 'galpon', 'se vuelve al galpón por la trampilla');
  await ev(() => { __t.inv.engranaje = 1 }); await tp(43, 9); await go('U'); await go('U'); await go('U');
  ok(await ev(() => __t.P.y) === 7 && await ev(() => __t.inv.engranaje) === 0, 'el engranaje arregla el montacargas');
  await tp(39, 3); await go('R'); await p.waitForTimeout(6500);
  ok(await ev(() => __t.won && __t.nivelGanado === 2), 'se llega a la meta del nivel 2');
  ok(await nivel() === 3, 'al terminar el nivel 2 se guarda el progreso');
  await p.screenshot({ path: path.join(TMP, 'final-nivel2.png') });

  console.log('Progreso guardado');
  await p.goto(URL); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __t.cur.name === 'galpon' && __t.powers.has('cuerda')), 'al volver a abrir el juego se empieza en el galpón, con los poderes');
  await p.goto(URL + '?nueva'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => __t.cur.name === 'ciudad'), 'con ?nueva se empieza de cero');

  ok(errs.length === 0, 'sin errores en la consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
  console.log(fallas.length ? `\n${fallas.length} falla(s).` : '\nTodo bien.');
  process.exit(fallas.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
