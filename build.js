// Build: concatenates data/*.js into app.html → dist/index.html, and validates the content.
const fs=require('fs'),path=require('path'),vm=require('vm');
const order=['a1','a2','b1','b2','c1','c2'];
const files=order.map(l=>path.join(__dirname,'src','data',l+'.js')).filter(f=>fs.existsSync(f));
let data='window.COURSE_DATA=[];\n';
for(const f of files)data+=fs.readFileSync(f,'utf8')+'\n';
// validate by executing
const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(data,sandbox);
const C=sandbox.window.COURSE_DATA;
const errs=[],warn=[];const ids=new Set();let nv=0,np=0,ng=0,nex=0;
const strip=s=>String(s).replace(/\[|\]/g,'');
for(const L of C){
  for(const k of ['id','name','canDo','units'])if(L[k]==null)errs.push(`${L.id}: missing ${k}`);
  for(const U of L.units){
    if(ids.has(U.id))errs.push(`dup unit id ${U.id}`);ids.add(U.id);
    if(!/^[a-z0-9-]+$/.test(U.id))errs.push(`bad id ${U.id}`);
    if(!U.title)errs.push(`${U.id}: no title`);
    if(!U.icon)warn.push(`${U.id}: no icon`);
    const seen=new Set();
    for(const v of (U.vocab||[])){nv++;for(const k of ['en','pt','de'])if(!v[k])errs.push(`${U.id} vocab missing ${k}: ${JSON.stringify(v)}`);if(!v.icon)warn.push(`${U.id}: vocab "${v.en}" no icon`);if(seen.has(v.en))warn.push(`${U.id}: duplicate en "${v.en}"`);seen.add(v.en);}
    for(const v of (U.phrases||[])){np++;for(const k of ['en','pt','de'])if(!v[k])errs.push(`${U.id} phrase missing ${k}: ${JSON.stringify(v)}`);}
    for(const g of (U.grammar||[])){ng++;for(const k of ['title','en','pt','de'])if(!g[k])errs.push(`${U.id} grammar missing ${k}: ${g.title}`);
      for(const e of (g.examples||[])){nex++;for(const k of ['en','pt','de'])if(!e[k])errs.push(`${U.id} example missing ${k}: ${JSON.stringify(e)}`);
        for(const k of ['pt','de']){const s=e[k]||'';const o=(s.match(/\[/g)||[]).length,c=(s.match(/\]/g)||[]).length;if(o!==c)errs.push(`${U.id}: unbalanced brackets in ${k}: ${s}`);if(o>1)warn.push(`${U.id}: more than one bracket in ${k}: ${s}`);}}
      if(g.table){if(!g.table.head||!g.table.rows)errs.push(`${U.id}: bad table in ${g.title}`);else for(const r of g.table.rows)if(r.length!==g.table.head.length)errs.push(`${U.id}: table row length mismatch in ${g.title}`);}}
    if(U.reading){for(const k of ['title','en','pt','de'])if(!U.reading[k])errs.push(`${U.id} reading missing ${k}`);}
    if((U.vocab||[]).length<4)warn.push(`${U.id}: only ${(U.vocab||[]).length} vocab`);
  }
}
console.log(`levels ${C.length}, units ${ids.size}, vocab ${nv}, phrases ${np}, grammar ${ng} (${nex} examples)`);
if(warn.length){console.log('WARN:');warn.slice(0,40).forEach(w=>console.log('  '+w));if(warn.length>40)console.log(`  …${warn.length-40} more`);}
if(errs.length){console.log('ERRORS:');errs.forEach(e=>console.log('  '+e));process.exit(1);}
const app=fs.readFileSync(path.join(__dirname,'src','app.html'),'utf8');
const out=app.replace('/*__DATA__*/',()=>data);

fs.writeFileSync(path.join(__dirname,'index.html'),out);
console.log('wrote index.html',(out.length/1024).toFixed(0)+' KB');
