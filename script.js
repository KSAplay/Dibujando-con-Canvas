// -------------------------------------------------------------------------
//                                CANVAS
// -------------------------------------------------------------------------
// Canvas y Contexto
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');
// Canvas y Contexto Auxiliar
var canvasAuxiliar, ctxAux;

// -------------------------------------------------------------------------
//                               INPUTS
// -------------------------------------------------------------------------
const botonLapiz = document.getElementById('botonLapiz');
botonLapiz.addEventListener("click", dibujarConMouse);

const botonRectFill = document.getElementById('botonRectFill');
botonRectFill.addEventListener("click", rectanguloConRelleno);

const botonRectStroke = document.getElementById('botonRectStroke');
botonRectStroke.addEventListener("click", rectanguloSinRelleno);

const botonBorrar = document.getElementById('botonBorrar');
botonBorrar.addEventListener("click", borrar);

const botonCircleFill = document.getElementById('botonCircleFill');
botonCircleFill.addEventListener("click", circuloConRelleno);

const botonCircleStroke = document.getElementById('botonCircleStroke');
botonCircleStroke.addEventListener("click", circuloSinRelleno);

const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", limpiarCanvas);

const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("change", cambioColor);

const slider = document.getElementById('rangoGrosor');
const valorGrosor = document.getElementById('valorGrosor');
valorGrosor.innerHTML = slider.value;

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("change", cambioFondo);
colorFondoInput.value = "#FFFFFF";

slider.oninput = function() {
    valorGrosor.innerHTML = this.value;
    grosorPuntero = slider.value;
}

// Eventos del Mouse en Canvas
canvas.addEventListener("mousedown", clickDown, false); // Detecta cuando hace clic
canvas.addEventListener("mouseup", clickUp, false);     // Detecta cuando suelta el clic
canvas.addEventListener("mousemove", movimientoMouse);  // Detecta cada vez que se mueve el mouse (dentro del canvas)
canvas.addEventListener('mouseleave', clickUp, false);  // Detecta cuando el mouse sale del recuadro del canvas

// Tamaño del canvas
var width = 900;
var height = 560;
canvas.width = width;
canvas.height = height;

var estadoClick =  false;
var colorPuntero = "#000000";
var colorFondo = "#FFFFFF"
var colorSeleccion = "#4E7FFF";
var grosorPuntero = slider.value;
var pos = { x: 0, y: 0 };

var existeCanvasAuxiliar = false;
var widthAux = 0, heightAux = 0;

var creandoRectangulo = false, creandoCirculo = false, conRelleno = true;
var borrando = false;
var radio = 0;

botonLapiz.style.background = colorSeleccion;

// -------------------------------------------------------------------------
//                              FUNCIONES
// -------------------------------------------------------------------------
// --------- CUANDO SE PRESIONA EL CLIC (ocurre una vez por clic) ---------- 
function clickDown(evento){

    estadoClick = true;
    // Guarda la posicion del mouse cuando se hace el click
    pos.x = evento.layerX;
    pos.y = evento.layerY;

    if(borrando){
        ctx.strokeStyle = "#FFF";
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = colorPuntero;
        ctx.lineWidth = grosorPuntero;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+0.1,pos.y+0.1);
        ctx.closePath();
        ctx.stroke();
    } else {
        if(!creandoCirculo && !creandoRectangulo){
            ctx.strokeStyle = colorPuntero;
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
}
// --------------------- CUANDO SE MUEVE EL MOUSE -------------------------- 
function movimientoMouse(evento){
    if(estadoClick){
        // PARA LOS RECTANGULOS
        if(creandoRectangulo){
            // limpiamos constantemente el canvas Auxiliar en cada movimiento del mouse
            // y dibujamos la figura en la ultima posicion que se quedó el mouse después del movimiento
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
            if(conRelleno){
                widthAux = evento.layerX - pos.x;
                heightAux = evento.layerY - pos.y;
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.fillRect(pos.x, pos.y, widthAux, heightAux);
                ctxAux.closePath();
            } else {
                widthAux = evento.layerX - pos.x;
                heightAux = evento.layerY - pos.y;
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.beginPath();
                ctxAux.strokeRect(pos.x, pos.y, widthAux, heightAux);
                ctxAux.closePath();
            }
        // PARA LOS CIRCULOS
        } else if(creandoCirculo){
            // limpiamos constantemente el canvas Auxiliar en cada movimiento
            // y dibujamos la figura en la ultima posicion de cada movimiento
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
            if(conRelleno){
                var aux_X = Math.abs(evento.layerX - pos.x);
                var aux_Y = Math.abs(evento.layerY - pos.y);
                if(aux_X > aux_Y){
                    radio = aux_X;
                } else {
                    radio = aux_Y;
                }
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.arc(pos.x, pos.y, radio, 0, 2 * Math.PI);
                ctxAux.closePath();
                ctxAux.fill();
            } else {
                var aux_X = Math.abs(evento.layerX - pos.x);
                var aux_Y = Math.abs(evento.layerY - pos.y);
                if(aux_X > aux_Y){
                    radio = aux_X;
                } else {
                    radio = aux_Y;
                }
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
                ctx.strokeStyle = "#FFF";
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
                // Ejemplo de como se vería si se eliminara constantemente en el canvias principal
                //limpiarCanvas();  // Descomentar para probar
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
// ----------------------- CUANDO SE SUELTA EL CLIC ------------------------ 
function clickUp(){
    // Cambiamos el estado del clic a falso
    estadoClick = false;
    // Verifica si se esta creando alguna figura (Rectangulo o Circulo, con relleno o sin relleno)
    if(creandoRectangulo){
        // Limpiamos el canvasAuxiliar para que no se visualice la ultima figura
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
        // Aqui dibujamos el rectangulo en el canvas principal con los datos obtenidos con el canvasAuxiliar
        if(conRelleno){
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = colorPuntero;
            ctx.beginPath();
            ctx.fillRect(pos.x, pos.y, widthAux, heightAux);
            ctx.closePath();
            // Reestablecemos a 0
            widthAux = 0;
            heightAux = 0;
        }
        else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = colorPuntero;
            ctx.lineWidth = grosorPuntero;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.strokeRect(pos.x, pos.y, widthAux, heightAux);
            ctx.closePath();
            // Reestablecemos a 0
            widthAux = 0;
            heightAux = 0;
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
}

function cambioColor()
{
    colorPuntero = colorPunteroInput.value;
}

function cambioFondo()
{
    colorFondo = colorFondoInput.value;
    canvas.style.background = colorFondo;
}

function limpiarCanvas()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function dibujarConMouse(){
    deseleccionarBotones();
    botonLapiz.style.background = colorSeleccion;
    creandoCirculo = false;
    creandoRectangulo = false;
    borrando = false;
    if(existeCanvasAuxiliar){
        eliminarCanvasAuxiliar();
    }
}

function borrar(){
    borrando = true;
    deseleccionarBotones();
    botonBorrar.style.background = colorSeleccion;
    creandoCirculo = false;
    creandoRectangulo = false;
    if(existeCanvasAuxiliar){
        eliminarCanvasAuxiliar();
    }
}

function crearRectangulo(){
    creandoCirculo = false;
    borrando = false;
    if(!existeCanvasAuxiliar){
        añadirCanvasAuxiliar();
    }

    canvasAux = document.getElementById('canvasAuxiliar');
    ctxAux = canvasAux.getContext('2d');
    // Eventos del Mouse del Canvas Auxiliar para las animaciones
    canvasAux.addEventListener("mousedown", clickDown, false);
    canvasAux.addEventListener("mouseup", clickUp, false);
    canvasAux.addEventListener("mousemove", movimientoMouse);
    canvasAux.addEventListener('mouseleave', clickUp, false);

    creandoRectangulo = true;
}

function rectanguloConRelleno(){
    conRelleno = true;
    crearRectangulo();
    deseleccionarBotones();
    botonRectFill.style.background = colorSeleccion;
}

function rectanguloSinRelleno(){
    conRelleno = false;
    crearRectangulo();
    deseleccionarBotones();
    botonRectStroke.style.background = colorSeleccion;
}

function crearCirculo(){
    creandoRectangulo = false;
    borrando = false;
    if(!existeCanvasAuxiliar){
        añadirCanvasAuxiliar();
    }
    canvasAux = document.getElementById('canvasAuxiliar');
    ctxAux = canvasAux.getContext('2d');
    // Eventos del Mouse del Canvas Auxiliar para las animaciones
    canvasAux.addEventListener("mousedown", clickDown, false);
    canvasAux.addEventListener("mouseup", clickUp, false);
    canvasAux.addEventListener("mousemove", movimientoMouse);
    canvasAux.addEventListener('mouseleave', clickUp, false);

    creandoCirculo = true;
}

function circuloConRelleno(){
    conRelleno = true;
    crearCirculo();
    deseleccionarBotones();
    botonCircleFill.style.background = colorSeleccion;
}

function circuloSinRelleno(){
    conRelleno = false;
    crearCirculo();
    deseleccionarBotones();
    botonCircleStroke.style.background = colorSeleccion;
}

function añadirCanvasAuxiliar(){
    const canvasAuxiliar = document.createElement('canvas');
    canvasAuxiliar.id = 'canvasAuxiliar';
    canvasAuxiliar.width = width;
    canvasAuxiliar.height = height;
    document.getElementById('recuadro').appendChild(canvasAuxiliar);
    existeCanvasAuxiliar = true;
}

function eliminarCanvasAuxiliar(){
    document.getElementById('canvasAuxiliar').remove(this);
    existeCanvasAuxiliar = false;
}

function deseleccionarBotones(){
    botonLapiz.style.background = "#FFF";
    botonRectFill.style.background = "#FFF";
    botonRectStroke.style.background = "#FFF";
    botonBorrar.style.background = "#FFF";
    botonCircleFill.style.background = "#FFF";
    botonCircleStroke.style.background = "#FFF";
}