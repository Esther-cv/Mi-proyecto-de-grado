document.addEventListener("DOMContentLoaded", () => {
  let preguntaActual = null;

  // ====== BANCO DE PREGUNTAS (40) ======
  let preguntas = [
    { pregunta: "5 + 3", respuesta: "8" },
    { pregunta: "10 - 4", respuesta: "6" },
    { pregunta: "7 × 2", respuesta: "14" },
    { pregunta: "12 ÷ 3", respuesta: "4" },
    { pregunta: "9 + 6", respuesta: "15" },
    { pregunta: "8 × 3", respuesta: "24" },
    { pregunta: "20 - 9", respuesta: "11" },
    { pregunta: "15 ÷ 5", respuesta: "3" },
    { pregunta: "6 + 7", respuesta: "13" },
    { pregunta: "18 - 5", respuesta: "13" },
    { pregunta: "4 × 5", respuesta: "20" },
    { pregunta: "25 ÷ 5", respuesta: "5" },
    { pregunta: "11 + 9", respuesta: "20" },
    { pregunta: "30 - 12", respuesta: "18" },
    { pregunta: "6 × 6", respuesta: "36" },
    { pregunta: "40 ÷ 8", respuesta: "5" },
    { pregunta: "13 + 8", respuesta: "21" },
    { pregunta: "27 - 9", respuesta: "18" },
    { pregunta: "9 × 4", respuesta: "36" },
    { pregunta: "35 ÷ 7", respuesta: "5" },

    // Nuevas 20
    { pregunta: "14 + 9", respuesta: "23" },
    { pregunta: "50 - 26", respuesta: "24" },
    { pregunta: "9 × 7", respuesta: "63" },
    { pregunta: "81 ÷ 9", respuesta: "9" },
    { pregunta: "16 + 5", respuesta: "21" },
    { pregunta: "72 - 15", respuesta: "57" },
    { pregunta: "8 × 9", respuesta: "72" },
    { pregunta: "56 ÷ 8", respuesta: "7" },
    { pregunta: "23 + 12", respuesta: "35" },
    { pregunta: "44 - 18", respuesta: "26" },
    { pregunta: "7 × 12", respuesta: "84" },
    { pregunta: "96 ÷ 12", respuesta: "8" },
    { pregunta: "19 + 14", respuesta: "33" },
    { pregunta: "63 - 22", respuesta: "41" },
    { pregunta: "11 × 11", respuesta: "121" },
    { pregunta: "144 ÷ 12", respuesta: "12" },
    { pregunta: "24 + 17", respuesta: "41" },
    { pregunta: "70 - 33", respuesta: "37" },
    { pregunta: "6 × 14", respuesta: "84" },
    { pregunta: "90 ÷ 6", respuesta: "15" }
  ];

  // Backup para reiniciar cuando se acaben todas las preguntas
  const preguntasBackup = [...preguntas];

  // ====== VARIABLES DEL JUEGO ======
  let jugador = null,
      puntos = 0,
      nivel = 1,
      vidas = 3;
  const nivelMax = 20;
  let jugando = false;
  let mario, escenario;
  let bloquesData = [];
  let temporizadorPregunta = null;
  let intervaloContador = null;
  let tiempoRestante = 10; // ⏱️ 10 SEGUNDOS

  // ====== ELEMENTOS Y LISTENERS INICIALES ======
  const btnRegistrar = document.getElementById('btnRegistrar');
  const btnComenzar = document.getElementById('btnComenzar');
  const btnIniciarJuego = document.getElementById('btnIniciarJuego');
  const btnJugar = document.getElementById('btnJugar');
  const btnResponder = document.getElementById('btnResponder');
  const inputRespuesta = document.getElementById('inputRespuesta');
  const mensajeBox = document.getElementById('mensaje');

  if (btnRegistrar) {
    btnRegistrar.addEventListener('click', () => {
      const nombre = document.getElementById('nombreJugador').value.trim();
      if (!nombre) return alert("Escribe tu nombre para continuar.");
      jugador = nombre;
      document.getElementById('saludo').textContent = `👋 Hola, ${jugador}`;
      document.getElementById('pantallaInicio').classList.add('oculto');
      document.getElementById('pantallaInstrucciones').classList.remove('oculto');
    });
  }

  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      document.getElementById('pantallaInstrucciones').classList.add('oculto');
      document.getElementById('pantallaMapa').classList.remove('oculto');
    });
  }

  if (btnIniciarJuego) {
    btnIniciarJuego.addEventListener('click', () => {
      document.getElementById('pantallaMapa').classList.add('oculto');
      empezarJuego();
    });
  }

  if (btnJugar) {
    btnJugar.addEventListener('click', empezarJuego);
  }

  if (btnResponder) {
    btnResponder.addEventListener('click', responderPregunta);
  }

  if (inputRespuesta) {
    inputRespuesta.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') responderPregunta();
    });
  }

  // ====== Listener opcional para abrir TikTok (si agregas el botón en HTML) ======
  const btnTikTok = document.getElementById('btnTikTok');
  if (btnTikTok) {
    btnTikTok.addEventListener('click', () => {
      const tiktokURL = "https://www.tiktok.com/@tu_usuario"; // <- cambia aquí
      window.open(tiktokURL, "_blank");
    });
  }

  // ====== FUNCIONES PRINCIPALES ======
  function empezarJuego() {
    // Mostrar controles táctiles solo cuando inicia el juego
document.getElementById("controlesTouch").classList.remove("oculto");

    puntos = 0;
    nivel = 1;
    vidas = 3;
    jugando = true;
    bloquesData = [];

    const musica = document.getElementById("musicaFondo");
    if (musica && musica.paused) musica.play().catch(() => {});

    document.getElementById('infoJugador').classList.add('oculto');
    document.getElementById('contenedorJuego').classList.remove('oculto');
    document.getElementById('nombreEnJuego').textContent = jugador;
    document.getElementById('puntosEnJuego').textContent = puntos;
    document.getElementById('nivelEnJuego').textContent = nivel;
    document.getElementById('vidasEnJuego').innerHTML = "❤️".repeat(vidas);

    mario = document.getElementById("mario");
    escenario = document.getElementById("escenario");

    generarBloques();
    iniciarMovimiento();
  }

  function generarBloques() {
    escenario.innerHTML = '<div id="suelo"></div>';
    escenario.style.width = "10000px";

    for (let i = 0; i < 60; i++) {
      const bloque = document.createElement('div');
      bloque.classList.add('bloque');
      const posX = 500 + i * 300;
      bloque.style.left = `${posX}px`;
      bloque.style.bottom = "240px"; // altura de bloque
      bloque.dataset.index = i;

      bloquesData.push({
        elemento: bloque,
        index: i,
        x: posX,
        usado: false
      });

      escenario.appendChild(bloque);
    }
    console.log(`✅ ${bloquesData.length} bloques generados`);
  }

  // ====== mostrarPregunta: elige sin repetir, y reinicia banco cuando se acaba ======
  function mostrarPregunta() {
    // Reinicia banco si está vacío
    if (preguntas.length === 0) {
      preguntas = [...preguntasBackup];
      console.log('🔁 Se reinició el banco de preguntas');
    }

    // Toma una pregunta al azar
    const index = Math.floor(Math.random() * preguntas.length);
    preguntaActual = preguntas[index];

    // Eliminarla del banco para que no se repita
    preguntas.splice(index, 1);

    tiempoRestante = 10;

    const preguntaTexto = document.getElementById('preguntaTexto');
    preguntaTexto.textContent = preguntaActual.pregunta + ` ⏱️ ${tiempoRestante}s`;
    preguntaTexto.style.fontSize = '42px';
    preguntaTexto.style.fontWeight = 'bold';

    if (inputRespuesta) inputRespuesta.value = '';
    const preguntaBox = document.getElementById('preguntaBox');
    preguntaBox.classList.remove('oculto');
    preguntaBox.style.display = 'block';
    if (inputRespuesta) inputRespuesta.focus();

    console.log('📝 Pregunta:', preguntaActual.pregunta);

    // Limpiar temporizadores anteriores
    if (temporizadorPregunta) {
      clearTimeout(temporizadorPregunta);
      temporizadorPregunta = null;
    }
    if (intervaloContador) {
      clearInterval(intervaloContador);
      intervaloContador = null;
    }

    // Iniciar contador visual
    intervaloContador = setInterval(() => {
      tiempoRestante--;
      preguntaTexto.textContent = preguntaActual.pregunta + ` ⏱️ ${tiempoRestante}s`;
      if (tiempoRestante <= 0) {
        clearInterval(intervaloContador);
        intervaloContador = null;
      }
    }, 1000);

    // Temporizador que aplica penalidad si se agota el tiempo
    temporizadorPregunta = setTimeout(() => {
      if (intervaloContador) {
        clearInterval(intervaloContador);
        intervaloContador = null;
      }

      vidas--;
      mostrarMensaje(`⏰ ¡Tiempo agotado! Era: ${preguntaActual.respuesta}`, false);

      document.getElementById('vidasEnJuego').innerHTML = "❤️".repeat(vidas);
      document.getElementById('preguntaBox').classList.add('oculto');
      document.getElementById('preguntaBox').style.display = 'none';

      if (vidas <= 0) finDelJuego(false);
      temporizadorPregunta = null;
    }, 10000); // 10s
  }

  // ====== responderPregunta ======
  function responderPregunta() {
    if (!preguntaActual) return;

    const input = (document.getElementById('inputRespuesta').value || '').trim();
    if (!input) return;

    // Limpiar temporizadores
    if (temporizadorPregunta) {
      clearTimeout(temporizadorPregunta);
      temporizadorPregunta = null;
    }
    if (intervaloContador) {
      clearInterval(intervaloContador);
      intervaloContador = null;
    }

    const mensajeBoxLocal = document.getElementById('mensaje');

    if (input === preguntaActual.respuesta) {
      puntos += 10;
      mostrarMensaje("✅ ¡Correcto! +10 puntos", true);
    } else {
      vidas--;
      mostrarMensaje(`❌ Incorrecto. Era: ${preguntaActual.respuesta}`, false);
    }

    // Actualizar UI
    document.getElementById('puntosEnJuego').textContent = puntos;
    document.getElementById('vidasEnJuego').innerHTML = "❤️".repeat(vidas);
    document.getElementById('preguntaBox').classList.add('oculto');
    document.getElementById('preguntaBox').style.display = 'none';

    // Reiniciar preguntaActual (ya fue eliminada del banco en mostrarPregunta)
    preguntaActual = null;

    if (vidas <= 0) {
      finDelJuego(false);
    } else if (puntos >= nivel * 20) {
      subirNivel();
    }
  }

  // ====== helper para mostrar mensajes con el mismo estilo ======
  function mostrarMensaje(texto, positivo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    if (positivo) {
      mensaje.style.color = "#27ae60";
      mensaje.style.backgroundColor = "#d4edda";
    } else {
      mensaje.style.color = "#e74c3c";
      mensaje.style.backgroundColor = "#f8d7da";
    }
    mensaje.style.display = 'block';
    mensaje.style.padding = '15px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.fontSize = '18px';
    mensaje.style.fontWeight = 'bold';
    mensaje.style.textAlign = 'center';
    mensaje.style.position = 'absolute';
    mensaje.style.top = '20px';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translateX(-50%)';
    mensaje.style.zIndex = '100';

    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 2000);
  }

  // ====== subirNivel, finDelJuego ======
  function subirNivel() {
    nivel++;
    if (nivel > nivelMax) return finDelJuego(true);
    document.getElementById('nivelEnJuego').textContent = nivel;
  }

  function finDelJuego(ganaste = false) {
    document.getElementById("controlesTouch").classList.add("oculto");

    jugando = false;
    const musica = document.getElementById("musicaFondo");
    if (musica) musica.pause();

    // limpiar temporizadores por si acaso
    if (temporizadorPregunta) {
      clearTimeout(temporizadorPregunta);
      temporizadorPregunta = null;
    }
    if (intervaloContador) {
      clearInterval(intervaloContador);
      intervaloContador = null;
    }

    document.getElementById('contenedorJuego').classList.add('oculto');
    document.getElementById('infoJugador').classList.remove('oculto');
    document.getElementById('puntos').textContent = puntos;
    document.getElementById('nivel').textContent = nivel;

    if (ganaste) {
      document.getElementById('saludo').textContent = `🏆 ¡Felicidades ${jugador}! Completaste todos los niveles`;
    } else {
      document.getElementById('saludo').textContent = `😢 Game Over, ${jugador}. ¡Inténtalo de nuevo!`;
    }
  }

  // ====== Movimiento y detección de colisiones (prácticamente tu código original) ======
  function iniciarMovimiento() {
    let posX = 100;
    let posY = 88;
    let velocidadX = 6;
    let saltando = false;
    let velocidadSalto = 0;
    let gravedad = 1;
    let sueloY = 88;
    let mundoX = 0;

    const teclas = {};

    function actualizar() {
      if (!jugando) return;

      if (saltando) {
        posY += velocidadSalto;
        velocidadSalto -= gravedad;

        if (posY <= sueloY) {
          posY = sueloY;
          saltando = false;
          velocidadSalto = 0;
          mario.classList.remove("saltando");
        }
      }

      if (teclas["ArrowRight"] || teclas["d"]) {
        mario.classList.add("mario-camina");
        if (posX < 300) {
          posX += velocidadX;
        } else {
          mundoX -= velocidadX;
        }
        mario.style.transform = "scaleX(1)";
      }

      if (teclas["ArrowLeft"] || teclas["a"]) {
        mario.classList.add("mario-camina");
        if (posX > 50) {
          posX -= velocidadX;
        } else if (mundoX < 0) {
          mundoX += velocidadX;
        }
        mario.style.transform = "scaleX(-1)";
      }

      mario.style.left = posX + "px";
      mario.style.bottom = posY + "px";
      escenario.style.transform = `translateX(${mundoX}px)`;

      if (saltando) detectarColision();

      requestAnimationFrame(actualizar);
    }

    document.addEventListener("keydown", (e) => {
      if (!jugando) return;
      teclas[e.key] = true;

      if ((e.key === " " || e.key === "ArrowUp") && !saltando) {
        e.preventDefault();
        saltando = true;
        velocidadSalto = 18;
        mario.classList.add("saltando");
        console.log('🦘 Salto!');
      }
    });

    document.addEventListener("keyup", (e) => {
      teclas[e.key] = false;
      mario.classList.remove("mario-camina");
    });

    function detectarColision() {
      const marioMundoX = posX - mundoX;
      const alturaMario = posY + 86; // posY + altura de Mario

      bloquesData.forEach(bloque => {
        if (bloque.usado) return;

        const bloqueY = 240; // altura del bloque
        const rangoColisionY = bloqueY - 10; // rango para detectar golpe

        const dentroBloqueX =
          marioMundoX + 86 > bloque.x + 15 &&
          marioMundoX < bloque.x + 72 - 15;

        const golpeaBloque =
          alturaMario >= rangoColisionY &&
          alturaMario <= bloqueY + 72 &&
          velocidadSalto > 0;

        if (dentroBloqueX && golpeaBloque) {
          console.log('💥 ¡COLISIÓN detectada en bloque', bloque.index);

          bloque.usado = true;
          bloque.elemento.classList.add('bloque-usado');
          bloque.elemento.style.opacity = '0.6';
          bloque.elemento.style.backgroundImage = 'url("img/bloque-usado.png")';

          bloque.elemento.style.transform = 'translateY(-10px)';
          setTimeout(() => bloque.elemento.style.transform = 'translateY(0)', 200);

          velocidadSalto = -2;
          mostrarPregunta();
        }
      });
    }

    actualizar();
  }

  // FIN DOMContentLoaded
});

/* =========================================
   CONTROLES TÁCTILES PARA MÓVIL (AGREGADO AL FINAL)
   - Simula eventos de teclado para integrarse
     con tu sistema de control existente.
   ========================================= */

(function() {
  // Mostrar controles solo en pantallas móviles
  const controlesContainer = document.getElementById("controlesTouch");
  if (!controlesContainer) return;

  if (window.innerWidth < 900) {
    controlesContainer.classList.remove("oculto");
    controlesContainer.setAttribute("aria-hidden", "false");
  } else {
    controlesContainer.classList.add("oculto");
    controlesContainer.setAttribute("aria-hidden", "true");
  }

  const btnIz = document.getElementById("btnIzquierda");
  const btnDer = document.getElementById("btnDerecha");
  const btnSalto = document.getElementById("btnSaltar");

  // pequeña protección si alguno no existe
  if (!btnIz || !btnDer || !btnSalto) return;

  // ayudante: despacha eventos de teclado
  function despachaTecla(key, type = "keydown") {
    // Intenta crear evento lo más compatible posible
    let ev;
    try {
      ev = new KeyboardEvent(type, { key: key, bubbles: true, cancelable: true });
    } catch (err) {
      // fallback para navegadores extraños
      ev = document.createEvent("Event");
      ev.initEvent(type, true, true);
      ev.key = key;
    }
    document.dispatchEvent(ev);
  }

  // Touch start / end: prevenir scroll y mantener la acción
  btnIz.addEventListener("touchstart", (e) => { e.preventDefault(); despachaTecla("ArrowLeft","keydown"); }, { passive: false });
  btnIz.addEventListener("touchend",   (e) => { e.preventDefault(); despachaTecla("ArrowLeft","keyup"); }, { passive: false });

  btnDer.addEventListener("touchstart", (e) => { e.preventDefault(); despachaTecla("ArrowRight","keydown"); }, { passive: false });
  btnDer.addEventListener("touchend",   (e) => { e.preventDefault(); despachaTecla("ArrowRight","keyup"); }, { passive: false });

  // Para salto enviamos tanto Space como ArrowUp (igual que tu keydown espera)
  btnSalto.addEventListener("touchstart", (e) => {
    e.preventDefault();
    despachaTecla(" ","keydown");     // espacio
    despachaTecla("ArrowUp","keydown");
    // también enviamos keyup breve para simular pulsación corta
    setTimeout(() => {
      despachaTecla(" ","keyup");
      despachaTecla("ArrowUp","keyup");
    }, 120);
  }, { passive: false });

  btnSalto.addEventListener("touchend", (e) => {
    e.preventDefault();
    despachaTecla(" ","keyup");
    despachaTecla("ArrowUp","keyup");
  }, { passive: false });

  // Ajustar visibilidad si el usuario rota o cambia tamaño
  window.addEventListener("resize", () => {
    if (window.innerWidth < 900) {
      controlesContainer.classList.remove("oculto");
      controlesContainer.setAttribute("aria-hidden", "false");
    } else {
      controlesContainer.classList.add("oculto");
      controlesContainer.setAttribute("aria-hidden", "true");
    }
  });
})();
