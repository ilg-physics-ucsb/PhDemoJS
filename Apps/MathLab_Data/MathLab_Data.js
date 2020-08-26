// Variable Scales
let x_bb=[[800, 864, 927, 991, 1055, 1119, 1183, 1247, 1311, 1375, 1439, 1502, 1566],[]]
let x_met=[[679, 342, 388, 64.1, 56.5, 45.6, 15.5, 11.6, 1.96, 0.3, 0.226, 0.173, 0.15],[]]
// Data Sets


let y_bb=[[0.87, 1.10, 1.50, 1.80, 2.20, 2.80, 3.70, 5.00, 6.80, 8.60, 10.00, 12.50, 15.50],[]]
let y_met=[[34620, 26170, 26860, 6828, 5644, 5104.1, 2200, 1850, 444, 129, 107, 84.5, 81.6],[]]

var log_button=document.getElementById('log')
var plotaslog=0

for (i=0;i<x_bb[0].length;i++){
  x_bb[1][i]=Math.log(x_bb[0][i])
  y_bb[1][i]=Math.log(y_bb[0][i])
}
for (i=0;i<x_met[0].length;i++){
  x_met[1][i]=Math.log(x_met[0][i])
  y_met[1][i]=Math.log(y_met[0][i])
}

//x_live=x_bb.slice()
//y_live=y_bb.slice()

///// Functions


function calculate_lin_reg(){
  //Use simple statistics to calcuate regression
  reg_array=[]
  for(i=0;i<y_live.length;i++){
    reg_array[i]=[x_live[i],y_live[i]]
  }
  data_out=linearRegression(reg_array)
  x_fit[0]=Math.min(...x_live)
  y_fit[0]=data_out['b'] -(0-Math.min(...x_live))*data_out['m']
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
  calculate_lin_reg()
 
  Best_Fit_line={
    x: x_fit,
    y: y_fit,
    mode:'lines',
    name:'Line of Best Fit'
  }

  //Update Data
  Plotly.animate('graph', { data: [Data_Trace,Best_Fit_line]},{
    transition: {
      duration: 500,
      easing: 'cubic-in-out'
    },
    frame: {
      duration: 500
    }
    })

    layout.title.text= layout.title.text + ' ' +logtitles[plotaslog]+logtitles[plotaslog]
    layout.xaxis.title.text= logtitles[plotaslog] + layout.xaxis.title.text
    layout.yaxis.title.text= logtitles[plotaslog] + layout.yaxis.title.text
 
  layout.xaxis.range=[1.2* Math.min(...x_live), 1.2* Math.max(...x_live)]
  layout.yaxis.range=[1.2* Math.min(...y_live), 1.2* Math.max(...y_live)]
 

    Plotly.animate('graph', { data: [Data_Trace,Best_Fit_line], 
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
  
  
  
Plotly.newPlot('graph', [Data_Trace, Best_Fit_line], layout, {displayModeBar: false, responsive: true})
plot_update()




 x_scale_choice=document.getElementById("xaxis")
 y_scale_choice=document.getElementById("yaxis")
 data_choice=document.getElementById("data")



 data_choice.onchange= function(){
   change_data()
 }
 
 
function change_data(){
  y_live=[]
  switch(data_choice.value) {
    case '1':
      y_live=y_bb[plotaslog].slice()
      x_live=x_bb[plotaslog].slice()
      layout.title.text=titles[1][0]
      layout.xaxis.title.text= titles[1][2]
      layout.yaxis.title.text= titles[1][1]
      break;
    case '2':
      y_live=y_met[plotaslog].slice()
      x_live=x_met[plotaslog].slice()
      layout.title.text=titles[2][0]
      layout.xaxis.title.text= titles[2][2]
      layout.yaxis.title.text= titles[2][1]
      break;
    default:
      y_live=[]
      x_live=[]
      layout.title.text=titles[0][0]
      layout.xaxis.title.text= titles[0][2]
      layout.yaxis.title.text= titles[0][1]
  }
 calculate_lin_reg()
 plot_update()
 }

 log_button.onclick=function(){
  console.log('click')
  if (plotaslog==0){
      plotaslog=1
      log_button.innerHTML ='Plot as Raw Data'
  }else{
    plotaslog=0
    log_button.innerHTML ='Plot as Log-Log'
  }

  change_data()
    
}