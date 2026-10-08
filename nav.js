(function(){
const rowH=(i,l)=>'<div id="n'+i+'r" class="row"><div><label>'+l+': широта</label><input id="n'+i+'a"></div><div><label>'+l+': долгота</label><input id="n'+i+'o"></div></div><div id="n'+i+'s" hidden><label>'+l+': координаты</label><input id="n'+i+'q"></div>';
$('dlst').closest('.card').insertAdjacentHTML('beforebegin','<div class="card"><label>Навигация: азимут к цели</label><select id="ns">'+$('oc').innerHTML+'</select>'
 +rowH(1,'Я')+rowH(2,'Цель')
 +'<button id="n2g" class="sec">Цель из расчёта по рельефу</button><button id="n3g" class="sec">Цель из триангуляции</button>'
 +'<label>Магнитное склонение, ° (восточное +, 0 если не нужно)</label><input id="nd" value="0" inputmode="decimal">'
 +'<button id="nb">Рассчитать азимут</button><div id="ne" style="color:#d92d20;font-size:14px;margin:8px 0 0"></div><div class="res" id="nr" hidden></div></div>');
function nph(){const m=$('ns').value,one=m!=='dd'&&m!=='dms';
 for(const i of[1,2]){$('n'+i+'r').hidden=one;$('n'+i+'s').hidden=!one;
  $('n'+i+'q').placeholder={utm:'38T 444000 4450000',mgrs:'38TLK1234567890',sk42:'4450000 8512345'}[m]||'';
  if(!one){$('n'+i+'a').placeholder=m==='dd'?'40.175000':'40 10 30.5 N';$('n'+i+'o').placeholder=m==='dd'?'44.504000':'44 30 14.4 E'}}}
$('ns').onchange=nph;nph();
function setDD(i,la,lo){$('ns').value='dd';nph();$('n'+i+'a').value=la.toFixed(6);$('n'+i+'o').value=lo.toFixed(6)}
function np(i){const m=$('ns').value;
 if(m==='dd'||m==='dms')return[coord('n'+i+'a'),coord('n'+i+'o')];
 const cs=$('cs'),ps=$('pos'),oc=cs.value,ov=ps.value;
 cs.value=m;ps.value=$('n'+i+'q').value;const r=pos();cs.value=oc;ps.value=ov;return r}
function brg(a,o,b,p){const f1=a*RAD,f2=b*RAD,dl=(p-o)*RAD,
 y=Math.sin(dl)*Math.cos(f2),x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl),
 h=Math.sin((f2-f1)/2)**2+Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)**2;
 return[(Math.atan2(y,x)/RAD+360)%360,2*Rr*Math.asin(Math.min(1,Math.sqrt(h)))]}
$('n2g').onclick=()=>{const e=$('ne');if(!LAST){e.textContent='Сначала сделайте расчёт по рельефу.';return}e.textContent='';setDD(2,LAST.lat,LAST.lon)};
$('n3g').onclick=()=>{const e=$('ne');if(!TL){e.textContent='Сначала сделайте триангуляцию.';return}e.textContent='';setDD(2,TL.la,TL.lo)};
$('nb').onclick=()=>{const e=$('ne');e.textContent='';$('nr').hidden=true;
 const[a,o]=np(1),[b,p]=np(2),d=parseFloat($('nd').value.replace(',','.'));
 if([a,o,b,p].some(isNaN)){e.textContent='Заполните оба набора координат (проверьте формат).';return}
 if(isNaN(d)){e.textContent='Склонение: введите число или 0.';return}
 const[az,m]=brg(a,o,b,p);
 if(m<1){e.textContent='Вы уже в точке цели.';return}
 const mag=((az-d)%360+360)%360,back=(az+180)%360;
 $('nr').innerHTML='<div><span>Азимут к цели (истинный)</span><b>'+az.toFixed(1)+'°</b></div>'
 +(d?'<div><span>Азимут по компасу</span><b>'+mag.toFixed(1)+'°</b></div>':'')
 +'<div><span>Расстояние</span><b>'+(m>=1000?(m/1000).toFixed(2)+' км':m.toFixed(0)+' м')+'</b></div>'
 +'<div><span>Обратный азимут</span><b>'+back.toFixed(1)+'°</b></div>';
 $('nr').hidden=false};
})();
