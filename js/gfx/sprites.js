/* Desenho dos heróis e dos rostos dos inimigos */
function body(h,x,y,r,a,w,t){const c=h.c,sn=Math.sin(t*12),bl=Math.sin(t*1.9)>.96,k=h.k,ca=Math.cos(a),sa=Math.sin(a),O='#1c130d',lw=Math.max(2,r*.17),R=r-lw/2;
 X.save();X.lineJoin='round';X.lineCap='round';X.lineWidth=lw;X.strokeStyle=O;
 X.fillStyle='#0005';X.beginPath();X.ellipse(x,y+r+3,r*.9,r*.3,0,0,6.283);X.fill();
 if(k!=1){X.fillStyle=['#6f6a60','','#4a2e16','#2a3a22'][k];for(const s of[-1,1]){X.beginPath();X.ellipse(x+s*r*.5,y+r*.8+sn*s*w*3,r*.3,r*.2,0,0,6.283);X.fill();X.stroke()}}
 y-=k==1?2+Math.sin(t*3)*r*.12:Math.abs(sn)*w*3;
 const eyes=(col,rx,ry,gl)=>{for(const s of[-1,1]){const ex=x+s*r*.36+ca*r*.1,ey=y-r*.08+sa*r*.1;if(gl){X.fillStyle=gl;X.beginPath();X.arc(ex,ey,rx*2.1,0,6.283);X.fill()}if(bl){X.strokeStyle=col;X.lineWidth=2;X.beginPath();X.moveTo(ex-rx,ey);X.lineTo(ex+rx,ey);X.stroke();X.strokeStyle=O;X.lineWidth=lw}else{X.fillStyle=col;X.beginPath();X.ellipse(ex,ey,rx,ry,0,0,6.283);X.fill()}}};
 if(k==0){
  X.fillStyle=c;X.beginPath();X.arc(x,y,r,0,6.283);X.fill();X.stroke();
  X.fillStyle='rgba(0,0,0,.2)';X.beginPath();X.arc(x,y,R,.2,2.94);X.closePath();X.fill();
  const sw=x+r*1.12;X.fillStyle='#dfe6e8';X.beginPath();X.roundRect(sw-r*.1,y-r*1.4,r*.2,r*1.8,r*.06);X.fill();X.stroke();X.fillStyle='#c9a13a';X.beginPath();X.roundRect(sw-r*.3,y+r*.28,r*.6,r*.15,r*.04);X.fill();X.stroke();
  const sx=x-r*1.02,sy=y+r*.15;X.fillStyle='#8c969b';X.beginPath();X.moveTo(sx-r*.46,sy-r*.5);X.lineTo(sx+r*.46,sy-r*.5);X.lineTo(sx+r*.46,sy+r*.15);X.quadraticCurveTo(sx+r*.4,sy+r*.75,sx,sy+r*.95);X.quadraticCurveTo(sx-r*.4,sy+r*.75,sx-r*.46,sy+r*.15);X.closePath();X.fill();X.stroke();X.fillStyle='#c9a13a';X.fillRect(sx-r*.07,sy-r*.36,r*.14,r*.95);X.fillRect(sx-r*.3,sy-r*.06,r*.6,r*.14);
  X.fillStyle='#9aa3a8';X.beginPath();X.arc(x,y,R,Math.PI,6.283);X.closePath();X.fill();X.stroke();
  X.fillStyle=O;X.fillRect(x-r*.86,y-r*.3,r*1.72,r*.36);X.fillStyle='#9aa3a8';X.fillRect(x-r*.07,y-r*.3,r*.14,r*.36);
  const sw2=Math.sin(t*4)*r*.12;X.fillStyle='#b5342f';X.beginPath();X.moveTo(x-r*.18,y-r*.95);X.quadraticCurveTo(x-r*.5+sw2,y-r*1.75,x+r*.55+sw2,y-r*1.4);X.quadraticCurveTo(x+r*.15,y-r*1.2,x+r*.2,y-r*.95);X.closePath();X.fill();X.stroke();
  eyes('#ffe9a0',r*.12,r*.09,'rgba(255,233,160,.22)')}
 else if(k==1){
  const wv=i=>Math.sin(t*5+i*1.7)*r*.12;
  X.globalAlpha=.94;X.fillStyle=c;X.beginPath();X.moveTo(x-r,y);X.arc(x,y,r,Math.PI,6.283);X.lineTo(x+r,y+r*.95);for(let i=0;i<4;i++){const x1=x+r-(i+1)*r*.5;X.quadraticCurveTo(x1+r*.25,y+r*1.4+wv(i),x1,y+r*.95)}X.closePath();X.fill();X.stroke();X.globalAlpha=1;
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
  const sx=x-r*1.15,pu=1+Math.sin(t*5)*.18;
  X.strokeStyle=O;X.lineWidth=lw+r*.1;X.beginPath();X.moveTo(sx,y+r*1.05);X.lineTo(sx,y-r*1.3);X.stroke();X.strokeStyle='#7a5530';X.lineWidth=r*.14;X.beginPath();X.moveTo(sx,y+r*1.05);X.lineTo(sx,y-r*1.3);X.stroke();X.lineWidth=lw;X.strokeStyle=O;
  X.fillStyle='rgba(182,255,122,.28)';X.beginPath();X.arc(sx,y-r*1.55,r*.62*pu,0,6.283);X.fill();X.fillStyle='#b6ff7a';X.beginPath();X.arc(sx,y-r*1.55,r*.3,0,6.283);X.fill();X.stroke();
  X.fillStyle='#46663a';X.beginPath();X.moveTo(x-r,y);X.arc(x,y,r,Math.PI,6.283);X.lineTo(x+r*1.08,y+r*1.0);for(let i=0;i<4;i++){const x1=x+r*1.08-(i+1)*r*.54;X.lineTo(x1+r*.27,y+r*1.3+Math.sin(t*4+i)*r*.05);X.lineTo(x1,y+r*1.0)}X.closePath();X.fill();X.stroke();
  X.fillStyle=c;X.fillRect(x-r*.92,y+r*.6,r*1.84,r*.13);
  X.fillStyle='#e9e4d0';X.beginPath();X.arc(x,y+r*.66,r*.24,0,6.283);X.fill();X.stroke();X.fillStyle=O;for(const s of[-1,1]){X.beginPath();X.arc(x+s*r*.09,y+r*.64,Math.max(.8,r*.05),0,6.283);X.fill()}
  X.fillStyle='#243a22';X.beginPath();X.moveTo(x-r*1.02,y+r*.1);X.quadraticCurveTo(x-r*.9,y-r*1.1,x+r*.5,y-r*1.6);X.quadraticCurveTo(x+r*.45,y-r*1.0,x+r*1.02,y+r*.1);X.quadraticCurveTo(x,y+r*.55,x-r*1.02,y+r*.1);X.closePath();X.fill();X.stroke();
  X.fillStyle='#0f160e';X.beginPath();X.ellipse(x,y+r*.0,r*.62,r*.48,0,0,6.283);X.fill();
  eyes('#b6ff7a',r*.13,r*.18,'rgba(182,255,122,.25)')}
 X.restore()}

function face(e,c){const r=e.r,a=ang(e),k=r*.34,ey=e.y-r*.12,mad=e.s>0||(e.cd<.35&&e.cd>-.5);
 if(e.t=='sniper'&&e.s==1){X.strokeStyle='#8fbcc066';X.lineWidth=2;X.beginPath();X.moveTo(e.x,e.y);X.lineTo(e.x+Math.cos(e.a)*700,e.y+Math.sin(e.a)*700);X.stroke()}
 for(const s of[-1,1]){X.fillStyle='#fff';X.beginPath();X.ellipse(e.x+s*k,ey,r*.2,r*.24,0,0,6.283);X.fill();X.fillStyle='#10060c';X.beginPath();X.arc(e.x+s*k+Math.cos(a)*r*.09,ey+Math.sin(a)*r*.09,r*.1,0,6.283);X.fill();
  X.strokeStyle='#10060c';X.lineWidth=2;X.beginPath();X.moveTo(e.x+s*(k+r*.26),ey-r*.4);X.lineTo(e.x+s*(k-r*.22),ey-r*(mad?.14:.28));X.stroke()}
 X.fillStyle='#10060c';X.strokeStyle='#10060c';X.beginPath();if(mad||e.fl>0){X.ellipse(e.x,e.y+r*.45,r*.22,r*.17,0,0,6.283);X.fill()}else{X.arc(e.x,e.y+r*.62,r*.25,3.5,5.9);X.stroke()}
 if(e.el){poly(e.x,e.y-r-8,7,3,-1.57,'#d4a93a','#332b00');X.strokeStyle='#d4a93a66';X.lineWidth=2;X.beginPath();X.arc(e.x,e.y,r+6,0,6.283);X.stroke()}}

/* Bomba colocada no chão: corpo esférico, tampa, estopim que encurta e faísca; pisca antes de explodir.
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
