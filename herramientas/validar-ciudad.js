// Valida la ciudad del juego con BFS por etapas: cada tramo de la progresión se alcanza con lo que el
// jugador tiene en ese momento, nada necesario queda detrás de lo que abre y no hay casillas aisladas.
// También revisa que cada cartel tenga texto y que los puntos de regreso de los anexos sean caminables.
// Uso: node herramientas/validar-ciudad.js [juego/el-punto.html]
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../juego/el-punto.html'), 'utf8');
const rows = eval(src.match(/const CIUDAD = (\[[\s\S]*?\]);/)[1]);
const CARTELES = eval('(' + src.match(/const CARTELES = (\{[\s\S]*?\n  \});/)[1] + ')');
const RET = Object.fromEntries([...src.match(/const CITY_RETURN = .*;/)[0].matchAll(/(\w+) = \{ x: (\d+), y: (\d+) \}/g)].map(m => [m[1], [+m[2], +m[3]]]));
const H = rows.length, W = rows[0].length;
const g = rows.map(r => r.split(''));
let ok = true;
const check = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) ok = false; };
check(rows.every(r => r.length === W), `todas las filas miden ${W}`);
check(rows[0].split('').every(c => c === '#') && rows[H - 1].split('').every(c => c === '#') && rows.every(r => r[0] === '#' && r[W - 1] === '#'), 'borde cerrado');
const find = ch => { const o = []; g.forEach((r, y) => r.forEach((c, x) => { if (c === ch) o.push([x, y]); })); return o; };
const one = ch => find(ch)[0];
const count = ch => find(ch).length;
console.log('Conteos');
check(count('S') === 1 && count('M') === 1 && count('H') === 1 && count('E') === 1 && count('X') === 1 && count('Q') === 1 && count('V') === 1 && count('L') === 1 && count('C') === 1 && count('m') === 1, 'una sola salida, meta, casa, reja, grieta, portal, vitrina, biblioteca, crisol, caja de música');
check(count('c') === 4, `4 chispas en la ciudad (hay ${count('c')}; la 5.ª está en el laberinto)`);
check(count('n') === 4 && find('1').length + find('2').length + find('3').length + find('4').length === 4, '4 baldosas de notas y 4 pedestales');
check(count('>') === 1 && count('<') === 1, 'una baldosa de cada zapatilla');
check(count('o') === 1 && count('O') === 1 && count('a') === 1 && count('l') === 1 && count('e') === 1 && count('q') === 1, 'lentes, armazón, libro, escudo, barreta');
check(count('b') === 2, 'puente roto de 2 casillas');
console.log(`  tablas: ${count('p')}`);

// BFS: abiertos = conjunto de puertas abiertas; built = casillas de agua con tabla
const DOOR = { H: 'llave', L: 'anteojos', E: 'orden', X: 'fragmento', V: 'melodia' };
const reach = (open, built, from = one('S')) => {
  const k = (x, y) => x + ',' + y, seen = new Set([k(...from)]), q = [from];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + a, ny = y + b; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const c = g[ny][nx], key = k(nx, ny);
      if (seen.has(key) || c === '#') continue;
      if ((c === '~' || c === 'b') && !built.has(key)) continue;
      if (c === '%' && !open.has('sombrero')) continue;
      if (DOOR[c] && !open.has(DOOR[c])) continue;
      seen.add(key); q.push([nx, ny]);
    }
  }
  return seen;
};
const has = (set, ch) => find(ch).every(([x, y]) => set.has(x + ',' + y));
const sees = (set, ch) => find(ch).some(([x, y]) => set.has(x + ',' + y));
const adj = (set, [x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => set.has((x + a) + ',' + (y + b)));
const AV = [30, 33];
const sinAvenida = (open, built) => { // BFS que no pisa la avenida ni lo que está al norte
  const save = g.map(r => r.slice());
  for (let y = 0; y <= AV[1]; y++) for (let x = 0; x < W; x++) g[y][x] = '#';
  const r = reach(open, built); g.splice(0, H, ...save); return r;
};

console.log('Carteles y regresos');
const carteles = find('T').map(p => p.join(','));
check(carteles.every(k => CARTELES.ciudad[k]), 'cada cartel tiene texto' + carteles.filter(k => !CARTELES.ciudad[k]).map(k => ' (falta ' + k + ')').join(''));
check(Object.keys(CARTELES.ciudad).every(k => carteles.includes(k)), 'cada texto tiene su cartel' + Object.keys(CARTELES.ciudad).filter(k => !carteles.includes(k)).map(k => ' (sobra ' + k + ')').join(''));
const [gx, gy] = one('X');
check(RET.CITY_RETURN[0] === gx && RET.CITY_RETURN[1] === gy + 1 && g[gy + 1][gx] === '.', 'al salir del laberinto se aparece junto a la grieta');
const [qx, qy] = one('Q'), [cx, cy] = RET.CAJAS_RETURN;
check(g[cy][cx] === '.' && Math.abs(cx - qx) + Math.abs(cy - qy) <= 2 && g[cy][cx - 1] === '%', 'al salir de Cajas se aparece junto al portal, del lado de adentro de la pared falsa');

console.log('Etapa 1: sin nada, sin cruzar la avenida');
let open = new Set(), built = new Set();
let r = sinAvenida(open, built);
check(sees(r, 'o') && sees(r, 'O'), 'los dos lentes');
check(find('p').some(([x, y]) => y > AV[1] && r.has(x + ',' + y)), 'una tabla al sur');
const foso = find('~').filter(([x, y]) => y > AV[1]);
check(foso.length === 1 && adj(r, foso[0]), 'el foso del patio se alcanza');
check(!sees(r, 'a'), 'el armazón está detrás del foso');
check(adj(r, one('C')) || sees(r, 'C'), 'el crisol');
check(adj(r, one('L')), 'la puerta de la biblioteca');
check(sees(r, '>') && sees(r, '<'), 'las baldosas de zapatillas');

console.log('Etapa 2: tabla en el foso → armazón → anteojos → libro');
built.add(foso[0].join(','));
r = sinAvenida(open, built);
check(sees(r, 'a'), 'el armazón');
open.add('anteojos');
r = sinAvenida(open, built);
check(sees(r, 'l'), 'el libro, sin cruzar la avenida');

console.log('Etapa 3: cruzar la avenida, juntar tablas y reparar el puente');
r = reach(open, built);
const norte = find('p').filter(([x, y]) => y < AV[0] && r.has(x + ',' + y));
check(norte.length >= 2, `tablas al norte del río alcanzables antes del puente: ${norte.length} (hacen falta 2)`);
check(sees(r, 'q') && sees(r, 'e'), 'barreta y escudo');
check(adj(r, find('b')[1]), 'el puente roto se alcanza desde el sur');
check(!sees(r, 'm') && !adj(r, one('X')), 'la meseta y la grieta están del otro lado del río');
find('b').forEach(([x, y]) => built.add(x + ',' + y));
r = reach(open, built);
check(adj(r, one('m')) || sees(r, 'm'), 'la caja de música (escalando la meseta)');
check(find('n').every(p => r.has(p.join(','))), 'las cuatro notas');
check(adj(r, one('V')), 'la vitrina');
check(!sees(r, 'Q'), 'el portal de Cajas está detrás de la pared falsa');

console.log('Etapa 4: sombrero → pared falsa → Cajas → fragmento → grieta');
open.add('melodia'); open.add('sombrero');
r = reach(open, built);
check(sees(r, 'Q'), 'el portal de Cajas');
check(adj(r, one('X')), 'la grieta (con el fragmento de Cajas)');
open.add('fragmento');

console.log('Etapa 5: llave → casa → figuras → meta');
check(!sees(reach(open, built), '1'), 'los pedestales están dentro de la casa');
open.add('llave');
r = reach(open, built);
check(['1', '2', '3', '4'].every(c => sees(r, c)), 'los cuatro pedestales');
check(!sees(r, 'M'), 'la meta está detrás de la reja');
open.add('orden');
check(sees(reach(open, built), 'M'), 'la meta');

console.log('Sin encierros');
const all = reach(new Set(['llave', 'anteojos', 'orden', 'fragmento', 'melodia', 'sombrero']), new Set([...find('~'), ...find('b')].map(p => p.join(','))));
const walk = []; g.forEach((row, y) => row.forEach((c, x) => { if (!'#~b^'.includes(c)) walk.push([x, y]); }));
const islas = walk.filter(([x, y]) => !all.has(x + ',' + y));
check(islas.length === 0, 'toda casilla caminable se alcanza' + (islas.length ? ': ' + islas.slice(0, 8).map(p => p.join(',')).join(' ') : ''));
console.log(ok ? '\nProgresión válida.' : '\nHay problemas.');
process.exit(ok ? 0 : 1);
