// -------------------------------------------------------------------------
//                                CANVAS
// -------------------------------------------------------------------------

// Paper: contenedor de todos los canvas
const paper = document.getElementById('recuadro');

// Canvas Principal: donde se va a dibujar
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');

// Canvas Auxiliar: para realizar las animaciones y otros usos de apoyo
const canvasAuxiliar = document.createElement('canvas');
canvasAuxiliar.id = 'canvasAuxiliar';
canvasAuxiliar.width = paper.offsetWidth;
canvasAuxiliar.height = paper.offsetHeight;
// Agregamos el canvas auxiliar en el HTML para hacerlo visible en la página
document.getElementById('recuadro').appendChild(canvasAuxiliar);

const canvasAux = document.getElementById('canvasAuxiliar');
const ctxAux = canvasAux.getContext('2d');

// Ventana Alerta y sus dos botones de Si y No
const ventanaAlerta = document.createElement('div');
const botonSi = document.createElement('button');
const botonNo = document.createElement('button');

ventanaAlerta.id = 'ventanaAlerta';
ventanaAlerta.innerHTML += '¿Quieres limpiar todo el lienzo?<br><br>';
botonSi.id = 'btnSi';
botonSi.innerHTML += 'Si';
botonNo.id = 'btnNo';
botonNo.innerHTML += 'No';

const mensajeCopiado = document.createElement('div');
mensajeCopiado.id = 'mensajeCopiado';
mensajeCopiado.innerHTML += '¡Copiado!';

// --------------------------------------------------------------------------------
//                                   INPUTS
// --------------------------------------------------------------------------------
const botonPincel = document.getElementById('botonPincel');
botonPincel.addEventListener("click", dibujarConPincel, false);

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

const botonRellenar = document.getElementById('botonRellenar');
botonRellenar.addEventListener("click", rellenar, false);

const botonSelector = document.getElementById('botonSelector');
botonSelector.addEventListener("click", seleccionarColor, false);

const botonLinea = document.getElementById('botonLinea');
botonLinea.addEventListener("click", crearLinea, false);
// ----------------------------------------------------------------------------------
const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", preguntarLimpiarCanvas, false);

const botonGuardar = document.getElementById('botonGuardar');
botonGuardar.addEventListener("click", guardarLienzo, false);

const botonCopiar = document.getElementById('botonCopiar');
botonCopiar.addEventListener("click", copiarCanvas, false);
// -----------------------------------------------------------------------------------
const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("input", function(){cambioColor(colorPunteroInput.value);}, false);
colorPunteroInput.value = "#000000";

const colorButton1 = document.getElementById('color-button-1');
colorButton1.addEventListener("click", function(){cambioColor("#000000");}, false);
const colorButton2 = document.getElementById('color-button-2');
colorButton2.addEventListener("click", function(){cambioColor("#ED1C24");}, false);
const colorButton3 = document.getElementById('color-button-3');
colorButton3.addEventListener("click", function(){cambioColor("#FFC90E");}, false);
const colorButton4 = document.getElementById('color-button-4');
colorButton4.addEventListener("click", function(){cambioColor("#22B14C");}, false);
const colorButton5 = document.getElementById('color-button-5');
colorButton5.addEventListener("click", function(){cambioColor("#3F48CC");}, false);
const colorButton6 = document.getElementById('color-button-6');
colorButton6.addEventListener("click", function(){cambioColor("#FFFFFF");}, false);
const colorButton7 = document.getElementById('color-button-7');
colorButton7.addEventListener("click", function(){cambioColor("#FF7F27");}, false);
const colorButton8 = document.getElementById('color-button-8');
colorButton8.addEventListener("click", function(){cambioColor("#FFF200");}, false);
const colorButton9 = document.getElementById('color-button-9');
colorButton9.addEventListener("click", function(){cambioColor("#B5E61D");}, false);
const colorButton10 = document.getElementById('color-button-10');
colorButton10.addEventListener("click", function(){cambioColor("#00A2E8");}, false);

const slider = document.getElementById('rangoGrosor');
const valorGrosor = document.getElementById('valorGrosor');

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("input", cambioFondo);
colorFondoInput.value = "#FFFFFF";

valorGrosor.value = slider.value;
slider.oninput = function() {
    valorGrosor.value = this.value;
    grosorPuntero = slider.value;
}

// Eventos del Mouse del Canvas Auxiliar para las animaciones y para activar las funciones principales
// Usamos el canvas auxiliar porque está por encima del canvas principal
canvasAux.addEventListener("mousedown", clickDown, false);
canvasAux.addEventListener("mouseup", clickUp, false);
canvasAux.addEventListener("mousemove", movimientoMouse, false);
canvasAux.addEventListener('mouseleave', clickUp, false);

// Eventos del Slider y el Input del Grosor para animar los cambios
slider.addEventListener("mousedown", function(){cambiandoGrosorPuntero = true;}, false);
slider.addEventListener("mousemove", verGrosorPuntero, false);
slider.addEventListener("mouseup", function(){
    cambiandoGrosorPuntero = false; ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);}, false);
valorGrosor.addEventListener("change", function(){
    slider.value = this.value; grosorPuntero = this.value; cambiandoGrosorPuntero = true; verGrosorPuntero();}, false);
valorGrosor.addEventListener("mouseleave", function(){
    cambiandoGrosorPuntero = false; ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);}, false);

// Eventos de la ventana del navegador, para cuando se presiona Shift/Máyus
window.onkeydown = window.onkeyup = function(evento){
    if(evento.keyCode == 16){
        presionandoShift = evento.type == 'keydown';
    } else if(evento.keyCode == 17){
        presionandoCtrl = evento.type == 'keydown';
    }
};

// Evento para detectar que se presiona Ctrl+Z y Ctrl+Y
document.onkeydown = function KeyPress(e) {
    if(e.keyCode == 90 && e.ctrlKey) {
        deshacer();
    } else if(e.keyCode == 89 && e.ctrlKey) {
        rehacer();
    }
};

// -------------------------------------------------------------------------
//                              VARIABLES
// -------------------------------------------------------------------------
// Tamaño del canvas
var width = paper.offsetWidth;
var height = paper.offsetHeight;
canvas.width = width;
canvas.height = height;

var estadoClick = false;   // estado si se hizo click o no
var colorPuntero = "#000000";    // Color del pincel o dibujos
var colorFondo = "#FFFFFF";      // Color de fondo
var colorSeleccion = "#1E1E1E", colorDeseleccion = "#454545";  // Colores de los botones seleccionados y deseleccionados
botonPincel.style.background = colorSeleccion;   // Seleccionamos el boton del pincel por defecto

var grosorPuntero = slider.value, cambiandoGrosorPuntero = false;
var pos = { x: 0, y: 0 };

var existeCanvasAuxiliar = false;
var widthAux = 40, heightAux = 40;
var posXRect = 0, posYRect = 0;
var mostrarAnimacion = false;

var xPos, yPos, centerX, centerY, radioX, radioY, rotacion = 0;
var creandoRectangulo = false, creandoCirculo = false, conRelleno = true;
var radio = 25;
var borrando = false;
var creandoLinea = false, rellenandoColor = false, seleccionandoColor = false;

var presionandoCtrl = false, presionandoShift = false;
var ventanaAlertaActiva = false, dibujandoLineaRecta = false, lineaRectaEnX = false;
var loopMensajeCopiado, contadorMensajeCopiado = 0;


var listaCanvas = [], posActual = -1;    // Para poder usar el Ctrl+Z y el Ctrl+Y

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
        ctx.globalCompositeOperation = "source-over";

    } else if(rellenandoColor){
        // asd

    } else if(seleccionandoColor){
        // asd

    } else if(!creandoCirculo && !creandoRectangulo && !creandoLinea){
        // Si no se está haciendo un circulo o un rectángulo, ni tampoco se está usando el borrador,
        // entonces se está usando el lápiz
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = colorPuntero;
        ctx.lineWidth = grosorPuntero;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(pos.x+0.01,pos.y+0.01);
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

    // Verificamos si se hizo click o no
    if(estadoClick){
        // ------------------- PARA LOS CUADRADOS/RECTÁNGULOS (MANTENIENDO CLICK) -------------------
        if(creandoRectangulo){
            // Obtenemos el largo y el alto del rectangulo
            widthAux = evento.layerX - pos.x;
            heightAux = evento.layerY - pos.y;
            // Si se mantiene presionando Shift/Máyus Izquierdo
            if(presionandoShift){
                if(Math.abs(widthAux) >= Math.abs(heightAux)){
                    var difW_H = Math.abs(widthAux) - Math.abs(heightAux);
                    if(heightAux < 0){
                        heightAux -= difW_H;
                    } else {
                        heightAux += difW_H;
                    }
                } else {
                    var difW_H = Math.abs(heightAux) - Math.abs(widthAux);
                    //posX = evento.layerX - (heightAux - widthAux)/2;
                    //posY = evento.layerY;
                    if(widthAux < 0){
                        widthAux -= difW_H;
                    } else {
                        widthAux += difW_H;
                    }
                }
            }
            // Dibujamos la figura en la ultima posicion que se quedó el mouse después del movimiento
            if(conRelleno){
                ctxAux.fillStyle = colorPuntero;
                ctxAux.beginPath();
                ctxAux.fillRect(pos.x, pos.y, widthAux, heightAux);
                ctxAux.closePath();
            } else {
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.beginPath();
                ctxAux.strokeRect(pos.x, pos.y, widthAux, heightAux);
                ctxAux.closePath();
            }
        // ------------------- PARA LOS CÍRCULOS/ÓVALOS (MANTENIENDO CLICK) -------------------
        } else if(creandoCirculo){
            radioX = Math.abs(evento.layerX - pos.x)/2;
            radioY = Math.abs(evento.layerY - pos.y)/2;
            // Si se mantiene presionando Shift/Máyus Izquierdo
            if(presionandoShift){
                if(radioX < radioY) {
                    radioX = radioY;
                } else {
                    radioY = radioX;
                }
            }

            if(evento.layerX < pos.x){
                centerX = pos.x - radioX;
            } else {
                centerX = pos.x + radioX;
            }

            if(evento.layerY < pos.y){
                centerY = pos.y - radioY;
            } else {
                centerY = pos.y + radioY;
            }

            // Dibujamos la figura en la ultima posicion de cada movimiento
            if(conRelleno){
                ctxAux.beginPath();
                for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
                    xPos = centerX - (radioY * Math.sin(i)) * Math.sin(rotacion * Math.PI) + (radioX * Math.cos(i)) * Math.cos(rotacion * Math.PI);
                    yPos = centerY + (radioX * Math.cos(i)) * Math.sin(rotacion * Math.PI) - (radioY * Math.sin(i)) * Math.cos(rotacion * Math.PI);
                    if (i == 0) {
                        ctxAux.moveTo(xPos, yPos);
                    } else {
                        ctxAux.lineTo(xPos, yPos);
                    }
                }
                ctxAux.fillStyle = colorPuntero;
                ctxAux.fill();
                ctxAux.closePath();
            } else {
                ctxAux.beginPath();
                for (var i = 0 * Math.PI; i < 2.1 * Math.PI; i += 0.01 ) {
                    xPos = centerX - (radioY * Math.sin(i)) * Math.sin(rotacion * Math.PI) + (radioX * Math.cos(i)) * Math.cos(rotacion * Math.PI);
                    yPos = centerY + (radioX * Math.cos(i)) * Math.sin(rotacion * Math.PI) - (radioY * Math.sin(i)) * Math.cos(rotacion * Math.PI);

                    if (i == 0) {
                        ctxAux.moveTo(xPos, yPos);
                    } else {
                        ctxAux.lineTo(xPos, yPos);
                    }
                }
                ctxAux.lineWidth = grosorPuntero;
                ctxAux.strokeStyle = colorPuntero;
                ctxAux.lineJoin = 'round';
                ctxAux.stroke();
                ctxAux.closePath();
            }
        // ------------------- PARA LAS LÍNEAS (MANTENIENDO CLICK) -------------------
        } else if (creandoLinea){
            ctxAux.globalCompositeOperation = "source-over";
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineWidth = grosorPuntero;
            ctxAux.lineJoin = "round";
            ctxAux.beginPath();
            ctxAux.moveTo(pos.x,pos.y);
            ctxAux.lineTo(evento.layerX,evento.layerY);
            ctxAux.closePath();
            ctxAux.stroke();
        } else {
            // ----------------------- PARA EL BORRADOR ------------------------
            if(borrando){
                if(presionandoShift){
                    ctx.strokeStyle = colorPuntero;
                    ctx.lineWidth = grosorPuntero;
                    ctx.globalCompositeOperation = "destination-out";
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
                        ctx.globalCompositeOperation = "source-over";
                        // Reestablecemos
                        pos.x = evento.layerX;
                    } else {
                        ctx.moveTo(pos.x,pos.y);
                        ctx.lineTo(pos.x, evento.layerY);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.globalCompositeOperation = "source-over";
                        // Reestablecemos
                        pos.y = evento.layerY;
                    }
                } else {
                    ctx.lineWidth = grosorPuntero;
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.beginPath();
                    ctx.moveTo(pos.x,pos.y);
                    ctx.lineTo(evento.layerX, evento.layerY);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.globalCompositeOperation = "source-over";
                    // Reestablecemos
                    pos.x = evento.layerX;
                    pos.y = evento.layerY;
                }
            } else {
                // ------------------------ PARA EL PINCEL ------------------------
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
    } else {
        // Mostramos como se vería el puntero cuando no se está clickeando, como animación en el canvas auxiliar
        if(creandoRectangulo && mostrarAnimacion){
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
                ctxAux.strokeRect(posXRect, posYRect, widthAux, heightAux);
                ctxAux.closePath();
            }
        } else if(creandoCirculo && mostrarAnimacion){
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
        } else if (!conRelleno && !rellenandoColor && !seleccionandoColor){
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
function clickUp(evento){
    // Desactivamos el estado de linea recta del shift, si no se desactiva se dibujará solo en Y
    dibujandoLineaRecta = false;
    // Leemos si se hizo click
    if(estadoClick){
        // Limpiamos el canvasAuxiliar
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
        // Verifica si se esta creando alguna figura (Rectangulo o Circulo, con relleno o sin relleno)
        if(creandoRectangulo){
            //posXRect = evento.layerX - widthAux/2;
            //posYRect = evento.layerY - heightAux/2;
            // Aqui dibujamos el rectangulo en el canvas principal con los datos obtenidos con el canvasAuxiliar
            if(conRelleno){
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = colorPuntero;
                ctx.beginPath();
                ctx.fillRect(pos.x, pos.y, widthAux, heightAux);
                ctx.closePath();
            }
            else {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = colorPuntero;
                ctx.lineWidth = grosorPuntero;
                ctx.lineJoin = "round";
                ctx.beginPath();
                ctx.strokeRect(pos.x, pos.y, widthAux, heightAux);
                ctx.closePath();
            }
        }
        else if(creandoCirculo){
            // Aqui dibujamos el circulo en el canvas principal con los datos obtenidos con el canvasAuxiliar
            if(conRelleno){
                ctx.globalCompositeOperation = "source-over";
                ctx.fillStyle = colorPuntero;
                ctx.beginPath();
                for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
                    xPos = centerX - (radioY * Math.sin(i)) * Math.sin(rotacion * Math.PI) + (radioX * Math.cos(i)) * Math.cos(rotacion * Math.PI);
                    yPos = centerY + (radioX * Math.cos(i)) * Math.sin(rotacion * Math.PI) - (radioY * Math.sin(i)) * Math.cos(rotacion * Math.PI);
                    if (i == 0) {
                        ctx.moveTo(xPos, yPos);
                    } else {
                        ctx.lineTo(xPos, yPos);
                    }
                }
                ctx.fillStyle = colorPuntero;
                ctx.fill();
                ctx.closePath();
            } else {
                ctx.beginPath();
                for (var i = 0 * Math.PI; i < 2.1 * Math.PI; i += 0.01 ) {
                    xPos = centerX - (radioY * Math.sin(i)) * Math.sin(rotacion * Math.PI) + (radioX * Math.cos(i)) * Math.cos(rotacion * Math.PI);
                    yPos = centerY + (radioX * Math.cos(i)) * Math.sin(rotacion * Math.PI) - (radioY * Math.sin(i)) * Math.cos(rotacion * Math.PI);

                    if (i == 0) {
                        ctx.moveTo(xPos, yPos);
                    } else {
                        ctx.lineTo(xPos, yPos);
                    }
                }
                ctx.lineWidth = grosorPuntero;
                ctx.strokeStyle = colorPuntero;
                ctx.lineJoin = 'round';
                ctx.stroke();
                ctx.closePath();
            }
        } else if(creandoLinea){
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = colorPuntero;
            ctx.lineWidth = grosorPuntero;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(pos.x,pos.y);
            ctx.lineTo(evento.layerX,evento.layerY);
            ctx.closePath();
            ctx.stroke();
        }
        guardarCambios(canvas);
    } else {
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
    }
    // Cambiamos el estado del clic a falso porque ya se levantó el click
    estadoClick = false;
}

// -------------------------------------------------------------------------
//                         FUNCIONES SECUNDARIAS
// -------------------------------------------------------------------------
// Función para guardar el lienzo en una imagen
function guardarLienzo(){
    // Creamos el canvas donde se pondrá el fondo escogido y se pegará todo lo diseñado
    const canvasFinal = document.createElement('canvas');
    const ctxF = canvasFinal.getContext('2d');
    canvasFinal.id = 'canvasFinal';
    canvasFinal.width = paper.offsetWidth;
    canvasFinal.height = paper.offsetHeight;
    ctxF.beginPath();
    ctxF.rect(0, 0, width, height);
    ctxF.fillStyle = colorFondo;
    ctxF.fill();
    ctxF.drawImage(canvas, 0, 0);
    // Creamos el link, generamos la imagen y lo guardamos.
    var link = document.createElement('a');
    link.href = canvasFinal.toDataURL("image/png").replace("image/png", "image/octet-stream");
	link.download = 'mi-dibujo.png';
    link.click();
}

// Función para copiar el canvas al portapapeles
function copiarCanvas(){
    // Creamos el canvas donde se pondrá el fondo escogido y se pegará todo lo diseñado
    const canvasFinal = document.createElement('canvas');
    const ctxF = canvasFinal.getContext('2d');
    canvasFinal.id = 'canvasFinal';
    canvasFinal.width = paper.offsetWidth;
    canvasFinal.height = paper.offsetHeight;
    ctxF.beginPath();
    ctxF.rect(0, 0, width, height);
    ctxF.fillStyle = colorFondo;
    ctxF.fill();
    ctxF.drawImage(canvas, 0, 0);
    // Copiamos el canvas final al portapapeles
    canvasFinal.toBlob(function(blob) { 
        const imagen = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([imagen]); 
    });
    // Mostrar mensaje de Copiado! y luego quitarlo
    document.getElementById('contenedor').appendChild(mensajeCopiado);
    loopMensajeCopiado = setInterval(contarMensajeCopiado, 1000);
}

// Función de reloj para mostrar y desaparecer el mensaje de ¡Copiado!
function contarMensajeCopiado(){
    if(contadorMensajeCopiado == 1){
        mensajeCopiado.remove();
        contadorMensajeCopiado = 0;
        clearInterval(loopMensajeCopiado);
    } else {
        contadorMensajeCopiado++;
    }
    //console.log("contadorMensaje: "+contadorMensajeCopiado);
}

// Función para deshacer un cambio realizado en el canvas
function deshacer(){
    if(posActual == -1){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    } else {
        posActual--;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if(posActual != -1){
            ctx.drawImage(listaCanvas[posActual], 0, 0);
        }
        //console.log("Deshaciendo...\nPosicionActual: "+posActual+"\nLongitud Array: "+listaCanvas.length);
        //console.log(listaCanvas);
    }
}

// Función para rehacer un cambio realizado en el canvas
function rehacer(){
    if(posActual < listaCanvas.length - 1){
        posActual++;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(listaCanvas[posActual], 0, 0);
        //console.log("Rehaciendo...\nPosicionActual: "+posActual+"\nLongitud Array: "+listaCanvas.length);
        //console.log(listaCanvas);
    }
}

// Función para guardar cada cambio realizado en el canvas
function guardarCambios(canvas){
    // Detectamos si la posicion del puntero del array no es al final del propio array (que debería serlo)
    if(listaCanvas.length - 1 > posActual){
        // Si la posicion no es la final, recortamos el array borrando todos los cambios del puntero en adelante
        listaCanvas = listaCanvas.slice(0, posActual+1);
        //console.log("Recortando canvas...\nPosicionActual: "+posActual+"\nLongitud Array: "+listaCanvas.length);
        //console.log(listaCanvas);
    }
    // Guardamos el canvas en un nuevo canvas que meteremos en el array, cada canvas con un nuevo ID
    var newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas-'+listaCanvas.length;
    newCanvas.width = paper.offsetWidth;
    newCanvas.height = paper.offsetHeight;
    var ctxNew = newCanvas.getContext("2d");
    ctxNew.drawImage(canvas, 0, 0);
    listaCanvas.push(newCanvas);
    posActual++;
    //console.log("Guardando canvas...\nPosicionActual: "+posActual+"\nLongitud Array: "+listaCanvas.length);
    //console.log(listaCanvas);
}

// Función para cambiar de color el puntero
function cambioColor(color)
{
    colorPuntero = color;
    colorPunteroInput.value = color;
}

// Función para animar el cambio del grosor del Puntero en el canvas auxiliar
function verGrosorPuntero(){
    if(cambiandoGrosorPuntero){
        ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);
        if(creandoRectangulo && !conRelleno){
            var posXRectAux = canvas.width/2 - 200;
            var posYRectAux = canvas.height/2 - 100;
            ctxAux.lineWidth = slider.value;
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineJoin = 'round';
            ctxAux.beginPath();
            ctxAux.strokeRect(posXRectAux, posYRectAux, 400, 200);
            ctxAux.closePath();
        } else if(creandoCirculo && !conRelleno){
            ctxAux.lineWidth = slider.value;
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineJoin = 'round';
            ctxAux.beginPath();
            ctxAux.arc(canvas.width/2, canvas.height/2, 100, 0, 2 * Math.PI);
            ctxAux.closePath();
            ctxAux.stroke();
        } else if(creandoLinea){
            ctxAux.lineWidth = slider.value;
            ctxAux.strokeStyle = colorPuntero;
            ctxAux.lineJoin = 'round';
            ctxAux.beginPath();
            ctxAux.moveTo(canvas.width/2 - 100, canvas.height/2);
            ctxAux.lineTo(canvas.width/2 + 100,canvas.height/2);
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

// Función para cambiar de color del fondo
function cambioFondo()
{
    // Obtenemos el valor del color
    colorFondo = colorFondoInput.value;
    canvas.style.background = colorFondo;
}

// Funcion para aparecer la alerta de Limpiar Canvas/Lienzo
function preguntarLimpiarCanvas(){
    if(!ventanaAlertaActiva){
        ventanaAlertaActiva = true;
        document.getElementById('contenedor').appendChild(ventanaAlerta);
        document.getElementById('ventanaAlerta').appendChild(botonSi);
        document.getElementById('ventanaAlerta').appendChild(botonNo);

        botonSi.addEventListener('mousedown', limpiarCanvas, false);
        botonNo.addEventListener('mousedown', borrarAlerta, false);
    }
}

// Función para limpiar el canvas principal después de Aceptar
function limpiarCanvas(){
    // Cerramos la ventana
    borrarAlerta();
    // Borramos le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Guardamos el cambio realizado
    guardarCambios(canvas);
}

// Función para borrar la ventana de alerta
function borrarAlerta()
{
    ventanaAlertaActiva = false;
    ventanaAlerta.remove();
}

// Función de activar el dibujo con el pincel
function dibujarConPincel(){
    creandoCirculo = false;
    creandoRectangulo = false;
    creandoLinea = false;
    borrando = false;
    rellenandoColor = false;
    seleccionandoColor = false;
    conRelleno = false;
    deseleccionarBotones();
    botonPincel.style.background = colorSeleccion;
}

// Función de activar el borrador
function borrar(){
    borrando = true;
    creandoCirculo = false;
    creandoRectangulo = false;
    creandoLinea = false;
    rellenandoColor = false;
    seleccionandoColor = false;
    deseleccionarBotones();
    botonBorrar.style.background = colorSeleccion;

}

// Función de activar la creacion de rectángulos con o sin relleno
function crearRectangulo(relleno){
    creandoRectangulo = true;
    creandoCirculo = false;
    creandoLinea = false;
    borrando = false;
    rellenandoColor = false;
    seleccionandoColor = false;
    conRelleno = relleno;
    deseleccionarBotones();
    if(relleno){
        botonRectFill.style.background = colorSeleccion;
    } else {
        botonRectStroke.style.background = colorSeleccion;
    }
}

// Función para activar la creación de círculos/óvalos con o sin relleno
function crearCirculo(relleno){
    creandoCirculo = true;
    creandoRectangulo = false;
    creandoLinea = false;
    borrando = false;
    rellenandoColor = false;
    seleccionandoColor = false;
    conRelleno = relleno;
    deseleccionarBotones();
    if(relleno){
        botonCircleFill.style.background = colorSeleccion;
    } else {
        botonCircleStroke.style.background = colorSeleccion;
    }
}

// Función para la herramienta de relleno
function rellenar(){
    creandoCirculo = false;
    creandoRectangulo = false;
    creandoLinea = false;
    borrando = false;
    rellenandoColor = true;
    seleccionandoColor = false;
    deseleccionarBotones();
    botonRellenar.style.background = colorSeleccion;
}

// Función para la herramienta de selección de color
function seleccionarColor(){
    creandoCirculo = false;
    creandoRectangulo = false;
    creandoLinea = false;
    borrando = false;
    rellenandoColor = false;
    seleccionandoColor = true;
    deseleccionarBotones();
    botonSelector.style.background = colorSeleccion;
}

// Función para crear líneas
function crearLinea(){
    creandoCirculo = false;
    creandoRectangulo = false;
    creandoLinea = true;
    borrando = false;
    rellenandoColor = false;
    seleccionandoColor = false;
    deseleccionarBotones();
    botonLinea.style.background = colorSeleccion;
}

// Función para deseleccionar los otros botones, porque solo un botón puede estar seleccionado del grupo de botones
function deseleccionarBotones(){
    botonPincel.style.background = colorDeseleccion;
    botonRectFill.style.background = colorDeseleccion;
    botonRectStroke.style.background = colorDeseleccion;
    botonBorrar.style.background = colorDeseleccion;
    botonCircleFill.style.background = colorDeseleccion;
    botonCircleStroke.style.background = colorDeseleccion;
    botonLinea.style.background = colorDeseleccion;
    botonRellenar.style.background = colorDeseleccion;
    botonSelector.style.background = colorDeseleccion;
}