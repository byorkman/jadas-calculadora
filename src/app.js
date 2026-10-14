import { VERSIONES, ARTICULACIONES_27, calcular, clasificar } from "./jadas.js";

const form = document.getElementById("form");
const resultado = document.getElementById("resultado");
const articulaciones = document.getElementById("articulaciones");

document.getElementById("articulaciones27").innerHTML =
  ARTICULACIONES_27.map((a) => `<li>${a}</li>`).join("");

function seleccionado(nombre) {
  return form.querySelector(`input[name="${nombre}"]:checked`).value;
}

function numero(id) {
  const valor = document.getElementById(id).value.trim();
  return valor === "" ? null : Number(valor);
}

function tarjeta(titulo, puntaje, maximo, categoria) {
  const clase = categoria ? categoria.id : "sin-corte";
  const texto = categoria ? categoria.nombre : "Sin puntos de corte validados para esta versión";
  return `
    <div class="tarjeta ${clase}">
      <div class="titulo">${titulo}</div>
      <div class="puntaje">${puntaje.toLocaleString("es-AR")}<span> / ${maximo}</span></div>
      <div class="categoria">${texto}</div>
    </div>`;
}

function actualizar() {
  const version = Number(seleccionado("version"));
  const subtipo = seleccionado("subtipo");
  const { tope, nombre } = VERSIONES[version];

  document.getElementById("medicoValor").textContent = numero("medico").toLocaleString("es-AR");
  document.getElementById("pacienteValor").textContent = numero("paciente").toLocaleString("es-AR");
  document.getElementById("lista27").hidden = version !== 27;
  document.getElementById("topeArt").textContent =
    version === 10 ? "se computan hasta 10" : `de las ${tope} evaluadas`;
  articulaciones.max = version === 10 ? 71 : tope;

  try {
    const r = calcular({
      version,
      medico: numero("medico"),
      paciente: numero("paciente"),
      articulaciones: numero("articulaciones"),
      vsg: numero("vsg"),
    });
    const maxC = 20 + tope;
    let html = "";
    if (r.jadas !== null) {
      html += tarjeta(nombre, r.jadas, maxC + 10, clasificar("JADAS", subtipo, version, r.jadas));
    }
    html += tarjeta(`c${nombre}`, r.cjadas, maxC, clasificar("cJADAS", subtipo, version, r.cjadas));
    const detalle = [
      `Articulaciones computadas: ${r.articulacionesComputadas}`,
      r.vsgNormalizada !== null ? `VSG normalizada: ${r.vsgNormalizada.toLocaleString("es-AR")}` : null,
    ].filter(Boolean).join(" · ");
    resultado.innerHTML = html + `<p class="detalle">${detalle}</p>`;
  } catch (e) {
    resultado.innerHTML = `<p class="error">${e.message}</p>`;
  }
}

form.addEventListener("input", actualizar);
form.querySelectorAll("[data-paso]").forEach((boton) =>
  boton.addEventListener("click", () => {
    const nuevo = (Number(articulaciones.value) || 0) + Number(boton.dataset.paso);
    articulaciones.value = Math.min(Math.max(nuevo, 0), Number(articulaciones.max));
    actualizar();
  })
);
actualizar();
