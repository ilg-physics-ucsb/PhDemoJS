
function init() {
  window.requestAnimationFrame(draw);
}
 
//Loop data
var xs=[],ts=[],index=[], As=[], dA=[]
var tk=0.0001
var t_load=tk*(new Date().valueOf())
var A_in=0

for(i=0;i<100;i++){
  index[i]=i
  xs[i]=0
  ts[i]=0
  As[i]=0
  dA[i]=0
}

///user flags
var mouseisdown=false

////////////////////Canvas Variables//////////////////////////////////
var canvas=document.getElementById('canvas_FL')
var ctx = canvas.getContext('2d');

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
  
  //Clear draw area
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, c_w, c_h); // clear canvas

  ctx.fillStyle='grey'
  ctx.beginPath();
  ctx.rect(0.5*c_w, 0,0.5*c_w,c_h, false);
  ctx.fill();

  ctx.beginPath();
  ctx.rect(l_x, l_y,100,100, false);
  ctx.stroke();

  A_in=Math.min(100,Math.max(0, -0.5*c_w+l_x+100))
 
  xs.shift()
  xs.push(l_x)
  ts.shift()
  ts.push(tk*new Date().valueOf()-t_load)
  As.shift()
  As.push(A_in)
  dA.shift()
  dA.push(0.005*(As[As.length-4] +As[As.length-3]-As[As.length-2] -As[As.length-1])/(0.01) )

  ctx.fillStyle='black'

  



  labeled_point(ctx,20 ,20 ,5,5,0, 'Click and Drag coil'  )

  for(i=0;i<10;i++){

    for(j=0;j<5;j++){

      labeled_point(ctx,0.5*c_w*(1+j/5)+10 ,c_h*(i/10)+30 ,5,5,0, 'X'  )
    
    }

  }
 
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
  window.requestAnimationFrame(draw);
}

//Canvas Mouse Events

canvas.addEventListener('mousedown', function (ev){
  mouseisdown=true
  
})
canvas.addEventListener('mouseup', function (ev){
  mouseisdown=false


})
canvas.addEventListener('mousemove', function (ev){

  if (mouseisdown){
  l_x=ev.clientX - canvas.offsetLeft-50
  l_y=ev.clientY - canvas.offsetTop-50

  
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
  title:"Live EMF",
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    xaxis: {
      title: "current time",
      showline: false,
      showgrid: true,
      zeroline: true,
      ticks: '',
      showticklabels: false},
    
    yaxis: {
      title: "EMF (V)",
      range: [-110, 110],
      showline: false,
      showgrid: true,
      zeroline: false,
      ticks: '',
      showticklabels: false
      },
    autosize: false,
    height:300,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    },
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)'
  };
  Plotly.newPlot('graph', [trace_v],layout,{displayModeBar: false})