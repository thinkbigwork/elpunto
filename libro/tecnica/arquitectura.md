# Arquitectura y principios

**La lógica vive en una grilla y el dibujo es una capa aparte.** Así el mismo mundo se muestra en las cinco eras sin rehacer niveles.

## Principios

- **Grilla lógica:** cada casilla tiene un tipo de terreno; objetos, puertas y personajes viven encima.
- **Render separado:** cada era visual es otro "pintor" sobre la misma grilla.
- **Semillas:** cada jugador tiene una semilla que define parte de las respuestas.
- **Validación en servidor:** progreso, respuestas y rankings se confirman en el servidor.
- **Textos aparte:** todo texto visible vive en archivos de idioma.

## Hoy (prototipo)

- Una sola página web con dibujo en canvas y sonido generado con Web Audio.
- Progreso solo en el navegador.
- Desde el 2 oct 2026 el juego y este libro se publican en Vercel: cada cambio en la rama principal del repositorio sale publicado solo. El juego está en la raíz del sitio y el libro en /libro. Por ahora el sitio lo ven solo colaboradores; antes de abrirlo al público hay que sacar el libro, porque revela soluciones.
- Desde el 2 oct 2026 el código vive en un repositorio y se trabaja con Claude Code: el juego, este libro en Markdown, los solvers de los cuartos y las pruebas automáticas.
- Cada mapa de la ciudad se valida con un BFS por etapas (`npm run validar:ciudad`): cada tramo de la progresión se alcanza con lo que el jugador tiene en ese momento, y ninguna casilla queda aislada.

## Editor de mapas

En prototipo desde el 2 oct 2026, solo para el equipo, en `/editor` del sitio.

- Lee los mapas del propio juego (ciudad, laberinto y Cajas) y guarda un borrador en el navegador.
- Se dibuja con lápiz, rectángulo, línea, balde y gotero sobre una paleta con todas las casillas; los carteles se escriben ahí mismo.
- Valida mientras se dibuja, con el mismo BFS por etapas que usa `npm run validar:ciudad`. En el laberinto y Cajas revisa la forma y avisa de las coordenadas que el código tiene fijas.
- Muestra un mapa de calor de pasos desde el inicio y la lista de objetos por distancia, para ver si quedaron amontonados.
- **Probar** abre el juego con el mapa editado (`?prueba`), solo en ese navegador: arranca en el mundo editado, dice "mapa de prueba" y no da la insignia.
- **Exportar** da el texto del mapa y sus carteles; se aplica al juego en un commit, con las pruebas y el libro.
- Falta: cambiar el tamaño de un mapa y crear mundos nuevos.

## Lo que falta decidir

| Pieza | Opciones |
| --- | --- |
| Motor | Seguir con código propio o usar un motor web |
| Servidor | Cuentas, guardado en la nube, tiempo real para jugar de a dos |
| Medición | Registrar dónde está cada jugador y cuánto tarda |

---
_Actualizado: 2026-10-02_
