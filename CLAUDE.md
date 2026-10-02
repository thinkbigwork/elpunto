# El Punto — instrucciones para Claude

Juego de descubrimiento y estrategia online. Empieza como un punto blanco en una pantalla negra, sin reglas ni instrucciones; se avanza explorando, recordando, calculando y con destreza. Lo diseñamos y programamos juntos, paso a paso.

## Idioma y tono

- Todo en **español rioplatense**: conversación, textos del juego, carteles, libro y mensajes de commit.
- La temporada se divide en **Capítulos** ("Temporada 1, Capítulo 1"). Nunca "etapa".
- Antes de un cambio grande o con varias opciones de diseño, proponer primero y esperar respuesta. Los arreglos claros se hacen directamente.

## Estructura

| Carpeta | Qué hay |
| --- | --- |
| `juego/el-punto.html` | El juego completo en un solo archivo: canvas 2D, sonido sintetizado con Web Audio, sin dependencias |
| `libro/` | El libro de diseño (GDD) en Markdown con índice `SUMMARY.md` (formato GitBook). **Es la fuente de verdad del proyecto** |
| `libro/CAMBIOS.md` | Registro de cambios: una entrada por paso, la más nueva arriba |
| `libro-web/` | La página web del libro, que lee sus datos de una base de datos (ver abajo) |
| `herramientas/solvers.js` | Solucionadores para validar cuartos: `sokoban(filas)` y `ice(filas)` |
| `herramientas/libro-a-web.js` | Convierte `libro/` en los JSON de la versión web |
| `pruebas/regresion.js` | Prueba de punta a punta con Playwright (`npm test`) |

## Regla de oro: el libro se actualiza en cada paso

Cada cambio al juego o al diseño, en el mismo commit:

1. Actualizar las páginas afectadas de `libro/` y cambiar su línea `_Actualizado: AAAA-MM-DD_`.
2. Lo propuesto se marca "Propuesto"; lo que ya existe, "En prototipo".
3. Las decisiones pasan de la tabla de pendientes a "Ya decidido" con fecha, en `libro/produccion/decisiones.md`.
4. Sumar una entrada arriba de todo en `libro/CAMBIOS.md`, subiendo la versión (0.16 → 0.17…), con el mismo formato que las anteriores (título, fecha en itálica, viñetas y línea "Páginas:").
5. Cada página empieza por su conclusión, en negrita.

Si la persona lo pide, actualizar también la versión web del libro (ver "Libro web").

## Cómo está hecho el juego

- **La lógica vive en una grilla y el dibujo es una capa aparte.** Cada mundo es un arreglo de filas de texto; cada carácter es un tipo de casilla, objeto o puerta (ver el `switch` del constructor de mundos).
- Mundos actuales: **ciudad** (mapa base, 61 × 48), **laberinto** (23 × 17) y **cajas** (35 × 9, tres cuartos: empujar cajas, memoria de pares y hielo).
- Una **semilla** nueva por partida (mulberry32) decide el orden de las figuras, la melodía de la vitrina y las cartas.
- Cazadores: buscan camino con BFS; quedan encerrados si no hay camino hasta el jugador.
- Visión: radio base 1, cada chispa suma 0,5 (5 chispas → 3,5). Al ganar, la cámara se aleja hasta mostrar el mapa entero.
- Textos de carteles en el objeto `CARTELES`, por mundo y coordenada `"x,y"`. Si se mueve un mapa, hay que mover sus claves.

## Validar antes de dar algo por terminado

- **Mapas:** después de tocar un mapa, comprobar con BFS que cada tramo de la progresión se puede alcanzar con lo que el jugador tiene en ese momento (lectura, tablas, escalar, sombrero, casa). Nunca debe quedar un objeto necesario detrás de lo que ese mismo objeto abre.
- **Cuartos de cajas o hielo:** pasarlos por `herramientas/solvers.js`. Un cuarto de cajas debe tener solución y no debe dejar al jugador encerrado sin la baldosa de reinicio; uno de hielo, ningún punto sin vuelta.
- **Juego:** `npm test` debe terminar en "Todo bien." Si se cambia algo que la prueba recorre (coordenadas del bloque, la grieta, la meta), actualizar la prueba.
- La prueba engancha `window.__t` en una **copia** del juego (`pruebas/.tmp/`). Nunca agregar ese gancho a `juego/el-punto.html`.

## Publicar

- El juego publicado es un artefacto de claude.ai: https://claude.ai/artifact/Wk6usAWzg5EEaXYzbTei7Q
- El libro web: https://claude.ai/artifact/4eCjAgvK4WDtFqugZiZtA7
- Si hay herramienta para publicar artefactos en la sesión, republicar en esos mismos links. Si no, el juego se prueba abriendo `juego/el-punto.html` en el navegador.

## Libro web

La página `libro-web/el-punto-gdd.html` lee de la base de datos de su artefacto las colecciones `categories`, `pages`, `changelog` (por `order` descendente) y el documento `meta/site`. Para actualizarla:

1. `npm run libro:web` genera los JSON en `libro-web/datos/`.
2. Subir a la base de datos solo los documentos que cambiaron, leyendo antes su versión y escribiendo con `if_version`.

## Pendientes conocidos

- **Rehacer la ampliación de la ciudad.** La versión 11 la agrandó un 50 % estirándola: quedaron calles y espacios más anchos, y eso no es lo buscado. Hay que volver a la escala de `referencias/ciudad-original-41x32.txt` (calles de 1 casilla, manzanas compactas) y agrandar la ciudad sumando calles, manzanas y barrios nuevos, para que el mapa sea más extenso y explorar cueste más al principio.

- Diseñador de mapas: falta definir si es solo para el equipo o también para los jugadores.
- Lupa, brújula y mapa quedan para próximos capítulos.
