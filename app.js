let todosLosAutos = [];
let autosFiltrados = [];
const rodillo = document.getElementById("rodillo");
let girando = false;
const ALTURA_CARD = 120;

// Contenedores de la Interfaz
const contenedorPais = document.getElementById("filtro-pais");
const contenedorTipo = document.getElementById("filtro-tipo");
const contenedorClase = document.getElementById("filtro-clase");
const txtContador = document.getElementById("contador-autos");

// Universos de opciones descubiertas en el JSON
const universoOpciones = {
  pais: new Set(),
  tipo: new Set(),
  clase: new Set(),
};

let paisesActivos = new Set();
let tiposActivos = new Set();
let clasesActivas = new Set();

// 1. Cargar el JSON
fetch("autos_fh6.json")
  .then((response) => response.json())
  .then((data) => {
    todosLosAutos = data;
    inicializarYCrearFiltros();
    filtrarAutos();
    configurarAccionesMasivas();
  });

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

// 3. Lógica para los nuevos botones de control por categoría
function configurarAccionesMasivas() {
  // Función genérica para activar una categoría completa
  const activarCategoria = (categoria, setDestino, contenedor) => {
    if (girando) return;
    setDestino.clear();
    universoOpciones[categoria].forEach((val) => setDestino.add(val));
    contenedor
      .querySelectorAll(".tag-filtro")
      .forEach((b) => b.classList.add("activo"));
    filtrarAutos();
  };

  // Función genérica para desactivar una categoría completa
  const desactivarCategoria = (setDestino, contenedor) => {
    if (girando) return;
    setDestino.clear();
    contenedor
      .querySelectorAll(".tag-filtro")
      .forEach((b) => b.classList.remove("activo"));
    filtrarAutos();
  };

  // Listeners de Países
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

  // Listeners de Tipos
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

  // Listeners de Clases
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
            <span class="marca">${auto.marca} [${auto.clase}]</span>
            <span class="modelo">${auto.modelo}</span>
        `;
    rodillo.appendChild(card);
  });
}

// 4. Mecánica de la Ruleta
document.getElementById("btn-girar").addEventListener("click", () => {
  if (girando || autosFiltrados.length === 0) return;
  girando = true;
  document.getElementById("resultado").innerText = "";

  construirRodilloVisual();
  rodillo.offsetHeight;

  const totalRenderizados = rodillo.children.length;
  const minOpciones = Math.min(totalRenderizados, 30);
  const maxOpciones = Math.min(totalRenderizados - 5, 120);

  const indiceGanador =
    Math.floor(Math.random() * (maxOpciones - minOpciones)) + minOpciones;
  const desplazamientoPixeles = indiceGanador * ALTURA_CARD;

  rodillo.style.transition = "transform 4.5s cubic-bezier(0.1, 0.9, 0.15, 1)";
  rodillo.style.transform = `translateY(-${desplazamientoPixeles}px)`;

  setTimeout(() => {
    const nodoGanador = rodillo.children[indiceGanador];
    if (nodoGanador.querySelector(".modelo")) {
      const modeloText = nodoGanador.querySelector(".modelo").innerText;
      document.getElementById("resultado").innerText =
        `¡GANASTE: ${modeloText}!`;
    }
    girando = false;
  }, 4500);
});
