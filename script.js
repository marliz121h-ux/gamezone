
"use strict";

/* ======================================================
   GAMEZONE — BLACK & WHITE
   Catálogo de videojuegos
   Buscador, filtros, favoritos y portadas
   ====================================================== */

// ==========================================
// 1. ELEMENTOS HTML
// ==========================================

const lista = document.getElementById("lista-juegos");
const buscador = document.getElementById("buscador");
const filtroGenero = document.getElementById("filtro-genero");
const orden = document.getElementById("orden");
const botonFavoritos = document.getElementById("solo-favoritos");
const botonMas = document.getElementById("mostrar-mas");
const botonLimpiar = document.getElementById("limpiar-filtros");
const contador = document.getElementById("contador");
const vacio = document.getElementById("sin-resultados");
const dialogo = document.getElementById("ficha");
const visualFicha = document.getElementById("ficha-visual");

const POR_PAGINA = 24;
const CLAVE_FAVORITOS = "gamezone_favoritos";

let juegos = [];
let pagina = 1;
let favoritos = leerFavoritos();

// ==========================================
// 2. PORTADAS LOCALES
// ==========================================
// Los nombres coinciden con tu carpeta imagenes.

const GZ_PORTADAS_LOCALES = {
  "fortnite": "Fortnite.jpg",
  "forza-horizon-5": "Forza_Horizon_5.jpg",
  "free-fire": "Free_Fire.jpg",
  "genshin-impact": "Genshin_Impact.jpg",
  "hollow-knight": "Hollow_Knight.jpg",
  "honkai-star-rail": "Honkai_Star_Rail.jpg",
  "league-of-legends": "League_of_Legends.jpg",
  "minecraft": "minecraft.jpg",
  "mobile-legends-bang-bang": "Mobile_Legends_Bang_Bang.jpg",
  "roblox": "Roblox.jpg",
  "stardew-valley": "Stardew_Valley.jpg",
  "terraria": "Terraria.jpg",
  "valorant": "VALORANT.jpg",
  "wuthering-waves": "Wuthering_Waves.jpg"
};

// ==========================================
// 3. PORTADAS DE STEAM
// ==========================================

const GZ_STEAM_IDS = {
  "terraria": 105600,
  "stardew-valley": 413150,
  "no-man-s-sky": 275850,
  "subnautica": 264710,
  "subnautica-below-zero": 848450,
  "slime-rancher": 433340,
  "slime-rancher-2": 1657630,
  "astroneer": 361420,
  "celeste": 504230,
  "hollow-knight": 367520,
  "ori-and-the-blind-forest": 261570,
  "ori-and-the-will-of-the-wisps": 1057090,
  "cuphead": 268910,
  "sonic-mania": 584400,
  "shovel-knight-treasure-trove": 250760,
  "rayman-legends": 242550,
  "spelunky-2": 418530,
  "unravel-two": 1225570,
  "wuthering-waves": 3513350,
  "sea-of-stars": 1244090,
  "undertale": 391540,
  "deltarune": 1671210,
  "octopath-traveler-ii": 1971650,
  "dragon-quest-xi-s": 1295510,
  "cassette-beasts": 1321440,
  "monster-sanctuary": 814370,
  "sid-meier-s-civilization-vi": 289070,
  "age-of-empires-ii-definitive-edition": 813780,
  "age-of-empires-iv": 1466860,
  "bloons-td-6": 960090,
  "plants-vs-zombies": 3590,
  "kingdom-two-crowns": 701160,
  "into-the-breach": 590380,
  "mini-metro": 287980,
  "mini-motorways": 1127500,
  "dorfromantik": 1455840,
  "forza-horizon-5": 1551360,
  "forza-motorsport": 2440510,
  "assetto-corsa": 244210,
  "assetto-corsa-competizione": 805550,
  "need-for-speed-heat": 1222680,
  "need-for-speed-unbound": 1846380,
  "trackmania": 2225070,
  "dirt-rally-2-0": 690790,
  "hot-wheels-unleashed-2-turbocharged": 2052620,
  "art-of-rally": 550320,
  "efootball": 1665460,
  "rocket-league": 252950,
  "ea-sports-fc-25": 2669320,
  "nba-2k25": 2878980,
  "golf-with-your-friends": 431240,
  "riders-republic": 2290180,
  "descenders": 681280,
  "lonely-mountains-downhill": 711540,
  "football-manager-2024": 2252570,
  "tony-hawk-s-pro-skater-1-2": 2395210,
  "the-sims-4": 1222670,
  "house-flipper": 613100,
  "house-flipper-2": 1190970,
  "powerwash-simulator": 1290000,
  "euro-truck-simulator-2": 227300,
  "american-truck-simulator": 270880,
  "cities-skylines": 255710,
  "cities-skylines-ii": 949230,
  "planet-zoo": 703080,
  "farming-simulator-25": 2300320,
  "among-us": 945360,
  "fall-guys": 1097150,
  "overcooked-2": 728880,
  "it-takes-two": 1426210,
  "human-fall-flat": 477160,
  "portal": 400,
  "portal-2": 620,
  "the-talos-principle": 257510,
  "the-talos-principle-2": 835960,
  "baba-is-you": 736260,
  "the-witness": 210970,
  "superliminal": 1049410,
  "viewfinder": 1382070,
  "the-room": 288160,
  "cocoon": 1497440,
  "a-short-hike": 1055540,
  "journey": 638230,
  "abzu": 384190,
  "spiritfarer-farewell-edition": 972660,
  "firewatch": 383870,
  "outer-wilds": 753640,
  "night-in-the-woods": 481510,
  "gris": 683320,
  "eastshade": 715560,
  "tchia": 1496590
};

// ==========================================
// 4. FAVORITOS
// ==========================================

function leerFavoritos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_FAVORITOS) || "[]"
    );

    return new Set(
      Array.isArray(datos) ? datos : []
    );
  } catch (error) {
    console.warn("Error al leer favoritos:", error);
    return new Set();
  }
}

function guardarFavoritos() {
  try {
    localStorage.setItem(
      CLAVE_FAVORITOS,
      JSON.stringify([...favoritos])
    );
  } catch (error) {
    console.warn("Error al guardar favoritos:", error);
  }
}

// ==========================================
// 5. FUNCIONES GENERALES
// ==========================================

function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function identificador(nombre) {
  return normalizar(nombre)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function iniciales(nombre) {
  return String(nombre)
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(palabra => palabra[0] || "")
    .join("")
    .toUpperCase() || "GZ";
}

function gradiente(indice) {
  const estilos = [
    "linear-gradient(145deg,#555,#161616 52%,#030303)",
    "linear-gradient(25deg,#383838,#070707 63%,#707070)",
    "linear-gradient(145deg,#101010,#444 68%,#0a0a0a)",
    "linear-gradient(65deg,#606060,#1a1a1a 50%,#050505)",
    "linear-gradient(165deg,#262626,#050505 70%,#777)",
    "linear-gradient(35deg,#090909,#505050 55%,#1a1a1a)"
  ];

  return estilos[indice % estilos.length];
}

function enlaceSeguro(url) {
  try {
    const destino = new URL(url);

    return destino.protocol === "https:"
      ? destino.href
      : null;
  } catch {
    return null;
  }
}

function datosEnlace(juego) {
  const url = enlaceSeguro(juego.url);

  if (url) {
    return {
      url,
      etiqueta: juego.etiquetaEnlace ||
        "Visitar tienda o sitio"
    };
  }

  return {
    url:
      "https://store.steampowered.com/search/?term=" +
      encodeURIComponent(juego.nombre),
    etiqueta: "Buscar en Steam"
  };
}

// ==========================================
// 6. OBTENER PORTADAS
// ==========================================

function fuentesPortada(juego) {
  const fuentes = [];

  const id = identificador(juego.id);
  const nombre = identificador(juego.nombre);

  // Prioridad 1: imágenes descargadas.
  const archivo =
    GZ_PORTADAS_LOCALES[id] ||
    GZ_PORTADAS_LOCALES[nombre];

  if (archivo) {
    fuentes.push("imagenes/" + archivo);
  }

  // Prioridad 2: imágenes de Steam.
  const steamId =
    GZ_STEAM_IDS[nombre] ||
    GZ_STEAM_IDS[id];

  if (steamId) {
    fuentes.push(
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/library_600x900.jpg`,
      `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${steamId}/library_600x900.jpg`,
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamId}/header.jpg`
    );
  }

  return fuentes;
}

// ==========================================
// 7. COLOCAR PORTADA
// ==========================================

function colocarPortada(
  contenedor,
  juego,
  monograma,
  ficha = false
) {
  const fuentes = fuentesPortada(juego);

  if (!fuentes.length) return;

  // Necesario para posicionar la imagen.
  contenedor.style.position = "relative";
  contenedor.style.overflow = "hidden";

  const imagen = document.createElement("img");

  imagen.className = "gz-portada-real";
  imagen.alt = "";
  imagen.loading = ficha ? "eager" : "lazy";
  imagen.decoding = "async";

  imagen.style.cssText = [
    "position:absolute",
    "inset:0",
    "width:100%",
    "height:100%",
    "object-fit:cover",
    "object-position:center",
    "z-index:1",
    "filter:grayscale(75%) brightness(80%)"
  ].join(";");

  let intento = 0;

  imagen.addEventListener("load", () => {
    if (monograma && imagen.isConnected) {
      monograma.style.opacity = "0";
    }
  });

  imagen.addEventListener("error", () => {
    intento++;

    if (intento < fuentes.length) {
      imagen.src = fuentes[intento];
    } else {
      imagen.remove();

      if (monograma) {
        monograma.style.opacity = "1";
      }
    }
  });

  contenedor.prepend(imagen);

  imagen.src = fuentes[0];
}

// ==========================================
// 8. BUSCAR Y FILTRAR VIDEOJUEGOS
// ==========================================

function obtenerFiltrados() {
  const consulta = normalizar(
    buscador.value.trim()
  );

  const genero = filtroGenero.value;

  const soloFavoritos =
    botonFavoritos.getAttribute(
      "aria-pressed"
    ) === "true";

  const resultado = juegos.filter(juego => {
    const texto = [
      juego.nombre,
      juego.genero,
      juego.plataformas,
      juego.descripcion
    ].join(" ");

    return (
      normalizar(texto).includes(consulta) &&
      (genero === "todos" || juego.genero === genero) &&
      (!soloFavoritos || favoritos.has(juego.id))
    );
  });

  if (orden.value === "az") {
    resultado.sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es")
    );
  } else if (orden.value === "za") {
    resultado.sort((a, b) =>
      b.nombre.localeCompare(a.nombre, "es")
    );
  }

  return resultado;
}

// ==========================================
// 9. CREAR TARJETA DE VIDEOJUEGO
// ==========================================

function crearJuego(juego, posicion) {
  const tarjeta = document.createElement("article");

  tarjeta.className = "juego";

  // PORTADA
  const portada = document.createElement("div");

  portada.className = "juego-portada";

  portada.style.setProperty(
    "--gradiente",
    gradiente(posicion)
  );

  const numero = document.createElement("span");

  numero.className = "juego-numero";

  numero.textContent =
    "GAME / " +
    String(posicion + 1).padStart(3, "0");

  const letras = document.createElement("span");

  letras.className = "juego-monograma";

  letras.textContent = iniciales(juego.nombre);

  const tipo = document.createElement("span");

  tipo.className = "juego-tipo";

  tipo.textContent = juego.genero;

  // BOTÓN FAVORITOS
  const corazon = document.createElement("button");

  corazon.className = "favorito";
  corazon.type = "button";

  function actualizarCorazon() {
    const activo = favoritos.has(juego.id);

    corazon.textContent = activo ? "♥" : "♡";

    corazon.setAttribute(
      "aria-pressed",
      String(activo)
    );

    corazon.setAttribute(
      "aria-label",
      (
        activo
          ? "Quitar de favoritos: "
          : "Agregar a favoritos: "
      ) + juego.nombre
    );
  }

  actualizarCorazon();

  corazon.addEventListener("click", () => {
    if (favoritos.has(juego.id)) {
      favoritos.delete(juego.id);
    } else {
      favoritos.add(juego.id);
    }

    guardarFavoritos();

    if (
      botonFavoritos.getAttribute(
        "aria-pressed"
      ) === "true"
    ) {
      pagina = 1;
      renderizar();
    } else {
      actualizarCorazon();
    }
  });

  portada.append(
    numero,
    letras,
    tipo,
    corazon
  );

  colocarPortada(portada, juego, letras);

  // INFORMACIÓN
  const info = document.createElement("div");

  info.className = "juego-info";

  const genero = document.createElement("div");

  genero.className = "juego-categoria";

  genero.textContent = juego.genero;

  const titulo = document.createElement("h3");

  titulo.textContent = juego.nombre;

  const plataformas = document.createElement("p");

  plataformas.className = "juego-plataformas";

  plataformas.textContent = juego.plataformas;

  // BOTONES
  const acciones = document.createElement("div");

  acciones.className = "juego-acciones";

  const detalle = document.createElement("button");

  detalle.type = "button";
  detalle.className = "ver-ficha";
  detalle.textContent = "Ver ficha";

  detalle.addEventListener("click", () => {
    mostrarFicha(juego, posicion);
  });

  const destino = datosEnlace(juego);

  const tienda = document.createElement("a");

  tienda.className = "ir-tienda";
  tienda.href = destino.url;

  tienda.textContent =
    destino.etiqueta.includes("Buscar en Steam")
      ? "Buscar en Steam ↗"
      : "Visitar sitio ↗";

  tienda.title = destino.etiqueta;

  tienda.setAttribute(
    "aria-label",
    destino.etiqueta + " — " + juego.nombre
  );

  tienda.target = "_blank";
  tienda.rel = "noopener noreferrer";

  acciones.append(detalle, tienda);

  info.append(
    genero,
    titulo,
    plataformas,
    acciones
  );

  tarjeta.append(portada, info);

  return tarjeta;
}

// ==========================================
// 10. FICHA DEL VIDEOJUEGO
// ==========================================

function mostrarFicha(juego, posicion) {
  document.getElementById(
    "ficha-nombre"
  ).textContent = juego.nombre;

  document.getElementById(
    "ficha-genero"
  ).textContent = juego.genero.toUpperCase();

  document.getElementById(
    "ficha-descripcion"
  ).textContent = juego.descripcion;

  document.getElementById(
    "ficha-plataformas"
  ).textContent = juego.plataformas;

  const letras = document.getElementById(
    "ficha-iniciales"
  );

  letras.textContent = iniciales(juego.nombre);
  letras.style.opacity = "1";

  // Eliminar imagen anterior.
  visualFicha.querySelector(
    ".gz-portada-real"
  )?.remove();

  visualFicha.style.background =
    gradiente(posicion);

  // Colocar imagen del juego seleccionado.
  colocarPortada(
    visualFicha,
    juego,
    letras,
    true
  );

  const destino = datosEnlace(juego);

  const enlace = document.getElementById(
    "ficha-enlace"
  );

  enlace.href = destino.url;

  enlace.textContent =
    destino.etiqueta + " ↗";

  if (!dialogo.open) {
    dialogo.showModal();
  }
}

// ==========================================
// 11. MOSTRAR CATÁLOGO
// ==========================================

function renderizar() {
  const seleccionados = obtenerFiltrados();

  const visibles = seleccionados.slice(
    0,
    pagina * POR_PAGINA
  );

  const fragmento =
    document.createDocumentFragment();

  visibles.forEach(juego => {
    fragmento.append(
      crearJuego(
        juego,
        juegos.indexOf(juego)
      )
    );
  });

  lista.replaceChildren(fragmento);

  contador.textContent =
    `Mostrando ${visibles.length} de ${seleccionados.length} juegos · Catálogo total: ${juegos.length}`;

  vacio.hidden =
    seleccionados.length !== 0;

  botonMas.hidden =
    visibles.length >= seleccionados.length;

  document.getElementById(
    "total-hero"
  ).textContent = juegos.length;
}

// ==========================================
// 12. EVENTOS DE BÚSQUEDA Y FILTROS
// ==========================================

function cambiarFiltro() {
  pagina = 1;
  renderizar();
}

buscador.addEventListener(
  "input",
  cambiarFiltro
);

filtroGenero.addEventListener(
  "change",
  cambiarFiltro
);

orden.addEventListener(
  "change",
  cambiarFiltro
);

botonFavoritos.addEventListener("click", () => {
  const activo =
    botonFavoritos.getAttribute(
      "aria-pressed"
    ) !== "true";

  botonFavoritos.setAttribute(
    "aria-pressed",
    String(activo)
  );

  botonFavoritos.textContent =
    activo
      ? "♥ Solo favoritos"
      : "♡ Solo favoritos";

  cambiarFiltro();
});

botonLimpiar.addEventListener("click", () => {
  buscador.value = "";
  filtroGenero.value = "todos";
  orden.value = "original";

  botonFavoritos.setAttribute(
    "aria-pressed",
    "false"
  );

  botonFavoritos.textContent =
    "♡ Solo favoritos";

  cambiarFiltro();
});

botonMas.addEventListener("click", () => {
  pagina++;
  renderizar();
});

// ==========================================
// 13. CERRAR FICHA
// ==========================================

const cerrarFicha =
  document.getElementById("cerrar-ficha");

cerrarFicha.addEventListener("click", () => {
  dialogo.close();
});

dialogo.addEventListener("click", evento => {
  if (evento.target === dialogo) {
    dialogo.close();
  }
});

// ==========================================
// 14. CARGAR LOS JUEGOS DESDE JSON
// ==========================================

async function cargarJuegos() {
  try {
    const respuesta = await fetch(
      "juegos.json",
      { cache: "no-store" }
    );

    if (!respuesta.ok) {
      throw new Error(
        "No se pudo abrir juegos.json (" +
        respuesta.status + ")"
      );
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error(
        "juegos.json debe contener una lista"
      );
    }

    juegos = datos.filter(juego =>
      juego.id &&
      juego.nombre &&
      juego.genero &&
      juego.url
    );

    const generos = [
      ...new Set(
        juegos.map(juego => juego.genero)
      )
    ].sort((a, b) =>
      a.localeCompare(b, "es")
    );

    generos.forEach(genero => {
      const opcion =
        document.createElement("option");

      opcion.value = genero;
      opcion.textContent = genero;

      filtroGenero.append(opcion);
    });

    renderizar();

  } catch (error) {
    console.error("GameZone:", error);

    contador.textContent =
      "No se pudo cargar el catálogo.";

    vacio.hidden = false;

    const tituloError = vacio.querySelector("h3");
    const textoError = vacio.querySelector("p");

    if (tituloError) {
      tituloError.textContent =
        "No se pudo cargar juegos.json";
    }

    if (textoError) {
      textoError.textContent =
        "Abre GameZone con Live Server y comprueba que juegos.json esté en la misma carpeta.";
    }
  }
}

// ==========================================
// 15. INICIAR GAMEZONE
// ==========================================

cargarJuegos();

// FIN — GAMEZONE BLACK & WHITE

/* =========================================
   GAMEZONE — FASE 4
   CATEGORÍAS INTELIGENTES
========================================= */

const contenedorCategorias =
  document.getElementById("categorias-rapidas");

function crearCategoriasRapidas() {
  if (!contenedorCategorias || !juegos.length) return;

  const cantidades = new Map();

  juegos.forEach(juego => {
    const genero = juego.genero;

    cantidades.set(
      genero,
      (cantidades.get(genero) || 0) + 1
    );
  });

  const categorias = [
    ["todos", "🎮", "Todos los juegos", juegos.length],
    ...[...cantidades.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([genero, cantidad]) => [
        genero,
        "✦",
        genero,
        cantidad
      ])
  ];

  contenedorCategorias.replaceChildren();

  categorias.forEach(([valor, icono, nombre, cantidad]) => {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "categoria-rapida";

    const simbolo = document.createElement("span");
    simbolo.className = "categoria-icono";
    simbolo.textContent = icono;

    const texto = document.createElement("span");
    texto.className = "categoria-nombre";
    texto.textContent = nombre;

    const numero = document.createElement("span");
    numero.className = "categoria-cantidad";
    numero.textContent = cantidad;

    boton.append(simbolo, texto, numero);

    boton.addEventListener("click", () => {
      filtroGenero.value = valor;

      pagina = 1;
      renderizar();
      actualizarCategoriasActivas();
    });

    boton.dataset.genero = valor;

    contenedorCategorias.append(boton);
  });

  actualizarCategoriasActivas();
}

function actualizarCategoriasActivas() {
  if (!contenedorCategorias) return;

  contenedorCategorias
    .querySelectorAll(".categoria-rapida")
    .forEach(boton => {
      const activo =
        boton.dataset.genero === filtroGenero.value;

      boton.classList.toggle("activa", activo);
      boton.setAttribute("aria-pressed", String(activo));
    });
}

filtroGenero.addEventListener(
  "change",
  actualizarCategoriasActivas
);

botonLimpiar.addEventListener(
  "click",
  actualizarCategoriasActivas
);

// Esperar a que termine de cargarse juegos.json.
const renderizarOriginalGameZone = renderizar;

renderizar = function () {
  renderizarOriginalGameZone();

  if (
    contenedorCategorias &&
    contenedorCategorias.children.length === 0 &&
    juegos.length
  ) {
    crearCategoriasRapidas();
  }

  actualizarCategoriasActivas();
};


/* =========================================
   GAMEZONE — FASE 5
   CARRUSEL DE VIDEOJUEGOS DESTACADOS
========================================= */

const gzCarrusel = document.getElementById(
  "destacados-carrusel"
);

const gzAnterior = document.getElementById(
  "destacados-anterior"
);

const gzSiguiente = document.getElementById(
  "destacados-siguiente"
);

// Nombres de juegos que queremos destacar.
// Si no están en juegos.json, se usan otros
// juegos disponibles del catálogo.

const GZ_NOMBRES_DESTACADOS = [
  "Minecraft",
  "Fortnite",
  "Forza Horizon 5",
  "Genshin Impact",
  "Hollow Knight",
  "Stardew Valley",
  "Terraria",
  "Roblox"
];

function gzObtenerDestacados() {
  const elegidos = [];

  GZ_NOMBRES_DESTACADOS.forEach(nombre => {
    const juego = juegos.find(
      item => normalizar(item.nombre) === normalizar(nombre)
    );

    if (juego && !elegidos.includes(juego)) {
      elegidos.push(juego);
    }
  });

  // Completar hasta 8 juegos con otros del catálogo.
  juegos.forEach(juego => {
    if (
      elegidos.length < 8 &&
      !elegidos.includes(juego)
    ) {
      elegidos.push(juego);
    }
  });

  return elegidos;
}

function gzCrearDestacado(juego) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "destacado-tarjeta";

  const portada = document.createElement("div");
  portada.className = "destacado-portada";

  const letras = document.createElement("span");
  letras.className = "destacado-iniciales";
  letras.textContent = iniciales(juego.nombre);

  portada.append(letras);

  // Reutilizar el sistema de imágenes de GameZone.
  colocarPortada(portada, juego, letras);

  const contenido = document.createElement("div");
  contenido.className = "destacado-contenido";

  const genero = document.createElement("p");
  genero.className = "destacado-genero";
  genero.textContent = juego.genero;

  const titulo = document.createElement("h3");
  titulo.textContent = juego.nombre;

  const acciones = document.createElement("div");
  acciones.className = "destacado-acciones";

  const botonFicha = document.createElement("button");
  botonFicha.type = "button";
  botonFicha.className = "destacado-boton";
  botonFicha.textContent = "Ver ficha ↗";

  botonFicha.addEventListener("click", () => {
    mostrarFicha(juego, juegos.indexOf(juego));
  });

  const destino = datosEnlace(juego);

  const enlace = document.createElement("a");
  enlace.className = "destacado-enlace";
  enlace.href = destino.url;
  enlace.textContent = "Sitio oficial ↗";
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";

  acciones.append(botonFicha, enlace);
  contenido.append(genero, titulo, acciones);
  tarjeta.append(portada, contenido);

  return tarjeta;
}

function gzActualizarControles() {
  if (!gzCarrusel || !gzAnterior || !gzSiguiente) {
    return;
  }

  const maximo =
    gzCarrusel.scrollWidth - gzCarrusel.clientWidth;

  gzAnterior.disabled = gzCarrusel.scrollLeft <= 2;

  gzSiguiente.disabled =
    gzCarrusel.scrollLeft >= maximo - 2;
}

function gzMostrarDestacados() {
  if (!gzCarrusel || !juegos.length) return;

  const fragmento = document.createDocumentFragment();

  gzObtenerDestacados().forEach(juego => {
    fragmento.append(gzCrearDestacado(juego));
  });

  gzCarrusel.replaceChildren(fragmento);

  requestAnimationFrame(gzActualizarControles);
}

function gzMoverCarrusel(direccion) {
  if (!gzCarrusel) return;

  const tarjeta = gzCarrusel.querySelector(
    ".destacado-tarjeta"
  );

  const distancia = tarjeta
    ? tarjeta.getBoundingClientRect().width + 18
    : 300;

  gzCarrusel.scrollBy({
    left: distancia * direccion,
    behavior: "smooth"
  });
}

if (gzAnterior && gzSiguiente && gzCarrusel) {
  gzAnterior.addEventListener("click", () => {
    gzMoverCarrusel(-1);
  });

  gzSiguiente.addEventListener("click", () => {
    gzMoverCarrusel(1);
  });

  gzCarrusel.addEventListener(
    "scroll",
    gzActualizarControles,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    gzActualizarControles
  );
}

// Ejecutar cuando los juegos ya estén cargados.
// Reutilizamos renderizar, sin alterar los filtros.

const gzRenderizarAntesDestacados = renderizar;

renderizar = function () {
  gzRenderizarAntesDestacados();

  if (
    gzCarrusel &&
    gzCarrusel.children.length === 0 &&
    juegos.length
  ) {
    gzMostrarDestacados();
  }
};

/* =========================================
   GAMEZONE — FASE 6
   RECOMENDACIONES INTELIGENTES
========================================= */

const gzListaRecomendaciones = document.getElementById(
  "lista-recomendaciones"
);

const gzMensajeRecomendaciones = document.getElementById(
  "recomendaciones-mensaje"
);

const gzBotonSorpresa = document.getElementById(
  "juego-sorpresa"
);

// Obtener géneros favoritos del usuario.
function gzGenerosPreferidos() {
  const conteo = new Map();

  juegos.forEach(juego => {
    if (favoritos.has(juego.id)) {
      conteo.set(
        juego.genero,
        (conteo.get(juego.genero) || 0) + 1
      );
    }
  });

  return [...conteo.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([genero]) => genero);
}

// Elegir recomendaciones.
function gzObtenerRecomendaciones() {
  const generos = gzGenerosPreferidos();

  const candidatos = juegos.filter(
    juego => !favoritos.has(juego.id)
  );

  if (!generos.length) {
    return candidatos.slice(0, 4);
  }

  candidatos.sort((a, b) => {
    const posicionA = generos.indexOf(a.genero);
    const posicionB = generos.indexOf(b.genero);

    const prioridadA =
      posicionA === -1 ? 999 : posicionA;

    const prioridadB =
      posicionB === -1 ? 999 : posicionB;

    return prioridadA - prioridadB;
  });

  return candidatos.slice(0, 4);
}

// Mostrar recomendaciones.
function gzMostrarRecomendaciones() {
  if (!gzListaRecomendaciones || !juegos.length) {
    return;
  }

  const recomendaciones = gzObtenerRecomendaciones();
  const fragmento = document.createDocumentFragment();

  recomendaciones.forEach(juego => {
    const posicion = juegos.indexOf(juego);
    fragmento.append(crearJuego(juego, posicion));
  });

  gzListaRecomendaciones.replaceChildren(fragmento);

  if (gzMensajeRecomendaciones) {
    gzMensajeRecomendaciones.textContent =
      favoritos.size > 0
        ? "Seleccionamos juegos relacionados con tus favoritos."
        : "Agrega juegos a favoritos para personalizar tus recomendaciones.";
  }
}

// Seleccionar un videojuego al azar.
if (gzBotonSorpresa) {
  gzBotonSorpresa.addEventListener("click", () => {
    if (!juegos.length) return;

    const indice = Math.floor(
      Math.random() * juegos.length
    );

    mostrarFicha(juegos[indice], indice);
  });
}

// Actualizar recomendaciones al cambiar favoritos.
const gzGuardarFavoritosOriginal = guardarFavoritos;

guardarFavoritos = function () {
  gzGuardarFavoritosOriginal();
  gzMostrarRecomendaciones();
};

// Ejecutar después de cargar el catálogo.
const gzRenderizarAntesRecomendaciones = renderizar;

renderizar = function () {
  gzRenderizarAntesRecomendaciones();

  if (
    gzListaRecomendaciones &&
    gzListaRecomendaciones.children.length === 0 &&
    juegos.length
  ) {
    gzMostrarRecomendaciones();
  }
};

/* =========================================
   GAMEZONE — FASE 6.2
   JUEGOS SIMILARES EN LA FICHA
========================================= */

const gzListaSimilares =
  document.getElementById("lista-similares");

function gzMostrarSimilares(juegoActual) {
  if (!gzListaSimilares) return;

  // Buscar otros videojuegos del mismo género.
  const similares = juegos
    .filter(juego =>
      juego.id !== juegoActual.id &&
      juego.genero === juegoActual.genero
    )
    .slice(0, 4);

  const fragmento = document.createDocumentFragment();

  similares.forEach(juego => {
    const tarjeta = document.createElement("button");
    tarjeta.type = "button";
    tarjeta.className = "similar-tarjeta";

    const portada = document.createElement("div");
    portada.className = "similar-portada";

    const letras = document.createElement("span");
    letras.className = "similar-iniciales";
    letras.textContent = iniciales(juego.nombre);

    portada.append(letras);
    colocarPortada(portada, juego, letras);

    const nombre = document.createElement("span");
    nombre.className = "similar-nombre";
    nombre.textContent = juego.nombre;

    tarjeta.append(portada, nombre);

    tarjeta.addEventListener("click", () => {
      mostrarFicha(juego, juegos.indexOf(juego));
    });

    fragmento.append(tarjeta);
  });

  gzListaSimilares.replaceChildren(fragmento);

  const seccion = gzListaSimilares.closest(
    ".ficha-similares"
  );

  if (seccion) {
    seccion.hidden = similares.length === 0;
  }
}

// Integrar con la función existente de fichas.
const gzMostrarFichaOriginal = mostrarFicha;

mostrarFicha = function (juego, posicion) {
  gzMostrarFichaOriginal(juego, posicion);
  gzMostrarSimilares(juego);
};



/* ==================================================
   GAMEZONE — BLACK & WHITE
   FASES 7 A 16
   PERFIL, LOGROS, ESTADÍSTICAS, BIBLIOTECA,
   COMPARADOR, TEMAS Y NOTIFICACIONES
================================================== */

// ================================================
// FASE 7 — PERFIL GAMER
// ================================================

const gzPerfilNombre =
  document.getElementById("gz-nombre-visible");

const gzPerfilInput =
  document.getElementById("gz-nombre-input");

const gzPerfilGuardar =
  document.getElementById("gz-guardar-nombre");

const gzAvatar =
  document.getElementById("gz-avatar");

const gzRango =
  document.getElementById("gz-rango");

const GZ_CLAVE_NOMBRE = "gamezone_nombre";
const GZ_CLAVE_TEMA = "gamezone_tema";
const GZ_CLAVE_VISITADOS = "gamezone_visitados";

function gzLeerLocal(clave, respaldo = "") {
  try {
    return localStorage.getItem(clave) ?? respaldo;
  } catch {
    return respaldo;
  }
}

function gzGuardarLocal(clave, valor) {
  try {
    localStorage.setItem(clave, valor);
    return true;
  } catch (error) {
    console.warn("No se pudo guardar:", error);
    return false;
  }
}

let gzNombreJugador =
  gzLeerLocal(GZ_CLAVE_NOMBRE, "Jugador GZ");

function gzActualizarPerfil() {
  if (gzPerfilNombre) {
    gzPerfilNombre.textContent = gzNombreJugador;
  }

  if (gzAvatar) {
    gzAvatar.textContent = iniciales(gzNombreJugador);
  }

  if (gzPerfilInput) {
    gzPerfilInput.value = gzNombreJugador;
  }
}

function gzGuardarNombre() {
  if (!gzPerfilInput) return;

  const nuevoNombre = gzPerfilInput.value.trim();

  if (!nuevoNombre) {
    gzNotificar("Escribe un nombre gamer.");
    return;
  }

  if (nuevoNombre.length > 24) {
    gzNotificar("El nombre debe tener hasta 24 caracteres.");
    return;
  }

  gzNombreJugador = nuevoNombre;

  gzGuardarLocal(GZ_CLAVE_NOMBRE, gzNombreJugador);

  gzActualizarPerfil();
  gzNotificar("¡Perfil gamer actualizado!");
}

if (gzPerfilGuardar) {
  gzPerfilGuardar.addEventListener(
    "click",
    gzGuardarNombre
  );
}

if (gzPerfilInput) {
  gzPerfilInput.addEventListener("keydown", evento => {
    if (evento.key === "Enter") {
      gzGuardarNombre();
    }
  });
}

// ================================================
// FASE 15 — NOTIFICACIONES
// ================================================

const gzAviso =
  document.getElementById("gz-notificacion");

let gzTemporizadorAviso = null;

function gzNotificar(mensaje) {
  if (!gzAviso) return;

  clearTimeout(gzTemporizadorAviso);

  gzAviso.textContent = mensaje;
  gzAviso.hidden = false;

  gzTemporizadorAviso = setTimeout(() => {
    gzAviso.hidden = true;
  }, 3000);
}

// ================================================
// FASE 9 — ESTADÍSTICAS
// ================================================

function gzFavoritosValidos() {
  return juegos.filter(juego =>
    favoritos.has(juego.id)
  );
}

function gzGeneroFavorito() {
  const conteo = new Map();

  gzFavoritosValidos().forEach(juego => {
    conteo.set(
      juego.genero,
      (conteo.get(juego.genero) || 0) + 1
    );
  });

  const ordenados = [...conteo.entries()]
    .sort((a, b) => b[1] - a[1]);

  return ordenados.length
    ? ordenados[0][0]
    : "Sin definir";
}

function gzActualizarEstadisticas() {
  const total = juegos.length;
  const cantidad = gzFavoritosValidos().length;

  const porcentaje = total
    ? Math.round((cantidad / total) * 100)
    : 0;

  const datos = {
    "gz-total-juegos": total,
    "gz-total-favoritos": cantidad,
    "gz-genero-preferido": gzGeneroFavorito(),
    "gz-porcentaje": porcentaje + "%"
  };

  Object.entries(datos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id);

    if (elemento) {
      elemento.textContent = valor;
    }
  });

  if (gzRango) {
    let rango = "Explorador";

    if (cantidad >= 30) {
      rango = "Leyenda GameZone";
    } else if (cantidad >= 15) {
      rango = "Maestro Gamer";
    } else if (cantidad >= 5) {
      rango = "Jugador Experto";
    }

    gzRango.textContent = rango;
  }
}

// ================================================
// FASE 8 — SISTEMA DE LOGROS
// ================================================

const gzListaLogros =
  document.getElementById("gz-logros");

const gzLogrosContador =
  document.getElementById("gz-logros-contador");

const gzLogrosDefinidos = [
  {
    nombre: "Primer favorito",
    descripcion: "Guarda tu primer videojuego.",
    cantidad: 1,
    icono: "★"
  },
  {
    nombre: "Coleccionista",
    descripcion: "Guarda 5 videojuegos.",
    cantidad: 5,
    icono: "◆"
  },
  {
    nombre: "Explorador gamer",
    descripcion: "Guarda 10 videojuegos.",
    cantidad: 10,
    icono: "✦"
  },
  {
    nombre: "Jugador experto",
    descripcion: "Guarda 15 videojuegos.",
    cantidad: 15,
    icono: "♛"
  },
  {
    nombre: "Maestro del catálogo",
    descripcion: "Guarda 25 videojuegos.",
    cantidad: 25,
    icono: "♕"
  },
  {
    nombre: "Leyenda GameZone",
    descripcion: "Guarda 50 videojuegos.",
    cantidad: 50,
    icono: "🏆"
  }
];

function gzActualizarLogros() {
  if (!gzListaLogros) return;

  const cantidad = gzFavoritosValidos().length;
  const fragmento = document.createDocumentFragment();

  let desbloqueados = 0;

  gzLogrosDefinidos.forEach(logro => {
    const conseguido = cantidad >= logro.cantidad;

    if (conseguido) {
      desbloqueados++;
    }

    const tarjeta = document.createElement("article");

    tarjeta.className =
      "gz-logro" + (conseguido ? "" : " bloqueado");

    const titulo = document.createElement("strong");

    titulo.textContent =
      logro.icono + " " + logro.nombre;

    const descripcion = document.createElement("p");

    descripcion.textContent = logro.descripcion;

    const estado = document.createElement("p");

    estado.textContent = conseguido
      ? "✓ Desbloqueado"
      : "🔒 Bloqueado";

    tarjeta.append(titulo, descripcion, estado);

    fragmento.append(tarjeta);
  });

  gzListaLogros.replaceChildren(fragmento);

  if (gzLogrosContador) {
    gzLogrosContador.textContent =
      desbloqueados +
      " de " +
      gzLogrosDefinidos.length +
      " logros desbloqueados";
  }
}

// ================================================
// FASE 10 — BIBLIOTECA PERSONAL
// ================================================

const gzBibliotecaLista =
  document.getElementById("gz-biblioteca-lista");

const gzBibliotecaMensaje =
  document.getElementById("gz-biblioteca-mensaje");

function gzActualizarBiblioteca() {
  if (!gzBibliotecaLista) return;

  const guardados = gzFavoritosValidos();

  const fragmento = document.createDocumentFragment();

  guardados.forEach(juego => {
    const posicion = juegos.indexOf(juego);

    fragmento.append(
      crearJuego(juego, posicion)
    );
  });

  gzBibliotecaLista.replaceChildren(fragmento);

  if (gzBibliotecaMensaje) {
    gzBibliotecaMensaje.textContent =
      guardados.length
        ? `Tienes ${guardados.length} videojuegos guardados.`
        : "Todavía no tienes favoritos. Explora el catálogo y guarda algunos.";
  }
}

// ================================================
// FASE 12 — COMPARADOR DE VIDEOJUEGOS
// ================================================

const gzCompararUno =
  document.getElementById("gz-comparar-uno");

const gzCompararDos =
  document.getElementById("gz-comparar-dos");

const gzCompararBoton =
  document.getElementById("gz-comparar-boton");

const gzCompararResultado =
  document.getElementById("gz-comparador-resultado");

function gzPrepararComparador() {
  if (!gzCompararUno || !gzCompararDos) return;

  [gzCompararUno, gzCompararDos].forEach(select => {
    select.replaceChildren();

    const inicial = document.createElement("option");

    inicial.value = "";
    inicial.textContent = "Seleccionar juego";

    select.append(inicial);

    juegos.forEach(juego => {
      const opcion = document.createElement("option");

      opcion.value = String(juego.id);
      opcion.textContent = juego.nombre;

      select.append(opcion);
    });
  });
}

function gzCrearComparacion(juego) {
  const tarjeta = document.createElement("article");

  const titulo = document.createElement("h4");
  titulo.textContent = juego.nombre;

  const genero = document.createElement("p");
  genero.textContent = "Género: " + juego.genero;

  const plataformas = document.createElement("p");
  plataformas.textContent =
    "Plataformas: " + juego.plataformas;

  const descripcion = document.createElement("p");
  descripcion.textContent = juego.descripcion;

  const enlace = document.createElement("a");
  const destino = datosEnlace(juego);

  enlace.href = destino.url;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.textContent = "Visitar sitio ↗";
  enlace.className = "boton boton-claro";

  tarjeta.append(
    titulo,
    genero,
    plataformas,
    descripcion,
    enlace
  );

  return tarjeta;
}

function gzCompararJuegos() {
  if (!gzCompararResultado) return;

  const juegoUno = juegos.find(juego =>
    String(juego.id) === gzCompararUno.value
  );

  const juegoDos = juegos.find(juego =>
    String(juego.id) === gzCompararDos.value
  );

  if (!juegoUno || !juegoDos) {
    gzNotificar("Selecciona dos videojuegos.");
    return;
  }

  if (juegoUno.id === juegoDos.id) {
    gzNotificar("Selecciona dos juegos diferentes.");
    return;
  }

  const contenedor = document.createElement("div");
  contenedor.className = "gz-comparacion";

  contenedor.append(
    gzCrearComparacion(juegoUno),
    gzCrearComparacion(juegoDos)
  );

  gzCompararResultado.replaceChildren(contenedor);

  gzNotificar("Comparación preparada.");
}

if (gzCompararBoton) {
  gzCompararBoton.addEventListener(
    "click",
    gzCompararJuegos
  );
}

// ================================================
// FASE 13 — CAMBIO DE TEMA
// ================================================

const gzTemaOscuro =
  document.getElementById("gz-tema-oscuro");

const gzTemaClaro =
  document.getElementById("gz-tema-claro");

function gzAplicarTema(tema) {
  const claro = tema === "claro";

  document.body.classList.toggle(
    "gz-tema-claro",
    claro
  );

  if (gzTemaOscuro) {
    gzTemaOscuro.setAttribute(
      "aria-pressed",
      String(!claro)
    );
  }

  if (gzTemaClaro) {
    gzTemaClaro.setAttribute(
      "aria-pressed",
      String(claro)
    );
  }

  gzGuardarLocal(
    GZ_CLAVE_TEMA,
    claro ? "claro" : "oscuro"
  );
}

if (gzTemaOscuro) {
  gzTemaOscuro.addEventListener("click", () => {
    gzAplicarTema("oscuro");
    gzNotificar("Modo oscuro activado.");
  });
}

if (gzTemaClaro) {
  gzTemaClaro.addEventListener("click", () => {
    gzAplicarTema("claro");
    gzNotificar("Modo claro activado.");
  });
}

// ================================================
// FASE 11 — BÚSQUEDA AVANZADA
// ================================================

// El buscador original ya permite buscar por
// nombre, género, plataformas y descripción.
// Añadimos el atajo Ctrl + K para abrirlo.

document.addEventListener("keydown", evento => {
  if (
    (evento.ctrlKey || evento.metaKey) &&
    evento.key.toLowerCase() === "k"
  ) {
    evento.preventDefault();

    buscador.focus();
    buscador.select();
  }
});

// ================================================
// FASE 16 — SEGUIMIENTO DE FICHAS VISITADAS
// ================================================

function gzLeerVisitados() {
  try {
    const datos = JSON.parse(
      gzLeerLocal(GZ_CLAVE_VISITADOS, "[]")
    );

    return new Set(
      Array.isArray(datos) ? datos : []
    );
  } catch {
    return new Set();
  }
}

const gzVisitados = gzLeerVisitados();

const gzMostrarFichaAntesPerfil = mostrarFicha;

mostrarFicha = function (juego, posicion) {
  gzMostrarFichaAntesPerfil(juego, posicion);

  if (!gzVisitados.has(juego.id)) {
    gzVisitados.add(juego.id);

    gzGuardarLocal(
      GZ_CLAVE_VISITADOS,
      JSON.stringify([...gzVisitados])
    );
  }
};

// ================================================
// ACTUALIZACIÓN AUTOMÁTICA
// ================================================

function gzActualizarPanelGamer() {
  gzActualizarEstadisticas();
  gzActualizarLogros();
  gzActualizarBiblioteca();
}

// Cuando se guarda o elimina un favorito,
// actualizar las nuevas secciones.

const gzGuardarFavoritosAntesPerfil = guardarFavoritos;

guardarFavoritos = function () {
  gzGuardarFavoritosAntesPerfil();

  gzActualizarPanelGamer();
};

// Preparar todo después de que el catálogo
// termine de cargar desde juegos.json.

let gzPerfilCatalogoPreparado = false;

const gzRenderizarAntesPerfil = renderizar;

renderizar = function () {
  gzRenderizarAntesPerfil();

  if (
    !gzPerfilCatalogoPreparado &&
    juegos.length > 0
  ) {
    gzPerfilCatalogoPreparado = true;

    gzPrepararComparador();
    gzActualizarPanelGamer();
  }
};

// ================================================
// INICIALIZACIÓN DEL PERFIL
// ================================================

gzActualizarPerfil();

gzAplicarTema(
  gzLeerLocal(GZ_CLAVE_TEMA, "oscuro")
);

// Si el catálogo ya estaba cargado,
// inicializar inmediatamente.

if (juegos.length > 0) {
  gzPerfilCatalogoPreparado = true;

  gzPrepararComparador();
  gzActualizarPanelGamer();
}

/* ================================================
   FIN — GAMEZONE FASES 7 A 16
================================================ */



/* =====================================================
   GAMEZONE 2.0 — FASES 17 A 26
   CENTRO DE ACTIVIDAD GAMER
===================================================== */

(() => {
  "use strict";

  // ================================================
  // CONFIGURACIÓN Y ALMACENAMIENTO
  // ================================================

  const CLAVES = {
    opiniones: "gz2_opiniones",
    coleccion: "gz2_coleccion",
    historial: "gz2_historial"
  };

  const ESTADOS = {
    pendiente: "◷ Pendiente",
    jugando: "▶ Jugando",
    completado: "✓ Completado"
  };

  const $ = id => document.getElementById(id);

  function leerJSON(clave, respaldo) {
    try {
      const texto = localStorage.getItem(clave);
      return texto === null ? respaldo : JSON.parse(texto);
    } catch {
      return respaldo;
    }
  }

  function guardarJSON(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error("Error al guardar:", error);
      avisar("No se pudieron guardar los datos.");
      return false;
    }
  }

  function avisar(mensaje) {
    if (typeof gzNotificar === "function") {
      gzNotificar(mensaje);
    } else {
      console.log("GameZone:", mensaje);
    }
  }

  function elemento(tipo, texto, clase = "") {
    const nodo = document.createElement(tipo);
    nodo.textContent = texto;

    if (clase) nodo.className = clase;

    return nodo;
  }

  function mensajeVacio(texto) {
    return elemento("p", texto, "gz2-vacio");
  }

  function obtenerJuegos() {
    return typeof juegos !== "undefined" &&
      Array.isArray(juegos)
      ? juegos
      : [];
  }

  function buscarJuego(id) {
    return obtenerJuegos().find(
      juego => String(juego.id) === String(id)
    );
  }

  function nombreJuego(id) {
    return buscarJuego(id)?.nombre || "Juego no disponible";
  }

  function plataformaTexto(juego) {
    const dato = juego.plataformas;

    return Array.isArray(dato)
      ? dato.join(", ")
      : String(dato || "No especificada");
  }

  function fechaActual() {
    return new Date().toISOString();
  }

  function fechaVisible(fecha) {
    const valor = new Date(fecha);

    return Number.isNaN(valor.getTime())
      ? "Sin fecha"
      : valor.toLocaleDateString("es-PE");
  }

  function limpiarContenedor(id) {
    const nodo = $(id);

    if (nodo) nodo.replaceChildren();

    return nodo;
  }

  function crearBoton(texto, accion, clase = "gz2-boton-secundario") {
    const boton = elemento("button", texto, clase);
    boton.type = "button";
    boton.addEventListener("click", accion);
    return boton;
  }

  // ================================================
  // DATOS DEL CENTRO GAMER
  // ================================================

  let opiniones = leerJSON(CLAVES.opiniones, {});
  let coleccion = leerJSON(CLAVES.coleccion, {});
  let historial = leerJSON(CLAVES.historial, []);

  if (!opiniones || typeof opiniones !== "object" ||
      Array.isArray(opiniones)) {
    opiniones = {};
  }

  if (!coleccion || typeof coleccion !== "object" ||
      Array.isArray(coleccion)) {
    coleccion = {};
  }

  if (!Array.isArray(historial)) {
    historial = [];
  }

  let filtroColeccion = "todos";

  // ================================================
  // CARGAR SELECTORES DE VIDEOJUEGOS
  // ================================================

  function cargarSelectores() {
    const selectores = [
      "gz2-juego-valorar",
      "gz2-juego-estado"
    ];

    selectores.forEach(id => {
      const select = $(id);
      if (!select) return;

      const seleccionado = select.value;

      select.replaceChildren();

      const inicial = new Option(
        "Seleccionar videojuego",
        ""
      );

      select.add(inicial);

      [...obtenerJuegos()]
        .sort((a, b) =>
          a.nombre.localeCompare(b.nombre, "es")
        )
        .forEach(juego => {
          select.add(
            new Option(juego.nombre, String(juego.id))
          );
        });

      if (buscarJuego(seleccionado)) {
        select.value = seleccionado;
      }
    });
  }

  // ================================================
  // FASE 17 Y 18 — VALORACIONES Y RESEÑAS
  // ================================================

  function guardarOpinion() {
    const id = $("gz2-juego-valorar")?.value;
    const puntuacion = Number($("gz2-puntuacion")?.value);
    const texto = $("gz2-texto-resena")?.value.trim() || "";

    if (!buscarJuego(id)) {
      avisar("Selecciona un videojuego.");
      return;
    }

    if (!Number.isInteger(puntuacion) ||
        puntuacion < 1 || puntuacion > 5) {
      avisar("Selecciona una puntuación válida.");
      return;
    }

    opiniones[id] = {
      puntuacion,
      texto: texto.slice(0, 1000),
      fecha: fechaActual()
    };

    if (!guardarJSON(CLAVES.opiniones, opiniones)) return;

    avisar("★ Valoración guardada correctamente.");

    actualizarTodo();
  }

  function eliminarOpinion(id) {
    if (!confirm("¿Eliminar esta valoración y reseña?")) {
      return;
    }

    delete opiniones[id];

    if (!guardarJSON(CLAVES.opiniones, opiniones)) return;

    actualizarTodo();
    avisar("Valoración eliminada.");
  }

  function editarOpinion(id) {
    const opinion = opiniones[id];
    if (!opinion) return;

    $("gz2-juego-valorar").value = String(id);
    $("gz2-puntuacion").value = String(opinion.puntuacion);
    $("gz2-texto-resena").value = opinion.texto || "";

    $("gz2-opiniones")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    $("gz2-texto-resena")?.focus();

    avisar("Edita tu opinión y vuelve a guardarla.");
  }

  function renderizarOpiniones() {
    const lista = limpiarContenedor("gz2-lista-resenas");
    if (!lista) return;

    const entradas = Object.entries(opiniones)
      .filter(([id]) => buscarJuego(id))
      .sort((a, b) =>
        new Date(b[1].fecha) - new Date(a[1].fecha)
      );

    const contador = $("gz2-contador-resenas");

    if (contador) {
      contador.textContent =
        entradas.length + " opiniones";
    }

    if (!entradas.length) {
      lista.append(
        mensajeVacio("Todavía no has escrito reseñas.")
      );
      return;
    }

    entradas.forEach(([id, opinion]) => {
      const tarjeta = elemento("article", "", "gz2-resena");

      const titulo = elemento("h4", nombreJuego(id));

      const estrellas = elemento(
        "div",
        "★".repeat(opinion.puntuacion) +
        "☆".repeat(5 - opinion.puntuacion),
        "gz2-estrellas"
      );

      const comentario = elemento(
        "p",
        opinion.texto || "Sin comentario escrito."
      );

      const fecha = elemento(
        "p",
        "Guardado: " + fechaVisible(opinion.fecha)
      );

      const acciones = elemento("div", "");
      acciones.style.display = "flex";
      acciones.style.flexWrap = "wrap";
      acciones.style.gap = "10px";
      acciones.style.marginTop = "15px";

      acciones.append(
        crearBoton(
          "Editar",
          () => editarOpinion(id)
        ),
        crearBoton(
          "Eliminar",
          () => eliminarOpinion(id)
        )
      );

      tarjeta.append(
        titulo,
        estrellas,
        comentario,
        fecha,
        acciones
      );

      lista.append(tarjeta);
    });
  }

  // ================================================
  // FASE 19 Y 20 — COLECCIÓN Y ESTADOS
  // ================================================

  function guardarEstado() {
    const id = $("gz2-juego-estado")?.value;
    const estado = $("gz2-estado")?.value;

    if (!buscarJuego(id)) {
      avisar("Selecciona un videojuego.");
      return;
    }

    if (!ESTADOS[estado]) {
      avisar("Selecciona un estado válido.");
      return;
    }

    coleccion[id] = {
      estado,
      fecha: fechaActual()
    };

    if (!guardarJSON(CLAVES.coleccion, coleccion)) return;

    actualizarTodo();
    avisar("Videojuego guardado en tu colección.");
  }

  function eliminarEstado(id) {
    delete coleccion[id];

    if (!guardarJSON(CLAVES.coleccion, coleccion)) return;

    actualizarTodo();
    avisar("Juego eliminado de tu colección.");
  }

  function renderizarColeccion() {
    const lista = limpiarContenedor("gz2-lista-coleccion");
    if (!lista) return;

    const entradas = Object.entries(coleccion)
      .filter(([id, dato]) =>
        buscarJuego(id) && ESTADOS[dato.estado]
      )
      .filter(([, dato]) =>
        filtroColeccion === "todos" ||
        dato.estado === filtroColeccion
      );

    if (!entradas.length) {
      lista.append(
        mensajeVacio("No hay juegos en esta categoría.")
      );
      return;
    }

    entradas.forEach(([id, dato]) => {
      const tarjeta = elemento(
        "article",
        "",
        "gz2-item-coleccion"
      );

      const informacion = elemento("div", "");

      informacion.append(
        elemento("h4", nombreJuego(id)),
        elemento(
          "p",
          "Actualizado: " + fechaVisible(dato.fecha)
        )
      );

      const acciones = elemento("div", "");
      acciones.style.display = "flex";
      acciones.style.flexWrap = "wrap";
      acciones.style.alignItems = "center";
      acciones.style.gap = "10px";

      const estado = elemento(
        "span",
        ESTADOS[dato.estado],
        "gz2-estado-etiqueta"
      );

      const cambiar = crearBoton(
        "Cambiar",
        () => {
          $("gz2-juego-estado").value = id;
          $("gz2-estado").value = dato.estado;

          $("gz2-coleccion")?.scrollIntoView({
            behavior: "smooth"
          });
        }
      );

      const quitar = crearBoton(
        "Quitar",
        () => eliminarEstado(id)
      );

      acciones.append(estado, cambiar, quitar);
      tarjeta.append(informacion, acciones);

      lista.append(tarjeta);
    });
  }

  function prepararFiltrosColeccion() {
    document.querySelectorAll(
      "[data-gz2-estado]"
    ).forEach(boton => {
      boton.addEventListener("click", () => {
        filtroColeccion = boton.dataset.gz2Estado;

        document.querySelectorAll(
          "[data-gz2-estado]"
        ).forEach(item => {
          item.classList.toggle(
            "activo",
            item === boton
          );
        });

        renderizarColeccion();
      });
    });
  }

  // ================================================
  // FASE 21 — HISTORIAL DE EXPLORACIÓN
  // ================================================

  function registrarVisita(juego) {
    if (!juego || juego.id == null) return;

    const id = String(juego.id);

    historial = historial.filter(
      entrada => String(entrada.id) !== id
    );

    historial.unshift({
      id,
      fecha: fechaActual()
    });

    historial = historial.slice(0, 30);

    guardarJSON(CLAVES.historial, historial);
    renderizarHistorial();
  }

  function renderizarHistorial() {
    const lista = limpiarContenedor("gz2-lista-historial");
    if (!lista) return;

    const entradas = historial.filter(
      entrada => buscarJuego(entrada.id)
    );

    if (!entradas.length) {
      lista.append(
        mensajeVacio(
          "Todavía no has visitado fichas de juegos."
        )
      );
      return;
    }

    entradas.forEach(entrada => {
      const tarjeta = elemento(
        "article",
        "",
        "gz2-item-historial"
      );

      const informacion = elemento("div", "");

      informacion.append(
        elemento("h4", nombreJuego(entrada.id)),
        elemento(
          "p",
          "Visitado: " + fechaVisible(entrada.fecha)
        )
      );

      tarjeta.append(informacion);
      lista.append(tarjeta);
    });
  }

  function limpiarHistorial() {
    if (!historial.length) return;

    if (!confirm("¿Borrar el historial de GameZone 2.0?")) {
      return;
    }

    historial = [];

    guardarJSON(CLAVES.historial, historial);
    renderizarHistorial();

    avisar("Historial eliminado.");
  }

  // ================================================
  // FASE 22 — RANKING PERSONAL
  // ================================================

  function renderizarRanking() {
    const lista = limpiarContenedor("gz2-ranking-lista");
    if (!lista) return;

    const ranking = Object.entries(opiniones)
      .filter(([id]) => buscarJuego(id))
      .sort((a, b) =>
        b[1].puntuacion - a[1].puntuacion ||
        nombreJuego(a[0]).localeCompare(nombreJuego(b[0]))
      )
      .slice(0, 10);

    if (!ranking.length) {
      lista.append(
        mensajeVacio(
          "Valora videojuegos para crear tu ranking."
        )
      );
      return;
    }

    ranking.forEach(([id, opinion], indice) => {
      const tarjeta = elemento(
        "article",
        "",
        "gz2-ranking-item"
      );

      const posicion = elemento(
        "span",
        "#" + (indice + 1),
        "gz2-ranking-posicion"
      );

      const informacion = elemento(
        "div",
        "",
        "gz2-ranking-info"
      );

      informacion.append(
        elemento("h4", nombreJuego(id)),
        elemento(
          "p",
          buscarJuego(id)?.genero || "Sin género"
        )
      );

      const puntuacion = elemento(
        "span",
        "★ " + opinion.puntuacion + "/5",
        "gz2-ranking-puntuacion"
      );

      tarjeta.append(
        posicion,
        informacion,
        puntuacion
      );

      lista.append(tarjeta);
    });
  }

  // ================================================
  // FASE 23 — FILTROS INTELIGENTES
  // ================================================

  function cargarPlataformas() {
    const select = $("gz2-filtro-plataforma");
    if (!select) return;

    const plataformas = new Set();

    obtenerJuegos().forEach(juego => {
      plataformaTexto(juego)
        .split(/[,/|]/)
        .map(texto => texto.trim())
        .filter(Boolean)
        .forEach(plataforma =>
          plataformas.add(plataforma)
        );
    });

    select.replaceChildren(
      new Option("Todas las plataformas", "todas")
    );

    [...plataformas]
      .sort((a, b) => a.localeCompare(b, "es"))
      .forEach(plataforma => {
        select.add(new Option(plataforma, plataforma));
      });
  }

  function aplicarFiltros() {
    const plataforma =
      $("gz2-filtro-plataforma")?.value || "todas";

    const puntuacion =
      $("gz2-filtro-puntuacion")?.value || "todas";

    const estado =
      $("gz2-filtro-estado")?.value || "todos";

    const encontrados = obtenerJuegos().filter(juego => {
      const id = String(juego.id);

      const coincidePlataforma =
        plataforma === "todas" ||
        plataformaTexto(juego)
          .toLowerCase()
          .includes(plataforma.toLowerCase());

      const coincidePuntuacion =
        puntuacion === "todas" ||
        Number(opiniones[id]?.puntuacion) ===
          Number(puntuacion);

      const coincideEstado =
        estado === "todos" ||
        coleccion[id]?.estado === estado;

      return (
        coincidePlataforma &&
        coincidePuntuacion &&
        coincideEstado
      );
    });

    const contador = $("gz2-resultados-contador");

    if (contador) {
      contador.textContent =
        encontrados.length +
        " videojuegos encontrados";
    }

    const lista = limpiarContenedor(
      "gz2-resultados-filtros"
    );

    if (!lista) return;

    if (!encontrados.length) {
      lista.append(
        mensajeVacio(
          "No hay videojuegos con esos filtros."
        )
      );
      return;
    }

    encontrados.forEach(juego => {
      const tarjeta = elemento(
        "article",
        "",
        "gz2-resultado-juego"
      );

      const id = String(juego.id);
      const puntuacion = opiniones[id]?.puntuacion;

      tarjeta.append(
        elemento("h4", juego.nombre),
        elemento(
          "p",
          "Género: " + (juego.genero || "Sin género")
        ),
        elemento(
          "p",
          "Plataformas: " + plataformaTexto(juego)
        ),
        elemento(
          "p",
          "Mi valoración: " +
          (puntuacion ? puntuacion + "/5" : "Sin valorar")
        ),
        elemento(
          "p",
          "Estado: " +
          (ESTADOS[coleccion[id]?.estado] || "Sin clasificar")
        )
      );

      const boton = crearBoton(
        "Ver ficha",
        () => {
          if (typeof mostrarFicha === "function") {
            mostrarFicha(
              juego,
              obtenerJuegos().indexOf(juego)
            );
          }
        }
      );

      boton.style.marginTop = "15px";

      tarjeta.append(boton);
      lista.append(tarjeta);
    });
  }

  function restablecerFiltros() {
    $("gz2-filtro-plataforma").value = "todas";
    $("gz2-filtro-puntuacion").value = "todas";
    $("gz2-filtro-estado").value = "todos";

    aplicarFiltros();
    avisar("Filtros restablecidos.");
  }

  // ================================================
  // FASE 24 — ESTADÍSTICAS
  // ================================================

  function actualizarEstadisticas() {
    const totalValorados = Object.keys(opiniones)
      .filter(id => buscarJuego(id)).length;

    const totalResenas = Object.entries(opiniones)
      .filter(([id, opinion]) =>
        buscarJuego(id) && opinion.texto?.trim()
      ).length;

    const totalPendientes = Object.entries(coleccion)
      .filter(([id, dato]) =>
        buscarJuego(id) &&
        dato.estado === "pendiente"
      ).length;

    const totalCompletados = Object.entries(coleccion)
      .filter(([id, dato]) =>
        buscarJuego(id) &&
        dato.estado === "completado"
      ).length;

    const valores = {
      "gz2-total-valorados": totalValorados,
      "gz2-total-resenas": totalResenas,
      "gz2-total-pendientes": totalPendientes,
      "gz2-total-completados": totalCompletados
    };

    Object.entries(valores).forEach(([id, valor]) => {
      const nodo = $(id);

      if (nodo) nodo.textContent = valor;
    });
  }

  // ================================================
  // FASE 25 — EXPORTAR E IMPORTAR DATOS
  // ================================================

  function exportarDatos() {
    const respaldo = {
      aplicacion: "GameZone",
      version: 2,
      fecha: fechaActual(),
      opiniones,
      coleccion,
      historial,
      preferencias: {
        nombre: localStorage.getItem("gamezone_nombre"),
        tema: localStorage.getItem("gamezone_tema")
      }
    };

    // Incluimos las claves del proyecto original
    // que se encuentren guardadas en el navegador.

    respaldo.datosLocales = {};

    for (let i = 0; i < localStorage.length; i++) {
      const clave = localStorage.key(i);

      if (
        clave &&
        (clave.startsWith("gz_") ||
         clave.startsWith("gamezone_"))
      ) {
        respaldo.datosLocales[clave] =
          localStorage.getItem(clave);
      }
    }

    const archivo = new Blob(
      [JSON.stringify(respaldo, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "gamezone-respaldo.json";

    document.body.append(enlace);
    enlace.click();
    enlace.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    avisar("Copia de seguridad preparada.");
  }

  async function importarDatos(archivo) {
    if (!archivo) return;

    if (archivo.size > 2 * 1024 * 1024) {
      avisar("El archivo es demasiado grande.");
      return;
    }

    try {
      const texto = await archivo.text();
      const respaldo = JSON.parse(texto);

      if (
        respaldo.aplicacion !== "GameZone" ||
        respaldo.version !== 2 ||
        !respaldo.opiniones ||
        !respaldo.coleccion ||
        !Array.isArray(respaldo.historial)
      ) {
        throw new Error("Formato de respaldo no válido.");
      }

      if (
        typeof respaldo.opiniones !== "object" ||
        Array.isArray(respaldo.opiniones) ||
        typeof respaldo.coleccion !== "object" ||
        Array.isArray(respaldo.coleccion)
      ) {
        throw new Error("Datos incompatibles.");
      }

      if (!confirm(
        "¿Importar esta copia? Se reemplazarán los datos actuales de GameZone 2.0."
      )) {
        return;
      }

      opiniones = respaldo.opiniones;
      coleccion = respaldo.coleccion;
      historial = respaldo.historial;

      guardarJSON(CLAVES.opiniones, opiniones);
      guardarJSON(CLAVES.coleccion, coleccion);
      guardarJSON(CLAVES.historial, historial);

      // Solo restaurar claves reconocidas.

      if (
        respaldo.datosLocales &&
        typeof respaldo.datosLocales === "object"
      ) {
        Object.entries(respaldo.datosLocales)
          .forEach(([clave, valor]) => {
            if (
              typeof valor === "string" &&
              (clave.startsWith("gz_") ||
               clave.startsWith("gamezone_"))
            ) {
              localStorage.setItem(clave, valor);
            }
          });
      }

      avisar("Datos importados. Recargando GameZone...");

      setTimeout(() => location.reload(), 800);

    } catch (error) {
      console.error(error);
      avisar("No se pudo importar el archivo JSON.");
    }
  }

  // ================================================
  // ACTUALIZACIÓN GENERAL
  // ================================================

  function actualizarTodo() {
    renderizarOpiniones();
    renderizarColeccion();
    renderizarHistorial();
    renderizarRanking();
    actualizarEstadisticas();
    aplicarFiltros();
  }

  // ================================================
  // INTEGRACIÓN CON LAS FASES ANTERIORES
  // ================================================

  function conectarHistorial() {
    if (typeof mostrarFicha !== "function") return;

    const mostrarFichaAnterior = mostrarFicha;

    mostrarFicha = function (juego, posicion) {
      mostrarFichaAnterior(juego, posicion);
      registrarVisita(juego);
    };
  }

  function conectarCargaCatalogo() {
    if (typeof renderizar !== "function") return;

    const renderizarAnterior = renderizar;

    let cantidadAnterior = -1;

    renderizar = function (...argumentos) {
      renderizarAnterior(...argumentos);

      const cantidad = obtenerJuegos().length;

      if (cantidad > 0 && cantidad !== cantidadAnterior) {
        cantidadAnterior = cantidad;

        cargarSelectores();
        cargarPlataformas();
        actualizarTodo();
      }
    };
  }

  // ================================================
  // EVENTOS DE BOTONES
  // ================================================

  function conectarEventos() {
    $("gz2-guardar-resena")?.addEventListener(
      "click",
      guardarOpinion
    );

    $("gz2-guardar-estado")?.addEventListener(
      "click",
      guardarEstado
    );

    $("gz2-limpiar-historial")?.addEventListener(
      "click",
      limpiarHistorial
    );

    $("gz2-aplicar-filtros")?.addEventListener(
      "click",
      aplicarFiltros
    );

    $("gz2-limpiar-filtros")?.addEventListener(
      "click",
      restablecerFiltros
    );

    $("gz2-exportar")?.addEventListener(
      "click",
      exportarDatos
    );

    $("gz2-importar-boton")?.addEventListener(
      "click",
      () => $("gz2-importar-archivo")?.click()
    );

    $("gz2-importar-archivo")?.addEventListener(
      "change",
      async evento => {
        const archivo = evento.target.files?.[0];

        await importarDatos(archivo);

        evento.target.value = "";
      }
    );

    prepararFiltrosColeccion();
  }

  // ================================================
  // INICIAR GAMEZONE 2.0
  // ================================================

  function iniciar() {
    conectarEventos();
    conectarHistorial();
    conectarCargaCatalogo();

    if (obtenerJuegos().length > 0) {
      cargarSelectores();
      cargarPlataformas();
    }

    actualizarTodo();

    console.log(
      "GameZone 2.0 — Fases 17 a 26 activadas"
    );
  }

  iniciar();

})();

/* =====================================================
   FIN — GAMEZONE 2.0
===================================================== */



/* =====================================================
   GAMEZONE 3.0 — BLACK & WHITE ULTIMATE
   FASES 27 A 36
   JAVASCRIPT COMPLETO
===================================================== */

(() => {
  "use strict";

  // ================================================
  // CONFIGURACIÓN
  // ================================================

  const GZ3 = {
    claves: {
      colecciones: "gz3_colecciones",
      etiquetas: "gz3_etiquetas",
      batallas: "gz3_batallas",
      visitas: "gz3_visitas",
      ajustes: "gz3_ajustes"
    },

    novedadesVisibles: 8,
    batallaActual: null,
    iniciando: false,
    catalogoAnterior: "",
    visitaAnterior: null
  };

  const $3 = id => document.getElementById(id);

  function leer3(clave, respaldo) {
    try {
      const valor = localStorage.getItem(clave);
      return valor === null ? respaldo : JSON.parse(valor);
    } catch {
      return respaldo;
    }
  }

  function guardar3(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error("GameZone 3.0:", error);
      notificar3("No se pudieron guardar los datos.");
      return false;
    }
  }

  function notificar3(mensaje) {
    if (typeof gzNotificar === "function") {
      gzNotificar(mensaje);
    } else {
      console.log("GameZone 3.0:", mensaje);
    }
  }

  function nodo3(tipo, texto = "", clase = "") {
    const nodo = document.createElement(tipo);
    nodo.textContent = texto;

    if (clase) nodo.className = clase;

    return nodo;
  }

  function vacio3(mensaje) {
    return nodo3("p", mensaje, "gz3-vacio");
  }

  function limpiar3(id) {
    const contenedor = $3(id);
    if (contenedor) contenedor.replaceChildren();
    return contenedor;
  }

  function boton3(texto, accion, clase = "gz3-boton-secundario") {
    const boton = nodo3("button", texto, clase);
    boton.type = "button";
    boton.addEventListener("click", accion);
    return boton;
  }

  function confirmar3(mensaje) {
    if (ajustes.confirmaciones === false) return true;
    return confirm(mensaje);
  }

  function juegos3() {
    return typeof juegos !== "undefined" && Array.isArray(juegos)
      ? juegos
      : [];
  }

  function buscar3(id) {
    return juegos3().find(
      juego => String(juego.id) === String(id)
    );
  }

  function nombre3(juego) {
    return String(
      juego?.nombre || juego?.titulo || "Sin título"
    );
  }

  function genero3(juego) {
    const genero = juego?.genero || juego?.generos || "";

    return Array.isArray(genero)
      ? genero.join(", ")
      : String(genero || "Sin género");
  }

  function imagen3(juego) {
    return juego?.imagen ||
           juego?.portada ||
           juego?.image ||
           "";
  }

  function fecha3(fecha) {
    const valor = new Date(fecha);
    return Number.isNaN(valor.getTime())
      ? "Sin fecha"
      : valor.toLocaleDateString("es-PE");
  }

  function abrirFicha3(juego) {
    if (!juego) return;

    if (typeof mostrarFicha === "function") {
      mostrarFicha(juego, juegos3().indexOf(juego));
    } else {
      notificar3(nombre3(juego));
    }
  }

  function selectorJuegos3(id) {
    const select = $3(id);
    if (!select) return;

    const anterior = select.value;

    select.replaceChildren(
      new Option("Seleccionar videojuego", "")
    );

    [...juegos3()]
      .sort((a, b) =>
        nombre3(a).localeCompare(nombre3(b), "es")
      )
      .forEach(juego => {
        select.add(
          new Option(nombre3(juego), String(juego.id))
        );
      });

    if (buscar3(anterior)) select.value = anterior;
  }

  // ================================================
  // DATOS PERSISTENTES
  // ================================================

  let colecciones = leer3(GZ3.claves.colecciones, []);
  let etiquetas = leer3(GZ3.claves.etiquetas, {});
  let batallas = leer3(GZ3.claves.batallas, {});
  let visitas = leer3(GZ3.claves.visitas, {});
  let ajustes = leer3(GZ3.claves.ajustes, {
    animaciones: true,
    compacto: false,
    confirmaciones: true
  });

  if (!Array.isArray(colecciones)) colecciones = [];

  if (!etiquetas || typeof etiquetas !== "object" ||
      Array.isArray(etiquetas)) etiquetas = {};

  if (!batallas || typeof batallas !== "object" ||
      Array.isArray(batallas)) batallas = {};

  if (!visitas || typeof visitas !== "object" ||
      Array.isArray(visitas)) visitas = {};

  if (!ajustes || typeof ajustes !== "object") {
    ajustes = {
      animaciones: true,
      compacto: false,
      confirmaciones: true
    };
  }

  // ================================================
  // FASE 27 — NOVEDADES
  // ================================================

  function crearTarjeta3(juego) {
    const tarjeta = nodo3("article", "", "gz3-juego-card");

    const imagen = imagen3(juego);

    if (imagen) {
      const portada = document.createElement("img");
      portada.src = imagen;
      portada.alt = "Portada de " + nombre3(juego);
      portada.loading = "lazy";
      portada.className = "gz3-juego-imagen";
      tarjeta.append(portada);
    }

    const contenido = nodo3("div", "", "gz3-juego-contenido");

    contenido.append(
      nodo3("h4", nombre3(juego)),
      nodo3("p", genero3(juego)),
      boton3(
        "Ver videojuego ↗",
        () => abrirFicha3(juego),
        "gz3-boton-principal"
      )
    );

    tarjeta.append(contenido);

    return tarjeta;
  }

  function renderNovedades3() {
    const lista = limpiar3("gz3-lista-novedades");
    if (!lista) return;

    const catalogo = [...juegos3()];

    // Cuando exista fecha de incorporación, se utiliza.
    // En caso contrario se conserva el orden del JSON.

    const novedades = catalogo
      .map((juego, indice) => ({ juego, indice }))
      .sort((a, b) => {
        const fechaA = Date.parse(
          a.juego.fechaAgregado || a.juego.fecha_agregado || ""
        ) || 0;

        const fechaB = Date.parse(
          b.juego.fechaAgregado || b.juego.fecha_agregado || ""
        ) || 0;

        return fechaB - fechaA || b.indice - a.indice;
      });

    const visibles = novedades.slice(
      0,
      GZ3.novedadesVisibles
    );

    if (!visibles.length) {
      lista.append(vacio3("No hay videojuegos disponibles."));
      return;
    }

    visibles.forEach(({ juego }) => {
      lista.append(crearTarjeta3(juego));
    });

    const boton = $3("gz3-ver-mas-novedades");

    if (boton) {
      boton.hidden = novedades.length <= GZ3.novedadesVisibles;
    }
  }

  function mostrarMasNovedades3() {
    GZ3.novedadesVisibles += 8;
    renderNovedades3();
  }

  // ================================================
  // FASE 28 — POPULARIDAD LOCAL
  // ================================================

  function favoritos3() {
    if (typeof favoritos !== "undefined" &&
        favoritos instanceof Set) {
      return favoritos;
    }

    return new Set();
  }

  function registrarVisita3(juego) {
    if (!juego || juego.id == null) return;

    const id = String(juego.id);

    visitas[id] = (Number(visitas[id]) || 0) + 1;

    guardar3(GZ3.claves.visitas, visitas);

    renderPopulares3();
  }

  function puntuacionPopular3(juego) {
    const id = String(juego.id);

    const totalVisitas = Number(visitas[id]) || 0;

    const favorito = [...favoritos3()]
      .some(valor => String(valor) === id);

    return totalVisitas + (favorito ? 5 : 0);
  }

  function renderPopulares3() {
    const lista = limpiar3("gz3-lista-populares");
    if (!lista) return;

    const ranking = [...juegos3()]
      .map(juego => ({
        juego,
        puntos: puntuacionPopular3(juego)
      }))
      .filter(item => item.puntos > 0)
      .sort((a, b) =>
        b.puntos - a.puntos ||
        nombre3(a.juego).localeCompare(nombre3(b.juego))
      )
      .slice(0, 10);

    if (!ranking.length) {
      lista.append(
        vacio3(
          "Explora juegos o añade favoritos para crear tu ranking local."
        )
      );
      return;
    }

    ranking.forEach((item, indice) => {
      const tarjeta = nodo3(
        "article",
        "",
        "gz3-popular-item"
      );

      const posicion = nodo3(
        "span",
        "#" + (indice + 1),
        "gz3-popular-posicion"
      );

      const informacion = nodo3(
        "div",
        "",
        "gz3-popular-info"
      );

      informacion.append(
        nodo3("h4", nombre3(item.juego)),
        nodo3("p", genero3(item.juego))
      );

      const puntos = nodo3(
        "span",
        item.puntos + " pts",
        "gz3-popular-puntos"
      );

      tarjeta.append(posicion, informacion, puntos);

      lista.append(tarjeta);
    });
  }

  // ================================================
  // FASE 29 — BÚSQUEDA INTELIGENTE
  // ================================================

  function normalizar3(texto) {
    return String(texto)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function buscarInteligente3() {
    const texto = normalizar3(
      $3("gz3-input-busqueda")?.value || ""
    );

    const lista = limpiar3("gz3-sugerencias");
    const estado = $3("gz3-busqueda-estado");

    if (!lista) return;

    if (!texto) {
      if (estado) {
        estado.textContent =
          "Empieza a escribir para buscar videojuegos.";
      }
      return;
    }

    const encontrados = juegos3()
      .filter(juego =>
        normalizar3(nombre3(juego)).includes(texto) ||
        normalizar3(genero3(juego)).includes(texto)
      )
      .slice(0, 10);

    if (estado) {
      estado.textContent =
        encontrados.length + " sugerencias encontradas.";
    }

    if (!encontrados.length) {
      lista.append(
        vacio3("No encontramos coincidencias.")
      );
      return;
    }

    encontrados.forEach(juego => {
      const boton = boton3(
        nombre3(juego) + "  ↗",
        () => abrirFicha3(juego),
        "gz3-sugerencia"
      );

      lista.append(boton);
    });
  }

  function limpiarBusqueda3() {
    const input = $3("gz3-input-busqueda");
    if (!input) return;

    input.value = "";
    buscarInteligente3();
    input.focus();
  }

  // ================================================
  // FASE 30 — COLECCIONES PERSONALIZADAS
  // ================================================

  function crearColeccion3() {
    const input = $3("gz3-nombre-coleccion");
    const nombre = input?.value.trim();

    if (!nombre) {
      notificar3("Escribe el nombre de tu colección.");
      return;
    }

    if (colecciones.some(
      item => normalizar3(item.nombre) === normalizar3(nombre)
    )) {
      notificar3("Ya existe una colección con ese nombre.");
      return;
    }

    colecciones.push({
      id: "gz3_" + Date.now(),
      nombre: nombre.slice(0, 40),
      juegos: [],
      fecha: new Date().toISOString()
    });

    if (!guardar3(GZ3.claves.colecciones, colecciones)) return;

    input.value = "";

    renderColecciones3();
    notificar3("Colección creada correctamente.");
  }

  function agregarAColeccion3() {
    const idColeccion = $3("gz3-seleccionar-coleccion")?.value;
    const idJuego = $3("gz3-juego-coleccion")?.value;

    const coleccion = colecciones.find(
      item => item.id === idColeccion
    );

    if (!coleccion || !buscar3(idJuego)) {
      notificar3("Selecciona una colección y un juego.");
      return;
    }

    if (coleccion.juegos.includes(String(idJuego))) {
      notificar3("Ese juego ya está en la colección.");
      return;
    }

    coleccion.juegos.push(String(idJuego));

    guardar3(GZ3.claves.colecciones, colecciones);

    renderColecciones3();
    notificar3("Videojuego añadido.");
  }

  function quitarDeColeccion3(idColeccion, idJuego) {
    const coleccion = colecciones.find(
      item => item.id === idColeccion
    );

    if (!coleccion) return;

    coleccion.juegos = coleccion.juegos.filter(
      id => String(id) !== String(idJuego)
    );

    guardar3(GZ3.claves.colecciones, colecciones);
    renderColecciones3();
  }

  function eliminarColeccion3(id) {
    if (!confirmar3("¿Eliminar esta colección?")) return;

    colecciones = colecciones.filter(
      item => item.id !== id
    );

    guardar3(GZ3.claves.colecciones, colecciones);
    renderColecciones3();

    notificar3("Colección eliminada.");
  }

  function renderColecciones3() {
    const lista = limpiar3("gz3-lista-colecciones");
    const select = $3("gz3-seleccionar-coleccion");

    if (select) {
      const anterior = select.value;

      select.replaceChildren(
        new Option("Seleccionar colección", "")
      );

      colecciones.forEach(item => {
        select.add(new Option(item.nombre, item.id));
      });

      if (colecciones.some(item => item.id === anterior)) {
        select.value = anterior;
      }
    }

    if (!lista) return;

    if (!colecciones.length) {
      lista.append(
        vacio3("Todavía no has creado colecciones.")
      );
      return;
    }

    colecciones.forEach(coleccion => {
      const tarjeta = nodo3(
        "article",
        "",
        "gz3-coleccion-card"
      );

      const juegosValidos = coleccion.juegos
        .map(id => buscar3(id))
        .filter(Boolean);

      tarjeta.append(
        nodo3("h4", coleccion.nombre),
        nodo3(
          "p",
          juegosValidos.length + " videojuegos"
        )
      );

      const contenido = nodo3(
        "div",
        "",
        "gz3-coleccion-juegos"
      );

      juegosValidos.forEach(juego => {
        const elemento = nodo3(
          "div",
          "",
          "gz3-coleccion-juego"
        );

        elemento.append(
          nodo3("span", nombre3(juego)),
          boton3(
            "×",
            () => quitarDeColeccion3(
              coleccion.id,
              String(juego.id)
            )
          )
        );

        contenido.append(elemento);
      });

      if (!juegosValidos.length) {
        contenido.append(
          nodo3("p", "Colección vacía.")
        );
      }

      tarjeta.append(
        contenido,
        boton3(
          "Eliminar colección",
          () => eliminarColeccion3(coleccion.id)
        )
      );

      lista.append(tarjeta);
    });
  }

  // ================================================
  // FASE 31 — ETIQUETAS
  // ================================================

  function guardarEtiqueta3() {
    const id = $3("gz3-juego-etiqueta")?.value;
    const input = $3("gz3-nueva-etiqueta");
    const etiqueta = input?.value.trim();

    if (!buscar3(id) || !etiqueta) {
      notificar3("Selecciona un juego y escribe una etiqueta.");
      return;
    }

    if (!Array.isArray(etiquetas[id])) {
      etiquetas[id] = [];
    }

    if (etiquetas[id].some(
      valor => normalizar3(valor) === normalizar3(etiqueta)
    )) {
      notificar3("Esa etiqueta ya existe.");
      return;
    }

    etiquetas[id].push(etiqueta.slice(0, 25));

    guardar3(GZ3.claves.etiquetas, etiquetas);

    input.value = "";
    renderEtiquetas3();

    notificar3("Etiqueta guardada.");
  }

  function eliminarEtiqueta3(id, etiqueta) {
    etiquetas[id] = (etiquetas[id] || []).filter(
      valor => valor !== etiqueta
    );

    if (!etiquetas[id].length) delete etiquetas[id];

    guardar3(GZ3.claves.etiquetas, etiquetas);
    renderEtiquetas3();
  }

  function renderEtiquetas3() {
    const lista = limpiar3("gz3-lista-etiquetas");
    if (!lista) return;

    let total = 0;

    Object.entries(etiquetas).forEach(([id, valores]) => {
      const juego = buscar3(id);

      if (!juego || !Array.isArray(valores)) return;

      valores.forEach(etiqueta => {
        total++;

        const tarjeta = nodo3(
          "div",
          "",
          "gz3-etiqueta-item"
        );

        tarjeta.append(
          nodo3(
            "span",
            "#" + etiqueta + " · " + nombre3(juego)
          ),
          boton3(
            "×",
            () => eliminarEtiqueta3(id, etiqueta)
          )
        );

        lista.append(tarjeta);
      });
    });

    const contador = $3("gz3-contador-etiquetas");

    if (contador) {
      contador.textContent = total + " etiquetas";
    }

    if (!total) {
      lista.append(
        vacio3("Tus etiquetas aparecerán aquí.")
      );
    }
  }

  // ================================================
  // FASE 32 — RULETA GAMER
  // ================================================

  function cargarGenerosRuleta3() {
    const select = $3("gz3-ruleta-genero");
    if (!select) return;

    const generos = new Set();

    juegos3().forEach(juego => {
      genero3(juego)
        .split(/[,/|]/)
        .map(valor => valor.trim())
        .filter(Boolean)
        .forEach(genero => generos.add(genero));
    });

    select.replaceChildren(
      new Option("Todos los géneros", "todos")
    );

    [...generos].sort().forEach(genero => {
      select.add(new Option(genero, genero));
    });
  }

  function girarRuleta3() {
    const genero = $3("gz3-ruleta-genero")?.value || "todos";

    const candidatos = juegos3().filter(juego =>
      genero === "todos" ||
      genero3(juego)
        .toLowerCase()
        .includes(genero.toLowerCase())
    );

    if (!candidatos.length) {
      notificar3("No hay videojuegos para esa categoría.");
      return;
    }

    const boton = $3("gz3-girar-ruleta");
    const visual = $3("gz3-ruleta-visual");
    const resultado = limpiar3("gz3-ruleta-resultado");

    if (boton) boton.disabled = true;

    if (visual) {
      visual.classList.remove("gz3-girando");
      void visual.offsetWidth;
      visual.classList.add("gz3-girando");
    }

    if (resultado) {
      resultado.append(
        nodo3("h4", "ELIGIENDO VIDEOJUEGO..."),
        nodo3("p", "La ruleta está girando.")
      );
    }

    const elegido = candidatos[
      Math.floor(Math.random() * candidatos.length)
    ];

    const reducirMovimiento =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const duracion =
      ajustes.animaciones === false || reducirMovimiento
        ? 0
        : 1800;

    setTimeout(() => {
      const caja = limpiar3("gz3-ruleta-resultado");

      if (caja) {
        caja.append(
          nodo3("h4", nombre3(elegido)),
          nodo3("p", genero3(elegido)),
          boton3(
            "Ver videojuego ↗",
            () => abrirFicha3(elegido),
            "gz3-boton-principal"
          )
        );
      }

      visual?.classList.remove("gz3-girando");

      if (boton) boton.disabled = false;

      notificar3("¡La ruleta eligió " + nombre3(elegido) + "!");
    }, duracion);
  }

  // ================================================
  // FASE 33 — BATALLAS DE VIDEOJUEGOS
  // ================================================

  function portadaBatalla3(id, juego) {
    const caja = limpiar3(id);
    if (!caja) return;

    const imagen = imagen3(juego);

    if (imagen) {
      const img = document.createElement("img");
      img.src = imagen;
      img.alt = "Portada de " + nombre3(juego);
      img.loading = "lazy";
      caja.append(img);
    } else {
      caja.append(nodo3("strong", "GZ"));
    }
  }

  function nuevaBatalla3() {
    const catalogo = juegos3();

    if (catalogo.length < 2) {
      notificar3("Necesitamos al menos dos videojuegos.");
      return;
    }

    const primero = Math.floor(Math.random() * catalogo.length);

    let segundo;

    do {
      segundo = Math.floor(Math.random() * catalogo.length);
    } while (segundo === primero);

    GZ3.batallaActual = [
      catalogo[primero],
      catalogo[segundo]
    ];

    const [juego1, juego2] = GZ3.batallaActual;

    $3("gz3-batalla-nombre-1").textContent = nombre3(juego1);
    $3("gz3-batalla-nombre-2").textContent = nombre3(juego2);

    portadaBatalla3("gz3-batalla-portada-1", juego1);
    portadaBatalla3("gz3-batalla-portada-2", juego2);

    $3("gz3-votar-1").disabled = false;
    $3("gz3-votar-2").disabled = false;

    $3("gz3-batalla-resultado").textContent =
      "Elige cuál de los dos videojuegos gana.";
  }

  function votarBatalla3(indice) {
    if (!GZ3.batallaActual) return;

    const ganador = GZ3.batallaActual[indice];

    if (!ganador) return;

    const id = String(ganador.id);

    batallas[id] = (Number(batallas[id]) || 0) + 1;

    guardar3(GZ3.claves.batallas, batallas);

    $3("gz3-votar-1").disabled = true;
    $3("gz3-votar-2").disabled = true;

    $3("gz3-batalla-resultado").textContent =
      "🏆 Ganador: " + nombre3(ganador);

    GZ3.batallaActual = null;

    renderBatallas3();
  }

  function renderBatallas3() {
    const lista = limpiar3("gz3-ranking-batallas");
    if (!lista) return;

    const ranking = Object.entries(batallas)
      .filter(([id]) => buscar3(id))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (!ranking.length) {
      lista.append(
        vacio3("Todavía no hay ganadores.")
      );
      return;
    }

    ranking.forEach(([id, victorias], indice) => {
      const tarjeta = nodo3(
        "article",
        "",
        "gz3-batalla-ganador"
      );

      tarjeta.append(
        nodo3(
          "strong",
          "#" + (indice + 1) + " " + nombre3(buscar3(id))
        ),
        nodo3(
          "span",
          victorias + " victorias"
        )
      );

      lista.append(tarjeta);
    });
  }

  function reiniciarBatallas3() {
    if (!confirmar3("¿Reiniciar los resultados de batallas?")) {
      return;
    }

    batallas = {};
    GZ3.batallaActual = null;

    guardar3(GZ3.claves.batallas, batallas);

    $3("gz3-votar-1").disabled = true;
    $3("gz3-votar-2").disabled = true;

    $3("gz3-batalla-resultado").textContent =
      "Genera una batalla para comenzar.";

    renderBatallas3();
    notificar3("Resultados reiniciados.");
  }

  // ================================================
  // FASE 34 — GRÁFICOS VISUALES
  // ================================================

  function crearGrafico3(id, datos) {
    const contenedor = limpiar3(id);
    if (!contenedor) return;

    const entradas = Object.entries(datos)
      .filter(([, valor]) => Number(valor) > 0)
      .sort((a, b) => b[1] - a[1]);

    if (!entradas.length) {
      contenedor.append(vacio3("Sin datos todavía."));
      return;
    }

    const maximo = Math.max(
      ...entradas.map(([, valor]) => Number(valor))
    );

    entradas.forEach(([nombre, valor]) => {
      const fila = nodo3("div", "", "gz3-grafico-fila");

      const info = nodo3("div", "", "gz3-grafico-info");

      info.append(
        nodo3("span", nombre),
        nodo3("span", String(valor))
      );

      const barra = nodo3("div", "", "gz3-grafico-barra");
      const progreso = nodo3(
        "div",
        "",
        "gz3-grafico-progreso"
      );

      progreso.style.width =
        (Number(valor) / maximo * 100) + "%";

      barra.append(progreso);
      fila.append(info, barra);
      contenedor.append(fila);
    });
  }

  function renderGraficos3() {
    const opiniones = leer3("gz2_opiniones", {});
    const estados = leer3("gz2_coleccion", {});

    const generos = {};
    const resumenEstados = {};
    const valoraciones = {};

    const idsFavoritos = [...favoritos3()]
      .map(id => String(id));

    idsFavoritos.forEach(id => {
      const juego = buscar3(id);
      if (!juego) return;

      const genero = genero3(juego);

      generos[genero] = (generos[genero] || 0) + 1;
    });

    Object.entries(estados || {}).forEach(([id, dato]) => {
      if (!buscar3(id)) return;

      const estado = dato?.estado;

      if (!["pendiente", "jugando", "completado"].includes(estado)) {
        return;
      }

      resumenEstados[estado] =
        (resumenEstados[estado] || 0) + 1;
    });

    Object.entries(opiniones || {}).forEach(([id, dato]) => {
      if (!buscar3(id)) return;

      const puntuacion = Number(dato?.puntuacion);

      if (puntuacion < 1 || puntuacion > 5) return;

      const nombre = puntuacion + " estrellas";

      valoraciones[nombre] =
        (valoraciones[nombre] || 0) + 1;
    });

    crearGrafico3("gz3-grafico-generos", generos);
    crearGrafico3("gz3-grafico-estados", resumenEstados);
    crearGrafico3("gz3-grafico-valoraciones", valoraciones);
  }

  // ================================================
  // FASE 35 — CENTRO DE AJUSTES
  // ================================================

  function aplicarAjustes3() {
    document.body.classList.toggle(
      "gz3-sin-animaciones",
      ajustes.animaciones === false
    );

    document.body.classList.toggle(
      "gz3-modo-compacto",
      ajustes.compacto === true
    );

    const animaciones = $3("gz3-ajuste-animaciones");
    const compacto = $3("gz3-ajuste-compacto");
    const confirmaciones = $3("gz3-ajuste-confirmaciones");

    if (animaciones) {
      animaciones.checked = ajustes.animaciones !== false;
    }

    if (compacto) {
      compacto.checked = ajustes.compacto === true;
    }

    if (confirmaciones) {
      confirmaciones.checked =
        ajustes.confirmaciones !== false;
    }
  }

  function guardarAjustes3() {
    ajustes = {
      animaciones:
        $3("gz3-ajuste-animaciones")?.checked ?? true,

      compacto:
        $3("gz3-ajuste-compacto")?.checked ?? false,

      confirmaciones:
        $3("gz3-ajuste-confirmaciones")?.checked ?? true
    };

    guardar3(GZ3.claves.ajustes, ajustes);
    aplicarAjustes3();

    notificar3("Preferencias guardadas.");
  }

  // ================================================
  // FASE 36 — INTEGRACIÓN
  // ================================================

  function actualizarCatalogo3() {
    const catalogo = juegos3();

    if (!catalogo.length) return;

    const firma = catalogo.map(juego => String(juego.id)).join("|");

    if (firma === GZ3.catalogoAnterior) return;

    GZ3.catalogoAnterior = firma;

    [
      "gz3-juego-coleccion",
      "gz3-juego-etiqueta"
    ].forEach(selectorJuegos3);

    cargarGenerosRuleta3();
    renderNovedades3();
    renderPopulares3();
    renderColecciones3();
    renderEtiquetas3();
    renderBatallas3();
    renderGraficos3();
  }

  function actualizarActividad3() {
    renderPopulares3();
    renderGraficos3();
  }

  function integrarFicha3() {
    if (typeof mostrarFicha !== "function") return;

    const anterior = mostrarFicha;

    mostrarFicha = function (...argumentos) {
      const resultado = anterior.apply(this, argumentos);

      const candidato = argumentos[0];

      let juego = null;

      if (candidato && typeof candidato === "object") {
        juego = candidato;
      } else if (typeof candidato === "number") {
        juego = juegos3()[candidato] || buscar3(candidato);
      } else {
        juego = buscar3(candidato);
      }

      if (juego) registrarVisita3(juego);

      return resultado;
    };
  }

  function integrarRenderizado3() {
    if (typeof renderizar !== "function") return;

    const anterior = renderizar;

    renderizar = function (...argumentos) {
      const resultado = anterior.apply(this, argumentos);

      actualizarCatalogo3();
      actualizarActividad3();

      return resultado;
    };
  }

  function integrarFavoritos3() {
    if (typeof guardarFavoritos !== "function") return;

    const anterior = guardarFavoritos;

    guardarFavoritos = function (...argumentos) {
      const resultado = anterior.apply(this, argumentos);

      actualizarActividad3();

      return resultado;
    };
  }

  // ================================================
  // CONECTAR EVENTOS
  // ================================================

  function eventos3() {
    $3("gz3-ver-mas-novedades")?.addEventListener(
      "click",
      mostrarMasNovedades3
    );

    $3("gz3-input-busqueda")?.addEventListener(
      "input",
      buscarInteligente3
    );

    $3("gz3-limpiar-busqueda")?.addEventListener(
      "click",
      limpiarBusqueda3
    );

    $3("gz3-crear-coleccion")?.addEventListener(
      "click",
      crearColeccion3
    );

    $3("gz3-agregar-coleccion")?.addEventListener(
      "click",
      agregarAColeccion3
    );

    $3("gz3-guardar-etiqueta")?.addEventListener(
      "click",
      guardarEtiqueta3
    );

    $3("gz3-girar-ruleta")?.addEventListener(
      "click",
      girarRuleta3
    );

    $3("gz3-nueva-batalla")?.addEventListener(
      "click",
      nuevaBatalla3
    );

    $3("gz3-votar-1")?.addEventListener(
      "click",
      () => votarBatalla3(0)
    );

    $3("gz3-votar-2")?.addEventListener(
      "click",
      () => votarBatalla3(1)
    );

    $3("gz3-reiniciar-batallas")?.addEventListener(
      "click",
      reiniciarBatallas3
    );

    $3("gz3-guardar-ajustes")?.addEventListener(
      "click",
      guardarAjustes3
    );
  }

  // ================================================
  // INICIALIZACIÓN FINAL
  // ================================================

  function iniciarGameZone3() {
    if (GZ3.iniciando) return;

    GZ3.iniciando = true;

    eventos3();
    aplicarAjustes3();

    integrarFicha3();
    integrarRenderizado3();
    integrarFavoritos3();

    actualizarCatalogo3();

    // Respaldo para catálogos cargados mediante fetch.
    // Se detiene cuando los juegos están disponibles.

    if (!juegos3().length) {
      let intentos = 0;

      const espera = setInterval(() => {
        intentos++;

        actualizarCatalogo3();

        if (juegos3().length || intentos >= 40) {
          clearInterval(espera);
        }
      }, 250);
    }

    console.log(
      "GAMEZONE 3.0 — FASES 27 A 36 ACTIVADAS"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciarGameZone3,
      { once: true }
    );
  } else {
    iniciarGameZone3();
  }

})();

/* =====================================================
   FIN — GAMEZONE 3.0
===================================================== */



/* ==========================================================
   GAMEZONE 4.0 — BLACK & WHITE ULTIMATE
   FASES 37 A 46
   JAVASCRIPT COMPLETO
========================================================== */

(() => {
    "use strict";

    /* ======================================================
       CONFIGURACIÓN Y UTILIDADES
    ====================================================== */

    const GZ4 = {
        claves: {
            noticias: "gz4_noticias",
            lanzamientos: "gz4_lanzamientos",
            deseos: "gz4_deseos",
            notificaciones: "gz4_notificaciones",
            logrosAvisados: "gz4_logros_avisados"
        },

        filtroLanzamientos: "proximos",
        filtroDeseos: "todos",
        catalogoFirma: "",
        iniciado: false
    };

    const $4 = id => document.getElementById(id);

    function leer4(clave, respaldo) {
        try {
            const valor = localStorage.getItem(clave);

            return valor === null
                ? respaldo
                : JSON.parse(valor);

        } catch (error) {
            console.warn("GameZone 4.0:", error);
            return respaldo;
        }
    }

    function guardar4(clave, valor) {
        try {
            localStorage.setItem(
                clave,
                JSON.stringify(valor)
            );

            return true;

        } catch (error) {
            console.error("Error al guardar:", error);
            return false;
        }
    }

    function crear4(tipo, texto = "", clase = "") {
        const elemento = document.createElement(tipo);

        elemento.textContent = texto;

        if (clase) {
            elemento.className = clase;
        }

        return elemento;
    }

    function boton4(
        texto,
        accion,
        clase = "gz4-boton-secundario"
    ) {
        const boton = crear4("button", texto, clase);

        boton.type = "button";
        boton.addEventListener("click", accion);

        return boton;
    }

    function limpiar4(id) {
        const elemento = $4(id);

        if (elemento) {
            elemento.replaceChildren();
        }

        return elemento;
    }

    function texto4(id, valor) {
        const elemento = $4(id);

        if (elemento) {
            elemento.textContent = String(valor);
        }
    }

    function vacio4(mensaje) {
        return crear4("p", mensaje, "gz4-vacio");
    }

    function aviso4(mensaje) {
        console.log("GameZone 4.0:", mensaje);
    }

    function id4() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }

        return (
            Date.now().toString(36) +
            Math.random().toString(36).slice(2)
        );
    }

    function confirmar4(mensaje) {
        const ajustes = leer4("gz3_ajustes", {});

        if (ajustes.confirmaciones === false) {
            return true;
        }

        return window.confirm(mensaje);
    }

    function fechaLocal4(valor) {
        const fecha = new Date(valor);

        if (Number.isNaN(fecha.getTime())) {
            return "Fecha desconocida";
        }

        return fecha.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function fechaDia4(valor) {
        if (
            typeof valor !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(valor)
        ) {
            return null;
        }

        const fecha = new Date(valor + "T12:00:00");

        if (Number.isNaN(fecha.getTime())) {
            return null;
        }

        if (
            fecha.getFullYear() !== Number(valor.slice(0, 4)) ||
            fecha.getMonth() + 1 !== Number(valor.slice(5, 7)) ||
            fecha.getDate() !== Number(valor.slice(8, 10))
        ) {
            return null;
        }

        return fecha;
    }

    function diasRestantes4(valor) {
        const fecha = fechaDia4(valor);

        if (!fecha) {
            return null;
        }

        const hoy = new Date();

        hoy.setHours(12, 0, 0, 0);

        return Math.round(
            (fecha.getTime() - hoy.getTime()) /
            86400000
        );
    }

    function normalizar4(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    /* ======================================================
       CATÁLOGO DE GAMEZONE
    ====================================================== */

    let catalogoRespaldo4 = [];

    function catalogo4() {
        try {
            if (
                typeof juegos !== "undefined" &&
                Array.isArray(juegos) &&
                juegos.length
            ) {
                return juegos;
            }
        } catch (error) {
            // El catálogo anterior puede estar cargando.
        }

        return catalogoRespaldo4;
    }

    function nombreJuego4(juego) {
        return String(
            juego?.nombre ||
            juego?.titulo ||
            "Videojuego sin título"
        );
    }

    function imagenJuego4(juego) {
        return String(
            juego?.imagen ||
            juego?.portada ||
            juego?.image ||
            ""
        );
    }

    function generoJuego4(juego) {
        const valor = juego?.genero || juego?.generos;

        return Array.isArray(valor)
            ? valor.join(", ")
            : String(valor || "No especificado");
    }

    function plataformaJuego4(juego) {
        const valor =
            juego?.plataformas ||
            juego?.plataforma ||
            juego?.platforms;

        return Array.isArray(valor)
            ? valor.join(", ")
            : String(valor || "No especificada");
    }

    function buscarJuego4(id) {
        return catalogo4().find(
            juego => String(juego.id) === String(id)
        );
    }

    function favoritos4() {
        try {
            if (typeof favoritos !== "undefined") {
                if (favoritos instanceof Set) {
                    return [...favoritos].map(String);
                }

                if (Array.isArray(favoritos)) {
                    return favoritos.map(String);
                }
            }
        } catch (error) {
            // Usaremos el almacenamiento local.
        }

        const guardados = leer4("gamezone_favoritos", []);

        return Array.isArray(guardados)
            ? guardados.map(String)
            : [];
    }

    function abrirJuego4(juego) {
        if (!juego) {
            return;
        }

        try {
            if (typeof mostrarFicha === "function") {
                mostrarFicha(
                    juego,
                    catalogo4().indexOf(juego)
                );
                return;
            }
        } catch (error) {
            console.warn(
                "No se pudo abrir la ficha anterior:",
                error
            );
        }

        aviso4(nombreJuego4(juego));
    }

    function selectorJuegos4(id) {
        const select = $4(id);

        if (!select) {
            return;
        }

        const anterior = select.value;

        select.replaceChildren(
            new Option("Seleccionar videojuego", "")
        );

        [...catalogo4()]
            .sort((a, b) =>
                nombreJuego4(a).localeCompare(
                    nombreJuego4(b),
                    "es"
                )
            )
            .forEach(juego => {
                select.add(
                    new Option(
                        nombreJuego4(juego),
                        String(juego.id)
                    )
                );
            });

        if (buscarJuego4(anterior)) {
            select.value = anterior;
        }
    }

    /* ======================================================
       DATOS GUARDADOS
    ====================================================== */

    let noticias4 = leer4(GZ4.claves.noticias, []);
    let lanzamientos4 = leer4(
        GZ4.claves.lanzamientos,
        []
    );
    let deseos4 = leer4(GZ4.claves.deseos, []);
    let notificaciones4 = leer4(
        GZ4.claves.notificaciones,
        []
    );
    let logrosAvisados4 = leer4(
        GZ4.claves.logrosAvisados,
        []
    );

    if (!Array.isArray(noticias4)) noticias4 = [];
    if (!Array.isArray(lanzamientos4)) lanzamientos4 = [];
    if (!Array.isArray(deseos4)) deseos4 = [];
    if (!Array.isArray(notificaciones4)) notificaciones4 = [];
    if (!Array.isArray(logrosAvisados4)) logrosAvisados4 = [];

    /* ======================================================
       FASE 45 — MOTOR DE NOTIFICACIONES
       Se define primero para reutilizarlo.
    ====================================================== */

    function notificar4(titulo, mensaje, tipo = "info") {
        const notificacion = {
            id: id4(),
            titulo,
            mensaje,
            tipo,
            leida: false,
            fecha: new Date().toISOString()
        };

        notificaciones4.unshift(notificacion);

        notificaciones4 = notificaciones4.slice(0, 100);

        guardar4(
            GZ4.claves.notificaciones,
            notificaciones4
        );

        renderNotificaciones4();
        renderDashboard4();
    }

    function renderNotificaciones4() {
        const lista = limpiar4(
            "gz4-lista-notificaciones"
        );

        if (!lista) return;

        const sinLeer = notificaciones4.filter(
            item => !item.leida
        ).length;

        texto4(
            "gz4-notificaciones-contador",
            sinLeer + " SIN LEER"
        );

        if (!notificaciones4.length) {
            lista.append(
                vacio4("No tienes notificaciones.")
            );
            return;
        }

        notificaciones4.forEach(item => {
            const tarjeta = crear4(
                "article",
                "",
                "gz4-notificacion-card"
            );

            if (!item.leida) {
                tarjeta.classList.add("gz4-no-leida");
            }

            const iconos = {
                logro: "🏆",
                desafio: "★",
                noticia: "📰",
                lanzamiento: "📅",
                deseo: "♡",
                info: "●"
            };

            const icono = crear4(
                "div",
                iconos[item.tipo] || "●",
                "gz4-notificacion-icono"
            );

            const contenido = crear4(
                "div",
                "",
                "gz4-notificacion-contenido"
            );

            contenido.append(
                crear4("h4", item.titulo),
                crear4("p", item.mensaje),
                crear4(
                    "small",
                    fechaLocal4(item.fecha)
                )
            );

            if (!item.leida) {
                contenido.append(
                    boton4("Marcar leída", () => {
                        item.leida = true;

                        guardar4(
                            GZ4.claves.notificaciones,
                            notificaciones4
                        );

                        renderNotificaciones4();
                    })
                );
            }

            tarjeta.append(icono, contenido);
            lista.append(tarjeta);
        });
    }

    function marcarLeidas4() {
        notificaciones4.forEach(item => {
            item.leida = true;
        });

        guardar4(
            GZ4.claves.notificaciones,
            notificaciones4
        );

        renderNotificaciones4();
    }

    function limpiarNotificaciones4() {
        if (!confirmar4(
            "¿Eliminar todas las notificaciones?"
        )) {
            return;
        }

        notificaciones4 = [];

        guardar4(
            GZ4.claves.notificaciones,
            notificaciones4
        );

        renderNotificaciones4();
        renderDashboard4();
    }

    /* ======================================================
       FASE 37 — NOTICIAS GAMER
    ====================================================== */

    function publicarNoticia4() {
        const titulo = $4("gz4-noticia-titulo")?.value.trim();
        const categoria = $4(
            "gz4-noticia-categoria"
        )?.value;
        const descripcion = $4(
            "gz4-noticia-descripcion"
        )?.value.trim();
        const enlace = $4(
            "gz4-noticia-enlace"
        )?.value.trim();

        if (!titulo || !descripcion) {
            window.alert(
                "Escribe el título y la descripción."
            );
            return;
        }

        if (enlace) {
            try {
                const url = new URL(enlace);

                if (!["https:", "http:"].includes(url.protocol)) {
                    throw new Error("Protocolo no permitido");
                }
            } catch {
                window.alert(
                    "Introduce un enlace HTTP o HTTPS válido."
                );
                return;
            }
        }

        const noticia = {
            id: id4(),
            titulo: titulo.slice(0, 100),
            categoria,
            descripcion: descripcion.slice(0, 1000),
            enlace: enlace || "",
            fecha: new Date().toISOString()
        };

        noticias4.unshift(noticia);

        if (!guardar4(GZ4.claves.noticias, noticias4)) {
            noticias4.shift();
            window.alert("No se pudo guardar la noticia.");
            return;
        }

        $4("gz4-noticia-titulo").value = "";
        $4("gz4-noticia-descripcion").value = "";
        $4("gz4-noticia-enlace").value = "";

        renderNoticias4();

        notificar4(
            "Nueva noticia",
            noticia.titulo,
            "noticia"
        );

        actualizarGameZone4();
    }

    function eliminarNoticia4(id) {
        if (!confirmar4(
            "¿Quieres eliminar esta noticia?"
        )) {
            return;
        }

        noticias4 = noticias4.filter(
            item => item.id !== id
        );

        guardar4(GZ4.claves.noticias, noticias4);
        renderNoticias4();
        renderDashboard4();
    }

    function renderNoticias4() {
        const lista = limpiar4("gz4-lista-noticias");

        if (!lista) return;

        texto4(
            "gz4-contador-noticias",
            noticias4.length + " noticias"
        );

        if (!noticias4.length) {
            lista.append(
                vacio4(
                    "Todavía no hay noticias publicadas."
                )
            );
            return;
        }

        noticias4.forEach(noticia => {
            const tarjeta = crear4(
                "article",
                "",
                "gz4-noticia-card"
            );

            const categoria = crear4(
                "span",
                noticia.categoria,
                "gz4-noticia-categoria"
            );

            const acciones = crear4(
                "div",
                "",
                "gz4-noticia-acciones"
            );

            if (noticia.enlace) {
                const enlace = document.createElement("a");

                enlace.textContent = "Ver fuente ↗";
                enlace.className = "gz4-boton-principal";
                enlace.href = noticia.enlace;
                enlace.target = "_blank";
                enlace.rel = "noopener noreferrer";

                acciones.append(enlace);
            }

            acciones.append(
                boton4(
                    "Eliminar",
                    () => eliminarNoticia4(noticia.id)
                )
            );

            tarjeta.append(
                categoria,
                crear4("h4", noticia.titulo),
                crear4("p", noticia.descripcion),
                crear4(
                    "span",
                    fechaLocal4(noticia.fecha),
                    "gz4-noticia-fecha"
                ),
                acciones
            );

            lista.append(tarjeta);
        });
    }

    /* ======================================================
       FASE 38 — CALENDARIO DE LANZAMIENTOS
    ====================================================== */

    function agregarLanzamiento4() {
        const nombre = $4(
            "gz4-lanzamiento-nombre"
        )?.value.trim();

        const fecha = $4(
            "gz4-lanzamiento-fecha"
        )?.value;

        const plataforma = $4(
            "gz4-lanzamiento-plataforma"
        )?.value;

        if (!nombre || !fechaDia4(fecha)) {
            window.alert(
                "Introduce un nombre y una fecha válida."
            );
            return;
        }

        const lanzamiento = {
            id: id4(),
            nombre: nombre.slice(0, 80),
            fecha,
            plataforma,
            creado: new Date().toISOString()
        };

        lanzamientos4.push(lanzamiento);

        guardar4(
            GZ4.claves.lanzamientos,
            lanzamientos4
        );

        $4("gz4-lanzamiento-nombre").value = "";
        $4("gz4-lanzamiento-fecha").value = "";

        renderLanzamientos4();

        notificar4(
            "Lanzamiento registrado",
            nombre + " — " + fecha,
            "lanzamiento"
        );

        renderDashboard4();
    }

    function eliminarLanzamiento4(id) {
        if (!confirmar4(
            "¿Eliminar este lanzamiento?"
        )) {
            return;
        }

        lanzamientos4 = lanzamientos4.filter(
            item => item.id !== id
        );

        guardar4(
            GZ4.claves.lanzamientos,
            lanzamientos4
        );

        renderLanzamientos4();
        renderDashboard4();
    }

    function renderLanzamientos4() {
        const lista = limpiar4(
            "gz4-lista-lanzamientos"
        );

        if (!lista) return;

        const filtrados = [...lanzamientos4]
            .filter(item => {
                const dias = diasRestantes4(item.fecha);

                if (dias === null) return false;

                if (GZ4.filtroLanzamientos === "proximos") {
                    return dias >= 0;
                }

                if (GZ4.filtroLanzamientos === "pasados") {
                    return dias < 0;
                }

                return true;
            })
            .sort((a, b) =>
                a.fecha.localeCompare(b.fecha)
            );

        if (!filtrados.length) {
            lista.append(
                vacio4(
                    "No hay lanzamientos en esta categoría."
                )
            );
            return;
        }

        filtrados.forEach(item => {
            const dias = diasRestantes4(item.fecha);
            const fecha = fechaDia4(item.fecha);

            const tarjeta = crear4(
                "article",
                "",
                "gz4-lanzamiento-card"
            );

            const cajaFecha = crear4(
                "div",
                "",
                "gz4-lanzamiento-fecha"
            );

            cajaFecha.append(
                crear4(
                    "strong",
                    String(fecha.getDate())
                ),
                crear4(
                    "span",
                    fecha.toLocaleDateString("es-PE", {
                        month: "short"
                    })
                )
            );

            const info = crear4(
                "div",
                "",
                "gz4-lanzamiento-info"
            );

            info.append(
                crear4("h4", item.nombre),
                crear4(
                    "p",
                    item.plataforma + " · " +
                    fechaLocal4(fecha)
                )
            );

            const contador = crear4(
                "div",
                dias > 0
                    ? "Faltan " + dias + " días"
                    : dias === 0
                        ? "¡Hoy!"
                        : "Ya pasó",
                "gz4-cuenta-regresiva"
            );

            tarjeta.append(
                cajaFecha,
                info,
                contador,
                boton4(
                    "Eliminar",
                    () => eliminarLanzamiento4(item.id)
                )
            );

            lista.append(tarjeta);
        });
    }

    function cambiarFiltroLanzamientos4(valor) {
        GZ4.filtroLanzamientos = valor;

        document.querySelectorAll(
            "[data-gz4-lanzamiento]"
        ).forEach(boton => {
            boton.classList.toggle(
                "gz4-activo",
                boton.dataset.gz4Lanzamiento === valor
            );
        });

        renderLanzamientos4();
    }

    /* ======================================================
       FASE 39 — LISTA DE DESEOS
    ====================================================== */

    function agregarDeseo4() {
        const id = $4("gz4-deseo-juego")?.value;
        const prioridad = $4(
            "gz4-deseo-prioridad"
        )?.value;
        const nota = $4("gz4-deseo-nota")?.value.trim();

        const juego = buscarJuego4(id);

        if (!juego) {
            window.alert(
                "Selecciona un videojuego válido."
            );
            return;
        }

        if (deseos4.some(
            item => String(item.idJuego) === String(id)
        )) {
            window.alert(
                "Ese videojuego ya está en tu lista."
            );
            return;
        }

        deseos4.push({
            idJuego: String(id),
            prioridad,
            nota: (nota || "").slice(0, 300),
            fecha: new Date().toISOString()
        });

        guardar4(GZ4.claves.deseos, deseos4);

        $4("gz4-deseo-nota").value = "";
        $4("gz4-deseo-juego").value = "";

        renderDeseos4();

        notificar4(
            "Nuevo deseo",
            nombreJuego4(juego) +
            " fue añadido a tu lista.",
            "deseo"
        );

        actualizarGameZone4();
    }

    function eliminarDeseo4(id) {
        if (!confirmar4(
            "¿Quitar este juego de tu lista de deseos?"
        )) {
            return;
        }

        deseos4 = deseos4.filter(
            item => String(item.idJuego) !== String(id)
        );

        guardar4(GZ4.claves.deseos, deseos4);

        renderDeseos4();
        actualizarGameZone4();
    }

    function renderDeseos4() {
        const lista = limpiar4("gz4-lista-deseos");

        if (!lista) return;

        const validos = deseos4.filter(
            item => buscarJuego4(item.idJuego)
        );

        texto4("gz4-total-deseos", validos.length);

        ["alta", "media", "baja"].forEach(prioridad => {
            texto4(
                "gz4-deseos-" + prioridad,
                validos.filter(
                    item => item.prioridad === prioridad
                ).length
            );
        });

        const filtrados = validos.filter(item =>
            GZ4.filtroDeseos === "todos" ||
            item.prioridad === GZ4.filtroDeseos
        );

        if (!filtrados.length) {
            lista.append(
                vacio4(
                    "No hay videojuegos en esta categoría."
                )
            );
            return;
        }

        const orden = {
            alta: 0,
            media: 1,
            baja: 2
        };

        filtrados.sort(
            (a, b) =>
                (orden[a.prioridad] ?? 3) -
                (orden[b.prioridad] ?? 3)
        );

        filtrados.forEach(item => {
            const juego = buscarJuego4(item.idJuego);

            const tarjeta = crear4(
                "article",
                "",
                "gz4-deseo-card"
            );

            const prioridad = crear4(
                "span",
                "PRIORIDAD " +
                String(item.prioridad).toUpperCase(),
                "gz4-prioridad gz4-prioridad-" +
                item.prioridad
            );

            const acciones = crear4(
                "div",
                "",
                "gz4-deseo-acciones"
            );

            acciones.append(
                boton4(
                    "Ver juego ↗",
                    () => abrirJuego4(juego),
                    "gz4-boton-principal"
                ),
                boton4(
                    "Quitar",
                    () => eliminarDeseo4(item.idJuego)
                )
            );

            tarjeta.append(
                prioridad,
                crear4("h4", nombreJuego4(juego)),
                crear4("p", generoJuego4(juego)),
                crear4(
                    "p",
                    item.nota || "Sin nota personal."
                ),
                acciones
            );

            lista.append(tarjeta);
        });
    }

    function cambiarFiltroDeseos4(valor) {
        GZ4.filtroDeseos = valor;

        document.querySelectorAll(
            "[data-gz4-deseo]"
        ).forEach(boton => {
            boton.classList.toggle(
                "gz4-activo",
                boton.dataset.gz4Deseo === valor
            );
        });

        renderDeseos4();
    }

    /* ======================================================
       FASES 40, 41 Y 42
       DESAFÍOS, PERFIL E INSIGNIAS
    ====================================================== */

    function datosJugador4() {
        const favoritosActuales = favoritos4();

        const colecciones = leer4(
            "gz3_colecciones",
            []
        );

        const etiquetas = leer4(
            "gz3_etiquetas",
            {}
        );

        const visitas = leer4(
            "gz3_visitas",
            {}
        );

        const opiniones = leer4(
            "gz2_opiniones",
            {}
        );

        const coleccion2 = leer4(
            "gz2_coleccion",
            {}
        );

        const cantidadColecciones = Array.isArray(
            colecciones
        ) ? colecciones.length : 0;

        const cantidadEtiquetas = Object.values(
            etiquetas || {}
        ).reduce(
            (total, valor) =>
                total + (
                    Array.isArray(valor)
                        ? valor.length
                        : 0
                ),
            0
        );

        const cantidadVisitas = Object.values(
            visitas || {}
        ).reduce(
            (total, valor) =>
                total + (Number(valor) || 0),
            0
        );

        const cantidadResenas = Object.values(
            opiniones || {}
        ).filter(valor => {
            if (Array.isArray(valor)) {
                return valor.length > 0;
            }

            return valor && typeof valor === "object";
        }).length;

        const cantidadCompletados = Object.values(
            coleccion2 || {}
        ).filter(
            valor => valor?.estado === "completado"
        ).length;

        return {
            favoritos: favoritosActuales.length,
            colecciones: cantidadColecciones,
            etiquetas: cantidadEtiquetas,
            visitas: cantidadVisitas,
            resenas: cantidadResenas,
            completados: cantidadCompletados,
            deseos: deseos4.length,
            noticias: noticias4.length,
            lanzamientos: lanzamientos4.length
        };
    }

    const desafios4 = [
        {
            id: "explorador",
            icono: "◈",
            nombre: "Primer explorador",
            descripcion: "Visita 1 videojuego.",
            objetivo: 1,
            campo: "visitas",
            xp: 20
        },
        {
            id: "favoritos",
            icono: "♡",
            nombre: "Coleccionista de favoritos",
            descripcion: "Guarda 5 videojuegos favoritos.",
            objetivo: 5,
            campo: "favoritos",
            xp: 50
        },
        {
            id: "coleccionista",
            icono: "▣",
            nombre: "Organizador gamer",
            descripcion: "Crea 3 colecciones.",
            objetivo: 3,
            campo: "colecciones",
            xp: 60
        },
        {
            id: "critico",
            icono: "★",
            nombre: "Crítico de videojuegos",
            descripcion: "Registra 3 reseñas.",
            objetivo: 3,
            campo: "resenas",
            xp: 70
        },
        {
            id: "etiquetas",
            icono: "#",
            nombre: "Maestro de etiquetas",
            descripcion: "Crea 5 etiquetas.",
            objetivo: 5,
            campo: "etiquetas",
            xp: 45
        },
        {
            id: "deseos",
            icono: "✦",
            nombre: "Soñador gamer",
            descripcion: "Añade 3 juegos a deseos.",
            objetivo: 3,
            campo: "deseos",
            xp: 40
        },
        {
            id: "periodista",
            icono: "▤",
            nombre: "Periodista gamer",
            descripcion: "Publica 2 noticias.",
            objetivo: 2,
            campo: "noticias",
            xp: 35
        },
        {
            id: "calendario",
            icono: "▦",
            nombre: "Cazador de lanzamientos",
            descripcion: "Registra 3 lanzamientos.",
            objetivo: 3,
            campo: "lanzamientos",
            xp: 40
        },
        {
            id: "veterano",
            icono: "♛",
            nombre: "Veterano GameZone",
            descripcion: "Registra 20 visitas a juegos.",
            objetivo: 20,
            campo: "visitas",
            xp: 100
        },
        {
            id: "leyenda",
            icono: "◆",
            nombre: "Leyenda gamer",
            descripcion: "Guarda 15 favoritos.",
            objetivo: 15,
            campo: "favoritos",
            xp: 150
        }
    ];

    function progresoDesafios4(datos) {
        return desafios4.map(desafio => {
            const actual = Number(
                datos[desafio.campo]
            ) || 0;

            return {
                ...desafio,
                actual,
                completado: actual >= desafio.objetivo
            };
        });
    }

    function calcularPerfil4() {
        const datos = datosJugador4();

        const desafios = progresoDesafios4(datos);

        const completados = desafios.filter(
            item => item.completado
        );

        const xp = completados.reduce(
            (total, item) => total + item.xp,
            0
        );

        const nivel = Math.floor(xp / 100) + 1;

        const xpNivel = xp % 100;

        const rango =
            nivel >= 6
                ? "Leyenda de GameZone"
                : nivel >= 4
                    ? "Veterano gamer"
                    : nivel >= 2
                        ? "Explorador avanzado"
                        : "Explorador principiante";

        return {
            datos,
            desafios,
            completados,
            xp,
            nivel,
            xpNivel,
            rango
        };
    }

    function renderDesafios4(perfil) {
        const lista = limpiar4("gz4-lista-desafios");

        if (!lista) return;

        const completados = perfil.completados.length;

        texto4(
            "gz4-desafios-progreso",
            completados + " / " + desafios4.length
        );

        const porcentaje =
            desafios4.length > 0
                ? completados / desafios4.length * 100
                : 0;

        const barra = $4("gz4-barra-desafios");

        if (barra) {
            barra.style.width = porcentaje + "%";
        }

        perfil.desafios.forEach(desafio => {
            const tarjeta = crear4(
                "article",
                "",
                "gz4-desafio-card"
            );

            if (desafio.completado) {
                tarjeta.classList.add("gz4-completado");
            }

            tarjeta.append(
                crear4(
                    "div",
                    desafio.icono,
                    "gz4-desafio-icono"
                ),
                crear4("h4", desafio.nombre),
                crear4("p", desafio.descripcion),
                crear4(
                    "span",
                    "+" + desafio.xp + " XP",
                    "gz4-desafio-recompensa"
                ),
                crear4(
                    "span",
                    desafio.completado
                        ? "✓ COMPLETADO"
                        : Math.min(
                            desafio.actual,
                            desafio.objetivo
                        ) + " / " + desafio.objetivo,
                    "gz4-desafio-estado"
                )
            );

            lista.append(tarjeta);
        });
    }

    function renderPerfil4(perfil) {
        const nombre = leer4(
            "gamezone_nombre",
            "Jugador"
        );

        const nombreFinal =
            typeof nombre === "string" &&
            nombre.trim()
                ? nombre.trim()
                : "Jugador";

        texto4("gz4-nombre-jugador", nombreFinal);

        texto4(
            "gz4-avatar",
            nombreFinal.charAt(0).toUpperCase()
        );

        texto4("gz4-rango-jugador", perfil.rango);
        texto4("gz4-nivel-actual", perfil.nivel);

        texto4(
            "gz4-experiencia-texto",
            perfil.xpNivel + " / 100 XP"
        );

        const barra = $4("gz4-barra-experiencia");

        if (barra) {
            barra.style.width = perfil.xpNivel + "%";
        }

        texto4(
            "gz4-perfil-favoritos",
            perfil.datos.favoritos
        );

        texto4(
            "gz4-perfil-resenas",
            perfil.datos.resenas
        );

        texto4(
            "gz4-perfil-colecciones",
            perfil.datos.colecciones
        );

        texto4(
            "gz4-perfil-desafios",
            perfil.completados.length
        );
    }

    function renderInsignias4(perfil) {
        const lista = limpiar4(
            "gz4-lista-insignias"
        );

        if (!lista) return;

        const desbloqueadas =
            perfil.completados.length;

        texto4(
            "gz4-insignias-contador",
            desbloqueadas + " / " + desafios4.length
        );

        const barra = $4("gz4-barra-insignias");

        if (barra) {
            barra.style.width =
                (desbloqueadas / desafios4.length * 100) +
                "%";
        }

        perfil.desafios.forEach(desafio => {
            const tarjeta = crear4(
                "article",
                "",
                "gz4-insignia-card"
            );

            if (!desafio.completado) {
                tarjeta.classList.add("gz4-bloqueada");
            }

            tarjeta.append(
                crear4(
                    "div",
                    desafio.completado
                        ? desafio.icono
                        : "?",
                    "gz4-insignia-icono"
                ),
                crear4("h4", desafio.nombre),
                crear4("p", desafio.descripcion),
                crear4(
                    "span",
                    desafio.completado
                        ? "DESBLOQUEADA"
                        : "BLOQUEADA",
                    "gz4-insignia-estado"
                )
            );

            lista.append(tarjeta);
        });
    }

    function revisarLogros4(perfil) {
        let cambios = false;

        perfil.completados.forEach(desafio => {
            if (logrosAvisados4.includes(desafio.id)) {
                return;
            }

            logrosAvisados4.push(desafio.id);
            cambios = true;

            notificar4(
                "Insignia desbloqueada",
                desafio.nombre +
                " — +" + desafio.xp + " XP",
                "logro"
            );
        });

        if (cambios) {
            guardar4(
                GZ4.claves.logrosAvisados,
                logrosAvisados4
            );
        }
    }

    /* ======================================================
       FASE 43 — RECOMENDACIONES AVANZADAS
    ====================================================== */

    function cargarGeneros4() {
        const select = $4(
            "gz4-recomendacion-genero"
        );

        if (!select) return;

        const anterior = select.value;

        const generos = new Set();

        catalogo4().forEach(juego => {
            generoJuego4(juego)
                .split(/[,/|]/)
                .map(valor => valor.trim())
                .filter(Boolean)
                .forEach(genero => generos.add(genero));
        });

        select.replaceChildren(
            new Option(
                "Recomendación automática",
                "automatico"
            )
        );

        [...generos].sort().forEach(genero => {
            select.add(new Option(genero, genero));
        });

        if (
            [...select.options].some(
                opcion => opcion.value === anterior
            )
        ) {
            select.value = anterior;
        }
    }

    function tarjetaJuego4(juego, motivo) {
        const tarjeta = crear4(
            "article",
            "",
            "gz4-juego-card"
        );

        const imagen = imagenJuego4(juego);

        if (imagen) {
            const portada = document.createElement("img");

            portada.src = imagen;
            portada.alt =
                "Portada de " + nombreJuego4(juego);
            portada.loading = "lazy";
            portada.className = "gz4-juego-imagen";

            tarjeta.append(portada);
        }

        const contenido = crear4(
            "div",
            "",
            "gz4-juego-contenido"
        );

        contenido.append(
            crear4("h4", nombreJuego4(juego)),
            crear4("p", generoJuego4(juego)),
            crear4("p", motivo),
            boton4(
                "Ver videojuego ↗",
                () => abrirJuego4(juego),
                "gz4-boton-principal"
            )
        );

        tarjeta.append(contenido);

        return tarjeta;
    }

    function generarRecomendaciones4() {
        const lista = limpiar4(
            "gz4-lista-recomendaciones"
        );

        if (!lista) return;

        const generoElegido = $4(
            "gz4-recomendacion-genero"
        )?.value || "automatico";

        const favoritosActuales = favoritos4();

        const generosPreferidos = {};

        catalogo4()
            .filter(juego =>
                favoritosActuales.includes(
                    String(juego.id)
                )
            )
            .forEach(juego => {
                generoJuego4(juego)
                    .split(/[,/|]/)
                    .map(normalizar4)
                    .filter(Boolean)
                    .forEach(genero => {
                        generosPreferidos[genero] =
                            (generosPreferidos[genero] || 0) +
                            1;
                    });
            });

        const candidatos = catalogo4()
            .filter(juego =>
                !favoritosActuales.includes(
                    String(juego.id)
                )
            )
            .map(juego => {
                const generos = generoJuego4(juego)
                    .split(/[,/|]/)
                    .map(normalizar4);

                let puntos = 0;

                generos.forEach(genero => {
                    puntos +=
                        (generosPreferidos[genero] || 0) *
                        10;
                });

                if (generoElegido !== "automatico") {
                    const coincide = generos.includes(
                        normalizar4(generoElegido)
                    );

                    if (!coincide) {
                        return null;
                    }

                    puntos += 20;
                }

                return { juego, puntos };
            })
            .filter(Boolean)
            .sort((a, b) =>
                b.puntos - a.puntos ||
                nombreJuego4(a.juego).localeCompare(
                    nombreJuego4(b.juego),
                    "es"
                )
            )
            .slice(0, 8);

        texto4(
            "gz4-recomendaciones-explicacion",
            generoElegido === "automatico"
                ? "Sugerencias basadas en tus géneros favoritos."
                : "Sugerencias del género: " +
                  generoElegido
        );

        if (!candidatos.length) {
            lista.append(
                vacio4(
                    "No hay recomendaciones disponibles."
                )
            );
            return;
        }

        candidatos.forEach(({ juego, puntos }) => {
            lista.append(
                tarjetaJuego4(
                    juego,
                    puntos > 0
                        ? "Coincide con tus preferencias."
                        : "Descubre algo nuevo."
                )
            );
        });
    }

    /* ======================================================
       FASE 44 — COMPARADOR DEFINITIVO
    ====================================================== */

    function compararJuegos4() {
        const id1 = $4(
            "gz4-comparador-juego-1"
        )?.value;

        const id2 = $4(
            "gz4-comparador-juego-2"
        )?.value;

        const juego1 = buscarJuego4(id1);
        const juego2 = buscarJuego4(id2);

        if (!juego1 || !juego2) {
            window.alert(
                "Selecciona dos videojuegos."
            );
            return;
        }

        if (String(id1) === String(id2)) {
            window.alert(
                "Selecciona dos juegos diferentes."
            );
            return;
        }

        const resultado = limpiar4(
            "gz4-comparador-resultado"
        );

        if (!resultado) return;

        const opiniones = leer4(
            "gz2_opiniones",
            {}
        );

        const valoracion = id => {
            const dato = opiniones?.[id];

            const numero = Number(
                dato?.puntuacion ||
                dato?.valoracion ||
                dato?.estrellas
            );

            return numero >= 1 && numero <= 5
                ? numero + " / 5"
                : "Sin valoración";
        };

        const tabla = crear4(
            "table",
            "",
            "gz4-comparador-tabla"
        );

        const cabecera = document.createElement("thead");
        const filaCabecera = document.createElement("tr");

        [
            "CARACTERÍSTICA",
            nombreJuego4(juego1),
            nombreJuego4(juego2)
        ].forEach(texto => {
            filaCabecera.append(
                crear4("th", texto)
            );
        });

        cabecera.append(filaCabecera);

        const cuerpo = document.createElement("tbody");

        const filas = [
            [
                "Género",
                generoJuego4(juego1),
                generoJuego4(juego2)
            ],
            [
                "Plataformas",
                plataformaJuego4(juego1),
                plataformaJuego4(juego2)
            ],
            [
                "Favorito",
                favoritos4().includes(String(id1))
                    ? "Sí"
                    : "No",
                favoritos4().includes(String(id2))
                    ? "Sí"
                    : "No"
            ],
            [
                "Mi valoración",
                valoracion(id1),
                valoracion(id2)
            ]
        ];

        filas.forEach(valores => {
            const fila = document.createElement("tr");

            valores.forEach(valor => {
                fila.append(
                    crear4("td", valor)
                );
            });

            cuerpo.append(fila);
        });

        tabla.append(cabecera, cuerpo);
        resultado.append(tabla);
    }

    /* ======================================================
       FASE 46 — DASHBOARD GAMEZONE
    ====================================================== */

    function renderDashboard4(perfil = null) {
        if (!perfil) {
            perfil = calcularPerfil4();
        }

        texto4(
            "gz4-dashboard-juegos",
            catalogo4().length
        );

        texto4(
            "gz4-dashboard-favoritos",
            perfil.datos.favoritos
        );

        texto4(
            "gz4-dashboard-deseos",
            perfil.datos.deseos
        );

        texto4(
            "gz4-dashboard-insignias",
            perfil.completados.length
        );

        texto4(
            "gz4-dashboard-desafios",
            perfil.completados.length
        );

        texto4(
            "gz4-dashboard-nivel",
            perfil.nivel
        );

        const actividad = limpiar4(
            "gz4-dashboard-actividad"
        );

        if (actividad) {
            if (!notificaciones4.length) {
                actividad.append(
                    vacio4("No hay actividad reciente.")
                );
            } else {
                notificaciones4.slice(0, 5).forEach(item => {
                    const tarjeta = crear4(
                        "div",
                        "",
                        "gz4-dashboard-item"
                    );

                    tarjeta.append(
                        crear4("strong", item.titulo),
                        crear4(
                            "span",
                            fechaLocal4(item.fecha)
                        )
                    );

                    actividad.append(tarjeta);
                });
            }
        }

        const proximos = limpiar4(
            "gz4-dashboard-lanzamientos"
        );

        if (proximos) {
            const lista = [...lanzamientos4]
                .filter(item =>
                    diasRestantes4(item.fecha) >= 0
                )
                .sort((a, b) =>
                    a.fecha.localeCompare(b.fecha)
                )
                .slice(0, 5);

            if (!lista.length) {
                proximos.append(
                    vacio4(
                        "No hay lanzamientos próximos."
                    )
                );
            } else {
                lista.forEach(item => {
                    const tarjeta = crear4(
                        "div",
                        "",
                        "gz4-dashboard-item"
                    );

                    tarjeta.append(
                        crear4("strong", item.nombre),
                        crear4(
                            "span",
                            item.fecha + " · " +
                            item.plataforma
                        )
                    );

                    proximos.append(tarjeta);
                });
            }
        }
    }

    /* ======================================================
       ACTUALIZACIÓN GENERAL
    ====================================================== */

    function actualizarGameZone4() {
        const perfil = calcularPerfil4();

        renderDesafios4(perfil);
        renderPerfil4(perfil);
        renderInsignias4(perfil);

        revisarLogros4(perfil);
        renderDashboard4(perfil);
    }

    function actualizarCatalogo4() {
        const catalogo = catalogo4();

        if (!catalogo.length) return;

        const firma = catalogo
            .map(juego => String(juego.id))
            .join("|");

        if (firma === GZ4.catalogoFirma) {
            return;
        }

        GZ4.catalogoFirma = firma;

        [
            "gz4-deseo-juego",
            "gz4-comparador-juego-1",
            "gz4-comparador-juego-2"
        ].forEach(selectorJuegos4);

        cargarGeneros4();
        renderDeseos4();
        actualizarGameZone4();
    }

    /* ======================================================
       EVENTOS DE BOTONES
    ====================================================== */

    function conectarEventos4() {
        $4("gz4-publicar-noticia")?.addEventListener(
            "click",
            publicarNoticia4
        );

        $4("gz4-agregar-lanzamiento")?.addEventListener(
            "click",
            agregarLanzamiento4
        );

        document.querySelectorAll(
            "[data-gz4-lanzamiento]"
        ).forEach(boton => {
            boton.addEventListener("click", () => {
                cambiarFiltroLanzamientos4(
                    boton.dataset.gz4Lanzamiento
                );
            });
        });

        $4("gz4-agregar-deseo")?.addEventListener(
            "click",
            agregarDeseo4
        );

        document.querySelectorAll(
            "[data-gz4-deseo]"
        ).forEach(boton => {
            boton.addEventListener("click", () => {
                cambiarFiltroDeseos4(
                    boton.dataset.gz4Deseo
                );
            });
        });

        $4("gz4-generar-recomendaciones")
            ?.addEventListener(
                "click",
                generarRecomendaciones4
            );

        $4("gz4-comparar-juegos")?.addEventListener(
            "click",
            compararJuegos4
        );

        $4("gz4-marcar-leidas")?.addEventListener(
            "click",
            marcarLeidas4
        );

        $4("gz4-limpiar-notificaciones")
            ?.addEventListener(
                "click",
                limpiarNotificaciones4
            );
    }

    /* ======================================================
       INTEGRACIÓN CON VERSIONES ANTERIORES
    ====================================================== */

    function integrarFunciones4() {
        try {
            if (typeof guardarFavoritos === "function") {
                const original = guardarFavoritos;

                guardarFavoritos = function (...args) {
                    const resultado = original.apply(
                        this,
                        args
                    );

                    actualizarGameZone4();

                    return resultado;
                };
            }
        } catch (error) {
            console.warn(
                "Integración de favoritos:",
                error
            );
        }

        try {
            if (typeof mostrarFicha === "function") {
                const original = mostrarFicha;

                mostrarFicha = function (...args) {
                    const resultado = original.apply(
                        this,
                        args
                    );

                    actualizarGameZone4();

                    return resultado;
                };
            }
        } catch (error) {
            console.warn(
                "Integración de fichas:",
                error
            );
        }

        try {
            if (typeof renderizar === "function") {
                const original = renderizar;

                renderizar = function (...args) {
                    const resultado = original.apply(
                        this,
                        args
                    );

                    actualizarCatalogo4();

                    return resultado;
                };
            }
        } catch (error) {
            console.warn(
                "Integración del catálogo:",
                error
            );
        }
    }

    /* ======================================================
       INICIALIZACIÓN
    ====================================================== */

    async function iniciarGameZone4() {
        if (GZ4.iniciado) return;

        GZ4.iniciado = true;

        conectarEventos4();
        integrarFunciones4();

        renderNoticias4();
        renderLanzamientos4();
        renderNotificaciones4();

        actualizarCatalogo4();
        actualizarGameZone4();

        // Respaldo para catálogos cargados con fetch.

        if (!catalogo4().length) {
            try {
                const respuesta = await fetch("juegos.json");

                if (respuesta.ok) {
                    const datos = await respuesta.json();

                    catalogoRespaldo4 = Array.isArray(datos)
                        ? datos
                        : Array.isArray(datos.juegos)
                            ? datos.juegos
                            : [];
                }
            } catch (error) {
                console.warn(
                    "El catálogo aún no está disponible.",
                    error
                );
            }

            actualizarCatalogo4();
        }

        console.log(
            "GAMEZONE 4.0 — FASES 37 A 46 ACTIVADAS"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarGameZone4,
            { once: true }
        );
    } else {
        iniciarGameZone4();
    }

})();

/* ==========================================================
   FIN — GAMEZONE 4.0
========================================================== */



/* ==========================================
   GAMEZONE 5.0 — FASE 47
   CENTRO DE CONFIGURACIÓN GAMER
========================================== */

(() => {
    "use strict";

    const CLAVE = "gamezone_configuracion_v5";

    const valoresBase = {
        compacto: false,
        movimiento: false,
        contraste: false
    };

    const controles = {
        compacto: document.getElementById("gz5-compacto"),
        movimiento: document.getElementById("gz5-movimiento"),
        contraste: document.getElementById("gz5-contraste")
    };

    if (Object.values(controles).some(elemento => !elemento)) {
        return;
    }

    const estado = document.getElementById("gz5-estado");
    const restaurar = document.getElementById("gz5-restaurar");

    let configuracion = { ...valoresBase };

    // RECUPERAR PREFERENCIAS

    try {
        const guardada = JSON.parse(
            localStorage.getItem(CLAVE) || "null"
        );

        if (
            guardada &&
            typeof guardada === "object" &&
            !Array.isArray(guardada)
        ) {
            for (const clave of Object.keys(valoresBase)) {
                if (typeof guardada[clave] === "boolean") {
                    configuracion[clave] = guardada[clave];
                }
            }
        }
    } catch (error) {
        console.warn("Error al leer configuración:", error);
    }

    // APLICAR CONFIGURACIÓN

    function aplicar() {
        document.body.classList.toggle(
            "gz5-compacto",
            configuracion.compacto
        );

        document.body.classList.toggle(
            "gz5-sin-animacion",
            configuracion.movimiento
        );

        document.body.classList.toggle(
            "gz5-contraste",
            configuracion.contraste
        );

        for (const clave of Object.keys(controles)) {
            controles[clave].checked = configuracion[clave];
        }
    }

    // GUARDAR CONFIGURACIÓN

    function guardar(mensaje) {
        aplicar();

        try {
            localStorage.setItem(
                CLAVE,
                JSON.stringify(configuracion)
            );

            estado.textContent = mensaje;
        } catch (error) {
            estado.textContent =
                "Cambios aplicados, pero no se pudieron guardar.";

            console.warn("Error al guardar:", error);
        }
    }

    // ESCUCHAR CAMBIOS

    for (const [clave, control] of Object.entries(controles)) {
        control.addEventListener("change", () => {
            configuracion[clave] = control.checked;

            guardar("Preferencias guardadas.");
        });
    }

    // RESTAURAR CONFIGURACIÓN

    restaurar?.addEventListener("click", () => {
        configuracion = { ...valoresBase };

        guardar("Configuración restaurada.");
    });

    // INICIALIZAR

    aplicar();

})();



/* ==========================================
   GAMEZONE 5.0 — FASE 48
   CENTRO DE DIAGNÓSTICO GAMER
========================================== */

(() => {
    "use strict";

    const botonAnalizar = document.getElementById("gz48-analizar");
    const botonExportar = document.getElementById("gz48-exportar");
    const resultados = document.getElementById("gz48-resultados");
    const estadoGeneral = document.getElementById("gz48-estado-general");
    const porcentaje = document.getElementById("gz48-porcentaje");
    const progreso = document.getElementById("gz48-progreso");
    const mensaje = document.getElementById("gz48-mensaje");

    if (!botonAnalizar || !botonExportar || !resultados ||
        !estadoGeneral || !porcentaje || !progreso || !mensaje) {
        return;
    }

    let ultimoInforme = null;

    // REGISTRAR RESULTADOS

    function crearPrueba(nombre, correcto, detalle) {
        return {
            nombre,
            correcto,
            detalle
        };
    }

    // COMPROBAR ALMACENAMIENTO

    function probarAlmacenamiento() {
        const clave = "gz48_prueba_temporal";

        try {
            localStorage.setItem(clave, "correcto");

            const funciona =
                localStorage.getItem(clave) === "correcto";

            localStorage.removeItem(clave);

            return crearPrueba(
                "Almacenamiento local",
                funciona,
                funciona
                    ? "El navegador puede guardar y recuperar datos."
                    : "No se pudieron recuperar los datos."
            );
        } catch (error) {
            return crearPrueba(
                "Almacenamiento local",
                false,
                "El almacenamiento está bloqueado o no disponible."
            );
        }
    }

    // COMPROBAR CONFIGURACIÓN

    function probarConfiguracion() {
        try {
            const texto = localStorage.getItem(
                "gamezone_configuracion_v5"
            );

            if (texto === null) {
                return crearPrueba(
                    "Configuración gamer",
                    true,
                    "No hay preferencias guardadas. Se usarán los valores iniciales."
                );
            }

            const datos = JSON.parse(texto);

            const valido =
                datos !== null &&
                typeof datos === "object" &&
                !Array.isArray(datos) &&
                ["compacto", "movimiento", "contraste"]
                    .every(clave => typeof datos[clave] === "boolean");

            return crearPrueba(
                "Configuración gamer",
                valido,
                valido
                    ? "Las preferencias de la fase 47 son válidas."
                    : "La configuración guardada tiene un formato incorrecto."
            );

        } catch (error) {
            return crearPrueba(
                "Configuración gamer",
                false,
                "No se pudo leer correctamente la configuración."
            );
        }
    }

    // COMPROBAR FAVORITOS

    function probarFavoritos() {
        try {
            const texto = localStorage.getItem(
                "gamezone_favoritos"
            );

            const datos = JSON.parse(texto || "[]");

            const valido =
                Array.isArray(datos) &&
                datos.every(id => typeof id === "string");

            return crearPrueba(
                "Favoritos guardados",
                valido,
                valido
                    ? `${datos.length} favoritos registrados correctamente.`
                    : "La lista de favoritos tiene datos inválidos."
            );

        } catch (error) {
            return crearPrueba(
                "Favoritos guardados",
                false,
                "No se pudieron interpretar los favoritos."
            );
        }
    }

    // COMPROBAR CATÁLOGO JSON

    async function probarCatalogo() {
        try {
            const respuesta = await fetch(
                "juegos.json",
                { cache: "no-store" }
            );

            if (!respuesta.ok) {
                throw new Error(
                    `Error HTTP ${respuesta.status}`
                );
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error(
                    "El catálogo no contiene una lista válida."
                );
            }

            return datos;

        } catch (error) {
            throw new Error(
                "No se pudo cargar juegos.json: " + error.message
            );
        }
    }

    // COMPROBAR ENLACES

    function probarEnlaces(datos) {
        const incorrectos = datos.filter(juego => {
            try {
                const enlace = new URL(juego.url);
                return enlace.protocol !== "https:";
            } catch {
                return true;
            }
        });

        return crearPrueba(
            "Enlaces oficiales",
            incorrectos.length === 0,
            incorrectos.length === 0
                ? `${datos.length} enlaces con formato HTTPS válido.`
                : `${incorrectos.length} enlaces tienen formato inválido.`
        );
    }

    // COMPROBAR DUPLICADOS

    function probarDuplicados(datos) {
        const ids = datos.map(juego => juego.id);
        const unicos = new Set(ids);

        const duplicados = ids.length - unicos.size;

        return crearPrueba(
            "Identificadores duplicados",
            duplicados === 0,
            duplicados === 0
                ? "No se encontraron identificadores repetidos."
                : `Se encontraron ${duplicados} identificadores repetidos.`
        );
    }

    // COMPROBAR ESTRUCTURA

    function probarEstructura(datos) {
        const campos = [
            "id",
            "nombre",
            "genero",
            "plataformas",
            "descripcion",
            "url"
        ];

        const invalidos = datos.filter(juego =>
            !juego ||
            typeof juego !== "object" ||
            campos.some(campo =>
                typeof juego[campo] !== "string" ||
                !juego[campo].trim()
            )
        );

        return crearPrueba(
            "Estructura de videojuegos",
            invalidos.length === 0,
            invalidos.length === 0
                ? "Todos los juegos contienen los campos obligatorios."
                : `${invalidos.length} juegos tienen campos incompletos.`
        );
    }

    // MOSTRAR RESULTADOS

    function mostrarResultados(pruebas) {
        resultados.replaceChildren();

        pruebas.forEach(prueba => {
            const tarjeta = document.createElement("article");

            tarjeta.className =
                "gz48-resultado " +
                (prueba.correcto
                    ? "gz48-correcto"
                    : "gz48-error");

            const informacion = document.createElement("div");
            const titulo = document.createElement("h4");
            const descripcion = document.createElement("p");
            const estado = document.createElement("strong");

            titulo.textContent = prueba.nombre;
            descripcion.textContent = prueba.detalle;

            estado.textContent = prueba.correcto
                ? "CORRECTO"
                : "REVISAR";

            informacion.append(titulo, descripcion);
            tarjeta.append(informacion, estado);
            resultados.appendChild(tarjeta);
        });

        const superadas = pruebas.filter(
            prueba => prueba.correcto
        ).length;

        const total = pruebas.length;

        const valor = total
            ? Math.round((superadas / total) * 100)
            : 0;

        porcentaje.textContent = valor + "%";
        progreso.style.width = valor + "%";

        estadoGeneral.textContent =
            superadas === total
                ? "Sin problemas detectados"
                : "Revisión necesaria";

        mensaje.textContent =
            `${superadas} de ${total} comprobaciones superadas.`;

        return { superadas, total, valor };
    }

    // EJECUTAR DIAGNÓSTICO

    async function ejecutarDiagnostico() {
        botonAnalizar.disabled = true;
        botonExportar.disabled = true;

        estadoGeneral.textContent = "Analizando...";
        mensaje.textContent = "Comprobando el sistema...";

        const pruebas = [
            probarAlmacenamiento(),
            probarConfiguracion(),
            probarFavoritos()
        ];

        try {
            const datos = await probarCatalogo();

            pruebas.push(
                crearPrueba(
                    "Carga del catálogo",
                    datos.length > 0,
                    `${datos.length} videojuegos encontrados.`
                )
            );

            pruebas.push(
                probarEstructura(datos),
                probarDuplicados(datos),
                probarEnlaces(datos)
            );

        } catch (error) {
            pruebas.push(
                crearPrueba(
                    "Carga del catálogo",
                    false,
                    error.message
                )
            );

            for (const nombre of [
                "Estructura de videojuegos",
                "Identificadores duplicados",
                "Enlaces oficiales"
            ]) {
                pruebas.push(
                    crearPrueba(
                        nombre,
                        false,
                        "No se pudo comprobar porque el catálogo no cargó."
                    )
                );
            }
        }

        const resumen = mostrarResultados(pruebas);

        ultimoInforme = {
            proyecto: "GameZone — Black & White",
            fase: 48,
            fecha: new Date().toISOString(),
            resumen,
            pruebas
        };

        botonExportar.disabled = false;
        botonAnalizar.disabled = false;
    }

    // DESCARGAR INFORME JSON

    function descargarInforme() {
        if (!ultimoInforme) return;

        const contenido = JSON.stringify(
            ultimoInforme,
            null,
            2
        );

        const archivo = new Blob(
            [contenido],
            { type: "application/json;charset=utf-8" }
        );

        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "gamezone-diagnostico.json";

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        URL.revokeObjectURL(url);

        mensaje.textContent = "Informe descargado correctamente.";
    }

    botonAnalizar.addEventListener(
        "click",
        ejecutarDiagnostico
    );

    botonExportar.addEventListener(
        "click",
        descargarInforme
    );

})();



/* ==========================================
   GAMEZONE 5.0 — FASE 49
   CENTRO DE AYUDA GAMER
========================================== */

(() => {
    "use strict";

    const buscador = document.getElementById("gz49-buscar");
    const contenedor = document.getElementById("gz49-preguntas");
    const contador = document.getElementById("gz49-contador");
    const sinResultados = document.getElementById(
        "gz49-sin-resultados"
    );
    const botonLimpiar = document.getElementById("gz49-limpiar");

    if (!buscador || !contenedor || !contador ||
        !sinResultados || !botonLimpiar) {
        return;
    }

    const preguntas = [
        ...contenedor.querySelectorAll(".gz49-pregunta")
    ];

    // NORMALIZAR TEXTO PARA BUSCAR

    function normalizarAyuda(texto) {
        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // FILTRAR PREGUNTAS

    function filtrarPreguntas() {
        const consulta = normalizarAyuda(buscador.value);
        let visibles = 0;

        preguntas.forEach(pregunta => {
            const contenido = normalizarAyuda(
                pregunta.textContent
            );

            const coincide = contenido.includes(consulta);

            pregunta.hidden = !coincide;

            if (!coincide) {
                pregunta.open = false;
            }

            if (coincide) {
                visibles++;
            }
        });

        contador.textContent =
            `${visibles} de ${preguntas.length} preguntas disponibles`;

        sinResultados.hidden = visibles !== 0;
    }

    // LIMPIAR BUSCADOR

    function limpiarBusqueda() {
        buscador.value = "";

        preguntas.forEach(pregunta => {
            pregunta.open = false;
        });

        filtrarPreguntas();
        buscador.focus();
    }

    // PERMITIR SOLO UNA RESPUESTA ABIERTA

    preguntas.forEach(pregunta => {
        pregunta.addEventListener("toggle", () => {
            if (!pregunta.open) return;

            preguntas.forEach(otra => {
                if (otra !== pregunta && otra.open) {
                    otra.open = false;
                }
            });
        });
    });

    // EVENTOS

    buscador.addEventListener(
        "input",
        filtrarPreguntas
    );

    botonLimpiar.addEventListener(
        "click",
        limpiarBusqueda
    );

    // INICIALIZAR

    filtrarPreguntas();

})();



/* ==========================================
   GAMEZONE 5.0 — FASE 50
   CENTRO DE LANZAMIENTO
========================================== */

(() => {
    "use strict";

    const CLAVE = "gamezone_lanzamiento_v5";

    const tareas = [
        ...document.querySelectorAll(
            '.gz50-tarea input[data-gz50]'
        )
    ];

    const numero = document.getElementById("gz50-numero");
    const progreso = document.getElementById("gz50-progreso");
    const contador = document.getElementById("gz50-contador");
    const estado = document.getElementById("gz50-estado");
    const final = document.getElementById("gz50-final");
    const mensaje = document.getElementById("gz50-mensaje");

    const botonComprobar = document.getElementById(
        "gz50-comprobar"
    );

    const resultadoArchivos = document.getElementById(
        "gz50-archivos-resultado"
    );

    const botonDiagnostico = document.getElementById(
        "gz50-diagnostico"
    );

    const botonReiniciar = document.getElementById(
        "gz50-reiniciar"
    );

    if (
        !tareas.length || !numero || !progreso ||
        !contador || !estado || !final || !mensaje ||
        !botonComprobar || !resultadoArchivos ||
        !botonDiagnostico || !botonReiniciar
    ) {
        return;
    }

    // RECUPERAR TAREAS GUARDADAS

    function recuperarTareas() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE) || "{}"
            );

            if (
                !datos ||
                typeof datos !== "object" ||
                Array.isArray(datos)
            ) {
                return;
            }

            tareas.forEach(tarea => {
                tarea.checked =
                    datos[tarea.dataset.gz50] === true;
            });

        } catch (error) {
            console.warn(
                "No se pudieron recuperar las tareas:",
                error
            );
        }
    }

    // GUARDAR TAREAS

    function guardarTareas() {
        const datos = {};

        tareas.forEach(tarea => {
            datos[tarea.dataset.gz50] = tarea.checked;
        });

        try {
            localStorage.setItem(
                CLAVE,
                JSON.stringify(datos)
            );

            mensaje.textContent =
                "Progreso guardado correctamente.";

        } catch (error) {
            mensaje.textContent =
                "Los cambios se aplicaron, pero no se guardaron.";

            console.warn(error);
        }
    }

    // ACTUALIZAR PANEL

    function actualizarPanel() {
        const completadas = tareas.filter(
            tarea => tarea.checked
        ).length;

        const total = tareas.length;

        const porcentaje = Math.round(
            (completadas / total) * 100
        );

        numero.textContent = porcentaje + "%";
        progreso.style.width = porcentaje + "%";

        contador.textContent =
            `${completadas} de ${total} tareas completadas`;

        if (completadas === total) {
            estado.textContent = "Lista completada";
            final.hidden = false;

        } else if (completadas > 0) {
            estado.textContent = "Preparación en progreso";
            final.hidden = true;

        } else {
            estado.textContent = "Preparación pendiente";
            final.hidden = true;
        }
    }

    // COMPROBAR ARCHIVOS PRINCIPALES

    async function comprobarArchivos() {
        const archivos = [
            "index.html",
            "style.css",
            "script.js",
            "juegos.json"
        ];

        botonComprobar.disabled = true;

        resultadoArchivos.replaceChildren();

        mensaje.textContent =
            "Comprobando archivos del proyecto...";

        let encontrados = 0;

        for (const archivo of archivos) {
            const elemento = document.createElement("div");
            elemento.className = "gz50-archivo";

            try {
                const respuesta = await fetch(
                    archivo,
                    { cache: "no-store" }
                );

                if (!respuesta.ok) {
                    throw new Error(
                        `HTTP ${respuesta.status}`
                    );
                }

                const contenido = await respuesta.text();

                if (!contenido.trim()) {
                    throw new Error("Archivo vacío");
                }

                if (archivo === "juegos.json") {
                    const datos = JSON.parse(contenido);

                    if (!Array.isArray(datos)) {
                        throw new Error(
                            "El JSON no contiene una lista"
                        );
                    }
                }

                encontrados++;

                elemento.textContent =
                    `✓ ${archivo} — Disponible`;

            } catch (error) {
                elemento.textContent =
                    `✕ ${archivo} — ${error.message}`;
            }

            resultadoArchivos.appendChild(elemento);
        }

        mensaje.textContent =
            `${encontrados} de ${archivos.length} archivos accesibles.`;

        botonComprobar.disabled = false;
    }

    // ACCEDER AL DIAGNÓSTICO

    function abrirDiagnostico() {
        const seccion = document.getElementById(
            "diagnostico-gamer"
        );

        if (!seccion) {
            mensaje.textContent =
                "No se encontró el Centro de Diagnóstico.";
            return;
        }

        seccion.scrollIntoView({
            behavior: document.body.classList.contains(
                "gz5-sin-animacion"
            ) ? "auto" : "smooth"
        });

        const boton = document.getElementById(
            "gz48-analizar"
        );

        if (boton) {
            boton.click();
        }
    }

    // REINICIAR LISTA

    function reiniciarLista() {
        const confirmar = confirm(
            "¿Quieres reiniciar la lista de lanzamiento?"
        );

        if (!confirmar) return;

        tareas.forEach(tarea => {
            tarea.checked = false;
        });

        actualizarPanel();
        guardarTareas();

        mensaje.textContent =
            "Lista de lanzamiento reiniciada.";
    }

    // EVENTOS

    tareas.forEach(tarea => {
        tarea.addEventListener("change", () => {
            actualizarPanel();
            guardarTareas();
        });
    });

    botonComprobar.addEventListener(
        "click",
        comprobarArchivos
    );

    botonDiagnostico.addEventListener(
        "click",
        abrirDiagnostico
    );

    botonReiniciar.addEventListener(
        "click",
        reiniciarLista
    );

    // INICIAR SISTEMA

    recuperarTareas();
    actualizarPanel();

})();



/* ==========================================
   GAMEZONE ULTIMATE
   ANIMACIONES AL HACER SCROLL
========================================== */

(() => {
    "use strict";

    const selector = [
        "main > section",
        ".juego",
        ".tarjeta-juego",
        ".gz48-panel",
        ".gz49-pregunta",
        ".gz50-panel"
    ].join(", ");

    const elementos = [
        ...document.querySelectorAll(selector)
    ];

    if (!elementos.length) return;

    const reducirMovimiento = () =>
        document.body.classList.contains("gz5-sin-animacion") ||
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observador = new IntersectionObserver(
        entradas => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("gz-visible");
                    observador.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px 60px 0px"
        }
    );

    elementos.forEach(elemento => {
        if (reducirMovimiento()) return;

        elemento.classList.add("gz-animar-entrada");
        observador.observe(elemento);
    });

    // REVELAR TODO SI SE ACTIVA MOVIMIENTO REDUCIDO

    const vigilarConfiguracion = new MutationObserver(() => {
        if (!reducirMovimiento()) return;

        elementos.forEach(elemento => {
            elemento.classList.add("gz-visible");
        });

        observador.disconnect();
    });

    vigilarConfiguracion.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });

})();



/* ==================================================
   GAMEZONE ULTIMATE — ULTRA BACKGROUND V2
   SISTEMA VISUAL ANIMADO
================================================== */

(() => {
    "use strict";

    // Evitar crear dos fondos

    if (document.getElementById("gz-ultra-fondo")) {
        return;
    }

    const fondo = document.createElement("div");

    fondo.id = "gz-ultra-fondo";
    fondo.setAttribute("aria-hidden", "true");

    // CREAR AURORAS

    for (let i = 1; i <= 3; i++) {
        const aurora = document.createElement("div");

        aurora.className =
            `gz-ultra-aurora a${i}`;

        fondo.appendChild(aurora);
    }

    // CREAR CUADRÍCULA

    const grid = document.createElement("div");

    grid.className = "gz-ultra-grid";

    fondo.appendChild(grid);

    // CREAR EFECTO DE CURSOR

    const cursor = document.createElement("div");

    cursor.className = "gz-ultra-cursor";

    fondo.appendChild(cursor);

    // DETECTAR MOVIMIENTO REDUCIDO

    const mediaReducida = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function movimientoReducido() {
        return mediaReducida.matches ||
            document.body.classList.contains(
                "gz5-sin-animacion"
            );
    }

    // GENERAR PARTÍCULAS

    const cantidad = window.innerWidth < 768
        ? 22
        : 65;

    const particulas = document.createDocumentFragment();

    for (let i = 0; i < cantidad; i++) {
        const particula = document.createElement("span");

        particula.className = "gz-ultra-particula";

        const tamaño = 1 + Math.random() * 2.5;

        particula.style.setProperty(
            "--gz-x",
            `${Math.random() * 100}%`
        );

        particula.style.setProperty(
            "--gz-y",
            `${Math.random() * 100}%`
        );

        particula.style.setProperty(
            "--gz-size",
            `${tamaño}px`
        );

        particula.style.setProperty(
            "--gz-duration",
            `${8 + Math.random() * 13}s`
        );

        particula.style.setProperty(
            "--gz-delay",
            `${Math.random() * -20}s`
        );

        particula.style.setProperty(
            "--gz-opacity",
            `${.15 + Math.random() * .55}`
        );

        particula.style.setProperty(
            "--gz-drift",
            `${Math.random() * 100 - 50}px`
        );

        particulas.appendChild(particula);
    }

    fondo.appendChild(particulas);

    // CREAR DESTELLOS

    const posiciones = [
        [15, 22],
        [75, 18],
        [42, 65],
        [88, 77],
        [28, 84],
        [60, 35]
    ];

    posiciones.forEach(([x, y], indice) => {
        const destello = document.createElement("span");

        destello.className = "gz-ultra-destello";

        destello.style.left = `${x}%`;
        destello.style.top = `${y}%`;

        destello.style.animationDelay =
            `${indice * -.8}s`;

        fondo.appendChild(destello);
    });

    // VIÑETA

    const vineta = document.createElement("div");

    vineta.className = "gz-ultra-vineta";

    fondo.appendChild(vineta);

    // INSERTAR DETRÁS DE LA PÁGINA

    document.body.prepend(fondo);

    // RESPLANDOR QUE SIGUE AL CURSOR

    const admiteCursor = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (admiteCursor) {
        let pendiente = false;
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener(
            "pointermove",
            evento => {
                if (movimientoReducido()) {
                    fondo.classList.remove(
                        "gz-cursor-activo"
                    );
                    return;
                }

                mouseX = evento.clientX;
                mouseY = evento.clientY;

                if (pendiente) return;

                pendiente = true;

                requestAnimationFrame(() => {
                    fondo.style.setProperty(
                        "--gz-mouse-x",
                        `${mouseX}px`
                    );

                    fondo.style.setProperty(
                        "--gz-mouse-y",
                        `${mouseY}px`
                    );

                    fondo.classList.add(
                        "gz-cursor-activo"
                    );

                    pendiente = false;
                });
            },
            { passive: true }
        );

        document.addEventListener(
            "pointerout",
            evento => {
                if (!evento.relatedTarget) {
                    fondo.classList.remove(
                        "gz-cursor-activo"
                    );
                }
            }
        );
    }

    // SINCRONIZAR CON LA FASE 47

    function sincronizarMovimiento() {
        fondo.classList.toggle(
            "gz-movimiento-reducido",
            movimientoReducido()
        );

        if (movimientoReducido()) {
            fondo.classList.remove(
                "gz-cursor-activo"
            );
        }
    }

    const observador = new MutationObserver(
        sincronizarMovimiento
    );

    observador.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });

    if (mediaReducida.addEventListener) {
        mediaReducida.addEventListener(
            "change",
            sincronizarMovimiento
        );
    }

    sincronizarMovimiento();

    console.log(
        "GameZone Ultimate: fondo Ultra Premium activado."
    );

})();



/* ==================================================
   GAMEZONE ULTIMATE — GLASS EDITION
   ACTIVACIÓN DE PANELES PREMIUM
================================================== */

(() => {
    "use strict";

    // Paneles conocidos de GameZone
    const selectoresPaneles = [
        ".gz48-panel",
        ".gz50-panel",
        ".gz49-buscador",
        ".gz49-accesos",
        ".gz5-ajustes",
        ".gz49-pregunta"
    ];

    const selectorPaneles = selectoresPaneles.join(", ");

    // Evitar modificar paneles internos de otros paneles
    // o aplicar el efecto varias veces.

    function activarCristal() {
        const paneles = document.querySelectorAll(
            selectorPaneles
        );

        paneles.forEach(panel => {
            if (panel.classList.contains("gz-glass-premium")) {
                return;
            }

            panel.classList.add("gz-glass-premium");

            // Destacar los paneles principales
            if (
                panel.matches(".gz48-panel, .gz50-panel")
            ) {
                panel.classList.add("gz-glass-destacado");
            }
        });

        // Mejorar bordes de las tarjetas existentes
        document.querySelectorAll(
            ".juego, .tarjeta-juego"
        ).forEach(tarjeta => {
            tarjeta.classList.add("gz-glass-juego");
        });
    }

    // Movimiento del brillo según el cursor
    const admiteHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const mediaMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    function reducirMovimiento() {
        return mediaMovimiento.matches ||
            document.body.classList.contains(
                "gz5-sin-animacion"
            );
    }

    if (admiteHover) {
        document.addEventListener(
            "pointermove",
            evento => {
                if (reducirMovimiento()) return;

                const panel = evento.target.closest(
                    ".gz-glass-premium"
                );

                if (!panel) return;

                const rect = panel.getBoundingClientRect();

                const x = evento.clientX - rect.left;
                const y = evento.clientY - rect.top;

                panel.style.setProperty(
                    "--gz-glass-x",
                    `${x}px`
                );

                panel.style.setProperty(
                    "--gz-glass-y",
                    `${y}px`
                );
            },
            { passive: true }
        );
    }

    // Activar en paneles actuales
    activarCristal();

    // Activar también en paneles agregados
    // dinámicamente por otras fases.

    let programado = false;

    const observador = new MutationObserver(() => {
        if (programado) return;

        programado = true;

        requestAnimationFrame(() => {
            programado = false;
            activarCristal();
        });
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log(
        "GameZone Ultimate: Glass Edition activado."
    );

})();



/* ==============================================
   GAMEZONE ULTIMATE — PREMIUM INTERFACE V3
   CURSOR LIGHT + NAVEGACION ACTIVA
============================================== */

(() => {
    "use strict";

    // EVITAR INICIALIZAR DOS VECES

    if (window.gzPremiumV3Activo) return;
    window.gzPremiumV3Activo = true;

    const mediaMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const mediaCursor = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    function movimientoPermitido() {
        return !mediaMovimiento.matches &&
            !document.body.classList.contains(
                "gz5-sin-animacion"
            );
    }

    // LUZ QUE SIGUE AL CURSOR EN LAS TARJETAS

    if (mediaCursor.matches) {
        let framePendiente = false;
        let tarjetaActual = null;
        let x = 0;
        let y = 0;

        document.addEventListener(
            "pointermove",
            evento => {
                if (!movimientoPermitido()) return;

                const objetivo = evento.target;

                if (!(objetivo instanceof Element)) {
                    return;
                }

                const tarjeta = objetivo.closest(".juego");

                if (!tarjeta) return;

                const rect = tarjeta.getBoundingClientRect();

                tarjetaActual = tarjeta;
                x = evento.clientX - rect.left;
                y = evento.clientY - rect.top;

                if (framePendiente) return;

                framePendiente = true;

                requestAnimationFrame(() => {
                    if (tarjetaActual) {
                        tarjetaActual.style.setProperty(
                            "--gz-card-x",
                            `${x}px`
                        );

                        tarjetaActual.style.setProperty(
                            "--gz-card-y",
                            `${y}px`
                        );
                    }

                    framePendiente = false;
                });
            },
            { passive: true }
        );
    }

    // NAVEGACION ACTIVA POR SECCION

    const enlaces = [
        ...document.querySelectorAll(
            '.nav a[href^="#"]'
        )
    ];

    const secciones = enlaces
        .map(enlace => {
            const id = enlace.getAttribute("href").slice(1);

            return {
                enlace,
                seccion: document.getElementById(id)
            };
        })
        .filter(item => item.seccion);

    function actualizarNavegacion() {
        if (!secciones.length) return;

        const posicion = window.scrollY + 160;
        let activa = secciones[0];

        secciones.forEach(item => {
            if (item.seccion.offsetTop <= posicion) {
                activa = item;
            }
        });

        enlaces.forEach(enlace => {
            const seleccionado = enlace === activa.enlace;

            enlace.classList.toggle(
                "gz-nav-activo",
                seleccionado
            );

            if (seleccionado) {
                enlace.setAttribute(
                    "aria-current",
                    "location"
                );
            } else {
                enlace.removeAttribute("aria-current");
            }
        });
    }

    let scrollPendiente = false;

    window.addEventListener(
        "scroll",
        () => {
            if (scrollPendiente) return;

            scrollPendiente = true;

            requestAnimationFrame(() => {
                actualizarNavegacion();
                scrollPendiente = false;
            });
        },
        { passive: true }
    );

    window.addEventListener(
        "resize",
        actualizarNavegacion,
        { passive: true }
    );

    actualizarNavegacion();

    console.log(
        "GameZone Ultimate: interfaz Premium V3 activada."
    );

})();



/* ============================================
   GAMEZONE ULTIMATE — CINEMATIC EDITION V4
============================================ */

(() => {
    "use strict";

    if (window.gzCinemaV4Activo) return;
    window.gzCinemaV4Activo = true;

    function iniciarCinema() {
        const hero = document.querySelector(".hero");

        if (!hero) {
            console.info(
                "GameZone Cinema: no se encontró .hero"
            );
            return;
        }

        hero.classList.add("gz-cinema");

        // Buscar el contenedor del texto principal
        const titulo = hero.querySelector("h1");

        if (!titulo) return;

        const contenedor = titulo.parentElement;

        if (!contenedor) return;

        // No agregar el distintivo dos veces
        if (
            contenedor.querySelector(
                ".gz-cinema-etiqueta"
            )
        ) {
            return;
        }

        const etiqueta = document.createElement("span");

        etiqueta.className = "gz-cinema-etiqueta";
        etiqueta.textContent = "GAMEZONE · ULTIMATE EXPERIENCE";

        contenedor.insertBefore(etiqueta, titulo);

        console.log(
            "GameZone Ultimate: Cinematic Edition V4 activada."
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarCinema,
            { once: true }
        );
    } else {
        iniciarCinema();
    }
})();
