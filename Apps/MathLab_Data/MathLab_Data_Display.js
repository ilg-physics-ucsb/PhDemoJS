// pallet

var graph_font_color= '263D42'
var marker_color="steelblue"

var titles=[['Select Data to Plot','Data', 'Variable'],['Black Body', 'Intensity (Arb. Units)', 'Temperaure (K)'],['Metabolism','BMR (kJ/24 h)','Mass (kg)']]
var logtitles= ['','Log ']


//Title and Axes
var title="Linear v.s. Linear"
var title1="Linear", title2="Linear"
var y_label='y data', x_label="x"
var axes_font = {
  family: 'Arial Black',
  size: 14,
  color: graph_font_color
}
var title_font = {
  family: 'Arial Black',
  size: 20,
  color: graph_font_color
}
var tick_font = {
  family: 'Arial Black',
  size: 10,
  color: graph_font_color
}
var legend_font= {
  family: 'Arial Black',
  size: 12,
  color: graph_font_color
}
// Live Data and Fit being plotted
var x_live =[], y_live =[], x_fit=[], y_fit= []

var layout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(255,255,255,0.5)',
  hovermode:'closest',
  pad:-0,
  automargin:true,
  title: titles[0][0],
  //autosize:true,
  width: 700,
  height: 500,
  titlefont:title_font,
  xaxis: {
    hoverformat: '.2f',
      range:[0, 1.2* Math.max(...x_live)],
      title: {
        text: titles[0][2],
        font:axes_font,
      },
      linewidth: 2,
      tickfont:tick_font
                      },
  yaxis: {
      hoverformat: '.2f',
      range:[0, 1.2* Math.max(...y_live)],
      title: {
        text: titles[0][1],
        font:axes_font,
      },
      titlefont:axes_font,
      linewidth: 2,
      tickfont:tick_font
  },
  legend: {
    "orientation": "h",
    x: 0.5,
    xanchor:'center',
    y: 1.12,
    // xanchor:'center',
    // yanchor: 'top',
    traceorder: 'normal',
    font: legend_font,
    //bgcolor: '#FFFFF',
    bordercolor: '#FFFFFF',
    borderwidth: 0
  } 
}


///// Traces 

var Data_Trace={
  x: x_live,
  y: y_live,
  mode:'markers',
  type: 'scatter',
  name:'Data     ',
  hoverinfo:"x+y",
  marker:{color: marker_color}
  
}
var Best_Fit_line={
  x: x_fit,
  y: y_fit,
  mode:'lines',
  type:'scatter',
  name:'Line of Best Fit',
  //line:{color: 'orange'}
}

/////////////////////////////////////Experimental ho