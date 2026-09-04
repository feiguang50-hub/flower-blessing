(function(){
'use strict';
const state={scenes:{},selected:'birthday',filter:'全部',query:''};
const groups=[['全部',[]],['生日',['birthday','cake','newborn','children']],['节日',['new-year','christmas','mid-autumn','dragon-boat','qixi','520','halloween','thanksgiving','teachers-day','mothers-day','fathers-day','chongyang','lantern']],['人生时刻',['graduation','gaokao','career','promotion','retirement','achievement','wedding','engagement','housewarming']],['心意',['thank','apology','friendship','missyou','recovery','cheer','goodluck','wish']],['风景氛围',['sakura','star','moon','snow','rain','ocean','garden','sunset','sunrise','aurora','beach']]];
const $=id=>document.getElementById(id),norm=v=>String(v||'').toLowerCase().replace(/\s+/g,''),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
fetch('assets/scenes.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{state.scenes=data.scenes||{};if(!state.scenes[state.selected])state.selected=Object.keys(state.scenes)[0];$('sceneCount').textContent=Object.keys(state.scenes).length+' 种动态场景';filters();scenes();bind();select(state.selected)}).catch(e=>{$('sceneCount').textContent='载入失败';$('sceneGrid').innerHTML='<p class="empty">场景配置载入失败，请刷新重试。</p>';console.error(e)});
function bind(){
 $('sceneSearch').addEventListener('input',e=>{state.query=norm(e.target.value);scenes()});
 $('toDetails').addEventListener('click',()=>go(2));$('toPreview').addEventListener('click',preview);
 $('blessingInput').addEventListener('input',()=>{$('wordCount').textContent=$('blessingInput').value.length+' / 160'});
 document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.go)));
 $('copyButton').addEventListener('click',copy);$('shareButton').addEventListener('click',share);$('makeAnother').addEventListener('click',reset);
}
function filters(){$('filters').innerHTML=groups.map(([n])=>`<button class="filter${n===state.filter?' active':''}" data-filter="${n}">${n}</button>`).join('');$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;filters();scenes()})}
function category(id,s){if(state.filter==='全部')return true;const g=groups.find(x=>x[0]===state.filter),hay=norm(id+' '+s.title);return g&&g[1].some(k=>hay.includes(k))}
function scenes(){const list=Object.entries(state.scenes).filter(([id,s])=>category(id,s)&&(!state.query||norm(id+' '+s.title+' '+s.defaultBlessing).includes(state.query)));$('emptyState').hidden=!!list.length;$('sceneGrid').innerHTML=list.map(([id,s])=>`<button class="scene${id===state.selected?' selected':''}" data-scene="${esc(id)}"><span class="icon">${esc(s.icon||s.ogEmoji||'💌')}</span><strong>${esc(s.title||id)}</strong><small>${esc(s.defaultBlessing||'写下专属祝福')}</small></button>`).join('');$('sceneGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>select(b.dataset.scene))}
function select(id){state.selected=id;scenes();const s=state.scenes[id];if(!s)return;$('selectedScene').innerHTML=`<b>${esc(s.icon||s.ogEmoji||'💌')}</b><span><strong>${esc(s.title||id)}</strong><small>已选择 · 可随时更换</small></span>`;$('blessingInput').value=s.defaultBlessing||'';$('wordCount').textContent=$('blessingInput').value.length+' / 160';$('backField').hidden=!s.hasFlipBack;if(!s.hasFlipBack)$('backInput').value=''}
function go(n){document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id==='panel'+n));document.querySelectorAll('.steps button').forEach((b,i)=>{b.classList.toggle('active',i+1===n);b.classList.toggle('done',i+1<n)});window.scrollTo({top:document.querySelector('.builder').offsetTop-15,behavior:'smooth'})}
function url(){const p=new URLSearchParams({scene:state.selected});[['n',$('nameInput').value.trim()],['b',$('blessingInput').value.trim()],['f',$('fromInput').value.trim()],['d',$('dateInput').value],['back',$('backInput').value.trim()]].forEach(([k,v])=>{if(v)p.set(k,v)});return new URL('card.html?'+p,location.href).href}
function preview(){if(!$('nameInput').value.trim()){$('nameInput').focus();toast('请先填写收卡人');return}const u=url();$('resultUrl').value=u;$('cardPreview').src=u;go(3)}
function copy(){const t=$('resultUrl').value;if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(()=>toast('链接已复制')).catch(fallback);else fallback()}
function fallback(){const i=$('resultUrl');i.focus();i.select();try{document.execCommand('copy');toast('链接已复制')}catch(e){toast('请长按链接复制')}}
function share(){const u=$('resultUrl').value,s=state.scenes[state.selected]||{};if(navigator.share)navigator.share({title:s.title||'专属祝福卡',text:'送你一张专属祝福卡',url:u}).catch(()=>{});else copy()}
function reset(){['nameInput','fromInput','dateInput','backInput'].forEach(id=>$(id).value='');state.query='';state.filter='全部';$('sceneSearch').value='';select(state.scenes.birthday?'birthday':Object.keys(state.scenes)[0]);filters();go(1)}
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800)}
})();
