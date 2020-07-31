// Variable Scales
let x_lin=[], x_log=[]
x_lin[0]=0

// Data Sets
let y_power=[], y_log=[]
y_power[0]=0

//Min step
let s=0.03, imax=250;


// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}


// Generate Model Functions and Set Default Data
for(i=1; i<imax;i++){
    x_lin[i]=s*i
    x_log[i]=Math.log(x_lin[i])
    y_power[i]=x_lin[i]
    y_log[i]=Math.log(y_power[i])
}

x_live=x_lin.slice()
y_live=y_power.slice()

///// Functions


function calculate_log_slope(){
  //Use simple statistics to calcuate regression
  reg_array=[]
  for(i=0;i<imax;i++){
    reg_array[i]=[x_log[i],y_log[i]]
  }
  data_out=linearRegression(reg_array)
  
  console.log(data_out)

  //Print line of best fit info
  
}

function plot_update(){


  Plain_Trace.x=x_live 
  Plain_Trace.y=y_live
  layout.title=title

 
  Best_Fit={
    x: x_fit,
    y: y_fit,
    mode:'lines',
    name:'Line of Best Fit'
  }

  //Update Data
  Plotly.animate('graph', { data: [Plain_Trace]},{
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
    })

  //Update Layout

  layout.title=title
  layout.titlefont=title_font
  layout.xaxis.title=x_label
  layout.xaxis.titlefont=axes_font
  layout.yaxis.title=y_label
  layout.yaxis.titlefont=axes_font
  layout.xaxis.title=x_label
  layout.yaxis.title=y_label
  layout.xaxis.range=[1.2* Math.min(...x_live), 1.2* Math.max(...x_live)]

  layout.yaxis.range=[1.2* Math.min(...y_live), 1.2* Math.max(...y_live)]



    Plotly.animate('graph', { data: [Plain_Trace,Best_Fit], 
      layout: layout   
    },{
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 500
      }
      })
}
  
  
  
Plotly.newPlot('graph', [Plain_Trace], layout, {displayModeBar: false})
plot_update()





entered_exponent=document.getElementById('entry1')
submit= document.getElementById('submit') 
logscale=document.getElementById('log')


submit.onclick= function(){
  document.getElementById('eqn').innerHTML= '$y = x^{'+ entered_exponent.value+ '}$'
  x_live=x_lin.slice()

  for(i=0; i<imax;i++){
   y_live[i]=x_live[i]**Number(entered_exponent.value)
  }

  plot_update()
  document.getElementById("print_info").innerHTML= 
  " Log-Log Slope: "+ entered_exponent.value

}

log.onclick= function(){
  if(y_type=='linear'){
    y_type='log'
    log.value= 'Linear-Linear'
    title="Log v.s. Log"
    document.getElementById('eqn').innerHTML= '$log(y) ='+  entered_exponent.value+ '*log(x)'
  }else{
    y_type='linear'
    log.value= 'Log-Log'
    title="Linear v.s. Linear"
    document.getElementById('eqn').innerHTML= '$y = x^{'+ entered_exponent.value+ '}$'
  }
 
 plot_update()

}








