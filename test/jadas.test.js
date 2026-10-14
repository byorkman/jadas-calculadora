import { test } from "node:test";
import assert from "node:assert/strict";
import { calcular, clasificar, vsgNormalizada } from "../src/jadas.js";

test("VSG normalizada acota entre 20 y 120", () => {
  assert.equal(vsgNormalizada(5), 0);
  assert.equal(vsgNormalizada(20), 0);
  assert.equal(vsgNormalizada(35), 1.5);
  assert.equal(vsgNormalizada(120), 10);
  assert.equal(vsgNormalizada(150), 10);
});

test("JADAS-10 topea las articulaciones en 10", () => {
  const r = calcular({ version: 10, medico: 6, paciente: 5.5, articulaciones: 14, vsg: 45 });
  assert.equal(r.articulacionesComputadas, 10);
  assert.equal(r.cjadas, 21.5);
  assert.equal(r.jadas, 24);
});

test("JADAS-27 y JADAS-71 no topean por debajo de su máximo", () => {
  assert.equal(calcular({ version: 27, medico: 0, paciente: 0, articulaciones: 14 }).cjadas, 14);
  assert.equal(calcular({ version: 71, medico: 1, paciente: 1, articulaciones: 40 }).cjadas, 42);
});

test("sin VSG solo hay cJADAS", () => {
  const r = calcular({ version: 10, medico: 2, paciente: 1, articulaciones: 1, vsg: null });
  assert.equal(r.jadas, null);
  assert.equal(r.cjadas, 4);
});

test("valores fuera de rango dan error", () => {
  assert.throws(() => calcular({ version: 10, medico: 11, paciente: 0, articulaciones: 0 }));
  assert.throws(() => calcular({ version: 27, medico: 0, paciente: 0, articulaciones: 30 }));
  assert.throws(() => calcular({ version: 10, medico: 0, paciente: 0, articulaciones: 1.5 }));
  assert.throws(() => calcular({ version: 10, medico: null, paciente: 0, articulaciones: 0 }));
});

test("clasificación JADAS-10 oligoarticular", () => {
  assert.equal(clasificar("JADAS", "oligo", 10, 1).id, "inactiva");
  assert.equal(clasificar("JADAS", "oligo", 10, 2).id, "baja");
  assert.equal(clasificar("JADAS", "oligo", 10, 4.2).id, "moderada");
  assert.equal(clasificar("JADAS", "oligo", 10, 4.3).id, "alta");
});

test("clasificación JADAS poliarticular según versión", () => {
  assert.equal(clasificar("JADAS", "poli", 10, 3.8).id, "baja");
  assert.equal(clasificar("JADAS", "poli", 10, 10.5).id, "moderada");
  assert.equal(clasificar("JADAS", "poli", 27, 9).id, "alta");
  assert.equal(clasificar("JADAS", "poli", 71, 9).id, "moderada");
});

test("clasificación cJADAS-10", () => {
  assert.equal(clasificar("cJADAS", "oligo", 10, 1.5).id, "baja");
  assert.equal(clasificar("cJADAS", "oligo", 10, 4.5).id, "alta");
  assert.equal(clasificar("cJADAS", "poli", 10, 2.5).id, "baja");
  assert.equal(clasificar("cJADAS", "poli", 10, 8.5).id, "moderada");
});

test("cJADAS-27 y cJADAS-71 no tienen puntos de corte", () => {
  assert.equal(clasificar("cJADAS", "poli", 27, 5), null);
  assert.equal(clasificar("cJADAS", "oligo", 71, 5), null);
});
