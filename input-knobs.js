window.addEventListener("load",function(){
  let styles=document.createElement("style");
  styles.innerHTML="\
  input[type=range].input-knob {\
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
  input.input-knob[type=range]::-webkit-slider-thumb {\
    -webkit-appearance:none;\
    opacity:0;\
  }\
  input.input-knob[type=range]::-moz-range-thumb {\
    -moz-appearance:none;\
    height:0;\
    border:none;\
  }\
  input.input-knob[type=range]::-moz-range-track {\
    -moz-appearance:none;\
    height:0;\
    border:none;\
  }\
  input.input-switch {\
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
  input.input-switch:checked {\
    background-position:0% 100%;\
  }\
  input.input-hslider{\
    -webkit-appearance:none;\
    -moz-appearance:none;\
    height:24px;\
    width:256px;\
    font-size:24px;\
    border:none;\
    overflow:visible;\
    margin:0;\
    padding:0;\
    --thumbimg:url(./hslider.svg);\
    background-image:var(--thumbimg);\
    background-size:0% 0%;\
    background-position:0% 200%;\
    background-repeat:no-repeat;\
    background-color:#000;\
    border-radius:10px;\
  }\
  input.input-hslider[data-bgtype=img]{\
    --thumbimg:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj4NCjxnPg0KPGNpcmNsZSBmaWxsPSIjZmYwMDAwIiBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiLz4NCjwvZz4NCjwvc3ZnPg0K);\
    background-size:100% 200%;\
    background-position:0% 100%;\
  }\
  input.input-hslider::-webkit-slider-thumb{\
    -webkit-appearance:none;\
    background-image:var(--thumbimg);\
    background-size:100% 100%;\
    width:1em;\
    height:var(--thumbheight);\
  }\
  input.input-hslider[data-bgtype=img]::-webkit-slider-thumb{\
    background-image:var(--thumbimg);\
    background-size:auto 200%;\
    background-position:50% 0%;\
    border-radius:0;\
  }\
  input.input-hslider[data-bgtype=img]::-moz-range-thumb{\
    background-image:var(--thumbimg);\
    background-size:auto 200%;\
    background-position:50% 0%;\
    border-radius:0;\
  }\
  input.input-hslider::-moz-range-thumb{\
    -moz-appearance:none;\
    background-image:var(--thumbimg);\
    background-size:100% 100%;\
    background-color:transparent;\
    width:1em;\
    height:var(--thumbheight);\
    border:none;\
  }\
  input.input-hslider::-ms-thumb{\
    background-image:inherit;\
    height:inherit;\
  }\
  input.input-hslider[data-bgtype=img]::-ms-thumb{\
    background-image:inherit;\
    height:inherit;\
  }\
  input.input-hslider::-moz-range-track{\
   height:0;\
  }\
  input.input-hslider::-ms-tooltip{\
    display:none;\
  }\
";
  document.head.appendChild(styles);
  var elem=document.querySelectorAll("input.input-knob");
  for(let i=elem.length-1;i>=0;--i){
    let el=elem[i];
    el.diameter=el.getAttribute("data-diameter");
    if(!el.diameter)
      el.diameter=64;
    el.style.width=el.style.height=el.diameter+"px";
    let src=el.getAttribute("data-src");
    if(src)
      el.style.backgroundImage="url("+src+")";
    else{
      let fg=el.getAttribute("data-fgcolor");
      let bg=el.getAttribute("data-bgcolor");
      let svg='\
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" preservAspectRatio="none">\
<g><circle fill="#000" cx="128" cy="128" r="126"/>\
<path fill="none" stroke="#F00" stroke-width="24" stroke-linecap="round" d="M128,25 v70"/>\
</g></svg>\
      ';
      if(bg)
       svg=svg.replace(/#000/g,bg);
      if(fg)
        svg=svg.replace(/#F00/g,fg);
      el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
    }
    el.sprites=Math.max(1,el.getAttribute("data-sprites"));
    el.valrange={min:parseFloat(el.min),max:parseFloat(el.max),step:parseFloat(el.step)};
    if(isNaN(el.valrange.min)) el.valrange.min=0;
    if(isNaN(el.valrange.max)) el.valrange.max=100;
    if(isNaN(el.valrange.step)) el.valrange.step=1;
    el.style.backgroundSize="100% "+(el.sprites*100)+"%";
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
      let dx=(el.dragfrom.y-ev.clientY-el.dragfrom.x+ev.clientX)*(el.valrange.max-el.valrange.min)/128;
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
          el.style.backgroundPosition="0px "+(-((v*(el.sprites-1))|0)*el.diameter)+"px";
        else
          el.style.transform="rotate("+(270*v-135)+"deg)";
        el.valueold=el.value;
      }
    };
    el.addEventListener("keydown",el.keydown);
    el.addEventListener("mousedown",el.pointerdown);
    el.addEventListener("touchstart",el.pointerdown);
    el.addEventListener("wheel",el.wheel);
    el.redraw();
  }
  elem=document.querySelectorAll("input.input-switch");
  for(let i=elem.length-1;i>=0;--i){
    let el=elem[i];
    let src=el.getAttribute("data-src");
    if(src)
      el.style.backgroundImage="url("+src+")";
    else {
      let fg=el.getAttribute("data-fgcolor");
      let bg=el.getAttribute("data-bgcolor");
      let svg='\
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="128" viewBox="0 0 64 128" preservAspectRatio="none">\
<g><rect fill="#000" x="1" y="1" width="62" height="62" rx="16"/>\
<rect fill="#000" x="1" y="65" width="62" height="62" rx="16"/>\
<circle fill="#F00" cx="32" cy="96" r="19"/>\
</g></svg>\
';
      if(bg)
        svg=svg.replace(/#000/g,bg);
      if(fg)
        svg=svg.replace(/#F00/g,fg);
      el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
    }
    let dia=el.getAttribute("data-diameter");
    if(dia)
      el.style.width=dia+"px",el.style.height=dia+"px";
  }
  elem=document.querySelectorAll("input.input-hslider");
  for(let i=elem.length-1;i>=0;--i){
    let el=elem[i];
    let w=el.getAttribute("data-width");
    let h=el.getAttribute("data-height");
    let img=el.getAttribute("data-src");
    let tw=el.getAttribute("data-thumbwidth");
    if(!w) w=200;
    if(!h) h=24;
    if(!tw) tw=h;
    el.style.width=w+"px";
    el.style.height=h+"px";
    el.style.fontSize=tw+"px";
    if(img)
      el.style.backgroundImage="url("+img+")";
    el.style.setProperty("--thumbimg",el.style.backgroundImage);
    el.style.setProperty("--thumbheight",h+"px");
  }
  setInterval(()=>{
    var elem=document.querySelectorAll("input.input-knob");
    for(let i=elem.length-1;i>=0;--i){
      let el=elem[i];
      el.redraw();
    }
  },1000);
});
