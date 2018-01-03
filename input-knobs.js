window.addEventListener("load",function(){
  let styles=document.createElement("style");
  styles.innerHTML="\
  input[type=range].input-knob,\
  input[type=range].input-slider{\
    -webkit-appearance:none;\
    -moz-appearance:none;\
    width:64px;\
    height:64px;\
    border:none;\
    box-sizing:border-box;\
    overflow:hidden;\
    background-repeat:no-repeat;\
    background-size:100% 100%;\
    background-position:0px 0%;\
    background-color:transparent;\
    touch-action:none;\
  }\
  input[type=range].input-knob::-webkit-slider-thumb,\
  input[type=range].input-slider::-webkit-slider-thumb{\
    -webkit-appearance:none;\
    opacity:0;\
  }\
  input[type=range].input-knob::-moz-range-thumb,\
  input[type=range].input-slider::-moz-range-thumb{\
    -moz-appearance:none;\
    height:0;\
    border:none;\
  }\
  input[type=range].input-knob::-moz-range-track,\
  input[type=range].input-slider::-moz-range-track{\
    -moz-appearance:none;\
    height:0;\
    border:none;\
  }\
  input[type=checkbox].input-switch,\
  input[type=radio].input-switch {\
    -webkit-appearance:none;\
    -moz-appearance:none;\
    width:32px;\
    height:32px;\
    background-size:100% 200%;\
    background-position:0% 0%;\
    background-repeat:no-repeat;\
    border:none;\
    border-radius:0;\
    background-color:transparent;\
  }\
  input[type=checkbox].input-switch:checked,\
  input[type=radio].input-switch:checked {\
    background-position:0% 100%;\
  }\
";
  document.head.appendChild(styles);
  let makeKnobFrames=(fr,fg,bg)=>{
    let r='\
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="'+(fr*64)+'" viewBox="0 0 64 '+(fr*64)+'" preserveAspectRatio="none">\
<defs><g id="K"><circle cx="32" cy="32" r="30" fill="'+bg+'"/>\
<line x1="32" y1="28" x2="32" y2="7" stroke-linecap="round" stroke-width="6" stroke="'+fg+'"/></g></defs>\
<use xlink:href="#K" transform="rotate(-135,32,32)"/>';
    for(let i=1;i<fr;++i)
      r+='<use xlink:href="#K" transform="translate(0,'+(64*i)+') rotate('+(-135+270*i/fr)+',32,32)"/>';
    return r+"</svg>";
  }
  let makeHSliderFrames=(fr,fg,bg,w,h)=>{
    let r='\
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+w+'" height="'+(fr*h)+'" viewBox="0 0 ' +w+ ' ' +(fr*h)+ '" preserveAspectRatio="none">\
<defs><g id="B"><rect x="0" y="0" width="'+w+'" height="'+h+'" rx="'+h/2+'" ry="'+h/2+'" fill="'+bg+'"/></g>\
<g id="K"><circle x="'+(w/2)+'" y="0" r="'+(h/2*0.9)+'" fill="'+fg+'"/></g></defs>';
    for(let i=0;i<fr;++i){
      r+='<use xlink:href="#B" transform="translate(0,'+(h*i)+')"/>';
      r+='<use xlink:href="#K" transform="translate('+(h/2+(w-h)*i/100)+','+(h/2+h*i)+')"/>';
    }
    return r+"</svg>";
  }
  let makeVSliderFrames=(fr,fg,bg,w,h)=>{
    let r='\
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+w+'" height="'+(fr*h)+'" viewBox="0 0 ' +w+ ' ' +(fr*h)+ '" preserveAspectRatio="none">\
<defs><rect id="B" x="0" y="0" width="'+w+'" height="'+h+'" rx="'+w/2+'" ry="'+w/2+'" fill="'+bg+'"/>\
<circle id="K" x="0" y="0" r="'+(w/2*0.9)+'" fill="'+fg+'"/></defs>';
    for(let i=0;i<fr;++i){
      r+='<use xlink:href="#B" transform="translate(0,'+(h*i)+')"/>';
      r+='<use xlink:href="#K" transform="translate('+(w/2)+' '+(h*(i+1)-w/2-i*(h-w)/100)+')"/>';
    }
    return r+"</svg>";
  }
  var elem=document.querySelectorAll("input.input-knob,input.input-slider");
  for(let i=elem.length-1;i>=0;--i){
    let w,h,d;
    let el=elem[i];
    w=+el.getAttribute("data-width");
    h=+el.getAttribute("data-height");
    d=+el.getAttribute("data-diameter");
    let fg=el.getAttribute("data-fgcolor");
    let bg=el.getAttribute("data-bgcolor");
    if(fg==undefined) fg="#f00";
    if(bg==undefined) bg="#000";
    if(el.className.indexOf("input-knob")>=0)
      el.itype="k";
    else{
      switch(el.getAttribute("data-direction")){
      case "horz":
        el.itype="h";
        break;
      case "vert":
        el.itype="v";
        break;
      }
    }
    el.sensex=el.sensey=128;
    switch(el.itype){
    case "k":
      if(!d) d=64;
      if(!w) w=d;
      if(!h) h=d;
      break;
    case "h":
      if(!w) w=128;
      if(!h) h=20;
      el.sensex=w-h;
      el.sensey=Infinity;
      el.style.backgroundSize="auto 100%";
      break;
    case "v":
      if(!w) w=20;
      if(!h) h=128;
      el.sensex=Infinity;
      el.sensey=h-w;
      el.style.backgroundSize="100% auto";
      break;
    default:
      if(!w) w=128;
      if(!h) h=20;
      if(w>=h){
        el.itype="h";
        el.sensex=w-h;
        el.sensey=Infinity;
        el.style.backgroundSize="auto 100%";
      }
      else{
        el.itype="v";
        el.sensex=Infinity;
        el.sensey=h-w;
        el.style.backgroundSize="100% auto";
      }
      break;
    }
    el.style.width=w+"px";
    el.style.height=h+"px";
    el.frameheight=h;
    let src=el.getAttribute("data-src");
    if(src){
      el.style.backgroundImage="url("+src+")";
      let sp=+el.getAttribute("data-sprites");
      if(sp)
        el.sprites=sp;
      else
        el.sprites=1;
      if(el.sprites>=2)
        el.style.backgroundSize="100% "+(el.sprites*100)+"%";
      else if(el.itype!="k"){
        el.style.backgroundColor=bg;
        el.style.borderRadius=Math.min(w,h)*0.25+"px";
      }
    }
    else{
      let svg;
      switch(el.itype){
      case "k":
        svg=makeKnobFrames(101,fg,bg); break;
      case "h":
        svg=makeHSliderFrames(101,fg,bg,w,h); break;
      case "v":
        svg=makeVSliderFrames(101,fg,bg,w,h); break;
      }
      el.sprites=101;
      el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
      el.style.backgroundSize="100% "+(el.sprites*100)+"%";
    }
    el.valrange={min:parseFloat(el.min),max:parseFloat(el.max),step:parseFloat(el.step)};
    if(isNaN(el.valrange.min)) el.valrange.min=0;
    if(isNaN(el.valrange.max)) el.valrange.max=100;
    if(isNaN(el.valrange.step)) el.valrange.step=1;
    el.setValue=(v)=>{
      v=(Math.round((v-el.valrange.min)/el.valrange.step))*el.valrange.step;
      if(v<el.valrange.min) v=el.valrange.min;
      if(v>el.valrange.max) v=el.valrange.max;
      el.value=v;
      if(el.value!=el.oldvalue){
        el.setAttribute("value",el.value);
        el.redraw();
        let event=document.createEvent("HTMLEvents");
        event.initEvent("input",false,true);
        el.dispatchEvent(event);
        el.oldvalue=el.value;
      }
    };
    el.pointerdown=(ev)=>{
      el.focus();
      if(ev.touches)
        ev = ev.touches[0];
      el.dragfrom={x:ev.clientX,y:ev.clientY,v:parseFloat(el.value)};
      document.addEventListener("mousemove",el.pointermove);
      document.addEventListener("mouseup",el.pointerup);
      document.addEventListener("touchmove",el.pointermove);
      document.addEventListener("touchend",el.pointerup);
      document.addEventListener("touchcancel",el.pointerup);
      document.addEventListener("touchstart",el.preventScroll);
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.pointermove=(ev)=>{
      if(ev.touches)
        ev = ev.touches[0];
      let dx=((el.dragfrom.y-ev.clientY)/el.sensey-(el.dragfrom.x-ev.clientX)/el.sensex)*(el.valrange.max-el.valrange.min);
      if(ev.shiftKey)
        dx*=0.2;
      el.setValue(el.dragfrom.v+dx);
    };
    el.pointerup=(ev)=>{
      document.removeEventListener("mousemove",el.pointermove);
      document.removeEventListener("touchmove",el.pointermove);
      document.removeEventListener("mouseup",el.pointerup);
      document.removeEventListener("touchend",el.pointerup);
      document.removeEventListener("touchcancel",el.pointerup);
      document.removeEventListener("touchstart",el.preventScroll);
      let event=document.createEvent("HTMLEvents");
      event.initEvent("change",false,true);
      el.dispatchEvent(event);
    };
    el.preventScroll=(ev)=>{
      ev.preventDefault();
    }
    el.keydown=()=>{
      el.redraw();
    };
    el.wheel=(ev)=>{
      let delta=ev.deltaY>0?-el.valrange.step:el.valrange.step;
      if(!ev.shiftKey)
        delta*=5;
      el.setValue(+el.value+delta);
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.redraw=()=>{
      if(el.valueold!=el.value){
        let v=(el.value-el.valrange.min)/(el.valrange.max-el.valrange.min);
        if(el.sprites>1)
          el.style.backgroundPosition="0px "+(-((v*(el.sprites-1))|0)*el.frameheight)+"px";
        else{
          switch(el.itype){
          case "k":
            el.style.transform="rotate("+(270*v-135)+"deg)";
            break;
          case "h":
            el.style.backgroundPosition=((w-h)*v)+"px 0px";
            break;
          case "v":
            el.style.backgroundPosition="0px "+(h-w)*(1-v)+"px";
            break;
          }
        }
        el.valueold=el.value;
      }
    };
    el.addEventListener("keydown",el.keydown);
    el.addEventListener("mousedown",el.pointerdown);
    el.addEventListener("touchstart",el.pointerdown);
    el.addEventListener("wheel",el.wheel);
    el.redraw();
  }
  elem=document.querySelectorAll("input[type=checkbox].input-switch,input[type=radio].input-switch");
  for(let i=elem.length-1;i>=0;--i){
    let el=elem[i];
    let src=el.getAttribute("data-src");
    let w,h,d;
    w=+el.getAttribute("data-width");
    h=+el.getAttribute("data-height");
    d=+el.getAttribute("data-diameter");
    if(!d) d=24;
    if(!w) w=d;
    if(!h) h=d;
    el.style.width=w+"px";
    el.style.height=h+"px";
    if(src)
      el.style.backgroundImage="url("+src+")";
    else {
      let fg=el.getAttribute("data-fgcolor");
      let bg=el.getAttribute("data-bgcolor");
      if(!fg) fg="#F00";
      if(!bg) bg="#000";
      let minwh=Math.min(w,h);
      let svg='\
<svg xmlns="http://www.w3.org/2000/svg" width="'+(w)+'" height="'+(h*2)+'" viewBox="0 0 '+(w)+' '+(h*2)+'" preserveAspectRatio="none">\
<g><rect fill="'+(bg)+'" x="1" y="1" width="'+(w-2)+'" height="'+(h-2)+'" rx="'+(minwh*0.25)+'" ry="'+(minwh*0.25)+'"/>\
<rect fill="'+(bg)+'" x="1" y="'+(h+1)+'" width="'+(w-2)+'" height="'+(h-2)+'" rx="'+(minwh*0.25)+'" ry="'+(minwh*0.25)+'"/>\
<circle fill="'+(fg)+'" cx="'+(w*0.5)+'" cy="'+(h*1.5)+'" r="'+(minwh*0.25)+'"/>\
</g></svg>\
';
      el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
    }
  }
  setInterval(()=>{
    var elem=document.querySelectorAll("input.input-knob,input.input-slider");
    for(let i=elem.length-1;i>=0;--i){
      let el=elem[i];
      if(el.redraw)
        el.redraw();
    }
  },1000);
});
