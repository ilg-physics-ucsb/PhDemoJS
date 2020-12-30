/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////// This file contains the physics simulation ///////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



// Default Conditions //////////////////////////
var x_d = 0.2, vx_d = 0.5, y_d = 0, vy_d = 0.0 //Kinematic
var b_d = 0.2, t_d = 0.0 //External
var q_d = 1.0, m_d = 1.0// Particle

// User Conditions //////////////////////////
var x_0 = x_d, vx_0 = vx_d, y_0 = y_d, vy_0 = vy_d //Kinematic
var b_0 = b_d, t_0 = 0 //External
var q_0 = 1, m_0 = 1 // Particle
var A, w;
var b = b_d

//Time////
var t0 = new Date().valueOf()
var t_now = 0.0001 * (new Date().valueOf() - t0)
var t_in = 0, t_out = 0
var running = false


// Data ////////////////////////////////////////
var x = [], vx = [], y = [], vy = [], x_in = 0.5

// Triggers
var has_entered = false





// Equations of Motion /////////////////////////
function B_traj(t, x0, y0) {
  A = cw * Math.sqrt(vx_0 * vx_0 + vy_0 * vy_0) * 1.0
  w = (-q_0 / m_0) * b_0
  x_now = (A / w) * Math.sin(w * t)
  y_now = (A / w) * (Math.cos(w * t) - 1)
  vx_now = A * Math.cos(w * t) / cw
  vy_now = A * Math.sin(w * t)
  return [x_now, y_now, vx_now, vy_now]
}


// Initialize the Simulation ///////////////////
function startUpdate() {
  if (running==false) {
    running = true;
    initialize()
    t0 = new Date().valueOf()
    t_now = 0.001 * (new Date().valueOf() - t0)
    draw();
  }
}
function initialize() {
  t_in = 0
  t_out = 0
  x_0 = x_d
  x_in = 0.5 * cw
  b_0 = Number(Bf.value / 100)
  vx_0 = Number(vx_start.value / 100)
  A = Math.sqrt(vx_0 * vx_0 + vy_0 * vy_0) * 1.0
  w = (-q_0 / m_0) * b_0 * 1.0
  x = [x_0 * cw]
  y = [y_0 * ch]
  vx = [vx_0]
  vy = [vy_0]
  has_entered = false
}
function resetAll() {
  x_0 = x_d, vx_0 = vx_d, y_0 = y_d, vy_0 = vy_d //Kinematic
  b_0 = b_d, t_0 = 0 //External
  q_0 = 1, m_0 = 1 // Particle
}



////////////// Canvas Variables /////////////////
SV = document.getElementById('side-view')
SVC = SV.getContext("2d")

////////////// Geometry /////////////////
var cw
var ch
var scale_factor
var padding = 10
var sv_h = 0.2
var offset
var tp_h

function resize_all() {
  SV.width = SV.parentElement.clientWidth - 40
  hgap = 650 - document.getElementById('summary-holder').scrollHeight - document.getElementById('tool-holder').scrollHeight
  SV.height = hgap
  cw = SV.width
  ch = SV.height
  scale_factor = SVC.width / 700


  draw_scene()

}

resize_all()
window.addEventListener('resize', resize_all);

function draw_scene() {

  SVC.fillStyle = 'rgb(190, 190, 190)';
  SVC.strokeStyle = 'black';
  //sideview
  SVC.fillRect(padding, padding, cw - 2 * padding, sv_h * ch);
  SVC.strokeRect(padding, padding, cw - 2 * padding, sv_h * ch);
  //field area
  SVC.fillRect(cw / 2, padding + 0.5 * sv_h * ch, cw / 2 - padding, 0.01 * sv_h * ch);
  SVC.strokeRect(cw / 2, padding + 0.5 * sv_h * ch, cw / 2 - padding, 0.01 * sv_h * ch);
  SVC.fillStyle = 'black';
  //gun
  SVC.fillRect(padding +0.05*cw,  0.5 * sv_h * ch, 0.1*cw, 20);
  SVC.fillRect(padding +0.05*cw+0.1*cw,  0.5 * sv_h * ch +5,10, 10);
 

  //gun stand
  SVC.moveTo(padding +0.1*cw,  0.5 * sv_h * ch+20)
  SVC.lineTo(padding +0.05*cw,  1 * sv_h * ch)
  SVC.moveTo(padding +0.1*cw,  0.5 * sv_h * ch+20)
  SVC.lineTo(padding +0.15*cw,  1 * sv_h * ch)
  SVC.stroke()

  SVC.beginPath()

  for (i = 0; i < 10; i++) {
    SVC.moveTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch)
    SVC.lineTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch - (0.5 * sv_h * ch) * b)

    SVC.moveTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch - (0.5 * sv_h * ch) * b)
    SVC.lineTo(cw / 2 * (1 + i / 11 + 1 / 22) + 5, padding + 0.5 * sv_h * ch - (0.5 * sv_h * ch -15) * b)
    SVC.moveTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch - (0.5 * sv_h * ch) * b)
    SVC.lineTo(cw / 2 * (1 + i / 11 + 1 / 22) - 5, padding + 0.5 * sv_h * ch - (0.5 * sv_h * ch -15) * b )

    SVC.moveTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch)
    SVC.lineTo(cw / 2 * (1 + i / 11 + 1 / 22), padding + 0.5 * sv_h * ch + (0.5 * sv_h * ch) * b)
  }
  SVC.stroke()

  SVC.fillStyle = 'rgb(190, 190, 190)';
  //top view
  tv_h = ch - 3 * padding - sv_h * ch
  SVC.fillRect(padding, 2 * padding + sv_h * ch, cw - 2*padding, tv_h);
  SVC.strokeRect(padding, 2 * padding + sv_h * ch, cw - 2*padding, tv_h);
  SVC.fillStyle='rgb(100,100,100)'
  SVC.fillRect(cw/2, 2 * padding + sv_h * ch, cw/2 - padding, tv_h);
  SVC.strokeRect(cw/2, 2 * padding + sv_h * ch, cw/2 - padding, tv_h);
  offset = 2 * padding + sv_h * ch + 0.5 * tv_h
  SVC.fillStyle = 'black';
  SVC.fillRect(padding +0.05*cw, sv_h*ch+padding +0.5*tv_h, 0.1*cw, 20);
  SVC.fillRect(padding +0.05*cw+0.1*cw, sv_h*ch+padding +0.5*tv_h +5,10, 10);


}


function draw() {
  //Clear draw area
  SVC.globalCompositeOperation = 'source-over';
  SVC.clearRect(0, 0, cw, ch); // clear canvas
  running = true;

  draw_scene()


  //Update Vars
  t_now = 0.001 * (new Date().valueOf() - t0)



  if (x[x.length - 1] < 0.5 * cw || b_0 == 0) {
    vx.push(vx[vx.length - 1])
    vy.push(vy[vy.length - 1])
    x.push(((t_now - t_out) * vx[vx.length - 1] + x_0) * cw)
    y.push(y[y.length - 1])
    t_in = t_now
    x_in = x[x.length - 1]
  } else {
    has_entered = true
    x.push(x_in + B_traj(t_now - t_in, -0.5, 0)[0])
    y.push(ch * y_0 + B_traj(t_now - t_in, -0.5, 0)[1])
    vx.push(B_traj(t_now - t_in, -0.5, 0)[2])
    vy.push(B_traj(t_now - t_in, -0.5, 0)[3])
    t_out = t_now
    x_0 = x[x.length - 1] / cw
  }

  SVC.strokeStyle = 'blue';
  SVC.fillStyle = 'blue';

 



  ////////////////////Side View
  SVC.beginPath();
  SVC.moveTo(x[0], padding + 0.5 * sv_h * ch)
  for (i = 1; i < x.length; i++) {
    SVC.lineTo(x[i], padding + 0.5 * sv_h * ch)
  }
  
  SVC.arc(x[x.length-1], padding + 0.5 * sv_h * ch, 3, 0, 2*Math.PI );
  SVC.stroke()
  SVC.fill()

  ///////////////////Top View
  SVC.beginPath();
  SVC.moveTo(x[0], y[0] + offset)
  for (i = 1; i < x.length; i++) {
    SVC.lineTo(x[i], offset + y[i])
  }
  SVC.stroke()
  SVC.beginPath();
  SVC.arc(x[x.length-1], offset + y[y.length-1], 3, 0, 2*Math.PI );
  SVC.stroke()
  SVC.fill()

  if (x[x.length - 1] < cw - padding - 2 && x[x.length - 1] > padding + 2 && y[y.length - 1] < tv_h / 2 - 2 && y[y.length - 1] > -tv_h / 2 + 2) {
    requestAnimationFrame(draw)
  } else {
    running = false
  }

}












//////////////////////////////////Buttons////////////////////////////
var vx_start = document.getElementById("sl2");
var vx_out = document.getElementById("slo2");
vx_out.innerHTML = Number(sl2.value); // Display the default slider value

var Bf = document.getElementById("sl3");
var Bf_out = document.getElementById("slo3");
Bf_out.innerHTML = Number(sl3.value / 100); // Display the default slider value


vx_start.oninput = function () {
  vx_out.innerHTML = Number(vx_start.value);

}

Bf.oninput = function () {
  Bf_out.innerHTML = Number(Bf.value / 100);
  
  if(running==false){
    b = Bf.value / 100
  draw_scene()
  }
}