
function init() {
  running=true
  window.requestAnimationFrame(draw);
}

function checkandrun(){
  if(!running){
    running=true
    window.requestAnimationFrame(draw);
  }
}

 
//Loop data
var index=[], As=[1,1,1,1], dA=[], zeroes=[]
var tk=0.0001
var t_load=tk*(new Date().valueOf())
var A_in=0
var A_now=1
var B_now=0.1
var do_update=true
var running=false

for(i=0;i<200;i++){
  index[i]=i
  dA[i]=0.01
  zeroes[i]=0
}


///user flags
var mouseisdown=false
var Bf=[0.1,0.1,0.1,0.1]

////////////////////Canvas Variables//////////////////////////////////
var canvas=document.getElementById('canvas_FL')
var ctx = canvas.getContext('2d');
var rect = canvas.getBoundingClientRect();

//Get Canvas Size
var c_w=canvas.width//get canvas size
var c_h=canvas.height 
var c_c=[c_w*0.5,c_h*0.5]

ctx.font = '24px sans-serif';


//////////////////Default Loop////////////////////////////////////////////////
var l_x=c_c[0]-120
var l_y= c_c[1]-120



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
  ctx.textAlign = 'left';

  A_in=Math.min(100,Math.max(0, -0.5*c_w+l_x+100))*A_now/100
  As.shift()
  As.push(A_in)

  Bf.shift()
  Bf.push(B_now )

  dA.shift()
  dA.push(0.1*(As[0]*Bf[0] +As[1]*Bf[1]-As[2]*Bf[2]-As[3]*Bf[3])/(0.01) )
 
  update=false

  for(i=0;i<dA.length;i++){
    if(dA[i]!=zeroes[i]){
      update=true
      break
    }
  }

  if(update){

  //Clear draw area
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, c_w, c_h); // clear canvas
  


  
  ctx.fillStyle='rgba(147, 189, 147,1)'
  ctx.beginPath();
  ctx.rect(0.5*c_w, 0,0.5*c_w,c_h, false);
  ctx.fill();
  
 
  ctx.fillStyle='rgb(113, 142, 97)'

  for(i=0;i<10;i++){

    for(j=0;j<5;j++){
      ctx.beginPath();
      labeled_point(ctx,0.5*c_w*(1+j/5)+10 ,c_h*(i/10)+30 ,5,5,0, 'X'  )
    
    }

  }
 


  ctx.fillStyle='rgba(255, 210, 132,1)'
  ctx.strokeStyle='black'
  ctx.lineWidth= 5
  ctx.beginPath();
  ctx.rect(l_x, l_y,100,100, false);
  ctx.stroke();
  ctx.globalCompositeOperation = 'exclusion';
  ctx.fill()


  ctx.globalCompositeOperation = 'source-over';

  ctx.fillStyle='rgba(181,181,181,1)'
  ctx.beginPath();
  ctx.arc(l_x, l_y+50,20,0, 2*Math.PI, false);
  ctx.stroke();
  ctx.fill()



  ctx.fillStyle='black'
  ctx.textAlign = 'center';
  ctx.beginPath()
  labeled_point(ctx, l_x-5, l_y+55 ,5,5,0, 'V'  )
  ctx.font = '18px sans-serif';

  
  ctx.beginPath()
  labeled_point(ctx, l_x+55, l_y+20 ,5,5,0, '\u03D5 = '  )
  labeled_point(ctx, l_x+55, l_y+50 ,5,5,0,  (Bf[3]*A_in).toFixed(2) )
  labeled_point(ctx, l_x+55, l_y+80 ,5,5,0,   ' T m\u00B2'  )
 
 
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = '24px sans-serif';

 
  Plotly.animate('graph', 
  {
    data: [trace_v],},
  {
    transition: {
      duration: 0,
    },
    frame: {
      duration: 0,
      redraw: false
    }
  })

  ctx.textAlign = 'center';

  labeled_point(ctx, 0.25*c_w, c_h-30 ,5,5,0, 'B = 0'  )
  labeled_point(ctx, 0.75*c_w, c_h-30 ,5,5,0, 'B = '+ B_now.toFixed(1) +'T'  )

  window.requestAnimationFrame(draw);
}else{
  
  running=false
}
  

}

//Canvas Mouse Events

canvas.addEventListener('mousedown', function (ev){
  
  mouseisdown=true
  console.log(mouseisdown)
  l_x=ev.pageX - rect.left-50
  l_y=ev.pageY - rect.top-50
  
  
})
canvas.addEventListener('mouseup', function (ev){
  mouseisdown=false


})
canvas.addEventListener('mousemove', function (ev){

  if (mouseisdown){
  l_x=ev.pageX - rect.left-50
  l_y=ev.pageY - rect.top-50
  checkandrun()
 
  }
 

})

canvas.addEventListener('touchstart', function (ev){
  mouseisdown=true
  
})
canvas.addEventListener('touchend', function (ev){
  mouseisdown=false


})
canvas.addEventListener('touchmove', function (ev){

  if (mouseisdown){
  l_x=ev.touches[0].clientX - canvas.offsetLeft-50
  l_y=ev.touches[0].clientY - canvas.offsetTop-50
  checkandrun()
  }

})


init();



////////Trace
trace_v={
  x:index,
  y:dA,
  mode:'lines',
  line: {shape: 'spline'},
  'smoothing': 1.3
}




var layout = {
  showgrid: false,
  showlegend:false,
  //title:"Live EMF",
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    xaxis: {
      title: "Live EMF (V)",
      showline: false,
      showgrid: true,
      zeroline: true,
      ticks: '',
      showticklabels: false},
      font: {
        family: 'Arial, san-serif',
        size: 18,
        color: '#7f7f7f'}
      ,
    
    yaxis: {
      //title: "EMF (V)",
      range: [-30, 30],
      showline: false,
      showgrid: true,
      zeroline: false,
      ticks: '',
      showticklabels: false
      },
    autosize: false,
    height:200,
    width: 650,
    margin: {
      l: 0,
      r: 0,
      b: 50,
      t: 10,
      pad: 4
    },
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)'
  };
  Plotly.newPlot('graph', [trace_v],layout,{displayModeBar: false, scrollZoom: true})


  b_slider=document.getElementById('bf_sl')
  b_out=document.getElementById('bf_o')
  b_out.innerHTML=b_slider.value/10
  b_slider.oninput= function(){

    
    b_out.innerHTML=b_slider.value/10
    B_now=b_slider.value/10
    checkandrun()

  }

  a_slider=document.getElementById('a_sl')
  a_out=document.getElementById('a_o')
  a_out.innerHTML=a_slider.value/10
  a_slider.oninput= function(){

    a_out.innerHTML=a_slider.value/10
    A_now=a_slider.value/10
    checkandrun()

  }
