// Valida la ciudad con BFS por etapas: cada tramo de la progresión se alcanza con lo que el jugador
// tiene en ese momento, nada necesario queda detrás de lo que abre y no hay casillas aisladas.
// También revisa los carteles, los puntos de regreso de los anexos y los carriles de la avenida.
// Lo usan la terminal (npm run validar:ciudad [juego/el-punto.html]) y el editor de mapas (en el navegador).
(function (raiz) {
  const AVENIDA = [30, 33], CARRILES = [31, 32];
  const DOOR = { H: 'llave', L: 'anteojos', E: 'orden', X: 'fragmento', V: 'melodia' };
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
    check(count('c') === 4, `4 chispas en la ciudad (hay ${count('c')}; la 5.ª está en el laberinto)`);
    check(count('n') === 4 && ['1', '2', '3', '4'].every(c => count(c) === 1), '4 baldosas de notas y 4 pedestales');
    check(count('>') === 1 && count('<') === 1, 'una baldosa de cada zapatilla');
    check(['o', 'O', 'a', 'l', 'e', 'q'].every(c => count(c) === 1), 'lentes, armazón, libro, escudo, barreta');
    check(count('b') === 2, 'puente roto de 2 casillas');
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

    const reach = (open, built, tapar = -1) => {
      const k = (x, y) => x + ',' + y, from = one('S'), seen = new Set([k(...from)]), q = [from];
      while (q.length) {
        const [x, y] = q.shift();
        for (const [a, b] of DIRS) {
          const nx = x + a, ny = y + b; if (nx < 0 || ny < 0 || nx >= W || ny >= H || ny <= tapar) continue;
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
    const sur = (open, built) => reach(open, built, AVENIDA[1]);
    const open = new Set(), built = new Set();

    seccion = '1. Sin nada, sin cruzar la avenida';
    let r = sur(open, built);
    check(sees(r, 'o') && sees(r, 'O'), 'los dos lentes');
    check(find('p').some(([x, y]) => y > AVENIDA[1] && r.has(x + ',' + y)), 'una tabla al sur');
    const foso = find('~').filter(([, y]) => y > AVENIDA[1]);
    check(foso.length === 1 && adj(r, foso[0]), 'el foso del patio se alcanza');
    check(!sees(r, 'a'), 'el armazón está detrás del foso');
    check(adj(r, one('C')) || sees(r, 'C'), 'el crisol');
    check(adj(r, one('L')), 'la puerta de la biblioteca');
    check(sees(r, '>') && sees(r, '<'), 'las baldosas de zapatillas');

    seccion = '2. Foso → armazón → anteojos → libro';
    if (foso[0]) built.add(foso[0].join(','));
    check(sees(sur(open, built), 'a'), 'el armazón');
    open.add('anteojos');
    check(sees(sur(open, built), 'l'), 'el libro, sin cruzar la avenida');

    seccion = '3. Avenida, tablas y puente';
    r = reach(open, built);
    const norte = find('p').filter(([x, y]) => y < AVENIDA[0] && r.has(x + ',' + y));
    check(norte.length >= 2, `tablas alcanzables antes del puente: ${norte.length} (hacen falta 2)`);
    check(sees(r, 'q') && sees(r, 'e'), 'barreta y escudo');
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

  if (typeof module !== 'undefined' && module.exports) module.exports = { validarCiudad };
  else raiz.validarCiudad = validarCiudad;

  // terminal: lee la ciudad y los carteles del juego
  if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
    const fs = require('fs'), path = require('path');
    const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '../juego/el-punto.html'), 'utf8');
    const rows = eval(src.match(/const CIUDAD = (\[[\s\S]*?\]);/)[1]);
    const CARTELES = eval('(' + src.match(/const CARTELES = (\{[\s\S]*?\n  \});/)[1] + ')');
    let ultima = '', ok = true;
    for (const c of validarCiudad(rows, CARTELES.ciudad)) {
      if (c.seccion !== ultima) { console.log(c.seccion); ultima = c.seccion; }
      console.log((c.ok ? '  ✓ ' : '  ✗ ') + c.msg); if (!c.ok) ok = false;
    }
    console.log(ok ? '\nProgresión válida.' : '\nHay problemas.');
    process.exit(ok ? 0 : 1);
  }
})(this);
