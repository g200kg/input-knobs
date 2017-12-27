window.addEventListener("load",function(){
  let styles=document.createElement("style");
  styles.innerHTML="\
  input.input-knob {\
    -webkit-appearance:none;\
    -moz-appearance:none;\
    width:64px;\
    height:64px;\
    border:none;\
    box-sizing:border-box;\
    overflow:hidden;\
    background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+DQo8Zz4NCgk8Y2lyY2xlIGZpbGw9IiMwMDAwMDAiIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjEyNiIvPg0KICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTEyOCwyNSB2NzAiLz4NCiAgPC9nPg0KPC9zdmc+DQo=);\
    background-repeat:no-repeat;\
    background-size:100% 100%;\
    background-position:0px 0%;\
    background-color:transparent;\
  }\
  input.input-knob::-webkit-slider-thumb {\
    -webkit-appearance:none;\
    opacity:0;\
  }\
  input.input-knob::-moz-range-thumb {\
    -moz-appearance:none;\
    opacity:0;\
    border:none;\
  }\
  input.input-knob::-moz-range-track {\
    -moz-appearance:none;\
    opacity:0;\
    border:none;\
  }\
  input.input-switch {\
    -webkit-appearance:none;\
    -moz-appearance:none;\
    width:32px;\
    height:32px;\
    background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMCA2NCAxMjgiPg0KPGc+DQo8cmVjdCBmaWxsPSIjMDAwMDAwIiB4PSIxIiB5PSIxIiB3aWR0aD0iNjIiIGhlaWdodD0iNjIiIHJ4PSIxNiIvPg0KPHJlY3QgZmlsbD0iIzAwMDAwMCIgeD0iMSIgeT0iNjUiIHdpZHRoPSI2MiIgaGVpZ2h0PSI2MiIgcng9IjE2Ii8+DQo8Y2lyY2xlIGZpbGw9IiNmZjAwMDAiIGN4PSIzMiIgY3k9Ijk2IiByPSIxOSIvPg0KPC9nPg0KPC9zdmc+DQo=);\
    background-size:100% 200%;\
    background-position:0% 0%;\
    background-repeat:no-repeat;\
  }\
  input.input-switch:checked {\
    background-position:0% 100%;\
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
    el.mousedown=(ev)=>{
      el.focus();
      el.dragfrom={x:ev.clientX,y:ev.clientY,v:parseFloat(el.value)};
      document.addEventListener("mousemove",el.mousemove);
      document.addEventListener("mouseup",el.mouseup);
      ev.preventDefault();
      ev.stopPropagation();
    };
    el.mousemove=(ev)=>{
      let dx=(el.dragfrom.y-ev.clientY-el.dragfrom.x+ev.clientX)*(el.valrange.max-el.valrange.min)/128;
      if(ev.shiftKey)
        dx*=0.2;
      el.setValue(el.dragfrom.v+dx);
    };
    el.mouseup=(ev)=>{
      document.removeEventListener("mousemove",el.mousemove);
      document.removeEventListener("mouseup",el.mouseup);
      let event=document.createEvent("HTMLEvents");
      event.initEvent("change",false,true);
      el.dispatchEvent(event);
    };
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
    el.addEventListener("mousedown",el.mousedown);
    el.addEventListener("wheel",el.wheel);
    el.redraw();
  }
  var elem=document.querySelectorAll("input.input-switch");
  for(let i=elem.length-1;i>=0;--i){
    let el=elem[i];
    let src=el.getAttribute("data-src");
    if(src)
      el.style.backgroundImage="url("+src+")";
    let dia=el.getAttribute("data-diameter");
    if(dia)
      el.style.width=dia+"px",el.style.height=dia+"px";
  }
  setInterval(()=>{
    var elem=document.querySelectorAll("input.input-knob");
    for(let i=elem.length-1;i>=0;--i){
      let el=elem[i];
      el.redraw();
    }
  },1000);
});
