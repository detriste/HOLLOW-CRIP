/* Efeitos visuais das supers (arquivo separado: não mexe em sprites.js nem icones.js)
   Define: specAlpha, drawSkull, drawOrbs, drawAbilityFx — chamados por render.js */

// Espectro: invisível durante a super; nos últimos 1,5s pisca cada vez mais rápido
function specAlpha(){if(!(P.ph>0))return 1;const lim=1.5;if(P.ph>lim)return .12;return Math.sin(tm*(18+(lim-P.ph)/lim*30))>0?.6:.12}

// Crânio (orbes do Necromante durante a super)
function drawSkull(x,y,s){X.save();X.translate(x,y);X.scale(s,s);X.rotate(Math.sin(tm*4+x)*.2);X.fillStyle='rgba(182,255,122,'+(.18+.1*Math.sin(tm*8))+')';X.beginPath();X.arc(0,0,13,0,6.283);X.fill();
 X.lineJoin='round';X.lineWidth=2;X.strokeStyle='#1c130d';X.fillStyle='#e9e4d0';X.beginPath();X.roundRect(-4.5,3,9,6,1.5);X.fill();X.stroke();X.beginPath();X.arc(0,-1,8,0,6.283);X.fill();X.stroke();
 X.fillStyle='#10160e';for(const q of[-1,1]){X.beginPath();X.ellipse(q*3.2,-1.5,2.4,2.9,0,0,6.283);X.fill()}X.fillStyle='#b6ff7a';for(const q of[-1,1]){X.beginPath();X.arc(q*3.2,-1.2,1,0,6.283);X.fill()}
 X.fillStyle='#10160e';X.beginPath();X.moveTo(0,1.5);X.lineTo(-1.3,3.8);X.lineTo(1.3,3.8);X.closePath();X.fill();X.strokeStyle='#1c130d';X.lineWidth=1;X.beginPath();X.moveTo(-1.6,5.5);X.lineTo(-1.6,8.5);X.moveTo(1.6,5.5);X.lineTo(1.6,8.5);X.stroke();X.restore()}

// Orbes defensivas (viram crânios enquanto a super do Necromante está ativa)
function drawOrbs(){if(!P.orb)return;const nec=P.ch.k==3&&P.swt>0;for(let i=0;i<P.orb;i++){const a=P.oa+i*6.283/P.orb,x=P.x+Math.cos(a)*46,y=P.y+Math.sin(a)*46;
 if(nec){const e=Math.min(1,(P.swm-P.swt)/.3);drawSkull(x,y,e<1?e*1.3:1)}else poly(x,y,7,4,tm*3,'#cfc08a','#0a2a33')}}

// Anéis de choque, brilho do escudo e armas do Artilheiro
function drawAbilityFx(){
 if(P.vf)for(const f of P.vf){if(f.dl>0)continue;const p=1-f.t/f.m;
  if(f.k=='ring'){const R=f.in?f.R*(1-p):f.R*(.12+.88*Math.sin(p*1.5708));X.save();X.globalAlpha=Math.max(0,1-p);X.strokeStyle=f.c;X.lineWidth=Math.max(1,f.w*(1-p));X.beginPath();X.arc(P.x+(f.ox||0),P.y+(f.oy||0),R,0,6.283);X.stroke();X.globalAlpha=Math.max(0,1-p)*.14;X.fillStyle=f.c;X.fill();X.restore()}
  else if(f.k=='flash'){const d=(P.r+2)*1.6,cx=P.x+Math.cos(f.a)*d,cy=P.y+Math.sin(f.a)*d,s=(1-p)*32;X.save();X.globalAlpha=1-p;X.fillStyle='#fff';X.beginPath();for(let i=0;i<16;i++){const q=i*.3927+f.a,l=i%2?s*.45:s;X[i?'lineTo':'moveTo'](cx+Math.cos(q)*l,cy+Math.sin(q)*l)}X.closePath();X.fill();X.restore()}}
 if(P.gn>0){const sc=Math.min(1,(GUN_T-P.gn)/.2);X.save();X.globalAlpha=Math.min(1,P.gn/.2);X.lineJoin='round';
  for(let i=0;i<GUN_N;i++){const a=gunAng(i),d=14+26*sc;X.save();X.translate(P.x+Math.cos(a)*d,P.y+Math.sin(a)*d);X.rotate(a);X.scale(.4+.6*sc,.4+.6*sc);X.lineWidth=2;X.strokeStyle='#1c130d';
   X.fillStyle='#6b4423';X.beginPath();X.roundRect(-8,-3,7,10,2);X.fill();X.stroke();X.fillStyle='#55524c';X.beginPath();X.roundRect(-4,-4.5,20,9,2);X.fill();X.stroke();X.fillStyle='#d08a3c';X.beginPath();X.roundRect(12,-6,6,12,2);X.fill();X.stroke();
   if(P.gf>0){X.fillStyle='#ffe9a0';X.beginPath();X.arc(22,0,7,0,6.283);X.fill()}X.restore()}X.restore()}}

// Desenha fn() multiplicando toda transparência por m, mesmo que o sprite resete globalAlpha para 1
// (é isso que permite o Espectro ficar invisível sem alterar sprites.js)
const _gaD=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(X),'globalAlpha');
function withAlpha(m,fn){if(m>=1||!_gaD||!_gaD.set)return fn();
 Object.defineProperty(X,'globalAlpha',{configurable:true,get(){return _gaD.get.call(X)/m},set(v){_gaD.set.call(X,v*m)}});
 try{fn()}finally{delete X.globalAlpha}}