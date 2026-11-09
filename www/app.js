'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const U=n=>`calc(var(--u)*${n})`;
let BASE=(localStorage.getItem('api')||window.API_BASE||'').replace(/\/$/,'');
let TOKEN=localStorage.getItem('tok')||'',ME=null,ICONS={},HIST={items:[],pending:[]},PR={gram:82.86,usdt:81.87},SEEN=0;
const NAME={gram:'GRAM',usdt:'USD₮'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const nf=(n,d=6)=>(+n).toLocaleString('ru-RU',{maximumFractionDigits:d});
const rub=n=>nf(n,2);
const ini=()=>ME?ME.username.slice(0,2).toUpperCase():'GW';
async function api(p,b,form){
 const h={};if(TOKEN)h.Authorization='Bearer '+TOKEN;const o={headers:h};
 if(form){o.method='POST';o.body=form}else if(b){o.method='POST';h['Content-Type']='application/json';o.body=JSON.stringify(b)}
 try{const r=await fetch(BASE+p,o),j=await r.json();if(r.status===401&&p!=='/api/login')logout();return j}catch(e){return{error:'Нет связи с сервером'}}}
/* ---------- иконки ---------- */
const GRAM='<svg viewBox="0 0 66 66"><circle cx="33" cy="33" r="33" fill="#2f95f5"/><path d="M18 26l5-6h20l5 6-15 21z" fill="#fff"/><path d="M33 24l2.4 5.6L41 32l-5.6 2.4L33 40l-2.4-5.6L25 32l5.6-2.4z" fill="#2f95f5"/></svg>';
const USDT='<svg viewBox="0 0 66 66"><circle cx="33" cy="33" r="33" fill="#119f8a"/><path d="M17 22l4-5h24l4 5-16 22z" fill="#fff"/><path d="M24 25h18M33 25v12M27 30c0 2 12 2 12 0" stroke="#119f8a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="50" cy="50" r="11" fill="#1e88e5" stroke="#15171c" stroke-width="3"/><path d="M45 46h10l-5 9z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
const GEM='<svg viewBox="0 0 60 50"><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5cc2ff"/><stop offset="1" stop-color="#1f3fe0"/></linearGradient></defs><path d="M12 2h36l11 15-29 31L1 17z" fill="url(#gg)"/><path d="M1 17h58M20 17l10 31 10-31M12 2l8 15 10-15 10 15 8-15" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/></svg>';
const TI={gram:GRAM,usdt:USDT};
const IC={in:'<path d="M12 4v16M5 13l7 7 7-7"/>',out:'<path d="M12 20V4M5 11l7-7 7 7"/>',swap:'<path d="M4 8h16M16 4l4 4-4 4M20 16H4M8 12l-4 4 4 4"/>',stake:'<ellipse cx="12" cy="7" rx="7" ry="3.4"/><path d="M5 7v5c0 2 3 3.4 7 3.4s7-1.400 7-3.400V7"/>',pe:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'};
const tic=(k,c)=>`<div class="tic ${c||''}"><svg viewBox="0 0 24 24">${IC[k]}</svg></div>`;
const cache={},MNT={};
async function mount(el,slot,o){o=o||{};const u=ICONS[slot];if(!el||!u)return null;
 try{const d=await(cache[u]||(cache[u]=fetch(BASE+u).then(r=>r.arrayBuffer()).then(b=>JSON.parse(pako.ungzip(new Uint8Array(b),{to:'string'})))));
  el.innerHTML='';return lottie.loadAnimation({container:el,renderer:'svg',loop:o.loop!==false,autoplay:o.autoplay!==false,animationData:JSON.parse(JSON.stringify(d))})}catch(e){return null}}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
function copyT(t){try{navigator.clipboard.writeText(t)}catch(e){}toast('Скопировано')}
function count(el,to,fmt){const from=+el.dataset.v||0;el.dataset.v=to;if(from===to){el.textContent=fmt(to);return}const t0=performance.now();
 (function f(t){const k=Math.min(1,(t-t0)/700),e=1-Math.pow(1-k,3);el.textContent=fmt(from+(to-from)*e);if(k<1)requestAnimationFrame(f)})(t0)}
/* ---------- вкладки ---------- */
let TAB=0;
function setTab(i){TAB=i;$('#track').style.transform=`translateX(${-i*33.3334}%)`;$('#pill').style.transform=`translateX(${U(i*28.6)})`;
 $$('.tab').forEach((t,k)=>t.classList.toggle('on',k===i));$$('.pg').forEach((p,k)=>p.classList.toggle('on',k===i));
 $('#tabs').scrollTo({left:i===2?999:0,behavior:'smooth'})}
$$('.tab').forEach((t,i)=>t.onclick=()=>setTab(i));
(()=>{let x=0,y=0,ok=false;const p=$('#pages');
 p.addEventListener('touchstart',e=>{x=e.touches[0].clientX;y=e.touches[0].clientY;ok=!e.target.closest('.cards,.mov')},{passive:true});
 p.addEventListener('touchend',e=>{if(!ok)return;const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;
  if(Math.abs(dx)>60&&Math.abs(dy)<45)setTab(Math.max(0,Math.min(2,TAB+(dx<0?1:-1))))},{passive:true})})();
$('#ava').onclick=()=>profile();
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim()){toast('Поиск: '+e.target.value.trim());e.target.value='';e.target.blur()}});
/* звёздочки */
(()=>{const c=$('#c1');for(let i=0;i<18;i++){const s=document.createElement('span');s.className='st';s.textContent='✦';
 s.style.left=(4+Math.random()*90)+'%';s.style.top=(5+Math.random()*80)+'%';s.style.fontSize=U(1+Math.random()*1.8);
 s.style.animationDuration=(2+Math.random()*3)+'s,'+(6+Math.random()*6)+'s';s.style.animationDelay=(-Math.random()*5)+'s,'+(-Math.random()*8)+'s';c.appendChild(s)}})();
/* ---------- экраны ---------- */
const STACK=[];
function scr(html,cls){const d=document.createElement('div');d.className='scr '+(cls||'');d.innerHTML=html;$('#app').appendChild(d);STACK.push(d);history.pushState({s:STACK.length},'');
 requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('in')));return d}
function popScr(){const d=STACK.pop();if(!d)return;d.classList.remove('in');setTimeout(()=>d.remove(),520)}
window.addEventListener('popstate',popScr);
const back=()=>history.back();
const ARR='<svg viewBox="0 0 24 24"><path d="M19 12H5M11 5l-7 7 7 7"/></svg>',XI='<svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>';
const UD='<svg viewBox="0 0 12 16"><path d="M6 0l5 6H1zM6 16L1 10h10z"/></svg>';
const hd=(t,b)=>`<div class="hd">${b?`<button class="ib" onclick="back()">${ARR}</button>`:`<button class="chip glass" onclick="profile()"><span class="mini">${ini()}</span>${UD}</button>`}<h1>${t}</h1>${b?'<i class="sp0"></i>':`<button class="ib" onclick="back()">${XI}</button>`}</div>`;
const chip=t=>`<div class="tk"><div class="ci">${TI[t]}</div>${NAME[t]}</div>`;
function shake(el){el.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260})}
function done(title,sub,slot){const o=document.createElement('div');o.className='ovl';
 o.innerHTML=`<div class="big" id="ob"><div class="check"><svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></div></div><h2>${title}</h2><p>${sub}</p>`;
 STACK[STACK.length-1].appendChild(o);if(slot)mount(o.querySelector('#ob'),slot,{loop:false});setTimeout(()=>{o.remove();back()},1900)}
/* — пополнить — */
function qrSvg(t){const q=qrcode(0,'H');q.addData(t);q.make();const n=q.getModuleCount(),m=1.5;
 let s=`<svg viewBox="${-m} ${-m} ${n+2*m} ${n+2*m}"><defs><linearGradient id="qg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${n}" y2="${n}"><stop offset="0" stop-color="#1b8fb0"/><stop offset="1" stop-color="#1c3fcb"/></linearGradient></defs><g fill="url(#qg)">`;
 const F=(r,c)=>(r<7&&c<7)||(r<7&&c>=n-7)||(r>=n-7&&c<7),c0=((n-9)/2)|0,C=(r,c)=>r>=c0&&r<c0+9&&c>=c0&&c<c0+9;
 for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c)&&!F(r,c)&&!C(r,c))s+=`<circle cx="${c+.5}" cy="${r+.5}" r=".47"/>`;
 [[0,0],[0,n-7],[n-7,0]].forEach(([r,c])=>s+=`<circle cx="${c+3.5}" cy="${r+3.5}" r="2.9" fill="none" stroke="url(#qg)" stroke-width="1.1"/><circle cx="${c+3.5}" cy="${r+3.5}" r="1.6"/>`);
 return s+'</g></svg>'}
function deposit(){const a=ME.address;
 const d=scr(`<div class="sbody" style="padding:0"><div class="depbg">${hd('',0).replace('<h1></h1>',`<div class="qtabs glass"><span class="on">TON</span><span>Bitcoin</span><span>Ethereum</span></div>`)}
 <div class="qrc">${qrSvg(a)}<div class="qgem">${GEM}</div></div></div>
 <div style="padding:0 0 calc(var(--u)*8)"><div class="panel glass" style="margin:0;border-radius:0 0 calc(var(--u)*7) calc(var(--u)*7);padding:calc(var(--u)*5)"><div style="color:var(--blue);font-size:calc(var(--u)*4.4)">Мой адрес TON</div>
 <div class="adr" onclick="copyT(ME.address)"><b>${a.slice(0,6)}</b>${a.slice(6,-6)}<b>${a.slice(-6)}</b><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg></div>
 <p style="color:var(--muted);font-size:calc(var(--u)*3.8);line-height:1.45;margin:0">Отправляйте только GRAM или активы на базе TON на этот адрес. Получить перевод можно и по имени: <b style="color:#fff">@${esc(ME.username)}</b>.</p></div>
 <div class="panel glass menu"><button onclick="buyCard()">Покупка с карты</button><button onclick="trade('usdt','gram')">Покупка за криптовалюту</button></div></div></div>`,'');}
function buyCard(){let T='gram';
 const d=scr(`${hd('Покупка с карты',1)}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)"><div class="box glass"><div class="bt"><span>Вы хотите получить</span></div>
 <div class="big-in"><input id="ba" type="number" inputmode="decimal" placeholder="0"><button id="bt" class="tk"></button></div><div class="bt" style="margin-top:calc(var(--u)*3)"><span id="br">≈ 0 ₽</span></div></div>
 <p style="color:var(--muted);font-size:calc(var(--u)*3.7);line-height:1.45;padding:0 calc(var(--u)*2)">Заявка уйдёт администратору. Когда он подтвердит оплату, баланс пополнится автоматически, а запись появится в ленте.</p>
 <div id="bm" class="msg"></div></div><button class="cta" id="bs">Отправить заявку</button>`,'r');
 const upd=()=>{$('#bt').innerHTML=chip(T);$('#br').textContent='≈ '+rub((+$('#ba').value||0)*PR[T])+' ₽'};
 d.querySelector('#bt').onclick=()=>{T=T==='gram'?'usdt':'gram';upd()};d.querySelector('#ba').oninput=upd;upd();
 d.querySelector('#bs').onclick=async()=>{const r=await api('/api/topup',{token:T,amount:$('#ba').value});if(r.error){$('#bm').textContent=r.error;shake($('#bs'));return}
  await refresh();done('Заявка отправлена','Ожидайте подтверждения')}}
/* — отправить — */
function sendScr(){let T='gram';
 const d=scr(`${hd('Отправить')}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)"><div class="box glass"><div class="bt"><span>Получатель</span></div><input class="fld" id="st" style="margin:calc(var(--u)*3) 0 0" placeholder="Адрес кошелька или @имя"></div>
 <div class="box glass"><div class="bt"><span>Сумма</span><span id="sm"></span></div><div class="big-in"><input id="sa" type="number" inputmode="decimal" placeholder="0"><button class="tk" id="sc"></button></div><div class="bt" style="margin-top:calc(var(--u)*3)"><span id="sr"></span><span>Комиссия: 0</span></div></div><div class="msg" id="se"></div></div><button class="cta off" id="ss">Введите сумму</button>`);
 const upd=()=>{const v=+$('#sa').value||0;$('#sc').innerHTML=chip(T);$('#sm').innerHTML=`Максимум: <b style="color:var(--blue);cursor:pointer" id="mx">${nf(ME[T])} ${NAME[T]}</b>`;
  $('#mx').onclick=()=>{$('#sa').value=ME[T];upd()};$('#sr').textContent='≈ '+rub(v*PR[T])+' ₽';const b=$('#ss');
  b.textContent=v<=0?'Введите сумму':v>ME[T]?'Недостаточно средств':'Отправить';b.classList.toggle('off',v<=0||v>ME[T])};
 d.querySelector('#sc').onclick=()=>{T=T==='gram'?'usdt':'gram';upd()};d.querySelector('#sa').oninput=upd;upd();
 d.querySelector('#ss').onclick=async()=>{if($('#ss').classList.contains('off'))return shake($('#ss'));
  const r=await api('/api/send',{to:$('#st').value,token:T,amount:$('#sa').value});if(r.error){$('#se').textContent=r.error;shake($('#ss'));return}
  const a=$('#sa').value;await refresh();done('Отправлено',`${nf(a)} ${NAME[T]} → @${esc(r.to)}`,'gram_send')}}
/* — торговля — */
function trade(f,t){const S={f:f||'gram',t:t||'usdt'};
 const d=scr(`${hd('Торговля')}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)"><div class="box glass" style="padding-bottom:calc(var(--u)*6)"><div class="bt"><span>Вы продаёте</span><span id="tm"></span></div><div class="big-in"><input id="ta" type="number" inputmode="decimal" placeholder="0"><div class="tk" id="tf"></div></div>
 <button class="sw glass" id="tsw"><svg viewBox="0 0 24 24"><path d="M8 4v16M4 16l4 4 4-4M16 20V4M12 8l4-4 4 4"/></svg></button><div class="bt" style="margin-top:calc(var(--u)*3)"><span>Вы покупаете</span></div><div class="big-in"><div class="o" id="to">0</div><div class="tk" id="tt2"></div></div></div>
 <div class="box glass" style="padding:calc(var(--u)*3.4) calc(var(--u)*4.6)"><div class="line" style="padding:0"><b>Детали обмена</b><span id="tr"></span></div></div><div id="tw"></div><div class="msg" id="te"></div></div><button class="cta off" id="tb">Введите сумму</button>`);
 const upd=()=>{const v=+$('#ta').value||0,o=v*PR[S.f]/PR[S.t];$('#tf').innerHTML=chip(S.f);$('#tt2').innerHTML=chip(S.t);
  $('#tm').innerHTML=`Максимум: <b style="color:var(--blue)">${nf(ME[S.f])} ${NAME[S.f]}</b>`;$('#to').textContent=nf(o);$('#to').style.color=o?'#fff':'#777';
  $('#tr').textContent=`1 ${NAME[S.f]} ≈ ${nf(PR[S.f]/PR[S.t],4)} ${NAME[S.t]}`;const b=$('#tb');
  b.textContent=v<=0?'Введите сумму':v>ME[S.f]?'Недостаточно средств':'Обменять';b.classList.toggle('off',v<=0||v>ME[S.f]);
  $('#tw').innerHTML=ME[S.f]<=0?`<div class="warn"><div><b>Пополните баланс для обмена</b><p>Купите криптовалюту с карты или получите перевод, чтобы пополнить баланс для обмена.</p></div><button onclick="deposit()">Пополнить</button></div>`:''};
 d.querySelector('#tsw').onclick=e=>{[S.f,S.t]=[S.t,S.f];e.currentTarget.querySelector('svg').style.transform+=' rotate(180deg)';$('#ta').value='';upd()};
 d.querySelector('#ta').oninput=upd;upd();
 d.querySelector('#tb').onclick=async()=>{if($('#tb').classList.contains('off'))return shake($('#tb'));const r=await api('/api/swap',{from:S.f,to:S.t,amount:$('#ta').value});
  if(r.error){$('#te').textContent=r.error;return shake($('#tb'))}await refresh();done('Обмен выполнен',`+${nf(r.out)} ${NAME[S.t]}`)}}
/* — стейкинг — */
async function stakeScr(){let M='add';const si=await api('/api/stakeinfo');
 const d=scr(`${hd('Добавить')}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)"><div class="seg glass"><i class="pill" id="sp"></i><button class="on">Добавить</button><button>Вывести</button></div>
 <div class="box glass"><div class="bt"><span>Сумма</span><span id="km"></span></div><div class="big-in"><input id="ka" type="number" inputmode="decimal" placeholder="0"><div class="tk">${chip('gram').replace('class="tk"','')}</div></div><div class="bt" style="margin-top:calc(var(--u)*3)"><span id="kr"></span><span>Комиссия: 0 GRAM</span></div></div>
 <div class="box glass"><b style="font-size:calc(var(--u)*4.2)">Инфо</b><div class="line"><span>Текущий APY</span><span class="apy">13.91%</span></div><div class="line"><span>Приблизительный доход в год</span><b class="up" id="ky">0 GRAM</b></div>
 <div class="line"><span>Всего в стейкинге</span><b>${nf(si.total||0,2)} GRAM</b></div><div class="line"><span>Всего стейкеров</span><b>${si.stakers||0}</b></div></div><div class="msg" id="ke"></div></div><button class="cta off" id="kb">Введите сумму</button>`);
 const upd=()=>{const v=+$('#ka').value||0,mx=M==='add'?ME.gram:ME.staked;$('#km').innerHTML=`${M==='add'?'Максимум':'В стейкинге'}: <b style="color:var(--blue)" id="kx">${nf(mx)} GRAM</b>`;
  $('#kx').onclick=()=>{$('#ka').value=mx;upd()};$('#kr').textContent='≈ '+rub(v*PR.gram)+' ₽';$('#ky').textContent=nf(v*.1391,4)+' GRAM';const b=$('#kb');
  b.textContent=v<=0?'Введите сумму':v>mx?'Недостаточно средств':M==='add'?'Застейкать GRAM':'Вывести GRAM';b.classList.toggle('off',v<=0||v>mx)};
 d.querySelectorAll('.seg button').forEach((b,i)=>b.onclick=()=>{M=i?'rm':'add';d.querySelectorAll('.seg button').forEach((x,k)=>x.classList.toggle('on',k===i));
  $('#sp').style.transform=`translateX(${i*100}%)`;d.querySelector('h1').textContent=i?'Вывести':'Добавить';$('#ka').value='';upd()});
 d.querySelector('#ka').oninput=upd;upd();
 d.querySelector('#kb').onclick=async()=>{if($('#kb').classList.contains('off'))return shake($('#kb'));const r=await api('/api/stake',{amount:$('#ka').value,unstake:M==='rm'});
  if(r.error){$('#ke').textContent=r.error;return shake($('#kb'))}await refresh();done(M==='add'?'Застейкано':'Выведено','Готово')}}
/* — токен — */
const SPARK=(seed,down,w=300,h=60)=>{let s=seed;const r=()=>(s=s*16807%2147483647)/2147483647;let y=down?.2:.8,p=[];for(let i=0;i<40;i++){y+= (down?.018:-.018)+(r()-.5)*.14;y=Math.max(.06,Math.min(.94,y));p.push([i*w/39,y*h])}
 const c=down?'#3d9bff':'#3ddc84',d=p.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join('');
 return `<svg class="sp" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${d}L${w} ${h}L0 ${h}Z" fill="${c}" opacity=".14"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`};
function tokScr(t){const isG=t==='gram',b=ME[t];
 const d=scr(`${hd(isG?'Gram':'Tether USD',1)}<div class="sbody" style="padding:0 0 calc(var(--u)*22)"><div class="hero"><div class="big" id="tb0">${TI[t]}</div><h2><span id="tbv" data-v="0">0</span> <small>${NAME[t]}</small></h2><p>${rub(b*PR[t])} ₽</p></div>
 <div class="acts" style="padding-top:calc(var(--u)*4)"><button class="act" onclick="deposit()"><i class="glass"><svg viewBox="0 0 34 34"><path d="M17 5v24M5 17h24"/></svg></i>Пополнить</button><button class="act" onclick="sendScr()"><i class="glass"><svg viewBox="0 0 34 34"><path d="M17 29V6M7 15l10-10 10 10"/></svg></i>Отправить</button><button class="act" onclick="trade('${t}','${isG?'usdt':'gram'}')"><i class="glass"><svg viewBox="0 0 34 34"><path d="M5 12h24M23 6l6 6M29 22H5M11 28l-6-6"/></svg></i>Торговля</button><button class="act" onclick="stakeScr()"><i class="glass"><svg viewBox="0 0 34 34"><ellipse cx="17" cy="10" rx="9" ry="5"/><path d="M8 10v4c0 3 4 5 9 5s9-2 9-5v-4M8 19v4c0 3 4 5 9 5s9-2 9-5v-4"/></svg></i>Стейкинг</button></div>
 <div class="panel glass" style="padding:calc(var(--u)*3.6) calc(var(--u)*4)"><div class="chart"><div><div style="color:var(--muted);font-size:calc(var(--u)*4.2)">Цена</div><div style="font-size:calc(var(--u)*4.6);font-weight:600;white-space:nowrap">${rub(PR[t])} ₽ <span class="dn" style="font-weight:400">−${isG?'5.99':'0.12'}%</span></div></div>${SPARK(isG?7:3,isG,200,50).replace('class="sp"','')}</div></div>
 <div class="panel glass" style="padding:calc(var(--u)*3.6) calc(var(--u)*4)"><div style="color:var(--muted);font-size:calc(var(--u)*4.2)">Информация</div><p style="margin:calc(var(--u)*1.4) 0 0;font-size:calc(var(--u)*4.6);line-height:1.55">${isG?'Gram — нативная монета блокчейна TON. Её можно отправлять, обменивать и ставить в стейкинг с доходностью 13.91% годовых.':'Tether USD (USD₮) — стейблкоин в сети TON, привязанный к доллару США.'}</p></div></div><button class="cta green" onclick="trade('${isG?'usdt':'gram'}','${t}')">Купить</button>`,'r');
 const v=d.querySelector('#tbv');count(v,b,x=>nf(x,4));const big=d.querySelector('#tb0');
 if(isG)mount(big,'gram_tap',{loop:false}).then(a=>{if(a)big.onclick=()=>a.goToAndPlay(0)})}
/* — профиль — */
function profile(){const d=scr(`${hd('Профиль',1)}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)"><div style="text-align:center;padding:calc(var(--u)*2) 0 calc(var(--u)*5)"><div class="ava" style="margin:0 auto;width:calc(var(--u)*26);height:calc(var(--u)*26);border-radius:50%;padding:calc(var(--u)*2)" ><span style="display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#ffb347,#ff8c1a);font-size:calc(var(--u)*9);font-weight:800">${ini()}</span></div><h2 style="margin:calc(var(--u)*3) 0 .6u;font-size:calc(var(--u)*6)">@${esc(ME.username)}</h2><div style="color:var(--muted);font-size:calc(var(--u)*3.6)">Всего ≈ ${rub((ME.gram+ME.staked)*PR.gram+ME.usdt*PR.usdt)} ₽</div></div>
 <div class="box glass" onclick="copyT(ME.address)"><div class="bt"><span>Адрес кошелька (нажмите, чтобы скопировать)</span></div><div class="adr" style="font-size:calc(var(--u)*3.8);margin:calc(var(--u)*2) 0 0;color:#ddd">${ME.address}</div></div>
 ${ME.admin?'<button class="pri" onclick="adminScr()">Админ-панель</button>':''}<div id="pw" style="display:none"><input class="fld" id="po" type="password" placeholder="Старый пароль"><input class="fld" id="pn" type="password" placeholder="Новый пароль (от 6 символов)"><button class="pri" id="pk">Сохранить пароль</button><div class="msg" id="pm"></div></div>
 <button class="pri gr" id="pt">Сменить пароль</button><button class="pri rd" onclick="logout(1)">Выйти</button></div>`,'r');
 d.querySelector('#pt').onclick=()=>{const p=d.querySelector('#pw');p.style.display=p.style.display==='none'?'block':'none'};
 d.querySelector('#pk').onclick=async()=>{const r=await api('/api/password',{old:$('#po').value,new:$('#pn').value});$('#pm').textContent=r.error||'';if(!r.error){toast('Пароль изменён');back()}}}
/* — админка — */
async function adminScr(){const o=await api('/api/admin/overview');if(o.error)return toast(o.error);
 const d=scr(`${hd('Админ-панель',1)}<div class="sbody" style="padding:calc(var(--u)*2) calc(var(--u)*4)" id="ab">
 <div class="box glass"><b>Заявки на пополнение</b>${o.requests.length?o.requests.map(r=>`<div class="rq"><span>@${esc(r.username)} · ${nf(r.amount)} ${NAME[r.token]}</span><span><button class="y" data-r="${r.id}" data-ok="1">✓</button> <button class="n" data-r="${r.id}">✕</button></span></div>`).join(''):'<div style="color:var(--muted);padding-top:calc(var(--u)*2);font-size:calc(var(--u)*3.6)">Заявок нет</div>'}</div>
 <div class="box glass"><b>Выдать баланс</b><input class="fld" id="cu" style="margin-top:calc(var(--u)*3)" placeholder="Логин пользователя"><input class="fld" id="cm" type="number" placeholder="Сумма"><button class="pri gr" id="ct">Токен: GRAM</button><button class="pri" id="cg">Выдать</button><div class="msg" id="cmsg"></div></div>
 <div class="box glass"><b>Иконки TGS</b><div id="sl" style="margin-top:calc(var(--u)*3)"></div></div>
 <div class="box glass"><b>Пользователи (${o.users.length})</b>${o.users.map(u=>`<div class="ur"><b>@${esc(u.username)}</b><span>${nf(u.gram,2)} G · ${nf(u.usdt,2)} U${u.staked?` · ${nf(u.staked,2)} st`:''}</span></div>`).join('')}</div></div>`,'r');
 let T='gram';d.querySelector('#ct').onclick=e=>{T=T==='gram'?'usdt':'gram';e.target.textContent='Токен: '+NAME[T]};
 d.querySelector('#cg').onclick=async()=>{const r=await api('/api/admin/credit',{username:$('#cu').value,token:T,amount:$('#cm').value});$('#cmsg').style.color=r.error?'':'var(--green)';$('#cmsg').textContent=r.error||'Выдано';if(!r.error){$('#cm').value='';refresh()}};
 d.querySelectorAll('[data-r]').forEach(b=>b.onclick=async()=>{await api('/api/admin/topup',{id:+b.dataset.r,ok:!!b.dataset.ok});back();setTimeout(adminScr,560)});
 const sl=d.querySelector('#sl');Object.keys(o.slots).forEach(k=>{const w=document.createElement('div');w.className='slot';
  w.innerHTML=`<h3>${o.slots[k]}</h3><div class="pv" id="pv-${k}">${ICONS[k]?'':'не загружено'}</div><input type="file" accept=".tgs"><button class="pri">Загрузить</button>${ICONS[k]?'<button class="pri gr">Удалить</button>':''}<div class="msg"></div>`;
  sl.appendChild(w);mount(w.querySelector('.pv'),k);const[up,del]=w.querySelectorAll('button'),m=w.querySelector('.msg');
  up.onclick=async()=>{const f=w.querySelector('input').files[0];if(!f){m.textContent='Выберите файл .tgs';return}const fd=new FormData();fd.append('slot',k);fd.append('file',f);
   const r=await api('/api/admin/upload',null,fd);if(r.error){m.textContent=r.error;return}await refresh();back();setTimeout(adminScr,560)};
  if(del)del.onclick=async()=>{await api('/api/admin/delete',{slot:k});await refresh();back();setTimeout(adminScr,560)}})}
/* ---------- маркет и обзор ---------- */
const CI=(c,l)=>`<div class="ci" style="background:${c}">${l}</div>`;
function buildMarket(){const mv=[['STONK',3.93,-33.39,'#0e6f82','s'],['Act I : The AI',0.74,-20.9,'#7b4bd6','A'],['DOGWIF',1.12,12.4,'#c97b1a','D']];
 const pop=[['Bitcoin','#f7931a','₿',-2.63],['Solana','#0d0d12','S',-4.13],['Zcash','#d9a014','Z',-5.33],['Tron','#ef5b5b','T',-1.36],['Polygon','#7a1ff0','P',-4],['Ethereum','#5a6fe0','Ξ',-6.54],['Hyperliquid','#0f3d3a','H',-3.2],['My Wallet Coin','#12a3f0','W',-1.1],['Gram','#2f95f5','',-4.25]];
 $('#p1').innerHTML=`<div class="sec glass"><div class="h4">Главные движения за день</div><div class="mov">${mv.map((m,i)=>`<div class="mc"><div class="ci" style="background:${m[3]}">${m[4]}</div><b>${m[0]}</b><span>${m[1]} ₽ <b class="${m[2]<0?'dn':'up'}" style="display:inline;font-size:1em;font-weight:500">${m[2]>0?'+':''}${m[2]}%</b></span>${SPARK(11+i,m[2]<0)}</div>`).join('')}</div></div>
 <div class="sec glass"><div class="h4">Популярные токены <span>Показать все</span></div><div class="grid3">${pop.map(p=>`<button class="gi" onclick="${p[0]==='Gram'?"tokScr('gram')":"toast('Скоро')"}" style="color:#fff">${p[0]==='Gram'?`<div class="ci">${GRAM}</div>`:CI(p[1],p[2])}${p[0]}<small class="dn">${p[3]}%</small></button>`).join('')}</div></div>`}
function buildExplore(){const A=(n,c,l)=>`<div class="ap"><i style="background:${c}">${l}</i>${n}</div>`;
 $('#p2').innerHTML=`<div class="sec glass"><div class="h4">Подключённые приложения</div><div class="apps">${A('Getgems','linear-gradient(135deg,#5cc2ff,#2a84f5)','✿')}${A('Split','linear-gradient(135deg,#8ea0b8,#c0b6d0)','/')}${A('Split','linear-gradient(135deg,#8ea0b8,#c0b6d0)','/')}${A('Настройки','transparent','⚙')}</div></div>
 <div class="sec glass"><div class="h4">Сейчас в тренде</div><div class="ban"><div class="gem">${USDT.replace(/<circle[^>]*r="33"[^>]*\/>/,'')}</div><h5>Send &amp; Receive Crypto or Collectibles via Telegram</h5><div class="bl"><i>@push</i><div><b>@push</b><p>Переводите средства и NFT в любых чатах прямо в Telegram</p></div></div></div></div>
 <div class="sec glass"><div class="h4">Популярные приложения</div><div class="pops"><div>${A('Spot','linear-gradient(135deg,#1f86f5,#1a52c4)','◆')}${A('Cubes','#111','▣')}</div><div>${A('Storm','#111','ST')}${A('Evaa','#3a1fe0','E')}</div></div></div>`}
/* ---------- данные ---------- */
function fmtT(ts){return new Date(ts*1000).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
function renderFeed(){const {items,pending}=HIST;if(!items.length&&!pending.length){$('#feed').innerHTML='<div class="empty"><b>Нет активности</b><p>История операций в этом кошельке пока отсутствует.</p></div>';return}
 const T={send:r=>r.dir==='in'?['in','Получено','от @'+esc(r.peer||'?')]:['out','Отправлено','для @'+esc(r.peer||'?')],credit:()=>['in','Пополнение','Начислено'],swap:r=>['swap','Обмен',NAME[r.token]+' → '+NAME[r.token2]],stake:()=>['stake','Стейкинг','Добавлено'],unstake:()=>['in','Вывод из стейкинга','GRAM']};
 $('#feed').innerHTML=pending.map(p=>`<div class="tx">${tic('pe','pe')}<div class="mid"><b>Заявка на пополнение</b><span>Ожидает подтверждения · ${fmtT(p.ts)}</span></div><div class="rt">${nf(p.amount)} ${NAME[p.token]}</div></div>`).join('')+
 items.map(r=>{const[k,t,s]=T[r.kind](r),plus=r.dir==='in'||r.kind==='unstake',sw=r.kind==='swap';
  return `<div class="tx">${tic(k==='in'?'in':k,k==='in'?'in':'')}<div class="mid"><b>${t}</b><span>${s} · ${fmtT(r.ts)}</span></div><div class="rt ${plus||sw?'in':''}">${sw?'+'+nf(r.amount2)+' '+NAME[r.token2]:(plus?'+':'−')+nf(r.amount)+' '+NAME[r.token]}</div></div>`}).join('')}
function paint(){if(!ME)return;$('#ini').textContent=ini();const tot=(ME.gram+ME.staked)*PR.gram+ME.usdt*PR.usdt;count($('#bal'),tot,x=>rub(x));
 count($('#stk'),ME.staked,x=>nf(x,4)+' GRAM');$('#gv').textContent=nf(ME.gram,4)+' GRAM';$('#gr').textContent=rub(ME.gram*PR.gram)+' ₽';$('#uv').textContent=nf(ME.usdt,4)+' USD₮';$('#ur').textContent=rub(ME.usdt*PR.usdt)+' ₽';renderFeed()}
let LASTIN=0;
async function refresh(quiet){if(!TOKEN)return;const m=await api('/api/me');if(!m.auth)return;ME=m.user;ICONS=m.icons||{};if(m.price)PR=m.price;
 const h=await api('/api/history');if(h.items){const top=h.items.find(x=>x.dir==='in'&&x.kind==='send');if(quiet&&top&&top.id>LASTIN&&LASTIN)toast(`Получено ${nf(top.amount)} ${NAME[top.token]} от @${top.peer}`);
  LASTIN=Math.max(LASTIN,...h.items.filter(x=>x.dir==='in').map(x=>x.id),0);HIST=h}
 paint();[['gram_list','#ico-gram',GRAM],['usdt_list','#ico-usdt',USDT]].forEach(([s,id,svg])=>{const u=ICONS[s]||'';if(MNT[s]!==u){MNT[s]=u;if(u)mount($(id),s);else $(id).innerHTML=svg}})}
/* ---------- вход ---------- */
let MODE='login';
function showAuth(){$('#auth').classList.add('on');$('#alogo').innerHTML=GRAM;$('#srv').innerHTML=`Сервер: ${esc(BASE||'не указан')} · <u id="chs">изменить</u>`;
 $('#chs').onclick=()=>{const v=prompt('Адрес сервера, например https://имя.pythonanywhere.com',BASE);if(v!==null){BASE=v.trim().replace(/\/$/,'');localStorage.setItem('api',BASE);showAuth()}}}
$$('#auth .seg button').forEach((b,i)=>b.onclick=()=>{MODE=b.dataset.m;$$('#auth .seg button').forEach(x=>x.classList.toggle('on',x===b));$('#apill').style.transform=`translateX(${i*100}%)`;$('#go').textContent=i?'Создать кошелёк':'Войти';$('#am').textContent=''});
$('#go').onclick=async()=>{const r=await api('/api/'+MODE,{username:$('#u').value.trim(),password:$('#p').value});if(r.error){$('#am').textContent=r.error;return shake($('#go'))}
 TOKEN=r.token;localStorage.setItem('tok',TOKEN);$('#p').value='';$('#auth').classList.remove('on');LASTIN=0;await refresh();setTab(0)};
$('#p').addEventListener('keydown',e=>{if(e.key==='Enter')$('#go').click()});
function logout(go){TOKEN='';localStorage.removeItem('tok');ME=null;HIST={items:[],pending:[]};while(STACK.length)popScr();showAuth()}
$('#ico-gram').innerHTML=GRAM;$('#ico-usdt').innerHTML=USDT;MNT.gram_list=MNT.usdt_list='';
buildMarket();buildExplore();
if(TOKEN)refresh().then(()=>{if(!ME)showAuth()});else showAuth();
setInterval(()=>{if(TOKEN&&!document.hidden)refresh(true)},12000);
