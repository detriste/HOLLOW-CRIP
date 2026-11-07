
/* ============================================================
   CHEFE: LADRÃO FANTASMA (bt == 5)
   Versão corrigida e otimizada.
   Mantém todos os ataques e efeitos.
   ============================================================ */


/* CONFIGURAÇÕES */

const TH_LUNGE = 1400;
const TH_GHOST = 1.5;
const TH_GHOST_CD = 3;

const TH_SWORD_HOME = .6;
const TH_SWORD_TURN = 5;

const TH_DASH_SPEED = 1250;
const TH_WAVE_SPEED = 760;
const TH_WAVE_PUSH = 1050;

const TH_SPIN_TIME = 1.65;
const TH_SPIN_INTERVAL = .02;
const TH_AIR_SPEED = 650;
const TH_AIR_PUSH = 850;

const angDiff = (a,b) =>
  Math.atan2(Math.sin(a-b),Math.cos(a-b));


/* POSIÇÃO ATRÁS DO JOGADOR */

function thiefBehind(e){
  const f=hy(P.fx,P.fy)||1;
  const base=Math.atan2(-P.fy/f,-P.fx/f);

  for(const off of [0,.6,-.6,1.2,-1.2,1.9,-1.9,3.14]){
    const an=base+off;
    const x=cl(P.x+Math.cos(an)*54,L+e.r,RT-e.r);
    const y=cl(P.y+Math.sin(an)*54,U+e.r,BT-e.r);

    if(!rockAt(x,y)&&hy(x-P.x,y-P.y)>34) return {x,y};
  }

  return {
    x:cl(P.x+Math.cos(base)*54,L+e.r,RT-e.r),
    y:cl(P.y+Math.sin(base)*54,U+e.r,BT-e.r)
  };
}


/* TELETRANSPORTE */

function thiefTeleportNear(e){
  parts(e.x,e.y,'#f2f4fa',20,230);

  const p=thiefBehind(e);
  e.x=p.x;
  e.y=p.y;
  e.fa=Math.atan2(P.y-e.y,P.x-e.x);

  parts(e.x,e.y,'#f2f4fa',22,240);
  sfx(480,.12,.05,'sawtooth');
}


/* INTELIGÊNCIA ARTIFICIAL */

function thiefAI(e,dt,a,d){

  const ph=e.hp/e.mhp>.66?0:e.hp/e.mhp>.33?1:2;

  // Inicialização.
  if(!e.th){
    e.th=1;
    e.st='idle';
    e.tt=0;
    e.r=24;
    e.hp=e.mhp=e.mhp*.85;
    e.fa=a;
    e.al=1;
    e.gh=0;
    e.gcd=2;
    e.lm=-1;
    e.sd=1;
    e.sdt=2.5;
    e.cd=1;
    e.wave=null;
    e.wallStab=0;

    // Dados do ataque giratório.
    e.spinAngle=0;
    e.spinBase=0;
    e.spinTimer=0;
    e.airCuts=[];
  }


  /* ESPADAS TELEGUIDAS */

  let redirected=false;

  for(const b of bul){
    if(!b.thiefSword) continue;

    b.age=(b.age||0)+dt;

    const dist=hy(P.x-b.x,P.y-b.y);

    if(b.minDist==null) b.minDist=dist;
    b.minDist=Math.min(b.minDist,dist);

    // Detecta quando a espada passa ou se afasta do jogador.
    if(!b.home&&b.age>.22){
      const passed=(b.x-b.aimX)*b.dirX+(b.y-b.aimY)*b.dirY>0;
      const movedAway=dist>b.minDist+18&&b.minDist>P.r+8;

      if((passed&&dist>P.r+18)||movedAway){
        b.home=1;
        b.homeT=TH_SWORD_HOME;
        redirected=true;
      }
    }

    // Perseguição curta e suave.
    if(b.home){
      b.homeT-=dt;

      const desired=Math.atan2(P.y-b.y,P.x-b.x);
      const current=Math.atan2(b.vy,b.vx);
      const turn=Math.min(1,dt*TH_SWORD_TURN);
      const an=current+angDiff(desired,current)*turn;

      const sp=b.spd||Math.hypot(b.vx,b.vy)||830;

      b.vx=Math.cos(an)*sp;
      b.vy=Math.sin(an)*sp;

      if(b.homeT<=0){
        b.thiefSword=0;
        b.home=0;
      }
    }
  }

  // O chefe para brevemente quando as espadas começam a perseguir.
  if(redirected&&!['aim','to','ta','sl','cf','cr','pl','cs','dch','wsl','rot'].includes(e.st)){
    e.st='aim';
    e.tt=.65;
  }


  /* ATUALIZAÇÃO DOS CORTES DE AR */

  if(!e.airCuts) e.airCuts=[];

  for(let i=e.airCuts.length-1;i>=0;i--){
    const b=e.airCuts[i];

    // Movimento dos cortes.
    b.x+=b.vx*dt;
    b.y+=b.vy*dt;
    b.life-=dt;

    // Remove cortes expirados ou fora da arena.
    if(
      b.life<=0||
      b.x<L-50||b.x>RT+50||
      b.y<U-50||b.y>BT+50
    ){
      e.airCuts.splice(i,1);
      continue;
    }

    // Acerto no jogador.
    if(
      !b.hit&&
      !(P.dash>0||P.inv>0||P.ph>0)&&
      hy(P.x-b.x,P.y-b.y)<P.r+17
    ){
      b.hit=1;
      b.pushing=.25;

      hit(1);
      parts(P.x,P.y,'#dceaff',12,190);
      shake=Math.max(shake,4);
      sfx(170,.1,.05,'sawtooth');
    }

    // Empurrão na direção do corte.
    if(b.pushing>0){
      b.pushing-=dt;

      const oldX=P.x;
      const oldY=P.y;
      const push=TH_AIR_PUSH*dt;

      P.x=cl(P.x+b.dx*push,L+P.r,RT-P.r);
      P.y=cl(P.y+b.dy*push,U+P.r,BT-P.r);

      const wall=
        P.x<=L+P.r+1||
        P.x>=RT-P.r-1||
        P.y<=U+P.r+1||
        P.y>=BT-P.r-1;

      if(wall||(oldX===P.x&&oldY===P.y)){
        b.pushing=0;
        P.vx=P.vy=0;
        parts(P.x,P.y,'#ffffff',8,150);
      }
    }
  }


  /* INTANGIBILIDADE */

  if(e.gh>0) e.gh=Math.max(0,e.gh-dt);
  e.gcd-=dt;

  if(e.kk>0) e.kk-=dt;

  if(e.gcd<=0&&e.gh<=0&&e.st!='to'&&e.st!='ta'){
    let near=false;

    for(const b of bul){
      if(!b.h&&hy(b.x-e.x,b.y-e.y)<e.r+50){
        near=true;
        break;
      }
    }

    if(near){
      e.gh=TH_GHOST;
      e.gcd=TH_GHOST+TH_GHOST_CD;

      parts(e.x,e.y,'#cfd8ff',16,200);
      sfx(720,.18,.04,'sine');
    }
  }


  /* DIREÇÃO E FUNÇÕES AUXILIARES */

  if(!['sl','cf','cr','pl','dch','wsl','rot'].includes(e.st)){
    e.fa+=angDiff(a,e.fa)*Math.min(1,dt*(e.st=='idle'?6:14));
  }

  e.tt-=dt;
  e.al=1;

  const T=(s,t)=>{
    e.st=s;
    e.tt=t;
  };

  const rec=c=>{
    e.wave=null;
    e.hk=e.st=='cr'?e.hk:null;
    T('rec',.4);
    e.cd=c-ph*.2;
  };


  /* ESTADOS */

  switch(e.st){

    /* MOVIMENTAÇÃO E ESCOLHA DE ATAQUE */

    case 'idle':{
      e.sdt-=dt;

      if(e.sdt<=0){
        e.sd=-e.sd;
        e.sdt=rnd(1.6,3);
      }

      const rad=cl((d-240)/90,-1,1);
      const sp=e.sp*1.6;

      e.x+=(Math.cos(a)*rad*.9+Math.cos(a+1.5708*e.sd)*.75)*sp*dt;
      e.y+=(Math.sin(a)*rad*.9+Math.sin(a+1.5708*e.sd)*.75)*sp*dt;

      if(e.cd<=0){
        let o=d<140?[1,1,0,2,3,4,5]:
              d>380?[2,2,0,1,3,4,5]:
              [0,1,2,3,4,5];

        o=o.filter(m=>m!=e.lm);
        const m=pick(o.length?o:[0,1,2,3,4,5]);

        e.lm=m;

        if(m==0){
          T('tw',.42-ph*.06);
          e.vol=0;

        }else if(m==1){
          T('to',.22);

        }else if(m==2){
          T('cw',.5-ph*.07);

        }else if(m==3){
          e.la=a;
          e.hd=0;
          T('dc',.16);

        }else if(m==4){
          e.la=a;
          e.wave=null;
          T('wa',.42);

        }else{
          // Prepara o ataque giratório.
          e.spinBase=e.fa;
          e.spinAngle=0;
          e.spinTimer=0;
          e.airCuts=[];

          T('rot',TH_SPIN_TIME);
          sfx(350,.15,.06,'sawtooth');
        }
      }
      break;
    }


    /* ARREMESSO DE ESPADAS */

    case 'tw':{
      if(e.tt<=0){
        const n=2+ph;
        const sp=430+ph*45;

        for(let i=0;i<n;i++){
          const an=e.fa+(i-(n-1)/2)*.17;

          bul.push({
            x:e.x+Math.cos(e.fa)*e.r,
            y:e.y+Math.sin(e.fa)*e.r,

            vx:Math.cos(an)*sp,
            vy:Math.sin(an)*sp,

            r:7,h:1,l:3.2,c:'#e8eef5',sw:1,

            thiefSword:1,
            age:0,
            home:0,
            homeT:0,

            aimX:P.x,
            aimY:P.y,

            dirX:Math.cos(an),
            dirY:Math.sin(an),

            minDist:hy(P.x-e.x,P.y-e.y),
            spd:sp
          });
        }

        sfx(620,.08,.05,'triangle');
        e.kk=.14;
        e.vol++;

        if(e.vol<1+ph) e.tt=.3;
        else rec(1.5);
      }
      break;
    }


    /* ESPADAS PERSEGUINDO */

    case 'aim':{
      if(e.tt<=0) rec(1);
      break;
    }


    /* TELETRANSPORTE */

    case 'to':{
      e.al=Math.max(0,e.tt/.22);

      if(e.tt<=0){
        thiefTeleportNear(e);
        T('ta',.5-ph*.07);
      }
      break;
    }


    /* APARECENDO E ATACANDO */

    case 'ta':{
      e.al=Math.min(1,((.5-ph*.07)-e.tt)/.14);

      if(e.tt<=0){
        if(e.wallStab){
          e.wallStab=0;
          e.la=Math.atan2(P.y-e.y,P.x-e.x);
          e.hd=0;

          T('wsl',.24);
          sfx(220,.13,.07,'sawtooth');

        }else{
          e.la=a;
          e.hd=0;

          T('sl',.26);
          sfx(300,.12,.07,'sawtooth');
        }
      }
      break;
    }


    /* GOLPE NORMAL */

    case 'sl':{
      const dd=()=>hy(P.x-e.x,P.y-e.y);

      // Se o jogador escapar com dash, o chefe usa a corrente.
      if(P.dash>0&&!e.hd){
        parts(P.x,P.y,'#fff',10,200);

        e.fa=Math.atan2(P.y-e.y,P.x-e.x);
        T('cw',.18);
        break;
      }

      if(e.tt>.05&&dd()>e.r+P.r+4){
        e.x+=Math.cos(e.la)*TH_LUNGE*dt;
        e.y+=Math.sin(e.la)*TH_LUNGE*dt;
      }

      if(!e.hd&&dd()<e.r+P.r+34){
        e.hd=1;

        hit(1);
        parts(P.x,P.y,'#fff',8,200);
        sfx(200,.1,.06,'sawtooth');
      }

      if(e.tt<=0) rec(1.3);
      break;
    }


    /* PREPARAÇÃO DA CORRENTE */

    case 'cw':{
      if(e.tt<=0){
        e.ca=Math.atan2(P.y-e.y,P.x-e.x);

        e.hk={
          x:e.x+Math.cos(e.ca)*e.r,
          y:e.y+Math.sin(e.ca)*e.r
        };

        e.hl=0;

        T('cf',1.5);
        sfx(400,.15,.05,'square');
      }
      break;
    }


    /* CORRENTE AVANÇANDO */

    case 'cf':{
      const s=920*dt;

      e.hk.x+=Math.cos(e.ca)*s;
      e.hk.y+=Math.sin(e.ca)*s;
      e.hl+=s;

      if(
        hy(e.hk.x-P.x,e.hk.y-P.y)<P.r+14&&
        !(P.dash>0||P.inv>0||P.ph>0)
      ){
        T('pl',.9);

        sfx(160,.2,.07,'sawtooth');
        shake=Math.max(shake,6);
        parts(P.x,P.y,'#cfd8ff',10,160);
        break;
      }

      if(
        e.hl>680||
        e.hk.x<L||e.hk.x>RT||
        e.hk.y<U||e.hk.y>BT||
        rockAt(e.hk.x,e.hk.y)
      ){
        T('cr',.22);
      }
      break;
    }


    /* CORRENTE RETORNANDO */

    case 'cr':{
      if(!e.hk){
        rec(1.4);
        break;
      }

      e.hk.x+=(e.x-e.hk.x)*Math.min(1,dt*18);
      e.hk.y+=(e.y-e.hk.y)*Math.min(1,dt*18);

      if(e.tt<=0){
        e.hk=null;
        rec(1.4);
      }
      break;
    }


    /* JOGADOR PRESO */

    case 'pl':{
      if(P.dash>0){
        parts(P.x,P.y,'#fff',10,200);
        T('cr',.2);
        break;
      }

      const dx=e.x-P.x;
      const dy=e.y-P.y;
      const dist=hy(dx,dy)||1;
      const stop=e.r+P.r+10;

      e.hk.x=P.x;
      e.hk.y=P.y;

      if(dist>stop&&e.tt>0){
        const stp=Math.min(dist-stop,1000*dt);

        P.x=cl(P.x+dx/dist*stp,L+P.r,RT-P.r);
        P.y=cl(P.y+dy/dist*stp,U+P.r,BT-P.r);

        P.vx=P.vy=0;

      }else{
        e.hk=null;
        T('cs',.3-ph*.04);
        sfx(260,.12,.05,'sawtooth');
      }
      break;
    }


    /* GOLPE APÓS A CORRENTE */

    case 'cs':{
      if(e.tt<=0){
        e.la=a;
        e.hd=0;

        T('sl',.26);
        sfx(300,.12,.07,'sawtooth');
      }
      break;
    }


    /* PREPARAÇÃO DO DASH */

    case 'dc':{
      if(e.tt<=0){
        e.la=Math.atan2(P.y-e.y,P.x-e.x);
        e.hd=0;

        T('dch',.25);
        sfx(550,.08,.05,'triangle');
      }
      break;
    }


    /* DASH CORTANTE */

    case 'dch':{
      e.x=cl(
        e.x+Math.cos(e.la)*TH_DASH_SPEED*dt,
        L+e.r,RT-e.r
      );

      e.y=cl(
        e.y+Math.sin(e.la)*TH_DASH_SPEED*dt,
        U+e.r,BT-e.r
      );

      if(
        !e.hd&&
        hy(P.x-e.x,P.y-e.y)<e.r+P.r+24&&
        !(P.dash>0||P.inv>0||P.ph>0)
      ){
        e.hd=1;

        hit(1);
        parts(P.x,P.y,'#ffffff',14,230);
        shake=Math.max(shake,7);
        sfx(180,.12,.07,'sawtooth');
      }

      if(e.tt<=0) rec(1.25);
      break;
    }


    /* PREPARAÇÃO DA ONDA */

    case 'wa':{
      if(e.tt<=0){
        e.la=Math.atan2(P.y-e.y,P.x-e.x);

        e.wave={
          x:e.x,
          y:e.y,
          an:e.la,
          dist:0,
          age:0,
          hit:0,
          pushing:0,
          pushT:0
        };

        T('wv',1.1);

        parts(
          e.x+Math.cos(e.la)*35,
          e.y+Math.sin(e.la)*35,
          '#dce8ff',12,180
        );

        sfx(250,.15,.06,'sawtooth');
      }
      break;
    }


    /* ONDA DE AR */

    case 'wv':{
      if(!e.wave){
        rec(1.5);
        break;
      }

      const w=e.wave;
      w.age+=dt;

      const oldDist=w.dist;
      w.dist+=TH_WAVE_SPEED*dt;

      const dx=P.x-w.x;
      const dy=P.y-w.y;

      const forward=dx*Math.cos(w.an)+dy*Math.sin(w.an);
      const side=Math.abs(dx*Math.sin(w.an)-dy*Math.cos(w.an));

      // A onda alcançou o jogador.
      if(
        !w.hit&&
        forward>=oldDist-35&&
        forward<=w.dist+35&&
        forward>0&&
        side<P.r+58&&
        !(P.dash>0||P.inv>0||P.ph>0)
      ){
        w.hit=1;
        w.pushing=1;
        w.pushT=.65;

        parts(P.x,P.y,'#dce8ff',18,230);
        shake=Math.max(shake,5);
        sfx(130,.16,.07,'sawtooth');
      }

      // Empurrão.
      if(w.pushing){
        w.pushT-=dt;

        const push=TH_WAVE_PUSH*dt;
        const oldX=P.x;
        const oldY=P.y;

        P.x=cl(
          P.x+Math.cos(w.an)*push,
          L+P.r,RT-P.r
        );

        P.y=cl(
          P.y+Math.sin(w.an)*push,
          U+P.r,BT-P.r
        );

        P.vx=Math.cos(w.an)*420;
        P.vy=Math.sin(w.an)*420;

        const wallHit=
          (P.x<=L+P.r+1&&Math.cos(w.an)<-.1)||
          (P.x>=RT-P.r-1&&Math.cos(w.an)>.1)||
          (P.y<=U+P.r+1&&Math.sin(w.an)<-.1)||
          (P.y>=BT-P.r-1&&Math.sin(w.an)>.1);

        if(wallHit){
          w.pushing=0;
          P.vx=P.vy=0;

          parts(P.x,P.y,'#ffffff',22,250);
          shake=Math.max(shake,10);

          thiefTeleportNear(e);
          e.wallStab=1;

          T('ta',.16);
          break;
        }

        if(w.pushT<=0){
          w.pushing=0;
          P.vx=P.vy=0;
        }
      }

      if(w.dist>760||w.age>1.1){
        e.wave=null;
        rec(1.6);
      }
      break;
    }


    /* FACADA APÓS PRENDER NA PAREDE */

    case 'wsl':{
      const speed=1500;

      e.x=cl(
        e.x+Math.cos(e.la)*speed*dt,
        L+e.r,RT-e.r
      );

      e.y=cl(
        e.y+Math.sin(e.la)*speed*dt,
        U+e.r,BT-e.r
      );

      if(
        !e.hd&&
        hy(P.x-e.x,P.y-e.y)<e.r+P.r+28&&
        !(P.dash>0||P.inv>0||P.ph>0)
      ){
        e.hd=1;

        hit(1);
        parts(P.x,P.y,'#ffffff',18,250);
        shake=Math.max(shake,9);
        sfx(150,.14,.08,'sawtooth');
      }

      if(e.tt<=0) rec(1.8);
      break;
    }


    /* ATAQUE GIRATÓRIO */

    case 'rot':{

      // Gira o chefe sem alterar sua direção-base.
      e.spinAngle+=dt*19;
      e.spinTimer-=dt;

      // Dispara cortes em intervalos regulares.
      if(e.spinTimer<=0){
        e.spinTimer=TH_SPIN_INTERVAL;

        // Direção aleatória.
        const an=rnd(0,Math.PI*2);
        const dx=Math.cos(an);
        const dy=Math.sin(an);

        // Cria o corte com todas as propriedades necessárias.
        e.airCuts.push({
          x:e.x+dx*(e.r+12),
          y:e.y+dy*(e.r+12),

          vx:dx*TH_AIR_SPEED,
          vy:dy*TH_AIR_SPEED,

          dx:dx,
          dy:dy,
          an:an,

          life:1.15,
          hit:0,
          pushing:0
        });

        // Efeito na origem do disparo.
        parts(
          e.x+dx*(e.r+18),
          e.y+dy*(e.r+18),
          '#dceaff',5,120
        );

        sfx(500,.045,.025,'triangle');
      }

      // Finaliza o giro.
      if(e.tt<=0){
        e.airCuts=[];
        rec(1.6);
      }

      break;
    }


    /* RECUPERAÇÃO */

    case 'rec':{
      if(e.tt<=0) T('idle',0);
      break;
    }

    default:
      T('idle',0);
      break;
  }
}


/* ============================================================
   DESENHO DO LADRÃO FANTASMA
   ============================================================ */

function drawThief(e,c){
  const r=e.r;
  const fa=e.fa==null?ang(e):e.fa;
  const st=e.st||'idle';
  const x=e.x,y=e.y;
  const fh=c=='#fff';
  const ghost=e.gh>0;
  const a2=Math.atan2(P.y-y,P.x-x);

  let al=e.al==null?1:e.al;

  if(ghost) al*=.3+.1*Math.sin(tm*40);

  const O='#1c130d';


  /* EFEITOS */

  X.save();
  X.lineCap='round';
  X.lineJoin='round';

  // Avisos de golpe.
  if(st=='ta'||st=='cs'){
    X.strokeStyle='rgba(255,90,90,.55)';
    X.lineWidth=10;

    X.beginPath();
    X.moveTo(x,y);
    X.lineTo(
      x+Math.cos(a2)*210,
      y+Math.sin(a2)*210
    );
    X.stroke();
  }

  // Mira.
  if(['tw','cw','aim'].includes(st)){
    X.strokeStyle=st=='aim'
      ?'rgba(210,225,255,.65)'
      :'rgba(255,255,255,.28)';

    X.lineWidth=st=='aim'?3:2;
    X.setLineDash([6,8]);

    X.beginPath();
    X.moveTo(x,y);
    X.lineTo(
      x+Math.cos(a2)*(st=='aim'?180:680),
      y+Math.sin(a2)*(st=='aim'?180:680)
    );
    X.stroke();

    X.setLineDash([]);
  }

  // Preparação e movimento do dash.
  if(st=='dc'||st=='dch'){
    X.strokeStyle='rgba(220,235,255,.75)';
    X.lineWidth=st=='dc'?5:9;

    X.beginPath();

    if(st=='dc'){
      X.moveTo(x,y);
      X.lineTo(
        x+Math.cos(e.la)*85,
        y+Math.sin(e.la)*85
      );
    }else{
      X.moveTo(
        x-Math.cos(e.la)*55,
        y-Math.sin(e.la)*55
      );

      X.lineTo(
        x+Math.cos(e.la)*45,
        y+Math.sin(e.la)*45
      );
    }

    X.stroke();
  }


  /* CORTES DE AR */

  if(e.airCuts){
    for(const b of e.airCuts){

      X.save();

      X.translate(b.x,b.y);
      X.rotate(b.an);

      // Desaparecimento gradual.
      X.globalAlpha=Math.max(0,Math.min(1,b.life*1.8));

      // Brilho externo.
      X.strokeStyle='rgba(150,195,255,.25)';
      X.lineWidth=14;

      X.beginPath();
      X.arc(0,0,17,-.85,.85);
      X.stroke();

      // Lâmina de ar.
      X.strokeStyle='#ffffff';
      X.lineWidth=5;

      X.beginPath();
      X.arc(0,0,17,-.85,.85);
      X.stroke();

      // Rastro luminoso.
      X.strokeStyle='#dceaff';
      X.lineWidth=2;

      X.beginPath();
      X.moveTo(-12,0);
      X.lineTo(22,0);
      X.stroke();

      X.restore();
    }
  }


  /* ONDA FRONTAL */

  if(st=='wv'&&e.wave){
    const w=e.wave;

    X.save();
    X.translate(w.x,w.y);
    X.rotate(w.an);

    X.globalAlpha=.45;
    X.fillStyle='#dce8ff';

    X.beginPath();
    X.moveTo(w.dist-65,-75);
    X.quadraticCurveTo(w.dist+35,-35,w.dist+45,0);
    X.quadraticCurveTo(w.dist+35,35,w.dist-65,75);
    X.closePath();
    X.fill();

    X.globalAlpha=.85;
    X.strokeStyle='#ffffff';
    X.lineWidth=5;

    X.beginPath();
    X.moveTo(w.dist-65,-75);
    X.quadraticCurveTo(w.dist+45,0,w.dist-65,75);
    X.stroke();

    X.globalAlpha=.55;
    X.lineWidth=3;

    for(let i=0;i<4;i++){
      const yy=-55+i*36;

      X.beginPath();
      X.moveTo(w.dist-90,yy);
      X.lineTo(w.dist+20,yy);
      X.stroke();
    }

    X.restore();
  }


  /* CORRENTE E PONTA */

  if(['cf','cr','pl'].includes(st)&&e.hk){
    const dx=e.hk.x-x;
    const dy=e.hk.y-y;
    const len=hy(dx,dy);
    const an=Math.atan2(dy,dx);
    const n=Math.max(1,Math.floor(len/10));

    X.strokeStyle='rgba(210,225,255,.2)';
    X.lineWidth=8;

    X.beginPath();
    X.moveTo(x,y);
    X.lineTo(e.hk.x,e.hk.y);
    X.stroke();

    for(let i=1;i<=n;i++){
      const t=i/n;

      X.save();
      X.translate(x+dx*t,y+dy*t);
      X.rotate(an+(i%2?0:1.5708));

      X.fillStyle='#cdd5e0';
      X.strokeStyle=O;
      X.lineWidth=2;

      X.beginPath();
      X.ellipse(0,0,7,4,0,0,6.283);
      X.fill();
      X.stroke();

      X.restore();
    }

    X.save();
    X.translate(e.hk.x,e.hk.y);
    X.rotate(an);

    X.fillStyle='#e8eef5';
    X.strokeStyle=O;
    X.lineWidth=2.5;

    X.beginPath();
    X.moveTo(-5,-9);
    X.lineTo(16,0);
    X.lineTo(-5,9);
    X.lineTo(0,0);
    X.closePath();
    X.fill();
    X.stroke();

    X.restore();
  }


  /* ARCO DOS GOLPES */

  if(['sl','dch','wsl'].includes(st)){
    const duration=st=='dch'?.25:.26;
    const p=Math.max(0,Math.min(1,1-e.tt/duration));

    X.strokeStyle='rgba(255,255,255,'+(.9*(1-p))+')';
    X.lineWidth=st=='dch'?16:3+10*(1-p);

    X.beginPath();
    X.arc(x,y,r*2.1,e.la-1.1,e.la+1.1);
    X.stroke();
  }


  /* EFEITO DE ROTAÇÃO */

  if(st=='rot'){
    X.strokeStyle='rgba(220,235,255,.55)';
    X.lineWidth=5;

    X.beginPath();
    X.arc(x,y,r+15,e.spinAngle-2.5,e.spinAngle+2.5);
    X.stroke();
  }

  X.restore();


  /* ==========================================================
     CORPO
     ========================================================== */

  X.save();
  X.globalAlpha=al;

  // Corpo e espadas giram juntos.
  if(st=='rot'){
    X.translate(x,y);
    X.rotate(e.spinAngle);
    X.translate(-x,-y);
  }

  X.lineJoin='round';
  X.lineCap='round';
  X.lineWidth=3;
  X.strokeStyle=O;

  const W1=fh?'#fff':'#f2f4fa';
  const W2=fh?'#fff':'#c3cadb';


  /* CAPA */

  const b=fa+Math.PI;
  const fw=Math.sin(tm*6)*r*.14;

  const s1x=x+Math.cos(fa+1.57)*r*.8;
  const s1y=y+Math.sin(fa+1.57)*r*.8;

  const s2x=x+Math.cos(fa-1.57)*r*.8;
  const s2y=y+Math.sin(fa-1.57)*r*.8;

  const hLx=x+Math.cos(b+.8)*r*2.1;
  const hLy=y+Math.sin(b+.8)*r*2.1;

  const hRx=x+Math.cos(b-.8)*r*2.1;
  const hRy=y+Math.sin(b-.8)*r*2.1;

  const tx=x+Math.cos(b)*r*2.4+Math.cos(b+1.57)*fw;
  const ty=y+Math.sin(b)*r*2.4+Math.sin(b+1.57)*fw;

  X.fillStyle=W1;

  X.beginPath();
  X.moveTo(s1x,s1y);
  X.quadraticCurveTo(hLx,hLy,tx,ty);
  X.quadraticCurveTo(hRx,hRy,s2x,s2y);
  X.closePath();
  X.fill();
  X.stroke();


  /* DOBRAS DA CAPA */

  X.strokeStyle=W2;
  X.lineWidth=2;

  for(const q of[-.4,0,.4]){
    X.beginPath();

    X.moveTo(
      x+Math.cos(b+q*.5)*r*.8,
      y+Math.sin(b+q*.5)*r*.8
    );

    X.lineTo(
      x+Math.cos(b+q)*r*1.9+Math.cos(b+1.57)*fw*.5,
      y+Math.sin(b+q)*r*1.9+Math.sin(b+1.57)*fw*.5
    );

    X.stroke();
  }


  /* TÚNICA */

  X.strokeStyle=O;
  X.lineWidth=3;
  X.fillStyle=W1;

  X.beginPath();
  X.arc(x,y,r*.95,0,6.283);
  X.fill();
  X.stroke();

  X.fillStyle=fh?'#fff':'#2d3144';

  X.beginPath();
  X.ellipse(
    x+Math.cos(fa)*r*.3,
    y+Math.sin(fa)*r*.3+r*.25,
    r*.52,r*.58,0,0,6.283
  );
  X.fill();
  X.stroke();


  /* CAPUZ */

  const hx=x;
  const hy2=y-r*.3;

  X.fillStyle=W1;

  X.beginPath();
  X.arc(hx,hy2,r*.74,0,6.283);
  X.fill();
  X.stroke();


  /* ROSTO */

  const fx=hx+Math.cos(fa)*r*.16;
  const fy=hy2+Math.sin(fa)*r*.12;

  X.fillStyle='#0d0e15';

  X.beginPath();
  X.ellipse(fx,fy,r*.44,r*.38,0,0,6.283);
  X.fill();


  /* OLHOS */

  const eg=[
    'ta','cs','sl','tw','cw','aim',
    'dc','dch','wa','wv','wsl','rot'
  ].includes(st);

  for(const s of[-1,1]){
    const ex=fx+s*r*.19;
    const ey=fy-r*.02;

    X.fillStyle=eg
      ?'rgba(255,70,70,.35)'
      :'rgba(255,110,110,.2)';

    X.beginPath();
    X.arc(ex,ey,r*.17,0,6.283);
    X.fill();

    X.fillStyle=eg?'#ff4d4d':'#ff8a8a';

    X.beginPath();
    X.ellipse(ex,ey,r*.08,r*.1,0,0,6.283);
    X.fill();
  }


  /* ESPADAS NAS MÃOS */

  const attack=['sl','dch','wsl'].includes(st);
  const bf=attack?e.la:fa;
  const p=attack?Math.max(0,Math.min(1,1-e.tt/.26)):0;

  const sword=(hx2,hy3,an,len,glow)=>{
    X.save();

    X.translate(hx2,hy3);
    X.rotate(an);

    X.lineWidth=2.5;
    X.strokeStyle=O;

    // Cabo.
    X.fillStyle='#4a2f1c';

    X.beginPath();
    X.roundRect(-r*.4,-r*.07,r*.44,r*.14,2);
    X.fill();
    X.stroke();

    // Guarda.
    X.fillStyle='#c9a13a';

    X.beginPath();
    X.roundRect(r*.02,-r*.25,r*.13,r*.5,2);
    X.fill();
    X.stroke();

    // Lâmina.
    X.fillStyle=glow||fh?'#ffffff':'#dfe6ee';

    X.beginPath();
    X.moveTo(r*.15,-r*.12);
    X.lineTo(r*.15+len,-r*.07);
    X.lineTo(r*.15+len+r*.32,0);
    X.lineTo(r*.15+len,r*.07);
    X.lineTo(r*.15,r*.12);
    X.closePath();
    X.fill();
    X.stroke();

    // Reflexo da lâmina.
    X.strokeStyle='#9aa6b8';
    X.lineWidth=1.2;

    X.beginPath();
    X.moveTo(r*.22,0);
    X.lineTo(r*.15+len,0);
    X.stroke();

    // Brilho.
    if(glow){
      X.globalAlpha=al*.35;
      X.fillStyle='#cfd8ff';

      X.beginPath();
      X.ellipse(r*.15+len*.5,0,len*.6,r*.2,0,0,6.283);
      X.fill();
    }

    X.restore();
  };


  /* MOVIMENTO DAS ESPADAS */

  for(const s of[-1,1]){
    let off=.95+Math.sin(tm*5+s)*.06;
    let glow=false;

    if(st=='tw'){
      off=e.tt<.15?.12:.22;
      glow=true;

    }else if(st=='aim'){
      off=.18;
      glow=true;

    }else if(st=='dch'||st=='wsl'){
      off=1.5-3*p;
      glow=true;

    }else if(st=='dc'||st=='wa'){
      off=.15;
      glow=true;

    }else if(st=='rot'){
      off=1.45;
      glow=true;

    }else if(e.kk>0){
      off=.5;

    }else if(['ta','cs','to','cw'].includes(st)){
      off=.45;
      glow=st!='to';

    }else if(st=='sl'){
      off=1.5-3*p;
    }

    const an=bf+s*off;

    const hxx=x+Math.cos(bf+s*1.5)*r*.95;
    const hyy=y+Math.sin(bf+s*1.5)*r*.95;

    sword(hxx,hyy,an,r*1.55,glow);
  }


  /* ANEL DE INTANGIBILIDADE */

  if(ghost){
    X.globalAlpha=.7;
    X.strokeStyle='#cfd8ff';
    X.lineWidth=2;
    X.setLineDash([5,6]);

    X.beginPath();
    X.arc(
      x,y,
      r+9+Math.sin(tm*20)*2,
      tm*4,tm*4+6.283
    );
    X.stroke();

    X.setLineDash([]);
  }

  X.restore();
}


/* ============================================================
   DESENHO DAS ESPADAS ARREMESSADAS
   ============================================================ */

function drawSwordProj(b){
  const an=Math.atan2(b.vy,b.vx);

  X.save();

  X.translate(b.x,b.y);
  X.rotate(an);
  X.lineJoin='round';

  // Brilho das espadas teleguiadas.
  X.globalAlpha=b.home?.42:.25;
  X.fillStyle='#cfd8ff';

  X.beginPath();
  X.ellipse(-12,0,b.home?24:18,b.home?6:4,0,0,6.283);
  X.fill();

  X.globalAlpha=1;
  X.lineWidth=2;
  X.strokeStyle='#1c130d';

  // Cabo.
  X.fillStyle='#4a2f1c';

  X.beginPath();
  X.roundRect(-14,-2,9,4,1.5);
  X.fill();
  X.stroke();

  // Guarda.
  X.fillStyle='#c9a13a';

  X.beginPath();
  X.roundRect(-6,-6,4,12,1.5);
  X.fill();
  X.stroke();

  // Lâmina.
  X.fillStyle='#e8eef5';

  X.beginPath();
  X.moveTo(-2,-3);
  X.lineTo(15,-2.5);
  X.lineTo(25,0);
  X.lineTo(15,2.5);
  X.lineTo(-2,3);
  X.closePath();
  X.fill();
  X.stroke();

  X.restore();
}
