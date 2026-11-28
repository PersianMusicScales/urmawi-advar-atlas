import fs from "node:fs";import assert from "node:assert/strict";
const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const app=read("index.html"),sitemap=read("sitemap.xml"),sw=read("service-worker.js"),data=JSON.parse(read("data/pitch-lattice.json")),model=read("js/app.js");
const langs=["en","fa","ar","tr"],topics=["history","pitch-system","monochord","listening","species-modes","training-data"],base="https://persianmusicscales.github.io/urmawi-advar-atlas/";
const stored=[...model.matchAll(/\{label:"([^"]+)",\s*translit:"([^"]+)",\s*lenN:(\d+),\s*lenD:(\d+)\}/g)].slice(0,18);
assert.equal(data.notes.length,18);assert.equal(stored.length,18);
data.notes.forEach((n,i)=>{assert.equal(n.label,stored[i][1]);assert.equal(n.stringLength.numerator,+stored[i][3]);assert.equal(n.stringLength.denominator,+stored[i][4]);assert.equal(n.frequencyRatio.numerator,+stored[i][4]);assert.equal(n.frequencyRatio.denominator,+stored[i][3]);assert.ok(Math.abs(n.cents-1200*Math.log2(n.frequencyRatio.numerator/n.frequencyRatio.denominator))<1e-6);});
assert.equal((sitemap.match(/<loc>/g)||[]).length,11);assert.ok(data.version&&data.license);assert.ok(read("CITATION.cff").includes("cff-version:"));
for(const l of langs){const route="reference/"+l+"/",s=read(route+"index.html");assert.ok(s.includes('rel="canonical" href="'+base+route+'"'));for(const alt of langs)assert.ok(s.includes('hreflang="'+alt+'" href="'+base+"reference/"+alt+'/"'));assert.equal((s.match(/<tr>/g)||[]).length,19);assert.ok(sitemap.includes(base+route)&&sw.includes("./"+route));for(const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(m[1]);}
for(const t of topics){const route="topics/"+t+"/",s=read(route+"index.html");assert.ok(s.includes('rel="canonical" href="'+base+route+'"')&&sitemap.includes(base+route)&&sw.includes("./"+route));}
for(const p of ["learn","explore","construct","listen","modes","train"])assert.ok(app.includes('aria-controls="panel-'+p+'"')&&app.includes('aria-labelledby="tab-'+p+'"'));
assert.ok(app.includes('js/accessibility.js')&&sw.includes('./js/accessibility.js'));console.log("Scholarly routes, sitemap, dataset parity, structured data and tab relationships passed.");
