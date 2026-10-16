# Calculadora JADAS

Calculadora web de actividad de la artritis idiopática juvenil (JADAS-10, JADAS-27, JADAS-71 y sus versiones clínicas cJADAS). Pensada para usar desde el celular durante la consulta.

**No guarda ni envía datos.** Todo el cálculo se hace en el navegador.

## Cómo se calcula

- **JADAS** = evaluación global del médico (0-10) + evaluación global del paciente o los padres (0-10) + articulaciones activas + VSG normalizada (0-10).
- **cJADAS** = lo mismo, sin la VSG.
- Articulaciones: JADAS-10 computa hasta 10 aunque haya más; JADAS-27 y JADAS-71 cuentan sobre 27 y 71 articulaciones.
- VSG normalizada = (VSG − 20) / 10, tomando VSG < 20 como 20 y VSG > 120 como 120.

Fuente: Consolaro A, et al. *Arthritis Rheum* 2009;61:658-66.

## Puntos de corte

Consolaro A, et al. *Arthritis Care Res* 2014;66:1703-9. Límite superior de cada categoría:

| | Inactiva | Baja | Moderada | Alta |
|---|---|---|---|---|
| JADAS-10/71 oligo | ≤ 1 | ≤ 2 | ≤ 4,2 | > 4,2 |
| JADAS-27 oligo | ≤ 1 | ≤ 2 | ≤ 4,2 | > 4,2 |
| JADAS-10/71 poli | ≤ 1 | ≤ 3,8 | ≤ 10,5 | > 10,5 |
| JADAS-27 poli | ≤ 1 | ≤ 3,8 | ≤ 8,5 | > 8,5 |
| cJADAS-10 oligo | ≤ 1 | ≤ 1,5 | ≤ 4 | > 4 |
| cJADAS-10 poli | ≤ 1 | ≤ 2,5 | ≤ 8,5 | > 8,5 |

Para cJADAS-27 y cJADAS-71 la app muestra el puntaje sin categoría.

Los valores están en `src/jadas.js` (`PUNTOS_DE_CORTE`); si se prefieren otros (por ejemplo, los del ACR 2021), se cambian ahí.

## Desarrollo

Es un sitio estático, sin dependencias ni compilación.

```sh
npm test               # corre las pruebas de los cálculos
npx serve .            # o cualquier servidor estático para verlo localmente
```

## Versión

La versión se ve al pie de la página. En cada cambio:

1. Agregar arriba en [`CHANGELOG.md`](CHANGELOG.md) una entrada `## X.Y.Z · día mes año` con lo que cambió.
2. Poner el mismo número en `package.json` y el mismo texto (`vX.Y.Z · día mes año`) en el pie de `index.html`.

Se sube el último número para arreglos y textos, el del medio para funciones nuevas y el primero para cambios grandes. `npm test` avisa si los tres lugares no coinciden.

## Publicar en Vercel

En Vercel: **Add New → Project → Import** este repositorio, con Framework Preset **Other** y sin comando de build. Cada cambio que entre a `main` se publica solo.

> Herramienta de apoyo; no reemplaza el criterio clínico.
