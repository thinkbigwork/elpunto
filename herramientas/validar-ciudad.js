// Valida la ciudad (nivel 1) y el galpón con su sótano (nivel 2) con BFS por etapas.
// Ciudad: cada tramo de la progresión se alcanza con lo que el jugador
// tiene en ese momento, nada necesario queda detrás de lo que abre y no hay casillas aisladas.
// También revisa los carteles, los puntos de regreso de los anexos y los carriles de la avenida.
// Lo usan la terminal (npm run validar:ciudad [juego/el-punto.html]) y el editor de mapas (en el navegador).
(function (raiz) {
  const AVENIDA = [30, 33], CARRILES = [31, 32];
  const DOOR = { H: 'llave', L: 'anteojos', E: 'orden', X: 'fragmento', V: 'melodia', G: 'libro' };
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  // devuelve [{ seccion, ok, msg }]
  const validarCiudad = (rows, carteles = {}) => {
    const out = [];
    let seccion = 'Forma';
    const check = (ok, msg) => { out.push({ seccion, ok: !!ok, msg }); return !!ok; };
    const H = rows.length, W = rows[0] ? rows[0].length : 0;
    if (!check(H > 2 && rows.every(r => r.length === W), `todas las filas miden ${W}`)) return out;
    check(/^#+$/.test(rows[0]) && /^#+$/.test(rows[H - 1]) && rows.every(r => r[0] === '#' && r[W - 1] === '#'), 'borde cerrado');
    const g = rows.map(r => r.split(''));
    const find = ch => { const o = []; g.forEach((r, y) => r.forEach((c, x) => { if (c === ch) o.push([x, y]); })); return o; };
    const one = ch => find(ch)[0];
    const count = ch => find(ch).length;

    seccion = 'Conteos';
    const unicos = { S: 'inicio', M: 'meta', H: 'casa', E: 'reja', X: 'grieta', Q: 'portal de Cajas', V: 'vitrina', L: 'biblioteca', C: 'crisol', m: 'caja de música' };
    const faltan = Object.entries(unicos).filter(([ch]) => count(ch) !== 1).map(([ch, n]) => `${n} (${count(ch)})`);
    if (!check(!faltan.length, 'uno de cada: inicio, meta, casa, reja, grieta, portal, vitrina, biblioteca, crisol, caja de música' + (faltan.length ? ' — mal: ' + faltan.join(', ') : ''))) return out;
    check(count('c') === 5, `5 chispas en la ciudad (hay ${count('c')}; la 6.ª está en el laberinto)`);
    check(count('n') === 4 && ['1', '2', '3', '4'].every(c => count(c) === 1), '4 baldosas de notas y 4 pedestales');
    check(count('>') === 1 && count('<') === 1, 'una baldosa de cada zapatilla');
    check(['o', 'O', 'a', 'l', 'e', 'q'].every(c => count(c) === 1), 'lentes, armazón, libro, escudo, barreta');
    check(count('b') === 2, 'puente roto de 2 casillas');
    check(count('G') === 2, `2 portones que piden el libro (hay ${count('G')})`);
    check(count('p') >= 3, `tablas: ${count('p')}`);

    seccion = 'Carteles, regresos y avenida';
    const signs = find('T').map(p => p.join(','));
    const sinTexto = signs.filter(k => !carteles[k]), sobran = Object.keys(carteles).filter(k => !signs.includes(k));
    check(!sinTexto.length, 'cada cartel tiene texto' + (sinTexto.length ? ' — falta en ' + sinTexto.join(' ') : ''));
    check(!sobran.length, 'cada texto tiene su cartel' + (sobran.length ? ' — sobra ' + sobran.join(' ') : ''));
    const [gx, gy] = one('X'), [qx, qy] = one('Q');
    check(g[gy + 1] && g[gy + 1][gx] === '.', 'debajo de la grieta hay calle (ahí se aparece al salir del laberinto)');
    check(g[qy][qx - 1] === '.' && g[qy][qx - 2] === '%', 'a la izquierda del portal de Cajas hay calle y después pared falsa (ahí se aparece al volver)');
    check(H > CARRILES[1] && CARRILES.every(y => g[y].slice(1, W - 1).every(c => c === '.')), `los carriles de autos (filas ${CARRILES.join(' y ')}) son calle de punta a punta`);

    const reach = (open, built) => {
      const k = (x, y) => x + ',' + y, from = one('S'), seen = new Set([k(...from)]), q = [from];
      while (q.length) {
        const [x, y] = q.shift();
        for (const [a, b] of DIRS) {
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
    const sees = (set, ch) => find(ch).some(p => set.has(p.join(',')));
    const adj = (set, [x, y]) => DIRS.some(([a, b]) => set.has((x + a) + ',' + (y + b)));
    const open = new Set(), built = new Set();

    // lo primero es leer: el inicio está en un barrio cerrado que tiene todo lo necesario
    seccion = '1. Sin nada, dentro del barrio central';
    let r = reach(open, built);
    const barrio = r;
    check(![...r].some(k => { const y = +k.split(',')[1]; return y <= 18 || y >= AVENIDA[0]; }), 'sin el libro no se sale del barrio: ni a la costanera ni a la avenida');
    check(sees(r, 'o') && sees(r, 'O'), 'los dos lentes');
    check(find('p').some(p => r.has(p.join(','))), 'una tabla');
    const foso = find('~').filter(p => adj(r, p));
    check(foso.length === 1, 'el foso del patio se alcanza (una sola casilla de agua)');
    check(!sees(r, 'a'), 'el armazón está detrás del foso');
    check(adj(r, one('C')) || sees(r, 'C'), 'el crisol');
    check(adj(r, one('L')), 'la puerta de la biblioteca');
    check(find('G').every(p => adj(r, p)), 'los dos portones, cerrados');

    seccion = '2. Foso → armazón → anteojos → libro';
    if (foso[0]) built.add(foso[0].join(','));
    check(sees(reach(open, built), 'a'), 'el armazón');
    open.add('anteojos');
    check(sees(reach(open, built), 'l'), 'el libro, sin salir del barrio');

    seccion = '3. Leer abre los portones: avenida, tablas y puente';
    open.add('libro');
    r = reach(open, built);
    check(r.size > barrio.size, 'con el libro se sale del barrio');
    const afuera = find('p').filter(p => r.has(p.join(',')) && !barrio.has(p.join(',')));
    check(afuera.length >= 2, `tablas afuera del barrio, antes del puente: ${afuera.length} (hacen falta 2)`);
    check(sees(r, 'q') && sees(r, 'e'), 'barreta y escudo');
    check(sees(r, '>') && sees(r, '<'), 'las baldosas de zapatillas');
    check(find('b').some(p => adj(r, p)), 'el puente roto se alcanza');
    check(!sees(r, 'm') && !adj(r, one('X')), 'la meseta y la grieta están del otro lado del río');
    find('b').forEach(p => built.add(p.join(',')));
    r = reach(open, built);
    check(adj(r, one('m')) || sees(r, 'm'), 'la caja de música (escalando la meseta)');
    check(find('n').every(p => r.has(p.join(','))), 'las cuatro notas');
    check(adj(r, one('V')), 'la vitrina');
    check(!sees(r, 'Q'), 'el portal de Cajas está detrás de la pared falsa');

    seccion = '4. Sombrero → Cajas → grieta';
    open.add('melodia'); open.add('sombrero');
    r = reach(open, built);
    check(sees(r, 'Q'), 'el portal de Cajas');
    check(adj(r, one('X')), 'la grieta (con el fragmento de Cajas)');
    open.add('fragmento');

    seccion = '5. Llave → casa → figuras → meta';
    check(!sees(reach(open, built), '1'), 'los pedestales están dentro de la casa');
    open.add('llave');
    r = reach(open, built);
    check(['1', '2', '3', '4'].every(c => sees(r, c)), 'los cuatro pedestales');
    check(!sees(r, 'M'), 'la meta está detrás de la reja');
    open.add('orden');
    check(sees(reach(open, built), 'M'), 'la meta');

    seccion = 'Sin encierros';
    const todo = reach(open, new Set([...find('~'), ...find('b')].map(p => p.join(','))));
    const islas = []; g.forEach((row, y) => row.forEach((c, x) => { if (!'#~b^'.includes(c) && !todo.has(x + ',' + y)) islas.push(x + ',' + y); }));
    check(!islas.length, 'toda casilla caminable se alcanza' + (islas.length ? ' — aisladas: ' + islas.slice(0, 8).join(' ') : ''));
    return out;
  };

  // ── Nivel 2: el galpón y su sótano. Las baldosas flojas (?) se pueden pisar una sola vez por camino.
  const validarGalpon = (galpon, sotano, carteles = {}) => {
    const out = [];
    let seccion = 'Forma';
    const check = (ok, msg) => { out.push({ seccion, ok: !!ok, msg }); return !!ok; };
    for (const [n, rows] of [['galpón', galpon], ['sótano', sotano]]) {
      const W = rows[0].length;
      check(rows.every(r => r.length === W) && /^#+$/.test(rows[0]) && /^#+$/.test(rows.at(-1)) && rows.every(r => r[0] === '#' && r[W - 1] === '#'), `${n}: filas parejas y borde cerrado`);
    }
    const mk = rows => rows.map(r => r.split(''));
    const G = mk(galpon), B = mk(sotano);
    const find = (g, ch) => { const o = []; g.forEach((r, y) => r.forEach((c, x) => { if (c === ch) o.push([x, y]); })); return o; };
    const count = (g, ch) => find(g, ch).length;
    seccion = 'Conteos';
    const faltan = [...'SMYD_U@tsg'].filter(ch => count(G, ch) !== 1);
    check(!faltan.length, 'galpón: un inicio, meta, montacargas, compuerta, placa, bajada, tobogán, tiza, cuerda y piedra' + (faltan.length ? ' — mal: ' + faltan.join(' ') : ''));
    check([...'SIw'].every(ch => count(B, ch) === 1), 'sótano: una llegada, una escalera y el engranaje');
    const signs = find(G, 'T').map(p => p.join(',')), sinTexto = signs.filter(k => !carteles[k]);
    check(!sinTexto.length, 'cada cartel del galpón tiene texto' + (sinTexto.length ? ' — falta en ' + sinTexto.join(' ') : ''));

    // búsqueda por estados: posición, baldosas flojas ya pisadas y si ya se tomó el objeto buscado
    const buscar = (g, open, objeto, meta) => {
      const flojas = new Map(); find(g, '?').forEach((p, i) => flojas.set(p.join(','), i));
      if (flojas.size > 30) return false;
      const [sx, sy] = find(g, 'S')[0], seen = new Set(), q = [[sx, sy, 0, !objeto]];
      while (q.length) {
        const [x, y, used, got] = q.shift();
        const st = x + ',' + y + ',' + used + ',' + got; if (seen.has(st)) continue; seen.add(st);
        if (got && meta(x, y)) return true;
        for (const [a, b] of DIRS) {
          const nx = x + a, ny = y + b, c = g[ny] && g[ny][nx], k = nx + ',' + ny;
          if (!c || '#0U@'.includes(c) || ((c === 'D' || c === 'Y') && !open.has(c))) continue;
          let u = used;
          if (flojas.has(k)) { const bit = 1 << flojas.get(k); if (u & bit) continue; u |= bit; }
          q.push([nx, ny, u, got || c === objeto]);
        }
      }
      return false;
    };
    const libre = (g, open) => { // alcance sin contar las flojas
      const [sx, sy] = find(g, 'S')[0], seen = new Set([sx + ',' + sy]), q = [[sx, sy]];
      while (q.length) { const [x, y] = q.shift(); for (const [a, b] of DIRS) { const nx = x + a, ny = y + b, c = g[ny] && g[ny][nx], k = nx + ',' + ny; if (!c || seen.has(k) || '#0U@'.includes(c) || ((c === 'D' || c === 'Y') && !open.has(c))) continue; seen.add(k); q.push([nx, ny]); } }
      return seen;
    };
    const junto = (g, ch) => { const [tx, ty] = find(g, ch)[0]; return (x, y) => Math.abs(x - tx) + Math.abs(y - ty) === 1; };
    const en = (g, ch) => { const [tx, ty] = find(g, ch)[0]; return (x, y) => x === tx && y === ty; };

    seccion = '1. Depósito y campo de baldosas flojas';
    let r = libre(G, new Set());
    check(r.has(find(G, 't')[0].join(',')) && r.has(find(G, 's')[0].join(',')), 'la tiza y la cuerda');
    check(buscar(G, new Set(), 'g', en(G, '_')), 'se toma la piedra y se llega a la placa sin pisar dos veces una baldosa floja');
    check(!find(G, 'U').some(([x, y]) => DIRS.some(([a, b]) => r.has((x + a) + ',' + (y + b)))), 'la bajada y lo que sigue están detrás de la compuerta');
    seccion = '2. Compuerta abierta: cinta, bajada y tobogán';
    r = libre(G, new Set(['D']));
    const cerca = ch => find(G, ch).some(([x, y]) => DIRS.some(([a, b]) => r.has((x + a) + ',' + (y + b))));
    check(cerca('U'), 'el pozo con bajada');
    check(cerca('@'), 'el tobogán (la trampa al nivel 1)');
    check(cerca('Y'), 'el montacargas, cerrado');
    check(!r.has(find(G, 'M')[0].join(',')), 'la meta está detrás del montacargas');
    seccion = '3. Sótano';
    check(buscar(B, new Set(), 'w', en(B, 'I')), 'se toma el engranaje y se llega a la escalera sin pisar dos veces una baldosa floja');
    seccion = '4. Montacargas → meta';
    r = libre(G, new Set(['D', 'Y']));
    check(r.has(find(G, 'M')[0].join(',')), 'la meta del nivel 2');
    seccion = 'Sin encierros';
    const islas = []; G.forEach((row, y) => row.forEach((c, x) => { if (!'#0U@'.includes(c) && !r.has(x + ',' + y)) islas.push(x + ',' + y); }));
    check(!islas.length, 'toda casilla caminable del galpón se alcanza' + (islas.length ? ' — aisladas: ' + islas.slice(0, 8).join(' ') : ''));
    return out;
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { validarCiudad, validarGalpon };
  else { raiz.validarCiudad = validarCiudad; raiz.validarGalpon = validarGalpon; }

  // terminal: lee la ciudad y los carteles del juego
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    const fs = require('fs'), path = require('path');
    const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../juego/el-punto.html'), 'utf8');
    const rows = eval(src.match(/const CIUDAD = (\[[\s\S]*?\]);/)[1]);
    const CARTELES = eval('(' + src.match(/const CARTELES = (\{[\s\S]*?\n  \});/)[1] + ')');
    const arr = n => eval(src.match(new RegExp('const ' + n + ' = (\\[[\\s\\S]*?\\]);'))[1]);
    let ultima = '', ok = true;
    const todo = [...validarCiudad(rows, CARTELES.ciudad).map(c => ({ ...c, seccion: 'Ciudad · ' + c.seccion })), ...validarGalpon(arr('GALPON'), arr('SOTANO'), CARTELES.galpon).map(c => ({ ...c, seccion: 'Galpón · ' + c.seccion }))];
    for (const c of todo) {
      if (c.seccion !== ultima) { console.log(c.seccion); ultima = c.seccion; }
      console.log((c.ok ? '  ✓ ' : '  ✗ ') + c.msg); if (!c.ok) ok = false;
    }
    console.log(ok ? '\nProgresión válida.' : '\nHay problemas.');
    process.exit(ok ? 0 : 1);
  }
})(this);
