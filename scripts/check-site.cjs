const fs=require('fs'),vm=require('vm');
const h=fs.readFileSync('dist/index.html','utf8'),s=fs.readFileSync('dist/app.js','utf8');
const tr=vm.runInNewContext(s.slice(0,s.indexOf('const site='))+';translations');
const keys=[...h.matchAll(/data-t="([^"]+)"/g)].map(m=>m[1]);
for(const lang of ['ru','kk'])for(const k of keys)if(!tr[lang][k])throw Error(lang+' missing '+k);
for(const m of h.matchAll(/href="#([^"]+)"/g))if(!h.includes('id="'+m[1]+'"'))throw Error('broken anchor '+m[1]);
for(const m of h.matchAll(/(?:src|poster)="([^":]+)"/g))if(!fs.existsSync('dist/'+m[1]))throw Error('missing asset '+m[1]);
if(h.includes('GENERAL ASSEMBLY HALL')||h.includes('wikimedia'))throw Error('UN image retained');
console.log('Verified '+keys.length+' text fields in three languages, anchors and local assets; UN imagery removed.');

