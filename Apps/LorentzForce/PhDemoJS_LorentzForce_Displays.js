//This file contains the display parameters and interactive bits






//////////////////////////////////////////////////////////
// Layout
var layout = {
  showlegend:false,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1
    },
    xaxis: {
      title: " time (s)",
      range: [-50, 50]},
      showline: false,
      showgrid: true,
      zeroline: false,
    yaxis: {
      title: " position (m)",
      range: [-50, 50],
      showline: false,
      showgrid: true,
      zeroline: false,
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
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    shapes: [
    {
      type: 'rect',
      xref: 'x',
      yref: 'y',
      x0: 0,
      y0: -500,
      x1: 50,
      y1: 50,
      line: {
        color: 'rgba(96, 96, 96,1)',
        width: 0
      },
      fillcolor: 'rgba(109, 109, 109, 0.6)'
    },
    ]
  };

//////////////////////////////////////////////////////////
// Traces are what is to be plotted
var trace_particle_traj = {
    x: x,
    y: y,
    mode: 'lines',
    //marker: {size: [20,10], color: ['blue', 'red'],},
    name: 'Trajectory'
  };
  var trace_particle = {
    x: x_live,
    y: y_live,
    mode: 'markers',
    marker: {size: [20,10], color: ['blue', 'red'],},
   
  };

trajectory_compute()
Plotly.newPlot('graph', [trace_particle_traj,trace_particle],layout)


  

 ///////////////// Sliders and Buttons and other dongles
    
    //This lets the button start the simulation
    function startUpdate(){
        var x=[0]
        var y=[0]
        x_live=x_0
        y_live=y_0
        t_live=0
        trace_particle_traj.x=x
        trace_particle_traj.y=y
        trajectory_compute()
        requestAnimationFrame(update)
      }
      
      //Poorly named sliders because I'm lazy
      var y_start = document.getElementById("sl1");
      var y_out = document.getElementById("slo1");
      y_out.innerHTML = Number(sl1.value)-50.0; // Display the default slider value

      var vx_start = document.getElementById("sl2");
      var vx_out = document.getElementById("slo2");
      vx_out.innerHTML = Number(sl2.value); // Display the default slider value

      var Bf = document.getElementById("sl3");
      var Bf_out = document.getElementById("slo3");
      Bf_out.innerHTML = Number(sl3.value); // Display the default slider value
      
      
      // Update the current slider value (each time you drag the slider handle). Probably a nicer way to
      // do all of these at once
      y_start.oninput = function() {
        y_out.innerHTML = Number( y_start.value)-50.0;
        y_0=Number( y_start.value)-50.0
      }

      vx_start.oninput = function() {
        vx_out.innerHTML = Number( vx_start.value);
        vx_0=Number( vx_start.value)
      }

      Bf.oninput = function() {
        Bf_out.innerHTML = Number( Bf.value);
        b_0=Number(Bf.value)
      }
      