// Cálculo del JADAS (Juvenile Arthritis Disease Activity Score) y cJADAS.
//
// JADAS = evaluación global del médico (0-10)
//       + evaluación global del paciente/padres (0-10)
//       + recuento de articulaciones activas (con tope según la versión)
//       + VSG normalizada (0-10)
// cJADAS (clínico) = lo mismo sin la VSG.
//
// VSG normalizada = (VSG - 20) / 10, con VSG < 20 -> 20 y VSG > 120 -> 120.
// Consolaro A, et al. Arthritis Rheum 2009;61:658-66.

export const VERSIONES = {
  10: { tope: 10, nombre: "JADAS-10" },
  27: { tope: 27, nombre: "JADAS-27" },
  71: { tope: 71, nombre: "JADAS-71" },
};

// Articulaciones que se evalúan en el JADAS-27.
export const ARTICULACIONES_27 = [
  "Columna cervical",
  "Codos (2)",
  "Muñecas (2)",
  "MCF 1.ª a 3.ª (6)",
  "IFP 1.ª a 5.ª de manos (10)",
  "Caderas (2)",
  "Rodillas (2)",
  "Tobillos (2)",
];

// Puntos de corte de Consolaro A, et al. Arthritis Care Res 2014;66:1703-9.
// Cada valor es el límite superior (inclusive) de inactiva, baja y moderada;
// por encima del último es actividad alta.
export const PUNTOS_DE_CORTE = {
  JADAS: {
    oligo: { 10: [1, 2, 4.2], 27: [1, 2, 4.2], 71: [1, 2, 4.2] },
    poli: { 10: [1, 3.8, 10.5], 27: [1, 3.8, 8.5], 71: [1, 3.8, 10.5] },
  },
  cJADAS: {
    oligo: { 10: [1, 1.5, 4] },
    poli: { 10: [1, 2.5, 8.5] },
  },
};

export const CATEGORIAS = [
  { id: "inactiva", nombre: "Enfermedad inactiva" },
  { id: "baja", nombre: "Actividad baja" },
  { id: "moderada", nombre: "Actividad moderada" },
  { id: "alta", nombre: "Actividad alta" },
];

export function vsgNormalizada(vsg) {
  const acotada = Math.min(Math.max(vsg, 20), 120);
  return (acotada - 20) / 10;
}

function validarRango(nombre, valor, min, max) {
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    throw new Error(`${nombre}: falta el valor`);
  }
  if (valor < min || valor > max) {
    throw new Error(`${nombre}: debe estar entre ${min} y ${max}`);
  }
}

// datos: { version, medico, paciente, articulaciones, vsg? }
// Devuelve { articulacionesComputadas, vsgNormalizada, jadas, cjadas }.
// jadas es null si no se cargó la VSG.
export function calcular({ version, medico, paciente, articulaciones, vsg }) {
  const v = VERSIONES[version];
  if (!v) throw new Error("Versión de JADAS desconocida");
  validarRango("Evaluación del médico", medico, 0, 10);
  validarRango("Evaluación del paciente/padres", paciente, 0, 10);
  validarRango("Articulaciones activas", articulaciones, 0, v.tope === 10 ? 71 : v.tope);
  if (!Number.isInteger(articulaciones)) {
    throw new Error("Articulaciones activas: debe ser un número entero");
  }

  const articulacionesComputadas = Math.min(articulaciones, v.tope);
  const cjadas = redondear(medico + paciente + articulacionesComputadas);

  let vsgN = null;
  let jadas = null;
  if (vsg !== undefined && vsg !== null && !Number.isNaN(vsg)) {
    validarRango("VSG", vsg, 0, 200);
    vsgN = vsgNormalizada(vsg);
    jadas = redondear(cjadas + vsgN);
  }

  return { articulacionesComputadas, vsgNormalizada: vsgN, jadas, cjadas };
}

// tipo: "JADAS" | "cJADAS"; subtipo: "oligo" | "poli".
// Devuelve la categoría o null si no hay puntos de corte validados.
export function clasificar(tipo, subtipo, version, puntaje) {
  const cortes = PUNTOS_DE_CORTE[tipo]?.[subtipo]?.[version];
  if (!cortes || puntaje === null) return null;
  const indice = cortes.findIndex((limite) => puntaje <= limite);
  return CATEGORIAS[indice === -1 ? 3 : indice];
}

function redondear(n) {
  return Math.round(n * 10) / 10;
}
