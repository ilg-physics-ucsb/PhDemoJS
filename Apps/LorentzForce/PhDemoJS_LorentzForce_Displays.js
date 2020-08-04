//This file contains the display parameters and interactive bits

 


var quit_run=false

var title_font = {
  family: 'Arial Black',
  size: 20,
  color: graph_font_color
}

//////////////////////////////////////////////////////////
// Layout
var layout = {
  showgrid: false,
  showlegend:false,
  title:"Top View",
  titlefont:title_font,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    xaxis: {
      title: "",
      range: [-50, 50],
      showline: false,
      showgrid: true,
      zeroline: false,
      ticks: '',
      showticklabels: false},
    
    yaxis: {
      title: "",
      range: [-50, 50],
      showline: false,
      showgrid: true,
      zeroline: false,
      ticks: '',
      showticklabels: false
      },
    autosize: false,
    width: 500,
    height: 500,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    },
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)',
    shapes: [
    {
      type: 'rect',
      xref: 'x',
      yref: 'y',
      layer:'below',
      x0: 0,
      y0: -500,
      x1: 50,
      y1: 50,
      line: {
        color: 'rgba(96, 96, 96,1)',
        width: 0
      },
      fillcolor: 'rgba(109, 109, 109, 0.9)'
    },
    ]
  };

//////////////////////////////////////////////////////////
// Traces are what is to be plotted
var trace_particle_traj = {
    x: [],
    y: [],
    mode: 'lines',
    //marker: {size: [20,10], color: ['blue', 'red'],},
    name: 'Trajectory',
    line: {width:5}
  };
  var trace_particle = {
    x: x_live,
    y: y_live,
    mode: 'markers',
    marker: {size: [20,10], color: 'blue'},
   
  };

trajectory_compute()
Plotly.newPlot('graph', [trace_particle_traj,trace_particle],layout,{displayModeBar: false})


  

 ///////////////// Sliders and Buttons and other dongles
    
    //This lets the button start the simulation
    function startUpdate(){
        quit_run=true
        var x=[0]
        var y=[0]
        x_live=x_0
        y_live=y_0
        t_live=0
        trace_particle_traj.x=x
        trace_particle_traj.y=y
        trajectory_compute()
        quit_run=false
        requestAnimationFrame(update)
      }
      
      //Poorly named sliders because I'm lazy
      // var y_start = document.getElementById("sl1");
      // var y_out = document.getElementById("slo1");
      // y_out.innerHTML = Number(sl1.value)-50.0; // Display the default slider value

      var vx_start = document.getElementById("sl2");
      var vx_out = document.getElementById("slo2");
      vx_out.innerHTML = Number(sl2.value); // Display the default slider value

      var Bf = document.getElementById("sl3");
      var Bf_out = document.getElementById("slo3");
      Bf_out.innerHTML = Number(sl3.value/100); // Display the default slider value
      
      
      // Update the current slider value (each time you drag the slider handle). Probably a nicer way to
      // do all of these at once
      // y_start.oninput = function() {
      //   y_out.innerHTML = Number( y_start.value)-50.0;
      //   y_0=Number( y_start.value)-50.0
      //   quit_run=true
      //   t_live=0
        
      //   trace_particle.x[0]=x_0
      //   trace_particle.y[0]=y_0
      //   trace_particle_traj.x=y.slice(0,t_live)
      //   trace_particle_traj.y=y.slice(0,t_live)

      //   Plotly.animate('graph', 
      //   {
      //     data: [trace_particle_traj, trace_particle], 
      //     layout: layout},
      //   {
      //     transition: {
      //       duration: 0,
      //     },
      //     frame: {
      //       duration: 0,
      //       redraw: false
      //     }
      //   })
      // }

      vx_start.oninput = function() {
        vx_out.innerHTML = Number( vx_start.value);
        vx_0=Number( vx_start.value)
        quit_run=true
      }

      Bf.oninput = function() {
        Bf_out.innerHTML = Number( Bf.value/100);
        b_0=Number(Bf.value/100)
        quit_run=true
        demo_draw()
      }
/////////////////////////////////////////////////////////////
///canvas

function demo_draw(){
canvas=document.getElementById('side_view')
ctx=canvas.getContext('2d')
ctx.clearRect(0, 0, canvas.width, canvas.height);


ctx.fillStyle = 'rgba(109, 109, 109, 0.9)';
ctx.fillRect(150, 65, 300, 20);
ctx.fillRect(0, 50, 30, 20);

ctx.beginPath();
ctx.arc(30, 60, 5, 0, 2 * Math.PI, false);
ctx.fillStyle = 'blue';
ctx.fill();
ctx.lineWidth = 1;
ctx.strokeStyle = 'white';
ctx.stroke();

ctx.beginPath();
ctx.strokeStyle = 'blue';
ctx.moveTo(30, 60);
ctx.lineTo(300, 60)
ctx.stroke();


ctx.beginPath();
ctx.strokeStyle = 'black';
for(i=1;i<10;i++){

  line_top_tip=75- Math.abs((b_0*75))
  line_bot_tip=75+ Math.abs((b_0*75))
  aw=3
  ah=8

  ctx.moveTo(150+20*i,  75);
  ctx.lineTo(150+20*i,  line_top_tip)
  if(b_0>0){
  ctx.moveTo(150+20*i,  line_top_tip)
  ctx.lineTo(150+20*i -3,  line_top_tip+0.5*Math.sign(b_0)*ah)
  ctx.moveTo(150+20*i,  line_top_tip)
  ctx.lineTo(150+20*i +3,  line_top_tip+0.5*Math.sign(b_0)*ah)
  }


  ctx.moveTo(150+20*i,  75);
  ctx.lineTo(150+20*i,  line_bot_tip)
  if(b_0<0){
  ctx.moveTo(150+20*i,  line_bot_tip)
  ctx.lineTo(150+20*i -3,  line_bot_tip+0.5*Math.sign(b_0)*ah)
  ctx.moveTo(150+20*i,  line_bot_tip)
  ctx.lineTo(150+20*i +3,  line_bot_tip+0.5*Math.sign(b_0)*ah)
  }
  
  
  
  
  //ctx.lineTo(150+20*i -3,  65- (b_0*75)+Math.sign(b_0)*5)
  //ctx.moveTo(150+20*i,  65- (b_0*75));
  //ctx.lineTo(150+20*i +3,  65- (b_0*75)+Math.sign(b_0)*5)
  
}
ctx.stroke();
}
demo_draw()
