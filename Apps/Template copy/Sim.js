//////////////////Find Canvas////////////////////////////////////
var canvas = document.getElementById('canvas_integral')
var ctx = canvas.getContext('2d');



//////////////////Init Geometry Options////////////////////////////////////

//Get Canvas Size
var c_w = canvas.width//get canvas size
var c_h = canvas.height
var c_c = [c_w * 0.5, c_h * 0.5]
var scale_factor= Math.min(1,c_w/650)


//font


//ellipse
var ellipse_size = [0.2 * c_w, 0.40 * c_h]

//wire
var wire_slope = 0.3 * c_h / c_w;
var wire_y0 = c_c[1] + 0.15 * c_h
function wirey(x) {
  return wire_y0 - wire_slope * x
}
var wire_pos = [0, c_c[1], c_w, c_c[1]]

//r_vector parameters
var r0 = [c_c[0], c_c[1] - ellipse_size[1]]
var theta_0 = -0.5 * Math.PI //Start facing down
function rt() {
  return [abs_time(200) % c_w, wire_pos[1]]
}

//velocity
var seg_len = 2 * Math.PI / 3
var b_size = Math.abs(0.5 * (vel / 150))

var electron_size = 3;
var wire_width = 10;




function resize_all() {
  canvas.width = canvas.parentElement.clientWidth - 40
  hgap = 700 - document.getElementById('summary-holder').scrollHeight - document.getElementById('tool-holder').scrollHeight
  canvas.height = hgap
 
  /////////////Update Geometry/////////////////////
  //Get Canvas Size
  c_w = canvas.width
  c_h = canvas.height
  c_c = [c_w * 0.5, c_h * 0.5]
  scale_factor= Math.min(1,c_w/650) //ideal width is 650

  //ellipse
  ellipse_size = [0.3 * c_w, 0.35 * c_h]

  //wire
  wire_slope = 0.3 * c_h / c_w;
  wire_y0 = c_c[1] + 0.15 * c_h

  wire_pos = [0, c_c[1], c_w, c_c[1]]

  //r_vector parameters
  r0 = [c_c[0], c_c[1] - ellipse_size[1]]


  //velocity
  seg_len = 2 * Math.PI / 3

  //
  electron_size = 3* scale_factor;
  wire_width = 10* scale_factor;

  //fonts 
  ctx.lineCap = "round";
  ctx.font = Math.max(14,20*scale_factor)+'px sans-serif';
}
resize_all()
window.addEventListener('resize', resize_all);


/// Initial Values /////////////////////////////
var vel = 25
var v_target = 50.0
var angle_previous = 0
var angle_now = 0;
var x_previous = 0
var x_now = 0
var mu0 = Math.PI * 4 * (10 ** (-7))


function init() {
  
  window.requestAnimationFrame(draw);
}


////////////////////Canvas Variables//////////////////////////////////


///////////////////Format Options/////////////////////////////////////
var color_wire = 'rgba(190,190, 190, 1)';
var color_rvec = 'rgba(100, 0, 0, 1)';
var color_ellipse = 'rgba(207, 149, 149, 1)';
var color_electron = 'rgba(0, 153, 255, 0.8)';



//////////////////Time////////////////////////////////////////////////

//Real time
var time = new Date();
var t0 = new Date().valueOf()
var t_update = 0.0001 * (new Date().valueOf() - t0)
var t_now = 0.0001 * (new Date().valueOf() - t0)
var t_ease = 3.0
var dt = 0.05

function abs_time(speed) {
  return 0.0001 * speed * (time.valueOf() - t0)
  //return speed*((1 / 6) * time.getSeconds() +(1/6000)* time.getMilliseconds())
}

var t = abs_time(5)





//////////////////Update Functions////////////////////////////////////

function update_vel() {
  if (vel < v_target) {
    vel = vel + Math.min(Math.abs((t_now - t_update) / t_ease), 1) * Math.abs(v_target - vel)
  } else {
    vel = vel - Math.min(Math.abs((t_now - t_update) / t_ease), 1) * Math.abs(vel - v_target)
  }
}

function velchange() {
  current_slider = document.getElementById('current')
  current_out = document.getElementById('currentval')
  current_out.innerHTML = (current_slider.value / 100).toFixed(2)
  v_target = current_slider.value;
  t_update = 0.0001 * (new Date().valueOf() - t0);
  t_ease = 3 * Math.abs((v_target - vel) / 100.0)
}


/////////////////////////////////////////////////////////////


// Arrow drawing function
function canvas_arrow(context, fromx, fromy, tox, toy, headl) {
  //var headlen = 10; // length of head in pixels
  var headlen = 5//Math.floor(headl)
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


///////////////////////////Draw Loop////////////////////////////////////////////////////

function draw() {

  //Clear draw area
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, c_w, c_h); // clear canvas

  //Update Time
  t_now = 0.0001 * (new Date().valueOf() - t0)
  x_now = x_previous - vel * dt / 2.5//*10
  x_previous = x_now


  ///Bottom layer wire/////////////////////////////////////////////////////////////////////
  ctx.beginPath();
  ctx.lineWidth = wire_width

  ctx.strokeStyle = color_wire;
  ctx.fillStyle = color_electron;

  ctx.moveTo(c_c[0], c_c[1])
  ctx.lineTo(c_w, c_c[1])

  ctx.stroke();
  for (i = 0; i < 50; i++) {
    ctx.arc(x_now % (0.5 * c_c[0]) + (i - 25) * 0.04 * c_c[0] + 1.5 * c_c[0], c_c[1], electron_size, 0, 2 * Math.PI, false);
  }
  ctx.fill();








  ///Draw R ///////////////////////////////////////////////////////////////////////////

  ctx.lineWidth = 3.0*scale_factor
  ctx.strokeStyle = 'rgba(100,100, 100, 1)';;
  ctx.fillStyle = 'rgba(110,110, 110, 1)';
  ctx.setLineDash([10, 5])


  ctx.beginPath();
  ctx.lineWidth = 3.0
  ctx.setLineDash([5, 5])
  ctx.moveTo(c_c[0], c_c[1] - ellipse_size[1] + 5);
  ctx.lineTo(c_c[0], c_c[1]);
  ctx.stroke();
  ctx.setLineDash([])



  ///Arrow Ellipse/////////////////////////////////////////////////////////////////////

  ctx.strokeStyle = 'rgba(207, 149, 149, 0.3)';
  ctx.save()
  ctx.lineWidth = 1.1 * wire_width;
  ctx.translate(0.25 * c_w, 0)
  ctx.scale(0.5, 1)

  ctx.beginPath();
  ctx.arc(c_c[0], c_c[1], ellipse_size[1], 0, 2 * Math.PI);
  ctx.stroke();


  ctx.strokeStyle = color_ellipse;
  ctx.fillStyle = color_ellipse;

  angle_now = (dt * vel / 100 + angle_previous) % (2 * Math.PI);
  angle_previous = angle_now
  b_size = Math.abs(0.5 * (vel / 150))

  for (i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(c_c[0], c_c[1], ellipse_size[1], (i - b_size) * seg_len + angle_now, (i + b_size) * seg_len + angle_now);
    ctx.stroke();

  }



  for (i = 0; i < 3; i++) {
    ctx.beginPath();
    canvas_arrowhead_rot(ctx, c_c[0] + ellipse_size[1] * Math.cos(angle_now + (i + Math.sign(vel) * b_size) * seg_len), c_c[1] + ellipse_size[1] * Math.sin(angle_now + (i + Math.sign(vel) * b_size) * seg_len), -0.5 *scale_factor* (vel), angle_now + (i - b_size) * seg_len)

  }
  ctx.restore()
  ctx.fillStyle = color_ellipse;

  //Add Label
  ctx.textAlign = 'left';
  ctx.beginPath();
  labeled_point(ctx, c_c[0] + 0.5 * ellipse_size[0], c_c[1] - 20, 5, 5, 0, 'B = ' + (10000 * vel * mu0 / (2 * Math.PI * 0.01)).toPrecision(2) + ' \u03BCT')
  ctx.stroke();




  ///Top layer wire/////////////////////////////////////////////////////////////////////

  ctx.strokeStyle = color_wire;
  ctx.fillStyle = color_electron;
  //Path of wire
  ctx.beginPath();
  ctx.lineWidth = wire_width;
  ctx.moveTo(0, c_c[1])
  ctx.lineTo(c_c[0], c_c[1])
  ctx.stroke();

  ctx.beginPath();
  for (i = 0; i < 51; i++) {//Draw Multiple Arrows

    ctx.arc(x_now % (0.5 * c_c[0]) + (i - 25) * 0.04 * c_c[0] + 0.5 * c_c[0], c_c[1], electron_size, 0, 2 * Math.PI, false);

    //canvas_arrowhead(ctx,((x_now+(i+1)*0.5*c_c[0])%c_c[0])+0.5*c_c[0]*i, c_c[1], 0.25*(vel))
  }
  ctx.closePath();
  ctx.fill()



  //Add Label
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(110,110, 110, 1)';
  ctx.beginPath();
  labelcenter= c_w/2;
  labelpad=3*ctx.lineWidth

  
  labeled_point(ctx, labelcenter, 2*labelpad +  c_c[1], 5, 5, 0, 'I = ' + (vel / 100).toFixed(2) + ' A')
  ctx.moveTo( labelcenter +0.0003 * c_w * vel, labelpad+ c_c[1])
  ctx.lineTo( labelcenter -0.0003 * c_w * vel, labelpad+ c_c[1])
  canvas_arrowhead(ctx, labelcenter + 0.0003 * c_w * vel, labelpad+ c_c[1], 0.00005 *c_w* (vel))

  ctx.stroke();

  if (vel != v_target) {
    update_vel()
  }

  window.requestAnimationFrame(draw);
}

init();
