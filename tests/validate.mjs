import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const js=fs.readFileSync(path.join(root,"js","app.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"css","app.css"),"utf8");

const notes=[[1,1],[243,256],[59049,65536],[8,9],[27,32],[6561,8192],[64,81],[3,4],[729,1024],[177147,262144],[2,3],[81,128],[19683,32768],[16,27],[9,16],[2187,4096],[531441,1048576],[1,2]];
const freq=([n,d])=>d/n;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
assert.equal(notes.length,18);
assert.deepEqual(notes[0],[1,1]);
assert.deepEqual(notes.at(-1),[1,2]);
assert.ok(notes.every(([n,d])=>gcd(n,d)===1));
assert.ok(notes.every((x,i)=>i===0||freq(x)>freq(notes[i-1])));
assert.ok(notes.every(([n,d])=>Math.abs((n/d)*(d/n)-1)<1e-12));
const L=256/243,C=531441/524288;
assert.ok(Math.abs(L**12*C**5-2)<1e-10);
assert.ok(Math.abs((9/8)*(9/8)*(256/243)-4/3)<1e-12);

function extractConst(name,endMarker){
  const start=js.indexOf(`const ${name}`);
  assert.ok(start>=0,`${name} not found`);
  const end=js.indexOf(endMarker,start);
  assert.ok(end>start,`${name} end marker not found`);
  const source=js.slice(start,end).replace(`const ${name}`,`var ${name}`);
  const ctx={};vm.createContext(ctx);vm.runInContext(source,ctx);
  return ctx[name];
}
const UI=extractConst("UI","const CONSTRUCTION_I18N");
const EXT_UI=extractConst("EXT_UI","function et");
const FULL_I18N=extractConst("FULL_I18N","function fullPack");
const PREMIUM_I18N=extractConst("PREMIUM_I18N","function premiumPack");
const langs=["en","fa","ar","tr"];
for(const lang of langs){
  assert.deepEqual(Object.keys(UI[lang]).sort(),Object.keys(UI.en).sort(),`${lang}: base UI key mismatch`);
  assert.deepEqual(Object.keys(EXT_UI[lang]).sort(),Object.keys(EXT_UI.en).sort(),`${lang}: extension UI key mismatch`);
  assert.deepEqual(Object.keys(FULL_I18N[lang].ui).sort(),Object.keys(FULL_I18N.en.ui).sort(),`${lang}: comprehensive UI key mismatch`);
  assert.equal(FULL_I18N[lang].lessons.length,6,`${lang}: lesson count`);
  assert.equal(FULL_I18N[lang].species.length,4,`${lang}: species count`);
  assert.equal(FULL_I18N[lang].dialog.verified.length,4,`${lang}: verified-list count`);
  assert.equal(FULL_I18N[lang].tests.length,11,`${lang}: validation-label count`);
  assert.deepEqual(Object.keys(PREMIUM_I18N[lang]).sort(),Object.keys(PREMIUM_I18N.en).sort(),`${lang}: premium UI key mismatch`);
  for(const [key,value] of Object.entries(PREMIUM_I18N[lang])) assert.ok(String(value).trim(),`${lang}: empty premium label ${key}`);
  for(const lesson of FULL_I18N[lang].lessons) for(const key of ["kicker","status","title","objective","copy"]) assert.ok(lesson[key]?.trim(),`${lang}: empty lesson ${key}`);
}

const requiredIds=["viewStateLabel","sourcePrimaryHeading","sourcePrimaryParagraph","sourcePrimaryLink","sourceVerifiedHeading","sourceVerifiedItem1","sourceVerifiedItem2","sourceVerifiedItem3","sourceVerifiedItem4","sourceInterpretiveHeading","sourceInterpretiveParagraph","sourceOrientationHeading","sourceOrientationParagraph","sourceLanguageHeading","sourceLanguageParagraph","viewSwitch","viewBothBtn","viewTheoryBtn","viewInstrumentBtn","focusStageBtn","theoryHud","hudNote","hudFrequency","hudLength","hudCents","soundingSegment","stoppedSegment","selectedProjection","lengthBracket","workspaceContext"];
for(const id of requiredIds) assert.match(html,new RegExp(`id=["']${id}["']`),`missing DOM target ${id}`);
assert.match(css,/body\.view-theory \.instrument-wrap\{display:none\}/,"theory view must hide the instrument");
assert.match(css,/body\.view-theory #monoSvg\{[\s\S]*height:205px/,"theory view must enlarge/emphasize the monochord");
assert.match(css,/body\.view-practical #instrumentSvg\{height:195px/,"instrument view must enlarge the instrument");
assert.match(js,/requestedLanguage=new URLSearchParams\(location\.search\)\.get\("lang"\)/,"language query support missing");
assert.match(js,/requestedView=new URLSearchParams\(location\.search\)\.get\("view"\)/,"view query support missing");
assert.match(css,/body\.stage-focus #app\{grid-template-rows:72px 648px 0 0 0\}/,"presentation focus mode missing");
assert.match(css,/\.sounding-segment\{/,"active sounding-length styling missing");
assert.match(js,/function updatePremiumHud\(\)/,"premium theory HUD update missing");
assert.equal((html.match(/class=["']instrument-string["']/g)||[]).length,4,"instrument must contain exactly four strings");
const ids=[...html.matchAll(/id=["']([^"']+)["']/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,"duplicate HTML ids found");

assert.ok(!html.includes('welcomeContinue'),"continue-session control must be removed");
assert.ok(!html.includes('resetProgressBtn'),"reset-progress control must be removed");
assert.ok(!html.includes('validationCompact'),"public built-in validation panel must be removed");
assert.match(html,/id=["']orientationGate["']/,"phone orientation gate missing");
assert.match(html,/apple-mobile-web-app-status-bar-style["'] content=["']default["']/,"safe iOS status-bar mode missing");
console.log("All Urmawi model, four-language, mobile-landscape, safe-area, DOM-target, and view-mode validation tests passed.");
