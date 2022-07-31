// -------------------------------------------------------------------------
//                                CANVAS
// -------------------------------------------------------------------------

// Paper
const paper = document.getElementById('recuadro');

// Canvas y Contexto
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');

// Canvas y Contexto Auxiliar
const canvasAuxiliar = document.createElement('canvas');
canvasAuxiliar.id = 'canvasAuxiliar';
canvasAuxiliar.width = paper.offsetWidth;
canvasAuxiliar.height = paper.offsetHeight;

document.getElementById('recuadro').appendChild(canvasAuxiliar);

const canvasAux = document.getElementById('canvasAuxiliar');
const ctxAux = canvasAux.getContext('2d');

// Ventana Alerta y botones
const ventanaAlerta = document.createElement('div');
const botonSi = document.createElement('button');
const botonNo = document.createElement('button');

ventanaAlerta.id = 'ventanaAlerta';
ventanaAlerta.innerHTML += '¿Quieres eliminar todo?<br><br>';

botonSi.id = 'btnSi';
botonSi.innerHTML += 'Si';

botonNo.id = 'btnNo';
botonNo.innerHTML += 'No';

// -------------------------------------------------------------------------
//                               INPUTS
// -------------------------------------------------------------------------
const botonLapiz = document.getElementById('botonLapiz');
botonLapiz.addEventListener("click", dibujarConMouse, false);

const botonBorrar = document.getElementById('botonBorrar');
botonBorrar.addEventListener("click", borrar, false);

const botonRectFill = document.getElementById('botonRectFill');
botonRectFill.addEventListener("click", function(){crearRectangulo(true);}, false);

const botonRectStroke = document.getElementById('botonRectStroke');
botonRectStroke.addEventListener("click", function(){crearRectangulo(false);}, false);

const botonCircleFill = document.getElementById('botonCircleFill');
botonCircleFill.addEventListener("click", function(){crearCirculo(true);}, false);

const botonCircleStroke = document.getElementById('botonCircleStroke');
botonCircleStroke.addEventListener("click", function(){crearCirculo(false);}, false);

const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", preguntarLimpiarCanvas, false);

const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("input", cambioColor, false);

const slider = document.getElementById('rangoGrosor');
const valorGrosor = document.getElementById('valorGrosor');

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("input", cambioFondo);
colorFondoInput.value = "#FFFFFF";

valorGrosor.innerHTML = slider.value;
slider.oninput = function() {
    valorGrosor.innerHTML = this.value;
    grosorPuntero = slider.value;
}

// Eventos del Mouse en Canvas
canvas.addEventListener("mousedown", clickDown, false); // Detecta cuando hace clic
canvas.addEventListener("mouseup", clickUp, false);     // Detecta cuando suelta el clic
canvas.addEventListener("mousemove", movimientoMouse);  // Detecta cada vez que se mueve el mouse (dentro del canvas)
canvas.addEventListener('mouseleave', clickUp, false);  // Detecta cuando el mouse sale del recuadro del canvas

// Eventos del Mouse del Canvas Auxiliar para las animaciones
canvasAux.addEventListener("mousedown", clickDown, false);
canvasAux.addEventListener("mouseup", clickUp, false);
canvasAux.addEventListener("mousemove", movimientoMouse);
canvasAux.addEventListener('mouseleave', clickUp, false);

// Eventos del Slider para animar los cambios
slider.addEventListener("mousedown", function(){cambiandoGrosorPuntero = true;}, false);
slider.addEventListener("mousemove", verGrosorPuntero, false);
slider.addEventListener("mouseup", function(){cambiandoGrosorPuntero = false; ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);}, false);

// Eventos de la ventana del navegador
window.onkeydown = window.onkeyup = function(evento){
    if(evento.keyCode == 16){
        presionandoShift = evento.type == 'keydown';
    } };
//window.addEventListener("resize", resize);   // Si se usa este comando, el canvas se ajusta a la ventana pero se elimina el dibujo

// -------------------------------------------------------------------------
//                              VARIABLES
// -------------------------------------------------------------------------
// Tamaño del canvas
var width = paper.offsetWidth;
var height = paper.offsetHeight;
canvas.width = width;
canvas.height = height;

var estadoClick = false, realizoMovimientoMouse = false;   // Variables de apoyo en el click y movimiento del mouse
var colorPuntero = "#000000";    // Color del lapiz al inicio
var colorFondo = "#FFFFFF";      // Color del fondo al inicio
var colorSeleccion = "#1E1E1E", colorDeseleccion = "#454545";  // Colores de los botones seleccionados y deseleccionados
botonLapiz.style.background = colorSeleccion;

var grosorPuntero = slider.value, cambiandoGrosorPuntero = false;
var pos = { x: 0, y: 0 };

var existeCanvasAuxiliar = false;
var widthAux = 40, heightAux = 40;
var posXRect = 0, posYRect = 0;

var creandoRectangulo = false, creandoCirculo = false, conRelleno = true;
var borrando = false;
var radio = 25;

var presionandoShift = false, ventanaAlertaActiva = false, dibujandoLineaRecta = false, lineaRectaEnX = false;

// -------------------------------------------------------------------------
//                         FUNCIONES PRINCIPALES
// -------------------------------------------------------------------------
// --------- CUANDO SE PRESIONA EL CLIC (ocurre una vez por clic) ---------- 
function clickDown(evento){
    estadoClick = true;
    // Guarda la posicion del mouse cuando se hace el click, tanto en X como en Y
    pos.x = evento.layerX;
    pos.y = evento.layerY;

    if(borrando){
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = colorPuntero;
        ctx.lineWidth = grosorPuntero;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+0.1,pos.y+0.1);
        ctx.closePath();
        ctx.stroke();
    } else if(!creandoCirculo && !creandoRectangulo){
        // Si no se está haciendo un circulo o un rectángulo, ni tampoco se está usando el borrador,
        // entonces se está usando el lápiz
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = colorPuntero;
        ctx.lineWidth = grosorPuntero;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+0.1,pos.y+0.1);
        ctx.closePath();
        ctx.stroke();
    }
}
// --------------------- CUANDO SE MUEVE EL MOUSE -------------------------- 
function movimientoMouse(evento){
    // limpiamos constantemente el canvas Auxiliar en cada movimiento del mouse
    ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
    var posXaux = Math.abs(pos.x - evento.layerX);
    var posYaux = Math.abs(pos.y - evento.layerY);
    var movimientoLargo = false;

    if(posXaux > 5 || posYaux > 5) {
        movimientoLargo = true;
    }
    // Verificamos si se hizo click o no
    if(estadoClick){
        if(movimientoLargo){
            // Almacena en la variable que existe movimiento mientras se mantiene el click
            realizoMovimientoMouse = true;
            // PARA LOS RECTANGULOS
            if(creandoRectangulo){
                // Obtenemos el largo y el alto del rectangulo
                widthAux = (pos.x - evento.layerX) * 2;
                heightAux = (pos.y - evento.layerY) * 2;

                var posX, posY;
                if(presionandoShift){
                    if(Math.abs(widthAux) >= Math.abs(heightAux)){
                        posX = evento.layerX;
                        posY = evento.layerY - (widthAux - heightAux)/2;
                        heightAux = widthAux;
                    } else {
                        posX = evento.layerX - (heightAux - widthAux)/2;
                        posY = evento.layerY;
                        widthAux = heightAux;
                    }
                } else {
                    posX = evento.layerX;
                    posY = evento.layerY;
                }
                // Dibujamos la figura en la ultima posicion que se quedó el mouse después del movimiento
                if(conRelleno){
                    ctxAux.fillStyle = colorPuntero;
                    ctxAux.beginPath();
                    ctxAux.fillRect(posX, posY, widthAux, heightAux);
                    ctxAux.closePath();
                } else {
                    ctxAux.lineWidth = grosorPuntero;
                    ctxAux.strokeStyle = colorPuntero;
                    ctxAux.lineJoin = 'round';
                    ctxAux.beginPath();
                    ctxAux.strokeRect(posX, posY, widthAux, heightAux);
                    ctxAux.closePath();
                }
            // PARA LOS CIRCULOS
            } else if(creandoCirculo){
                var aux_X = Math.abs(pos.x - evento.layerX);
                var aux_Y = Math.abs(pos.y - evento.layerY);

                if(aux_X > aux_Y){
                    radio = aux_X;
                } else {
                    radio = aux_Y;
                }
                // Dibujamos la figura en la ultima posicion de cada movimiento
                if(conRelleno){
                    ctxAux.fillStyle = colorPuntero;
                    ctxAux.beginPath();
                    ctxAux.arc(pos.x, pos.y, radio, 0, 2 * Math.PI);
                    ctxAux.closePath();
                    ctxAux.fill();
                } else {
                    ctxAux.lineWidth = grosorPuntero;
                    ctxAux.strokeStyle = colorPuntero;
                    ctxAux.lineJoin = 'round';
                    ctxAux.beginPath();
                    ctxAux.arc(pos.x, pos.y, radio, 0, 2 * Math.PI);
                    ctxAux.closePath();
                    ctxAux.stroke();
                }
            } else {
                if(borrando){
                    //ctx.strokeStyle = "#FFF";
                    ctx.lineWidth = grosorPuntero;
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.beginPath();
                    ctx.moveTo(pos.x,pos.y);
                    ctx.lineTo(evento.layerX, evento.layerY);
                    ctx.closePath();
                    ctx.stroke();
                    // Reestablecemos
                    pos.x = evento.layerX;
                    pos.y = evento.layerY;
                } else {
                    if(presionandoShift){
                        ctx.strokeStyle = colorPuntero;
                        ctx.lineWidth = grosorPuntero;
                        ctx.globalCompositeOperation = "source-over";
                        ctx.lineJoin = "round";
                        ctx.beginPath();
                        if(!dibujandoLineaRecta){
                            var auxDistanciaX = Math.abs(pos.x - evento.layerX);
                            var auxDistanciaY = Math.abs(pos.y - evento.layerY);
                            if(auxDistanciaX > auxDistanciaY){
                                lineaRectaEnX = true;
                            } else {
                                lineaRectaEnX = false;
                            }
                            dibujandoLineaRecta = true;
                        }
                        if(lineaRectaEnX){
                            ctx.moveTo(pos.x,pos.y);
                            ctx.lineTo(evento.layerX, pos.y);
                            ctx.closePath();
                            ctx.stroke();
                            // Reestablecemos
                            pos.x = evento.layerX;
                        } else {
                            ctx.moveTo(pos.x,pos.y);
                            ctx.lineTo(pos.x, evento.layerY);
                            ctx.closePath();
                            ctx.stroke();
                            // Reestablecemos
                            pos.y = evento.layerY;
                        }
                    } else {
                        ctx.strokeStyle = colorPuntero;
                        ctx.lineWidth = grosorPuntero;
                        ctx.globalCompositeOperation = "source-over";
                        ctx.lineJoin = "round";
                        ctx.beginPath();
                        ctx.moveTo(pos.x,pos.y);
                        ctx.lineTo(evento.layerX, evento.layerY);
                        ctx.closePath();
                        ctx.stroke();
                        // Reestablecemos
                        pos.x = evento.layerX;
                        pos.y = evento.layerY;
                    }
                }
            }
        }
    } else {
        // Mostramos como se vería el puntero cuando no se está presionando
        if(creandoRectangulo){
            posXRect = evento.layerX - widthAux/2;
            posYRect = evento.layerY - heightAux/2;
            if(conRelleno){
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.fillRect(posXRect, posYRect, widthAux, heightAux);
                ctxAux.closePath();
            } else {
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.beginPath();
                ctxAux.strokeRect(posXRect, posYRect, widthAux, heightAux);
                ctxAux.closePath();
            }
        } else if(creandoCirculo){
            if(conRelleno){
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.arc(evento.layerX, evento.layerY, radio, 0, 2 * Math.PI);
                ctxAux.closePath();
                ctxAux.fill();
            } else {
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.beginPath();
                ctxAux.arc(evento.layerX, evento.layerY, radio, 0, 2 * Math.PI);
                ctxAux.closePath();
                ctxAux.stroke();
            }
        } else if (borrando){
            ctxAux.globalCompositeOperation = "source-over";
            ctxAux.strokeStyle = colorFondo;
            ctxAux.lineWidth = grosorPuntero;
            ctxAux.lineJoin = "round";
            ctxAux.beginPath();
            ctxAux.moveTo(evento.layerX,evento.layerY);
            ctxAux.lineTo(evento.layerX+0.01,evento.layerY+0.01);
            ctxAux.closePath();
            ctxAux.stroke();
        } else {
            ctxAux.globalCompositeOperation = "source-over";
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineWidth = grosorPuntero;
            ctxAux.lineJoin = "round";
            ctxAux.beginPath();
            ctxAux.moveTo(evento.layerX,evento.layerY);
            ctxAux.lineTo(evento.layerX+0.01,evento.layerY+0.01);
            ctxAux.closePath();
            ctxAux.stroke();
        }
    }
}
// ----------------------- CUANDO SE SUELTA EL CLIC ------------------------ 
function clickUp(){
    dibujandoLineaRecta = false;
    if(estadoClick && !realizoMovimientoMouse){
        // Verifica si se esta creando alguna figura (Rectangulo o Circulo, con relleno o sin relleno)
        if(creandoRectangulo){
            // Limpiamos el canvasAuxiliar para que no se visualice la ultima figura
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
            //posXRect = evento.layerX - widthAux/2;
            //posYRect = evento.layerY - heightAux/2;
            // Aqui dibujamos el rectangulo en el canvas principal con los datos obtenidos con el canvasAuxiliar
            if(conRelleno){
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = colorPuntero;
                ctx.beginPath();
                ctx.fillRect(posXRect, posYRect, widthAux, heightAux);
                ctx.closePath();
            }
            else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = colorPuntero;
                ctx.lineWidth = grosorPuntero;
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.strokeRect(posXRect, posYRect, widthAux, heightAux);
                ctx.closePath();
            }
        }
        else if(creandoCirculo){
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
            // Aqui dibujamos el circulo en el canvas principal con los datos obtenidos con el canvasAuxiliar
            if(conRelleno){
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = colorPuntero;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radio, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = colorPuntero;
                ctx.lineWidth = grosorPuntero;
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radio, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
            }
        }
    } else {
        realizoMovimientoMouse = false;
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
    }
    // Cambiamos el estado del clic a falso
    estadoClick = false;
}

// -------------------------------------------------------------------------
//                         FUNCIONES SECUNDARIAS
// -------------------------------------------------------------------------
// Función para cambiar de color el puntero
function cambioColor()
{
    colorPuntero = colorPunteroInput.value;
}

// Función para animar el cambio del grosor del Puntero
function verGrosorPuntero(){
    if(cambiandoGrosorPuntero){
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
        if(creandoRectangulo && !conRelleno){
            var posXRectAux = canvas.width/2 - widthAux/2;
            var posYRectAux = canvas.height/2 - heightAux/2;
            ctxAux.lineWidth = slider.value;
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineJoin = 'round';
            ctxAux.beginPath();
            ctxAux.strokeRect(posXRectAux, posYRectAux, widthAux, heightAux);
            ctxAux.closePath();
        } else if(creandoCirculo && !conRelleno){
            ctxAux.lineWidth = slider.value;
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineJoin = 'round';
            ctxAux.beginPath();
            ctxAux.arc(canvas.width/2, canvas.height/2, radio, 0, 2 * Math.PI);
            ctxAux.closePath();
            ctxAux.stroke();
        } else if(borrando){
            ctxAux.globalCompositeOperation = "source-over";
            ctxAux.strokeStyle = colorFondo;
            ctxAux.lineWidth = slider.value;
            ctxAux.lineJoin = "round";
            ctxAux.beginPath();
            ctxAux.moveTo(canvas.width/2, canvas.height/2);
            ctxAux.lineTo(canvas.width/2+0.01,canvas.height/2+0.01);
            ctxAux.closePath();
            ctxAux.stroke();
        } else if(!creandoRectangulo && !creandoCirculo){
            ctxAux.globalCompositeOperation = "source-over";
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineWidth = slider.value;
            ctxAux.lineJoin = "round";
            ctxAux.beginPath();
            ctxAux.moveTo(canvas.width/2, canvas.height/2);
            ctxAux.lineTo(canvas.width/2+0.01,canvas.height/2+0.01);
            ctxAux.closePath();
            ctxAux.stroke();
        }
    }
}

// Función para cambiar de color del fondo una vez que se selecciona el color
function cambioFondo()
{
    colorFondo = colorFondoInput.value;
    canvas.style.background = colorFondo;
}

// Funcion para aparecer la alerta de Limpiar Canvas
function preguntarLimpiarCanvas()
{
    if(!ventanaAlertaActiva){
        ventanaAlertaActiva = true;
        document.getElementById('contenedor').appendChild(ventanaAlerta);
        document.getElementById('ventanaAlerta').appendChild(botonSi);
        document.getElementById('ventanaAlerta').appendChild(botonNo);

        botonSi.addEventListener('mousedown', limpiarCanvas, false);
        botonNo.addEventListener('mousedown', borrarAlerta, false);
    }
}

// Función para limpiar el canvas principal
function limpiarCanvas()
{
    // Cerramos la ventana
    borrarAlerta();
    // Borramos le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Función para borrar la ventana de alerta
function borrarAlerta()
{
    ventanaAlertaActiva = false;
    ventanaAlerta.remove();
}

// Función de activar el dibujo con el lápiz
function dibujarConMouse(){
    deseleccionarBotones();
    botonLapiz.style.background = colorSeleccion;  
    creandoCirculo = false;
    creandoRectangulo = false;
    borrando = false;
    // Si existe un canvas auxiliar, se debe borrar para poder dibujar en el canvas original
}

// Función de activar el borrador
function borrar(){
    borrando = true;
    deseleccionarBotones();
    botonBorrar.style.background = colorSeleccion;
    creandoCirculo = false;
    creandoRectangulo = false;
}

// Función de activar la creacion de rectángulos con o sin relleno
function crearRectangulo(relleno){
    creandoRectangulo = true;
    creandoCirculo = false;
    borrando = false;
    conRelleno = relleno;
    deseleccionarBotones();
    if(relleno){
        botonRectFill.style.background = colorSeleccion;
    } else {
        botonRectStroke.style.background = colorSeleccion;
    }
}

// Función para activar la creación de círculos con o sin relleno
function crearCirculo(relleno){
    creandoCirculo = true;
    creandoRectangulo = false;
    borrando = false;
    conRelleno = relleno;
    deseleccionarBotones();
    if(relleno){
        botonCircleFill.style.background = colorSeleccion;
    } else {
        botonCircleStroke.style.background = colorSeleccion;
    }
}

// Función para deseleccionar los otros botones, ya que solo un botón puede estár presionado.
function deseleccionarBotones(){
    botonLapiz.style.background = colorDeseleccion;
    botonRectFill.style.background = colorDeseleccion;
    botonRectStroke.style.background = colorDeseleccion;
    botonBorrar.style.background = colorDeseleccion;
    botonCircleFill.style.background = colorDeseleccion;
    botonCircleStroke.style.background = colorDeseleccion;
}

// Función para ajustar el canvas al tamaño de la ventana
function resize(){
    var window_height = window.innerHeight;
    var window_width = window.innerWidth;

    canvas.width = window_width;
    canvas.height = window_height;
}