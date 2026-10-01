(function(){
const k=Rr*RAD;
function ix(a,o,z1,b,p,z2){
 const c=Math.cos(a*RAD),wx=(p-o)*k*c,wy=(b-a)*k,d1=[Math.sin(z1*RAD),Math.cos(z1*RAD)],d2=[Math.sin(z2*RAD),Math.cos(z2*RAD)],det=d2[0]*d1[1]-d1[0]*d2[1];
 if(Math.abs(det)<1e-3)return null;
 const t1=(d2[0]*wy-d2[1]*wx)/det,t2=(d1[0]*wy-d1[1]*wx)/det;
 if(t1<=0||t2<=0)return null;
 return{la:a+t1*d1[1]/k,lo:o+t1*d1[0]/(k*c),t1,t2}}
const row1=$('a1').closest('.row'),row2=$('a2').closest('.row');
row1.insertAdjacentHTML('beforebegin','<label>Система координат точек дрона</label><select id="ts">'+$('oc').innerHTML+'</select><div id="tq" hidden><label>Точка 1: координаты</label><input id="q1"><label>Точка 2: координаты</label><input id="q2"></div>');
$('tg').insertAdjacentHTML('beforebegin','<div class="row"><div><label>Азимут ±, °</label><input id="tea" value="1" inputmode="decimal"></div><div><label>Положение дрона ±, м</label><input id="tep" value="3" inputmode="decimal"></div></div>');
$('ts').onchange=()=>{const m=$('ts').value,one=m!=='dd'&&m!=='dms';
 row1.hidden=row2.hidden=one;$('tq').hidden=!one;
 const ph={utm:'38T 444000 4450000',mgrs:'38TLK1234567890',sk42:'4450000 8512345'}[m]||'';
 $('q1').placeholder=$('q2').placeholder=ph};
function pp(i){const m=$('ts').value;
 if(m==='dd'||m==='dms')return[coord(i==1?'a1':'a2'),coord(i==1?'o1':'o2')];
 const cs=$('cs'),ps=$('pos'),oc=cs.value,ov=ps.value;
 cs.value=m;ps.value=$('q'+i).value;const r=pos();cs.value=oc;ps.value=ov;return r}
function rt2(){
 if(!TL)return;
 $('tr').innerHTML='<div><span>Координаты цели</span><b>'+fmt(TL.la,TL.lo,$('tc').value)+'</b></div>'
 +'<div><span>Разброс цели (радиус)</span><b>±'+TL.rad.toFixed(0)+' м</b></div>'
 +'<div><span>От точки 1</span><b>'+TL.t1.toFixed(0)+' м</b></div>'
 +'<div><span>От точки 2</span><b>'+TL.t2.toFixed(0)+' м</b></div>'
 +'<div><span>Угол пересечения</span><b>'+TL.ang.toFixed(0)+'°'+(TL.ang<30?' (мал, точность низкая)':'')+'</b></div>'
 +'<div><span>Высота рельефа</span><b>'+TL.el+'</b></div>'
 +(TL.part?'<p class="note">При такой погрешности часть вариантов лучей не пересекается: область показана по тем, что пересеклись.</p>':'');
 $('tr').hidden=false}
$('tc').onchange=rt2;
$('tg').onclick=async()=>{
 const e=$('te');e.textContent='';$('tr').hidden=true;
 const[a,o]=pp(1),[b,p]=pp(2),z1=num('z1'),z2=num('z2'),ea=Math.abs(num('tea'))||0,ep=Math.abs(num('tep'))||0;
 if([a,o,b,p,z1,z2].some(isNaN)){e.textContent='Заполните все поля (проверьте формат координат).';return}
 const m=ix(a,o,z1,b,p,z2);
 if(!m){e.textContent='Лучи расходятся или почти параллельны: проверьте азимуты и точки.';return}
 let ang=Math.abs(z1-z2)%180;ang=Math.min(ang,180-ang);
 const pts=[],sh=[[0,0],[ep,0],[-ep,0],[0,ep],[0,-ep]],ca=Math.cos(a*RAD),cb=Math.cos(b*RAD);let tot=0;
 for(const s1 of[-ea,ea])for(const s2 of[-ea,ea])for(const u of sh)for(const v of sh){tot++;
  const r=ix(a+u[1]/k,o+u[0]/(k*ca),z1+s1,b+v[1]/k,p+v[0]/(k*cb),z2+s2);if(r)pts.push([r.la,r.lo])}
 const rad=Math.max(0,...pts.map(q=>dm([m.la,m.lo],q)));
 let el='нет данных';try{el=(await elev(m.la,m.lo)).toFixed(0)+' м'}catch(x){}
 TL={la:m.la,lo:m.lo,t1:m.t1,t2:m.t2,ang,el,rad,part:pts.length<tot};rt2();
 try{
  if(!ensureMap())return;
  const q=[m.la,m.lo],P1=[a,o],P2=[b,p],bd=L.latLngBounds([P1,P2,q]);
  if(pts.length>2&&(ea||ep))bd.extend(L.polygon(hull(pts),{color:'#ff9500',weight:2,fillOpacity:.3}).addTo(LY).getBounds());
  L.polyline([P1,q],{color:'#ff3b30',weight:3}).addTo(LY);
  L.polyline([P2,q],{color:'#ff3b30',weight:3}).addTo(LY);
  mk(P1,'#1d6fe8','Точка 1<br>азимут '+z1+'°','top');
  mk(P2,'#1d6fe8','Точка 2<br>азимут '+z2+'°','top');
  mk(q,'#ff3b30','Цель<br>'+m.la.toFixed(6)+', '+m.lo.toFixed(6),'bottom');
  MAP.fitBounds(bd,{padding:[70,70]})
 }catch(x){}
};
})();
