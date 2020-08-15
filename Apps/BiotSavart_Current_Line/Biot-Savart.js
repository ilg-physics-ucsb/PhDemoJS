

var vel=25
var v_target=50.0

var angle_previous=0
var x_previous=0
var x_now=0


function init() {
  window.requestAnimationFrame(draw);
}


////////////////////Canvas Variables//////////////////////////////////
var canvas_i=document.getElementById('canvas_integral')
var ctx_i = canvas_i.getContext('2d');

///////////////////Format Options/////////////////////////////////////
var color_wire='rgba(191, 201, 199, 1)';
var color_rvec='rgba(100, 0, 0, 1)';
var color_ellipse='rgba(0, 153, 255, 0.8)';
ctx_i.lineCap = "round";
ctx_i.font = '24px serif';

//////////////////Time////////////////////////////////////////////////

//Real time
var time = new Date();
var t0=new Date().valueOf()
var t_update= 0.0001*(new Date().valueOf()-t0)
var t_now= 0.0001*(new Date().valueOf()-t0)
var t_ease=3.0
var dt=0.05

function abs_time(speed){
  return 0.0001*speed*(time.valueOf()-t0)
  //return speed*((1 / 6) * time.getSeconds() +(1/6000)* time.getMilliseconds())
}

var t=abs_time(5)


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

  //velocity


  
//////////////////Update Functions////////////////////////////////////

function update_vel(){
  if(vel<v_target){
  vel= vel+ Math.min(Math.abs((t_now-t_update)/t_ease),1)*Math.abs(v_target-vel)
  } else{
    vel= vel- Math.min(Math.abs((t_now-t_update)/t_ease),1)*Math.abs(vel-v_target)
  } 
}

function velchange(){
  current_slider=document.getElementById('current')
  current_out=document.getElementById('currentval')
  current_out.innerHTML=current_slider.value
  v_target= current_slider.value;
  t_update= 0.0001*(new Date().valueOf()-t0);
  t_ease=3*Math.abs((v_target-vel)/100.0)
}


/////////////////////////////////////////////////////////////


// Arrow drawing function
function canvas_arrow(context, fromx, fromy, tox, toy, headl) {
  //var headlen = 10; // length of head in pixels
  var headlen= 5//Math.floor(headl)
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
  var headlen= Math.floor(headl)
  context.moveTo(fromx - headlen, fromy-0.6*headlen);
  context.lineTo(fromx, fromy);
  context.lineTo(fromx - headlen, fromy+0.6*headlen);
  context.closePath();
  context.fill()
}


// Labeled Point Drawing function
function labeled_point(ctx,x_p,y_p,x_l,y_l,pointsize, l_text){
  ctx.moveTo(x_p,y_p)
  if(pointsize>0){
    ctx.arc(x_p, y_p, pointsize, 0, 2 * Math.PI, false);
  }
  ctx.fillText(l_text, x_p+x_l, y_p+y_l)
}


///////////////////////////Draw Loop////////////////////////////////////////////////////

function draw() {
  
  //Clear draw area
  ctx_i.globalCompositeOperation = 'source-over';
  ctx_i.clearRect(0, 0, c_w, c_h); // clear canvas

  //Update Time
  t_now= 0.0001*(new Date().valueOf()-t0)
  x_now=x_previous -vel*dt//*10
  x_previous=x_now
  

  ///Bottom layer wire/////////////////////////////////////////////////////////////////////
  ctx_i.beginPath();
  ctx_i.lineWidth= 8

  ctx_i.strokeStyle = color_wire;
  ctx_i.fillStyle = 'blue';

  ctx_i.moveTo(c_c[0], c_c[1])
  ctx_i.lineTo(c_w,  c_c[1])

  ctx_i.stroke();
  for(i=0;i<50;i++){
    ctx_i.arc(x_now%(0.5*c_c[0])+ (i-25)*0.04*c_c[0]+1.5*c_c[0], c_c[1], 4, 0, 2 * Math.PI, false);
  //canvas_arrowhead(ctx_i, ((x_now+(i+1)*0.5*c_c[0])%c_c[0] +i*c_c[0])-1, c_c[1], 10*(vel/100))
  }
  ctx_i.fill();
 
  // canvas_arrow(ctx_i, c_c[0], c_c[1], ( vel%c_c[0])+c_c[0] ,c_c[1])
  // canvas_arrow(ctx_i, c_c[0], c_c[1], ( (vel+0.5*c_c[0])%c_c[0])+c_c[0] , c_c[1])


 

  

  ///Draw R ///////////////////////////////////////////////////////////////////////////
  
  ctx_i.lineWidth=3.0
  ctx_i.strokeStyle = color_ellipse;
  ctx_i.fillStyle = color_ellipse;
  ctx_i.setLineDash([10, 5])


  ctx_i.beginPath();
  ctx_i.lineWidth=3.0
  ctx_i.setLineDash([5, 5])
  ctx_i.moveTo(c_c[0],c_c[1]-ellipse_size[1]);
  ctx_i.lineTo(c_c[0],c_c[1]);
  ctx_i.stroke();
  ctx_i.setLineDash([])
  //Add Label
  ctx_i.textAlign = 'left';
  ctx_i.beginPath();
  labeled_point(ctx_i,c_c[0] + 0.2*ellipse_size[0],c_c[1]-0.4*ellipse_size[1],5,5,0, 'R')
  ctx_i.stroke();




  ///Arrow Ellipse/////////////////////////////////////////////////////////////////////
  var angle_now=(dt*vel/100+angle_previous)%(2*Math.PI);
  angle_previous=angle_now
  var seg_len= 2*Math.PI/3
  var b_size= Math.abs(0.5*(vel/150))

  for(i=0;i<3;i++){
    ctx_i.beginPath();
    ctx_i.ellipse(c_c[0], c_c[1], ellipse_size[0], ellipse_size[1], Math.PI ,(i-b_size)*seg_len+ angle_now,  (i+b_size)*seg_len+angle_now);
    ctx_i.stroke();
  }







 ///Top layer wire/////////////////////////////////////////////////////////////////////

 ctx_i.strokeStyle = color_wire;
 ctx_i.fillStyle = 'blue';
 //Path of wire
 ctx_i.beginPath();
 ctx_i.lineWidth= 8;
 ctx_i.moveTo(0, c_c[1])
 ctx_i.lineTo(c_c[0], c_c[1])
 ctx_i.stroke();
 
 ctx_i.beginPath();
 for(i=0;i<51;i++){//Draw Multiple Arrows

  ctx_i.arc(x_now%(0.5*c_c[0])+ (i-25)*0.04*c_c[0]+0.5*c_c[0], c_c[1], 4, 0, 2 * Math.PI, false);

   //canvas_arrowhead(ctx_i,((x_now+(i+1)*0.5*c_c[0])%c_c[0])+0.5*c_c[0]*i, c_c[1], 0.25*(vel))
 }
 ctx_i.closePath();
 ctx_i.fill()
 


 //Add Label
 ctx_i.textAlign = 'center';
 ctx_i.fillStyle = color_wire;
 ctx_i.beginPath();

 labeled_point(ctx_i, c_c[0] ,1.2*c_c[1],5,5,0, 'Current:')
 labeled_point(ctx_i, c_c[0] ,1.3*c_c[1],5,5,0, 'I = '+vel.toFixed(1)+' A')
 ctx_i.moveTo(c_c[0]-0.5*vel, 1.1*c_c[1])
 ctx_i.lineTo(c_c[0]+0.5*vel, 1.1*c_c[1])
 canvas_arrowhead(ctx_i,c_c[0]+0.5*vel, 1.1*c_c[1], 0.15*(vel))
 //canvas_arrow(ctx_i, c_c[0]-0.5*vel, 1.1*c_c[1], c_c[0]+0.5*vel, 1.1*c_c[1], 10)
 //ctx_i.lineTo(c_c[0]+0.5*vel, 1.1*c_c[1])
  
 ctx_i.stroke();

  if(vel!=v_target){
    update_vel()
  }

  window.requestAnimationFrame(draw);
}

init();
