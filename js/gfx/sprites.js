/*
 * DESENHO DOS PERSONAGENS
 * A função body() desenha cada herói. Os parâmetros incluem:
 * h = dados do herói; x/y = posição; r = tamanho; a = direção;
 * w = intensidade do movimento; t = tempo da animação; bt = progresso da batida.
 */

function body(h,x,y,r,a,w,t,bt){const c=h.c,sn=Math.sin(t*12),bl=Math.sin(t*1.9)>.96,k=h.k,ca=Math.cos(a),sa=Math.sin(a),O='#1c130d',lw=Math.max(2,r*.17),R=r-lw/2;
 X.save();X.lineJoin='round';X.lineCap='round';X.lineWidth=lw;X.strokeStyle=O;
 X.fillStyle='#0005';X.beginPath();X.ellipse(x,y+r+3,r*.9,r*.3,0,0,6.283);X.fill();
 if(k!=1){X.fillStyle=['#6f6a60','','#4a2e16','#2a3a22'][k];for(const s of[-1,1]){X.beginPath();X.ellipse(x+s*r*.5,y+r*.8+sn*s*w*3,r*.3,r*.2,0,0,6.283);X.fill();X.stroke()}}
 y-=k==1?2+Math.sin(t*3)*r*.12:Math.abs(sn)*w*3;
 const eyes=(col,rx,ry,gl)=>{for(const s of[-1,1]){const ex=x+s*r*.36+ca*r*.1,ey=y-r*.08+sa*r*.1;if(gl){X.fillStyle=gl;X.beginPath();X.arc(ex,ey,rx*2.1,0,6.283);X.fill()}if(bl){X.strokeStyle=col;X.lineWidth=2;X.beginPath();X.moveTo(ex-rx,ey);X.lineTo(ex+rx,ey);X.stroke();X.strokeStyle=O;X.lineWidth=lw}else{X.fillStyle=col;X.beginPath();X.ellipse(ex,ey,rx,ry,0,0,6.283);X.fill()}}};
 if(k==0){
  X.fillStyle=c;X.beginPath();X.arc(x,y,r,0,6.283);X.fill();X.stroke();
  X.fillStyle='rgba(0,0,0,.2)';X.beginPath();X.arc(x,y,R,.2,2.94);X.closePath();X.fill();
  const sw=x+r*1.12;X.fillStyle='#dfe6e8';X.beginPath();X.roundRect(sw-r*.1,y-r*1.4,r*.2,r*1.8,r*.06);X.fill();X.stroke();X.fillStyle='#c9a13a';X.beginPath();X.roundRect(sw-r*.3,y+r*.28,r*.6,r*.15,r*.04);X.fill();X.stroke();
  const bo=bt>0?(bt<.3?bt/.3:1-(bt-.3)/.7):0,sx=x-r*1.02+(ca*r*1.6+r*1.02)*bo,sy=y+r*.15+(sa*r*1.6-r*.15)*bo;X.fillStyle='#8c969b';X.beginPath();X.moveTo(sx-r*.46,sy-r*.5);X.lineTo(sx+r*.46,sy-r*.5);X.lineTo(sx+r*.46,sy+r*.15);X.quadraticCurveTo(sx+r*.4,sy+r*.75,sx,sy+r*.95);X.quadraticCurveTo(sx-r*.4,sy+r*.75,sx-r*.46,sy+r*.15);X.closePath();X.fill();X.stroke();X.fillStyle='#c9a13a';X.fillRect(sx-r*.07,sy-r*.36,r*.14,r*.95);X.fillRect(sx-r*.3,sy-r*.06,r*.6,r*.14);
  X.fillStyle='#9aa3a8';X.beginPath();X.arc(x,y,R,Math.PI,6.283);X.closePath();X.fill();X.stroke();
  X.fillStyle=O;X.fillRect(x-r*.86,y-r*.3,r*1.72,r*.36);X.fillStyle='#9aa3a8';X.fillRect(x-r*.07,y-r*.3,r*.14,r*.36);
  const sw2=Math.sin(t*4)*r*.12;X.fillStyle='#b5342f';X.beginPath();X.moveTo(x-r*.18,y-r*.95);X.quadraticCurveTo(x-r*.5+sw2,y-r*1.75,x+r*.55+sw2,y-r*1.4);X.quadraticCurveTo(x+r*.15,y-r*1.2,x+r*.2,y-r*.95);X.closePath();X.fill();X.stroke();
  eyes('#ffe9a0',r*.12,r*.09,'rgba(255,233,160,.22)')}
 else if(k==1){
  const wv=i=>Math.sin(t*5+i*1.7)*r*.12;
  const ga0=X.globalAlpha;X.globalAlpha=ga0*.94;X.fillStyle=c;X.beginPath();X.moveTo(x-r,y);X.arc(x,y,r,Math.PI,6.283);X.lineTo(x+r,y+r*.95);for(let i=0;i<4;i++){const x1=x+r-(i+1)*r*.5;X.quadraticCurveTo(x1+r*.25,y+r*1.4+wv(i),x1,y+r*.95)}X.closePath();X.fill();X.stroke();X.globalAlpha=ga0;
  X.fillStyle='rgba(255,255,255,.2)';X.beginPath();X.ellipse(x-r*.4,y+r*.15,r*.22,r*.5,-.3,0,6.283);X.fill();
  const tp=Math.sin(t*3)*r*.15;X.fillStyle='#4a3a68';X.beginPath();X.moveTo(x-r*1.04,y+r*.15);X.quadraticCurveTo(x-r*1.0,y-r*.95,x+tp+r*.1,y-r*1.7);X.quadraticCurveTo(x+r*1.0,y-r*.95,x+r*1.04,y+r*.15);X.quadraticCurveTo(x,y+r*.6,x-r*1.04,y+r*.15);X.closePath();X.fill();X.stroke();
  X.fillStyle='#0f0a18';X.beginPath();X.ellipse(x,y+r*.0,r*.66,r*.5,0,0,6.283);X.fill();
  eyes('#d8f6ff',r*.14,r*.19,'rgba(160,230,255,.25)');
  for(let i=0;i<2;i++){const q=t*2+i*Math.PI;X.fillStyle='rgba(200,180,240,.75)';X.beginPath();X.arc(x+Math.cos(q)*r*1.45,y+r*.2+Math.sin(q)*r*.55,Math.max(1.5,r*.13),0,6.283);X.fill()}}
 else if(k==2){
  X.save();X.translate(x,y+r*.1);X.rotate(a);X.fillStyle='#55524c';X.beginPath();X.roundRect(r*.35,-r*.19,r*1.1,r*.38,r*.08);X.fill();X.stroke();X.fillStyle='#d08a3c';X.beginPath();X.roundRect(r*1.2,-r*.26,r*.3,r*.52,r*.08);X.fill();X.stroke();X.restore();
  X.fillStyle=c;X.beginPath();X.ellipse(x,y,r*1.08,r*.98,0,0,6.283);X.fill();X.stroke();
  X.save();X.beginPath();X.ellipse(x,y,r*1.08-lw/2,r*.98-lw/2,0,0,6.283);X.clip();
  X.strokeStyle='#4a2c14';X.lineWidth=r*.36;X.beginPath();X.moveTo(x-r*1.1,y+r*.05);X.lineTo(x+r*.7,y+r*1.1);X.stroke();
  X.fillStyle='#e0b43e';for(const u of[.2,.5,.78])X.fillRect(x-r*1.1+u*r*1.8-r*.07,y+r*.05+u*r*1.05-r*.14,r*.14,r*.28);
  X.fillStyle='#6b4423';X.fillRect(x-r*1.2,y-r*1.2,r*2.4,r*.85);X.fillStyle='rgba(255,255,255,.12)';X.fillRect(x-r*1.2,y-r*1.2,r*2.4,r*.25);
  X.strokeStyle=O;X.lineWidth=lw;X.beginPath();X.moveTo(x-r*1.2,y-r*.35);X.lineTo(x+r*1.2,y-r*.35);X.stroke();X.restore();
  X.lineWidth=lw;X.strokeStyle=O;
  for(const s of[-1,1]){const gx=x+s*r*.42,gy=y+r*.02;X.fillStyle='#9fe3f0';X.beginPath();X.arc(gx,gy,r*.3,0,6.283);X.fill();X.stroke();X.fillStyle=O;X.beginPath();X.arc(gx+ca*r*.1,gy+sa*r*.1,r*.11,0,6.283);X.fill();X.fillStyle='#fff';X.beginPath();X.arc(gx-r*.1,gy-r*.1,Math.max(1,r*.06),0,6.283);X.fill()}}
 else{
  // POSIÇÃO E ANIMAÇÃO DO CAJADO DO NECROMANTE
  const sx = x - r * 1.15; // Posição horizontal do cajado, à esquerda do personagem.
  const pu = 1 + Math.sin(t * 5) * 0.18; // Faz a esfera verde do cajado pulsar suavemente.

  // bt é o tempo/progresso da animação da batida, recebido pela função body().
  // Primeira fase (0 a 0,25 s): o cajado desce.
  // Segunda fase (0,25 a 0,30 s): o cajado retorna à posição inicial.
  // Fora dessas fases, ly fica em 0 e o cajado não recebe deslocamento vertical.
  const ly = bt > 0
    ? (bt < 0.25
        ? -r * 1.1 * Math.sin((bt / 0.25) * 1.5708) // Descida rápida.
        : bt < 0.30
          ? -r * 1.1 * (1 - (bt - 0.25) / 0.05) // Retorno rápido.
          : 0)
    : 0;

  X.save(); // Guarda o estado atual do desenho antes de mover o cajado.
  X.translate(0, ly); // Aplica o deslocamento vertical da animação ao cajado.
  X.strokeStyle=O;X.lineWidth=lw+r*.1;X.beginPath();X.moveTo(sx,y+r*1.05);X.lineTo(sx,y-r*1.3);X.stroke();X.strokeStyle='#7a5530';X.lineWidth=r*.14;X.beginPath();X.moveTo(sx,y+r*1.05);X.lineTo(sx,y-r*1.3);X.stroke();X.lineWidth=lw;X.strokeStyle=O;
  X.fillStyle='rgba(182,255,122,.28)';X.beginPath();X.arc(sx,y-r*1.55,r*.62*pu,0,6.283);X.fill();X.fillStyle='#b6ff7a';X.beginPath();X.arc(sx,y-r*1.55,r*.3,0,6.283);X.fill();X.stroke();X.restore();
  X.fillStyle='#46663a';X.beginPath();X.moveTo(x-r,y);X.arc(x,y,r,Math.PI,6.283);X.lineTo(x+r*1.08,y+r*1.0);for(let i=0;i<4;i++){const x1=x+r*1.08-(i+1)*r*.54;X.lineTo(x1+r*.27,y+r*1.3+Math.sin(t*4+i)*r*.05);X.lineTo(x1,y+r*1.0)}X.closePath();X.fill();X.stroke();
  X.fillStyle=c;X.fillRect(x-r*.92,y+r*.6,r*1.84,r*.13);
  X.fillStyle='#e9e4d0';X.beginPath();X.arc(x,y+r*.66,r*.24,0,6.283);X.fill();X.stroke();X.fillStyle=O;for(const s of[-1,1]){X.beginPath();X.arc(x+s*r*.09,y+r*.64,Math.max(.8,r*.05),0,6.283);X.fill()}
  X.fillStyle='#243a22';X.beginPath();X.moveTo(x-r*1.02,y+r*.1);X.quadraticCurveTo(x-r*.9,y-r*1.1,x+r*.5,y-r*1.6);X.quadraticCurveTo(x+r*.45,y-r*1.0,x+r*1.02,y+r*.1);X.quadraticCurveTo(x,y+r*.55,x-r*1.02,y+r*.1);X.closePath();X.fill();X.stroke();
  X.fillStyle='#0f160e';X.beginPath();X.ellipse(x,y+r*.0,r*.62,r*.48,0,0,6.283);X.fill();
  eyes('#b6ff7a',r*.13,r*.18,'rgba(182,255,122,.25)')}
 X.restore()}

// Desenha o rosto de um inimigo: olhos, expressão e, se houver, coroa.
function face(e,c){const r=e.r,a=ang(e),k=r*.34,ey=e.y-r*.12,mad=e.s>0||(e.cd<.35&&e.cd>-.5);
 if(e.t=='sniper'&&e.s==1){X.strokeStyle='#8fbcc066';X.lineWidth=2;X.beginPath();X.moveTo(e.x,e.y);X.lineTo(e.x+Math.cos(e.a)*700,e.y+Math.sin(e.a)*700);X.stroke()}
 for(const s of[-1,1]){X.fillStyle='#fff';X.beginPath();X.ellipse(e.x+s*k,ey,r*.2,r*.24,0,0,6.283);X.fill();X.fillStyle='#10060c';X.beginPath();X.arc(e.x+s*k+Math.cos(a)*r*.09,ey+Math.sin(a)*r*.09,r*.1,0,6.283);X.fill();
  X.strokeStyle='#10060c';X.lineWidth=2;X.beginPath();X.moveTo(e.x+s*(k+r*.26),ey-r*.4);X.lineTo(e.x+s*(k-r*.22),ey-r*(mad?.14:.28));X.stroke()}
 X.fillStyle='#10060c';X.strokeStyle='#10060c';X.beginPath();if(mad||e.fl>0){X.ellipse(e.x,e.y+r*.45,r*.22,r*.17,0,0,6.283);X.fill()}else{X.arc(e.x,e.y+r*.62,r*.25,3.5,5.9);X.stroke()}
 if(e.el){poly(e.x,e.y-r-8,7,3,-1.57,'#d4a93a','#332b00');X.strokeStyle='#d4a93a66';X.lineWidth=2;X.beginPath();X.arc(e.x,e.y,r+6,0,6.283);X.stroke()}}

/*
 * DESENHO DAS BOMBAS
 * Desenha o corpo, a tampa, o pavio, a faísca e os efeitos de piscar antes da explosão.
 * Bombas especiais recebem a cor e a aura do herói.

   Bombas de herói (b.ib) ganham aura e faixa na cor do herói. */
function drawBomb(b){const ib=b.ib!=null,r=ib?13:11,u=1-Math.min(1,b.t/(ib?1:1.4)),f=Math.sin(b.t*20)>0,s=1+(f?.05+u*.06:0),c=ib?P.ch.c:'#c9462f',O='#1c130d';
 X.save();X.translate(b.x,b.y);
 X.fillStyle='#0006';X.beginPath();X.ellipse(0,r*.92,r,r*.36,0,0,6.283);X.fill();
 if(ib){X.globalAlpha=.14+.14*u;X.fillStyle=c;X.beginPath();X.arc(0,0,r*1.9,0,6.283);X.fill();X.globalAlpha=1}
 X.scale(s,s);X.lineJoin='round';X.lineCap='round';
 const lf=1-u*.7,tx=r*.7*lf,ty=-r*(1.3+.6*lf);
 X.beginPath();X.moveTo(0,-r*.8);X.quadraticCurveTo(r*.05,-r*1.4,tx,ty);X.strokeStyle=O;X.lineWidth=4.2;X.stroke();X.strokeStyle='#cdbd98';X.lineWidth=2;X.stroke();
 const g=X.createRadialGradient(-r*.38,-r*.42,r*.1,0,0,r*1.05);g.addColorStop(0,'#6a645a');g.addColorStop(.45,'#33302c');g.addColorStop(1,'#16120f');
 X.fillStyle=g;X.strokeStyle=O;X.lineWidth=2.6;X.beginPath();X.arc(0,0,r,0,6.283);X.fill();X.stroke();
 X.strokeStyle=ib?c:'#8a2f22';X.lineWidth=2.4;X.beginPath();X.arc(0,0,r*.62,.5,2.6);X.stroke();X.beginPath();X.arc(0,0,r*.62,3.64,5.74);X.stroke()
 if(f){X.globalAlpha=.5;X.fillStyle=c;X.beginPath();X.arc(0,0,r*.98,0,6.283);X.fill();X.globalAlpha=1}
 X.fillStyle='rgba(255,255,255,.38)';X.beginPath();X.ellipse(-r*.38,-r*.4,r*.24,r*.14,-.6,0,6.283);X.fill();
 X.fillStyle='#55505e';X.strokeStyle=O;X.lineWidth=2;X.beginPath();X.roundRect(-r*.34,-r*1.04,r*.68,r*.34,2);X.fill();X.stroke();
 const sp=(1.5+Math.abs(Math.sin(tm*45)))*(ib?1.2:1);
 X.save();X.translate(tx,ty);X.globalAlpha=.9;X.fillStyle='#ff8a3c';
 for(let i=0;i<6;i++){const a=i*1.047+tm*8,l=sp*(i%2?3.6:2.2);X.beginPath();X.moveTo(0,0);X.lineTo(Math.cos(a-.2)*sp*2,Math.sin(a-.2)*sp*2);X.lineTo(Math.cos(a)*l,Math.sin(a)*l);X.lineTo(Math.cos(a+.2)*sp*2,Math.sin(a+.2)*sp*2);X.closePath();X.fill()}
 X.globalAlpha=1;X.fillStyle='#ffe9a0';X.beginPath();X.arc(0,0,sp*1.3,0,6.283);X.fill();X.restore();
 X.restore()}

/*
 * EFEITOS VISUAIS DAS HABILIDADES ESPECIAIS
 * Abaixo ficam funções de desenho dos efeitos das habilidades (não controlam,
 * por si só, o intervalo entre os ataques).
 */

// Espectro: invisível durante a super; nos últimos 1,5s pisca cada vez mais rápido
function specAlpha(){if(!(P.ph>0))return 1;const lim=1.5;if(P.ph>lim)return .12;return Math.sin(tm*(18+(lim-P.ph)/lim*30))>0?.6:.12}

// Desenha um crânio verde usado para representar os orbes durante a super do Necromante.
function drawSkull(x,y,s){X.save();X.translate(x,y);X.scale(s,s);X.rotate(Math.sin(tm*4+x)*.2);X.fillStyle='rgba(182,255,122,'+(.18+.1*Math.sin(tm*8))+')';X.beginPath();X.arc(0,0,13,0,6.283);X.fill();
 X.lineJoin='round';X.lineWidth=2;X.strokeStyle='#1c130d';X.fillStyle='#e9e4d0';X.beginPath();X.roundRect(-4.5,3,9,6,1.5);X.fill();X.stroke();X.beginPath();X.arc(0,-1,8,0,6.283);X.fill();X.stroke();
 X.fillStyle='#10160e';for(const q of[-1,1]){X.beginPath();X.ellipse(q*3.2,-1.5,2.4,2.9,0,0,6.283);X.fill()}X.fillStyle='#b6ff7a';for(const q of[-1,1]){X.beginPath();X.arc(q*3.2,-1.2,1,0,6.283);X.fill()}
 X.fillStyle='#10160e';X.beginPath();X.moveTo(0,1.5);X.lineTo(-1.3,3.8);X.lineTo(1.3,3.8);X.closePath();X.fill();X.strokeStyle='#1c130d';X.lineWidth=1;X.beginPath();X.moveTo(-1.6,5.5);X.lineTo(-1.6,8.5);X.moveTo(1.6,5.5);X.lineTo(1.6,8.5);X.stroke();X.restore()}

// Desenha os orbes que giram ao redor do jogador; durante a super do Necromante, viram crânios.
function drawOrbs(){if(!P.orb)return;const nec=P.ch.k==3&&P.swt>0;for(let i=0;i<P.orb;i++){const a=P.oa+i*6.283/P.orb,x=P.x+Math.cos(a)*46,y=P.y+Math.sin(a)*46;
 if(nec){const e=Math.min(1,(P.swm-P.swt)/.3);drawSkull(x,y,e<1?e*1.3:1)}else poly(x,y,7,4,tm*3,'#cfc08a','#0a2a33')}}

// Desenha efeitos visuais: anéis de choque, brilho do escudo e armas do Artilheiro.
function drawAbilityFx(){
 if(P.vf)for(const f of P.vf){if(f.dl>0)continue;const p=1-f.t/f.m;
  if(f.k=='ring'){const R=f.in?f.R*(1-p):f.R*(.12+.88*Math.sin(p*1.5708));X.save();X.globalAlpha=Math.max(0,1-p);X.strokeStyle=f.c;X.lineWidth=Math.max(1,f.w*(1-p));X.beginPath();X.arc(P.x+(f.ox||0),P.y+(f.oy||0),R,0,6.283);X.stroke();X.globalAlpha=Math.max(0,1-p)*.14;X.fillStyle=f.c;X.fill();X.restore()}
  else if(f.k=='flash'){const d=(P.r+2)*1.6,cx=P.x+Math.cos(f.a)*d,cy=P.y+Math.sin(f.a)*d,s=(1-p)*32;X.save();X.globalAlpha=1-p;X.fillStyle='#fff';X.beginPath();for(let i=0;i<16;i++){const q=i*.3927+f.a,l=i%2?s*.45:s;X[i?'lineTo':'moveTo'](cx+Math.cos(q)*l,cy+Math.sin(q)*l)}X.closePath();X.fill();X.restore()}}
 if(P.gn>0){const sc=Math.min(1,(GUN_T-P.gn)/.2);X.save();X.globalAlpha=Math.min(1,P.gn/.2);X.lineJoin='round';
  for(let i=0;i<GUN_N;i++){const a=gunAng(i),d=14+26*sc;X.save();X.translate(P.x+Math.cos(a)*d,P.y+Math.sin(a)*d);X.rotate(a);X.scale(.4+.6*sc,.4+.6*sc);X.lineWidth=2;X.strokeStyle='#1c130d';
   X.fillStyle='#6b4423';X.beginPath();X.roundRect(-8,-3,7,10,2);X.fill();X.stroke();X.fillStyle='#55524c';X.beginPath();X.roundRect(-4,-4.5,20,9,2);X.fill();X.stroke();X.fillStyle='#d08a3c';X.beginPath();X.roundRect(12,-6,6,12,2);X.fill();X.stroke();
   if(P.gf>0){X.fillStyle='#ffe9a0';X.beginPath();X.arc(22,0,7,0,6.283);X.fill()}X.restore()}X.restore()}}