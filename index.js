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