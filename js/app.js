"use strict";

/* --------------------------------------------------------------------------
   Exact pitch data
   String length is normalized to the complete open sounding length.
   Frequency ratio is the reciprocal of the string-length fraction.
----------------------------------------------------------------------------*/
const NOTES = [
  {label:"ا",  translit:"alif",       lenN:1,      lenD:1},
  {label:"ب",  translit:"bāʾ",        lenN:243,    lenD:256},
  {label:"ج",  translit:"jīm",        lenN:59049,  lenD:65536},
  {label:"د",  translit:"dāl",        lenN:8,      lenD:9},
  {label:"هـ", translit:"hāʾ",        lenN:27,     lenD:32},
  {label:"و",  translit:"wāw",        lenN:6561,   lenD:8192},
  {label:"ز",  translit:"zāy",        lenN:64,     lenD:81},
  {label:"ح",  translit:"ḥāʾ",        lenN:3,      lenD:4},
  {label:"ط",  translit:"ṭāʾ",        lenN:729,    lenD:1024},
  {label:"ي",  translit:"yāʾ",        lenN:177147, lenD:262144},
  {label:"يا", translit:"yā-alif",    lenN:2,      lenD:3},
  {label:"يب", translit:"yā-bāʾ",     lenN:81,     lenD:128},
  {label:"يج", translit:"yā-jīm",     lenN:19683,  lenD:32768},
  {label:"يد", translit:"yā-dāl",     lenN:16,     lenD:27},
  {label:"يه", translit:"yā-hāʾ",     lenN:9,      lenD:16},
  {label:"يو", translit:"yā-wāw",     lenN:2187,   lenD:4096},
  {label:"يز", translit:"yā-zāy",     lenN:531441, lenD:1048576},
  {label:"يح", translit:"yā-ḥāʾ",     lenN:1,      lenD:2}
];

const STEP_TYPES = ["L","L","C","L","L","C","L","L","L","C","L","L","C","L","L","L","C"];
const LIMMA = {n:256,d:243};
const COMMA = {n:531441,d:524288};

const CONSTRUCTION = [
  {note:"ا", heading:"Begin with the open string", copy:"Normalize the complete sounding length to 1. This is the reference tone.", equation:"length(ا) = 1/1 → frequency(ا) = 1/1", divisions:1, active:1},
  {note:"يح",heading:"Locate the octave by halving the string",copy:"Divide the complete string into two equal parts. A sounding length of 1/2 produces twice the reference frequency.",equation:"length(يح) = 1/2 → frequency(يح) = 2/1",divisions:2,active:1},
  {note:"يا",heading:"Locate the perfect fifth",copy:"Divide the string into three equal parts and retain a sounding length of two parts.",equation:"length(يا) = 2/3 → frequency(يا) = 3/2",divisions:3,active:2},
  {note:"ح",heading:"Locate the perfect fourth",copy:"Divide the string into four equal parts and retain a sounding length of three parts.",equation:"length(ح) = 3/4 → frequency(ح) = 4/3",divisions:4,active:3},
  {note:"يه",heading:"Apply the three-quarter relation again",copy:"Apply the 3/4 length relation to the already established 3/4 position.",equation:"length(يه) = (3/4) × (3/4) = 9/16",from:"ح",multiplier:"3/4"},
  {note:"د",heading:"Locate the eight-ninths position",copy:"Divide the complete string into nine equal parts and retain eight parts.",equation:"length(د) = 8/9 → frequency(د) = 9/8",divisions:9,active:8},
  {note:"ز",heading:"Apply the eight-ninths relation again",copy:"Apply the 8/9 length relation to the already established 8/9 position.",equation:"length(ز) = (8/9) × (8/9) = 64/81",from:"د",multiplier:"8/9"},
  {note:"هـ",heading:"Extend the fourth position by one eighth",copy:"Divide the segment from the bridge to ح into eight parts and add one equal part on the heavier side.",equation:"length(هـ) = (3/4) × (9/8) = 27/32",from:"ح",multiplier:"9/8"},
  {note:"ب",heading:"Extend هـ by one eighth",copy:"Divide the segment from the bridge to هـ into eight parts and add one equal part.",equation:"length(ب) = (27/32) × (9/8) = 243/256",from:"هـ",multiplier:"9/8"},
  {note:"يب",heading:"Transfer the two-thirds relation",copy:"Take two thirds of the established length 243/256.",equation:"length(يب) = (243/256) × (2/3) = 81/128",from:"ب",multiplier:"2/3"},
  {note:"ط",heading:"Transfer the three-quarter relation",copy:"Take three quarters of the established length 243/256.",equation:"length(ط) = (243/256) × (3/4) = 729/1024",from:"ب",multiplier:"3/4"},
  {note:"يو",heading:"Apply three quarters once more",copy:"Take three quarters of the 729/1024 position.",equation:"length(يو) = (729/1024) × (3/4) = 2187/4096",from:"ط",multiplier:"3/4"},
  {note:"و",heading:"Extend يو by one half of itself",copy:"Bisect the segment ending at يو and add one equal half on the heavier side.",equation:"length(و) = (2187/4096) × (3/2) = 6561/8192",from:"يو",multiplier:"3/2"},
  {note:"ج",heading:"Extend و by one eighth",copy:"Divide the segment ending at و into eight parts and add one equal part.",equation:"length(ج) = (6561/8192) × (9/8) = 59049/65536",from:"و",multiplier:"9/8"},
  {note:"ي",heading:"Take three quarters of ج",copy:"Apply the 3/4 relation to the position ج.",equation:"length(ي) = (59049/65536) × (3/4) = 177147/262144",from:"ج",multiplier:"3/4"},
  {note:"يز",heading:"Take three quarters of ي",copy:"Apply the 3/4 relation to the position ي.",equation:"length(يز) = (177147/262144) × (3/4) = 531441/1048576",from:"ي",multiplier:"3/4"},
  {note:"يج",heading:"Take three quarters of و",copy:"Apply the 3/4 relation to the position و.",equation:"length(يج) = (6561/8192) × (3/4) = 19683/32768",from:"و",multiplier:"3/4"},
  {note:"يد",heading:"Take three quarters of ز",copy:"Apply the 3/4 relation to the position ز, completing the encoded set.",equation:"length(يد) = (64/81) × (3/4) = 16/27",from:"ز",multiplier:"3/4"}
];

const $ = id => document.getElementById(id);
const svgNS = "http://www.w3.org/2000/svg";
const noteIndex = Object.fromEntries(NOTES.map((n,i)=>[n.label,i]));
const lengthValue = n => n.lenN/n.lenD;
const frequencyRatio = n => n.lenD/n.lenN;
const cents = n => 1200*Math.log2(frequencyRatio(n));
const fstr = (n,d)=>`${n}/${d}`;
const fixed = (x,d=3)=>Number(x).toFixed(d);

function gcd(a,b){while(b!==0){[a,b]=[b,a%b]}return Math.abs(a)}
function reduce(n,d){const g=gcd(n,d);return {n:n/g,d:d/g}}
function intervalBetween(a,b){
  const r=reduce(b.lenD*a.lenN,b.lenN*a.lenD);
  return {...r,cents:1200*Math.log2(r.n/r.d)}
}
function createSvg(tag,attrs={},text=""){
  const el=document.createElementNS(svgNS,tag);
  Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
  if(text)el.textContent=text;
  return el;
}

let activePanel="explore";
let selected=0;
let constructionStep=0;
let constructionTimer=null;
let audioContext=null;
let quizMode="theory";
let quizCurrent=null;
let scoreCorrect=0;
let scoreTotal=0;

/* Fit the complete 1280 × 720 application into the available viewport. */
function fitApp(){
  const responsive=window.matchMedia("(max-width:1100px)").matches || new URLSearchParams(location.search).get("embed")==="1" || window.self!==window.top;
  if(responsive){$("app").style.transform="none";return}
  const scale=Math.min(window.innerWidth/1280,window.innerHeight/720);
  $("app").style.transform=`scale(${scale})`;
}
window.addEventListener("resize",fitApp);
fitApp();

/* Audio */
function ctx(){
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==="suspended") audioContext.resume();
  return audioContext;
}
function currentBase(){return Number($("baseFrequency").value)||220}
function currentWave(){return activePanel==="listen"?$("listenWaveform").value:$("waveform").value}
function tone(index,delay=0,duration=.68,volume=.14){
  const c=ctx(),now=c.currentTime+delay;
  const osc=c.createOscillator(),gain=c.createGain();
  osc.type=currentWave();
  osc.frequency.setValueAtTime(currentBase()*frequencyRatio(NOTES[index]),now);
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(volume,now+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain).connect(c.destination);
  osc.start(now);osc.stop(now+duration+.04);
}
function toneRatio(n,d,delay=0){
  const c=ctx(),now=c.currentTime+delay;
  const osc=c.createOscillator(),gain=c.createGain();
  osc.type=currentWave();osc.frequency.value=currentBase()*(n/d);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.14,now+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,now+.7);
  osc.connect(gain).connect(c.destination);osc.start(now);osc.stop(now+.74);
}

/* Monochord */
const X0=193,X1=998,Y=61;
const xFor=n=>X0+lengthValue(n)*(X1-X0);
const INSTRUMENT = {bridgeX:193,nutX:998,railY:26,stringY:75,top:8,bottom:114};
const instrumentXFor=n=>INSTRUMENT.bridgeX + lengthValue(n)*(INSTRUMENT.nutX-INSTRUMENT.bridgeX);
function monoLabel(n,i){
  const mode=$("labelMode").value;
  if(mode==="index")return String(i+1);
  if(mode==="cents")return `${fixed(cents(n),0)}¢`;
  return n.label;
}
function renderIntervals(){
  const layer=$("intervalLayer");layer.innerHTML="";
  for(let i=1;i<NOTES.length;i++){
    const xa=xFor(NOTES[i-1]),xb=xFor(NOTES[i]);
    layer.appendChild(createSvg("rect",{
      x:Math.min(xa,xb),y:113,width:Math.max(2,Math.abs(xa-xb)),height:7,
      class:STEP_TYPES[i-1]==="C"?"interval-comma":"interval-limma"
    }));
  }
}
function renderMonochord(){
  const layer=$("fretLayer");layer.innerHTML="";
  const constructed=new Set(CONSTRUCTION.slice(0,constructionStep+1).map(s=>s.note));
  NOTES.forEach((n,i)=>{
    const x=xFor(n),tier=i%4;
    const ys=[17,35,94,113],labelY=ys[tier];
    const stemEnd=tier<2?labelY+5:labelY-13;
    const group=createSvg("g",{
      class:`fret ${i===0||i===17?"endpoint ":""}${i===selected&&activePanel!=="construct"?"active ":""}${activePanel==="construct"&&CONSTRUCTION[constructionStep].note===n.label?"active ":""}${constructed.has(n.label)?"constructed":""}`,
      tabindex:"0",role:"button","aria-label":`${n.label}, ${fixed(cents(n))} cents`
    });
    let opacity=1;
    if(activePanel==="construct"&&!constructed.has(n.label))opacity=.12;
    group.setAttribute("opacity",opacity);
    group.appendChild(createSvg("line",{x1:x,y1:Y-6,x2:x,y2:stemEnd,class:"stem"}));
    group.appendChild(createSvg("circle",{cx:x,cy:Y,r:13,class:"fret-hit",fill:"transparent"}));
    group.appendChild(createSvg("circle",{cx:x,cy:Y,r:(i===selected&&activePanel!=="construct")||CONSTRUCTION[constructionStep].note===n.label?6.3:4.5,class:"dot"}));
    group.appendChild(createSvg("text",{x,y:labelY,"text-anchor":"middle",class:"label"},monoLabel(n,i)));
    group.appendChild(createSvg("text",{x,y:tier<2?labelY+10:labelY+9,"text-anchor":"middle",class:"small-label"},i+1));
    group.addEventListener("click",()=>{activatePanel("explore");selectNote(i,true)});
    group.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activatePanel("explore");selectNote(i,true)}});
    layer.appendChild(group);
  });
  renderConstructionGuide();
  renderInstrument();
}
function renderConstructionGuide(){
  const layer=$("guideLayer");layer.innerHTML="";
  if(activePanel!=="construct")return;
  const step=CONSTRUCTION[constructionStep];
  if(step.divisions&&step.divisions>1){
    for(let i=1;i<step.divisions;i++){
      const x=X0+(X1-X0)*(i/step.divisions);
      layer.appendChild(createSvg("line",{x1:x,y1:47,x2:x,y2:76,class:"guide-line"}));
    }
    layer.appendChild(createSvg("text",{x:622,y:9,"text-anchor":"middle",class:"guide-text"},`${step.divisions} equal divisions · retain ${step.active}`));
  }else if(step.from){
    const a=NOTES[noteIndex[step.from]],b=NOTES[noteIndex[step.note]];
    const xa=xFor(a),xb=xFor(b),mid=(xa+xb)/2;
    layer.appendChild(createSvg("path",{d:`M ${xa} 43 Q ${mid} 4 ${xb} 43`,fill:"none",class:"guide-line"}));
    layer.appendChild(createSvg("text",{x:mid,y:10,"text-anchor":"middle",class:"guide-text"},`× ${step.multiplier}`));
  }
}

function renderInstrument(){
  const layer=$("instrumentOverlayLayer");
  if(!layer)return;
  layer.innerHTML="";

  const focusIndex = activePanel==="construct" ? noteIndex[CONSTRUCTION[constructionStep].note] : selected;
  const constructed=new Set(CONSTRUCTION.slice(0,constructionStep+1).map(s=>s.note));

  layer.appendChild(createSvg("line",{x1:INSTRUMENT.bridgeX,y1:INSTRUMENT.railY,x2:INSTRUMENT.nutX,y2:INSTRUMENT.railY,class:"instrument-rail"}));

  NOTES.forEach((n,i)=>{
    const x=instrumentXFor(n);
    const visible=activePanel!=="construct" || constructed.has(n.label);
    const dim=activePanel==="construct" && !visible;
    if(i>0 && visible){
      layer.appendChild(createSvg("line",{x1:x,y1:INSTRUMENT.railY+3,x2:x,y2:62,class:"instrument-fretline",opacity:0.16}));
    }
    const dotClass=i===focusIndex?"instrument-dot gold":`instrument-dot ${dim?"dim":""}`;
    layer.appendChild(createSvg("circle",{cx:x,cy:INSTRUMENT.railY,r:i===focusIndex?4.4:3.0,class:dotClass,opacity:dim?0.16:1}));
    const hit=createSvg("rect",{x:x-11,y:INSTRUMENT.top,width:22,height:INSTRUMENT.bottom-INSTRUMENT.top,class:"instrument-hotzone"});
    hit.addEventListener("click",()=>{activatePanel("explore");selectNote(i,true)});
    layer.appendChild(hit);
  });

  layer.appendChild(createSvg("line",{x1:INSTRUMENT.bridgeX,y1:INSTRUMENT.railY-2,x2:INSTRUMENT.bridgeX,y2:92,class:"instrument-guide"}));
  layer.appendChild(createSvg("line",{x1:INSTRUMENT.nutX,y1:INSTRUMENT.railY-2,x2:INSTRUMENT.nutX,y2:92,class:"instrument-guide"}));

  const current=NOTES[focusIndex];
  const x=instrumentXFor(current);
  layer.appendChild(createSvg("line",{x1:x,y1:INSTRUMENT.railY+1,x2:x,y2:96,class:"instrument-focus-line"}));
  layer.appendChild(createSvg("circle",{cx:x,cy:96,r:4.0,class:"instrument-dot gold"}));
  layer.appendChild(createSvg("text",{x:x,y:10,"text-anchor":"middle",class:"instrument-focus-label"},current.label));
  }

/* Explore */
function previousStepInfo(index){
  if(index===0)return null;
  const r=intervalBetween(NOTES[index-1],NOTES[index]);
  return {...r,type:STEP_TYPES[index-1]==="C"?"Comma":"Limma"}
}
function selectNote(index,play=false){
  selected=Math.max(0,Math.min(NOTES.length-1,index));
  updateExplore();renderMonochord();renderTable();
  if(play)tone(selected);
}
function updateExplore(){
  const n=NOTES[selected],base=currentBase(),cm=Number($("stringLength").value)||100;
  const hz=base*frequencyRatio(n),bridge=cm*lengthValue(n),nut=cm-bridge;
  const prev=previousStepInfo(selected);
  $("noteOrb").textContent=n.label;
  $("noteName").textContent=selected===0?"Open string":n.translit;
  $("noteSub").textContent=`${n.translit} · position ${selected+1} of 18`;
  $("lengthRatio").textContent=fstr(n.lenN,n.lenD);
  $("frequencyRatio").textContent=fstr(n.lenD,n.lenN);
  $("centsValue").textContent=`${fixed(cents(n))}¢`;
  $("frequencyValue").textContent=`${fixed(hz,2)} Hz`;
  $("bridgeValue").textContent=`${fixed(bridge,2)} cm`;
  $("nutValue").textContent=`${fixed(nut,2)} cm`;
  $("previousValue").textContent=prev?`${prev.type} · ${prev.n}/${prev.d}`:"—";
  $("pitchOrder").textContent=`${selected+1} / 18`;
  $("selectedCaption").textContent=`${n.label} · ${fixed(cents(n))}¢`;
  $("formulaBox").textContent=`frequency = ${fixed(base,2)} × (${n.lenD}/${n.lenN}) = ${fixed(hz,2)} Hz`;
  $("previousNote").disabled=selected===0;$("nextNote").disabled=selected===NOTES.length-1;
  if(prev){
    $("intervalBadge").className=`interval-badge ${prev.type==="Comma"?"comma":""}`;
    $("intervalBadge").textContent=`${prev.type} above ${NOTES[selected-1].label}`;
    $("intervalRatio").textContent=`${prev.n}/${prev.d}`;
    $("intervalText").textContent=`This adjacent frequency step is ${fixed(prev.cents)} cents. Its exact ratio follows from the reciprocal string lengths.`;
  }else{
    $("intervalBadge").className="interval-badge";
    $("intervalBadge").textContent="Reference point";
    $("intervalRatio").textContent="1/1";
    $("intervalText").textContent="The open string is the reference from which all other positions are calculated.";
  }
  $("statusMessage").textContent=`Explore mode · ${n.label} selected · ${fixed(hz,2)} Hz`;
  updateListen();
}
function renderStepStrips(){
  ["stepStrip","listenStepStrip"].forEach(id=>{
    const el=$(id);el.innerHTML="";
    STEP_TYPES.forEach((type,i)=>{
      const chip=document.createElement("span");
      chip.className=`step-chip ${type}`;chip.textContent=type;
      chip.title=`${NOTES[i].label} → ${NOTES[i+1].label}: ${type==="L"?"limma":"comma"}`;
      el.appendChild(chip);
    });
  });
}

/* Construction */
function renderStepGrid(){
  const grid=$("stepGrid");grid.innerHTML="";
  CONSTRUCTION.forEach((s,i)=>{
    const b=document.createElement("button");
    b.className=`step-tile ${i<constructionStep?"done":""} ${i===constructionStep?"current":""}`;
    b.innerHTML=`<span class="tile-num">${i}</span><span class="tile-ar">${s.note}</span><span class="tile-name">${s.heading}</span>`;
    b.addEventListener("click",()=>setConstruction(i));
    grid.appendChild(b);
  });
}
function setConstruction(index){
  constructionStep=Math.max(0,Math.min(CONSTRUCTION.length-1,index));
  const s=CONSTRUCTION[constructionStep],n=NOTES[noteIndex[s.note]];
  $("constructionCount").textContent=`Step ${constructionStep} of 17`;
  $("constructionSymbol").textContent=s.note;
  $("constructionHeading").textContent=s.heading;
  $("constructionCopy").textContent=s.copy;
  $("constructionEquation").textContent=s.equation;
  $("constructionPrev").disabled=constructionStep===0;
  $("constructionNext").disabled=constructionStep===CONSTRUCTION.length-1;
  $("guideLength").textContent=fstr(n.lenN,n.lenD);
  $("guideFrequency").textContent=fstr(n.lenD,n.lenN);
  $("guideCents").textContent=`${fixed(cents(n))}¢`;
  renderGuideVisual(s,n);renderStepGrid();renderMonochord();
  $("statusMessage").textContent=`Construction step ${constructionStep} · ${s.note} · ${s.heading}`;
}
function renderGuideVisual(s,n){
  const left=25,right=25,width=310;
  const pct=lengthValue(n);
  $("guideCurrent").style.left=`${left+pct*width}px`;
  $("guideLabel").style.left=`${left+pct*width}px`;
  $("guideLabel").textContent=n.label;
  const divs=$("guideDivisions");divs.innerHTML="";
  if(s.divisions){
    for(let i=1;i<s.divisions;i++){
      const line=document.createElement("span");line.className="guide-division";
      line.style.left=`${left+(i/s.divisions)*width}px`;divs.appendChild(line);
    }
    $("guideNote").textContent=`Divide the complete length into ${s.divisions} equal part${s.divisions===1?"":"s"}; the marked sounding length is ${s.active}/${s.divisions}.`;
  }else{
    $("guideNote").textContent=`Derived from ${s.from} by multiplying its sounding length by ${s.multiplier}.`;
  }
}
function toggleConstructionAuto(){
  if(constructionTimer){
    clearInterval(constructionTimer);constructionTimer=null;$("autoConstruction").textContent="▶ Auto";return;
  }
  if(constructionStep===CONSTRUCTION.length-1)setConstruction(0);
  $("autoConstruction").textContent="■ Stop";
  constructionTimer=setInterval(()=>{
    if(constructionStep>=CONSTRUCTION.length-1){
      clearInterval(constructionTimer);constructionTimer=null;$("autoConstruction").textContent="▶ Auto";return;
    }
    setConstruction(constructionStep+1);
    tone(noteIndex[CONSTRUCTION[constructionStep].note],0,.45,.10);
  },1000);
}

/* Listen */
function populateSelect(id,defaultIndex){
  const sel=$(id);sel.innerHTML="";
  NOTES.forEach((n,i)=>{
    const o=document.createElement("option");o.value=i;
    o.textContent=`${n.label} · ${n.lenD}/${n.lenN} · ${fixed(cents(n),1)}¢`;sel.appendChild(o);
  });
  sel.value=defaultIndex;
}
function updateListen(){
  const a=Number($("toneA").value||0),b=Number($("toneB").value||10);
  const na=NOTES[a],nb=NOTES[b],base=currentBase();
  $("frequencyRange").value=Math.max(110,Math.min(440,base));
  $("frequencyRangeValue").textContent=`${fixed(base,0)} Hz`;
  $("toneALabel").textContent=na.label;$("toneALatin").textContent=na.translit;
  $("toneAHz").textContent=`${fixed(base*frequencyRatio(na),2)} Hz`;
  $("toneACents").textContent=`${fixed(cents(na))}¢`;
  $("toneBLabel").textContent=nb.label;$("toneBLatin").textContent=nb.translit;
  $("toneBHz").textContent=`${fixed(base*frequencyRatio(nb),2)} Hz`;
  $("toneBCents").textContent=`${fixed(cents(nb))}¢`;
  const ratio=intervalBetween(na,nb),absC=Math.abs(cents(nb)-cents(na));
  $("comparisonRatio").textContent=`B/A = ${ratio.n}/${ratio.d}`;
  $("comparisonCents").textContent=`${fixed(absC)}¢`;
}
function setBase(value){
  const v=Math.max(40,Math.min(1000,Number(value)||220));
  $("baseFrequency").value=v;$("frequencyRange").value=Math.max(110,Math.min(440,v));
  $("frequencyRangeValue").textContent=`${fixed(v,0)} Hz`;
  updateExplore();updateListen();renderTable();
}

/* Table */
function renderTable(){
  const body=$("pitchTableBody"),base=currentBase();body.innerHTML="";
  NOTES.forEach((n,i)=>{
    const tr=document.createElement("tr");
    if(i===selected)tr.className="selected-row";
    const prev=previousStepInfo(i);
    tr.innerHTML=`<td>${i+1}</td><td>${n.label}</td><td>${n.lenN}/${n.lenD}</td><td>${n.lenD}/${n.lenN}</td><td>${fixed(cents(n))}</td><td>${fixed(base*frequencyRatio(n),2)}</td><td>${prev?prev.type:"—"}</td>`;
    tr.addEventListener("click",()=>{selectNote(i,false);activatePanel("explore")});
    body.appendChild(tr);
  });
  $("tableFrequencyCaption").textContent=`Hz calculated at ${fixed(base,0)} Hz`;
}

/* Quiz */
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function randomIndex(){return Math.floor(Math.random()*NOTES.length)}
function optionIndices(correct,count=4){
  const set=new Set([correct]);while(set.size<count)set.add(randomIndex());return shuffled([...set])
}
function newTheoryQuestion(){
  const type=Math.floor(Math.random()*4),i=randomIndex(),n=NOTES[i];
  if(type===0){
    quizCurrent={answer:n.label,prompt:`Which Abjad position has string length ${n.lenN}/${n.lenD}?`,options:optionIndices(i).map(j=>NOTES[j].label),explain:`${n.label} has string length ${n.lenN}/${n.lenD} and frequency ratio ${n.lenD}/${n.lenN}.`};
  }else if(type===1){
    quizCurrent={answer:`${n.lenD}/${n.lenN}`,prompt:`Which frequency ratio belongs to ${n.label}?`,options:optionIndices(i).map(j=>`${NOTES[j].lenD}/${NOTES[j].lenN}`),explain:`Frequency is the reciprocal of length: 1 ÷ (${n.lenN}/${n.lenD}) = ${n.lenD}/${n.lenN}.`};
  }else if(type===2){
    const j=Math.max(1,i),prev=previousStepInfo(j);
    quizCurrent={answer:prev.type,prompt:`What is the adjacent step from ${NOTES[j-1].label} to ${NOTES[j].label}?`,options:shuffled(["Limma","Comma","Whole tone","Perfect fourth"]),explain:`It is a ${prev.type.toLowerCase()}: ${prev.n}/${prev.d} ≈ ${fixed(prev.cents)} cents.`};
  }else{
    quizCurrent={answer:`${fixed(cents(n),1)}¢`,prompt:`Approximately how high is ${n.label} above the open string?`,options:shuffled([`${fixed(cents(n),1)}¢`,`${fixed(Math.max(0,cents(n)+90.225),1)}¢`,`${fixed(Math.max(0,cents(n)-90.225),1)}¢`,`${fixed(Math.max(0,cents(n)+23.46),1)}¢`]),explain:`${n.label} is ${fixed(cents(n))} cents above the open string.`};
  }
  renderQuestion();
}
function newEarQuestion(){
  const i=randomIndex();quizCurrent={earIndex:i,answer:NOTES[i].label,prompt:"Listen to the mystery tone, then identify its Abjad position.",options:optionIndices(i).map(j=>NOTES[j].label),explain:`The tone was ${NOTES[i].label}: ${fixed(cents(NOTES[i]))} cents above the open string.`};
  renderQuestion();
  const play=document.createElement("button");play.className="btn primary";play.textContent="▶ Play mystery tone";play.style.marginBottom="8px";
  play.addEventListener("click",()=>tone(i));$("quizOptions").before(play);quizCurrent.playButton=play;
  setTimeout(()=>tone(i),120);
}
function renderQuestion(){
  $("quizQuestion").textContent=quizCurrent.prompt;$("quizFeedback").textContent="Choose one answer.";
  const box=$("quizOptions");box.innerHTML="";
  quizCurrent.options.forEach(opt=>{
    const b=document.createElement("button");b.className="quiz-option";b.textContent=opt;
    b.addEventListener("click",()=>answerQuiz(b,opt));box.appendChild(b);
  });
}
function answerQuiz(button,value){
  if(quizCurrent.answered)return;quizCurrent.answered=true;
  const ok=value===quizCurrent.answer;scoreTotal++;if(ok)scoreCorrect++;
  [...$("quizOptions").children].forEach(b=>{if(b.textContent===quizCurrent.answer)b.classList.add("correct")});
  if(!ok)button.classList.add("wrong");
  $("quizFeedback").textContent=`${ok?"Correct.":"Not yet."} ${quizCurrent.explain}`;
  updateScore();
}
function updateScore(){
  $("quizScore").textContent=`Score: ${scoreCorrect} / ${scoreTotal}`;
  $("quizScoreTop").textContent=`${scoreCorrect} correct / ${scoreTotal}`;
}
function newQuestion(){
  document.querySelectorAll(".quiz-body > .btn.primary").forEach(b=>b.remove());
  quizMode==="ear"?newEarQuestion():newTheoryQuestion();
}

/* Navigation */
function activatePanel(name){
  activePanel=name;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===name));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===`panel-${name}`));
  $("monoHint").textContent=name==="construct"?"Construction positions are revealed in source order":"Select any fret to inspect and hear it";
  if(name==="construct"){
    setConstruction(constructionStep);
  }else{
    renderMonochord();
    if(name==="listen"){
      updateListen();
      const a=NOTES[Number($("toneA").value)],b=NOTES[Number($("toneB").value)];
      $("statusMessage").textContent=`Listen mode · ${a.label} compared with ${b.label} · base ${fixed(currentBase(),0)} Hz`;
    }
    if(name==="train"){
      renderTable();
      $("statusMessage").textContent="Training mode · exact pitch table and interactive questions";
    }
    if(name==="explore")updateExplore();
  }
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>activatePanel(b.dataset.panel)));

/* Events */
$("fullscreenBtn")?.addEventListener("click",async()=>{
  try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){}
});
$("baseFrequency").addEventListener("input",e=>setBase(e.target.value));
$("frequencyRange").addEventListener("input",e=>setBase(e.target.value));
$("stringLength").addEventListener("input",updateExplore);
$("labelMode").addEventListener("change",renderMonochord);
$("playSelected").addEventListener("click",()=>tone(selected));
$("playOpen").addEventListener("click",()=>tone(0));
$("compareSequential").addEventListener("click",()=>{tone(0,0,.6);tone(selected,.72,.6)});
$("compareTogether").addEventListener("click",()=>{tone(0,0,.85,.09);tone(selected,0,.85,.09)});
$("previousNote").addEventListener("click",()=>selectNote(selected-1,true));
$("nextNote").addEventListener("click",()=>selectNote(selected+1,true));

$("constructionPrev").addEventListener("click",()=>setConstruction(constructionStep-1));
$("constructionNext").addEventListener("click",()=>setConstruction(constructionStep+1));
$("constructionPlay").addEventListener("click",()=>tone(noteIndex[CONSTRUCTION[constructionStep].note]));
$("autoConstruction").addEventListener("click",toggleConstructionAuto);

$("toneA").addEventListener("change",updateListen);$("toneB").addEventListener("change",updateListen);
$("listenOpen").addEventListener("click",()=>tone(0));
$("listenA").addEventListener("click",()=>tone(Number($("toneA").value)));
$("listenB").addEventListener("click",()=>tone(Number($("toneB").value)));
$("listenAscent").addEventListener("click",()=>NOTES.forEach((_,i)=>tone(i,i*.22,.38,.10)));
$("playSequenceAB").addEventListener("click",()=>{tone(Number($("toneA").value),0,.65);tone(Number($("toneB").value),.76,.65)});
$("playTogetherAB").addEventListener("click",()=>{tone(Number($("toneA").value),0,.9,.09);tone(Number($("toneB").value),0,.9,.09)});
$("swapAB").addEventListener("click",()=>{const a=$("toneA").value;$("toneA").value=$("toneB").value;$("toneB").value=a;updateListen()});
$("playLimma").addEventListener("click",()=>{toneRatio(1,1,0);toneRatio(LIMMA.n,LIMMA.d,.78)});
$("playComma").addEventListener("click",()=>{toneRatio(1,1,0);toneRatio(COMMA.n,COMMA.d,.78)});

document.querySelectorAll(".quiz-mode").forEach(b=>b.addEventListener("click",()=>{
  quizMode=b.dataset.quizMode;document.querySelectorAll(".quiz-mode").forEach(x=>x.classList.toggle("active",x===b));newQuestion();
}));
$("newQuestion").addEventListener("click",newQuestion);

window.addEventListener("keydown",e=>{
  if(e.target.matches("input,select,button"))return;
  if(e.key==="ArrowLeft")selectNote(selected-1,true);
  if(e.key==="ArrowRight")selectNote(selected+1,true);
  if(e.key===" "){e.preventDefault();tone(selected)}
});

/* Initial render */
populateSelect("toneA",0);populateSelect("toneB",10);
renderIntervals();renderStepStrips();renderStepGrid();renderMonochord();
updateExplore();setConstruction(0);updateListen();renderTable();newQuestion();activatePanel("explore");fitApp();

/* ==========================================================================
   Multilingual interface layer
   - Automatic browser-language detection
   - Manual choice: English, Persian, Arabic, Turkish
   - Unsupported browser languages fall back to English
   ========================================================================== */
const UI = {
  en: {
    metaTitle:"Al-Urmawī Monochord Atlas",
    eyebrow:"Systematist School · Interactive Monochord Atlas",
    title:"On the Divisions of the Frets",
    subtitle:"Ṣafī al-Dīn al-Urmawī · geometry, exact ratios, listening, construction, and training",
    sourceChip:"17 positions + octave · exact rational data",
    fullscreen:"⛶ Fullscreen", fullscreenTitle:"Open in fullscreen",
    autoLanguage:"Auto · Browser",
    bridge:"م — bridge (mashṭ)",
    nut:"ا — nut (anf) · open string",
    hintExplore:"Select any fret to inspect and hear it",
    hintConstruct:"Construction positions are revealed in source order",
    tabLearn:"Learn", tabExplore:"Explore", tabConstruct:"Construct", tabListen:"Listen", tabModes:"Species & Modes", tabTrain:"Train & Data",
    openString:"Open string", position:"position {current} of {total}",
    stringLength:"String length", frequencyRatio:"Frequency ratio", cents:"Cents",
    frequency:"Frequency", fromBridge:"From bridge", fromNut:"From nut",
    previousStep:"Previous step", pitchOrder:"Pitch order",
    playSelected:"▶ Selected", playOpen:"▶ Open tone",
    geometryKicker:"Geometry → acoustics", governing:"The governing relationship",
    governingP1:"The whole sounding string is normalized to 1. If the remaining sounding length is ℓ, the ideal frequency ratio is its reciprocal.",
    governingP2:"The 18 written points represent the open string, 17 pitch positions within the octave, and the octave repetition. They form a parent pitch lattice, not a single mandatory performance scale.",
    openFrequency:"Open frequency", stringLengthCm:"String length (cm)", waveform:"Waveform",
    monochordLabels:"Monochord labels", sine:"Sine", triangle:"Triangle", sawtooth:"Sawtooth",
    abjad:"Abjad", index:"Index", centsOption:"Cents",
    openToSelected:"▶ Open → selected", soundTogether:"▶ Sound together",
    adjacentInterval:"Adjacent interval", exactStep:"Exact step",
    referencePoint:"Reference point",
    referenceText:"The open string is the reference from which all other positions are calculated.",
    previous:"← Previous", next:"Next →", limma:"Limma", comma:"Comma",
    above:"{type} above {label}",
    adjacentText:"This adjacent frequency step is {cents} cents. Its exact ratio follows from the reciprocal string lengths.",
    sourceGuided:"Source-guided construction", modernWording:"Modern wording",
    constructionCaution:"The ratios are exact. The explanatory English is a cautious pedagogical paraphrase of the supplied diagrams and instructions.",
    hear:"▶ Hear", geometricOperation:"Geometrical operation", auto:"▶ Auto", stop:"■ Stop",
    length:"Length", completeSequence:"Complete sequence", clickAnyStep:"Click any step",
    divideGuide:"Divide the complete length into {divisions} equal part(s); the marked sounding length is {active}/{divisions}.",
    derivedGuide:"Derived from {from} by multiplying its sounding length by {multiplier}.",
    fullGuide:"Full normalized string: bridge م at left, nut ا at right.",
    soundLab:"Sound Atlas", webAudio:"Web Audio", openPitch:"Open pitch",
    toneA:"Tone A", toneB:"Tone B",
    soundCaution:"For theoretical comparison, a sine wave makes beating and interval size easier to hear. The sound is a modern synthesis, not a reconstruction of a medieval instrument timbre.",
    playOpenShort:"▶ Open", playA:"▶ Tone A", playB:"▶ Tone B", fullAscent:"▶ Full ascent",
    compareTwo:"Compare two positions", playSequence:"▶ A then B", together:"▶ Together", swap:"⇄ Swap",
    octavePattern:"Octave step pattern",
    patternCopy:"Every adjacent step is either a limma or a Pythagorean comma. The unequal sequence demonstrates that this is not 17-tone equal temperament.",
    hearLimma:"▶ Hear limma", hearComma:"▶ Hear comma",
    interactiveTraining:"Interactive training", theoryRatios:"Theory & ratios", earTraining:"Ear training",
    loading:"Loading question…", choose:"Choose one answer.", score:"Score: {correct} / {total}",
    scoreTop:"{correct} correct / {total}", newQuestion:"New question",
    pitchLattice:"Exact pitch lattice · ascending order",
    hzAt:"Hz calculated at {hz} Hz",
    thNumber:"#", thLabel:"Label", thLength:"String length", thRatio:"Frequency ratio",
    thCents:"Cents", thHz:"Hz", thPrevious:"Previous step",
    statusExplore:"Explore mode · {label} selected · {hz} Hz",
    statusConstruct:"Construction step {step} · {label} · {heading}",
    statusListen:"Listen mode · {a} compared with {b} · base {hz} Hz",
    statusTrain:"Training mode · exact pitch table and interactive questions",
    constructionStep:"Step {step} of 17",
    qLength:"Which Abjad position has string length {ratio}?",
    qFrequency:"Which frequency ratio belongs to {label}?",
    qStep:"What is the adjacent step from {from} to {to}?",
    qCents:"Approximately how high is {label} above the open string?",
    qEar:"Listen to the mystery tone, then identify its Abjad position.",
    playMystery:"▶ Play mystery tone",
    correct:"Correct.", notYet:"Not yet.",
    wholeTone:"Whole tone", perfectFourth:"Perfect fourth",
    explainLength:"{label} has string length {length} and frequency ratio {frequency}.",
    explainFrequency:"Frequency is the reciprocal of length: 1 ÷ ({length}) = {frequency}.",
    explainStep:"It is a {type}: {ratio} ≈ {cents} cents.",
    explainCents:"{label} is {cents} cents above the open string.",
    explainEar:"The tone was {label}: {cents} cents above the open string."
  },
  fa: {
    metaTitle:"اطلس تک‌سیم ارموی",
    eyebrow:"مکتب منتظمیه · اطلس تعاملی تک‌سیم",
    title:"دربارهٔ تقسیم دستان‌ها",
    subtitle:"صفی‌الدین ارموی · هندسه، نسبت‌های دقیق، شنیدن، ساخت و تمرین",
    sourceChip:"۱۷ جایگاه + اکتاو · داده‌های کسری دقیق",
    fullscreen:"⛶ تمام‌صفحه", fullscreenTitle:"نمایش تمام‌صفحه",
    autoLanguage:"خودکار · زبان مرورگر",
    bridge:"م — خرک",
    nut:"ا — شیطانک · سیمِ باز",
    hintExplore:"برای بررسی و شنیدن، یکی از دستان‌ها را انتخاب کنید",
    hintConstruct:"جایگاه‌ها به ترتیب ساخت در منبع آشکار می‌شوند",
    tabLearn:"آموزش", tabExplore:"کاوش", tabConstruct:"ساخت", tabListen:"شنیدن", tabModes:"اجناس و ادوار", tabTrain:"تمرین و داده‌ها",
    openString:"سیمِ باز", position:"جایگاه {current} از {total}",
    stringLength:"طول سیم", frequencyRatio:"نسبت بسامد", cents:"سِنت",
    frequency:"بسامد", fromBridge:"فاصله از خرک", fromNut:"فاصله از شیطانک",
    previousStep:"فاصلهٔ قبلی", pitchOrder:"ترتیب صوتی",
    playSelected:"▶ صدای انتخاب‌شده", playOpen:"▶ سیمِ باز",
    geometryKicker:"هندسه ← آکوستیک", governing:"رابطهٔ بنیادی",
    governingP1:"طول کامل بخش مرتعش سیم برابر ۱ در نظر گرفته می‌شود. اگر طول باقی‌مانده ℓ باشد، نسبت بسامد ایده‌آل معکوس آن است.",
    governingP2:"این ۱۸ نشانه شامل سیمِ باز، ۱۷ جایگاه صوتی در محدودهٔ اکتاو و تکرار اکتاو است. این مجموعه یک شبکهٔ مادرِ صوتی است، نه یک گام اجرایی اجباری.",
    openFrequency:"بسامد سیمِ باز", stringLengthCm:"طول سیم (سانتی‌متر)", waveform:"شکل موج",
    monochordLabels:"برچسب‌های تک‌سیم", sine:"سینوسی", triangle:"مثلثی", sawtooth:"دندانه‌اره‌ای",
    abjad:"حروف ابجد", index:"شماره", centsOption:"سِنت",
    openToSelected:"▶ سیمِ باز ← انتخاب", soundTogether:"▶ هم‌زمان",
    adjacentInterval:"فاصلهٔ مجاور", exactStep:"فاصلهٔ دقیق",
    referencePoint:"نقطهٔ مرجع",
    referenceText:"سیمِ باز مرجعی است که همهٔ جایگاه‌های دیگر نسبت به آن محاسبه می‌شوند.",
    previous:"← قبلی", next:"بعدی →", limma:"بقیه/لیما", comma:"کمای فیثاغورثی",
    above:"{type} بالاتر از {label}",
    adjacentText:"این فاصلهٔ بسامدیِ مجاور برابر {cents} سنت است و نسبت دقیق آن از معکوس طول‌های سیم به دست می‌آید.",
    sourceGuided:"ساخت بر پایهٔ منبع", modernWording:"بیان آموزشی امروزی",
    constructionCaution:"نسبت‌ها دقیق‌اند. توضیح فارسی، بازنویسی آموزشی و محتاطانهٔ نمودارها و دستورهای ارائه‌شده است.",
    hear:"▶ بشنوید", geometricOperation:"عمل هندسی", auto:"▶ خودکار", stop:"■ توقف",
    length:"طول", completeSequence:"توالی کامل", clickAnyStep:"یک مرحله را انتخاب کنید",
    divideGuide:"طول کامل را به {divisions} بخش مساوی تقسیم کنید؛ طول مرتعشِ علامت‌گذاری‌شده {active}/{divisions} است.",
    derivedGuide:"از {from} با ضرب طول مرتعش آن در {multiplier} ساخته می‌شود.",
    fullGuide:"سیمِ کاملِ نرمال‌شده: خرک «م» در چپ و شیطانک «ا» در راست.",
    soundLab:"اطلس صدا", webAudio:"صدای مرورگر", openPitch:"بسامد پایه",
    toneA:"صدای الف", toneB:"صدای ب",
    soundCaution:"برای مقایسهٔ نظری، موج سینوسی ضربان و اندازهٔ فاصله را روشن‌تر می‌کند. این صدا سنتز امروزی است و بازسازی رنگ صوتی ساز قرون وسطایی نیست.",
    playOpenShort:"▶ سیمِ باز", playA:"▶ صدای الف", playB:"▶ صدای ب", fullAscent:"▶ صعود کامل",
    compareTwo:"مقایسهٔ دو جایگاه", playSequence:"▶ الف سپس ب", together:"▶ هم‌زمان", swap:"⇄ جابه‌جایی",
    octavePattern:"الگوی فواصل اکتاو",
    patternCopy:"هر فاصلهٔ مجاور یا لیما است یا کمای فیثاغورثی. نابرابری این توالی نشان می‌دهد که این سامانه تقسیم مساوی اکتاو به ۱۷ بخش نیست.",
    hearLimma:"▶ شنیدن لیما", hearComma:"▶ شنیدن کما",
    interactiveTraining:"تمرین تعاملی", theoryRatios:"نظریه و نسبت‌ها", earTraining:"تربیت شنوایی",
    loading:"در حال آماده‌سازی پرسش…", choose:"یک پاسخ را انتخاب کنید.", score:"امتیاز: {correct} از {total}",
    scoreTop:"{correct} درست از {total}", newQuestion:"پرسش تازه",
    pitchLattice:"شبکهٔ دقیق صوتی · ترتیب صعودی",
    hzAt:"بسامدها با پایهٔ {hz} هرتز",
    thNumber:"شماره", thLabel:"نشانه", thLength:"طول سیم", thRatio:"نسبت بسامد",
    thCents:"سنت", thHz:"هرتز", thPrevious:"فاصلهٔ قبلی",
    statusExplore:"حالت کاوش · {label} انتخاب شده · {hz} هرتز",
    statusConstruct:"مرحلهٔ ساخت {step} · {label} · {heading}",
    statusListen:"حالت شنیدن · مقایسهٔ {a} و {b} · پایه {hz} هرتز",
    statusTrain:"حالت تمرین · جدول دقیق و پرسش‌های تعاملی",
    constructionStep:"مرحلهٔ {step} از ۱۷",
    qLength:"کدام نشانهٔ ابجد طول سیمِ {ratio} دارد؟",
    qFrequency:"نسبت بسامدِ مربوط به {label} کدام است؟",
    qStep:"فاصلهٔ مجاور از {from} تا {to} چیست؟",
    qCents:"{label} تقریباً چند سنت بالاتر از سیمِ باز است؟",
    qEar:"صدای ناشناس را بشنوید و جایگاه ابجد آن را تشخیص دهید.",
    playMystery:"▶ پخش صدای ناشناس",
    correct:"درست است.", notYet:"درست نیست.",
    wholeTone:"پردهٔ کامل", perfectFourth:"چهارم درست",
    explainLength:"طول سیمِ {label} برابر {length} و نسبت بسامد آن {frequency} است.",
    explainFrequency:"بسامد معکوس طول است: ۱ ÷ ({length}) = {frequency}.",
    explainStep:"این فاصله {type} است: {ratio}، تقریباً {cents} سنت.",
    explainCents:"{label} برابر {cents} سنت بالاتر از سیمِ باز است.",
    explainEar:"صدا {label} بود: {cents} سنت بالاتر از سیمِ باز."
  },
  ar: {
    metaTitle:"أطلس المونوكورد للأرموي",
    eyebrow:"المدرسة النظامية · أطلس مونوكورد تفاعلي",
    title:"في أقسام الدساتين",
    subtitle:"صفيّ الدين الأرموي · الهندسة والنِّسَب الدقيقة والاستماع والبناء والتدريب",
    sourceChip:"١٧ موضعًا + الأوكتاف · نِسَب كسرية دقيقة",
    fullscreen:"⛶ ملء الشاشة", fullscreenTitle:"عرض بملء الشاشة",
    autoLanguage:"تلقائي · لغة المتصفح",
    bridge:"م — المشط",
    nut:"ا — الأنف · الوتر المطلق",
    hintExplore:"اختر أي دستان لفحصه وسماعه",
    hintConstruct:"تظهر المواضع وفق ترتيب إنشائها في المصدر",
    tabLearn:"تعلّم", tabExplore:"استكشاف", tabConstruct:"البناء", tabListen:"الاستماع", tabModes:"الأجناس والأدوار", tabTrain:"التدريب والبيانات",
    openString:"الوتر المطلق", position:"الموضع {current} من {total}",
    stringLength:"طول الوتر", frequencyRatio:"نسبة التردد", cents:"سِنت",
    frequency:"التردد", fromBridge:"من المشط", fromNut:"من الأنف",
    previousStep:"الخطوة السابقة", pitchOrder:"الترتيب النغمي",
    playSelected:"▶ النغمة المختارة", playOpen:"▶ الوتر المطلق",
    geometryKicker:"الهندسة ← الصوتيات", governing:"العلاقة الأساسية",
    governingP1:"يُطبَّع طول الوتر المصوِّت الكامل إلى ١. فإذا كان الطول المتبقي ℓ، كانت نسبة التردد المثالية مقلوب هذا الطول.",
    governingP2:"تمثل العلامات الثماني عشرة الوتر المطلق، وسبعة عشر موضعًا نغميًا داخل الأوكتاف، ثم تكرار الأوكتاف. وهي شبكة نغمية أم، وليست سلّمًا أدائيًا إلزاميًا.",
    openFrequency:"تردد الوتر المطلق", stringLengthCm:"طول الوتر (سم)", waveform:"شكل الموجة",
    monochordLabels:"تسميات المونوكورد", sine:"جيبية", triangle:"مثلثية", sawtooth:"سنّ منشار",
    abjad:"حروف أبجد", index:"الرقم", centsOption:"السنت",
    openToSelected:"▶ المطلق ثم المختار", soundTogether:"▶ معًا",
    adjacentInterval:"الفاصل المجاور", exactStep:"النسبة الدقيقة",
    referencePoint:"نقطة المرجع",
    referenceText:"الوتر المطلق هو المرجع الذي تُحسب منه جميع المواضع الأخرى.",
    previous:"← السابق", next:"التالي →", limma:"البقية/الليما", comma:"الفاصلة الفيثاغورية",
    above:"{type} فوق {label}",
    adjacentText:"يساوي هذا الفاصل الترددي المجاور {cents} سنت، وتنتج نسبته الدقيقة من مقلوب أطوال الوتر.",
    sourceGuided:"بناء مستند إلى المصدر", modernWording:"صياغة تعليمية حديثة",
    constructionCaution:"النِّسَب دقيقة. أمّا الشرح العربي فهو إعادة صياغة تعليمية حذرة للرسوم والتعليمات المعروضة.",
    hear:"▶ استمع", geometricOperation:"العملية الهندسية", auto:"▶ تلقائي", stop:"■ إيقاف",
    length:"الطول", completeSequence:"التسلسل الكامل", clickAnyStep:"اختر أي خطوة",
    divideGuide:"قسّم الطول الكامل إلى {divisions} أقسام متساوية؛ والطول المصوِّت المحدد هو {active}/{divisions}.",
    derivedGuide:"مشتق من {from} بضرب طوله المصوِّت في {multiplier}.",
    fullGuide:"الوتر الكامل المطبَّع: المشط «م» يسارًا والأنف «ا» يمينًا.",
    soundLab:"أطلس الصوت", webAudio:"صوت المتصفح", openPitch:"التردد الأساس",
    toneA:"النغمة أ", toneB:"النغمة ب",
    soundCaution:"للمقارنة النظرية تجعل الموجة الجيبية الخفقان وحجم الفاصل أوضح. هذا توليد صوتي حديث، وليس إعادة بناء لطابع آلة من العصور الوسطى.",
    playOpenShort:"▶ المطلق", playA:"▶ النغمة أ", playB:"▶ النغمة ب", fullAscent:"▶ الصعود الكامل",
    compareTwo:"مقارنة موضعين", playSequence:"▶ أ ثم ب", together:"▶ معًا", swap:"⇄ تبديل",
    octavePattern:"نمط خطوات الأوكتاف",
    patternCopy:"كل خطوة مجاورة إما ليما وإما فاصلة فيثاغورية. ويبيّن عدم تساوي التسلسل أن النظام ليس تقسيمًا متساويًا للأوكتاف إلى سبعة عشر جزءًا.",
    hearLimma:"▶ سماع الليما", hearComma:"▶ سماع الفاصلة",
    interactiveTraining:"تدريب تفاعلي", theoryRatios:"النظرية والنِّسَب", earTraining:"التدريب السمعي",
    loading:"جارٍ إعداد السؤال…", choose:"اختر إجابة واحدة.", score:"النتيجة: {correct} / {total}",
    scoreTop:"{correct} صحيحة من {total}", newQuestion:"سؤال جديد",
    pitchLattice:"الشبكة النغمية الدقيقة · ترتيب صاعد",
    hzAt:"الترددات محسوبة على أساس {hz} هرتز",
    thNumber:"الرقم", thLabel:"العلامة", thLength:"طول الوتر", thRatio:"نسبة التردد",
    thCents:"سنت", thHz:"هرتز", thPrevious:"الخطوة السابقة",
    statusExplore:"وضع الاستكشاف · تم اختيار {label} · {hz} هرتز",
    statusConstruct:"خطوة البناء {step} · {label} · {heading}",
    statusListen:"وضع الاستماع · مقارنة {a} مع {b} · الأساس {hz} هرتز",
    statusTrain:"وضع التدريب · الجدول الدقيق والأسئلة التفاعلية",
    constructionStep:"الخطوة {step} من ١٧",
    qLength:"أي علامة أبجدية طول وترها {ratio}؟",
    qFrequency:"ما نسبة التردد الخاصة بالعلامة {label}؟",
    qStep:"ما الخطوة المجاورة من {from} إلى {to}؟",
    qCents:"كم سنتًا تقريبًا تعلو {label} الوتر المطلق؟",
    qEar:"استمع إلى النغمة المجهولة ثم حدّد موضعها الأبجدي.",
    playMystery:"▶ تشغيل النغمة المجهولة",
    correct:"صحيح.", notYet:"ليست صحيحة.",
    wholeTone:"طنيني كامل", perfectFourth:"رابعة تامة",
    explainLength:"طول وتر {label} هو {length} ونسبة تردده {frequency}.",
    explainFrequency:"التردد مقلوب الطول: ١ ÷ ({length}) = {frequency}.",
    explainStep:"هذه الخطوة {type}: {ratio} ≈ {cents} سنت.",
    explainCents:"ترتفع {label} بمقدار {cents} سنت عن الوتر المطلق.",
    explainEar:"كانت النغمة {label}: أعلى من الوتر المطلق بمقدار {cents} سنت."
  },
  tr: {
    metaTitle:"el-Urmevî Monokord Stüdyosu",
    eyebrow:"Sistemci Okul · Etkileşimli Monokord Stüdyosu",
    title:"Perdelerin Bölünmesi Üzerine",
    subtitle:"Safiyyüddin el-Urmevî · geometri, kesin oranlar, dinleme, kurulum ve alıştırma",
    sourceChip:"17 konum + oktav · kesin kesirli veriler",
    fullscreen:"⛶ Tam ekran", fullscreenTitle:"Tam ekranda aç",
    autoLanguage:"Otomatik · Tarayıcı",
    bridge:"م — köprü (meşt)",
    nut:"ا — üst eşik (enf) · açık tel",
    hintExplore:"İncelemek ve dinlemek için bir perde seçin",
    hintConstruct:"Konumlar kaynakta verilen yapım sırasıyla gösterilir",
    tabLearn:"Öğren", tabExplore:"Keşfet", tabConstruct:"Kur", tabListen:"Dinle", tabModes:"Cinsler ve Makamlar", tabTrain:"Alıştırma ve Veri",
    openString:"Açık tel", position:"{total} konumun {current}.si",
    stringLength:"Tel uzunluğu", frequencyRatio:"Frekans oranı", cents:"Sent",
    frequency:"Frekans", fromBridge:"Köprüden", fromNut:"Üst eşikten",
    previousStep:"Önceki aralık", pitchOrder:"Ses sırası",
    playSelected:"▶ Seçili ses", playOpen:"▶ Açık tel",
    geometryKicker:"Geometri → akustik", governing:"Temel ilişki",
    governingP1:"Titreşen telin tam uzunluğu 1 olarak normalize edilir. Kalan uzunluk ℓ ise ideal frekans oranı bu uzunluğun tersidir.",
    governingP2:"Yazılı 18 nokta; açık teli, oktav içindeki 17 ses konumunu ve oktav tekrarını gösterir. Bunlar zorunlu bir icra dizisi değil, ana bir ses örgüsüdür.",
    openFrequency:"Açık tel frekansı", stringLengthCm:"Tel uzunluğu (cm)", waveform:"Dalga biçimi",
    monochordLabels:"Monokord etiketleri", sine:"Sinüs", triangle:"Üçgen", sawtooth:"Testere dişi",
    abjad:"Ebced", index:"Numara", centsOption:"Sent",
    openToSelected:"▶ Açık → seçili", soundTogether:"▶ Birlikte",
    adjacentInterval:"Komşu aralık", exactStep:"Kesin adım",
    referencePoint:"Referans noktası",
    referenceText:"Açık tel, diğer bütün konumların hesaplandığı referanstır.",
    previous:"← Önceki", next:"Sonraki →", limma:"Limma", comma:"Pisagor koması",
    above:"{label} üzerinde {type}",
    adjacentText:"Bu komşu frekans adımı {cents} senttir. Kesin oranı tel uzunluklarının terslerinden elde edilir.",
    sourceGuided:"Kaynak temelli kurulum", modernWording:"Modern öğretim dili",
    constructionCaution:"Oranlar kesindir. Türkçe açıklamalar, verilen çizim ve talimatların dikkatli bir öğretimsel yeniden ifadesidir.",
    hear:"▶ Dinle", geometricOperation:"Geometrik işlem", auto:"▶ Otomatik", stop:"■ Durdur",
    length:"Uzunluk", completeSequence:"Tam sıra", clickAnyStep:"Bir adımı seçin",
    divideGuide:"Tam uzunluğu {divisions} eşit parçaya bölün; işaretlenen titreşen uzunluk {active}/{divisions} olur.",
    derivedGuide:"{from} konumunun titreşen uzunluğu {multiplier} ile çarpılarak elde edilir.",
    fullGuide:"Normalize edilmiş tam tel: solda köprü م, sağda üst eşik ا.",
    soundLab:"Ses Atlası", webAudio:"Tarayıcı sesi", openPitch:"Temel frekans",
    toneA:"A sesi", toneB:"B sesi",
    soundCaution:"Kuramsal karşılaştırmada sinüs dalgası, vuruşları ve aralık büyüklüğünü daha açık duyurur. Bu modern bir sentezdir; Orta Çağ çalgı tınısının rekonstrüksiyonu değildir.",
    playOpenShort:"▶ Açık tel", playA:"▶ A sesi", playB:"▶ B sesi", fullAscent:"▶ Tam çıkış",
    compareTwo:"İki konumu karşılaştır", playSequence:"▶ A, sonra B", together:"▶ Birlikte", swap:"⇄ Değiştir",
    octavePattern:"Oktav adım örüntüsü",
    patternCopy:"Her komşu adım ya limma ya da Pisagor komasıdır. Eşit olmayan bu sıra, sistemin 17 eşit bölümlü bir oktav olmadığını gösterir.",
    hearLimma:"▶ Limma dinle", hearComma:"▶ Koma dinle",
    interactiveTraining:"Etkileşimli alıştırma", theoryRatios:"Kuram ve oranlar", earTraining:"Kulak eğitimi",
    loading:"Soru hazırlanıyor…", choose:"Bir cevap seçin.", score:"Puan: {correct} / {total}",
    scoreTop:"{total} soruda {correct} doğru", newQuestion:"Yeni soru",
    pitchLattice:"Kesin ses örgüsü · yükselen sıra",
    hzAt:"Frekanslar {hz} Hz temelinde",
    thNumber:"#", thLabel:"İşaret", thLength:"Tel uzunluğu", thRatio:"Frekans oranı",
    thCents:"Sent", thHz:"Hz", thPrevious:"Önceki adım",
    statusExplore:"Keşif modu · {label} seçili · {hz} Hz",
    statusConstruct:"Kurulum adımı {step} · {label} · {heading}",
    statusListen:"Dinleme modu · {a} ile {b} karşılaştırılıyor · temel {hz} Hz",
    statusTrain:"Alıştırma modu · kesin tablo ve etkileşimli sorular",
    constructionStep:"17 adımın {step}.si",
    qLength:"Tel uzunluğu {ratio} olan Ebced konumu hangisidir?",
    qFrequency:"{label} işaretinin frekans oranı hangisidir?",
    qStep:"{from} ile {to} arasındaki komşu adım nedir?",
    qCents:"{label}, açık telin yaklaşık kaç sent üzerindedir?",
    qEar:"Gizemli sesi dinleyin ve Ebced konumunu belirleyin.",
    playMystery:"▶ Gizemli sesi çal",
    correct:"Doğru.", notYet:"Henüz değil.",
    wholeTone:"Tam ton", perfectFourth:"Tam dörtlü",
    explainLength:"{label} için tel uzunluğu {length}, frekans oranı {frequency} olur.",
    explainFrequency:"Frekans uzunluğun tersidir: 1 ÷ ({length}) = {frequency}.",
    explainStep:"Bu adım {type}: {ratio} ≈ {cents} sent.",
    explainCents:"{label}, açık telin {cents} sent üzerindedir.",
    explainEar:"Duyulan ses {label} idi: açık telin {cents} sent üzerinde."
  }
};

const CONSTRUCTION_I18N = {
  en: CONSTRUCTION.map(s=>({heading:s.heading,copy:s.copy})),
  fa: [
    {heading:"آغاز با سیمِ باز",copy:"طول کامل بخش مرتعش را برابر ۱ در نظر بگیرید. این صدای مرجع است."},
    {heading:"یافتن اکتاو با نصف‌کردن سیم",copy:"سیم کامل را به دو بخش مساوی تقسیم کنید. طول ۱/۲ بسامدی دو برابر صدای مرجع ایجاد می‌کند."},
    {heading:"یافتن پنجم درست",copy:"سیم را به سه بخش مساوی تقسیم کنید و طول دو بخش را نگه دارید."},
    {heading:"یافتن چهارم درست",copy:"سیم را به چهار بخش مساوی تقسیم کنید و طول سه بخش را نگه دارید."},
    {heading:"اجرای دوبارهٔ نسبت سه‌چهارم",copy:"نسبت طول ۳/۴ را بر جایگاه ۳/۴ که پیش‌تر ساخته شده اعمال کنید."},
    {heading:"یافتن جایگاه هشت‌نهم",copy:"سیم کامل را به نه بخش مساوی تقسیم کنید و هشت بخش را نگه دارید."},
    {heading:"اجرای دوبارهٔ نسبت هشت‌نهم",copy:"نسبت طول ۸/۹ را بر جایگاه ۸/۹ که پیش‌تر ساخته شده اعمال کنید."},
    {heading:"افزودن یک‌هشتم به جایگاه چهارم",copy:"بخش میان خرک و «ح» را به هشت قسمت تقسیم کنید و یک قسمت هم‌اندازه در سوی بم‌تر بیفزایید."},
    {heading:"افزودن یک‌هشتم به «هـ»",copy:"بخش میان خرک و «هـ» را به هشت قسمت تقسیم کنید و یک قسمت هم‌اندازه بیفزایید."},
    {heading:"انتقال نسبت دو‌سوم",copy:"دو‌سوم طولِ ساخته‌شدهٔ ۲۴۳/۲۵۶ را بگیرید."},
    {heading:"انتقال نسبت سه‌چهارم",copy:"سه‌چهارم طولِ ساخته‌شدهٔ ۲۴۳/۲۵۶ را بگیرید."},
    {heading:"اعمال دوبارهٔ سه‌چهارم",copy:"سه‌چهارم جایگاه ۷۲۹/۱۰۲۴ را بگیرید."},
    {heading:"افزودن نصف طول «یو»",copy:"بخش پایان‌یافته در «یو» را نصف کنید و یک نیمهٔ هم‌اندازه در سوی بم‌تر بیفزایید."},
    {heading:"افزودن یک‌هشتم به «و»",copy:"بخش پایان‌یافته در «و» را به هشت قسمت تقسیم کنید و یک قسمت هم‌اندازه بیفزایید."},
    {heading:"گرفتن سه‌چهارم «ج»",copy:"نسبت ۳/۴ را بر جایگاه «ج» اعمال کنید."},
    {heading:"گرفتن سه‌چهارم «ی»",copy:"نسبت ۳/۴ را بر جایگاه «ی» اعمال کنید."},
    {heading:"گرفتن سه‌چهارم «و»",copy:"نسبت ۳/۴ را بر جایگاه «و» اعمال کنید."},
    {heading:"گرفتن سه‌چهارم «ز»",copy:"نسبت ۳/۴ را بر جایگاه «ز» اعمال کنید و مجموعه را کامل کنید."}
  ],
  ar: [
    {heading:"البدء بالوتر المطلق",copy:"اجعل طول الجزء المصوِّت الكامل مساويًا للواحد. وهذه هي النغمة المرجعية."},
    {heading:"تحديد الأوكتاف بتنصيف الوتر",copy:"قسّم الوتر الكامل إلى نصفين متساويين. فالطول ١/٢ يعطي ضعف التردد المرجعي."},
    {heading:"تحديد الخامسة التامة",copy:"قسّم الوتر إلى ثلاثة أقسام متساوية واحتفظ بطول قسمين."},
    {heading:"تحديد الرابعة التامة",copy:"قسّم الوتر إلى أربعة أقسام متساوية واحتفظ بطول ثلاثة أقسام."},
    {heading:"تطبيق نسبة ثلاثة أرباع مرة أخرى",copy:"طبّق نسبة الطول ٣/٤ على الموضع ٣/٤ الذي سبق إنشاؤه."},
    {heading:"تحديد موضع ثمانية أتساع",copy:"قسّم الوتر الكامل إلى تسعة أقسام متساوية واحتفظ بثمانية."},
    {heading:"تطبيق نسبة ثمانية أتساع مرة أخرى",copy:"طبّق نسبة الطول ٨/٩ على الموضع ٨/٩ الذي سبق إنشاؤه."},
    {heading:"زيادة موضع الرابعة بمقدار الثمن",copy:"قسّم الجزء من المشط إلى «ح» ثمانية أقسام وأضف قسمًا مساويًا من جهة الثقل."},
    {heading:"زيادة «هـ» بمقدار الثمن",copy:"قسّم الجزء من المشط إلى «هـ» ثمانية أقسام وأضف قسمًا مساويًا."},
    {heading:"نقل نسبة الثلثين",copy:"خذ ثلثي الطول المنشأ ٢٤٣/٢٥٦."},
    {heading:"نقل نسبة ثلاثة أرباع",copy:"خذ ثلاثة أرباع الطول المنشأ ٢٤٣/٢٥٦."},
    {heading:"تطبيق ثلاثة أرباع مرة أخرى",copy:"خذ ثلاثة أرباع الموضع ٧٢٩/١٠٢٤."},
    {heading:"إضافة نصف طول «يو»",copy:"انصف الجزء المنتهي عند «يو» وأضف نصفًا مساويًا من جهة الثقل."},
    {heading:"زيادة «و» بمقدار الثمن",copy:"قسّم الجزء المنتهي عند «و» ثمانية أقسام وأضف قسمًا مساويًا."},
    {heading:"أخذ ثلاثة أرباع «ج»",copy:"طبّق نسبة ٣/٤ على الموضع «ج»."},
    {heading:"أخذ ثلاثة أرباع «ي»",copy:"طبّق نسبة ٣/٤ على الموضع «ي»."},
    {heading:"أخذ ثلاثة أرباع «و»",copy:"طبّق نسبة ٣/٤ على الموضع «و»."},
    {heading:"أخذ ثلاثة أرباع «ز»",copy:"طبّق نسبة ٣/٤ على الموضع «ز» لإكمال المجموعة."}
  ],
  tr: [
    {heading:"Açık telle başlayın",copy:"Titreşen tam uzunluğu 1 olarak normalize edin. Bu referans sestir."},
    {heading:"Teli ikiye bölerek oktavı bulun",copy:"Tam teli iki eşit parçaya bölün. 1/2 uzunluk, referans frekansın iki katını üretir."},
    {heading:"Tam beşliyi bulun",copy:"Teli üç eşit parçaya bölün ve iki parçalık uzunluğu koruyun."},
    {heading:"Tam dörtlüyü bulun",copy:"Teli dört eşit parçaya bölün ve üç parçalık uzunluğu koruyun."},
    {heading:"Üçte dört oranını yeniden uygulayın",copy:"3/4 uzunluk oranını önceden kurulmuş 3/4 konumuna uygulayın."},
    {heading:"Sekizde dokuz konumunu bulun",copy:"Tam teli dokuz eşit parçaya bölün ve sekiz parçayı koruyun."},
    {heading:"Sekizde dokuz oranını yeniden uygulayın",copy:"8/9 uzunluk oranını önceden kurulmuş 8/9 konumuna uygulayın."},
    {heading:"Dörtlü konumuna sekizde bir ekleyin",copy:"Köprüden ح konumuna kadar olan bölümü sekize bölün ve pes yönde aynı büyüklükte bir parça ekleyin."},
    {heading:"هـ konumuna sekizde bir ekleyin",copy:"Köprüden هـ konumuna kadar olan bölümü sekize bölün ve aynı büyüklükte bir parça ekleyin."},
    {heading:"Üçte iki oranını aktarın",copy:"Kurulmuş 243/256 uzunluğunun üçte ikisini alın."},
    {heading:"Üçte dört oranını aktarın",copy:"Kurulmuş 243/256 uzunluğunun üçte dördünü alın."},
    {heading:"Üçte dördü bir kez daha uygulayın",copy:"729/1024 konumunun üçte dördünü alın."},
    {heading:"يو uzunluğunun yarısını ekleyin",copy:"يو ile biten bölümü ikiye bölün ve pes yönde eşit bir yarım ekleyin."},
    {heading:"و konumuna sekizde bir ekleyin",copy:"و ile biten bölümü sekize bölün ve eşit bir parça ekleyin."},
    {heading:"ج konumunun üçte dördünü alın",copy:"3/4 oranını ج konumuna uygulayın."},
    {heading:"ي konumunun üçte dördünü alın",copy:"3/4 oranını ي konumuna uygulayın."},
    {heading:"و konumunun üçte dördünü alın",copy:"3/4 oranını و konumuna uygulayın."},
    {heading:"ز konumunun üçte dördünü alın",copy:"3/4 oranını ز konumuna uygulayarak kümeyi tamamlayın."}
  ]
};

let uiLanguage = "en";

function formatText(template, values={}){
  return String(template).replace(/\{(\w+)\}/g,(_,key)=>values[key] ?? `{${key}}`);
}
function t(key, values={}){
  return formatText((UI[uiLanguage] && UI[uiLanguage][key]) || UI.en[key] || key, values);
}
function detectedLanguage(){
  const candidates = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
  for(const raw of candidates){
    const code=String(raw).toLowerCase().split("-")[0];
    if(["fa","ar","tr","en"].includes(code)) return code;
  }
  return "en";
}
function resolvedLanguage(choice){
  return choice==="auto" ? detectedLanguage() : (["fa","ar","tr","en"].includes(choice) ? choice : "en");
}
function setText(selector,key){
  const el=document.querySelector(selector); if(el) el.textContent=t(key);
}
function constructionText(index){
  return (CONSTRUCTION_I18N[uiLanguage] || CONSTRUCTION_I18N.en)[index] || CONSTRUCTION_I18N.en[index];
}
function localizedStepType(type){
  return type==="Comma" ? t("comma") : t("limma");
}

function applyStaticLanguage(){
  document.documentElement.lang=uiLanguage;
  document.documentElement.dir="ltr";
  document.body.classList.toggle("rtl-ui",uiLanguage==="fa"||uiLanguage==="ar");
  document.title=t("metaTitle");

  setText(".eyebrow","eyebrow");
  setText(".title-en","title");
  setText(".subtitle","subtitle");
  setText(".source-chip","sourceChip");
  if($("fullscreenBtn")){ $("fullscreenBtn").title=t("fullscreenTitle"); $("fullscreenBtn").setAttribute("aria-label",t("fullscreenTitle")); }
  $("languageSelect").setAttribute("aria-label", uiLanguage==="fa"?"زبان":uiLanguage==="ar"?"اللغة":uiLanguage==="tr"?"Dil":"Language");

  const captions=document.querySelectorAll(".mono-caption span");
  if(captions[0])captions[0].textContent=t("bridge");
  if(captions[2])captions[2].textContent=t("nut");
  $("monoHint").textContent=activePanel==="construct"?t("hintConstruct"):t("hintExplore");

  const tabKeys=["tabLearn","tabExplore","tabConstruct","tabListen","tabModes","tabTrain"];
  document.querySelectorAll(".tab").forEach((b,i)=>{
    b.innerHTML=`<span class="tab-number">0${i+1}</span>${t(tabKeys[i])}`;
  });

  const dataKeys=["stringLength","frequencyRatio","cents","frequency","fromBridge","fromNut","previousStep","pitchOrder"];
  document.querySelectorAll(".note-card .data-key").forEach((el,i)=>el.textContent=t(dataKeys[i]));
  $("playSelected").textContent=t("playSelected"); $("playOpen").textContent=t("playOpen");
  document.querySelector(".concept-card .card-kicker").textContent=t("geometryKicker");
  document.querySelector(".concept-copy h3").textContent=t("governing");
  const conceptPs=document.querySelectorAll(".concept-copy p");
  if(conceptPs[0])conceptPs[0].textContent=t("governingP1");
  if(conceptPs[1])conceptPs[1].textContent=t("governingP2");

  const exploreLabels=document.querySelectorAll(".control-stack .field label");
  [t("openFrequency"),t("stringLengthCm"),t("waveform"),t("monochordLabels")].forEach((x,i)=>{if(exploreLabels[i])exploreLabels[i].textContent=x});
  $("waveform").options[0].textContent=t("sine");$("waveform").options[1].textContent=t("triangle");$("waveform").options[2].textContent=t("sawtooth");
  $("labelMode").options[0].textContent=t("abjad");$("labelMode").options[1].textContent=t("index");$("labelMode").options[2].textContent=t("centsOption");
  $("compareSequential").textContent=t("openToSelected");$("compareTogether").textContent=t("soundTogether");

  document.querySelector(".interval-card .card-title").textContent=t("adjacentInterval");
  document.querySelector(".interval-card .card-kicker").textContent=t("exactStep");
  $("previousNote").textContent=t("previous");$("nextNote").textContent=t("next");

  document.querySelector(".step-info .card-title").textContent=t("sourceGuided");
  document.querySelector(".step-info .card-kicker").textContent=t("modernWording");
  document.querySelector(".step-main .micro").textContent=t("constructionCaution");
  $("constructionPrev").textContent=t("previous");$("constructionPlay").textContent=t("hear");$("constructionNext").textContent=t("next");
  document.querySelector(".guide-card .card-title").textContent=t("geometricOperation");
  $("autoConstruction").textContent=constructionTimer?t("stop"):t("auto");
  const summaryKeys=document.querySelectorAll(".summary-k");
  [t("length"),t("frequency"),t("cents")].forEach((x,i)=>{if(summaryKeys[i])summaryKeys[i].textContent=x});
  document.querySelector(".steps-card .card-title").textContent=t("completeSequence");
  document.querySelector(".steps-card .card-kicker").textContent=t("clickAnyStep");

  document.querySelector(".sound-controls .card-title").textContent=t("soundLab");
  document.querySelector(".sound-controls .card-kicker").textContent=t("webAudio");
  document.querySelector(".range-line label").textContent=t("openPitch");
  const soundFieldLabels=document.querySelectorAll(".sound-body .field label");
  [t("toneA"),t("toneB"),t("waveform")].forEach((x,i)=>{if(soundFieldLabels[i])soundFieldLabels[i].textContent=x});
  $("listenWaveform").options[0].textContent=`${t("sine")} — ${uiLanguage==="en"?"pure reference":""}`.replace(/\s—\s$/,"");
  $("listenWaveform").options[1].textContent=t("triangle");
  $("listenWaveform").options[2].textContent=t("sawtooth");
  document.querySelector(".sound-body .micro").textContent=t("soundCaution");
  $("listenOpen").textContent=t("playOpenShort");$("listenA").textContent=t("playA");$("listenB").textContent=t("playB");$("listenAscent").textContent=t("fullAscent");
  document.querySelector(".compare-card .card-title").textContent=t("compareTwo");
  $("playSequenceAB").textContent=t("playSequence");$("playTogetherAB").textContent=t("together");$("swapAB").textContent=t("swap");
  document.querySelector(".pattern-card .card-title").textContent=t("octavePattern");
  document.querySelector(".pattern-copy").textContent=t("patternCopy");
  $("playLimma").textContent=t("hearLimma");$("playComma").textContent=t("hearComma");

  document.querySelector(".quiz-card .card-title").textContent=t("interactiveTraining");
  document.querySelector('[data-quiz-mode="theory"]').textContent=t("theoryRatios");
  document.querySelector('[data-quiz-mode="ear"]').textContent=t("earTraining");
  $("newQuestion").textContent=t("newQuestion");
  document.querySelector(".data-card .card-title").textContent=t("pitchLattice");
  const headers=document.querySelectorAll(".data-card thead th");
  [t("thNumber"),t("thLabel"),t("thLength"),t("thRatio"),t("thCents"),t("thHz"),t("thPrevious")].forEach((x,i)=>{if(headers[i])headers[i].textContent=x});
}

const originalUpdateExplore=updateExplore;
updateExplore=function(){
  originalUpdateExplore();
  const n=NOTES[selected],base=currentBase(),prev=previousStepInfo(selected);
  $("noteName").textContent=selected===0?t("openString"):n.translit;
  $("noteSub").textContent=`${n.translit} · ${t("position",{current:selected+1,total:18})}`;
  $("previousValue").textContent=prev?`${localizedStepType(prev.type)} · ${prev.n}/${prev.d}`:"—";
  if(prev){
    const localType=localizedStepType(prev.type);
    $("intervalBadge").textContent=t("above",{type:localType,label:NOTES[selected-1].label});
    $("intervalText").textContent=t("adjacentText",{cents:fixed(prev.cents)});
  }else{
    $("intervalBadge").textContent=t("referencePoint");
    $("intervalText").textContent=t("referenceText");
  }
  $("statusMessage").textContent=t("statusExplore",{label:n.label,hz:fixed(base*frequencyRatio(n),2)});
};

renderStepGrid=function(){
  const grid=$("stepGrid");grid.innerHTML="";
  CONSTRUCTION.forEach((s,i)=>{
    const ct=constructionText(i);
    const b=document.createElement("button");
    b.className=`step-tile ${i<constructionStep?"done":""} ${i===constructionStep?"current":""}`;
    b.innerHTML=`<span class="tile-num">${i}</span><span class="tile-ar">${s.note}</span><span class="tile-name">${ct.heading}</span>`;
    b.addEventListener("click",()=>setConstruction(i));
    grid.appendChild(b);
  });
};

renderGuideVisual=function(s,n){
  const left=25,width=310,pct=lengthValue(n);
  $("guideCurrent").style.left=`${left+pct*width}px`;
  $("guideLabel").style.left=`${left+pct*width}px`;
  $("guideLabel").textContent=n.label;
  const divs=$("guideDivisions");divs.innerHTML="";
  if(s.divisions){
    for(let i=1;i<s.divisions;i++){
      const line=document.createElement("span");line.className="guide-division";
      line.style.left=`${left+(i/s.divisions)*width}px`;divs.appendChild(line);
    }
    $("guideNote").textContent=s.divisions===1?t("fullGuide"):t("divideGuide",{divisions:s.divisions,active:s.active});
  }else{
    $("guideNote").textContent=t("derivedGuide",{from:s.from,multiplier:s.multiplier});
  }
};

setConstruction=function(index){
  constructionStep=Math.max(0,Math.min(CONSTRUCTION.length-1,index));
  const s=CONSTRUCTION[constructionStep],ct=constructionText(constructionStep),n=NOTES[noteIndex[s.note]];
  $("constructionCount").textContent=t("constructionStep",{step:constructionStep});
  $("constructionSymbol").textContent=s.note;
  $("constructionHeading").textContent=ct.heading;
  $("constructionCopy").textContent=ct.copy;
  $("constructionEquation").textContent=s.equation;
  $("constructionPrev").disabled=constructionStep===0;
  $("constructionNext").disabled=constructionStep===CONSTRUCTION.length-1;
  $("guideLength").textContent=fstr(n.lenN,n.lenD);
  $("guideFrequency").textContent=fstr(n.lenD,n.lenN);
  $("guideCents").textContent=`${fixed(cents(n))}¢`;
  renderGuideVisual(s,n);renderStepGrid();renderMonochord();
  $("statusMessage").textContent=t("statusConstruct",{step:constructionStep,label:s.note,heading:ct.heading});
};

toggleConstructionAuto=function(){
  if(constructionTimer){
    clearInterval(constructionTimer);constructionTimer=null;$("autoConstruction").textContent=t("auto");return;
  }
  if(constructionStep===CONSTRUCTION.length-1)setConstruction(0);
  $("autoConstruction").textContent=t("stop");
  constructionTimer=setInterval(()=>{
    if(constructionStep>=CONSTRUCTION.length-1){
      clearInterval(constructionTimer);constructionTimer=null;$("autoConstruction").textContent=t("auto");return;
    }
    setConstruction(constructionStep+1);
    tone(noteIndex[CONSTRUCTION[constructionStep].note],0,.45,.10);
  },1000);
};

renderTable=function(){
  const body=$("pitchTableBody"),base=currentBase();body.innerHTML="";
  NOTES.forEach((n,i)=>{
    const tr=document.createElement("tr");
    if(i===selected)tr.className="selected-row";
    const prev=previousStepInfo(i);
    tr.innerHTML=`<td>${i+1}</td><td>${n.label}</td><td>${n.lenN}/${n.lenD}</td><td>${n.lenD}/${n.lenN}</td><td>${fixed(cents(n))}</td><td>${fixed(base*frequencyRatio(n),2)}</td><td>${prev?localizedStepType(prev.type):"—"}</td>`;
    tr.addEventListener("click",()=>{selectNote(i,false);activatePanel("explore")});
    body.appendChild(tr);
  });
  $("tableFrequencyCaption").textContent=t("hzAt",{hz:fixed(base,0)});
};

newTheoryQuestion=function(){
  const type=Math.floor(Math.random()*4),i=randomIndex(),n=NOTES[i];
  if(type===0){
    quizCurrent={answer:n.label,prompt:t("qLength",{ratio:`${n.lenN}/${n.lenD}`}),options:optionIndices(i).map(j=>NOTES[j].label),explain:t("explainLength",{label:n.label,length:`${n.lenN}/${n.lenD}`,frequency:`${n.lenD}/${n.lenN}`})};
  }else if(type===1){
    quizCurrent={answer:`${n.lenD}/${n.lenN}`,prompt:t("qFrequency",{label:n.label}),options:optionIndices(i).map(j=>`${NOTES[j].lenD}/${NOTES[j].lenN}`),explain:t("explainFrequency",{length:`${n.lenN}/${n.lenD}`,frequency:`${n.lenD}/${n.lenN}`})};
  }else if(type===2){
    const j=Math.max(1,i),prev=previousStepInfo(j);
    const answer=localizedStepType(prev.type);
    quizCurrent={answer,prompt:t("qStep",{from:NOTES[j-1].label,to:NOTES[j].label}),options:shuffled([t("limma"),t("comma"),t("wholeTone"),t("perfectFourth")]),explain:t("explainStep",{type:answer.toLocaleLowerCase(uiLanguage),ratio:`${prev.n}/${prev.d}`,cents:fixed(prev.cents)})};
  }else{
    quizCurrent={answer:`${fixed(cents(n),1)}¢`,prompt:t("qCents",{label:n.label}),options:shuffled([`${fixed(cents(n),1)}¢`,`${fixed(Math.max(0,cents(n)+90.225),1)}¢`,`${fixed(Math.max(0,cents(n)-90.225),1)}¢`,`${fixed(Math.max(0,cents(n)+23.46),1)}¢`]),explain:t("explainCents",{label:n.label,cents:fixed(cents(n))})};
  }
  renderQuestion();
};

newEarQuestion=function(){
  const i=randomIndex();
  quizCurrent={earIndex:i,answer:NOTES[i].label,prompt:t("qEar"),options:optionIndices(i).map(j=>NOTES[j].label),explain:t("explainEar",{label:NOTES[i].label,cents:fixed(cents(NOTES[i]))})};
  renderQuestion();
  const play=document.createElement("button");play.className="btn primary";play.textContent=t("playMystery");play.style.marginBottom="8px";
  play.addEventListener("click",()=>tone(i));$("quizOptions").before(play);quizCurrent.playButton=play;
  setTimeout(()=>tone(i),120);
};

renderQuestion=function(){
  $("quizQuestion").textContent=quizCurrent.prompt;
  $("quizFeedback").textContent=t("choose");
  const box=$("quizOptions");box.innerHTML="";
  quizCurrent.options.forEach(opt=>{
    const b=document.createElement("button");b.className="quiz-option";b.textContent=opt;
    b.addEventListener("click",()=>answerQuiz(b,opt));box.appendChild(b);
  });
};

answerQuiz=function(button,value){
  if(quizCurrent.answered)return;quizCurrent.answered=true;
  const ok=value===quizCurrent.answer;scoreTotal++;if(ok)scoreCorrect++;
  [...$("quizOptions").children].forEach(b=>{if(b.textContent===quizCurrent.answer)b.classList.add("correct")});
  if(!ok)button.classList.add("wrong");
  $("quizFeedback").textContent=`${ok?t("correct"):t("notYet")} ${quizCurrent.explain}`;
  updateScore();
};

updateScore=function(){
  $("quizScore").textContent=t("score",{correct:scoreCorrect,total:scoreTotal});
  $("quizScoreTop").textContent=t("scoreTop",{correct:scoreCorrect,total:scoreTotal});
};

activatePanel=function(name){
  activePanel=name;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===name));
  document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("active",p.id===`panel-${name}`));
  $("monoHint").textContent=name==="construct"?t("hintConstruct"):t("hintExplore");
  if(name==="construct"){
    setConstruction(constructionStep);
  }else{
    renderMonochord();
    if(name==="listen"){
      updateListen();
      const a=NOTES[Number($("toneA").value)],b=NOTES[Number($("toneB").value)];
      $("statusMessage").textContent=t("statusListen",{a:a.label,b:b.label,hz:fixed(currentBase(),0)});
    }
    if(name==="train"){
      renderTable();
      $("statusMessage").textContent=t("statusTrain");
    }
    if(name==="explore")updateExplore();
  }
};

function applyLanguage(choice){
  uiLanguage=resolvedLanguage(choice);
  applyStaticLanguage();
  renderStepStrips();
  renderStepGrid();
  renderTable();
  updateListen();
  if(activePanel==="construct")setConstruction(constructionStep);
  else if(activePanel==="explore")updateExplore();
  else activatePanel(activePanel);
  newQuestion();
}

$("languageSelect").addEventListener("change",e=>{
  const choice=e.target.value;
  try{localStorage.setItem("urmawiLanguagePreference",choice)}catch(_){}
  applyLanguage(choice);
});

let initialChoice="";
const requestedLanguage=new URLSearchParams(location.search).get("lang");
if(["en","fa","ar","tr"].includes(requestedLanguage)) initialChoice=requestedLanguage;
if(!initialChoice){try{initialChoice=localStorage.getItem("urmawiLanguagePreference")||""}catch(_){}}
if(!["en","fa","ar","tr"].includes(initialChoice))initialChoice=detectedLanguage();
if(!["en","fa","ar","tr"].includes(initialChoice))initialChoice="en";
$("languageSelect").value=initialChoice;
applyLanguage(initialChoice);


/* ==========================================================================
   Scholarly Atlas extensions: curriculum, source policy, audio, modes,
   accessibility and mathematical validation.
   ========================================================================== */
const EXT_UI={
 en:{learn:"Learn",explore:"Explore",construct:"Construct",listen:"Listen",modes:"Species & Modes",train:"Train & Data",sources:"Sources",both:"View: both",theory:"View: theory",practical:"View: instrument",instrumentDisclosure:"Illustrative four-string mapping — not a reconstruction of a specific surviving instrument",guided:"Guided curriculum",evidence:"Evidence map",details:"Details",audioModel:"Audio model",pure:"Pure oscillator",pluck:"Plucked-string simulation",volume:"Volume",decay:"Pluck decay",stopAudio:"■ Stop audio",species:"Tetrachord species",lab:"Species Atlas",fromSpecies:"From species to adwār",hear:"▶ Hear",openSource:"Open source notes",validation:"Mathematical validation",testsPassed:"{n}/{total} tests passed",dialogTitle:"Sources, verification, and editorial policy",close:"Close"},
 fa:{learn:"آموزش",explore:"کاوش",construct:"ساخت",listen:"شنیدن",modes:"اجناس و ادوار",train:"تمرین و داده",sources:"منابع",both:"نما: ترکیبی",theory:"نما: نظری",practical:"نما: ساز",instrumentDisclosure:"نگاشت تصویریِ چهار سیم — نه بازسازی یک ساز تاریخی مشخص",guided:"مسیر آموزشی",evidence:"نقشهٔ شواهد",details:"جزئیات",audioModel:"مدل صوتی",pure:"نوسان‌ساز خالص",pluck:"شبیه‌سازی سیم زخمه‌ای",volume:"بلندی صدا",decay:"میرایی زخمه",stopAudio:"■ توقف صدا",species:"اجناسِ چهارگان",lab:"اطلس جنس",fromSpecies:"از جنس تا ادوار",hear:"▶ بشنوید",openSource:"یادداشت‌های منبع",validation:"اعتبارسنجی ریاضی",testsPassed:"{n} از {total} آزمون موفق",dialogTitle:"منابع، اعتبارسنجی و سیاست ویرایشی",close:"بستن"},
 ar:{learn:"التعلّم",explore:"الاستكشاف",construct:"البناء",listen:"الاستماع",modes:"الأجناس والأدوار",train:"التدريب والبيانات",sources:"المصادر",both:"العرض: مشترك",theory:"العرض: نظري",practical:"العرض: الآلة",instrumentDisclosure:"تمثيل توضيحي لأربع أوتار — وليس إعادة بناء لآلة تاريخية بعينها",guided:"منهج موجّه",evidence:"خريطة الأدلة",details:"تفاصيل",audioModel:"نموذج الصوت",pure:"مذبذب نقي",pluck:"محاكاة وتر منقور",volume:"شدة الصوت",decay:"اضمحلال النقر",stopAudio:"■ إيقاف الصوت",species:"أجناس الأرباع",lab:"أطلس الأجناس",fromSpecies:"من الجنس إلى الأدوار",hear:"▶ استمع",openSource:"ملاحظات المصدر",validation:"التحقق الرياضي",testsPassed:"نجح {n} من {total}",dialogTitle:"المصادر والتحقق والسياسة التحريرية",close:"إغلاق"},
 tr:{learn:"Öğren",explore:"Keşfet",construct:"Kur",listen:"Dinle",modes:"Cinsler ve Devirler",train:"Alıştırma ve Veri",sources:"Kaynaklar",both:"Görünüm: birlikte",theory:"Görünüm: kuram",practical:"Görünüm: çalgı",instrumentDisclosure:"Dört telli açıklayıcı eşleme — belirli bir tarihî çalgının rekonstrüksiyonu değildir",guided:"Yönlendirilmiş müfredat",evidence:"Kanıt haritası",details:"Ayrıntılar",audioModel:"Ses modeli",pure:"Saf osilatör",pluck:"Telli çalgı benzetimi",volume:"Ses düzeyi",decay:"Tını sönümü",stopAudio:"■ Sesi durdur",species:"Dörtlü cinsleri",lab:"Cins Atlası",fromSpecies:"Cinsten devirlere",hear:"▶ Dinle",openSource:"Kaynak notları",validation:"Matematiksel doğrulama",testsPassed:"{total} testten {n} geçti",dialogTitle:"Kaynaklar, doğrulama ve editoryal politika",close:"Kapat"}
};
function et(key,vars={}){let s=(EXT_UI[uiLanguage]||EXT_UI.en)[key]||EXT_UI.en[key]||key;Object.entries(vars).forEach(([k,v])=>s=s.replaceAll(`{${k}}`,v));return s}

const LESSONS=[
 {kicker:"Foundation",status:"Source concept + modern acoustics",title:"String length and pitch",objective:"Understand the reciprocal relation between sounding length and ideal frequency.",copy:"Al-Urmawī begins from the properties of notes and fret division. In this Atlas the whole sounding string is normalized to 1. Stopping the string leaves a shorter sounding segment; under the ideal monochord model, frequency changes as the reciprocal of that remaining length.",formula:"f / f₀ = 1 / ℓ",note:0,demo:[0,17]},
 {kicker:"Primary consonances",status:"Exact ratios",title:"Octave, fifth, and fourth",objective:"Construct the principal consonances geometrically and hear them.",copy:"Halving the string gives the octave. Retaining two of three equal parts gives the fifth. Retaining three of four equal parts gives the fourth. These are the clearest bridge between geometry and sound.",formula:"1/2 ↔ 2/1   ·   2/3 ↔ 3/2   ·   3/4 ↔ 4/3",note:10,demo:[0,17,10,7]},
 {kicker:"Derived positions",status:"Modern pedagogical reconstruction",title:"Generate positions by exact multiplication",objective:"See how established ratios can generate further positions without decimal approximation.",copy:"The interface derives later positions by multiplying known sounding lengths by exact fractions such as 3/4, 8/9, 9/8, or 2/3. This click-by-click order is a teaching reconstruction: the resulting fractions are exact, but the sequence is not presented as a diplomatic transcription of one manuscript passage.",formula:"ℓ₂ = ℓ₁ × p/q",note:4,demo:[7,14,4,1]},
 {kicker:"Parent lattice",status:"Conventional 3-limit reading",title:"The 17-position octave lattice",objective:"Distinguish a parent pitch lattice from a single compulsory performance scale.",copy:"The displayed sequence contains seventeen positions inside the octave plus its endpoint. It provides a common theoretical grid from which interval species and cycles can be described. It should not be confused with 17-tone equal temperament or with a claim that every mode uses every position.",formula:"18 written points: 1/1 … 2/1",note:8,demo:[0,3,7,10,14,17]},
 {kicker:"Unequal small steps",status:"Mathematically verified",title:"Limma and Pythagorean comma",objective:"Hear and calculate the two adjacent step sizes.",copy:"Adjacent positions are separated by either a limma or a Pythagorean comma. The pattern has twelve limmas and five commas; their product closes the octave. The unequal sizes are a defining feature of this conventional reconstruction.",formula:"L = 256/243   ·   C = 531441/524288   ·   L¹²C⁵ = 2",note:1,demo:[0,1,2]},
 {kicker:"Modal application",status:"Source-grounded framework + cautious interpretation",title:"From interval species to adwār",objective:"Understand how tetrachord and pentachord species support octave cycles.",copy:"The treatise presents modal cycles through combinations of interval species. This Atlas begins with exact tetrachord identities and then shows categorical labels such as Ṭanīnī, mujannab, and baqiyyah. Exact practical intonation of a categorical mujannab should not be treated as universally fixed.",formula:"lower species + upper species → octave cycle",note:7,demo:[0,3,7]}
];
let lessonIndex=0;
function renderLessons(){
 const list=$("lessonItems");if(!list)return;list.innerHTML="";
 LESSONS.forEach((l,i)=>{const b=document.createElement("button");b.className=`lesson-btn ${i===lessonIndex?"active":""}`;b.innerHTML=`<span class="lesson-num">${i+1}</span><span>${l.title}</span>`;b.addEventListener("click",()=>setLesson(i));list.appendChild(b)});
 const l=LESSONS[lessonIndex];$("lessonKicker").textContent=l.kicker;$("lessonSourceStatus").textContent=l.status;$("lessonTitle").textContent=l.title;$("lessonObjective").textContent=`Objective: ${l.objective}`;$("lessonCopy").textContent=l.copy;$("lessonFormula").textContent=l.formula;$("lessonProgressText").textContent=`${lessonIndex+1} / ${LESSONS.length}`;$("lessonProgressBar").style.width=`${((lessonIndex+1)/LESSONS.length)*100}%`;$("lessonPrevious").disabled=lessonIndex===0;$("lessonNext").disabled=lessonIndex===LESSONS.length-1;
}
function setLesson(i){lessonIndex=Math.max(0,Math.min(LESSONS.length-1,i));selected=LESSONS[lessonIndex].note;renderLessons();renderMonochord();updateExplore()}
function demonstrateLesson(){stopAllAudio();const seq=LESSONS[lessonIndex].demo;seq.forEach((n,i)=>tone(n,i*.56,.52,.12))}

const SPECIES=[
 {title:"Diatonic order I",code:"T–T–B",steps:[{n:9,d:8,name:"T"},{n:9,d:8,name:"T"},{n:256,d:243,name:"B"}],copy:"Two whole tones followed by the remainder (baqiyyah). The exact product is a perfect fourth."},
 {title:"Diatonic order II",code:"T–B–T",steps:[{n:9,d:8,name:"T"},{n:256,d:243,name:"B"},{n:9,d:8,name:"T"}],copy:"The same exact interval inventory in a different order."},
 {title:"Diatonic order III",code:"B–T–T",steps:[{n:256,d:243,name:"B"},{n:9,d:8,name:"T"},{n:9,d:8,name:"T"}],copy:"The remainder precedes the two whole tones; the total remains 4/3."},
 {title:"Iṣfahān category",code:"J–J–J–B",steps:null,copy:"A five-note fourth described categorically. The three mujannab intervals are intentionally left without one imposed cent value in this interface."}
];
let speciesIndex=0;
function multiplyRatios(steps){return steps.reduce((a,s)=>reduce(a.n*s.n,a.d*s.d),{n:1,d:1})}
function renderSpecies(){
 const list=$("speciesList");if(!list)return;list.innerHTML="";SPECIES.forEach((s,i)=>{const b=document.createElement("button");b.className=`species-btn ${i===speciesIndex?"active":""}`;b.innerHTML=`${s.title}<span class="species-code">${s.code}</span>`;b.addEventListener("click",()=>{speciesIndex=i;renderSpecies()});list.appendChild(b)});
 const s=SPECIES[speciesIndex];$("builderTitle").textContent=s.title;$("builderCopy").textContent=s.copy;const chain=$("intervalChain");chain.innerHTML="";
 if(s.steps){s.steps.forEach(x=>{const d=document.createElement("div");d.className="interval-block";d.innerHTML=`<b>${x.name}</b><span>${x.n}/${x.d} · ${fixed(1200*Math.log2(x.n/x.d),2)}¢</span>`;chain.appendChild(d)});const r=multiplyRatios(s.steps);$("speciesResult").textContent=`Product = ${r.n}/${r.d} = ${fixed(1200*Math.log2(r.n/r.d),3)}¢`;}
 else{["J","J","J","B"].forEach(x=>{const d=document.createElement("div");d.className="interval-block";d.innerHTML=`<b>${x}</b><span>${x==="B"?"baqiyyah":"mujannab category"}</span>`;chain.appendChild(d)});$("speciesResult").textContent="Categorical model: exact J sizes are deliberately not fixed here."}
}
function playCurrentSpecies(){stopAllAudio();const s=SPECIES[speciesIndex];if(!s.steps){[0,1,3,5,7].forEach((n,i)=>tone(n,i*.48,.46,.11));return}let ratio=1;const freqs=[1];s.steps.forEach(x=>{ratio*=x.n/x.d;freqs.push(ratio)});freqs.forEach((r,i)=>playFrequency(currentBase()*r,i*.52,.46,.11))}

let activeAudioNodes=new Set();
function registerNode(node){activeAudioNodes.add(node);node.addEventListener?.("ended",()=>activeAudioNodes.delete(node));return node}
function stopAllAudio(){activeAudioNodes.forEach(n=>{try{n.stop(0)}catch(_){}});activeAudioNodes.clear()}
function getMasterVolume(v){return Math.max(.01,Math.min(.35,Number($("masterVolume")?.value||v||.14)))}
function playFrequency(freq,delay=0,duration=.68,volume=.14){
 const c=ctx(),now=c.currentTime+delay,mode=$("audioMode")?.value||"pure",vol=getMasterVolume(volume);
 if(mode==="pluck"){
   const sr=c.sampleRate,N=Math.max(2,Math.round(sr/freq)),len=Math.max(N+2,Math.round(sr*Math.max(duration,1.4))),buf=c.createBuffer(1,len,sr),data=buf.getChannelData(0),decay=Number($("pluckDecay")?.value||.992);
   for(let i=0;i<N;i++)data[i]=(Math.random()*2-1)*.72;
   for(let i=N;i<len;i++)data[i]=decay*.5*(data[i-N]+data[i-N+1]);
   const src=registerNode(c.createBufferSource()),gain=c.createGain();src.buffer=buf;gain.gain.setValueAtTime(vol,now);gain.gain.exponentialRampToValueAtTime(.0001,now+Math.max(duration,1.15));src.connect(gain).connect(c.destination);src.start(now);src.stop(now+Math.max(duration,1.2));return;
 }
 const osc=registerNode(c.createOscillator()),gain=c.createGain();osc.type=currentWave();osc.frequency.setValueAtTime(freq,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(vol,now+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(c.destination);osc.start(now);osc.stop(now+duration+.04);
}
tone=function(index,delay=0,duration=.68,volume=.14){playFrequency(currentBase()*frequencyRatio(NOTES[index]),delay,duration,volume)};
toneRatio=function(n,d,delay=0){playFrequency(currentBase()*(n/d),delay,.72,.14)};

function runValidationTests(){
 const tests=[];const add=(name,pass,detail="")=>tests.push({name,pass:Boolean(pass),detail});
 add("18 written points",NOTES.length===18,`found ${NOTES.length}`);
 add("Open string is 1/1",NOTES[0].lenN===1&&NOTES[0].lenD===1);
 add("Octave endpoint is 1/2 length and 2/1 frequency",NOTES.at(-1).lenN===1&&NOTES.at(-1).lenD===2&&Math.abs(frequencyRatio(NOTES.at(-1))-2)<1e-12);
 add("Pitch order strictly ascends",NOTES.every((n,i)=>i===0||frequencyRatio(n)>frequencyRatio(NOTES[i-1])));
 add("Every fraction is reduced",NOTES.every(n=>gcd(n.lenN,n.lenD)===1));
 add("Reciprocal length/frequency identity",NOTES.every(n=>Math.abs(lengthValue(n)*frequencyRatio(n)-1)<1e-12));
 add("Adjacent pattern has 12 limmas and 5 commas",STEP_TYPES.filter(x=>x==="L").length===12&&STEP_TYPES.filter(x=>x==="C").length===5);
 const octaveProduct=Math.pow(LIMMA.n/LIMMA.d,12)*Math.pow(COMMA.n/COMMA.d,5);add("Twelve limmas plus five commas close the octave",Math.abs(octaveProduct-2)<1e-10,octaveProduct.toPrecision(12));
 const ttb=(9/8)*(9/8)*(256/243);add("T–T–B equals the perfect fourth",Math.abs(ttb-4/3)<1e-12,ttb.toPrecision(12));
 add("Monochord and instrument bridge/nut coordinates align",X0===INSTRUMENT.bridgeX&&X1===INSTRUMENT.nutX);
 const passed=tests.filter(x=>x.pass).length;const badge=$("validationBadge"),caption=$("validationCaption"),list=$("validationDialogList");if(badge)badge.textContent=`${passed}/${tests.length}`;if(caption)caption.textContent=et("testsPassed",{n:passed,total:tests.length});if(list){list.innerHTML="";tests.forEach(x=>{const li=document.createElement("li");li.className=x.pass?"pass":"fail";li.textContent=`${x.pass?"PASS":"FAIL"} — ${x.name}${x.detail?` (${x.detail})`:""}`;list.appendChild(li)})}return {passed,total:tests.length,tests}
}

function openSourceDialog(){$("sourceDialog").classList.add("open");$("closeSourceDialog").focus()}
function closeSourceDialog(){$("sourceDialog").classList.remove("open");$("sourceBtn").focus()}
let viewMode=0;
function applyViewMode(mode=viewMode){
 viewMode=Math.max(0,Math.min(2,Number(mode)||0));
 document.body.classList.toggle("view-theory",viewMode===1);
 document.body.classList.toggle("view-practical",viewMode===2);
 const btn=$("viewModeBtn");
 if(btn){
  btn.textContent=viewMode===0?et("both"):viewMode===1?et("theory"):et("practical");
  btn.classList.toggle("view-active",viewMode!==0);
  btn.dataset.mode=["both","theory","practical"][viewMode];
 }
 const label=$("viewStateLabel");
 if(label) label.textContent=viewMode===0?fullText("combinedViewLabel"):viewMode===1?fullText("theoryViewLabel"):fullText("practicalViewLabel");
}
function cycleView(){applyViewMode((viewMode+1)%3)}

const originalActivatePanel=activatePanel;
activatePanel=function(name){
 originalActivatePanel(name);
 document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected',b.dataset.panel===name?'true':'false'));
 if(name==="learn"){renderLessons();$("monoHint").textContent="Follow the guided lesson, then use the same positions in Explore."}
 if(name==="modes"){renderSpecies();$("monoHint").textContent="Interval species are mapped onto the same parent lattice."}
};

const previousApplyStaticLanguage=applyStaticLanguage;
applyStaticLanguage=function(){
 previousApplyStaticLanguage();
 const keys=["learn","explore","construct","listen","modes","train"];document.querySelectorAll('.tab').forEach((b,i)=>b.innerHTML=`<span class="tab-number">0${i+1}</span>${et(keys[i])}`);
 $("sourceBtn").textContent=et("sources");if($("viewModeBtn"))$("viewModeBtn").textContent=viewMode===0?et("both"):viewMode===1?et("theory"):et("practical");$("instrumentDisclosure").textContent=et("instrumentDisclosure");$("lessonListTitle").textContent=et("guided");$("sourceBasisTitle").textContent=et("evidence");$("openSourcesFromLesson").textContent=et("details");$("audioModeLabel").textContent=et("audioModel");$("audioMode").options[0].textContent=et("pure");$("audioMode").options[1].textContent=et("pluck");$("volumeLabel").textContent=et("volume");$("decayLabel").textContent=et("decay");$("stopAudio").textContent=et("stopAudio");$("speciesTitle").textContent=et("species");$("builderHead").textContent=et("lab");$("modalApplicationsTitle").textContent=et("fromSpecies");$("playSpecies").textContent=et("hear");$("openSourcesFromModes").textContent=et("openSource");if($("validationTitle"))$("validationTitle").textContent=et("validation");$("sourceDialogTitle").textContent=et("dialogTitle");$("closeSourceDialog").textContent=et("close");renderLessons();renderSpecies();runValidationTests();
};

$("lessonPrevious").addEventListener("click",()=>setLesson(lessonIndex-1));$("lessonNext").addEventListener("click",()=>setLesson(lessonIndex+1));$("lessonDemonstrate").addEventListener("click",demonstrateLesson);
$("playSpecies").addEventListener("click",playCurrentSpecies);$("stopAudio").addEventListener("click",stopAllAudio);
$("sourceBtn").addEventListener("click",openSourceDialog);$("openSourcesFromLesson").addEventListener("click",openSourceDialog);$("openSourcesFromModes").addEventListener("click",openSourceDialog);$("closeSourceDialog").addEventListener("click",closeSourceDialog);$("sourceDialog").addEventListener("click",e=>{if(e.target===$("sourceDialog"))closeSourceDialog()});
$("viewModeBtn")?.addEventListener("click",cycleView);
window.addEventListener("keydown",e=>{if(e.key==="Escape"){$("sourceDialog").classList.remove("open");stopAllAudio()}if(e.altKey&&e.key.toLowerCase()==="s"){e.preventDefault();openSourceDialog()}if(e.altKey&&e.key.toLowerCase()==="l"){e.preventDefault();activatePanel("learn")}});

renderLessons();renderSpecies();runValidationTests();applyStaticLanguage();activatePanel("learn");


/* ==========================================================================
   Comprehensive four-language content layer and prominent theory view.
   ========================================================================== */
const FULL_I18N={
 en:{
  ui:{
   skip:"Skip to learning workspace",tabsLabel:"Learning modes",monoPanelAria:"Persistent interactive monochord",monoTitle:"Al-Urmawī theoretical monochord",monoDesc:"A horizontal theoretical string from bridge to nut with seventeen pitch positions and the octave.",instrumentAria:"Illustrative four-string long-neck instrument mapping",sourceTitle:"Open sources and editorial policy",viewTitle:"Cycle through combined, theoretical, and instrument views",contrastTitle:"Toggle high contrast",textTitle:"Toggle larger text",combinedViewLabel:"Combined theoretical + practical view",theoryViewLabel:"Theoretical monochord — enlarged",practicalViewLabel:"Illustrative instrument view",learnPanelAria:"Guided lessons",modesPanelAria:"Tetrachord species and modal applications",previous:"← Previous",demonstrate:"▶ Demonstrate",next:"Next →",objective:"Objective",primaryManuscript:"Primary manuscript",exactModel:"Exact analytical model",editorialDistinction:"Editorial distinction",exactFourth:"Exact fourth",interpretiveLayer:"Interpretive layer",historicalCategories:"Historical categories",isfahanExample:"Iṣfahān example",testsNotRun:"Tests have not run.",product:"Product",categoricalModel:"Categorical model",mujannabCategory:"mujannab category",baqiyyah:"baqiyyah",exactJNotFixed:"exact J sizes are deliberately not fixed here",hintLearn:"Follow the guided lesson, then use the same positions in Explore.",hintModes:"Interval species are mapped onto the same parent lattice.",pass:"PASS",fail:"FAIL",found:"found {n}",sourceLink:"Qatar Digital Library · British Library Or 136",coverage:"Four-language content coverage is complete",viewCoverage:"Theory, combined, and instrument views are available"},
  lessons:[
   {kicker:"Foundation",status:"Source concept + modern acoustics",title:"String length and pitch",objective:"Understand the reciprocal relation between sounding length and ideal frequency.",copy:"Al-Urmawī begins from the properties of notes and fret division. In this Atlas the whole sounding string is normalized to 1. Stopping the string leaves a shorter sounding segment; under the ideal monochord model, frequency changes as the reciprocal of that remaining length."},
   {kicker:"Primary consonances",status:"Exact ratios",title:"Octave, fifth, and fourth",objective:"Construct the principal consonances geometrically and hear them.",copy:"Halving the string gives the octave. Retaining two of three equal parts gives the fifth. Retaining three of four equal parts gives the fourth. These are the clearest bridge between geometry and sound."},
   {kicker:"Derived positions",status:"Modern pedagogical reconstruction",title:"Generate positions by exact multiplication",objective:"See how established ratios can generate further positions without decimal approximation.",copy:"The interface derives later positions by multiplying known sounding lengths by exact fractions such as 3/4, 8/9, 9/8, or 2/3. This click-by-click order is a teaching reconstruction: the resulting fractions are exact, but the sequence is not presented as a diplomatic transcription of one manuscript passage."},
   {kicker:"Parent lattice",status:"Conventional 3-limit reading",title:"The 17-position octave lattice",objective:"Distinguish a parent pitch lattice from a single compulsory performance scale.",copy:"The displayed sequence contains seventeen positions inside the octave plus its endpoint. It provides a common theoretical grid from which interval species and cycles can be described. It should not be confused with 17-tone equal temperament or with a claim that every mode uses every position."},
   {kicker:"Unequal small steps",status:"Mathematically verified",title:"Limma and Pythagorean comma",objective:"Hear and calculate the two adjacent step sizes.",copy:"Adjacent positions are separated by either a limma or a Pythagorean comma. The pattern has twelve limmas and five commas; their product closes the octave. The unequal sizes are a defining feature of this conventional reconstruction."},
   {kicker:"Modal application",status:"Source-grounded framework + cautious interpretation",title:"From interval species to adwār",objective:"Understand how tetrachord and pentachord species support octave cycles.",copy:"The treatise presents modal cycles through combinations of interval species. This Atlas begins with exact tetrachord identities and then shows categorical labels such as Ṭanīnī, mujannab, and baqiyyah. Exact practical intonation of a categorical mujannab should not be treated as universally fixed."}
  ],
  species:[
   {title:"Diatonic order I",copy:"Two whole tones followed by the remainder (baqiyyah). The exact product is a perfect fourth."},
   {title:"Diatonic order II",copy:"The same exact interval inventory in a different order."},
   {title:"Diatonic order III",copy:"The remainder precedes the two whole tones; the total remains 4/3."},
   {title:"Iṣfahān category",copy:"A five-note fourth described categorically. The three mujannab intervals are intentionally left without one imposed cent value in this interface."}
  ],
  sourceMap:{primaryCopy:"Kitāb al-Adwār, Section 2 (fret division), ff. 3v–5r; Section 3 (interval ratios), ff. 5r–8r.",modelCopy:"The pitch table uses the conventional 3-limit/Pythagorean reading of the 17-position parent lattice.",editorialCopy:"The ratios are exact; the lesson order and prose are a modern pedagogical reconstruction."},
  modal:{applications:"Al-Urmawī combines lower tetrachord and upper pentachord species into octave cycles. This Atlas demonstrates interval categories; it does not claim that one fixed modern tuning exhausts medieval performance practice.",categories:"Ṭanīnī (T), mujannab (J), and baqiyyah (B) are interval categories used in the Systematist literature.",isfahan:"The five-note fourth is described categorically as J–J–J–B in later analytical presentation; exact J sizes can vary by theoretical or practical context."},
  dialog:{primaryHeading:"Primary manuscript location",primaryParagraph:"The project anchors fret division in Kitāb al-Adwār, Section Two, ff. 3v–5r, and interval ratios in Section Three, ff. 5r–8r. Modal combinations are treated in Section Six, ff. 11r–18r; lute tuning and derivation occur in Section Eight, ff. 18v–19v.",verifiedHeading:"What is verified here",verified:["All stored fractions reduce correctly and their reciprocals generate the displayed frequency ratios.","The 18 displayed points ascend from 1/1 to 2/1.","The adjacent pattern contains twelve limmas and five Pythagorean commas and multiplies to the octave.","The common T–T–B tetrachord identity equals 4/3 exactly."],interpretiveHeading:"What remains interpretive",interpretiveParagraph:"The click-by-click construction sequence, modern prose, synthesized sound, and four-string instrument drawing are pedagogical interpretations. They are not a diplomatic transcription, a claim about one unique historical performance tuning, or a reconstruction of a specific surviving instrument.",orientationHeading:"Scholarly orientation",orientationParagraph:"The conventional 3-limit reading is retained as a transparent analytical model. Owen Wright’s work remains a major modern framework for the Systematist tradition. Recent scholarship also stresses that categorical interval names and practical intonation should not be treated as universally fixed cent values.",languageHeading:"Language review",languageParagraph:"All interface content in this build is available in English, Persian, Arabic, and Turkish. Historical terminology should nevertheless receive specialist native-speaker and philological review before formal publication."},
  tests:["18 written points","Open string is 1/1","Octave endpoint is 1/2 length and 2/1 frequency","Pitch order strictly ascends","Every fraction is reduced","Reciprocal length/frequency identity","Adjacent pattern has 12 limmas and 5 commas","Twelve limmas plus five commas close the octave","T–T–B equals the perfect fourth","Monochord and instrument bridge/nut coordinates align","Four-language content structure is complete"]
 },
 fa:{
  ui:{skip:"رفتن به فضای آموزشی",tabsLabel:"حالت‌های آموزشی",monoPanelAria:"تک‌سیم تعاملیِ نظری",monoTitle:"تک‌سیم نظریِ ارموی",monoDesc:"سیمی افقی از خرک تا شیطانک، با هفده جایگاه صوتی و نقطهٔ اکتاو.",instrumentAria:"نگاشت تصویریِ یک ساز دسته‌بلند چهار سیم",sourceTitle:"گشودن منابع و سیاست ویرایشی",viewTitle:"گردش میان نمای ترکیبی، نظری و ساز",contrastTitle:"روشن یا خاموش کردن کنتراست بالا",textTitle:"روشن یا خاموش کردن متن درشت",combinedViewLabel:"نمای ترکیبیِ نظری و عملی",theoryViewLabel:"تک‌سیم نظری — بزرگ‌نمایی‌شده",practicalViewLabel:"نمای تصویریِ ساز",learnPanelAria:"درس‌های هدایت‌شده",modesPanelAria:"اجناس چهارگان و کاربردهای مقامی",previous:"← قبلی",demonstrate:"▶ نمایش و شنیدن",next:"بعدی →",objective:"هدف",primaryManuscript:"نسخهٔ خطی اصلی",exactModel:"مدل تحلیلیِ دقیق",editorialDistinction:"تمایز ویرایشی",exactFourth:"چهارمِ دقیق",interpretiveLayer:"لایهٔ تفسیری",historicalCategories:"رده‌های تاریخی",isfahanExample:"نمونهٔ اصفهان",testsNotRun:"آزمون‌ها هنوز اجرا نشده‌اند.",product:"حاصل‌ضرب",categoricalModel:"مدل رده‌ای",mujannabCategory:"ردهٔ مجنّب",baqiyyah:"بقیّه",exactJNotFixed:"اندازهٔ دقیقِ J در اینجا عمداً ثابت نشده است",hintLearn:"درس هدایت‌شده را دنبال کنید و سپس همان جایگاه‌ها را در بخش کاوش بررسی کنید.",hintModes:"اجناس فاصله‌ای بر همان شبکهٔ مادر نگاشت می‌شوند.",pass:"موفق",fail:"ناموفق",found:"{n} مورد یافت شد",sourceLink:"کتابخانهٔ دیجیتال قطر · نسخهٔ Or 136 کتابخانهٔ بریتانیا",coverage:"پوشش محتواییِ چهار زبان کامل است",viewCoverage:"نماهای نظری، ترکیبی و ساز در دسترس‌اند"},
  lessons:[
   {kicker:"بنیاد",status:"مفهوم منبع + آکوستیک جدید",title:"طول سیم و زیرایی",objective:"رابطهٔ معکوس میان طول مرتعش و بسامد ایده‌آل را درک کنید.",copy:"ارموی بحث را از ویژگی‌های نغمه‌ها و تقسیم دستان‌ها آغاز می‌کند. در این محیط، طول کامل بخش مرتعش برابر ۱ در نظر گرفته می‌شود. با گرفتن سیم، بخش مرتعش کوتاه‌تر می‌شود و در مدل ایده‌آل تک‌سیم، بسامد با معکوس طول باقی‌مانده تغییر می‌کند."},
   {kicker:"هم‌آوایی‌های اصلی",status:"نسبت‌های دقیق",title:"اکتاو، پنجم و چهارم",objective:"هم‌آوایی‌های اصلی را هندسی بسازید و بشنوید.",copy:"نصف‌کردن طول سیم اکتاو را می‌سازد. نگه‌داشتن دو بخش از سه بخش مساوی پنجم درست را می‌دهد و نگه‌داشتن سه بخش از چهار بخش مساوی چهارم درست را. این نسبت‌ها روشن‌ترین پیوند میان هندسه و صدا هستند."},
   {kicker:"جایگاه‌های مشتق",status:"بازسازی آموزشیِ جدید",title:"ساخت جایگاه‌ها با ضرب دقیق",objective:"ببینید نسبت‌های ساخته‌شده چگونه بدون تقریب اعشاری جایگاه‌های بعدی را تولید می‌کنند.",copy:"رابط کاربری، جایگاه‌های بعدی را با ضرب طول‌های شناخته‌شده در کسرهای دقیقی مانند ۳/۴، ۸/۹، ۹/۸ یا ۲/۳ به‌دست می‌آورد. ترتیب گام‌به‌گام یک بازسازی آموزشی است: کسرها دقیق‌اند، اما این توالی به‌عنوان رونویسی دیپلماتیکِ یک عبارت نسخهٔ خطی عرضه نمی‌شود."},
   {kicker:"شبکهٔ مادر",status:"خوانش متعارفِ حدّ سوم",title:"شبکهٔ هفده جایگاه در اکتاو",objective:"شبکهٔ مادرِ صوتی را از یک گام اجراییِ اجباری متمایز کنید.",copy:"توالی نمایش‌داده‌شده هفده جایگاه درون اکتاو و نقطهٔ پایانی اکتاو را دربرمی‌گیرد. این شبکه، زمینه‌ای مشترک برای توصیف اجناس فاصله‌ای و ادوار فراهم می‌کند. نباید آن را با تقسیم مساوی هفده‌گانه یا با ادعای استفادهٔ همهٔ مقام‌ها از همهٔ جایگاه‌ها یکی دانست."},
   {kicker:"گام‌های کوچکِ نابرابر",status:"اعتبارسنجی‌شدهٔ ریاضی",title:"لیما و کمای فیثاغوری",objective:"دو اندازهٔ گام مجاور را بشنوید و محاسبه کنید.",copy:"هر دو جایگاه مجاور با لیما یا کمای فیثاغوری از هم جدا می‌شوند. الگو شامل دوازده لیما و پنج کماست و حاصل‌ضرب آن‌ها اکتاو را کامل می‌کند. نابرابریِ این اندازه‌ها ویژگی مهم این بازسازی متعارف است."},
   {kicker:"کاربرد مقامی",status:"چارچوب مبتنی بر منبع + تفسیر محتاطانه",title:"از اجناس فاصله‌ای تا ادوار",objective:"درک کنید چگونه اجناس چهارگان و پنجگان چرخه‌های اکتاو را پشتیبانی می‌کنند.",copy:"رساله چرخه‌های مقامی را با ترکیب اجناس فاصله‌ای ارائه می‌کند. این محیط با همانی‌های دقیقِ چهارگان آغاز می‌شود و سپس رده‌هایی چون طنینی، مجنّب و بقیّه را نشان می‌دهد. کوک عملیِ دقیقِ یک مجنّب رده‌ای را نباید در همهٔ زمینه‌ها مقدار ثابتی فرض کرد."}
  ],
  species:[
   {title:"ترتیب دیاتونیک ۱",copy:"دو پردهٔ کامل و سپس بقیّه. حاصل‌ضرب دقیق یک چهارم درست است."},
   {title:"ترتیب دیاتونیک ۲",copy:"همان مجموعهٔ دقیقِ فاصله‌ها با ترتیبی دیگر."},
   {title:"ترتیب دیاتونیک ۳",copy:"بقیّه پیش از دو پردهٔ کامل قرار می‌گیرد و مجموع همچنان ۴/۳ است."},
   {title:"ردهٔ اصفهان",copy:"چهارمِ پنج‌نغمه‌ای با توصیف رده‌ای. سه فاصلهٔ مجنّب در این رابط عمداً به یک مقدار ثابتِ سنت محدود نشده‌اند."}
  ],
  sourceMap:{primaryCopy:"کتاب الادوار، فصل دوم دربارهٔ تقسیم دستان‌ها، برگ‌های ۳پ–۵ر؛ فصل سوم دربارهٔ نسبت فاصله‌ها، برگ‌های ۵ر–۸ر.",modelCopy:"جدول صوتی از خوانش متعارفِ فیثاغوری/حدّ سوم برای شبکهٔ مادرِ هفده جایگاه استفاده می‌کند.",editorialCopy:"نسبت‌ها دقیق‌اند؛ ترتیب درس‌ها و نثر توضیحی، بازسازی آموزشیِ جدید است."},
  modal:{applications:"ارموی اجناس چهارگانِ پایین و پنجگانِ بالا را در چرخه‌های اکتاو ترکیب می‌کند. این اطلس رده‌های فاصله‌ای را نشان می‌دهد و ادعا نمی‌کند که یک کوک ثابتِ امروزی همهٔ شیوه‌های اجراییِ سده‌های میانه را توضیح می‌دهد.",categories:"طنینی (T)، مجنّب (J) و بقیّه (B) رده‌های فاصله‌ای در ادبیات مکتب نظام‌گرا هستند.",isfahan:"چهارمِ پنج‌نغمه‌ای در تحلیل‌های بعدی به‌صورت J–J–J–B توصیف شده است؛ اندازهٔ دقیق J می‌تواند با زمینهٔ نظری یا عملی تغییر کند."},
  dialog:{primaryHeading:"جایگاه نسخهٔ خطی اصلی",primaryParagraph:"این پروژه تقسیم دستان‌ها را به فصل دوم کتاب الادوار، برگ‌های ۳پ–۵ر، و نسبت فاصله‌ها را به فصل سوم، برگ‌های ۵ر–۸ر، پیوند می‌دهد. ترکیب‌های مقامی در فصل ششم، برگ‌های ۱۱ر–۱۸ر، و کوک عود و استخراج ادوار در فصل هشتم، برگ‌های ۱۸پ–۱۹پ، مطرح شده‌اند.",verifiedHeading:"موارد اعتبارسنجی‌شده",verified:["همهٔ کسرهای ذخیره‌شده در ساده‌ترین صورت‌اند و معکوس آن‌ها نسبت بسامد نمایش‌داده‌شده را تولید می‌کند.","هجده نقطهٔ نمایش‌داده‌شده از ۱/۱ تا ۲/۱ به‌طور صعودی مرتب‌اند.","الگوی مجاور شامل دوازده لیما و پنج کمای فیثاغوری است و حاصل‌ضرب آن به اکتاو می‌رسد.","همانی متداول چهارگان T–T–B دقیقاً برابر ۴/۳ است."],interpretiveHeading:"موارد تفسیری",interpretiveParagraph:"توالی ساخت گام‌به‌گام، نثر جدید، صدای ترکیبی و تصویر ساز چهار سیم، تفسیرهای آموزشی‌اند. آن‌ها رونویسی دیپلماتیک، ادعای یک کوک اجراییِ تاریخیِ یگانه یا بازسازی یک ساز باقی‌ماندهٔ مشخص نیستند.",orientationHeading:"جهت‌گیری پژوهشی",orientationParagraph:"خوانش متعارفِ حدّ سوم به‌عنوان مدلی تحلیلی و شفاف حفظ شده است. پژوهش اوون رایت همچنان یکی از چارچوب‌های مهم جدید برای سنت نظام‌گراست. پژوهش‌های جدید نیز تأکید می‌کنند که نام‌های رده‌ایِ فاصله و کوک عملی را نباید همواره به مقادیر ثابتِ سنت فروکاست.",languageHeading:"بازبینی زبان",languageParagraph:"تمام محتوای رابط در این نسخه به انگلیسی، فارسی، عربی و ترکی در دسترس است. بااین‌حال، اصطلاحات تاریخی پیش از انتشار رسمی باید به‌دست متخصصان بومی و زبان‌شناسان تاریخی بازبینی شوند."},
  tests:["هجده نقطهٔ نوشته‌شده","سیم باز برابر ۱/۱ است","پایان اکتاو طول ۱/۲ و نسبت بسامد ۲/۱ دارد","ترتیب زیرایی کاملاً صعودی است","همهٔ کسرها ساده شده‌اند","همانیِ معکوس طول و بسامد برقرار است","الگوی مجاور ۱۲ لیما و ۵ کما دارد","دوازده لیما و پنج کما اکتاو را کامل می‌کنند","T–T–B برابر چهارم درست است","مختصات خرک و شیطانک در تک‌سیم و ساز هم‌راستا هستند","ساختار محتوای چهار زبان کامل است"]
 },
 ar:{
  ui:{skip:"الانتقال إلى مساحة التعلّم",tabsLabel:"أنماط التعلّم",monoPanelAria:"مونوكورد نظري تفاعلي دائم",monoTitle:"المونوكورد النظري للأرموي",monoDesc:"وتر نظري أفقي من المشط إلى الأنف، عليه سبعة عشر موضعًا نغميًا ونقطة الأوكتاف.",instrumentAria:"تمثيل توضيحي لآلة طويلة العنق ذات أربعة أوتار",sourceTitle:"فتح المصادر والسياسة التحريرية",viewTitle:"التنقل بين العرض المشترك والنظري وعرض الآلة",contrastTitle:"تفعيل أو تعطيل التباين العالي",textTitle:"تفعيل أو تعطيل تكبير النص",combinedViewLabel:"عرض نظري وعملي مشترك",theoryViewLabel:"المونوكورد النظري — عرض مكبّر",practicalViewLabel:"عرض الآلة التوضيحي",learnPanelAria:"دروس موجّهة",modesPanelAria:"أجناس الأرباع والتطبيقات المقامية",previous:"← السابق",demonstrate:"▶ عرض وسماع",next:"التالي →",objective:"الهدف",primaryManuscript:"المخطوط الأساسي",exactModel:"النموذج التحليلي الدقيق",editorialDistinction:"التمييز التحريري",exactFourth:"رابعة دقيقة",interpretiveLayer:"طبقة تفسيرية",historicalCategories:"الفئات التاريخية",isfahanExample:"مثال إصفهان",testsNotRun:"لم تُجرَ الاختبارات بعد.",product:"حاصل الضرب",categoricalModel:"نموذج فئوي",mujannabCategory:"فئة المجنّب",baqiyyah:"البقية",exactJNotFixed:"أحجام J الدقيقة متروكة عمدًا بلا تثبيت هنا",hintLearn:"اتبع الدرس الموجّه ثم افحص المواضع نفسها في قسم الاستكشاف.",hintModes:"تُسقط أجناس الأبعاد على شبكة المواضع الأم نفسها.",pass:"نجاح",fail:"فشل",found:"عُثر على {n}",sourceLink:"مكتبة قطر الرقمية · المخطوط Or 136 في المكتبة البريطانية",coverage:"اكتمل توفر المحتوى باللغات الأربع",viewCoverage:"العروض النظري والمشترك وعرض الآلة متاحة"},
  lessons:[
   {kicker:"الأساس",status:"مفهوم من المصدر + صوتيات حديثة",title:"طول الوتر وارتفاع النغمة",objective:"فهم العلاقة العكسية بين طول الجزء المصوّت والتردد المثالي.",copy:"يبدأ الأرموي من خواص النغم وتقسيم الدساتين. في هذا الأطلس يُطبّع طول الوتر المصوّت الكامل إلى ١. وعند إيقاف الوتر يبقى جزء أقصر مصوّت، وفي نموذج المونوكورد المثالي يتغير التردد بحسب مقلوب ذلك الطول."},
   {kicker:"التآلفات الأساسية",status:"نِسَب دقيقة",title:"الأوكتاف والخامسة والرابعة",objective:"بناء التآلفات الأساسية هندسيًا وسماعها.",copy:"تنصيف الوتر يعطي الأوكتاف، والاحتفاظ بقسمين من ثلاثة أقسام متساوية يعطي الخامسة التامة، والاحتفاظ بثلاثة أقسام من أربعة يعطي الرابعة التامة. وهذه أوضح صلة بين الهندسة والصوت."},
   {kicker:"المواضع المشتقة",status:"إعادة بناء تعليمية حديثة",title:"توليد المواضع بالضرب الدقيق",objective:"رؤية كيف تولّد النِّسَب المنشأة مواضع أخرى بلا تقريب عشري.",copy:"تشتق الواجهة المواضع اللاحقة بضرب الأطوال المصوّتة المعروفة في كسور دقيقة مثل ٣/٤ أو ٨/٩ أو ٩/٨ أو ٢/٣. ترتيب النقر خطوة خطوة إعادة بناء تعليمية: الكسور الناتجة دقيقة، لكن التسلسل لا يُعرض بوصفه نقلًا دبلوماسيًا لعبارة واحدة في المخطوط."},
   {kicker:"الشبكة الأم",status:"قراءة تقليدية ثلاثية الحدود",title:"شبكة المواضع السبعة عشر في الأوكتاف",objective:"تمييز شبكة النغم الأم من سلّم أدائي إلزامي واحد.",copy:"يضم التسلسل المعروض سبعة عشر موضعًا داخل الأوكتاف مع نقطة نهايته. ويوفر شبكة نظرية مشتركة لوصف أجناس الأبعاد والأدوار. ولا ينبغي الخلط بينه وبين تقسيم متساوٍ من سبع عشرة درجة أو الزعم بأن كل مقام يستخدم كل المواضع."},
   {kicker:"خطوات صغيرة غير متساوية",status:"متحقق منها رياضيًا",title:"الليما والفاصلة الفيثاغورية",objective:"سماع وحساب حجمي الخطوتين المتجاورتين.",copy:"يفصل بين كل موضعين متجاورين إما ليما وإما فاصلة فيثاغورية. يضم النمط اثنتي عشرة ليما وخمس فواصل، ويغلق حاصل ضربها الأوكتاف. وعدم تساويها سمة أساسية لهذه القراءة التقليدية."},
   {kicker:"التطبيق المقامي",status:"إطار مستند إلى المصدر + تفسير حذر",title:"من أجناس الأبعاد إلى الأدوار",objective:"فهم كيف تدعم أجناس الأرباع والأخماس دورات الأوكتاف.",copy:"يعرض الكتاب الأدوار المقامية من خلال تركيب أجناس الأبعاد. يبدأ الأطلس بهويات دقيقة للأجناس الرباعية ثم يعرض فئات مثل الطنيني والمجنّب والبقية. ولا ينبغي اعتبار الضبط العملي الدقيق لفئة المجنّب ثابتًا على نحو شامل."}
  ],
  species:[
   {title:"الترتيب الدياتوني الأول",copy:"طنينيان كاملان ثم البقية. حاصل الضرب الدقيق رابعة تامة."},
   {title:"الترتيب الدياتوني الثاني",copy:"المخزون الدقيق نفسه من الأبعاد في ترتيب مختلف."},
   {title:"الترتيب الدياتوني الثالث",copy:"تسبق البقية الطنينيين الكاملين، ويبقى المجموع ٤/٣."},
   {title:"فئة إصفهان",copy:"رابعة من خمس نغمات موصوفة فئويًا. تُترك الأبعاد الثلاثة المجنّبة عمدًا دون فرض قيمة سنتية واحدة في هذه الواجهة."}
  ],
  sourceMap:{primaryCopy:"كتاب الأدوار، الفصل الثاني في تقسيم الدساتين، الأوراق ٣ظ–٥و؛ والفصل الثالث في نسب الأبعاد، الأوراق ٥و–٨و.",modelCopy:"يستخدم جدول النغم القراءة التقليدية الفيثاغورية/ثلاثية الحدود لشبكة المواضع السبعة عشر الأم.",editorialCopy:"النِّسَب دقيقة؛ أما ترتيب الدروس والنثر فإعادة بناء تعليمية حديثة."},
  modal:{applications:"يجمع الأرموي أجناس الأرباع السفلى وأجناس الأخماس العليا في أدوار أوكتافية. يوضح هذا الأطلس فئات الأبعاد، ولا يدّعي أن ضبطًا حديثًا ثابتًا يستنفد ممارسات الأداء في العصور الوسطى.",categories:"الطنيني (T) والمجنّب (J) والبقية (B) فئات للأبعاد في أدبيات المدرسة النظامية.",isfahan:"تُعرض الرابعة ذات النغمات الخمس في التحليل اللاحق بوصفها J–J–J–B؛ وقد تختلف أحجام J الدقيقة باختلاف السياق النظري أو العملي."},
  dialog:{primaryHeading:"موضع المخطوط الأساسي",primaryParagraph:"يربط المشروع تقسيم الدساتين بالفصل الثاني من كتاب الأدوار، الأوراق ٣ظ–٥و، ونِسَب الأبعاد بالفصل الثالث، الأوراق ٥و–٨و. وتعالج التركيبات المقامية في الفصل السادس، الأوراق ١١و–١٨و، بينما يرد ضبط العود واشتقاق الأدوار في الفصل الثامن، الأوراق ١٨ظ–١٩ظ.",verifiedHeading:"ما تم التحقق منه",verified:["جميع الكسور المخزنة في أبسط صورة، ومقلوباتها تولّد نسب التردد المعروضة.","تصعد النقاط الثماني عشرة المعروضة من ١/١ إلى ٢/١.","يضم نمط الخطوات المتجاورة اثنتي عشرة ليما وخمس فواصل فيثاغورية، ويضرب إلى الأوكتاف.","هوية الجنس الشائعة T–T–B تساوي ٤/٣ تمامًا."],interpretiveHeading:"ما يبقى تفسيريًا",interpretiveParagraph:"تسلسل البناء خطوة بخطوة، والنثر الحديث، والصوت المركب، ورسم الآلة ذات الأوتار الأربعة تفسيرات تعليمية. وهي ليست نقلًا دبلوماسيًا ولا ادعاءً بضبط تاريخي أدائي وحيد ولا إعادة بناء لآلة باقية بعينها.",orientationHeading:"التوجيه العلمي",orientationParagraph:"تُحفظ القراءة التقليدية ثلاثية الحدود بوصفها نموذجًا تحليليًا شفافًا. ويظل عمل أوين رايت إطارًا حديثًا مهمًا لدراسة المدرسة النظامية. كما تؤكد الدراسات الحديثة أن أسماء فئات الأبعاد والضبط العملي لا ينبغي اختزالها دائمًا في قيم سنتية ثابتة.",languageHeading:"مراجعة اللغة",languageParagraph:"جميع محتويات الواجهة في هذا الإصدار متاحة بالإنجليزية والفارسية والعربية والتركية. ومع ذلك ينبغي أن يراجع المختصون الناطقون بهذه اللغات والمحققون اللغويون المصطلحات التاريخية قبل النشر الرسمي."},
  tests:["ثماني عشرة نقطة مكتوبة","الوتر المطلق يساوي ١/١","نهاية الأوكتاف طولها ١/٢ ونسبة ترددها ٢/١","ترتيب النغم صاعد تمامًا","جميع الكسور مختزلة","هوية مقلوب الطول والتردد صحيحة","النمط المجاور يضم ١٢ ليما و٥ فواصل","اثنتا عشرة ليما وخمس فواصل تغلق الأوكتاف","T–T–B يساوي الرابعة التامة","إحداثيا المشط والأنف متطابقان في المونوكورد والآلة","بنية المحتوى باللغات الأربع مكتملة"]
 },
 tr:{
  ui:{skip:"Öğrenme alanına geç",tabsLabel:"Öğrenme modları",monoPanelAria:"Kalıcı etkileşimli kuramsal monokord",monoTitle:"Urmevî’nin kuramsal monokordu",monoDesc:"Köprüden üst eşiğe uzanan, on yedi ses konumu ve oktav noktası bulunan yatay kuramsal tel.",instrumentAria:"Dört telli uzun saplı çalgının açıklayıcı eşlemesi",sourceTitle:"Kaynakları ve editoryal politikayı aç",viewTitle:"Birleşik, kuramsal ve çalgı görünümleri arasında geçiş yap",contrastTitle:"Yüksek karşıtlığı aç veya kapat",textTitle:"Büyük metni aç veya kapat",combinedViewLabel:"Birleşik kuramsal + uygulamalı görünüm",theoryViewLabel:"Kuramsal monokord — büyütülmüş",practicalViewLabel:"Açıklayıcı çalgı görünümü",learnPanelAria:"Yönlendirilmiş dersler",modesPanelAria:"Dörtlü cinsleri ve makam uygulamaları",previous:"← Önceki",demonstrate:"▶ Göster ve dinlet",next:"Sonraki →",objective:"Amaç",primaryManuscript:"Birincil yazma",exactModel:"Kesin analitik model",editorialDistinction:"Editoryal ayrım",exactFourth:"Kesin dörtlü",interpretiveLayer:"Yorum katmanı",historicalCategories:"Tarihî kategoriler",isfahanExample:"İsfahan örneği",testsNotRun:"Testler henüz çalıştırılmadı.",product:"Çarpım",categoricalModel:"Kategorik model",mujannabCategory:"mücenneb kategorisi",baqiyyah:"bakiyye",exactJNotFixed:"J büyüklükleri burada bilinçli olarak tek değere sabitlenmemiştir",hintLearn:"Yönlendirilmiş dersi izleyin, ardından aynı konumları Keşfet bölümünde inceleyin.",hintModes:"Aralık cinsleri aynı ana ses örgüsüne eşlenir.",pass:"GEÇTİ",fail:"KALDI",found:"{n} bulundu",sourceLink:"Katar Dijital Kütüphanesi · British Library Or 136",coverage:"Dört dilde içerik kapsamı tamamlandı",viewCoverage:"Kuramsal, birleşik ve çalgı görünümleri kullanılabilir"},
  lessons:[
   {kicker:"Temel",status:"Kaynak kavramı + modern akustik",title:"Tel uzunluğu ve ses yüksekliği",objective:"Titreşen uzunluk ile ideal frekans arasındaki ters ilişkiyi anlayın.",copy:"Urmevî, seslerin özelliklerinden ve perdelerin bölünmesinden hareket eder. Bu stüdyoda titreşen tam tel 1 olarak normalize edilir. Tele basıldığında daha kısa bir bölüm titreşir; ideal monokord modelinde frekans, kalan uzunluğun tersiyle değişir."},
   {kicker:"Temel uyumlar",status:"Kesin oranlar",title:"Oktav, beşli ve dörtlü",objective:"Temel uyumları geometrik olarak kurun ve dinleyin.",copy:"Teli ikiye bölmek oktavı verir. Üç eşit parçanın ikisini korumak tam beşliyi, dört eşit parçanın üçünü korumak tam dörtlüyü verir. Bunlar geometri ile ses arasındaki en açık köprüdür."},
   {kicker:"Türetilmiş konumlar",status:"Modern öğretimsel yeniden kurma",title:"Konumları kesin çarpımla üretme",objective:"Kurulmuş oranların ondalık yaklaşıma gerek olmadan yeni konumlar üretmesini görün.",copy:"Arayüz daha sonraki konumları, bilinen titreşen uzunlukları 3/4, 8/9, 9/8 veya 2/3 gibi kesin kesirlerle çarparak türetir. Tıklama sırası öğretim amaçlı bir yeniden kurmadır: sonuç kesirleri kesindir, fakat sıra tek bir yazma pasajının diplomatik aktarımı olarak sunulmaz."},
   {kicker:"Ana örgü",status:"Geleneksel 3-limit okuma",title:"Oktavın 17 konumlu ses örgüsü",objective:"Ana ses örgüsünü tek ve zorunlu bir icra dizisinden ayırın.",copy:"Gösterilen sıra, oktav içindeki on yedi konumu ve oktav son noktasını içerir. Aralık cinsleri ile devirlerin tanımlanabileceği ortak bir kuramsal zemin sağlar. On yedi eşit bölümlü sistemle veya her makamın her konumu kullandığı iddiasıyla karıştırılmamalıdır."},
   {kicker:"Eşit olmayan küçük adımlar",status:"Matematiksel olarak doğrulandı",title:"Limma ve Pisagor koması",objective:"İki komşu adım büyüklüğünü dinleyin ve hesaplayın.",copy:"Komşu konumlar ya limma ya da Pisagor komasıyla ayrılır. Örüntü on iki limma ve beş komadan oluşur; çarpımları oktavı kapatır. Eşit olmayan büyüklükler bu geleneksel yeniden kurmanın belirleyici özelliğidir."},
   {kicker:"Makam uygulaması",status:"Kaynak temelli çerçeve + temkinli yorum",title:"Aralık cinslerinden devirlere",objective:"Dörtlü ve beşli cinslerinin oktav devirlerini nasıl desteklediğini anlayın.",copy:"Eser, makam devirlerini aralık cinslerinin birleşimleriyle sunar. Stüdyo kesin dörtlü özdeşlikleriyle başlar, ardından tanînî, mücenneb ve bakiyye gibi kategorileri gösterir. Kategorik bir mücennebin kesin icra perdesi evrensel olarak sabit kabul edilmemelidir."}
  ],
  species:[
   {title:"Diyatonik sıra I",copy:"İki tam tanînî ve ardından bakiyye. Kesin çarpım tam dörtlüdür."},
   {title:"Diyatonik sıra II",copy:"Aynı kesin aralık dağarcığı farklı bir sıradadır."},
   {title:"Diyatonik sıra III",copy:"Bakiyye iki tam tanînîden önce gelir; toplam yine 4/3’tür."},
   {title:"İsfahan kategorisi",copy:"Kategorik olarak tanımlanmış beş sesli bir dörtlü. Üç mücenneb aralık bu arayüzde bilinçli olarak tek bir sent değerine sabitlenmez."}
  ],
  sourceMap:{primaryCopy:"Kitâbü’l-Edvâr, perde bölünmesine ayrılan İkinci Bölüm, vr. 3b–5a; aralık oranlarına ayrılan Üçüncü Bölüm, vr. 5a–8a.",modelCopy:"Ses tablosu, 17 konumlu ana örgünün geleneksel 3-limit/Pisagorcu okumasını kullanır.",editorialCopy:"Oranlar kesindir; ders sırası ve açıklama metni modern bir öğretimsel yeniden kurmadır."},
  modal:{applications:"Urmevî alt dörtlü ve üst beşli cinslerini oktav devirlerinde birleştirir. Bu Atlas aralık kategorilerini gösterir; tek bir sabit modern akordun Orta Çağ icra pratiğini tükettiğini iddia etmez.",categories:"Tanînî (T), mücenneb (J) ve bakiyye (B), Sistemci literatürde kullanılan aralık kategorileridir.",isfahan:"Beş sesli dörtlü, sonraki analitik sunumlarda J–J–J–B olarak tanımlanır; kesin J büyüklükleri kuramsal veya uygulamalı bağlama göre değişebilir."},
  dialog:{primaryHeading:"Birincil yazma konumu",primaryParagraph:"Proje, perde bölünmesini Kitâbü’l-Edvâr’ın İkinci Bölümü, vr. 3b–5a ile; aralık oranlarını Üçüncü Bölüm, vr. 5a–8a ile ilişkilendirir. Makam birleşimleri Altıncı Bölüm, vr. 11a–18a’da; ud akordu ve devirlerin türetilmesi Sekizinci Bölüm, vr. 18b–19b’de ele alınır.",verifiedHeading:"Burada doğrulananlar",verified:["Saklanan bütün kesirler sadeleştirilmiştir ve tersleri gösterilen frekans oranlarını üretir.","Gösterilen 18 nokta 1/1’den 2/1’e doğru yükselir.","Komşu adım örüntüsü on iki limma ile beş Pisagor koması içerir ve çarpımı oktava eşittir.","Yaygın T–T–B dörtlü özdeşliği tam olarak 4/3’tür."],interpretiveHeading:"Yorum olarak kalanlar",interpretiveParagraph:"Adım adım kurulum sırası, modern metin, sentezlenmiş ses ve dört telli çalgı çizimi öğretimsel yorumlardır. Bunlar diplomatik aktarım, tek bir tarihî icra akordu iddiası veya belirli bir günümüze ulaşmış çalgının rekonstrüksiyonu değildir.",orientationHeading:"Bilimsel yönelim",orientationParagraph:"Geleneksel 3-limit okuma şeffaf bir analitik model olarak korunur. Owen Wright’ın çalışması Sistemci gelenek için önemli bir modern çerçeve olmaya devam eder. Yeni araştırmalar da kategorik aralık adları ile pratik intonasyonun her zaman sabit sent değerleri olarak ele alınmaması gerektiğini vurgular.",languageHeading:"Dil incelemesi",languageParagraph:"Bu sürümdeki tüm arayüz içeriği İngilizce, Farsça, Arapça ve Türkçe olarak mevcuttur. Bununla birlikte tarihî terminoloji, resmî yayından önce ana dili uzmanları ve filologlar tarafından incelenmelidir."},
  tests:["On sekiz yazılı nokta","Açık tel 1/1’dir","Oktav uç noktası 1/2 uzunluk ve 2/1 frekanstır","Ses sırası kesin olarak yükselir","Bütün kesirler sadeleştirilmiştir","Uzunluk/frekans tersliği doğrudur","Komşu örüntü 12 limma ve 5 koma içerir","On iki limma ile beş koma oktavı kapatır","T–T–B tam dörtlüye eşittir","Monokord ile çalgının köprü/üst eşik koordinatları hizalıdır","Dört dilde içerik yapısı tamamdır"]
 }
};
function fullPack(){return FULL_I18N[uiLanguage]||FULL_I18N.en}
function fullText(key,vars={}){let v=fullPack().ui[key]??FULL_I18N.en.ui[key]??key;Object.entries(vars).forEach(([k,x])=>v=String(v).replaceAll(`{${k}}`,x));return v}
function setIdText(id,value){const el=$(id);if(el)el.textContent=value}

function languageCoverageAudit(){
 const langs=["en","fa","ar","tr"],baseUi=Object.keys(UI.en),extUi=Object.keys(EXT_UI.en),fullUi=Object.keys(FULL_I18N.en.ui);
 const errors=[];
 for(const lang of langs){
  if(!baseUi.every(k=>k in UI[lang]))errors.push(`${lang}:base-ui`);
  if(!extUi.every(k=>k in EXT_UI[lang]))errors.push(`${lang}:extension-ui`);
  if(!fullUi.every(k=>k in FULL_I18N[lang].ui))errors.push(`${lang}:full-ui`);
  if((CONSTRUCTION_I18N[lang]||[]).length!==CONSTRUCTION.length)errors.push(`${lang}:construction`);
  if((FULL_I18N[lang].lessons||[]).length!==LESSONS.length)errors.push(`${lang}:lessons`);
  if((FULL_I18N[lang].species||[]).length!==SPECIES.length)errors.push(`${lang}:species`);
  if((FULL_I18N[lang].dialog?.verified||[]).length!==4)errors.push(`${lang}:dialog`);
  if((FULL_I18N[lang].tests||[]).length!==11)errors.push(`${lang}:tests`);
 }
 return {pass:errors.length===0,errors};
}

renderLessons=function(){
 const pack=fullPack(),list=$("lessonItems");if(!list)return;list.innerHTML="";
 pack.lessons.forEach((l,i)=>{const b=document.createElement("button");b.className=`lesson-btn ${i===lessonIndex?"active":""}`;b.innerHTML=`<span class="lesson-num">${i+1}</span><span>${l.title}</span>`;b.addEventListener("click",()=>setLesson(i));list.appendChild(b)});
 const structural=LESSONS[lessonIndex],l=pack.lessons[lessonIndex];
 setIdText("lessonKicker",l.kicker);setIdText("lessonSourceStatus",l.status);setIdText("lessonTitle",l.title);setIdText("lessonObjective",`${fullText("objective")}: ${l.objective}`);setIdText("lessonCopy",l.copy);setIdText("lessonFormula",structural.formula);setIdText("lessonProgressText",`${lessonIndex+1} / ${LESSONS.length}`);$("lessonProgressBar").style.width=`${((lessonIndex+1)/LESSONS.length)*100}%`;$("lessonPrevious").disabled=lessonIndex===0;$("lessonNext").disabled=lessonIndex===LESSONS.length-1;
};

renderSpecies=function(){
 const pack=fullPack(),list=$("speciesList");if(!list)return;list.innerHTML="";
 SPECIES.forEach((s,i)=>{const loc=pack.species[i],b=document.createElement("button");b.className=`species-btn ${i===speciesIndex?"active":""}`;b.innerHTML=`${loc.title}<span class="species-code">${s.code}</span>`;b.addEventListener("click",()=>{speciesIndex=i;renderSpecies()});list.appendChild(b)});
 const s=SPECIES[speciesIndex],loc=pack.species[speciesIndex];setIdText("builderTitle",loc.title);setIdText("builderCopy",loc.copy);const chain=$("intervalChain");chain.innerHTML="";
 if(s.steps){s.steps.forEach(x=>{const d=document.createElement("div");d.className="interval-block";d.innerHTML=`<b>${x.name}</b><span>${x.n}/${x.d} · ${fixed(1200*Math.log2(x.n/x.d),2)}¢</span>`;chain.appendChild(d)});const r=multiplyRatios(s.steps);setIdText("speciesResult",`${fullText("product")} = ${r.n}/${r.d} = ${fixed(1200*Math.log2(r.n/r.d),3)}¢`);}
 else{["J","J","J","B"].forEach(x=>{const d=document.createElement("div");d.className="interval-block";d.innerHTML=`<b>${x}</b><span>${x==="B"?fullText("baqiyyah"):fullText("mujannabCategory")}</span>`;chain.appendChild(d)});setIdText("speciesResult",`${fullText("categoricalModel")}: ${fullText("exactJNotFixed")}.`)}
};

runValidationTests=function(){
 const names=fullPack().tests,tests=[];const add=(idx,pass,detail="")=>tests.push({name:names[idx],pass:Boolean(pass),detail});
 add(0,NOTES.length===18,fullText("found",{n:NOTES.length}));
 add(1,NOTES[0].lenN===1&&NOTES[0].lenD===1);
 add(2,NOTES.at(-1).lenN===1&&NOTES.at(-1).lenD===2&&Math.abs(frequencyRatio(NOTES.at(-1))-2)<1e-12);
 add(3,NOTES.every((n,i)=>i===0||frequencyRatio(n)>frequencyRatio(NOTES[i-1])));
 add(4,NOTES.every(n=>gcd(n.lenN,n.lenD)===1));
 add(5,NOTES.every(n=>Math.abs(lengthValue(n)*frequencyRatio(n)-1)<1e-12));
 add(6,STEP_TYPES.filter(x=>x==="L").length===12&&STEP_TYPES.filter(x=>x==="C").length===5);
 const octaveProduct=Math.pow(LIMMA.n/LIMMA.d,12)*Math.pow(COMMA.n/COMMA.d,5);add(7,Math.abs(octaveProduct-2)<1e-10,octaveProduct.toPrecision(12));
 const ttb=(9/8)*(9/8)*(256/243);add(8,Math.abs(ttb-4/3)<1e-12,ttb.toPrecision(12));
 add(9,X0===INSTRUMENT.bridgeX&&X1===INSTRUMENT.nutX);
 const coverage=languageCoverageAudit();add(10,coverage.pass,coverage.errors.join(", "));
 const passed=tests.filter(x=>x.pass).length;setIdText("validationBadge",`${passed}/${tests.length}`);setIdText("validationCaption",et("testsPassed",{n:passed,total:tests.length}));const list=$("validationDialogList");list.innerHTML="";tests.forEach(x=>{const li=document.createElement("li");li.className=x.pass?"pass":"fail";li.textContent=`${x.pass?fullText("pass"):fullText("fail")} — ${x.name}${x.detail?` (${x.detail})`:""}`;list.appendChild(li)});return {passed,total:tests.length,tests};
};

function applyComprehensiveLanguage(){
 const p=fullPack();
 setIdText("skipLink",fullText("skip"));$("tabsNav").setAttribute("aria-label",fullText("tabsLabel"));$("monoPanel").setAttribute("aria-label",fullText("monoPanelAria"));setIdText("monoTitle",fullText("monoTitle"));setIdText("monoDesc",fullText("monoDesc"));$("instrumentSvg").setAttribute("aria-label",fullText("instrumentAria"));$("panel-learn").setAttribute("aria-label",fullText("learnPanelAria"));$("panel-modes").setAttribute("aria-label",fullText("modesPanelAria"));
 $("sourceBtn").title=fullText("sourceTitle");if($("viewModeBtn"))$("viewModeBtn").title=fullText("viewTitle");
 setIdText("lessonPrevious",fullText("previous"));setIdText("lessonDemonstrate",fullText("demonstrate"));setIdText("lessonNext",fullText("next"));
 setIdText("sourcePrimaryTitle",fullText("primaryManuscript"));setIdText("sourcePrimaryCopy",p.sourceMap.primaryCopy);setIdText("sourceModelTitle",fullText("exactModel"));setIdText("sourceModelCopy",p.sourceMap.modelCopy);setIdText("sourceEditorialTitle",fullText("editorialDistinction"));setIdText("sourceEditorialCopy",p.sourceMap.editorialCopy);
 setIdText("speciesExactKicker",fullText("exactFourth"));setIdText("modalInterpretiveKicker",fullText("interpretiveLayer"));setIdText("modalApplicationsCopy",p.modal.applications);setIdText("categoricalTitle",fullText("historicalCategories"));setIdText("categoricalCopy",p.modal.categories);setIdText("isfahanTitle",fullText("isfahanExample"));setIdText("isfahanCopy",p.modal.isfahan);
 setIdText("sourcePrimaryHeading",p.dialog.primaryHeading);setIdText("sourcePrimaryParagraph",p.dialog.primaryParagraph);setIdText("sourcePrimaryLink",fullText("sourceLink"));setIdText("sourceVerifiedHeading",p.dialog.verifiedHeading);p.dialog.verified.forEach((x,i)=>setIdText(`sourceVerifiedItem${i+1}`,x));setIdText("sourceInterpretiveHeading",p.dialog.interpretiveHeading);setIdText("sourceInterpretiveParagraph",p.dialog.interpretiveParagraph);setIdText("sourceOrientationHeading",p.dialog.orientationHeading);setIdText("sourceOrientationParagraph",p.dialog.orientationParagraph);setIdText("sourceLanguageHeading",p.dialog.languageHeading);setIdText("sourceLanguageParagraph",p.dialog.languageParagraph);
 renderLessons();renderSpecies();runValidationTests();applyViewMode(viewMode);
}

const priorComprehensiveStaticLanguage=applyStaticLanguage;
applyStaticLanguage=function(){priorComprehensiveStaticLanguage();applyComprehensiveLanguage()};
const priorLocalizedActivatePanel=activatePanel;
activatePanel=function(name){priorLocalizedActivatePanel(name);if(name==="learn")setIdText("monoHint",fullText("hintLearn"));if(name==="modes")setIdText("monoHint",fullText("hintModes"))};

const requestedView=new URLSearchParams(location.search).get("view");
if(requestedView==="theory")viewMode=1;else if(requestedView==="instrument"||requestedView==="practical")viewMode=2;else if(requestedView==="both")viewMode=0;
applyStaticLanguage();applyViewMode(viewMode);activatePanel(activePanel);

/* ==========================================================================
   Premium scholarly-atlas layer: explicit visualization modes, analytical HUD,
   sounding-length measurement, presentation focus, and four-language labels.
   ========================================================================== */
const PREMIUM_I18N={
 en:{
  edition:"Scholarly interactive edition",positions:"18 exact pitch points",octaveFact:"1200-cent octave",languages:"4-language interface",
  viewGroup:"Visualization view",combined:"Combined",theory:"Theory",instrument:"Instrument",focus:"Focus",exitFocus:"Exit focus",
  activePitch:"Active pitch",frequencyRatio:"Frequency ratio",soundingLength:"Sounding length",cents:"Cents",exactModel:"Exact rational model",
  limma:"Limma",comma:"Comma",openString:"Open string",octaveArc:"octave · 2:1",presentationHint:"F: focus · 1/2/3: view · Esc: exit",
  modeLearn:"Guided curriculum",modeExplore:"Pitch explorer",modeConstruct:"Geometrical construction",modeListen:"Sound Atlas",modeModes:"Species & modes",modeTrain:"Training & exact data",
  focusTitle:"Open presentation focus mode",exitFocusTitle:"Return to the full learning Atlas",fullscreen:"Open in fullscreen"
 },
 fa:{
  edition:"ویرایش تعاملی پژوهشی",positions:"۱۸ جایگاه دقیق صوتی",octaveFact:"اکتاو ۱۲۰۰ سِنتی",languages:"رابط چهارزبانه",
  viewGroup:"نمای تصویری",combined:"ترکیبی",theory:"نظری",instrument:"ساز",focus:"تمرکز",exitFocus:"خروج از تمرکز",
  activePitch:"صدای فعال",frequencyRatio:"نسبت فرکانس",soundingLength:"طول مرتعش",cents:"سِنت",exactModel:"مدل دقیق کسری",
  limma:"لیما",comma:"کُما",openString:"سیم آزاد",octaveArc:"اکتاو · ۲:۱",presentationHint:"F: تمرکز · ۱/۲/۳: نما · Esc: خروج",
  modeLearn:"درس‌های هدایت‌شده",modeExplore:"کاوش جایگاه‌ها",modeConstruct:"ساخت هندسی",modeListen:"اطلس صدا",modeModes:"اجناس و ادوار",modeTrain:"تمرین و داده‌های دقیق",
  focusTitle:"گشودن نمای متمرکز برای ارائه",exitFocusTitle:"بازگشت به اطلس کامل",fullscreen:"نمای تمام‌صفحه"
 },
 ar:{
  edition:"نسخة علمية تفاعلية",positions:"١٨ موضعًا صوتيًا دقيقًا",octaveFact:"أوكتاف ١٢٠٠ سنت",languages:"واجهة بأربع لغات",
  viewGroup:"نمط العرض",combined:"مدمج",theory:"نظري",instrument:"الآلة",focus:"تركيز",exitFocus:"إنهاء التركيز",
  activePitch:"النغمة النشطة",frequencyRatio:"نسبة التردد",soundingLength:"الطول المصوّت",cents:"سنت",exactModel:"نموذج كسري دقيق",
  limma:"اللِّمّة",comma:"الفاصلة",openString:"الوتر المطلق",octaveArc:"الأوكتاف · ٢:١",presentationHint:"F: تركيز · ١/٢/٣: العرض · Esc: خروج",
  modeLearn:"منهج موجّه",modeExplore:"استكشاف المواضع",modeConstruct:"الإنشاء الهندسي",modeListen:"أطلس الصوت",modeModes:"الأجناس والأدوار",modeTrain:"التدريب والبيانات الدقيقة",
  focusTitle:"فتح وضع التركيز للعرض",exitFocusTitle:"العودة إلى الأطلس الكامل",fullscreen:"ملء الشاشة"
 },
 tr:{
  edition:"Bilimsel etkileşimli sürüm",positions:"18 kesin ses konumu",octaveFact:"1200 sentlik oktav",languages:"4 dilli arayüz",
  viewGroup:"Görselleştirme görünümü",combined:"Birleşik",theory:"Kuram",instrument:"Çalgı",focus:"Odak",exitFocus:"Odaktan çık",
  activePitch:"Etkin ses",frequencyRatio:"Frekans oranı",soundingLength:"Titreşen uzunluk",cents:"Sent",exactModel:"Kesin rasyonel model",
  limma:"Limma",comma:"Koma",openString:"Açık tel",octaveArc:"oktav · 2:1",presentationHint:"F: odak · 1/2/3: görünüm · Esc: çıkış",
  modeLearn:"Yönlendirilmiş dersler",modeExplore:"Ses konumu gezgini",modeConstruct:"Geometrik kurulum",modeListen:"Ses Atlası",modeModes:"Cinsler ve devirler",modeTrain:"Alıştırma ve kesin veri",
  focusTitle:"Sunum odak görünümünü aç",exitFocusTitle:"Tam öğrenme atlasına dön",fullscreen:"Tam ekran"
 }
};
function premiumPack(){return PREMIUM_I18N[uiLanguage]||PREMIUM_I18N.en}
function premiumText(key){return premiumPack()[key]||PREMIUM_I18N.en[key]||key}
function setPremiumText(id,key){const el=$(id);if(el)el.textContent=premiumText(key)}

const premiumModeKeys={learn:"modeLearn",explore:"modeExplore",construct:"modeConstruct",listen:"modeListen",modes:"modeModes",train:"modeTrain"};
let stageFocus=false;

function renderTheoryRuler(){
 const layer=$("theoryRulerLayer");if(!layer)return;layer.innerHTML="";
 layer.appendChild(createSvg("line",{x1:X0,y1:101,x2:X1,y2:101,class:"ruler-line"}));
 for(let i=0;i<=8;i++){
  const fraction=i/8,x=X0+fraction*(X1-X0),major=i%2===0;
  layer.appendChild(createSvg("line",{x1:x,y1:major?97:99,x2:x,y2:105,class:"ruler-tick",opacity:major?.85:.45}));
  if(major){
   const labels=["0","1/4","1/2","3/4","1"];
   layer.appendChild(createSvg("text",{x,y:111,"text-anchor":"middle",class:"ruler-label"},labels[i/2]));
  }
 }
}
function premiumFocusIndex(){
 return activePanel==="construct"?noteIndex[CONSTRUCTION[constructionStep].note]:selected;
}
function updatePremiumHud(){
 const index=premiumFocusIndex(),n=NOTES[index],x=instrumentXFor(n),base=currentBase();
 setPremiumText("hudActivePitchLabel","activePitch");setPremiumText("hudFrequencyLabel","frequencyRatio");setPremiumText("hudLengthLabel","soundingLength");setPremiumText("hudCentsLabel","cents");setPremiumText("hudModelStatus","exactModel");
 if($("hudNote"))$("hudNote").textContent=n.label;
 if($("hudName"))$("hudName").textContent=index===0?premiumText("openString"):n.translit;
 if($("hudFrequency"))$("hudFrequency").textContent=`${n.lenD}/${n.lenN}`;
 if($("hudLength"))$("hudLength").textContent=`${n.lenN}/${n.lenD}`;
 if($("hudCents"))$("hudCents").textContent=`${fixed(cents(n))}¢`;
 const sounding=$("soundingSegment"),stopped=$("stoppedSegment"),projection=$("selectedProjection"),bracket=$("lengthBracket"),bracketText=$("lengthBracketText");
 if(sounding)sounding.setAttribute("x2",x);
 if(stopped){stopped.setAttribute("x1",x);stopped.setAttribute("x2",X1)}
 if(projection){projection.setAttribute("x1",x);projection.setAttribute("x2",x)}
 if(bracket)bracket.setAttribute("d",`M${X0} 76 V82 H${x} V76`);
 if(bracketText){bracketText.setAttribute("x",(X0+x)/2);bracketText.textContent=`ℓ = ${n.lenN}/${n.lenD}`}
 if($("octaveArcLabel"))$("octaveArcLabel").textContent=premiumText("octaveArc");
 if($("workspaceContextPitch"))$("workspaceContextPitch").textContent=`${n.label} · ${n.lenD}/${n.lenN} · ${fixed(cents(n))}¢ · ${fixed(base*frequencyRatio(n),1)} Hz`;
 const panel=$("monoPanel");if(panel){panel.classList.remove("selection-flash");void panel.offsetWidth;panel.classList.add("selection-flash")}
}
function syncPremiumViewButtons(){
 document.querySelectorAll(".view-choice").forEach(btn=>{
  const on=Number(btn.dataset.view)===viewMode;btn.classList.toggle("active",on);btn.setAttribute("aria-pressed",String(on));
 });
}
function setPremiumView(mode){applyViewMode(mode);syncPremiumViewButtons();updatePremiumHud()}
function updateFocusButton(){
 const btn=$("focusStageBtn");if(!btn)return;
 btn.textContent=stageFocus?premiumText("exitFocus"):premiumText("focus");
 btn.title=stageFocus?premiumText("exitFocusTitle"):premiumText("focusTitle");btn.setAttribute("aria-pressed",String(stageFocus));
}
function toggleStageFocus(force){
 stageFocus=typeof force==="boolean"?force:!stageFocus;
 document.body.classList.toggle("stage-focus",stageFocus);updateFocusButton();fitApp();
}
function applyPremiumLanguage(){
 setPremiumText("editionBadge","edition");setPremiumText("factPositions","positions");setPremiumText("factOctave","octaveFact");setPremiumText("factLanguages","languages");
 setPremiumText("viewBothBtn","combined");setPremiumText("viewTheoryBtn","theory");setPremiumText("viewInstrumentBtn","instrument");setPremiumText("legendLimma","limma");setPremiumText("legendComma","comma");setPremiumText("presentationHint","presentationHint");
 const switcher=$("viewSwitch");if(switcher)switcher.setAttribute("aria-label",premiumText("viewGroup"));
 const fs=$("fullscreenBtn");if(fs){fs.title=premiumText("fullscreen");fs.setAttribute("aria-label",premiumText("fullscreen"))}
 if($("workspaceContextMode"))$("workspaceContextMode").textContent=premiumText(premiumModeKeys[activePanel]||"modeExplore");
 updateFocusButton();syncPremiumViewButtons();updatePremiumHud();
}

// Extend the existing language audit so all premium labels must exist and be non-empty.
const priorPremiumCoverageAudit=languageCoverageAudit;
languageCoverageAudit=function(){
 const base=priorPremiumCoverageAudit(),errors=[...base.errors],keys=Object.keys(PREMIUM_I18N.en);
 for(const lang of ["en","fa","ar","tr"]){
  if(!PREMIUM_I18N[lang]){errors.push(`${lang}:premium-missing`);continue}
  for(const key of keys)if(!String(PREMIUM_I18N[lang][key]||"").trim())errors.push(`${lang}:premium-${key}`);
 }
 return {pass:errors.length===0,errors};
};

// Wrap the mature rendering functions without altering their mathematical logic.
const premiumPriorRenderMonochord=renderMonochord;
renderMonochord=function(){premiumPriorRenderMonochord();updatePremiumHud()};
const premiumPriorActivatePanel=activatePanel;
activatePanel=function(name){premiumPriorActivatePanel(name);if($("workspaceContextMode"))$("workspaceContextMode").textContent=premiumText(premiumModeKeys[name]||"modeExplore");updatePremiumHud()};
const premiumPriorApplyViewMode=applyViewMode;
applyViewMode=function(mode=viewMode){premiumPriorApplyViewMode(mode);syncPremiumViewButtons();updatePremiumHud()};
const premiumPriorApplyStaticLanguage=applyStaticLanguage;
applyStaticLanguage=function(){premiumPriorApplyStaticLanguage();applyPremiumLanguage()};

$("viewBothBtn")?.addEventListener("click",()=>setPremiumView(0));
$("viewTheoryBtn")?.addEventListener("click",()=>setPremiumView(1));
$("viewInstrumentBtn")?.addEventListener("click",()=>setPremiumView(2));
$("focusStageBtn")?.addEventListener("click",()=>toggleStageFocus());
window.addEventListener("keydown",e=>{
 const tag=(e.target&&e.target.tagName||"").toLowerCase();if(["input","select","textarea"].includes(tag))return;
 if(e.key.toLowerCase()==="f"){e.preventDefault();toggleStageFocus()}
 if(e.key==="1")setPremiumView(0);if(e.key==="2")setPremiumView(1);if(e.key==="3")setPremiumView(2);
 if(e.key==="Escape"&&stageFocus)toggleStageFocus(false);
});
renderTheoryRuler();applyPremiumLanguage();syncPremiumViewButtons();updatePremiumHud();runValidationTests();
