iframes=document.getElementsByClassName('sim_embed')
iframe_shells=document.getElementsByClassName('iframeshell')


for(i=0;i<iframes.length;i++)
    if (iframe_shells[i].scrollWidth<1200){
    iframes[i].height=1100;
}

window.onresize= function() {
    for(i=0;i<iframes.length;i++)
    if (iframe_shells[i].scrollWidth<1200){
        iframes[i].height=1100;
        }else{
        iframes[i].height=650;
        }
}



function showhide(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }