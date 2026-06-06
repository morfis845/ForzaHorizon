let todosLosAutos = [];
let autosFiltrados = [];
const rodillo = document.getElementById("rodillo");
let girando = false;
const ALTURA_CARD = 120;

// Estado del Auto Ganador Actual
let autoGanadorActual = null;

// Memoria Local: Carga el historial unificado guardado en el navegador
let historialTiempos =
  JSON.parse(localStorage.getItem("forza_leaderboard")) || [];

// Elementos UI
const contenedorPais = document.getElementById("filtro-pais");
const contenedorTipo = document.getElementById("filtro-tipo");
const contenedorClase = document.getElementById("filtro-clase");
const txtContador = document.getElementById("contador-autos");
const btnExportar = document.getElementById("btn-exportar");
const modalTiempos = document.getElementById("modal-tiempos");

const universoOpciones = { pais: new Set(), tipo: new Set(), clase: new Set() };
let paisesActivos = new Set(),
  tiposActivos = new Set(),
  clasesActivas = new Set();

// 1. Cargar el JSON e Inicializar
fetch("autos_fh6.json")
  .then((res) => res.json())
  .then((data) => {
    todosLosAutos = data;
    inicializarYCrearFiltros();
    filtrarAutos();
    configurarAccionesMasivas();
    actualizarBotonExportar();
    mostrarLeaderboardEnPantalla();
  })
  .catch((err) => console.error("Error cargando el archivo JSON:", err));

function actualizarBotonExportar() {
  if (btnExportar) {
    btnExportar.innerText = `📥 Descargar Excel (${historialTiempos.length})`;
  }
}

// 2. Mapear datos y pintar tags interactivos
function inicializarYCrearFiltros() {
  todosLosAutos.forEach((auto) => {
    if (auto.pais) {
      universoOpciones.pais.add(auto.pais);
      paisesActivos.add(auto.pais);
    }
    if (auto.tipo) {
      universoOpciones.tipo.add(auto.tipo);
      tiposActivos.add(auto.tipo);
    }
    if (auto.clase) {
      const partes = auto.clase.trim().split(" ");
      const letra = partes[partes.length - 1].toUpperCase();
      if (letra) {
        universoOpciones.clase.add(letra);
        clasesActivas.add(letra);
      }
    }
  });

  Array.from(universoOpciones.pais)
    .sort()
    .forEach((p) => contenedorPais.appendChild(crearTagElement(p, "pais")));
  Array.from(universoOpciones.tipo)
    .sort()
    .forEach((t) => contenedorTipo.appendChild(crearTagElement(t, "tipo")));

  const ordenForza = ["D", "C", "B", "A", "S1", "S2", "X"];
  Array.from(universoOpciones.clase)
    .sort((a, b) => ordenForza.indexOf(a) - ordenForza.indexOf(b))
    .forEach((c) => {
      contenedorClase.appendChild(crearTagElement(c, "clase"));
    });
}

function crearTagElement(valor, categoria) {
  const boton = document.createElement("div");
  boton.className = "tag-filtro activo";
  boton.innerText = categoria === "clase" ? `Clase ${valor}` : valor;
  boton.dataset.value = valor;

  boton.addEventListener("click", () => {
    if (girando) return;
    let setDestino =
      categoria === "tipo"
        ? tiposActivos
        : categoria === "clase"
          ? clasesActivas
          : paisesActivos;

    if (setDestino.has(valor)) {
      setDestino.delete(valor);
      boton.classList.remove("activo");
    } else {
      setDestino.add(valor);
      boton.classList.add("activo");
    }
    filtrarAutos();
  });
  return boton;
}

function filtrarAutos() {
  if (girando) return;
  autosFiltrados = todosLosAutos.filter((auto) => {
    const cumplePais = paisesActivos.has(auto.pais);
    const cumpleTipo = tiposActivos.has(auto.tipo);
    let cumpleClase = false;
    if (auto.clase) {
      const partes = auto.clase.trim().split(" ");
      const letraAuto = partes[partes.length - 1].toUpperCase();
      cumpleClase = clasesActivas.has(letraAuto);
    }
    return cumplePais && cumpleTipo && cumpleClase;
  });
  txtContador.innerText = `Autos disponibles en el filtro: ${autosFiltrados.length}`;
  construirRodilloVisual();
  mostrarLeaderboardEnPantalla();
}

function configurarAccionesMasivas() {
  const activarCategoria = (categoria, setDestino, contenedor) => {
    if (girando) return;
    setDestino.clear();
    universoOpciones[categoria].forEach((val) => setDestino.add(val));
    contenedor
      .querySelectorAll(".tag-filtro")
      .forEach((b) => b.classList.add("activo"));
    filtrarAutos();
  };

  const desactivarCategoria = (setDestino, contenedor) => {
    if (girando) return;
    setDestino.clear();
    contenedor
      .querySelectorAll(".tag-filtro")
      .forEach((b) => b.classList.remove("activo"));
    filtrarAutos();
  };

  document
    .getElementById("btn-activar-pais")
    .addEventListener("click", () =>
      activarCategoria("pais", paisesActivos, contenedorPais),
    );
  document
    .getElementById("btn-desactivar-pais")
    .addEventListener("click", () =>
      desactivarCategoria(paisesActivos, contenedorPais),
    );
  document
    .getElementById("btn-activar-tipo")
    .addEventListener("click", () =>
      activarCategoria("tipo", tiposActivos, contenedorTipo),
    );
  document
    .getElementById("btn-desactivar-tipo")
    .addEventListener("click", () =>
      desactivarCategoria(tiposActivos, contenedorTipo),
    );
  document
    .getElementById("btn-activar-clase")
    .addEventListener("click", () =>
      activarCategoria("clase", clasesActivas, contenedorClase),
    );
  document
    .getElementById("btn-desactivar-clase")
    .addEventListener("click", () =>
      desactivarCategoria(clasesActivas, contenedorClase),
    );
}

function construirRodilloVisual() {
  rodillo.innerHTML = "";
  rodillo.style.transition = "none";
  rodillo.style.transform = "translateY(0px)";

  if (autosFiltrados.length === 0) {
    rodillo.innerHTML = `<div class="auto-card"><span class="modelo">Ningún auto coincide.</span></div>`;
    return;
  }

  const listaMezclada = [...autosFiltrados].sort(() => Math.random() - 0.5);
  let copiasLista = [...listaMezclada];
  while (copiasLista.length < 60 && listaMezclada.length > 0) {
    copiasLista = copiasLista.concat(listaMezclada);
  }

  copiasLista.forEach((auto) => {
    const card = document.createElement("div");
    card.className = "auto-card";
    card.innerHTML = `
            <span class="marca">${auto.marca} [${auto.clase || "N/A"}]</span>
            <span class="modelo">${auto.modelo}</span>
        `;
    rodillo.appendChild(card);
  });
}

// 4. Mecánica de la Ruleta (Vinculada a tu id="btn-grid-girar")
document.getElementById("btn-grid-girar").addEventListener("click", () => {
  if (girando || autosFiltrados.length === 0) return;
  girando = true;
  document.getElementById("resultado").innerText = "";
  construirRodilloVisual();

  rodillo.getBoundingClientRect();

  const totalRenderizados = rodillo.children.length;
  const minOpciones = Math.min(totalRenderizados, 20);
  const maxOpciones = Math.min(totalRenderizados - 5, 50);

  const indiceGanador =
    Math.floor(Math.random() * (maxOpciones - minOpciones)) + minOpciones;
  const desplazamientoPixeles = indiceGanador * ALTURA_CARD;

  rodillo.style.transition = "transform 4s cubic-bezier(0.1, 0.9, 0.2, 1)";
  rodillo.style.transform = `translate3d(0, -${desplazamientoPixeles}px, 0)`;

  setTimeout(() => {
    const listaCardsRend = [...rodillo.querySelectorAll(".auto-card")];
    if (!listaCardsRend[indiceGanador]) {
      girando = false;
      return;
    }

    const modeloGanador = listaCardsRend[indiceGanador]
      .querySelector(".modelo")
      .innerText.trim();
    autoGanadorActual = autosFiltrados.find(
      (a) => a.modelo.trim() === modeloGanador,
    );

    if (!autoGanadorActual) {
      autoGanadorActual = {
        marca: "Desconocida",
        modelo: modeloGanador,
        clase: "D",
        pais: "",
        tipo: "",
      };
    }

    document.getElementById("resultado").innerText =
      `¡GANASTE: ${autoGanadorActual.modelo}!`;
    girando = false;

    setTimeout(() => abrirModalTiempos(autoGanadorActual), 1200);
  }, 4000);
});

// 5. LÓGICA DEL FORMULARIO DE TIEMPOS MODIFICADA (DIRECTA)
function abrirModalTiempos(auto) {
  document.getElementById("input-circuito").value = "";
  document.getElementById("modal-titulo-auto").innerText =
    `${auto.marca} - ${auto.modelo}`;

  const inputTipo = document.getElementById("input-tipo");
  const inputPais = document.getElementById("input-pais");
  const inputTraccion = document.getElementById("input-traccion");
  inputTraccion.value = "";

  if (auto.tipo && auto.tipo.trim() !== "") {
    inputTipo.value = auto.tipo;
    inputTipo.readOnly = true;
    inputTipo.style.opacity = "0.6";
  } else {
    inputTipo.value = "";
    inputTipo.readOnly = false;
    inputTipo.style.opacity = "1";
  }

  if (auto.pais && auto.pais.trim() !== "") {
    inputPais.value = auto.pais;
    inputPais.readOnly = true;
    inputPais.style.opacity = "0.6";
  } else {
    inputPais.value = "";
    inputPais.readOnly = false;
    inputPais.style.opacity = "1";
  }

  // Extraer dinámicamente datos sugeridos del JSON base si existen
  let piSugerido = "";
  let claseSugerida = "";
  if (auto.clase) {
    const partes = auto.clase.trim().split(" ");
    claseSugerida = partes[partes.length - 1].toUpperCase();
    const numeroEncontrado = partes[0].replace(/\D/g, "");
    if (numeroEncontrado) piSugerido = numeroEncontrado;
  }

  document.getElementById("race-pi").value = piSugerido;
  document.getElementById("race-tiempo").value = "";
  document.getElementById("race-clase").value = claseSugerida;

  modalTiempos.classList.add("activo");
}

document.getElementById("btn-modal-cancelar").addEventListener("click", () => {
  modalTiempos.classList.remove("activo");
});

// Guardado Limpio en Formato Plano sin duplicados
document.getElementById("form-tiempos").addEventListener("submit", (e) => {
  e.preventDefault();

  const piValor = parseInt(document.getElementById("race-pi").value) || 0;
  const tiempoValor = document.getElementById("race-tiempo").value.trim();
  const claseValor = document
    .getElementById("race-clase")
    .value.trim()
    .toUpperCase();
  const traccionValor = document
    .getElementById("input-traccion")
    .value.trim()
    .toUpperCase();
  const circuitoValor = document.getElementById("input-circuito").value.trim();

  const nuevoRegistro = {
    ID: historialTiempos.length + 1,
    CIRCUITO: circuitoValor,
    MARCA: autoGanadorActual.marca,
    MODELO: autoGanadorActual.modelo,
    "TIPO / CATEGORÍA": document.getElementById("input-tipo").value.trim(),
    PAÍS: document.getElementById("input-pais").value.trim(),
    TRACCION: traccionValor,
    PI: piValor,
    TIEMPO: tiempoValor,
    CLASE: claseValor,
  };

  // 🛠️ CORREGIDO: Se eliminó el segundo bloque idéntico que duplicaba el guardado
  historialTiempos.push(nuevoRegistro);
  localStorage.setItem("forza_leaderboard", JSON.stringify(historialTiempos));

  actualizarBotonExportar();
  mostrarLeaderboardEnPantalla();

  modalTiempos.classList.remove("activo");

  setTimeout(() => {
    alert(`¡Datos de ${autoGanadorActual.modelo} guardados exitosamente!`);
  }, 100);
});

// 6. EXPORTACIÓN LIMPIA A EXCEL (Estructura de columnas planas fijas)
btnExportar.addEventListener("click", () => {
  if (historialTiempos.length === 0) {
    alert(
      "Aún no tienes ningún tiempo registrado. ¡Gira la ruleta y compite primero!",
    );
    return;
  }
  const hojaLeaderboard = XLSX.utils.json_to_sheet(historialTiempos);
  const libroTrabajo = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    libroTrabajo,
    hojaLeaderboard,
    "Leaderboard General",
  );
  XLSX.writeFile(libroTrabajo, "Forza_6_Live_Leaderboard.xlsx");
});

// 7. LIMPIAR EL LEADERBOARD
document.getElementById("btn-limpiar").addEventListener("click", () => {
  if (historialTiempos.length === 0) {
    alert("El Leaderboard ya está completamente vacío.");
    return;
  }

  const confirmarBorrado = confirm(
    `⚠️ ¡ATENCIÓN! Está a punto de borrar permanentemente los ${historialTiempos.length} autos registrados.\n\n¿Desea continuar?`,
  );

  if (confirmarBorrado) {
    historialTiempos = [];
    localStorage.removeItem("forza_leaderboard");
    actualizarBotonExportar();
    mostrarLeaderboardEnPantalla();
    alert("📋 El Leaderboard ha sido reiniciado con éxito.");
  }
});

// 8. CONTROL DEL LEADERBOARD VISUAL EN PANTALLA
let columnaOrdenadaActual = "";
let ordenAscendente = true;

function mostrarLeaderboardEnPantalla() {
  const cuerpo = document.getElementById("cuerpo-tabla");
  const txtTotal = document.getElementById("total-registros");
  if (!cuerpo) return;
  cuerpo.innerHTML = "";

  // Filtrado en vivo de la tabla según los tags superiores seleccionados
  const registrosFiltrados = historialTiempos.filter((reg) => {
    const letraClase = reg.CLASE ? reg.CLASE.toUpperCase() : "D";
    return (
      paisesActivos.has(reg.PAÍS) &&
      tiposActivos.has(reg["TIPO / CATEGORÍA"]) &&
      clasesActivas.has(letraClase)
    );
  });

  if (txtTotal) {
    txtTotal.innerText = `${registrosFiltrados.length} de ${historialTiempos.length} autos mostrados`;
  }

  if (registrosFiltrados.length === 0) {
    // 🛠️ AJUSTADO: colspan="10" para abarcar la columna de Circuito correctamente
    cuerpo.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px; color:#666;">No hay tiempos registrados para los filtros activos.</td></tr>`;
    return;
  }

  // Pintar filas simplificadas tal como Excel
  registrosFiltrados.forEach((reg) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td style="color:#00ccff; font-weight:bold; text-align:center;">${reg.ID}</td>
      <td style="color:#ffcc00; font-weight:bold;">${reg.CIRCUITO || "N/A"}</td> 
      <td style="font-weight:bold; color:#fff;">${reg.MARCA}</td>
      <td>${reg.MODELO}</td>
      <td>${reg["TIPO / CATEGORÍA"]}</td>
      <td style="text-align:center;">${reg.PAÍS}</td>
      <td style="text-align:center; color:#ff0055; font-weight:bold;">${reg.TRACCION || "N/A"}</td>
      <td style="text-align:center; font-weight:bold; color:#fff;">${reg.PI}</td>
      <td style="color:#00ccff; font-weight:bold;">${reg.TIEMPO}</td>
      <td style="text-align:center; font-weight:bold; color:#fff;">${reg.CLASE}</td>
    `;
    cuerpo.appendChild(fila);
  });
}

function ordenarLeaderboard(columna) {
  if (columnaOrdenadaActual === columna) {
    ordenAscendente = !ordenAscendente;
  } else {
    columnaOrdenadaActual = columna;
    ordenAscendente = true;
  }

  historialTiempos.sort((a, b) => {
    let valA = a[columna];
    let valB = b[columna];

    if (valA === undefined || valA === null) valA = "";
    if (valB === undefined || valB === null) valB = "";

    if (typeof valA === "string") {
      return ordenAscendente
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return ordenAscendente ? valA - valB : valB - valA;
    }
  });

  mostrarLeaderboardEnPantalla();
}
