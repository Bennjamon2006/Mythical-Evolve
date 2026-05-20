# Mythical-Evolve

Una simulación evolutiva caótica creada en una tarde de curiosidad.

Cada criatura posee atributos, genes y un color heredable. A partir de unas pocas reglas simples, el ecosistema evoluciona por sí solo: nacen linajes, aparecen depredadores dominantes, surgen dinastías y, ocasionalmente, entidades divinas alteran el equilibrio del mundo.

Todo se representa como círculos moviéndose en un `<canvas>`.

Sorprendentemente, eso es suficiente.

## Mecánicas

Las criaturas pueden:

- Desplazarse por el mundo.
- Buscar otras criaturas cercanas.
- Reproducirse con individuos compatibles.
- Devorar individuos incompatibles.
- Heredar genes de sus progenitores.
- Heredar y mezclar colores.
- Morir por falta de interacción.
- Fundar linajes que pueden sobrevivir durante generaciones.

Además, existe una pequeña probabilidad de que aparezca una criatura divina:

- Color dorado.
- Gen `"god"`.
- Estadísticas iniciales muy superiores al promedio.
- Capaz de alterar drásticamente la evolución del ecosistema.

## Algunas observaciones reales

Durante distintas ejecuciones se registraron eventos como:

- Un dios dominó el ecosistema completo.
- Un mortal devoró a varios dioses.
- Una criatura de generación 0 sobrevivió hasta el final del universo.
- La población superó los 300 individuos antes de colapsar.
- Linajes completos aparecieron, prosperaron y desaparecieron.
- Varias generaciones coexistieron simultáneamente.
- Un dios ancestral (`Generation -1`) fue el último superviviente del mundo.

## Filosofía

Mythical-Evolve no intenta ser una simulación biológicamente correcta.

La idea es explorar cómo comportamientos complejos pueden emerger a partir de reglas extremadamente simples.

Gran parte de la diversión proviene de observar el ecosistema y descubrir historias que nadie programó explícitamente.

## Ejecutar

Abrir `index.html` en un navegador moderno.

No requiere dependencias ni proceso de compilación.

## Controles

Desde la consola del navegador:

```js
reset();
```

Reinicia el ecosistema mediante intervención divina.

---

_"Todo comenzó con unos círculos moviéndose al azar. Luego aparecieron dioses."_ 😄
