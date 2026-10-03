// Arma el sitio que publica Vercel en publico/: el juego en la raíz, el libro web en /libro
// y el editor de mapas en /editor (con el validador que usa). Uso: npm run sitio
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const raiz = path.join(__dirname, '..'), out = path.join(raiz, 'publico');
const copiar = (de, a) => { fs.mkdirSync(path.dirname(path.join(out, a)), { recursive: true }); fs.copyFileSync(path.join(raiz, de), path.join(out, a)); };
fs.rmSync(out, { recursive: true, force: true });
copiar('juego/el-punto.html', 'index.html');
copiar('libro-web/el-punto-gdd.html', 'libro/index.html');
execFileSync(process.execPath, [path.join(__dirname, 'libro-a-web.js'), path.join(raiz, 'libro'), path.join(out, 'libro/datos')], { stdio: 'inherit' });
copiar('editor/editor.html', 'editor/index.html');
copiar('herramientas/validar-ciudad.js', 'herramientas/validar-ciudad.js');
console.log('Sitio armado en publico/');
