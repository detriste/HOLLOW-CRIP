/* ============================================================
   INIMIGOS NOVOS
   ------------------------------------------------------------
   seal   = Bruxo do Selo  : cria círculos mágicos que enfraquecem
                             o jogador (sem habilidade, dano menor)
   bomber = Bombardeiro    : invoca uma bomba gigante
   frost  = Sopro Glacial  : sopra um bafo de gelo enorme (cone)
   rep    = Reflexo        : se multiplica quando morre por tiro ou
                             habilidade. Só morre com explosão de bomba
   ============================================================ */

let mc=[];   // círculos mágicos no chão
let ebb=[];  // bombas gigantes invocadas por inimigos
let fb=[];   // sopros de gelo ativos

const REP_MAX=10;        // máximo de Reflexos vivos ao mesmo tempo
const SEAL_R=92;         // raio do círculo mágico
const SEAL_TELE=1.0;     // tempo de aviso antes de ativar
const SEAL_LIFE=5.5;     // tempo ativo
const SEAL_LINGER=.9;    // efeito continua após sair do círculo
const BOMB_R=170;        // raio da bomba gigante
const BOMB_FUSE=2.4;
const FROST_R=470;       // alcance do bafo
const FROST_HALF=.56;    // meio-ângulo do cone (~64° no total)
const FROST_TELE=1.0;
const FROST_DUR=1.4;

const adiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

function novoClear(){
  mc=[];ebb=[];fb=[];
  if(typeof P!=='undefined'&&P){P.weak=0;P.chill=0}
}

/* ---------- IA ---------- */

function novoAI(e,dt,a,d){
  if(e.t=='seal')sealAI(e,dt,a,d);
  else if(e.t=='bomber')bomberAI(e,dt,a,d);
  else if(e.t=='frost')frostAI(e,dt,a,d);
  else if(e.t=='rep')repAI(e,dt,a,d);
}

function sealAI(e,dt,a,d){
  const k=d>300?1:d<210?-1:0;
  e.x+=(Math.cos(a)*k+Math.cos(a+1.57)*.5)*e.sp*dt;
  e.y+=(Math.sin(a)*k+Math.sin(a+1.57)*.5)*e.sp*dt;
  e.a+=dt*2;
  if(e.cd<=0){
    e.cd=4.2-Math.min(1,(fl-1)*.3);
    const n=fl>2?2:1;
    for(let i=0;i<n;i++){
      const px=i?P.x+rnd(-170,170):P.x+P.vx*.25;
      const py=i?P.y+rnd(-120,120):P.y+P.vy*.25;
      mc.push({x:cl(px,L+SEAL_R*.5,RT-SEAL_R*.5),y:cl(py,U+SEAL_R*.5,BT-SEAL_R*.5),r:SEAL_R,t:SEAL_TELE,d:SEAL_TELE,f:0,o:e});
    }
    parts(e.x,e.y,'#9a6ad0',14,200);
    sfx(240,.25,.05,'sine');
  }
}

function bomberAI(e,dt,a,d){
  const k=d>320?1:d<240?-1:0;
  e.x+=(Math.cos(a)*k+Math.cos(a-1.57)*.4)*e.sp*dt;
  e.y+=(Math.sin(a)*k+Math.sin(a-1.57)*.4)*e.sp*dt;
  if(e.cd<=0&&ebb.length<2){
    e.cd=5-Math.min(1.2,(fl-1)*.5);
    const px=cl(P.x+P.vx*.3,L+BOMB_R*.4,RT-BOMB_R*.4);
    const py=cl(P.y+P.vy*.3,U+BOMB_R*.4,BT-BOMB_R*.4);
    ebb.push({x:px,y:py,t:BOMB_FUSE,m:BOMB_FUSE,R:BOMB_R});
    parts(e.x,e.y,'#d08a3c',16,220);
    sfx(150,.3,.06,'square');
  }else if(e.cd<=0)e.cd=.6;
}

function frostAI(e,dt,a,d){
  if(e.s==1)return; // parado enquanto sopra
  const k=d>250?1:d<150?-.6:0;
  e.x+=Math.cos(a)*k*e.sp*dt;
  e.y+=Math.sin(a)*k*e.sp*dt;
  if(e.cd<=0&&d<FROST_R-40){
    e.s=1;
    e.cd=99;
    fb.push({o:e,a:a,t:FROST_TELE,d:FROST_TELE,f:0,dur:FROST_DUR,hitP:0,sw:Math.random()<.5?-1:1});
    sfx(300,.4,.05,'sine');
  }
}

function repAI(e,dt,a,d){
  e.z=(e.z||0)+dt*3;
  e.x+=(Math.cos(a)+Math.cos(a+1.57)*Math.sin(e.z)*.6)*e.sp*dt;
  e.y+=(Math.sin(a)+Math.sin(a+1.57)*Math.sin(e.z)*.6)*e.sp*dt;
  if(e.cd<=0){
    e.cd=rnd(2.2,3.2);
    eb(e.x,e.y,a,200,'#c9b0e8');
  }
}

/* Chamado quando um Reflexo chega a 0 de vida sem ser atingido por bomba.
   Ele renasce e se divide em outro. */
function repSplit(e){
  const vivos=en.filter(o=>o.t=='rep').length; // conta todos, inclusive os que morreram no mesmo quadro
  e.hp=e.mhp*.7;
  e.w=.4;
  e.vx=e.vy=0;
  parts(e.x,e.y,'#c9b0e8',18,230);
  sfx(520,.15,.04,'triangle');
  if(vivos<REP_MAX){
    const c=mk('rep',e.x+rnd(-20,20),e.y+rnd(-20,20));
    c.gen=(e.gen||0)+1;
    c.w=.5;
    c.hp=c.mhp=e.mhp;
    c.r=e.r;
    en.push(c);
  }
  if(!room.repHint){
    room.repHint=1;
    ban={t:3.2,s:'Os Reflexos se multiplicam! Só uma bomba os destrói'};
  }
}

/* ---------- ATUALIZAÇÃO ---------- */

function novoUpdate(dt){
  if(P.weak>0)P.weak-=dt;
  if(P.chill>0)P.chill-=dt;

  // Círculos mágicos
  for(let i=mc.length-1;i>=0;i--){
    const c=mc[i];
    c.t-=dt;
    if(!c.f){
      if(c.t<=0){
        c.f=1;c.t=SEAL_LIFE;
        parts(c.x,c.y,'#b06aff',20,240);
        sfx(110,.3,.06,'sine');
        shake=Math.max(shake,4);
      }
    }else{
      if(Math.random()<.5)pt.push({x:c.x+rnd(-c.r,c.r)*.8,y:c.y+rnd(-c.r,c.r)*.8,vx:0,vy:-40,l:.6,m:.6,c:'#b06aff',r:2.5});
      if(hy(P.x-c.x,P.y-c.y)<c.r+P.r*.4){
        if(!(P.weak>0)){
          ban={t:1.6,s:'Enfraquecido! Sem habilidade enquanto estiver no selo'};
          sfx(100,.25,.06,'sine');
          parts(P.x,P.y,'#b06aff',10,160);
        }
        P.weak=SEAL_LINGER;
      }
      if(c.t<=0)mc.splice(i,1);
    }
  }

  // Bombas gigantes
  for(let i=ebb.length-1;i>=0;i--){
    const b=ebb[i];
    b.t-=dt;
    if(b.t<=0){
      ebb.splice(i,1);
      bigBoom(b);
    }
  }

  // Sopros de gelo
  for(let i=fb.length-1;i>=0;i--){
    const f=fb[i],o=f.o;
    if(!en.includes(o)||o.hp<=0){
      if(o)o.s=0;
      fb.splice(i,1);continue;
    }
    f.t-=dt;
    if(!f.f){
      // mira acompanha o jogador até o último momento
      if(f.t>.3)f.a+=adiff(Math.atan2(P.y-o.y,P.x-o.x),f.a)*Math.min(1,dt*6);
      if(f.t<=0){
        f.f=1;f.t=f.dur;
        shake=Math.max(shake,8);
        sfx(180,.8,.07,'sawtooth');
      }
    }else{
      const prog=1-f.t/f.dur,ang0=f.a+f.sw*(prog-.5)*.5;
      f.cur=ang0;
      for(let n=0;n<3;n++){
        const aa=ang0+rnd(-FROST_HALF,FROST_HALF),rr=rnd(40,FROST_R);
        pt.push({x:o.x+Math.cos(aa)*rr,y:o.y+Math.sin(aa)*rr,vx:Math.cos(aa)*60,vy:Math.sin(aa)*60,l:.5,m:.5,c:Math.random()<.5?'#e4f6ff':'#8fd4e8',r:rnd(2,4)});
      }
      const dx=P.x-o.x,dy=P.y-o.y,dd=hy(dx,dy)||1;
      const inside=dd<FROST_R+P.r&&Math.abs(adiff(Math.atan2(dy,dx),ang0))<FROST_HALF+P.r/dd;
      if(inside&&!(P.ph>0)){
        P.chill=Math.max(P.chill||0,2.4);
        if(!f.hitP){
          f.hitP=1;
          hit(1);
        }
      }
      if(f.t<=0){
        o.s=0;
        o.cd=4.5;
        fb.splice(i,1);
      }
    }
  }

  // Segurança: se há Reflexos e o jogador não tem como destruí-los, cai uma bomba
  if(!(P.s&&P.s.ibomb)&&P.bombs<=0&&!ebb.length){
    novoBombCheck=(typeof novoBombCheck=='number'?novoBombCheck:0)+dt;
    if(novoBombCheck>3){
      novoBombCheck=0;
      if(en.some(e=>e.t=='rep'&&e.hp>0)&&!en.some(e=>e.t=='bomber')&&!pk.some(q=>q.t=='b')){
        pk.push({t:'b',x:480,y:300,pr:0});
        ban={t:2.5,s:'Uma bomba apareceu no centro da sala'};
      }
    }
  }
}
let novoBombCheck=0;

function bigBoom(b){
  const R=b.R;
  shake=24;
  parts(b.x,b.y,'#ffb84a',60,520);
  parts(b.x,b.y,'#d9623f',40,380);
  sfx(60,.6,.1,'sawtooth');
  sfx(120,.4,.08,'square');
  for(const e of en){
    if(hy(e.x-b.x,e.y-b.y)<R+e.r){
      if(e.t=='rep'){e.hp=0;e.bk=1}
      else if(e.t!='bomber')hurt(e,18);
    }
  }
  bul=bul.filter(q=>hy(q.x-b.x,q.y-b.y)>R);
  if(hy(P.x-b.x,P.y-b.y)<R+P.r-4)hit(2);
}

/* ---------- DESENHO ---------- */

function novoDraw(){
  // Círculos mágicos
  for(const c of mc){
    const p=c.f?1:1-c.t/c.d;
    X.save();
    X.translate(c.x,c.y);
    X.fillStyle='rgba(120,50,170,'+(c.f?.2+.06*Math.sin(tm*6):.05+.12*p)+')';
    X.beginPath();X.arc(0,0,c.r*(c.f?1:p),0,6.283);X.fill();
    X.strokeStyle='rgba(176,106,255,'+(c.f?.85:.3+.4*p)+')';
    X.lineWidth=3;
    if(!c.f)X.setLineDash([7,6]);
    X.beginPath();X.arc(0,0,c.r,0,6.283);X.stroke();
    X.setLineDash([]);
    X.rotate(tm*(c.f?1.2:2.5));
    X.lineWidth=2;
    X.beginPath();
    for(let i=0;i<6;i++){
      const q=i*2.0944-1.571;
      X[i?'lineTo':'moveTo'](Math.cos(q)*c.r*.82,Math.sin(q)*c.r*.82);
    }
    X.closePath();X.stroke();
    X.beginPath();
    for(let i=0;i<6;i++){
      const q=i*2.0944+1.571;
      X[i?'lineTo':'moveTo'](Math.cos(q)*c.r*.82,Math.sin(q)*c.r*.82);
    }
    X.closePath();X.stroke();
    X.beginPath();X.arc(0,0,c.r*.45,0,6.283);X.stroke();
    X.restore();
  }

  // Bombas gigantes
  for(const b of ebb){
    const urg=1-b.t/b.m,pisca=Math.sin(tm*(6+urg*30))>0,esc=1+Math.sin(tm*8)*.05;
    X.save();
    X.translate(b.x,b.y);
    // área de explosão
    X.setLineDash([9,7]);
    X.strokeStyle='rgba(255,110,50,'+(.35+.5*urg)+')';
    X.lineWidth=3;
    X.beginPath();X.arc(0,0,b.R,0,6.283);X.stroke();
    X.setLineDash([]);
    X.fillStyle='rgba(255,90,40,'+(.05+.2*urg)+')';
    X.beginPath();X.arc(0,0,b.R*urg,0,6.283);X.fill();
    // corpo da bomba
    X.scale(esc,esc);
    X.fillStyle='#0005';
    X.beginPath();X.ellipse(0,26,26,8,0,0,6.283);X.fill();
    X.fillStyle=pisca?'#f2d08a':'#2a1d14';
    X.strokeStyle='#120a05';X.lineWidth=3;
    X.beginPath();X.arc(0,0,26,0,6.283);X.fill();X.stroke();
    X.fillStyle='#ffffff22';
    X.beginPath();X.arc(-8,-9,7,0,6.283);X.fill();
    X.fillStyle='#8a6a4a';
    X.fillRect(-5,-34,10,10);
    X.strokeStyle='#c8b48a';X.lineWidth=2;
    X.beginPath();X.moveTo(0,-34);X.quadraticCurveTo(10,-44,16,-38);X.stroke();
    X.fillStyle=pisca?'#ffd84a':'#ff7a2a';
    X.beginPath();X.arc(16,-38,4+Math.sin(tm*30)*1.5,0,6.283);X.fill();
    X.restore();
  }

  // Sopros de gelo
  for(const f of fb){
    const o=f.o;if(!o)continue;
    const ang0=f.f?(f.cur!=null?f.cur:f.a):f.a;
    X.save();
    X.translate(o.x,o.y);
    X.rotate(ang0);
    if(!f.f){
      const p=1-f.t/f.d;
      X.fillStyle='rgba(150,220,245,'+(.05+.12*p)+')';
      X.strokeStyle='rgba(200,240,255,'+(.3+.5*p)+')';
      X.lineWidth=2;X.setLineDash([8,6]);
      X.beginPath();X.moveTo(0,0);X.arc(0,0,FROST_R,-FROST_HALF,FROST_HALF);X.closePath();
      X.fill();X.stroke();X.setLineDash([]);
    }else{
      const fa=Math.min(1,f.t/.35);
      const g=X.createRadialGradient(0,0,10,0,0,FROST_R);
      g.addColorStop(0,'rgba(230,248,255,'+.85*fa+')');
      g.addColorStop(.55,'rgba(140,215,240,'+.5*fa+')');
      g.addColorStop(1,'rgba(90,170,220,0)');
      X.fillStyle=g;
      X.beginPath();X.moveTo(0,0);X.arc(0,0,FROST_R,-FROST_HALF,FROST_HALF);X.closePath();X.fill();
      X.strokeStyle='rgba(235,250,255,'+.7*fa+')';X.lineWidth=2;
      for(let i=0;i<5;i++){
        const q=-FROST_HALF+(i+.5)*(FROST_HALF*2/5)+Math.sin(tm*12+i)*.03;
        X.beginPath();X.moveTo(30,0);X.lineTo(Math.cos(q)*FROST_R*.9,Math.sin(q)*FROST_R*.9);X.stroke();
      }
    }
    X.restore();
  }
}

/* Detalhes extras desenhados sobre cada inimigo novo */
function novoEnemyFx(e){
  if(e.t=='seal'){
    X.save();X.translate(e.x,e.y);X.rotate(e.a||0);
    X.strokeStyle='#c9a0ff';X.lineWidth=2;
    X.beginPath();X.arc(0,0,e.r+7,0,4.2);X.stroke();
    X.fillStyle='#e8d0ff';
    X.beginPath();X.arc(e.r+7,0,2.5,0,6.283);X.fill();
    X.restore();
  }else if(e.t=='bomber'){
    X.fillStyle='#2a1d14';X.strokeStyle='#120a05';X.lineWidth=2;
    X.beginPath();X.arc(e.x,e.y-e.r-10,6,0,6.283);X.fill();X.stroke();
    X.fillStyle=Math.sin(tm*18)>0?'#ffd84a':'#ff7a2a';
    X.beginPath();X.arc(e.x+4,e.y-e.r-17,2.5,0,6.283);X.fill();
  }else if(e.t=='frost'){
    X.strokeStyle='rgba(228,246,255,.8)';X.lineWidth=2;
    for(let i=0;i<3;i++){
      const q=tm*1.5+i*2.094;
      X.beginPath();X.moveTo(e.x+Math.cos(q)*(e.r+3),e.y+Math.sin(q)*(e.r+3));
      X.lineTo(e.x+Math.cos(q)*(e.r+11),e.y+Math.sin(q)*(e.r+11));X.stroke();
    }
    if(e.s==1){
      X.fillStyle='rgba(200,240,255,'+(.2+.15*Math.sin(tm*20))+')';
      X.beginPath();X.arc(e.x,e.y,e.r+8,0,6.283);X.fill();
    }
  }else if(e.t=='rep'){
    X.strokeStyle='rgba(201,176,232,'+(.4+.3*Math.sin(tm*8+e.r))+')';X.lineWidth=2;
    X.beginPath();X.arc(e.x+Math.sin(tm*5)*3,e.y,e.r+5,0,6.283);X.stroke();
  }
}

/* Efeitos desenhados sobre o jogador (já com origem em 0,0) */
function novoPlayerFx(){
  if(P.weak>0){
    X.strokeStyle='rgba(176,106,255,.9)';X.lineWidth=2;
    X.setLineDash([3,5]);
    X.beginPath();X.arc(0,0,P.r+11,-tm*2,-tm*2+6.283);X.stroke();
    X.setLineDash([]);
    X.fillStyle='rgba(120,90,150,.28)';
    X.beginPath();X.arc(0,0,P.r+3,0,6.283);X.fill();
  }
  if(P.chill>0){
    X.fillStyle='rgba(160,220,245,.35)';
    X.beginPath();X.arc(0,0,P.r+3,0,6.283);X.fill();
    X.strokeStyle='rgba(228,246,255,.9)';X.lineWidth=2;
    for(let i=0;i<4;i++){
      const q=i*1.5708+.4;
      X.beginPath();X.moveTo(Math.cos(q)*(P.r+1),Math.sin(q)*(P.r+1));
      X.lineTo(Math.cos(q)*(P.r+8),Math.sin(q)*(P.r+8));X.stroke();
    }
  }
}

/* Avisos no HUD */
function novoHud(){
  if(P.weak>0){
    X.fillStyle='rgba(120,50,170,.1)';
    X.fillRect(0,0,W,H);
    txt('ENFRAQUECIDO — sem habilidade, dano -40%',62,100,11,'#c08aff','left');
  }
  if(P.chill>0){
    X.fillStyle='rgba(120,200,240,.1)';
    X.fillRect(0,0,W,H);
    txt('CONGELANDO '+P.chill.toFixed(1)+'s — lento',62,114,11,'#a8e4f8','left');
  }
}
