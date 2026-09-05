(function(){
'use strict';
const featuredIds=['birthday','graduation','thankyou','goodluck','friendship','spring','sunflower','starlight','sakura','letter','ribbon','travel'];
const groups=[
 ['精选',[]],['生日',['birthday','cake','newborn','children']],
 ['节日',['new-year','christmas','mid-autumn','dragon-boat','qixi','520','halloween','thanksgiving','teachers-day','mothers-day','fathers-day','chongyang','lantern']],
 ['人生时刻',['graduation','gaokao','career','promotion','retirement','achievement','wedding','engagement','housewarming']],
 ['心意',['thank','apology','friendship','missyou','recovery','cheer','goodluck','wish']],
 ['风景氛围',['sakura','star','moon','snow','rain','ocean','garden','sunset','sunrise','aurora','beach']]
];
const state={scenes:{},selected:'birthday',filter:'精选',query:'',showAll:false,drafts:{},initialized:false};
const $=id=>document.getElementById(id);
const plain=v=>String(v||'').replace(/\\n/g,'\n').replace(/<br\s*\/?\s*>/gi,'\n');
const norm=v=>plain(v).toLowerCase().replace(/\s+/g,'');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const styleNames={birthday:'经典烛光',cake:'奶油蛋糕','children-birthday':'童趣派对',demo:'简约光影',full:'星空信笺',template:'暖金生日',bubble:'梦幻渐变',dreambubble:'轻盈泡泡',garden:'玫瑰夜色',rosegarden:'盛放玫瑰',sakura:'花瓣祝福',sakurapromise:'树下约定'};

fetch('assets/scenes.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{
 state.scenes=data.scenes||{};
 if(!state.scenes[state.selected])state.selected=Object.keys(state.scenes)[0];
 $('sceneCount').textContent=Object.keys(state.scenes).length+' 种动态场景';
 filters();scenes();bind();select(state.selected,false);
}).catch(e=>{$('sceneCount').textContent='载入失败';$('sceneGrid').innerHTML='<p class="empty">场景配置载入失败，请刷新重试。</p>';console.error(e)});

function bind(){
 $('sceneSearch').addEventListener('input',e=>{state.query=norm(e.target.value);scenes()});
 $('toggleAll').addEventListener('click',()=>{state.showAll=state.filter==='精选';state.filter=state.showAll?'全部':'精选';filters();scenes()});
 $('toDetails').addEventListener('click',()=>go(2));$('toPreview').addEventListener('click',preview);
 $('blessingInput').addEventListener('input',()=>{$('wordCount').textContent=$('blessingInput').value.length+' / 160'});
 document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>+b.dataset.step===3?preview():go(+b.dataset.step)));
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.go)));
 $('copyButton').addEventListener('click',copy);$('shareButton').addEventListener('click',share);$('makeAnother').addEventListener('click',reset);
}
function filters(){
 $('filters').innerHTML=groups.map(([n])=>`<button class="filter${n===state.filter?' active':''}" data-filter="${n}">${n}</button>`).join('');
 $('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;state.showAll=state.filter!=='精选';filters();scenes()});
}
function recentIds(){try{return JSON.parse(localStorage.getItem('flower-recent')||'[]').filter(id=>state.scenes[id]).slice(0,3)}catch(e){return[]}}
function remember(id){try{localStorage.setItem('flower-recent',JSON.stringify([id,...recentIds().filter(x=>x!==id)].slice(0,3)))}catch(e){}}
function category(id,s){
 if(state.filter==='全部')return true;
 if(state.filter==='精选')return featuredIds.includes(id)||recentIds().includes(id);
 const g=groups.find(x=>x[0]===state.filter),hay=norm(id+' '+s.title);
 return !!(g&&g[1].some(k=>hay.includes(k)));
}
function descriptor(id,s){return styleNames[id]||(s.hasFlipBack?'可翻面互动':'动态场景')}
function scenes(){
 let list=Object.entries(state.scenes).filter(([id,s])=>state.query?norm(id+' '+s.title+' '+s.defaultBlessing+' '+descriptor(id,s)).includes(state.query):category(id,s));
 if(state.filter==='精选'&&!state.query){const rank=[...recentIds(),...featuredIds];list.sort((a,b)=>rank.indexOf(a[0])-rank.indexOf(b[0]))}
 $('emptyState').hidden=!!list.length;
 $('collectionTitle').textContent=state.query?`找到 ${list.length} 个场景`:state.filter==='精选'?(recentIds().length?'最近使用与精选':'为你精选'):`${state.filter} · ${list.length} 种`;
 $('toggleAll').textContent=state.filter==='精选'&&!state.query?'查看全部 159 种':'返回精选';
 $('toggleAll').hidden=!!state.query;
 $('sceneGrid').classList.toggle('all-scenes',state.filter!=='精选'||!!state.query);
 $('sceneGrid').innerHTML=list.map(([id,s],i)=>`<button class="scene${id===state.selected?' selected':''}" data-scene="${esc(id)}"><span class="scene-top"><span class="icon">${esc(s.icon||s.ogEmoji||'💌')}</span>${state.filter==='精选'&&!state.query&&i<3?'<em>推荐</em>':''}</span><strong>${esc(s.title||id)}</strong><small>${esc(descriptor(id,s))}</small><span class="wish">${esc(plain(s.defaultBlessing)||'写下专属祝福')}</span></button>`).join('');
 $('sceneGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>select(b.dataset.scene));
}
function select(id,track=true){
 if(state.initialized)state.drafts[state.selected]={blessing:$('blessingInput').value,back:$('backInput').value};
 state.selected=id;if(track)remember(id);scenes();const s=state.scenes[id];if(!s)return;
 $('selectedScene').innerHTML=`<b>${esc(s.icon||s.ogEmoji||'💌')}</b><span><strong>${esc(s.title||id)}</strong><small>${esc(descriptor(id,s))} · 可随时更换</small></span>`;
 const draft=state.drafts[id];$('blessingInput').value=draft?draft.blessing:plain(s.defaultBlessing);$('backInput').value=draft?draft.back:'';state.initialized=true;$('wordCount').textContent=$('blessingInput').value.length+' / 160';
 $('backField').hidden=!s.hasFlipBack;if(!s.hasFlipBack)$('backInput').value='';
}
function go(n){document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel'+n));document.querySelectorAll('.steps button').forEach((b,i)=>{b.classList.toggle('active',i+1===n);b.classList.toggle('done',i+1<n)});window.scrollTo({top:document.querySelector('.builder').offsetTop-15,behavior:'smooth'})}
function url(){const p=new URLSearchParams({scene:state.selected});[['n',$('nameInput').value.trim()],['b',$('blessingInput').value.trim()],['f',$('fromInput').value.trim()],['d',$('dateInput').value],['back',$('backInput').value.trim()]].forEach(([k,v])=>{if(v||k==='b'||k==='f')p.set(k,v)});return new URL('card.html#'+p,location.href).href}
function preview(){if(!$('nameInput').value.trim()){go(2);$('nameInput').focus();toast('请先填写收卡人');return}if(!$('blessingInput').value.trim()){go(2);$('blessingInput').focus();toast('写一句祝福，再送出这张卡吧');return}const u=url();$('resultUrl').value=u;const frame=$('cardPreview').cloneNode(false);frame.src=u;$('cardPreview').replaceWith(frame);remember(state.selected);go(3)}
function copy(){const t=$('resultUrl').value;if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(()=>toast('链接已复制')).catch(fallback);else fallback()}
function fallback(){const i=$('resultUrl');i.focus();i.select();try{if(!document.execCommand('copy'))throw Error('copy failed');toast('链接已复制')}catch(e){toast('请长按链接复制')}}
function share(){const u=$('resultUrl').value,s=state.scenes[state.selected]||{};if(navigator.share)navigator.share({title:s.title||'专属祝福卡',text:'送你一张专属祝福卡',url:u}).catch(e=>{if(e.name!=='AbortError')copy()});else copy()}
function reset(){state.drafts={};state.initialized=false;['nameInput','fromInput','dateInput','backInput'].forEach(id=>$(id).value='');state.query='';state.filter='精选';state.showAll=false;$('sceneSearch').value='';select(state.scenes.birthday?'birthday':Object.keys(state.scenes)[0],false);filters();go(1)}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800)}
})();
