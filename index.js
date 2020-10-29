var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot,
    currentCent=0,
    currentMet=0,
    totalCent=0,
    totalMet=0;

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();

    let distance_px = lineDistance(dragStartLocation, position);
    let distance_cm = 0.02645833 * distance_px;
    displayMeasures(distance_cm);
}

function displayMeasures (cm_values){
  scaleElm = document.getElementById("defaultScale");
  cm_Elm = document.getElementById("centimeters");
  m_Elm = document.getElementById("meters");

  meters = (cm_values / (1/scaleElm.value)) / 100
  
  currentCent = cm_values;
  currentMet = meters;

  cm_Elm.value = cm_values + currentCent;
  m_Elm.value = meters + currentMet;
}

function lineDistance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}


function draw(position) {
    drawLine(position);
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

function drag(event) {
    var position;
    if (dragging === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position);
    }
}

function dragStop(event) {
    dragging = false;
    restoreSnapshot();
    var position = getCanvasCoordinates(event);
    draw(position);
    let distance_px = lineDistance(dragStartLocation, position);
    currentCent = 0.02645833 * distance_px;
    let scaleElm = document.getElementById("defaultScale");
    currentMet = currentCent / (1 / scaleElm.value) / 100;
    
}

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function eraseCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    var fillColor = document.getElementById("fillColor"),
        clearCanvas = document.getElementById("clearCanvas");

    context.strokeStyle = strokeColor.value;
    context.fillStyle = fillColor.value;
    context.lineWidth = 3;
    // var file = new Image();
    // file.src = "image.JPG";
    // file.width = canvas.width
    // file.height = canvas.height
    // context.drawImage(file, 0, 0, file.width, file.height);

    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    clearCanvas.addEventListener("click", eraseCanvas, false);
}

window.addEventListener('load', init, false);