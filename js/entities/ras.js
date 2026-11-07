/* Chefe: Ladrão Fantasma (bt==5)
   Capa branca, duas espadas. Golpes:
   - arremesso de espadas (leque, mais salvas nas fases finais)
   - teletransporte para as costas do jogador + golpe corpo a corpo (escapa com DASH ou desviando de lado)
   - corrente: prende e puxa o jogador, depois golpeia (DASH solta/evita a corrente)
   - intangível por 0,5s, reage a tiros próximos; só pode repetir ~3s depois de terminar
   Estados em e.st: idle, tw (arremesso), to/ta (some/aparece atrás), sl (golpe), cw/cf/cr/pl/cs (corrente), rec */

const TH_LUNGE=900,TH_GHOST=.5,TH_GHOST_CD=3;
const angDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

// Posição atrás do jogador (lado oposto ao que ele está mirando/olhando), fora de pedras e dentro da sala
function thiefBehind(e){
 const fl0=hy(P.fx,P.fy)||1,base=Math.atan2(-P.fy/fl0,-P.fx/fl0);
 for(const off of[0,.6,-.6,1.2,-1.2,1.9,-1.9,3.14]){
  const an=base+off,x=cl(P.x+Math.cos(an)*54,L+e.r,RT-e.r),y=cl(P.y+Math.sin(an)*54,U+e.r,BT-e.r);
  if(!rockAt(x,y)&&hy(x-P.x,y-P.y)>34)return{x,y}}
 return{x:cl(P.x+Math.cos(base)*54,L+e.r,RT-e.r),y:cl(P.y+Math.sin(base)*54,U+e.r,BT-e.r)}}

function thiefAI(e,dt,a,d){
 const ph=e.hp/e.mhp>.66?0:e.hp/e.mhp>.33?1:2;
 if(!e.th){e.th=1;e.st='idle';e.tt=0;e.r=24;e.hp=e.mhp=e.mhp*.85;e.fa=a;e.al=1;e.gh=0;e.gcd=2;e.lm=-1;e.sd=1;e.sdt=2.5;e.cd=1}

 // ---- intangível: 0,5s; reage a tiros do jogador perto; recarga de 3s depois que termina ----
 if(e.gh>0)e.gh-=dt;
 e.gcd-=dt;if(e.kk>0)e.kk-=dt;
 if(e.gcd<=0&&e.gh<=0&&e.st!='to'&&e.st!='ta'){
  let near=false;for(const b of bul)if(!b.h&&hy(b.x-e.x,b.y-e.y)<e.r+50){near=true;break}
  if(near){e.gh=TH_GHOST;e.gcd=TH_GHOST+TH_GHOST_CD;parts(e.x,e.y,'#cfd8ff',16,200);sfx(720,.18,.04,'sine')}}

 // vira para o jogador (menos nos golpes/corrente já travados)
 if(!(e.st=='sl'||e.st=='cf'||e.st=='cr'))e.fa+=angDiff(a,e.fa)*Math.min(1,dt*(e.st=='idle'?6:14));

 e.tt-=dt;e.al=1;
 const T=(s,t)=>{e.st=s;e.tt=t},rec=c=>{T('rec',.4);e.cd=c-ph*.2};

 switch(e.st){
 case 'idle':{
  e.sdt-=dt;if(e.sdt<=0){e.sd=-e.sd;e.sdt=rnd(1.6,3)}
  const rad=cl((d-240)/90,-1,1),sp=e.sp*1.6;
  e.x+=(Math.cos(a)*rad*.9+Math.cos(a+1.5708*e.sd)*.75)*sp*dt;
  e.y+=(Math.sin(a)*rad*.9+Math.sin(a+1.5708*e.sd)*.75)*sp*dt;
  if(e.cd<=0){
   let o=d<140?[1,1,0,2]:d>380?[2,2,0,1]:[0,1,2];o=o.filter(m=>m!=e.lm);
   const m=pick(o.length?o:[0,1,2]);e.lm=m;
   if(m==0){T('tw',.42-ph*.06);e.vol=0}else if(m==1){T('to',.22)}else T('cw',.5-ph*.07)}
  break}

 // ---- arremesso de espadas ----
 case 'tw':
  if(e.tt<=0){
   const n=2+ph,sp=(330+ph*25)*(1+.08*(fl-1));
   for(let i=0;i<n;i++){const an=e.fa+(i-(n-1)/2)*.17;
    bul.push({x:e.x+Math.cos(e.fa)*e.r,y:e.y+Math.sin(e.fa)*e.r,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,r:7,h:1,l:3.2,c:'#e8eef5',sw:1})}
   sfx(620,.08,.05,'triangle');e.kk=.14;e.vol++;
   if(e.vol<1+ph)e.tt=.3;else rec(1.5)}
  break;

 // ---- teletransporte para as costas + golpe ----
 case 'to':
  e.al=Math.max(0,e.tt/.22);
  if(e.tt<=0){
   parts(e.x,e.y,'#f2f4fa',18,220);
   const p=thiefBehind(e);e.x=p.x;e.y=p.y;
   parts(e.x,e.y,'#f2f4fa',18,220);
   e.fa=Math.atan2(P.y-e.y,P.x-e.x);T('ta',.5-ph*.07);sfx(480,.12,.05,'sawtooth')}
  break;
 case 'ta':
  e.al=Math.min(1,((.5-ph*.07)-e.tt)/.14);
  if(e.tt<=0){e.la=a;e.hd=0;T('sl',.26);sfx(300,.12,.07,'sawtooth')}
  break;
 case 'sl':{
  const dd=()=>hy(P.x-e.x,P.y-e.y);
  if(e.tt>.05&&dd()>e.r+P.r+4){e.x+=Math.cos(e.la)*TH_LUNGE*dt;e.y+=Math.sin(e.la)*TH_LUNGE*dt}
  if(!e.hd&&dd()<e.r+P.r+34){e.hd=1;hit(1);parts(P.x,P.y,'#fff',8,200);sfx(200,.1,.06,'sawtooth')}
  if(e.tt<=0)rec(1.3);
  break}

 // ---- corrente ----
 case 'cw':
  if(e.tt<=0){
   e.ca=e.fa;e.hk={x:e.x+Math.cos(e.ca)*e.r,y:e.y+Math.sin(e.ca)*e.r};e.hl=0;T('cf',1.5);sfx(400,.15,.05,'square')}
  break;
 case 'cf':{
  const s=640*dt;e.hk.x+=Math.cos(e.ca)*s;e.hk.y+=Math.sin(e.ca)*s;e.hl+=s;
  if(hy(e.hk.x-P.x,e.hk.y-P.y)<P.r+10&&!(P.dash>0||P.inv>0||P.ph>0)){
   T('pl',.9);sfx(160,.2,.07,'sawtooth');shake=Math.max(shake,6);parts(P.x,P.y,'#cfd8ff',10,160);break}
  if(e.hl>520||e.hk.x<L||e.hk.x>RT||e.hk.y<U||e.hk.y>BT||rockAt(e.hk.x,e.hk.y))T('cr',.22);
  break}
 case 'cr':
  e.hk.x+=(e.x-e.hk.x)*Math.min(1,dt*14);e.hk.y+=(e.y-e.hk.y)*Math.min(1,dt*14);
  if(e.tt<=0){e.hk=null;rec(1.4)}
  break;
 case 'pl':{
  if(P.dash>0){parts(P.x,P.y,'#fff',10,200);T('cr',.2);break}   // dash solta a corrente
  const dx=e.x-P.x,dy=e.y-P.y,dist=hy(dx,dy)||1,stop=e.r+P.r+10;
  e.hk.x=P.x;e.hk.y=P.y;
  if(dist>stop&&e.tt>0){
   const stp=Math.min(dist-stop,800*dt);
   P.x=cl(P.x+dx/dist*stp,L+P.r,RT-P.r);P.y=cl(P.y+dy/dist*stp,U+P.r,BT-P.r);P.vx=P.vy=0}
  else{e.hk=null;T('cs',.3-ph*.04);sfx(260,.12,.05,'sawtooth')}
  break}
 case 'cs':
  if(e.tt<=0){e.la=a;e.hd=0;T('sl',.26);sfx(300,.12,.07,'sawtooth')}
  break;

 case 'rec':
  if(e.tt<=0)T('idle',0);
  break;
 default:T('idle',0)}
}

/* ===== Desenho do Ladrão ===== */
function drawThief(e,c){
 const r=e.r,fa=e.fa==null?ang(e):e.fa,st=e.st||'idle',x=e.x,y=e.y,fh=c=='#fff',ghost=e.gh>0,a2=Math.atan2(P.y-y,P.x-x);
 let al=e.al==null?1:e.al;if(ghost)al*=.3+.1*Math.sin(tm*40);
 const O='#1c130d';

 // avisos e corrente (por baixo do corpo)
 X.save();X.lineCap='round';X.lineJoin='round';
 if(st=='ta'){const p=Math.max(0,Math.min(1,1-e.tt/.5));X.strokeStyle='rgba(255,90,90,'+(.25+.4*p)+')';X.lineWidth=10;X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.cos(a2)*210,y+Math.sin(a2)*210);X.stroke()}
 if(st=='cs'){X.strokeStyle='rgba(255,90,90,.55)';X.lineWidth=10;X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.cos(a2)*210,y+Math.sin(a2)*210);X.stroke()}
 if(st=='tw'||st=='cw'){X.strokeStyle='rgba(255,255,255,.28)';X.lineWidth=2;X.setLineDash([6,8]);X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.cos(a2)*520,y+Math.sin(a2)*520);X.stroke();X.setLineDash([])}
 if((st=='cf'||st=='cr'||st=='pl')&&e.hk){
  const dx=e.hk.x-x,dy=e.hk.y-y,L2=hy(dx,dy),an=Math.atan2(dy,dx),n=Math.max(1,Math.floor(L2/13));
  for(let i=1;i<=n;i++){const t=i/n;X.save();X.translate(x+dx*t,y+dy*t);X.rotate(an+(i%2?0:1.5708));X.fillStyle='#cdd5e0';X.strokeStyle=O;X.lineWidth=2;X.beginPath();X.ellipse(0,0,6,3.4,0,0,6.283);X.fill();X.stroke();X.restore()}
  X.save();X.translate(e.hk.x,e.hk.y);X.rotate(an);X.fillStyle='#e8eef5';X.strokeStyle=O;X.lineWidth=2.5;X.beginPath();X.moveTo(-4,-7);X.lineTo(12,0);X.lineTo(-4,7);X.lineTo(0,0);X.closePath();X.fill();X.stroke();X.restore()}
 // arco do golpe
 if(st=='sl'){const p=Math.max(0,Math.min(1,1-e.tt/.26));X.strokeStyle='rgba(255,255,255,'+(.9*(1-p))+')';X.lineWidth=3+10*(1-p);X.beginPath();X.arc(x,y,r*2.1,e.la-1.1,e.la+1.1);X.stroke()}
 X.restore();

 X.save();X.globalAlpha=al;X.lineJoin='round';X.lineCap='round';X.lineWidth=3;X.strokeStyle=O;
 const W1=fh?'#fff':'#f2f4fa',W2=fh?'#fff':'#c3cadb';

 // capa (cauda para trás)
 const b=fa+Math.PI,fw=Math.sin(tm*6)*r*.14,
  s1x=x+Math.cos(fa+1.57)*r*.8,s1y=y+Math.sin(fa+1.57)*r*.8,s2x=x+Math.cos(fa-1.57)*r*.8,s2y=y+Math.sin(fa-1.57)*r*.8,
  hLx=x+Math.cos(b+.8)*r*2.1,hLy=y+Math.sin(b+.8)*r*2.1,hRx=x+Math.cos(b-.8)*r*2.1,hRy=y+Math.sin(b-.8)*r*2.1,
  tx=x+Math.cos(b)*r*2.4+Math.cos(b+1.57)*fw,ty=y+Math.sin(b)*r*2.4+Math.sin(b+1.57)*fw;
 X.fillStyle=W1;X.beginPath();X.moveTo(s1x,s1y);X.quadraticCurveTo(hLx,hLy,tx,ty);X.quadraticCurveTo(hRx,hRy,s2x,s2y);X.closePath();X.fill();X.stroke();
 X.strokeStyle=W2;X.lineWidth=2;for(const q of[-.4,0,.4]){X.beginPath();X.moveTo(x+Math.cos(b+q*.5)*r*.8,y+Math.sin(b+q*.5)*r*.8);X.lineTo(x+Math.cos(b+q)*r*1.9+Math.cos(b+1.57)*fw*.5,y+Math.sin(b+q)*r*1.9+Math.sin(b+1.57)*fw*.5);X.stroke()}
 X.strokeStyle=O;X.lineWidth=3;

 // ombros / túnica / capuz
 X.fillStyle=W1;X.beginPath();X.arc(x,y,r*.95,0,6.283);X.fill();X.stroke();
 X.fillStyle=fh?'#fff':'#2d3144';X.beginPath();X.ellipse(x+Math.cos(fa)*r*.3,y+Math.sin(fa)*r*.3+r*.25,r*.52,r*.58,0,0,6.283);X.fill();X.stroke();
 const hx=x,hy2=y-r*.3;
 X.fillStyle=W1;X.beginPath();X.arc(hx,hy2,r*.74,0,6.283);X.fill();X.stroke();
 const fx=hx+Math.cos(fa)*r*.16,fy=hy2+Math.sin(fa)*r*.12;
 X.fillStyle='#0d0e15';X.beginPath();X.ellipse(fx,fy,r*.44,r*.38,0,0,6.283);X.fill();
 const eg=st=='ta'||st=='cs'||st=='sl'||st=='tw'||st=='cw';
 for(const s of[-1,1]){const ex=fx+s*r*.19,ey=fy-r*.02;X.fillStyle=eg?'rgba(255,70,70,.35)':'rgba(255,110,110,.2)';X.beginPath();X.arc(ex,ey,r*.17,0,6.283);X.fill();X.fillStyle=eg?'#ff4d4d':'#ff8a8a';X.beginPath();X.ellipse(ex,ey,r*.08,r*.1,0,0,6.283);X.fill()}

 // espadas
 const bf=st=='sl'?e.la:fa,p=st=='sl'?Math.max(0,Math.min(1,1-e.tt/.26)):0;
 const sword=(hx2,hy3,an,len,glow)=>{X.save();X.translate(hx2,hy3);X.rotate(an);X.lineWidth=2.5;X.strokeStyle=O;
  X.fillStyle='#4a2f1c';X.beginPath();X.roundRect(-r*.4,-r*.07,r*.44,r*.14,2);X.fill();X.stroke();
  X.fillStyle='#c9a13a';X.beginPath();X.roundRect(r*.02,-r*.25,r*.13,r*.5,2);X.fill();X.stroke();
  X.fillStyle=glow||fh?'#ffffff':'#dfe6ee';X.beginPath();X.moveTo(r*.15,-r*.12);X.lineTo(r*.15+len,-r*.07);X.lineTo(r*.15+len+r*.32,0);X.lineTo(r*.15+len,r*.07);X.lineTo(r*.15,r*.12);X.closePath();X.fill();X.stroke();
  X.strokeStyle='#9aa6b8';X.lineWidth=1.2;X.beginPath();X.moveTo(r*.22,0);X.lineTo(r*.15+len,0);X.stroke();
  if(glow){X.globalAlpha=al*.35;X.fillStyle='#cfd8ff';X.beginPath();X.ellipse(r*.15+len*.5,0,len*.6,r*.2,0,0,6.283);X.fill()}X.restore()};
 for(const s of[-1,1]){
  let off=.95+Math.sin(tm*5+s)*.06,glow=false;
  if(st=='tw'){off=e.tt<.15?.12:.22;glow=true}
  else if(e.kk>0)off=.5;
  else if(st=='ta'||st=='cs'||st=='to'||st=='cw'){off=.45;glow=st!='to'}
  else if(st=='sl')off=1.5-3*p;
  const an=bf+s*off,hxx=x+Math.cos(bf+s*1.5)*r*.95,hyy=y+Math.sin(bf+s*1.5)*r*.95;
  sword(hxx,hyy,an,r*1.55,glow)}

 // anel de intangibilidade
 if(ghost){X.globalAlpha=.7;X.strokeStyle='#cfd8ff';X.lineWidth=2;X.setLineDash([5,6]);X.beginPath();X.arc(x,y,r+9+Math.sin(tm*20)*2,tm*4,tm*4+6.283);X.stroke();X.setLineDash([])}
 X.restore()}

// Espada arremessada (projétil inimigo com b.sw)
function drawSwordProj(b){
 const an=Math.atan2(b.vy,b.vx);X.save();X.translate(b.x,b.y);X.rotate(an);X.lineJoin='round';
 X.globalAlpha=.25;X.fillStyle='#cfd8ff';X.beginPath();X.ellipse(-12,0,18,4,0,0,6.283);X.fill();X.globalAlpha=1;
 X.lineWidth=2;X.strokeStyle='#1c130d';
 X.fillStyle='#4a2f1c';X.beginPath();X.roundRect(-14,-2,9,4,1.5);X.fill();X.stroke();
 X.fillStyle='#c9a13a';X.beginPath();X.roundRect(-6,-6,4,12,1.5);X.fill();X.stroke();
 X.fillStyle='#e8eef5';X.beginPath();X.moveTo(-2,-3);X.lineTo(15,-2.5);X.lineTo(25,0);X.lineTo(15,2.5);X.lineTo(-2,3);X.closePath();X.fill();X.stroke();
 X.restore()}