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
const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("change", cambioColor);

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("change", cambioFondo);
colorFondoInput.value = "#FFFFFF";

const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", limpiarCanvas);

const botonRectFill = document.getElementById('botonRectFill');
botonRectFill.addEventListener("click", rectanguloConRelleno);

const botonRectStroke = document.getElementById('botonRectStroke');
botonRectStroke.addEventListener("click", rectanguloSinRelleno);

const botonCircleFill = document.getElementById('botonCircleFill');
botonCircleFill.addEventListener("click", circuloConRelleno);

const botonCircleStroke = document.getElementById('botonCircleStroke');
botonCircleStroke.addEventListener("click", crearCirculo);

const botonLapiz = document.getElementById('botonLapiz');
botonLapiz.addEventListener("click", dibujarConMouse);
botonLapiz.style.background = "#4E7FFF";

const slider = document.getElementById('rangoGrosor');
const valorGrosor = document.getElementById('valorGrosor');
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

// Tamaño del canvas
var width = 900;
var height = 560;
canvas.width = width;
canvas.height = height;

var estadoClick =  false;
var colorPuntero = "#000000";
var colorFondo = "#FFFFFF"
var grosorPuntero = slider.value;
var pos = { x: 0, y: 0 };

var existeCanvasAuxiliar = false;
var widthAux = 0, heightAux = 0;

var creandoRectangulo = false, creandoCirculo = false, conRelleno = true;
var botonActivado = false;

// -------------------------------------------------------------------------
//                              FUNCIONES
// -------------------------------------------------------------------------
// --------- CUANDO SE PRESIONA EL CLIC (ocurre una vez por clic) ---------- 
function clickDown(evento){

    estadoClick = true;
    // Guarda la posicion del mouse cuando se hace el click
    pos.x = evento.layerX;
    pos.y = evento.layerY;

    if(creandoRectangulo){
        // Si se está creando un rectángulo, este sibuja uno pequeño al hacer click por primera vez
        if(conRelleno){
            ctxAux.fillStyle = colorPuntero;
            ctxAux.beginPath();
            ctxAux.fillRect(pos.x, pos.y, 1, 1);
            ctxAux.closePath();
        } else {
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.
            ctxAux.beginPath();
            ctxAux.strokeRect(pos.x, pos.y, 1, 1);
            ctxAux.closePath();
        }
    }
    else if(creandoCirculo){
        // Si se está creando un círculo, este sibuja uno pequeño al hacer click por primera vez

    }
    else{
        ctx.strokeStyle = colorPuntero;
        ctx.lineWidth = grosorPuntero;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+1,pos.y+1);
        ctx.closePath();
        ctx.stroke();
    }
}
// --------------------- CUANDO SE MUEVE EL MOUSE -------------------------- 
function movimientoMouse(evento){
    if(estadoClick){
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

        } else if(creandoCirculo){
            // limpiamos constantemente el canvas Auxiliar en cada movimiento
            // y dibujamos la digura en la ultima posicion de cada movimiento
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);


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
            ctx.fill();
            ctx.stroke();
            // Reestablecemos
            pos.x = evento.layerX;
            pos.y = evento.layerY;
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
            ctx.fillStyle = colorPuntero;
            ctx.fillRect(pos.x, pos.y, widthAux, heightAux);
        }
        else {
            ctx.strokeRect(pos.x, pos.y, widthAux, heightAux);
        }
    }
    else if(creandoCirculo){
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
        // Aqui dibujamos el circulo en el canvas principal con los datos obtenidos con el canvasAuxiliar

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
    creandoCirculo = false;
    creandoRectangulo = false;
    if(existeCanvasAuxiliar){
        eliminarCanvasAuxiliar();
    }
}

function crearRectangulo(){
    creandoCirculo = false;
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
}

function rectanguloSinRelleno(){
    conRelleno = false;
    crearRectangulo();
}

function crearCirculo(){
    creandoRectangulo = false;
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

