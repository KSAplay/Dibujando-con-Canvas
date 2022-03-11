// -------------------------------------------------------------------------
//                                CANVAS
// -------------------------------------------------------------------------
// Canvas y Contexto
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');

// Canvas y Contexto Auxiliar
const canvasAuxiliar = document.createElement('canvas');
canvasAuxiliar.id = 'canvasAuxiliar';
canvasAuxiliar.width = 900;
canvasAuxiliar.height = 560;
document.getElementById('recuadro').appendChild(canvasAuxiliar);

const canvasAux = document.getElementById('canvasAuxiliar');
const ctxAux = canvasAux.getContext('2d');

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
botonLimpiar.addEventListener("click", limpiarCanvas, false);

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

// -------------------------------------------------------------------------
//                              VARIABLES
// -------------------------------------------------------------------------
// Tamaño del canvas
var width = 900;
var height = 560;
canvas.width = width;
canvas.height = height;

var estadoClick = false, realizoMovimientoMouse = false;   // Variables de apoyo en el click y movimiento del mouse
var colorPuntero = "#000000";    // Color del lapiz al inicio
var colorFondo = "#FFFFFF"      // Color del fondo al inicio
var colorSeleccion = "#4E7FFF", colorDeseleccion = "#FFF";  // Colores de los botones seleccionados y deseleccionados
botonLapiz.style.background = colorSeleccion;

var grosorPuntero = slider.value, cambiandoGrosorPuntero = false;
var pos = { x: 0, y: 0 };

var existeCanvasAuxiliar = false;
var widthAux = 40, heightAux = 40;

var creandoRectangulo = false, creandoCirculo = false, conRelleno = true;
var borrando = false;
var radio = 50;

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

    // Verificamos si se hizo click o no
    if(estadoClick){
        // Almacena en la variable que existe movimiento mientras se mantiene el click
        realizoMovimientoMouse = true;

        // PARA LOS RECTANGULOS
        if(creandoRectangulo){
            // Obtenemos el largo y el alto del rectangulo
            widthAux = (pos.x - evento.layerX) * 2;
            heightAux = (pos.y - evento.layerY) * 2;
            // Dibujamos la figura en la ultima posicion que se quedó el mouse después del movimiento
            if(conRelleno){
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.fillRect(evento.layerX, evento.layerY, widthAux, heightAux);
                ctxAux.closePath();
            } else {
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.beginPath();
                ctxAux.strokeRect(evento.layerX, evento.layerY, widthAux, heightAux);
                ctxAux.closePath();
            }
        // PARA LOS CIRCULOS
        } else if(creandoCirculo){

            // Dibujamos la figura en la ultima posicion de cada movimiento
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
                //limpiarCanvas();  // Descomentar para probar  // Ejemplo de como se vería si se eliminara constantemente en el canvas principal
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
    } else {    // ARREGLAR EL DESBORDE CUANDO SE LLEGA AL LIMITE DEL CANVAS
        // Mostramos como se vería el circulo y el rectángulo
        //console.log("X: "+pos.x+" - Y: "+pos.y+" - Width: "+widthAux+" - Height: "+heightAux+" - Canvas auxiliar: "+existeCanvasAuxiliar);
        
        if(creandoRectangulo){
            if(conRelleno){
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.fillRect(evento.layerX, evento.layerY, widthAux, heightAux);
                ctxAux.closePath();
            } else {

            }
        } else if(creandoCirculo){
            if(conRelleno){

            } else {

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
    // Cambiamos el estado del clic a falso
    estadoClick = false;
    if(!realizoMovimientoMouse){
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
                //widthAux = 0;
                //heightAux = 0;
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
    } else {
        realizoMovimientoMouse = false;
    }
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

// Funcion para limpiar el canvas original
function limpiarCanvas()
{
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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