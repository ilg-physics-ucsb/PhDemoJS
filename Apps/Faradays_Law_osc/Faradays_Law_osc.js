
//Loop data
var A_in=0
var A_now=1
var B_now=0.1
var do_update=true
var running=false
var t=0
var dt=0.01
var r, rprev
var NBA=5

var omega=[0], theta=[Math.PI], vcoil=[0],t_now=[0]

function init() {
  update=false
  omega=[0] 
  theta=[Math.PI] 
  vcoil=[0]
  t_now=[0]
  t=0

  trace_v={
    x:omega,
    y:vcoil,
    mode:'lines',
    line: {shape: 'spline'},
    'smoothing': 1.3
  }
  checkandrun()
}

function checkandrun(){
  if(!running){
    running=true
    update=true
    window.requestAnimationFrame(draw);
  }
}




//////////////////Default Loop////////////////////////////////////////////////

// Labeled Point Drawing function
function labeled_point(ctx,x_p,y_p,x_l,y_l,pointsize, l_text){
  ctx.moveTo(x_p,y_p)
  if(pointsize>0){
    ctx.arc(x_p, y_p, pointsize, 0, 2 * Math.PI, false);
  }
  ctx.fillText(l_text, x_p+x_l, y_p+y_l)
}

function randone(s){
  return (1+s*(0.5-Math.random()))
}

///////////////////////////Draw Loop////////////////////////////////////////////////////

function draw() {
 
  if(t<5000 && update){ 
    
    t=t+1
    t_now.push(t_now[t-1]+0.05*randone(0.1))
    console.log(t_now[t])
    dtt= t_now[t]-t_now[t-1]

    theta.push( Math.PI*(1-t_now[t]/300)*Math.cos(t_now[t]))
    omega.push((theta[t]-theta[t-1])/(dtt))
    vcoil.push(NBA*omega[t]*Math.sin(theta[t]))
    trace_v={
      x:omega,
      y:vcoil,
      mode:'lines',
      line: {shape: 'spline'},
      'smoothing': 1.3
    }

    //Update plotly data
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
}else{ // otherwise conserve resources, don't redraw
    running=false//allow draw to be triggered again
}
  

}


/////////Plotly Stuff///////////////////////////////////////////////////////////////

////////Trace
var trace_v={
  x:omega,
  y:vcoil,
  mode:'lines',
  line: {shape: 'spline'},
  'smoothing': 1.3
}

var trace_line={
  x:[-10,10],
  y:[-NBA*10, NBA*10],
  mode:'lines',
}

var trace_line2={
  x:[-10,10],
  y:[NBA*10, -NBA*10],
  mode:'lines',
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
      title: "EMF (V) v.s. Angular Velocity (rad/s)",
      range:[-10.2,10.2],
      showline: true,
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
      range: [-20, 20],
      showline: true,
      showgrid: true,
      zeroline: true,
      ticks: '',
      showticklabels: false
      },
    autosize: false,
    height:500,
    width: 650,
    margin: {
      l: 0,
      r: 0,
      b: 70,
      t: 10,
      pad: 4
    },
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)'
  };


  Plotly.newPlot('graph', [trace_v,trace_line, trace_line2],layout,{displayModeBar: false, scrollZoom: true})
