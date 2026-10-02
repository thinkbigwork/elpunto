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
- Desde el 2 oct 2026 el código vive en un repositorio y se trabaja con Claude Code: el juego, este libro en Markdown, los solvers de los cuartos y las pruebas automáticas.
- Cada mapa de la ciudad se valida con un BFS por etapas (`npm run validar:ciudad`): cada tramo de la progresión se alcanza con lo que el jugador tiene en ese momento, y ninguna casilla queda aislada.

## Lo que falta decidir

| Pieza | Opciones |
| --- | --- |
| Motor | Seguir con código propio o usar un motor web |
| Servidor | Cuentas, guardado en la nube, tiempo real para jugar de a dos |
| Editor de niveles | Dibujar mapas, ubicar objetos, importar calles reales |
| Medición | Registrar dónde está cada jugador y cuánto tarda |

---
_Actualizado: 2026-10-02_
