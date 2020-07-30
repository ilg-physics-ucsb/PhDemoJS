

//Title and Axes
var title="Linear v.s. Linear"
var title1="Linear", title2="Linear"
var y_label='y data', x_label="x"
var axes_font = {
  family: 'Arial Black',
  size: 14,
  color: 'rgb(56, 56, 56)'
}
var title_font = {
  family: 'Arial Black',
  size: 20,
  color: 'black'
}
var legend_font= {
  family: 'Arial Black',
  size: 12,
  color: '#000'
}

var y_type= 'linear'

// Live Data and Fit being plotted
var x_live =[], y_live =[], x_fit=[], y_fit= []

var layout = {
  hovermode:'closest',
  title: title,
  autosize:true,
  width: 800,
  height: 500,
  titlefont:title_font,
  xaxis: {
    hoverformat: '.2f',
      range:[0,  Math.max(...x_live)],
      title: x_label,
      titlefont:axes_font,
                      },
  yaxis: {
      hoverformat: '.2f',
      range:[0,  Math.max(...y_live)],
      title: y_label,
      titlefont:axes_font,
  },
  legend: {
    "orientation": "h",
    x: 0.5,
    xanchor:'center',
    y: 1.15,
    // xanchor:'center',
    // yanchor: 'top',
    traceorder: 'normal',
    font: legend_font,
    //bgcolor: '#FFFFF',
    bordercolor: '#FFFFFF',
    borderwidth: 2
  } 
}


///// Traces 

var Plain_Trace={
  x: x_live,
  y: y_live,
  mode:'lines',
  type: 'scatter',
  name:'Data     ',
  hoverinfo:"x+y"
}


/////////////////////////////////////Experimental ho