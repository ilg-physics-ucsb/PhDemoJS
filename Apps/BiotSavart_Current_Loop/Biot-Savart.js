
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};
var vel=25
var v_target=50.0

var angle_previous=0
var angle_now=0;
var x_previous=0
var x_now=0
var mu0=Math.PI*4*(10**(-7))


function init() {
  window.requestAnimationFrame(draw);
}


////////////////////Canvas Variables//////////////////////////////////
var canvas_i=document.getElementById('canvas_integral')
var ctx_i = canvas_i.getContext('2d');

///////////////////Format Options/////////////////////////////////////
var color_wire='rgba(191,191, 191, 1)';
var color_rvec='rgba(100, 0, 0, 1)';
var color_ellipse='rgba(207, 149, 149, 1)';
var color_electron='rgba(0, 153, 255, 0.8)';
ctx_i.lineCap = "round";
ctx_i.font = '24px sans-serif';
var electron_size=3;
var wire_width=10;

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
  var seg_len= 2*Math.PI/3
  var b_size= Math.abs(0.5*(vel/150))


  
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
  current_out.innerHTML=(current_slider.value/100).toFixed(2)
  v_target= current_slider.value;
  t_update= 0.0001*(new Date().valueOf()-t0);
  t_ease=3*Math.abs((v_target-vel)/100.0)
}


/////////////////////////////////////////////////////////////

//B Strength

function bs(z){

  var rd= Math.sqrt(((0.01)**2 +z**2))
  return 100*(10000*vel*mu0/(2 )) * (0.01)**2/rd**3
}

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

//ArrowHead
function canvas_arrowhead_rot(context, tipx, tipy, headl, angle) {
  //var headlen = 10; // length of head in pixels
  var headlen= Math.floor(headl)
  //context.moveTo(tipx - headlen, tipy-0.6*headlen);
  var angle_true =angle
  // if(vel<0){
  //   angle_true=angle+(1.4)*Math.PI

  // }
  
  context.moveTo(tipx, tipy);
  context.lineTo(tipx - headlen*Math.cos(angle_true), tipy- headlen*Math.sin(angle_true));
  context.stroke()
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
  x_now=x_previous -vel*dt/2.5//*10
  x_previous=x_now
  

  ///Bottom layer wire/////////////////////////////////////////////////////////////////////
  angle_now=(dt*vel/100+angle_previous)%(2*Math.PI);
  angle_previous=angle_now
  b_size= Math.abs(0.5*(vel/150))

  ctx_i.lineWidth= wire_width
  ctx_i.strokeStyle = color_wire;
  ctx_i.fillStyle = color_electron;
  ctx_i.save()
  ctx_i.translate(0,0.25*c_h)
  ctx_i.scale(1,0.5)
 
  ctx_i.beginPath();
  ctx_i.arc(c_c[0], c_c[1], ellipse_size[1], Math.PI,2*Math.PI , false);
  ctx_i.stroke();
 
  
 
 
  ctx_i.restore()
  
  for(i=0;i<50;i++){
   ctx_i.beginPath();
   ctx_i.arc(ellipse_size[1]*Math.cos(angle_now + i*2*Math.PI/(50))+c_c[0], c_c[1]+0.5*ellipse_size[1]*Math.sin(angle_now + i*2*Math.PI/(50)), electron_size, 0, 2 * Math.PI, false);
   ctx_i.fill();
 }
  



  

 
  // canvas_arrow(ctx_i, c_c[0], c_c[1], ( vel%c_c[0])+c_c[0] ,c_c[1])
  // canvas_arrow(ctx_i, c_c[0], c_c[1], ( (vel+0.5*c_c[0])%c_c[0])+c_c[0] , c_c[1])


 

  

  ///Draw R ///////////////////////////////////////////////////////////////////////////
  
  ctx_i.lineWidth=3.0
  ctx_i.strokeStyle = 'rgba(100,100, 100, 1)';;
  ctx_i.fillStyle = 'rgba(110,110, 110, 1)';
  ctx_i.setLineDash([10, 5])


  ctx_i.beginPath();
  ctx_i.lineWidth=3.0
  ctx_i.setLineDash([5, 5])
  ctx_i.moveTo(c_c[0]-ellipse_size[1],c_c[1]);
  ctx_i.lineTo(c_c[0],c_c[1]);
  ctx_i.stroke();
  
  ctx_i.setLineDash([])
  //Add Label
  ctx_i.textAlign = 'center';
  ctx_i.beginPath();
  labeled_point(ctx_i,c_c[0] - 0.8*ellipse_size[0],c_c[1] + 0.1*ellipse_size[1],5,5,0, 'R = 10 cm')
  ctx_i.stroke();

  ///Draw z ///////////////////////////////////////////////////////////////////////////
  
 ctx_i.lineWidth=3.0
 ctx_i.strokeStyle = 'rgba(100,100, 100, 1)';;
 ctx_i.fillStyle = 'rgba(110,110, 110, 1)';
 ctx_i.setLineDash([10, 5])


 ctx_i.beginPath();
 ctx_i.lineWidth=3.0
 ctx_i.setLineDash([5, 5])
 ctx_i.moveTo(c_c[0],c_c[1]);
 ctx_i.lineTo(c_c[0],c_c[1]-ellipse_size[1]);
 //ctx_i.lineTo(c_c[0]-ellipse_size[1],c_c[1]);
 ctx_i.stroke();
 
 ctx_i.setLineDash([])
 //Add Label
 ctx_i.textAlign = 'center';
 ctx_i.beginPath();
 labeled_point(ctx_i,c_c[0] + 0.8*ellipse_size[0],c_c[1] - 0.2*ellipse_size[1],5,5,0, 'z = 10 cm')
 ctx_i.stroke();


  ///Arrow Ellipse/////////////////////////////////////////////////////////////////////
  
   ctx_i.strokeStyle = 'rgba(207, 149, 149, 0.3)';

   ctx_i.lineWidth= 1*wire_width;

  ctx_i.beginPath();
  ctx_i.moveTo(c_c[0],0);
  ctx_i.lineTo(c_c[0],c_h);
  ctx_i.stroke();
   
  ctx_i.strokeStyle = color_ellipse;
  ctx_i.fillStyle = color_ellipse;
  for(i=0;i<6;i++){
    z=(c_h*0.3*(3-i)+x_now).mod(1.8*c_h)-0.3*c_h
    z_h=(Math.abs(z-c_c[0])/ellipse_size[1])*0.01
    ctx_i.beginPath();
    ctx_i.moveTo(c_c[0],z-0.01*bs(z_h))
    ctx_i.lineTo(c_c[0],z+0.01*bs(z_h))

    canvas_arrowhead_rot(ctx_i,c_c[0] ,z-0.01*bs(z_h), -Math.sign(bs(z_h))*Math.sqrt(Math.abs(0.1*bs(z_h))), 0.3*Math.PI)
    ctx_i.stroke();
  }

  ctx_i.fillStyle = color_ellipse;

  //Add Label
  ctx_i.textAlign = 'left';
  ctx_i.beginPath();
  labeled_point(ctx_i,c_c[0] + 0.3*ellipse_size[0],c_c[1]-ellipse_size[1]+4,5,5,0, 'B = ' +(bs(0.01)/(100)).toFixed(1)+' \u03BCT')
  ctx_i.stroke();
  ctx_i.beginPath
  ctx_i.arc(c_c[0],c_c[1]-ellipse_size[1],10,0, 2*Math.PI)
  ctx_i.fill()



 ///Top layer wire/////////////////////////////////////////////////////////////////////


 ctx_i.lineWidth= wire_width
 ctx_i.strokeStyle = color_wire;
 ctx_i.fillStyle = color_electron;
 ctx_i.save()

 ctx_i.translate(0,0.25*c_h)
 ctx_i.scale(1,0.5)

 ctx_i.beginPath();
 ctx_i.arc(c_c[0], c_c[1], ellipse_size[1], 0, Math.PI, false);
 ctx_i.stroke();

 ctx_i.restore()


 for(i=0;i<50;i++){
   ctx_i.beginPath();
   ctx_i.arc(ellipse_size[1]*Math.cos(angle_now + i*2*Math.PI/(50))+c_c[0], c_c[1]+0.5*ellipse_size[1]*Math.sin(angle_now + i*2*Math.PI/(50)), electron_size, 0, 2 * Math.PI, false);
   ctx_i.fill();
 }

 //Add Label
 ctx_i.textAlign = 'center';
 ctx_i.fillStyle = color_wire;
 ctx_i.beginPath();

 labeled_point(ctx_i, c_c[0]+0.5*ellipse_size[1] ,c_c[1] +0.75*ellipse_size[1],5,5,0, 'Current:')
 labeled_point(ctx_i, c_c[0] +0.5*ellipse_size[1],c_c[1] +0.85*ellipse_size[1],5,5,0, 'I = '+(vel/100).toFixed(2)+' A')
 ctx_i.moveTo(c_c[0]+0.5*ellipse_size[1]-0.5*vel, c_c[1] +0.6*ellipse_size[1])
 ctx_i.lineTo(c_c[0]+0.5*ellipse_size[1]+0.5*vel, c_c[1] +0.6*ellipse_size[1])
 canvas_arrowhead(ctx_i,c_c[0]+0.5*ellipse_size[1]+0.5*vel, c_c[1] +0.6*ellipse_size[1], 0.15*(vel))
 //canvas_arrow(ctx_i, c_c[0]-0.5*vel, 1.1*c_c[1], c_c[0]+0.5*vel, 1.1*c_c[1], 10)
 //ctx_i.lineTo(c_c[0]+0.5*vel, 1.1*c_c[1])
  
 ctx_i.stroke();







 









  if(vel!=v_target){
    update_vel()
  }

  window.requestAnimationFrame(draw);
}

init();
