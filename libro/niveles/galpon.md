# El galpón (nivel 2)

**El nivel 2 del capítulo 1 es un galpón abandonado: mecanismos, ritmo y trampas que te devuelven al inicio, sin quitarte nada.** Al cerrar el resumen del nivel 1, el primer movimiento abre una trampilla bajo tus pies, en la meta de la casa, y se cae al galpón. La trampilla queda a la vista, para volver si el tobogán te manda a la ciudad. Sigue siendo la era 1: oscuridad, blanco y negro.

[Jugar el nivel 2](https://elpunto-mu.vercel.app/?nivel=2): empieza directo en el galpón con el libro y el sombrero, lo que el nivel 1 garantiza. No toca el progreso guardado ni da la insignia.

## Recorrido

1. **Entrada.** Un cartel avisa de costado ("Lo que suena hueco, cede.") y la primera baldosa floja está en la salida: se cruza una vez; si se vuelve sobre ella, se cae a dos pasos del inicio.
2. **Depósito.** Estanterías en zigzag, a oscuras. La tiza está en un rincón y la cuerda al fondo de la última calle.
3. **Campo de baldosas flojas.** "Cada paso cuenta una vez." La piedra está en el medio: hay que entrar, tomarla y salir sin pisar dos veces la misma baldosa, esquivando tres pozos.
4. **La placa.** Abre la compuerta mientras algo la pisa. Está lejos de la compuerta: pisándola no se llega a pasar, pero con la piedra encima queda abierta para siempre.
5. **Sala de abajo.** Una cinta cruza la sala hacia un pozo. En el medio, el pozo con bajada: con la cuerda se baja al sótano. Junto a la compuerta, el tobogán: "El camino corto es el más largo."
6. **Sótano.** Tres baldosas flojas sobre pozos, el engranaje y una escalera al fondo, que sube junto al pozo.
7. **Prensas y montacargas.** Tres prensas golpean con ritmo, cada una a destiempo. El montacargas se arregla con el engranaje y sube a la meta del nivel.

## Puntos de partida

Tres baldosas con una banderita: a la entrada del campo de baldosas flojas, frente a la compuerta y antes de las prensas. Al pisarlas se encienden con un acorde corto. Bajar al sótano y subir de él también guardan el lugar. Las trampas te devuelven al último punto de partida, no a la entrada: equivocarse cuesta unos pasos, no el nivel entero.

## Trampas

Las trampas mueven al jugador, pero no le quitan nada: lo tomado y lo resuelto (la piedra puesta, el montacargas arreglado) se conservan. Al caer, las baldosas flojas vuelven a estar sanas.

| Trampa | Aviso | Te manda a |
| --- | --- | --- |
| Baldosa floja | Se dibuja como tablas sueltas; cruje y se agrieta a la primera pisada; al lado de una ya rota se oye un quejido de madera | Último punto de partida, a la segunda pisada |
| Pozo | Borde punteado y viento al acercarse | Último punto de partida (salvo la bajada, con la cuerda) |
| Cinta | Chevrones que avanzan y un motor grave; una casilla cada 0,28 s | Al pozo del final si no te bajás a tiempo |
| Prensa | Golpe metálico con ritmo, un tic medio segundo antes y la baldosa se oscurece. Baja 0,55 s cada 2,8 s | Último punto de partida. El escudo la aguanta una vez |
| Tobogán | Un cartel al lado | La plaza del inicio del nivel 1 |

## Objetos nuevos

| Objeto | Para qué |
| --- | --- |
| Tiza | Quedarse quieto tres segundos marca el piso con una cruz (o la borra). No es obligatoria |
| Chispas | Dos: una en el medio del depósito y otra en el sótano |
| Cuerda | Con ella, el pozo con bajada lleva al sótano en lugar de hacerte caer |
| Piedra | Pisar la placa llevándola la deja encima: la compuerta queda abierta |
| Engranaje | Arregla el montacargas |

## Carteles

Nueve en el galpón y uno en el sótano. Dan pistas de costado, sin instrucciones: "Lo que se marca, no se pierde." (tiza), "Lo que se ata, baja." (cuerda), "Lo que pesa, sostiene." (piedra y placa), "La cinta no espera.", "No todo pozo es una caída.", "Los golpes tienen su cuenta." (prensas), "Al montacargas le falta un diente." (engranaje) y, en el sótano, "Abajo también cede."

## Cómo se juega (prueba del 10 oct 2026)

Un jugador automático que usa solo el teclado lo terminó en un minuto, sin caídas, tomando las dos chispas. Una persona que no conoce el mapa tarda bastante más: el depósito a oscuras es lo más largo. Lo que encontró la prueba y ya se corrigió: las baldosas sanas parecían tildadas (✓) y después se confundían con pozos, y la tiza marcaba el piso cada vez que uno se quedaba quieto a pensar.

## Progreso

Al terminar el nivel 1 se guarda el progreso en el navegador: la próxima vez se empieza en el galpón, con los poderes y la visión ganados. En la ciudad queda abierto el camino a la casa, para volver si el tobogán te manda allá. Con `?nueva` en la dirección se empieza de cero.

## Validación

`npm run validar` revisa con BFS que cada tramo se alcance con lo que se tiene en ese momento, que la piedra y el engranaje se puedan tomar sin pisar dos veces una baldosa floja y que no queden casillas aisladas. `npm test` recorre las trampas, la trampilla, el tobogán y el progreso guardado.

---
_Actualizado: 2026-10-10_
