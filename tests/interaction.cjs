const {JSDOM}=require('jsdom');
const fs=require('node:fs'),assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync('assets/scenes.json'));
async function page(file,script,url){
 const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url,runScripts:'outside-only'});
 const w=dom.window;w.fetch=async()=>({ok:true,json:async()=>data});w.scrollTo=()=>{};
 w.matchMedia=()=>({matches:true});w.Particles={spawn(){}};
 w.eval(fs.readFileSync(script,'utf8'));
 await new Promise(r=>setTimeout(r,10));
 return dom;
}
(async()=>{
 const dom=await page('index.html','assets/js/generator.js','https://example.org/');
 const w=dom.window,d=w.document,$=id=>d.getElementById(id);
 function search(v){$('sceneSearch').value=v;$('sceneSearch').dispatchEvent(new w.Event('input'))}
 search('咖啡');assert(d.querySelectorAll('[data-scene]').length>=3);
 search('');d.querySelector('[data-filter="生日"]').click();search('毕业');assert(d.querySelector('[data-scene="graduation"]'));
 search('520');d.querySelector('[data-scene="520"]').click();d.querySelector('[data-step="2"]').click();
 $('blessingInput').value='专属正文';$('backInput').value='第一张背面';
 d.querySelector('[data-step="1"]').click();search('纪念日');d.querySelector('[data-scene="anniversary"]').click();
 assert.equal($('backInput').value,'');
 search('520');d.querySelector('[data-scene="520"]').click();assert.equal($('blessingInput').value,'专属正文');assert.equal($('backInput').value,'第一张背面');
 $('nameInput').value='测试';d.querySelector('[data-step="3"]').click();
 const first=$('cardPreview');$('blessingInput').value='修改后的正文';$('toPreview').click();
 assert.notEqual(first,$('cardPreview'));assert.equal(new URLSearchParams(new URL($('resultUrl').value).hash.slice(1)).get('b'),'修改后的正文');
 $('blessingInput').value=' ';$('toPreview').click();assert($('panel2').classList.contains('active'));
 for(const url of ['https://example.org/card.html#scene=520&n=test&b=hello&f=','https://example.org/card.html?scene=520&n=test&b=hello&f=']){
 const card=await page('card.html','assets/js/card.js',url),c=card.window.document;
 assert.equal(c.getElementById('blessingEl').textContent,'hello');
 c.getElementById('openBack').click();assert.equal(c.getElementById('flipBack').hidden,false);
 c.getElementById('closeBack').click();assert.equal(c.getElementById('flipBack').hidden,true);
 card.window.close();
 }
 dom.window.close();console.log('PASS: global search, navigation, isolated drafts, fresh preview, empty validation, old/new URLs, open/close');
})().catch(e=>{console.error(e);process.exitCode=1});
