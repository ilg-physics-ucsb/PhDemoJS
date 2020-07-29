

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
      range:[0, 1.2* Math.max(...x_live)],
      title: x_label,
      titlefont:axes_font,
                      },
  yaxis: {
      hoverformat: '.2f',
      range:[0, 1.2* Math.max(...y_live)],
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

var Data_Trace={
  x: x_live,
  y: y_live,
  mode:'markers',
  type: 'scatter',
  name:'Data     ',
  hoverinfo:"x+y"
}
var Best_Fit={
  x: x_fit,
  y: y_fit,
  mode:'lines',
  type:'scatter',
  name:'Line of Best Fit'
}


/////////////////////////////////////Experimental hover
var myPlot = document.getElementById('graph'),
hoverInfo = document.getElementById('hoverinfo'),
d3 = Plotly.d3

myPlot.on('plotly_hover', function(data) { 
  var xaxis = data.points[0].xaxis,
  yaxis = data.points[0].yaxis;
  var infotext = data.points.map(function(d){
  return ('width: '+xaxis.l2p(d.x)+', height: '+yaxis.l2p(d.y));
    });

  hoverInfo.innerHTML = infotext.join('<br/>');
  })
.on('plotly_unhover', function(data){
hoverInfo.innerHTML = '';
}
);