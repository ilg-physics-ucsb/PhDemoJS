function init() {
  window.requestAnimationFrame(draw);
}

// Arrow drawing function
function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

// Labeled Point Drawing function
function labeled_point(ctx,x_p,y_p,x_l,y_l,pointsize, l_text){
  ctx.moveTo(x_p,y_p)
  if(pointsize>0){
    ctx.arc(x_p, y_p, pointsize, 0, 2 * Math.PI, false);
  }
  ctx.fillText(l_text, x_p+x_l, y_p+y_l)
}


///////////////////////////Draw Loop

function draw() {

  ////////////////////Canvas Variables//////////////////////////////////
  var canvas_i=document.getElementById('canvas_integral')
  var ctx_i = canvas_i.getContext('2d');


  

  ///////////////////Format Options/////////////////////////////////////
  var color_wire='rgba(191, 201, 199, 1)';
  var color_rvec='rgba(100, 0, 0, 1)';
  var color_ellipse='rgba(0, 153, 255, 0.5)';
  
  ctx_i.font = '24px serif';


  //////////////////Time////////////////////////////////////////////////

  //Real time
  var time = new Date();
  function abs_time(speed){
    return 0.001*speed*(time.valueOf())
    //return speed*((1 / 6) * time.getSeconds() +(1/6000)* time.getMilliseconds())
  }

  //////////////////Geometry Options////////////////////////////////////
  //Get Canvas Size
  var c_w=canvas_i.width//get canvas size
  var c_h=canvas_i.height 
  var c_c=[c_w*0.5,c_h*0.5]


  //ellipse
  var ellipse_size=[0.2*c_w, 0.40*c_h]

  //wire
  var wire_slope= 0.3*c_h/c_w;
  var wire_y0=c_c[1]+0.15*c_h
  function wirey(x){
    return wire_y0 - wire_slope*x
  }
  var wire_pos=[0,c_c[1],c_w,c_c[1]]


  //r_vector parameters
  var r0=[c_c[0],c_c[1]-ellipse_size[1]]
  var theta_0= -0.5*Math.PI //Start facing down
  function rt(){
    return [abs_time(200)%c_w,wire_pos[1]]
  }


  
//Clear draw area
ctx_i.globalCompositeOperation = 'destination-over';
ctx_i.clearRect(0, 0, c_w, c_h); // clear canvas

  

  // function angle_motion(){
  //   return (10*((2 * Math.PI) / 60) * time.getSeconds() +10* ((2 * Math.PI) / 60000) * time.getMilliseconds());
  // }
  // var r0_pos = [75* Math.sin(theta_0)+150,50* Math.cos(theta_0)+150] 
  // var rt_pos = [75* Math.sin(angle_motion())+150,50* Math.cos(angle_motion())+150] 
    


  ///Draw r vector and label///////////////////////////////////////////////////////////

  ctx_i.lineWidth=2.0
  ctx_i.strokeStyle = color_rvec;
  ctx_i.fillStyle = color_rvec;

  //Draw Label
  ctx_i.beginPath();
  labeled_point(ctx_i,r0[0]+0.5*(rt()[0]-r0[0])+15,r0[1]+0.5*(rt()[1]-r0[1]),5,5,0, ' r \u2A2F d\u2113')
  ctx_i.stroke();

  //Draw Vector
  ctx_i.beginPath();
  canvas_arrow(ctx_i, r0[0],r0[1], rt()[0],rt()[1])
  ctx_i.stroke();
  


  ///Top layer wire/////////////////////////////////////////////////////////////////////

  ctx_i.strokeStyle = color_wire;
  ctx_i.fillStyle = color_wire;

  ctx_i.beginPath();
  ctx_i.lineWidth= 4;
  ctx_i.moveTo(0, c_c[1])
  ctx_i.lineTo(c_w[1], c_c[1])
  canvas_arrow(ctx_i, 0, c_c[1], (( abs_time(100))%c_c[0]) ,c_c[1])
  canvas_arrow(ctx_i, 0, c_c[1],(( abs_time(100)+0.5*c_c[0])%c_c[0]) ,c_c[1])
  ctx_i.stroke();

  

///Draw Ellipse///////////////////////////////////////////////////////////////////////////
  
  ctx_i.lineWidth=3.0
  ctx_i.strokeStyle = color_ellipse;
  ctx_i.fillStyle = color_ellipse;
  ctx_i.setLineDash([10, 5])

  ctx_i.beginPath();
  ctx_i.ellipse(c_c[0], c_c[1], ellipse_size[0], ellipse_size[1], Math.PI , 0, 2 * Math.PI);
  ctx_i.stroke();

  ctx_i.beginPath();
  ctx_i.lineWidth=3.0
  ctx_i.setLineDash([5, 5])
  ctx_i.moveTo(c_c[0],c_c[1]-ellipse_size[1]);
  ctx_i.lineTo(c_c[0],c_c[1]);
  ctx_i.stroke();
  ctx_i.setLineDash([])

  ctx_i.beginPath();
  labeled_point(ctx_i,c_c[0] + 0.2*ellipse_size[0],c_c[1]-0.4*ellipse_size[1],5,5,0, 'R')
  ctx_i.stroke();

///Bottom layer wire/////////////////////////////////////////////////////////////////////
  ctx_i.beginPath();
  ctx_i.lineWidth= 4

  ctx_i.strokeStyle = color_wire;
  ctx_i.fillStyle = color_wire;

  ctx_i.moveTo(0, c_c[1])
  ctx_i.lineTo(c_w,  c_c[1])
  canvas_arrow(ctx_i, c_c[0], c_c[1], (( abs_time(100))%c_c[0])+c_c[0] ,c_c[1])
  canvas_arrow(ctx_i, c_c[0], c_c[1], (( abs_time(100)+0.5*c_c[0])%c_c[0])+c_c[0] , c_c[1])
  ctx_i.stroke();


  window.requestAnimationFrame(draw);
}

init();
