# El galpón (nivel 2)

**El nivel 2 del capítulo 1 es un galpón abandonado: mecanismos, ritmo y trampas que te devuelven al inicio, sin quitarte nada.** Se entra por una trampilla que se abre en la meta del nivel 1, dentro de la casa. Sigue siendo la era 1: oscuridad, blanco y negro.

## Recorrido

1. **Entrada.** Un cartel avisa de costado ("Lo que suena hueco, cede.") y la primera baldosa floja está en la salida: se cruza una vez; si se vuelve sobre ella, se cae a dos pasos del inicio.
2. **Depósito.** Estanterías en zigzag, a oscuras. La tiza está en un rincón y la cuerda al fondo de la última calle.
3. **Campo de baldosas flojas.** "Cada paso cuenta una vez." La piedra está en el medio: hay que entrar, tomarla y salir sin pisar dos veces la misma baldosa, esquivando tres pozos.
4. **La placa.** Abre la compuerta mientras algo la pisa. Está lejos de la compuerta: pisándola no se llega a pasar, pero con la piedra encima queda abierta para siempre.
5. **Sala de abajo.** Una cinta cruza la sala hacia un pozo. En el medio, el pozo con bajada: con la cuerda se baja al sótano. Junto a la compuerta, el tobogán: "El camino corto es el más largo."
6. **Sótano.** Tres baldosas flojas sobre pozos, el engranaje y una escalera al fondo, que sube junto al pozo.
7. **Prensas y montacargas.** Tres prensas golpean con ritmo, cada una a destiempo. El montacargas se arregla con el engranaje y sube a la meta del nivel.

## Trampas

Las trampas mueven al jugador, pero no le quitan nada: lo tomado y lo resuelto (la piedra puesta, el montacargas arreglado) se conservan. Al caer, las baldosas flojas vuelven a estar sanas.

| Trampa | Aviso | Te manda a |
| --- | --- | --- |
| Baldosa floja | Cruje y se agrieta a la primera pisada | Inicio del nivel 2, a la segunda pisada |
| Pozo | Borde punteado | Inicio del nivel 2 (salvo la bajada, con la cuerda) |
| Cinta | Chevrones que avanzan y un motor grave | Al pozo del final si no te bajás a tiempo |
| Prensa | Golpe metálico con ritmo; la baldosa se oscurece antes de bajar | Inicio del nivel 2. El escudo la aguanta una vez |
| Tobogán | Un cartel al lado | La plaza del inicio del nivel 1 |

## Objetos nuevos

| Objeto | Para qué |
| --- | --- |
| Tiza | Quedarse quieto un momento marca el piso con una cruz (o la borra). No es obligatoria |
| Cuerda | Con ella, el pozo con bajada lleva al sótano en lugar de hacerte caer |
| Piedra | Pisar la placa llevándola la deja encima: la compuerta queda abierta |
| Engranaje | Arregla el montacargas |

## Progreso

Al terminar el nivel 1 se guarda el progreso en el navegador: la próxima vez se empieza en el galpón, con los poderes y la visión ganados. En la ciudad queda abierto el camino a la casa, para volver si el tobogán te manda allá. Con `?nueva` en la dirección se empieza de cero.

## Validación

`npm run validar` revisa con BFS que cada tramo se alcance con lo que se tiene en ese momento, que la piedra y el engranaje se puedan tomar sin pisar dos veces una baldosa floja y que no queden casillas aisladas. `npm test` recorre las trampas, la trampilla, el tobogán y el progreso guardado.

---
_Actualizado: 2026-10-09_
