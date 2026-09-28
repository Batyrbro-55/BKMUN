const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve('dist');
for(const lang of ['en','ru','kk'])for(const page of ['conference','delegate-hub']){
 const html=fs.readFileSync(`${root}/${lang}/${page}.html`,'utf8');
 assert(html.includes(`<html lang="${lang}">`));
 for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!url.startsWith('/'))continue;
  const pathname=url.split(/[?#]/)[0];
  assert(fs.existsSync(root+(pathname==='/'?'/index.html':pathname)),`${page}: ${url}`);
 }
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert(html.includes(`id="${id}"`));
 if(page==='delegate-hub')assert.equal([...html.matchAll(/data-check="/g)].length,8);
}
const ics=fs.readFileSync(root+'/bkmun-october-2026.ics','utf8');
assert(ics.includes('DTSTART;VALUE=DATE:20261003\r\nDTEND;VALUE=DATE:20261005'));
assert(!/(?<!\r)\n/.test(ics),'ICS must use CRLF');
for(const line of ics.split('\r\n'))assert(Buffer.byteLength(line)<=75,'ICS line too long: '+line);
const code=fs.readFileSync(root+'/pages.js','utf8');
let saved='[]';
function setup(label='completed',broken=false){
 const element=()=>({listeners:{},value:'',textContent:'',dataset:{},addEventListener(t,f){this.listeners[t]=f},setAttribute(){},getAttribute(){return 'false'},classList:{toggle(){},remove(){}}});
 const ids=Object.fromEntries(['page-language','navigation','storage-note','check-progress','check-bar'].map(x=>[x,element()]));
 const checks=Array.from({length:8},(_,i)=>Object.assign(element(),{dataset:{check:String(i)},checked:false}));
 const menu=element(),document={body:{dataset:{progressLabel:label,storageWarning:'unavailable'}},getElementById:id=>ids[id],querySelector:()=>menu,querySelectorAll:()=>checks,addEventListener(){}};
 const location={hash:'#checklist',href:''};
 vm.runInNewContext(code,{document,location,localStorage:{getItem(){if(broken)throw Error();return saved},setItem(k,v){if(broken)throw Error();saved=v}}});
 return {ids,checks,location};
}
let s=setup();assert.equal(s.ids['check-progress'].textContent,'0 / 8 completed');
s.checks[2].checked=true;s.checks[2].listeners.change();assert.equal(saved,'[2]');assert.equal(s.ids['check-bar'].value,1);
s=setup('выполнено');assert(s.checks[2].checked);assert.equal(s.ids['check-progress'].textContent,'1 / 8 выполнено');
s.ids['page-language'].value='/kk/delegate-hub.html';s.ids['page-language'].listeners.change();assert.equal(s.location.href,'/kk/delegate-hub.html#checklist');
s=setup('completed',true);s.checks[0].checked=true;s.checks[0].listeners.change();assert.equal(s.ids['storage-note'].textContent,'unavailable');assert.equal(s.ids['check-bar'].value,1);
saved='{invalid';s=setup();assert.equal(s.ids['check-bar'].value,0);
console.log('PASS: six pages, routes/assets, calendar dates/folding, checklist persistence, cross-language state, blocked/corrupt storage.');

