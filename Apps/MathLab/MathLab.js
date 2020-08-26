// Variable Scales
let x=[], xx=[], xxx=[], ex=[], ix=[];

// Data Sets
let y_linear=[],y_quad=[],y_cubic=[],y_exp=[],y_inv=[];


//Min step
let s=0.3, imax=25;


// Standard Normal variate using Box-Muller transform.
function randn_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}


// Generate Model Functions and Set Default Data
for(i=0; i<imax;i++){
    x[i]=s*i
    xx[i]=x[i]*x[i]
    xxx[i]=x[i]*x[i]*x[i]
    ex[i]= Math.exp(i*s)
    ix[i]= 1/(s*(i+1))

    y_linear[i]=5*x[i]+ 3*(randn_bm())
    y_quad[i]=8*x[i]**2+ 3*(randn_bm())+40
    y_cubic[i]=0.3*x[i]**3+ 3*(randn_bm())
    y_exp[i]=ex[i]*5+ 5*i*(randn_bm())
    y_inv[i]=20*ix[i]+(5/(i+0.1))*(0.5-Math.random())
}

x_live=x.slice()
y_live=y_linear.slice()

///// Functions


function calculate_lin_reg(){
  //Use simple statistics to calcuate regression
  reg_array=[]
  for(i=0;i<imax;i++){
    reg_array[i]=[x_live[i],y_live[i]]
  }
  data_out=linearRegression(reg_array)
  x_fit[0]=0
  y_fit[0]=data_out['b']
  x_fit[1]=1.2* Math.max(...x_live)
  y_fit[1]=1.2*Math.max(...x_live)*data_out['m']+data_out['b']
  console.log(data_out)

  //Print line of best fit info
  document.getElementById("print_info").innerHTML= 
  " Slope: "+ data_out['m'].toPrecision(3) +" <br>   Intercept: "+data_out['b'].toPrecision(2)
}

function plot_update(){


  Data_Trace.x=x_live 
  Data_Trace.y=y_live
  title= title1+' v.s. '+title2
  layout.title=title
  calculate_lin_reg()
 
  Best_Fit={
    x: x_fit,
    y: y_fit,
    mode:'lines',
    name:'Line of Best Fit'
  }
  layout.title=title
  layout.titlefont=title_font
  layout.xaxis.title=x_label
  layout.xaxis.titlefont=axes_font
  layout.yaxis.title=y_label
  layout.yaxis.titlefont=axes_font
  //Update Data
  Plotly.animate('graph', { data: [Data_Trace,Best_Fit]},{
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
    })

  //Update Layout

  
  // layout.xaxis=
  // {
  //   hoverformat: '.2f',
  //     range:[1.2* Math.min(...x_live), 1.2* Math.max(...x_live)],
  //     title: x_label,
  //     titlefont:axes_font,
  //                     }
 
  // layout.yaxis={
  //   hoverformat: '.2f',
  //   range:[1.5* Math.min(-0.5,Math.min(...y_fit),Math.min(...y_live)), 1.2* Math.max(...y_live)],
  //   title: y_label,
  //   titlefont:axes_font,
  // }

  layout.xaxis.title=x_label
  layout.yaxis.title=y_label
  layout.xaxis.range=[1.2* Math.min(...x_live), 1.2* Math.max(...x_live)]

  layout.yaxis.range=[1.2* Math.min(...y_live), 1.2* Math.max(...y_live)]
 

    Plotly.animate('graph', { data: [Data_Trace,Best_Fit], 
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
  
  
calculate_lin_reg()  
Plotly.newPlot('graph', [Data_Trace, Best_Fit], layout, {displayModeBar: false, responsive: true})
plot_update()




 x_scale_choice=document.getElementById("xaxis")
 y_scale_choice=document.getElementById("yaxis")
 data_choice=document.getElementById("data")











 data_choice.onchange= function (){
  y_live=[]
  switch(data_choice.value) {
    case '1':
      y_live=y_linear.slice()
      title1='Linear'
      y_label= 'Linear Data'
      break;
    case '2':
      y_live=y_quad.slice()
      title1='Quadratic'
      y_label= 'Quadratic Data'
      break;
    case '3':
      y_live=y_cubic.slice()
      title1='Cubic'
      y_label= 'Cubic Data'
      break;
    case '4':
      y_live=y_exp.slice()
      title1='Exponential'
      y_label= 'Exponential Data'
      break;
    case '5':
      y_live=y_inv.slice()
      title1='Inverse'
      y_label= 'Inverse Data'
      break;
    default:
      y_live=y_linear.slice()
      title1='Linear'
      y_label= 'Linear Data'
  }
 calculate_lin_reg()
 plot_update()
 }


 x_scale_choice.onchange= function (){
   x_live=[]

  switch(x_scale_choice.value) {
    case '1':
      x_live=x.slice()
      title2='Linear'
      x_label='x'
      break;
    case '2':
      x_live=xx.slice()
      title2='Quadratic'
      x_label='x'+'\u00B2'
      break;
    case '3':
      x_live=xxx
      title2="Cubic"
      x_label='x'+'\u00B3'
      break;
    case '4':
      x_live=ex.slice()
      title2="Exponential"
      x_label='e\u02E3'
      break;
    case '5':
      x_live=ix.slice()
      title2="Inverse"
      x_label='1/x'
      break;
    default:
      x_live=x.slice()
      title2='Linear'
      x_label='x'
  }
   calculate_lin_reg()
   plot_update()
}