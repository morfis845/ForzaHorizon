let todosLosAutos = [];
let autosFiltrados = [];
const rodillo = document.getElementById("rodillo");
let girando = false;
const ALTURA_CARD = 120;

// Estado del Auto Ganador Actual
let autoGanadorActual = null;

// Memoria Local: Carga el historial guardado en el navegador del usuario
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
  });

function actualizarBotonExportar() {
  btnExportar.innerText = `📥 Descargar Excel (${historialTiempos.length})`;
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
}

// 3. Configuración de botones de activación masiva por categoría
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

// 4. Mecánica de la Ruleta y captura del ganador
// 4. Mecánica de la Ruleta y captura del ganador corregida
// 4. Mecánica de la Ruleta Optimizada para PC y Móviles (GPU Accelerated)
document.getElementById("btn-girar").addEventListener("click", () => {
  if (girando || autosFiltrados.length === 0) return;
  girando = true;
  document.getElementById("resultado").innerText = "";
  construirRodilloVisual();

  // Forzar al navegador a procesar el render antes de animar
  rodillo.getBoundingClientRect();

  const totalRenderizados = rodillo.children.length;
  const minOpciones = Math.min(totalRenderizados, 20); // Reducimos un poco el viaje en móvil para evitar lag
  const maxOpciones = Math.min(totalRenderizados - 5, 50);

  const indiceGanador =
    Math.floor(Math.random() * (maxOpciones - minOpciones)) + minOpciones;
  const desplazamientoPixeles = indiceGanador * ALTURA_CARD;

  // Usamos translate3d para activar la GPU del celular y que vaya a 60fps sin tirones
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

    // Un pequeño delay extra para que el sistema móvil procese el fin de la animación
    setTimeout(() => abrirModalTiempos(autoGanadorActual), 1200);
  }, 4000);
});

// --- 5. LÓGICA DEL FORMULARIO DE TIEMPOS (MODAL) ---

function abrirModalTiempos(auto) {
  document.getElementById("modal-titulo-auto").innerText =
    `${auto.marca} - ${auto.modelo}`;

  const inputTipo = document.getElementById("input-tipo");
  const inputPais = document.getElementById("input-pais");

  // Rellenar Tipo
  if (auto.tipo && auto.tipo.trim() !== "") {
    inputTipo.value = auto.tipo;
    inputTipo.readOnly = true;
    inputTipo.style.opacity = "0.6";
    inputTipo.style.background = "#16161a";
  } else {
    inputTipo.value = "";
    inputTipo.readOnly = false;
    inputTipo.style.opacity = "1";
    inputTipo.style.background = "#1d1d22";
  }

  // Rellenar País
  if (auto.pais && auto.pais.trim() !== "") {
    inputPais.value = auto.pais;
    inputPais.readOnly = true;
    inputPais.style.opacity = "0.6";
    inputPais.style.background = "#16161a";
  } else {
    inputPais.value = "";
    inputPais.readOnly = false;
    inputPais.style.opacity = "1";
    inputPais.style.background = "#1d1d22";
  }

  // Limpiar campos de telemetría para la nueva carrera
  document.getElementById("f1-pi").value = auto.clase || "";
  document.getElementById("f1-tiempo").value = "";
  document.getElementById("f1-vueltas").value = "";
  document.getElementById("f2-pi").value = "";
  document.getElementById("f2-tiempo").value = "";
  document.getElementById("f2-vueltas").value = "";
  document.getElementById("f3-pi").value = "";
  document.getElementById("f3-tiempo").value = "";
  document.getElementById("f3-vueltas").value = "";

  modalTiempos.classList.add("activo");
}

document.getElementById("btn-modal-cancelar").addEventListener("click", () => {
  modalTiempos.classList.remove("activo");
});

// Procesamiento matemático y almacenamiento
document.getElementById("form-tiempos").addEventListener("submit", (e) => {
  e.preventDefault();

  const tStock = document.getElementById("f1-tiempo").value;
  const tProject = document.getElementById("f3-tiempo").value;

  // Convertidor mm:ss.000 a segundos flotantes
  const convertirASegundos = (str) => {
    const partes = str.split(":");
    if (partes.length < 2) return parseFloat(str) || 0;
    return parseInt(partes[0]) * 60 + parseFloat(partes[1]);
  };

  const segStock = convertirASegundos(tStock);
  const segProject = convertirASegundos(tProject);
  const delta = segStock - segProject;

  const piStock = parseInt(document.getElementById("f1-pi").value) || 0;
  const piProject = parseInt(document.getElementById("f3-pi").value) || 0;
  const eficiencia = delta > 0 ? ((piProject - piStock) / delta).toFixed(1) : 0;

  let estado = "🟢 Equilibrado";
  if (delta > 6) estado = "🔥 Matagigantes";
  else if (delta < 3) estado = "❌ Inconducible";

  const nuevoRegistro = {
    ID: historialTiempos.length + 1,
    MARCA: autoGanadorActual.marca,
    MODELO: autoGanadorActual.modelo,
    "TIPO / CATEGORÍA": document.getElementById("input-tipo").value,
    PAÍS: document.getElementById("input-pais").value,
    TRACCIÓN: autoGanadorActual.traccion || "RWD",
    "PI STOCK": piStock,
    "TIEMPO STOCK": tStock,
    "VUELTAS STOCK": parseInt(document.getElementById("f1-vueltas").value) || 0,
    "PI TUNED": parseInt(document.getElementById("f2-pi").value) || 0,
    "TIEMPO TUNED": document.getElementById("f2-tiempo").value,
    "VUELTAS TUNED": parseInt(document.getElementById("f2-vueltas").value) || 0,
    "PI PROJECT": piProject,
    "TIEMPO PROJECT": tProject,
    "VUELTAS PROJECT":
      parseInt(document.getElementById("f3-vueltas").value) || 0,
    "DELTA TOTAL (s)": `${delta.toFixed(3)}s`,
    "EFICIENCIA PI": `${eficiencia} PI/s`,
    ESTADO: estado,
  };

  historialTiempos.push(nuevoRegistro);
  localStorage.setItem("forza_leaderboard", JSON.stringify(historialTiempos));
  actualizarBotonExportar();

  modalTiempos.classList.remove("activo");
  alert(`¡Datos de ${autoGanadorActual.modelo} guardados exitosamente!`);
});

// --- 6. EXPORTACIÓN A EXCEL ---
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
// --- 7. LÓGICA PARA LIMPIAR EL LEADERBOARD ---
document.getElementById("btn-limpiar").addEventListener("click", () => {
  if (historialTiempos.length === 0) {
    alert("El Leaderboard ya está completamente vacío.");
    return;
  }

  // Alerta de seguridad para evitar accidentes
  const confirmarBorrado = confirm(
    `⚠️ ¡ATENCIÓN! Está a punto de borrar permanentemente los ${historialTiempos.length} autos registrados en su tabla de tiempos.\n\n¿Desea continuar?`,
  );

  if (confirmarBorrado) {
    // 1. Vaciar el arreglo en memoria rápida
    historialTiempos = [];

    // 2. Limpiar el almacenamiento del navegador
    localStorage.removeItem("forza_leaderboard");

    // 3. Actualizar la interfaz gráfica
    actualizarBotonExportar();

    alert(
      "📋 El Leaderboard ha sido reiniciado con éxito. ¡Listo para una nueva temporada!",
    );
  }
});
