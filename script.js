// -------------------------------------------------------------------------
//                               VARIABLES
// -------------------------------------------------------------------------
// Canvas y Contexto
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');
// Canvas y Contexto Auxiliar
var canvasAuxiliar, ctxAux;

// Inputs
const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("change", cambioColor);

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("change", cambioFondo);
colorFondoInput.value = "#FFFFFF";

const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", limpiarCanvas);

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
var grosorPuntero = 50; // cambiar esto por un slider
var pos = {
    x: 0,
    y: 0
};
var posInicialAux

var creandoRectangulo = false, creandoCirculo = false;

// -------------------------------------------------------------------------
//                              FUNCIONES
// -------------------------------------------------------------------------

function movimientoMouse(evento)
{
    if(estadoClick)
    {
        if(creandoRectangulo)
        {
            // limpiamos constantemente el canvas Auxiliar en cada movimiento
            // y dibujamos la digura en la ultima posicion de cada movimiento
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);


        }
        else if(creandoCirculo)
        {
            // limpiamos constantemente el canvas Auxiliar en cada movimiento
            // y dibujamos la digura en la ultima posicion de cada movimiento
            ctxAux.clearRect(0, 0, ctxAux.canvas.width, ctxAux.canvas.height);


        }
        else
        {
            //limpiarCanvas();  // Ejemplo de como se vería si se eliminara constantemente en el canvias principal
            
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

function clickDown(evento)
{
    estadoClick = true;
    pos.x = evento.layerX;
    pos.y = evento.layerY;

    if(creandoRectangulo)
    {
        // Aqui crea el rectangulo inicial con el ctxAux
    }
    else if(creandoCirculo)
    {
        // aqui crea el circulo inicial con el ctxAux
    }
    else
    {
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

function clickUp()
{
    estadoClick = false;

    if(creandoRectangulo){
        // Aqui dibujamos el rectangulo en el canvas principal con el ctx y con los datos obtenidos con el canvasAuxiliar


        creandoRectangulo = false;
        eliminarCanvasAuxiliar();
    }
    else if(creandoCirculo){
        // Aqui dibujamos el circulo en el canvas principal con el ctx y con los datos obtenidos con el canvasAuxiliar


        creandoCirculo = false;
        eliminarCanvasAuxiliar();
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

function crearReactangulo()
{
    añadirCanvasAuxiliar();
    canvasAux = document.getElementById('canvasAuxiliar');
    ctxAux = canvasAux.getContext('2d');
    // Eventos del Mouse del Canvas Auxiliar para las animaciones
    canvasAux.addEventListener("mousedown", clickDown, false);
    canvasAux.addEventListener("mouseup", clickUp, false);
    canvasAux.addEventListener("mousemove", movimientoMouse);
    canvasAux.addEventListener('mouseleave', clickUp, false);
}

function crearCirculo()
{
    añadirCanvasAuxiliar();
    canvasAux = document.getElementById('canvasAuxiliar');
    ctxAux = canvasAux.getContext('2d');
    // Eventos del Mouse del Canvas Auxiliar para las animaciones
    canvasAux.addEventListener("mousedown", clickDown, false);
    canvasAux.addEventListener("mouseup", clickUp, false);
    canvasAux.addEventListener("mousemove", movimientoMouse);
    canvasAux.addEventListener('mouseleave', clickUp, false);

    creandoRectan
}

function añadirCanvasAuxiliar()
{
    const canvasAuxiliar = document.createElement('canvas');
    canvasAuxiliar.id = 'canvasAuxiliar';
    canvasAuxiliar.width = width;
    canvasAuxiliar.height = height;
    document.getElementById('recuadro').appendChild(canvasAuxiliar);
}

function eliminarCanvasAuxiliar()
{
    document.getElementById('canvasAuxiliar').remove();
}

