// -------------------------------------------------------------------------
//                               VARIABLES
// -------------------------------------------------------------------------
// Canvas y Contexto
const canvas = document.getElementById('dibujo');
const ctx = canvas.getContext('2d');

// Inputs
const colorPunteroInput = document.getElementById('colorPuntero');
colorPunteroInput.addEventListener("change", cambioColor);

const colorFondoInput = document.getElementById('colorFondo');
colorFondoInput.addEventListener("change", cambioFondo);
colorFondoInput.value = "#FFFFFF";

const botonLimpiar = document.getElementById('botonLimpiar');
botonLimpiar.addEventListener("click", limpiarCanvas);

// Eventos de Mouse en Canvas
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
var pos = {
    x: 0,
    y: 0
};

var borradorActivo = false;
var grosorPuntero = 1;

// -------------------------------------------------------------------------
//                              FUNCIONES
// -------------------------------------------------------------------------

function movimientoMouse(evento)
{
    if(estadoClick)
    {
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

function clickDown(evento)
{
    estadoClick = true;

    if(borradorActivo)
    {

    }
    else
    {
        pos.x = evento.layerX;
        pos.y = evento.layerY;

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