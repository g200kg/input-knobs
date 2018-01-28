window.addEventListener("load",()=>{
  let op=window.inputKnobsOptions||{};
  op.knobWidth=op.knobWidth||op.knobDiameter||64;
  op.knobHeight=op.knobHeight||op.knobDiameter||64;
  op.sliderWidth=op.sliderWidth||op.sliderDiameter||128;
  op.sliderHeight=op.sliderHeight||op.sliderDiameter||20;
  op.switchWidth=op.switchWidth||op.switchDiameter||24;
  op.switchHeight=op.switchHeight||op.switchDiameter||24;
  op.fgcolor=op.fgcolor||"#f00";
  op.bgcolor=op.bgcolor||"#000";
  op.knobMode=op.knobMode||"linear";
  op.sliderMode=op.sliderMode||"relative";
  let styles=document.createElement("style");
  styles.innerHTML=
`input[type=range].input-keyboard{
  -webkit-appearance:none;
  -moz-appearance:none;
  touch-action:none;
  position:relative;
  background-color:#fff;
}
input[type="range"].input-keyboard::-webkit-slider-thumb{
  -webkit-appearance:none;
}
input[type=range].input-knob,input[type=range].input-slider{
  -webkit-appearance:none;
  -moz-appearance:none;
  border:none;
  box-sizing:border-box;
  overflow:hidden;
  background-repeat:no-repeat;
  background-size:100% 100%;
  background-position:0px 0%;
  background-color:transparent;
  touch-action:none;
}
input[type=range].input-keyboard::-moz-range-thumb{
  -moz-appearance:none;
  height:0;
  border:none;
}
input[type=range].input-keyboard::-moz-range-track{
  -moz-appearance:none;
  height:0;
}
input[type=range].input-knob{
  width:${op.knobWidth}px; height:${op.knobHeight}px;
}
input[type=range].input-slider{
  width:${op.sliderWidth}px; height:${op.sliderHeight}px;
}
input[type=range].input-knob::-webkit-slider-thumb,input[type=range].input-slider::-webkit-slider-thumb{
  -webkit-appearance:none;
  opacity:0;
}
input[type=range].input-knob::-moz-range-thumb,input[type=range].input-slider::-moz-range-thumb{
  -moz-appearance:none;
  height:0;
  border:none;
}
input[type=range].input-knob::-moz-range-track,input[type=range].input-slider::-moz-range-track{
  -moz-appearance:none;
  height:0;
  border:none;
}
input[type=checkbox].input-switch,input[type=radio].input-switch,input[type=button].input-switch {
  width:${op.switchWidth}px;
  height:${op.switchHeight}px;
  -webkit-appearance:none;
  -moz-appearance:none;
  background-size:100% 200%;
  background-position:0% 0%;
  background-repeat:no-repeat;
  border:none;
  border-radius:0;
  background-color:transparent;
  color:transparent;
}
input[type=checkbox].input-switch:checked,input[type=radio].input-switch:checked,input[type=button].input-switch:active {
  background-position:0% 100%;
}
#inputknobs-tips{
  display:inline-block;
  background:#eee;
  border:1px solid #666;
  border-radius:4px;
  position:absolute;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  transition:opacity 0.7s 0.2s ease;
}
#inputknobs-tips:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
#inputknobs-tips:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}
`;
  document.head.appendChild(styles);
  let tips=document.createElement("div");
  tips.id="inputknobs-tips";
  let tooltip=document.createElement("div");
  tips.appendChild(tooltip);
  document.body.appendChild(tips);
  let ttHover=null,ttDrag=null;
  let setTT=()=>{
    let op=0;
    let el=ttDrag||ttHover;
    if(el){
      let s=el.inputKnobs.ttstr;
      if(s){
        tips.innerHTML=s.replace("${value}",el.value);
        let rc=el.getBoundingClientRect(),rc2=tips.getBoundingClientRect();
        tips.style.left=((rc.left+rc.right)*0.5+window.pageXOffset-(rc2.right-rc2.left)*0.5)+"px";
        tips.style.top=(rc.top+window.pageYOffset-(rc2.bottom-rc2.top)-8)+"px";
        if(s.indexOf("${value}")>=0||!ttDrag)
          op=1;
      }
    }
    tips.style.opacity=op;
    if(op==0) tips.style.top="-1000px";
  }
  let makeKeyboard=(w,h,min,max,fg,bg)=>{
    let postab=[[0,0],[1,1/12],[0,1/7],[1,3/12],[0,2/7],[0,3/7],[1,6/12],[0,4/7],[1,8/12],[0,5/7],[1,10/12],[0,6/7]];
    let mn=postab[min%12][0]?min-1:min;
    let mx=postab[max%12][0]?max+1:max;
    let ow=w/(((mx/12)|0)-((mn/12)|0)+postab[mx%12][1]-postab[mn%12][1]+1/7);
    let ww=ow/7;
    let bw=ow/12;
    let svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" preserveAspectRatio="none">
<defs><path id="W" stroke="${fg}" stroke-width="1" d="M0,0v${h}h${ww}v${-h}h${-ww}z"/></defs>
<defs><path id="B" stroke="${fg}" stroke-width="2" d="M0,0v${h*0.6}h${bw}v${-h*0.6}h${-bw}z"/></defs><g fill="none">`;
    let o0=(mn/12|0)+postab[mn%12][1];
    for(let i=mn;i<=mx;++i){
      let o=(i/12)|0;
      let p=postab[i%12];
      if(!p[0])
        svg+=`<use xlink:href="#W" id="K${i}" x="${((o+p[1]-o0)*ow).toFixed(2)}"/>`;
    }
    svg+="</g>"
    for(let i=mn;i<=mx;++i){
      let o=(i/12)|0;
      let p=postab[i%12];
      if(p[0])
        svg+=`<use xlink:href="#B" id="K${i}" x="${((o+p[1]-o0)*ow).toFixed(2)}"/>`;
    }
    svg+="</svg>";
    return {svg:r,min:mn,max:mx,ww:ww,bw:bw};
  }
  let makeKnobFrames=(fr,fg,bg)=>{
    let r=
`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="${fr*64}" preserveAspectRatio="none">
<defs><g id="K"><circle cx="32" cy="32" r="30" fill="${bg}"/><line x1="32" y1="28" x2="32" y2="7" stroke-linecap="round" stroke-width="6" stroke="${fg}"/></g></defs>`;
    for(let i=0;i<fr;++i)
      r+=`<use xlink:href="#K" y="${64*i}" transform="rotate(${(-135+270*i/fr).toFixed(2)},32,${64*i+32})"/>`;
    return r+"</svg>";
  }
  let makeHSliderFrames=(fr,fg,bg,w,h)=>{
    let r=
`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${fr*h}" preserveAspectRatio="none">
<defs><rect id="B" x="0" y="0" width="${w}" height="${h}" rx="${h/2}" ry="${h/2}" fill="${bg}"/><circle id="K" cx="${h/2}" cy="${h/2}" r="${h/2*0.9}" fill="${fg}"/></defs>`;
    for(let i=0;i<fr;++i){
      r+=`<use xlink:href="#B" y="${h*i}"/>`;
      r+=`<use xlink:href="#K" x="${(w-h)*i/100}" y="${h*i}"/>`;
    }
    return r+"</svg>";
  }
  let makeVSliderFrames=(fr,fg,bg,w,h)=>{
    let r=
`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${fr*h}" preserveAspectRatio="none">
<defs><rect id="B" x="0" y="0" width="${w}" height="${h}" rx="${w/2}" ry="${w/2}" fill="${bg}"/><circle id="K" cx="${w/2}" cy="0" r="${w/2*0.9}" fill="${fg}"/></defs>`;
    for(let i=0;i<fr;++i){
      r+=`<use xlink:href="#B" y="${h*i}"/>`;
      r+=`<use xlink:href="#K" y="${h*(i+1)-w/2-i*(h-w)/100}"/>`;
    }
    return r+"</svg>";
  }
  let initKeyboards=(el)=>{
    let w,h,d,keys,min,max,fg,bg,bwidth,wwidth,bheight;
    if(el.inputKnobs)
      return;
    el.values=[];
    const ik=el.inputKnobs={oldpx:-1};
    const kp=[0,7/12,1,3*7/12,2,3,6*7/12,4,8*7/12,5,10*7/12,6];
    const kf=[0,1,0,1,0,0,1,0,1,0,1,0];
    const ko=[0,0,(7*2)/12-1,0,(7*4)/12-2,(7*5)/12-3,0,(7*7)/12-4,0,(7*9)/12-5,0,(7*11)/12-6];
    const kn=[0,2,4,5,7,9,11];
    el.refresh=()=>{
      keys=el.getAttribute("data-keys")|0;
      max=el.getAttribute("data-max")|0;
      min=el.getAttribute("data-min")|0;
      if(kf[min%12]) --min;
      if(kf[max%12]) ++max;
      max=+(keys?(min+keys-1):(max?max:+min+25));
      let st=document.defaultView.getComputedStyle(el,null);
      w=parseFloat(el.getAttribute("data-width")||d||st.width);
      h=parseFloat(el.getAttribute("data-height")||d||st.height);
      bg=el.getAttribute("data-bgcolor")||op.bgcolor;
      fg=el.getAttribute("data-fgcolor")||op.fgcolor;
      el.style.width=w+"px";
      el.style.height=h+"px";
      ik.cv=document.createElement("canvas");
      ik.cv.setAttribute("width",w);
      ik.cv.setAttribute("height",h);
      el.appendChild(ik.cv);
      ik.ctx=ik.cv.getContext("2d");
      ik.ctx.fillStyle="#f00";
      el.setAttribute("tabindex","1");
      el.addEventListener("mousedown",ik.pointerdown);
      el.addEventListener("touchstart",ik.pointerdown);
      ik.redraw();
    }
    ik.getnote=(ev)=>{
      let note;
      let rc=el.getBoundingClientRect();
      let dx=Math.max(0,ev.clientX-rc.left),dy=ev.clientY-rc.top;
      if(dy<(rc.bottom-rc.top)*0.6)
        note=min+dx/bwidth|0;
      else{
        let rr=dx/wwidth|0;
        note=min;
        while(rr>=7)
          rr-=7,note+=12;
        while(rr){
          --rr,++note;
          note+=kf[note%12];
        }
      }
      if(note>max) note=max;
      return note;
    }
    ik.pointerdown=(ev)=>{
      el.focus();
      if(ev.touches)
        ev = ev.touches[0];
      if(ev.button)
        return;
      ik.press=1;
      ik.pointermove(ev);
      document.addEventListener("mousemove",ik.pointermove);
      document.addEventListener("mouseup",ik.pointerup);
      ev.preventDefault();
      ev.stopPropagation();
    }
    ik.pointermove=(ev)=>{
      if(!ik.press)
        return;
      let px=ik.getnote(ev);
      if(ik.oldpx!=px){
        let p=el.values.indexOf(ik.oldpx);
        if(p>=0){
          el.values.splice(p,1);
          el.note=[0,ik.oldpx];
          let event=document.createEvent("HTMLEvents");
          event.initEvent("input",false,true);
          el.dispatchEvent(event);
        }
        ik.oldpx=px;
        if(el.values.indexOf(px))
          el.values.push(px);
        el.note=[1,px];
        ik.redraw();
        let event=document.createEvent("HTMLEvents");
        event.initEvent("input",false,true);
        el.dispatchEvent(event);
      }
    }
    ik.pointerup=(ev)=>{
      ik.press=0;
      let px=ik.getnote(ev);
      let p=el.values.indexOf(px);
      if(p>=0){
        el.note=[0,px];
        el.values.splice(p,1);
        ik.redraw();
        let event=document.createEvent("HTMLEvents");
        event.initEvent("input",false,true);
        el.dispatchEvent(event);
      }
      ik.oldpx=-1;
      document.removeEventListener("mousemove",ik.pointermove);
      document.removeEventListener("mouseup",ik.pointerup);
    }
    ik.redraw=()=>{
      function rrect(ctx, x, y, w, h, r, c1, c2){
        if(c2) {
          var g=ctx.createLinearGradient(x,y,x+w,y);
          g.addColorStop(0,c1);
          g.addColorStop(1,c2);
          ctx.fillStyle=g;
        }
        else
          ctx.fillStyle=c1;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x+w,y);
        ctx.lineTo(x+w,y+h-r);
        ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
        ctx.lineTo(x+r,y+h);
        ctx.quadraticCurveTo(x,y+h,x,y+h-r);
        ctx.lineTo(x,y);
        ctx.fill();
      }
      ik.ctx.fillStyle = "#000";
      ik.ctx.fillRect(0,0,w,h);
      let n=(7*((max/12)|0)+kp[max%12])-(7*((min/12)|0)+kp[min%12]);
      wwidth=(w-1)/(n+1);
      bwidth=wwidth*7/12;
      bheight=h*0.55;
      let h2=bheight;
      let r=Math.min(8,wwidth*0.2);
      for(let i=min,j=0;i<=max;++i) {
        if(kf[i%12]==0) {
          let x=wwidth*(j++)+1;
          if(el.values.indexOf(i)>=0)
            rrect(ik.ctx,x,1,wwidth-1,h-2,r,"#f00");
          else
            rrect(ik.ctx,x,1,wwidth-1,h-2,r,"#eee");
        }
      }
      r=Math.min(8,bwidth*0.3);
      for(let i=min;i<max;++i) {
        if(kf[i%12]) {
          let x=wwidth*ko[min%12]+bwidth*(i-min)+1;
          if(el.values.indexOf(i)>=0)
            rrect(ik.ctx,x,1,bwidth,h2,r,"#f00");
          else
            rrect(ik.ctx,x,1,bwidth,h2,r,"#222");
          ik.ctx.strokeStyle="#000";
          ik.ctx.stroke();
        }
      }
    }
    el.refresh();
  }
  let initSwitches=(el)=>{
    let w,h,d,fg,bg;
    if(el.inputKnobs)
      return;
    let ik=el.inputKnobs={};
    el.refresh=()=>{
      ik.ttstr=el.getAttribute("data-tooltip");
      let src=el.getAttribute("data-src");
      d=+el.getAttribute("data-diameter");
      let st=document.defaultView.getComputedStyle(el,null);
      w=parseFloat(el.getAttribute("data-width")||d||st.width);
      h=parseFloat(el.getAttribute("data-height")||d||st.height);
      bg=el.getAttribute("data-bgcolor")||op.bgcolor;
      fg=el.getAttribute("data-fgcolor")||op.fgcolor;
      el.style.width=w+"px";
      el.style.height=h+"px";
      if(src)
        el.style.backgroundImage="url("+src+")";
      else {
        let minwh=Math.min(w,h);
        let svg=
`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h*2}" viewBox="0 0 ${w} ${h*2}" preserveAspectRatio="none">
<g><rect fill="${bg}" x="1" y="1" width="${w-2}" height="${h-2}" rx="${minwh*0.25}" ry="${minwh*0.25}"/>
<rect fill="${bg}" x="1" y="${h+1}" width="${w-2}" height="${h-2}" rx="${minwh*0.25}" ry="${minwh*0.25}"/>
<circle fill="${fg}" cx="${w*0.5}" cy="${h*1.5}" r="${minwh*0.25}"/></g></svg>`;
        el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
      }
    }
    ik.mouseover=(ev)=>{
      ttHover=el;
      setTT();
    }
    ik.mouseout=(ev)=>{
      ttHover=null;
      setTT();
    }
    el.addEventListener("mouseover",ik.mouseover);
    el.addEventListener("mouseout",ik.mouseout);
    el.refresh();
  }
  let initKnobs=(el)=>{
    let w,h,d,fg,bg;
    if(el.inputKnobs){
      el.redraw();
      return;
    }
    let ik=el.inputKnobs={};
    el.refresh=()=>{
      ik.ttstr=el.getAttribute("data-tooltip");
      d=+el.getAttribute("data-diameter");
      let st=document.defaultView.getComputedStyle(el,null);
      w=parseFloat(el.getAttribute("data-width")||d||st.width);
      h=parseFloat(el.getAttribute("data-height")||d||st.height);
      bg=el.getAttribute("data-bgcolor")||op.bgcolor;
      fg=el.getAttribute("data-fgcolor")||op.fgcolor;
      ik.sensex=ik.sensey=200;
      if(el.className.indexOf("input-knob")>=0)
        ik.itype="k";
      else{
        if(w>=h){
          ik.itype="h";
          ik.sensex=w-h;
          ik.sensey=Infinity;
          el.style.backgroundSize="auto 100%";
        }
        else{
          ik.itype="v";
          ik.sensex=Infinity;
          ik.sensey=h-w;
          el.style.backgroundSize="100% auto";
        }
      }
      el.style.width=w+"px";
      el.style.height=h+"px";
      ik.frameheight=h;
      let src=el.getAttribute("data-src");
      if(src){
        el.style.backgroundImage=`url(${src})`;
        let sp=+el.getAttribute("data-sprites");
        if(sp)
          ik.sprites=sp;
        else
          ik.sprites=0;
        if(ik.sprites>=1)
          el.style.backgroundSize=`100% ${(ik.sprites+1)*100}%`;
        else if(ik.itype!="k"){
          el.style.backgroundColor=bg;
          el.style.borderRadius=Math.min(w,h)*0.25+"px";
        }
      }
      else{
        let svg;
        switch(ik.itype){
        case "k": svg=makeKnobFrames(101,fg,bg); break;
        case "h": svg=makeHSliderFrames(101,fg,bg,w,h); break;
        case "v": svg=makeVSliderFrames(101,fg,bg,w,h); break;
        }
        ik.sprites=100;
        el.style.backgroundImage="url(data:image/svg+xml;base64,"+btoa(svg)+")";
        el.style.backgroundSize=`100% ${(ik.sprites+1)*100}%`;
      }
      ik.valrange={min:+el.min, max:(el.max=="")?100:+el.max, step:(el.step=="")?1:+el.step};
      el.redraw(true);
    }
    el.setValue=(v)=>{
      let vr=ik.valrange;
      v=(Math.round((v-vr.min)/vr.step))*vr.step+vr.min;
      el.value=Math.min(vr.max,Math.max(vr.min,v));
      if(el.value!=ik.oldvalue){
        el.setAttribute("value",el.value);
        el.redraw();
        let event=document.createEvent("HTMLEvents");
        event.initEvent("input",false,true);
        el.dispatchEvent(event);
        ik.oldvalue=el.value;
        setTT();
      }
    }
    ik.pointerdown=(ev)=>{
      el.focus();
      if(ev.touches)
        ev = ev.touches[0];
      if(ev.button)
        return;
      let rc=el.getBoundingClientRect();
      let cx=(rc.left+rc.right)*0.5,cy=(rc.top+rc.bottom)*0.5;
      let dx=ev.clientX,dy=ev.clientY;
      let da=Math.atan2(ev.clientX-cx,cy-ev.clientY);
      if(ik.itype=="k"&&op.knobMode=="circularabs"){
        dv=ik.valrange.min+(da/Math.PI*0.75+0.5)*(ik.valrange.max-ik.valrange.min);
        el.setValue(dv);
      }
      if(ik.itype!="k"&&op.sliderMode=="abs"){
        dv=(ik.valrange.min+ik.valrange.max)*0.5+((dx-cx)/ik.sensex-(dy-cy)/ik.sensey)*(ik.valrange.max-ik.valrange.min);
        el.setValue(dv);
      }
      ttDrag=el;
      setTT();
      ik.dragfrom={x:ev.clientX,y:ev.clientY,a:Math.atan2(ev.clientX-cx,cy-ev.clientY),v:+el.value};
      document.addEventListener("mousemove",ik.pointermove);
      document.addEventListener("mouseup",ik.pointerup);
      document.addEventListener("touchmove",ik.pointermove);
      document.addEventListener("touchend",ik.pointerup);
      document.addEventListener("touchcancel",ik.pointerup);
      document.addEventListener("touchstart",ik.preventScroll);
      ev.preventDefault();
      ev.stopPropagation();
    }
    ik.pointermove=(ev)=>{
      let dv;
      let rc=el.getBoundingClientRect();
      let cx=(rc.left+rc.right)*0.5,cy=(rc.top+rc.bottom)*0.5;
      if(ev.touches)
        ev = ev.touches[0];
      let dx=ev.clientX-ik.dragfrom.x,dy=ev.clientY-ik.dragfrom.y;
      let da=Math.atan2(ev.clientX-cx,cy-ev.clientY);
      switch(ik.itype){
      case "k":
        switch(op.knobMode){
        case "linear":
          dv=(dx/ik.sensex-dy/ik.sensey)*(ik.valrange.max-ik.valrange.min);
          if(ev.shiftKey)
            dv*=0.2;
          el.setValue(ik.dragfrom.v+dv);
          break;
        case "circularabs":
          if(!ev.shiftKey){
            dv=ik.valrange.min+(da/Math.PI*0.75+0.5)*(ik.valrange.max-ik.valrange.min);
            el.setValue(dv);
            break;
          }
        case "circularrel":
          if(da>ik.dragfrom.a+Math.PI) da-=Math.PI*2;
          if(da<ik.dragfrom.a-Math.PI) da+=Math.PI*2;
          da-=ik.dragfrom.a;
          dv=da/Math.PI/1.5*(ik.valrange.max-ik.valrange.min);
          if(ev.shiftKey)
            dv*=0.2;
          el.setValue(ik.dragfrom.v+dv);
        }
        break;
      case "h":
      case "v":
        dv=(dx/ik.sensex-dy/ik.sensey)*(ik.valrange.max-ik.valrange.min);
        if(ev.shiftKey)
          dv*=0.2;
        el.setValue(ik.dragfrom.v+dv);
        break;
      }
    }
    ik.pointerup=()=>{
      document.removeEventListener("mousemove",ik.pointermove);
      document.removeEventListener("touchmove",ik.pointermove);
      document.removeEventListener("mouseup",ik.pointerup);
      document.removeEventListener("touchend",ik.pointerup);
      document.removeEventListener("touchcancel",ik.pointerup);
      document.removeEventListener("touchstart",ik.preventScroll);
      ttDrag=null;
      setTT();
      let event=document.createEvent("HTMLEvents");
      event.initEvent("change",false,true);
      el.dispatchEvent(event);
    }
    ik.preventScroll=(ev)=>{
      ev.preventDefault();
    }
    ik.keydown=()=>{
      el.redraw();
    }
    ik.wheel=(ev)=>{
      let delta=ev.deltaY>0?-ik.valrange.step:ik.valrange.step;
      if(!ev.shiftKey)
        delta*=5;
      el.setValue(+el.value+delta);
      ev.preventDefault();
      ev.stopPropagation();
    };
    ik.mouseover=(ev)=>{
      ttHover=el;
      setTT();
    }
    ik.mouseout=(ev)=>{
      ttHover=null;
      setTT();
    }
    el.redraw=(f)=>{
      if(f||ik.valueold!=el.value){
        let v=(el.value-ik.valrange.min)/(ik.valrange.max-ik.valrange.min);
        if(ik.sprites>0)
          el.style.backgroundPosition="0px "+(-((v*ik.sprites)|0)*ik.frameheight)+"px";
        else{
          switch(ik.itype){
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
        ik.valueold=el.value;
      }
    };
    el.refresh();
    el.redraw(true);
    el.addEventListener("keydown",ik.keydown);
    el.addEventListener("mousedown",ik.pointerdown);
    el.addEventListener("touchstart",ik.pointerdown);
    el.addEventListener("wheel",ik.wheel);
    el.addEventListener("mouseover",ik.mouseover);
    el.addEventListener("mouseout",ik.mouseout);
  }
  let refreshque=()=>{
    let elem=document.querySelectorAll("input.input-knob,input.input-slider");
    for(let i=0;i<elem.length;++i)
      procque.push([initKnobs,elem[i]]);
    elem=document.querySelectorAll("input[type=checkbox].input-switch,input[type=radio].input-switch,input[type=button].input-switch");
    for(let i=0;i<elem.length;++i)
      procque.push([initSwitches,elem[i]]);
    elem=document.querySelectorAll("div.input-keyboard");
    for(let i=0;i<elem.length;++i)
      procque.push([initKeyboards,elem[i]]);
  }
  let procque=[];
  refreshque();
  setInterval(()=>{
    for(let i=0;procque.length>0&&i<8;++i){
      let q=procque.shift();
      q[0](q[1]);
    }
    if(procque.length<=0)
      refreshque();
  },50);
});
