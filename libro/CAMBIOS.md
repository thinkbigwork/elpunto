# Registro de cambios

Versión actual del libro: **0.19** (2026-10-02).

## 0.19 · El libro también se publica

_2026-10-02_

- Por ahora el sitio lo ven solo colaboradores, así que se publica todo: el juego en la raíz y este libro en /libro.
- El libro web lee sus páginas de un archivo generado desde el repositorio en cada publicación; ya no depende de la base de datos de claude.ai.
- El juego y el libro web traen su propia cabecera (codificación y vista para celulares), para verse igual fuera de claude.ai.

Páginas: [arquitectura](tecnica/arquitectura.md), [decisiones](produccion/decisiones.md)

## 0.18 · El juego se publica en Vercel

_2026-10-02_

- El juego se publica en Vercel desde el repositorio: cada cambio que llega a la rama principal sale publicado solo.
- Se publica únicamente el juego. El libro, las herramientas y las pruebas no quedan a la vista, para no revelar soluciones.

Páginas: [arquitectura](tecnica/arquitectura.md), [decisiones](produccion/decisiones.md)

## 0.17 · La ciudad vuelve a su escala y suma barrios

_2026-10-02_

- La ciudad sigue midiendo 61 × 48, pero vuelve a la escala del primer mapa: calles de 1 casilla y manzanas compactas. Pasa de 16 a 61 manzanas.
- El núcleo original de 41 × 32 queda intacto (meseta, río, avenida, casa, patio, plaza oscura y refugio). Se suman barrios: una franja entre la meseta y el río, todo el este con una plazoleta, y una fila de manzanas entre la avenida y la casa.
- La avenida vuelve a tener 4 filas. Una chispa se muda al barrio nuevo del sudeste y una tabla al extremo este. Las baldosas de zapatillas quedan dentro de la plaza oscura.
- Nueva herramienta: un BFS por etapas valida la progresión de la ciudad, los carteles y los puntos de regreso de los anexos.

Páginas: [mapa-global](mundo/mapa-global.md), [objetos](contenido/objetos.md), [prototipos](niveles/prototipos.md), [arquitectura](tecnica/arquitectura.md), [decisiones](produccion/decisiones.md)

## 0.16 · El proyecto pasa a Claude Code

_2026-10-02_

- La programación sigue en Claude Code, sobre un repositorio con el juego, los solvers de los cuartos y las pruebas automáticas.
- El libro pasa a vivir en el repositorio como páginas Markdown con índice SUMMARY.md (formato GitBook) y un archivo CAMBIOS.md.
- Un archivo de instrucciones para Claude Code guarda las reglas acordadas: actualizar el libro en cada paso, todo en español, Temporada y Capítulo, validar los mapas antes de publicar.

Páginas: [arquitectura](tecnica/arquitectura.md), [como-se-actualiza](produccion/como-se-actualiza.md), [decisiones](produccion/decisiones.md)

## 0.15 · Zapatillas de ida y vuelta, figuras al azar, cazadores encerrables y ciudad más grande

_2026-10-02_

- Zapatillas: dos baldosas fijas en la plaza del sur. Las flechas hacia un lado aceleran; las del otro lado devuelven la velocidad normal. Nunca desaparecen.
- El orden de las cuatro figuras cambia en cada partida (también la melodía y las cartas).
- Los cazadores se pueden encerrar: un bloque con flechas junto a su guarida, empujado al lugar justo, los deja sin salida. Se cuentan en el resumen final.
- La ciudad se amplió un 50 % (61 × 48 casillas) para que explorar cueste más al principio.
- Un cartel nuevo en el laberinto.

Páginas: [poderes](contenido/poderes.md), [personajes](contenido/personajes.md), [terreno](contenido/terreno.md), [carteles](contenido/carteles.md), [pistas](jugabilidad/pistas.md), [mapa-global](mundo/mapa-global.md), [interfaz](arte-audio/interfaz.md), [prototipos](niveles/prototipos.md), [decisiones](produccion/decisiones.md)

## 0.14 · Capítulos, lectura temprana, persecución y resumen final

_2026-10-02_

- La temporada se divide en capítulos: cada uno es una parte de la historia, con título propio.
- La lectura se consigue al principio: los dos lentes, el armazón y una tabla están en el barrio sur; los carteles se leen antes de cruzar la avenida.
- Al tomar la llave, el laberinto despierta: dos cazadores persiguen al punto hasta el portal, con música de persecución; no entran al refugio.
- El mensaje final suma tiempo, objetos encontrados, chispas, acertijos resueltos, carteles leídos, objetos creados, tablas colocadas y golpes.
- Lupa, brújula y mapa entran al catálogo para próximos capítulos.

Páginas: [glosario](vision/glosario.md), [temporada-1](niveles/temporada-1.md), [personajes](contenido/personajes.md), [sonido](arte-audio/sonido.md), [reglas](jugabilidad/reglas.md), [objetos](contenido/objetos.md), [poderes](contenido/poderes.md), [interfaz](arte-audio/interfaz.md), [prototipos](niveles/prototipos.md), [decisiones](produccion/decisiones.md)

## 0.13 · Cajas, anteojos armados, melodía y final con zoom

_2026-10-01_

- Nuevo mundo anexo, Cajas: tres cuartos (empujar cajas, memoria de pares, hielo), totalmente iluminado. Se entra con el sombrero por una pared falsa y da el fragmento.
- Los anteojos se arman en un crisol con dos lentes y un armazón. Un lente se encuentra siguiendo una campanita; el armazón está detrás de un foso.
- El sombrero está en una vitrina que se abre repitiendo una melodía de 5 notas de una caja de música (distinta para cada jugador).
- Al llegar a la meta, la cámara se aleja hasta mostrar toda la ciudad antes del mensaje final.
- Dos carteles nuevos.

Páginas: [cajas](niveles/cajas.md), [objetos](contenido/objetos.md), [poderes](contenido/poderes.md), [terreno](contenido/terreno.md), [alquimia](contenido/alquimia.md), [sonido](arte-audio/sonido.md), [carteles](contenido/carteles.md), [prototipos](niveles/prototipos.md), [decisiones](produccion/decisiones.md), [eras-visuales](arte-audio/eras-visuales.md), [mapa-global](mundo/mapa-global.md), [ciclo-central](jugabilidad/ciclo-central.md), [interfaz](arte-audio/interfaz.md)

## 0.12 · Correcciones del prototipo 3

_2026-10-01_

- El portal del laberinto queda abierto una vez tomada la llave: se puede entrar y salir siempre.
- El libro está dentro de una biblioteca cerrada; se abre con unos anteojos que están del otro lado de la avenida.
- Nueva herramienta, la barreta: quedándose quieto sobre una tabla puesta, se la levanta y se recupera.
- Cuatro figuras en lugar de tres, separadas; la secuencia se evalúa completa y, si falla, el mecanismo se enfría 4 segundos.
- Al llegar a la meta: mensaje "Llegaste. Felicitaciones: terminaste el prototipo." con tiempo y chispas.
- Quedan 5 chispas en total (había 7), para que la visión máxima sea 3,5.

Páginas: [reglas](jugabilidad/reglas.md), [objetos](contenido/objetos.md), [poderes](contenido/poderes.md), [terreno](contenido/terreno.md), [ciclo-central](jugabilidad/ciclo-central.md), [prototipos](niveles/prototipos.md), [decisiones](produccion/decisiones.md)

## 0.11 · Iluminación ajustada

_2026-10-01_

- Al empezar se ve 1 casilla (antes 0,575).
- Cada chispa suma 0,5 (antes 0,375).
- Con las 5 chispas la visión llega a 3,5.

Páginas: [eras-visuales](arte-audio/eras-visuales.md), [objetos](contenido/objetos.md), [decisiones](produccion/decisiones.md)

## 0.10 · Chispas más luminosas

_2026-10-01_

- Cada chispa amplía la visión un 50 % más que antes: de 0,25 a 0,375 casillas.
- Con todas las chispas, la visión vuelve a mostrar las casillas vecinas y parte de las diagonales.

Páginas: [eras-visuales](arte-audio/eras-visuales.md), [objetos](contenido/objetos.md), [decisiones](produccion/decisiones.md)

## 0.9 · Menos visión, más castigo en la avenida

_2026-10-01_

- Campo visual reducido al 50 % en todas las eras: al empezar solo se ve la propia casilla.
- Si un vehículo atropella al punto, vuelve al inicio del mapa (el escudo lo evita una vez).
- Al tomar una chispa, un destello y dos anillos muestran cómo crece la visión, con un sonido ascendente.

Páginas: [eras-visuales](arte-audio/eras-visuales.md), [reglas](jugabilidad/reglas.md), [personajes](contenido/personajes.md), [objetos](contenido/objetos.md), [decisiones](produccion/decisiones.md)

## 0.8 · Mapa a mano y un comienzo más limpio

_2026-10-01_

- Se descarta OpenStreetMap: la ciudad se recrea a mano, inspirada en el lugar real.
- Al empezar solo se ve el punto: el primer cartel pasa a cinco pasos del inicio y ningún cartel se muestra antes de despertar.

Páginas: [mapa-global](mundo/mapa-global.md), [ciclo-central](jugabilidad/ciclo-central.md), [carteles](contenido/carteles.md), [legal](produccion/legal.md), [decisiones](produccion/decisiones.md)

## 0.7 · Libro de diseño

_2026-10-01_

- Toda la documentación organizada en nueve categorías.
- Registro de cambios y regla de actualización en cada paso.

Páginas: [como-se-actualiza](produccion/como-se-actualiza.md), [glosario](vision/glosario.md), [referencias](vision/referencias.md), [accesibilidad](tecnica/accesibilidad.md), [interfaz](arte-audio/interfaz.md), [comunidad](negocio/comunidad.md), [legal](produccion/legal.md), [hoja-de-ruta](produccion/hoja-de-ruta.md)

## 0.6 · Mapa conceptual

_2026-10-01_

- Diagrama de todo el juego: ciclo central, mundo, desafíos, progreso y final.

Páginas: [mapa-conceptual](vision/mapa-conceptual.md)

## 0.5 · Marco de diseño

_2026-10-01_

- Estrategia global con tres finales y embudo objetivo.
- Mapa real escondido, eras visuales, tiempo, catálogo, modos, reglas, negocio y plataformas.
- Lista de lo que falta y decisiones pendientes.

Páginas: [temporada-1](niveles/temporada-1.md), [embudo](niveles/embudo.md), [eras-visuales](arte-audio/eras-visuales.md), [tiempo](jugabilidad/tiempo.md), [modos](jugabilidad/modos.md), [progresion](jugabilidad/progresion.md), [modelo-negocio](negocio/modelo-negocio.md), [plataformas](tecnica/plataformas.md), [decisiones](produccion/decisiones.md), [pendientes](produccion/pendientes.md)

## 0.4 · Prototipo 3: sonidos, poderes y carteles

_2026-09-30_

- Lenguaje de sonidos: roto, alarma, miedo, calma, llamado, tránsito.
- Puentes construidos con tablas, escalar insistiendo, tránsito para esquivar.
- Poderes: libro, zapatillas, escudo, sombrero. Carteles que se aprenden a leer.
- Corrección: la pista del laberinto como lápida y el portal que muestra la llave.

Páginas: [prototipos](niveles/prototipos.md), [sonido](arte-audio/sonido.md), [poderes](contenido/poderes.md), [objetos](contenido/objetos.md), [terreno](contenido/terreno.md), [carteles](contenido/carteles.md), [pistas](jugabilidad/pistas.md)

## 0.3 · Prototipo 2: ciudad y laberinto anexo

_2026-09-30_

- Menos visión.
- Puertas que se niegan y muestran lo que falta.
- Ciudad como mapa base, grieta en un callejón sin salida y laberinto anexo.

Páginas: [prototipos](niveles/prototipos.md), [mapa-global](mundo/mapa-global.md), [reglas](jugabilidad/reglas.md)

## 0.2 · Prototipo 1

_2026-09-30_

- Pantalla negra, visión que crece con chispas, memoria que se apaga.
- Pedestales con pista por semilla, sombras que patrullan, insignia.

Páginas: [prototipos](niveles/prototipos.md)

## 0.1 · Idea inicial

_2026-09-30_

- Concepto: un punto blanco en la oscuridad, sin reglas ni instrucciones.
- Definiciones: duración de meses con etapas e insignias, computadora y celular, comunidad y desafíos grupales.
- El punto es el jugador que busca en quién convertirse.

Páginas: [resumen](vision/resumen.md), [premisa](mundo/premisa.md)
