//////////////////Find Canvas////////////////////////////////////
var canvas = document.getElementById('main-canvas')
var ctx = canvas.getContext('2d');



//////////////////Init Geometry Options////////////////////////////////////

//Get Canvas Size
var c_w = canvas.width//get canvas size
var c_h = canvas.height
var c_c = [c_w * 0.5, c_h * 0.5]
var scale_factor = Math.min(1, c_w / 650)

//Ideal Height in px
idealheight = 900;

//Function to deal with Window Resizing
function resize_all() {
  canvas.width = canvas.parentElement.clientWidth - 40
  console.log('Client width: ', canvas.parentElement.clientWidth)
  console.log('canvas width: ', canvas.width)
  hgap = idealheight - document.getElementById('summary-holder').scrollHeight - document.getElementById('tool-holder').scrollHeight
  canvas.height = hgap

  console.log('Client width: ', canvas.parentElement.clientWidth)
  console.log('canvas height: ',hgap)


 c_w = canvas.width//get canvas size
 c_h = canvas.height
 c_c = [c_w * 0.5, c_h * 0.5]
 scale_factor = Math.min(1, c_w / 650)
}

resize_all()

//Call function automatically on window events
function resize_on_event() {
  console.log('resized')
  resize_all()
  init()
}

//Attach
window.addEventListener('resize', resize_on_event);



function init() {
  reset()

}


////////////////////Canvas Variables//////////////////////////////////
/////////////Update Geometry/////////////////////
//Get Canvas Size
c_w = canvas.width
c_h = canvas.height
c_c = [c_w * 0.5, c_h * 0.5]
scale_factor = Math.min(1, c_w / 650) //ideal width is 650



/////////////////Simulation Initial Conditions/////////////////////////////////
var y0 = 50.0
var v0 = 0.0
var a0 = 0.0

var y = y0
var a = a0
var v = v0

const g = 9.81

var plot = [[0, y0]]



///////////////////Format Options/////////////////////////////////////
laddercolor = 'rgb(101, 67, 28)'
ballcolor = 'rgb(222, 89, 119)'
stickfig = new Image()
stickfig.src = 'https://i.imgur.com/72SFysd.png'





//////////////////Time////////////////////////////////////////////////

//Real time
var time = new Date();
var t0 = new Date().valueOf()
var t_now = t0
var dt = 0.01
stop = true



/////Interactables///
height_slider = document.getElementById('height')
velocity_slider = document.getElementById('velocity')
air_slider = document.getElementById('resistance')
height_out = document.getElementById('current-height')
velocity_out = document.getElementById('current-vel')
resistance_out = document.getElementById('current-air')

//////////////////Update Functions////////////////////////////////////

function param_change() {
  stop = true

  height_out.innerHTML = height_slider.value
  y0 = height_slider.value * 1.0
  y = y0
  velocity_out.innerHTML = velocity_slider.value
  v0 = velocity_slider.value * 1.0
  v = v0
  resistance_out.innerHTML = air_slider.value
  a0 = air_slider.value * 1.0
  reset()
}

function height_now(t) {

  v_g=v0 -g*t
  a=100*a0
  vt = g/(2*a)
  if (a0 > 0) {
    vt = 0.01 * a0
    v = -(0.7*g )*(1-Math.exp(-vt *t)) + v_g*Math.exp(-vt *t)
    ys = y + v *dt
    //ys= y0 + (1/a)*(-vt*t +v0*t +g*t)*Math.exp(-a*t) - (vt +g/a)*t
    //ys= y0 + ((v0 +0.5*g*t)*t)/(1-0.5*t*g/vt)
    return ys
  } else {
    y = y + v_g*dt
    //return y
    return y0 - 0.5 * g * t * t + v0 * t
  }

}

function reset() {
  stop = true
  //Reset all variables to slider values
  y = y0
  v = v0
  a = a0
  dt = 0.01
  t0 = new Date().valueOf()
  t_now = 0
  plot = [[0, y0]]
  window.requestAnimationFrame(draw)
}

function run() {
  reset()
  stop = false
  t0 = new Date().valueOf()
  t_now = 0
  draw()

}

/////////////////////////////////////////////////////////////


graph_bottom=10
graph_top=30


///////////////////////////Draw Loop////////////////////////////////////////////////////

function draw() {



  //Clear draw area
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, c_w, c_h); // clear canvas

 
  ctx.save()

  //Draw Grass
  ctx.beginPath();
  ctx.moveTo(0.0 * c_w, c_h)
  ctx.lineTo(c_w, c_h)
  ctx.strokeStyle = 'green'
  ctx.lineWidth = 5;
  ctx.stroke()


  ///Draw graph frame

  GW = (c_w - 40) - (0.2 * c_w + 40)
  GH = (c_h - graph_bottom) - (graph_top)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.beginPath();
  canvas_arrow(ctx, 0.2 * c_w + 40, c_h - graph_bottom, 0.2 * c_w + 40, graph_top, 10.0)
  ctx.stroke()
  ctx.beginPath();
  canvas_arrow(ctx, 0.2 * c_w + 40, c_h - graph_bottom, c_w - 40, c_h - graph_bottom, 10.0)
  ctx.stroke()

 ///Draw lines
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 1
  ctx.beginPath();
  for (i = 1; i < 12; i++) {
    ctx.moveTo(0.2 * c_w + 40 + i * GW / 12, c_h - 5)
    ctx.lineTo(0.2 * c_w + 40 + i * GW / 12, 30)
  }
  ctx.stroke()


  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 1
  ctx.beginPath();
  for (i = 1; i < 11; i++) {
    ctx.moveTo(0.2 * c_w + 40, 10 + i * GH / 10)
    ctx.lineTo(c_w - 40, 10 + i * GH / 10)
  }
  ctx.stroke()

  //Label Graph
  ctx.fillStyle= "black"
  ctx.font = "20px Arial";
  ctx.fillText("y", 0.2*c_w+36, 15)
  ctx.fillText("t", c_w-30, c_h-graph_bottom)

  ///Draw a Ladder
  ctx.beginPath();
  ctx.moveTo(0.2 * c_w, 0.0 * c_h)
  ctx.lineTo(0.2 * c_w, c_h)
  ctx.moveTo(0.2 * c_w + 20, 0.0 * c_h)
  ctx.lineTo(0.2 * c_w + 20, c_h)
  for (i = 1; i < (c_h / 15); i++) {
    ctx.moveTo(0.2 * c_w, c_h - 15 * i)
    ctx.lineTo(0.2 * c_w + 20, c_h - 15 * i)
  }
  ctx.strokeStyle = laddercolor;
  ctx.stroke()

  ctx.rect(0.2*c_w+40,c_h-8,GW-20,5)
  ctx.fillStyle="white"
  ctx.fill()



  tscale=60
  


  /////////////////Draw trackers
  //Horizonal
  ctx.beginPath();
  ctx.moveTo(0.2 * c_w + 35, (1 - y / 100) * c_h - 10)
  ctx.lineTo(0.2 * c_w + 40 + plot[plot.length - 1][0] * tscale, (1 - plot[plot.length - 1][1] / 100) * c_h - 10)
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2
  ctx.stroke()

  //Vertical
  ctx.beginPath();
  ctx.moveTo(0.2 * c_w + 40 + plot[plot.length - 1][0] * tscale, (1 - plot[plot.length - 1][1] / 100) * c_h - 10)
  ctx.lineTo(0.2 * c_w + 40 + plot[plot.length - 1][0] * tscale, c_h - 10)
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 2
  ctx.stroke()



  //////////////Graph Trajectory
  ctx.moveTo(0.2 * c_w, (1 - y / 100) * c_h)
  ctx.beginPath();
  for (i = 0; i < (plot.length-1)/2 ; i++) {
    avgpoint = [0.5*((0.2 * c_w + 40 + plot[2*i][0] * tscale)+ (0.2 * c_w + 40 + plot[2*i+1][0] * tscale)), 0.5*(((1 - plot[2*i][1] / 100) * c_h - 5)+((1 - plot[2*i+1][1] / 100) * c_h - 5))]
    ctx.lineTo(avgpoint[0],avgpoint[1])

  }
  ctx.lineTo((0.2 * c_w + 40 + plot[plot.length-1][0] * tscale), ((1 - plot[plot.length-1][1] / 100) * c_h - 5))
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = 2
  //ctx.setLineDash([10, 10])
  ctx.stroke()
  ctx.restore()

  //Tracker Points

  ctx.beginPath();
  ctx.arc(0.2 * c_w + 40 + plot[plot.length - 1][0] * tscale, (1 - y / 100) * (c_h-graph_bottom) , 5, 0, 2 * Math.PI)
  ctx.fillStyle = "pink";
  ctx.fill()



  ///Draw a Ball
  ctx.beginPath();
  ctx.arc(0.2 * c_w + 40, (1 - y / 100) * (c_h-graph_bottom) , 10, 0, 2 * Math.PI)
  ctx.fillStyle = ballcolor;
  ctx.fill()

  console.log(t_now)
  ctx.restore()

  ///Draw a person
  ctx.drawImage(stickfig, 0.2 * c_w - 5, (1 - 1.0 * y0 / 100) * c_h - 20, 40, 40)


  

  if (5000 > y && y > 1.0 && !stop) {
    //Update Time
 
    t_now = 0.01 * (new Date().valueOf() - t0)
    y =Math.max( height_now(t_now),0)
    plot.push([t_now, y])
    dt = (plot[plot.length-1][0]-plot[plot.length-2][0])
    window.requestAnimationFrame(draw);
  }
}































// Arrow drawing function
function canvas_arrow(context, fromx, fromy, tox, toy, headl) {
  //var headlen = 10; // length of head in pixels
  var headlen = Math.floor(headl)
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

//ArrowHead
function canvas_arrowhead(context, fromx, fromy, headl) {
  //var headlen = 10; // length of head in pixels
  var headlen = Math.floor(headl)
  context.moveTo(fromx - headlen, fromy - 0.6 * headlen);
  context.lineTo(fromx, fromy);
  context.lineTo(fromx - headlen, fromy + 0.6 * headlen);
  context.closePath();
  context.fill()
}

//ArrowHead
function canvas_arrowhead_rot(context, tipx, tipy, headl, angle) {
  //var headlen = 10; // length of head in pixels
  var headlen = Math.floor(headl)
  //context.moveTo(tipx - headlen, tipy-0.6*headlen);
  var angle_true = angle
  if (vel < 0) {
    angle_true = angle + (1.4) * Math.PI

  }

  context.moveTo(tipx, tipy);
  context.lineTo(tipx - headlen * Math.cos(angle_true), tipy - headlen * Math.sin(angle_true));
  context.stroke()
}



// Labeled Point Drawing function
function labeled_point(ctx, x_p, y_p, x_l, y_l, pointsize, l_text) {
  ctx.moveTo(x_p, y_p)
  if (pointsize > 0) {
    ctx.arc(x_p, y_p, pointsize, 0, 2 * Math.PI, false);
  }
  ctx.fillText(l_text, x_p + x_l, y_p + y_l)
}

stickfig.onload = function () {
  init();
}
