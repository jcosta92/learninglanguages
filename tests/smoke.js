const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/#a1-01'});
const w=dom.window;w.addEventListener('error',e=>errors.push(e.message));
w.scrollTo=()=>{};
const d=w.document;const $=s=>d.querySelector(s);const $$=s=>[...d.querySelectorAll(s)];
function click(el){if(!el)throw new Error('missing element');el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));}
const COURSE=w.COURSE_DATA;
// for every unit: open each tab, run each exercise to completion
let runs=0;
for(const LG of ['de','pt']){
click($$('#langSeg [data-lang]').find(x=>x.dataset.lang===LG));
for(const L of COURSE){for(const U of L.units){
  w.location.hash='#'+U.id;w.dispatchEvent(new w.Event('hashchange'));
  for(const t of ['learn','phrases','grammar','reading','practice']){const b=$$('[data-tab]').find(x=>x.dataset.tab===t);if(b)click(b);}
  // toggle all-three view
  const v=$$('[data-view]').find(x=>x.dataset.view==='table');if(v)click(v);
  const vb=$$('[data-view]').find(x=>x.dataset.view==='cards');if(vb)click(vb);
  click($$('[data-tab]').find(x=>x.dataset.tab==='practice'));
  const exIds=$$('[data-ex]').map(x=>x.dataset.ex);
  for(const ex of exIds){
    click($$('[data-ex]').find(x=>x.dataset.ex===ex));
    let guard=0;
    while(!$('#back')&&guard++<400){
      if(ex==='flash'){click($('#reveal'));click($('#yes'));}
      else if(ex==='mc'||ex==='mcrev'||ex==='cloze'){const c=$$('.choice').filter(x=>!x.disabled);click(c[0]);click($('#nx'));}
      else if(ex==='type'){const i=$('#ti');i.value='xyz';$('#tf').dispatchEvent(new w.Event('submit',{cancelable:true}));click($('#nx'));}
      else if(ex==='match'){// brute force: click each en then each target until matched
        const en=$$('.mcell[data-side="en"]').filter(x=>!x.classList.contains('gone'));if(!en.length)break;const k=en[0].dataset.k;click(en[0]);const tg=$$('.mcell[data-side="t"]').find(x=>x.dataset.k===k);click(tg);
        // after match of final pair, next is on timeout
        if(!$$('.mcell').some(x=>!x.classList.contains('gone'))){await_=true;break;}}
      else if(ex==='order'){const pool=$$('[data-p]');for(let i=0;i<pool.length;i++){click($$('[data-p]')[0]);}click($('#chk'));click($('#nx'));}
    }
    runs++;
    if(ex==='match'){/* wait timers */ }
    const back=$('#back');if(back)click(back);else{click($('#quit')||{dispatchEvent(){}});}
  }
}}}
w.location.hash='';w.dispatchEvent(new w.Event('hashchange'));click($('#brandBtn'));
if(!d.body.textContent.includes('Levels'))errors.push('home did not render');
if(d.body.textContent.includes('Who is studying'))errors.push('profiles still on home');
setTimeout(()=>{console.log('exercise runs:',runs,'errors:',errors.length);errors.slice(0,10).forEach(e=>console.log(' ',e));process.exit(errors.length?1:0);},800);
