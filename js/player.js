
/* =========================================================
   CRIAÇÃO DO JOGADOR E HABILIDADES ESPECIAIS
   ========================================================= */

function newP(){
  return {
    x:480,y:300,vx:0,vy:0,r:13,
    hp:CH[sel].hp,max:CH[sel].hp,
    coins:0,bombs:1,keys:0,cd:0,inv:0,

    dash:0,dcd:0,

    // =====================================================
    // SISTEMA DE ORBES
    // =====================================================
    // orb   = quantidade total de orbes ativos.
    // obase = quantidade de orbes permanentes.
    // swb   = quantidade de orbes temporários da super.
    // opend = quantidade de orbes que serão transformados
    //         em permanentes quando a super terminar.
    //
    // O Necromante começa com 1 orbe permanente.
    // Os outros heróis mantêm sua configuração original.
    // =====================================================

    orb:CH[sel].k==3?1:(CH[sel].orb||0),
    obase:CH[sel].k==3?1:(CH[sel].orb||0),
    swb:0,
    opend:0,
    oa:0,

    ac:0,ph:0,swt:0,db:0,ch:CH[sel],
    fx:1,fy:0,items:[],sl:[],acc:-1,

    s:{
      dmg:CH[sel].dmg,
      rate:CH[sel].rate,
      spd:CH[sel].spd,
      range:.85,
      shot:460,
      multi:1,
      pierce:0,
      bounce:0,
      home:CH[sel].home||0,
      leech:CH[sel].lc||0,
      expl:0,
      acd:1,
      apw:1,
      dcd:CH[sel].dcd||.9
    }
  };
}


/* =========================================================
   HABILIDADE ESPECIAL DOS HERÓIS
   ========================================================= */

function ability(){
  if(P.ac>0)return;

  const k=P.ch.k;
  P.ac=P.ch.cd*P.s.acd;
  P.aid=(P.aid||0)+1;

  sfx(150,.3,.07,'sawtooth');

  // Tremor reduzido somente para o Sentinela.
  shake=k==0?4:10;

  if(k==0)P.inv=Math.max(P.inv,.8);
  P.vf=P.vf||[];

  /* =====================================================
     SENTINELA
     ===================================================== */
  if(k==0){
    P.bs=.35;

    // Anéis menores e mais delicados.
    P.vf.push(
      {k:'ring',t:.5,m:.5,dl:.1,c:'#c8b48a',R:170,w:5},
      {k:'ring',t:.4,m:.4,dl:.16,c:'#ffffff',R:115,w:2.5},
      {k:'flash',t:.3,m:.3,dl:.1,a:Math.atan2(P.fy,P.fx)}
    );

    // Alcance e dano originais preservados.
    for(const e of en){
      const dx=e.x-P.x;
      const dy=e.y-P.y;
      const d=hy(dx,dy)||1;

      if(d<320){
        e.vx+=dx/d*900;
        e.vy+=dy/d*900;
        e.cd=Math.max(e.cd,1);
        hurt(e,P.s.dmg*3*P.s.apw,1);
      }
    }

    bul=bul.filter(b=>!b.h);

    // Menos partículas, com movimento mais suave.
    for(let i=0;i<32;i++){
      const a=i*.196;

      pt.push({
        x:P.x,
        y:P.y,
        vx:Math.cos(a)*220,
        vy:Math.sin(a)*220,
        l:.4,
        m:.4,
        c:'#c8b48a',
        r:2
      });
    }
  }

  /* =====================================================
     SEGUNDO HERÓI
     ===================================================== */
  else if(k==1){
    P.ph=3*P.s.apw;
    P.dcd=0;

    P.vf.push(
      {k:'ring',t:.5,m:.5,dl:0,c:'#8d7fa8',R:100,w:6},
      {k:'ring',t:.4,m:.4,dl:0,c:'#d8f6ff',R:70,w:3,in:1}
    );

    parts(P.x,P.y,'#8d7fa8',24,260);
  }

  /* =====================================================
     ARTILHEIRO
     ===================================================== */
  else if(k==2){
    P.gn=GUN_T;
    P.gv=0;
    P.gr=0;

    P.vf.push({
      k:'ring',t:.3,m:.3,dl:0,
      c:'#d08a3c',R:70,w:5
    });
  }

  /* =====================================================
     NECROMANTE
     ===================================================== */
  else{
    P.bs=.55;
    P.pend=.33;
  }
}


/* =========================================================
   ARTILHEIRO
   ========================================================= */

const GUN_N=14,GUN_T=1.2;

const gunAng=i=>i*6.283/GUN_N+(P.gr||0);

function gunVolley(v){
  for(let i=0;i<GUN_N;i++){
    const a=gunAng(i);
    const gx=P.x+Math.cos(a)*40;
    const gy=P.y+Math.sin(a)*40;

    for(const q of[-.07,.07]){
      const b=a+q;
      const sp=P.s.shot*(.9+v*.15);

      bul.push({
        x:gx,y:gy,
        vx:Math.cos(b)*sp,
        vy:Math.sin(b)*sp,
        d:P.s.dmg*1.5*P.s.apw,
        ab:1,r:7,l:P.s.range,
        pi:P.s.pierce+1,
        bo:0,ho:0,ex:P.s.expl,
        h:0,hs:[]
      });
    }

    parts(gx,gy,'#ffcf6a',3,120);
  }

  P.gf=.09;
  shake=Math.max(shake,5);
  sfx(260,.08,.05,'square');
}


/* =========================================================
   NECROMANTE - SUPER
   =========================================================
   FUNCIONAMENTO DOS ORBES:

   Começa:
   1 permanente + 0 temporários = 1 orbe.

   Primeira super:
   1 permanente + 4 temporários = 5 orbes.
   Quando termina, os 4 temporários desaparecem e
   os orbes permanentes passam a ser 2.

   Segunda super:
   2 permanentes + 4 temporários = 6 orbes.
   Quando termina, fica com 3 permanentes.

   Terceira super:
   3 permanentes + 4 temporários = 7 orbes.
   Quando termina, fica com 4 permanentes.

   O limite permanente é 4.
   O limite total durante a super é 10.
   ========================================================= */

function necroSuper(){

  // Garante que as variáveis existam.
  // Isso evita erros caso o jogador já esteja em uma partida.
  if(typeof P.obase!=='number')P.obase=1;
  if(typeof P.swb!=='number')P.swb=0;
  if(typeof P.opend!=='number')P.opend=0;

  // =====================================================
  // 1. REGISTRA O GANHO PERMANENTE
  // =====================================================
  // O ganho permanente fica reservado para o fim da super.
  // Assim, durante a primeira super continuamos com 1 orbe
  // permanente e 4 temporários, totalizando 5.
  //
  // O total permanente, incluindo os ganhos reservados,
  // nunca poderá ultrapassar 4.
  // =====================================================

  P.opend=Math.min(
    Math.max(0,4-P.obase),
    P.opend+1
  );

  // =====================================================
  // 2. ADICIONA ORBES TEMPORÁRIOS
  // =====================================================
  // Cada uso da super tenta adicionar 4 temporários.
  // O limite total de orbes ativos é 10.
  // Se já estiver perto do limite, adiciona somente
  // a quantidade que ainda cabe.
  // =====================================================

  P.swb=Math.min(
    10-P.obase,
    P.swb+4
  );

  // Atualiza a quantidade total de orbes ativos.
  P.orb=P.obase+P.swb;

  // =====================================================
  // 3. TEMPO DA SUPER
  // =====================================================
  // Define a duração da super.
  // Ao usar novamente, o tempo é reiniciado.
  P.swt=P.swm=9*P.s.apw;

  // Recupera 1 ponto de vida sem ultrapassar o máximo.
  P.hp=Math.min(P.max,P.hp+1);

  // =====================================================
  // 4. EFEITOS VISUAIS DA SUPER
  // =====================================================

  P.vf.push(
    {
      k:'ring',
      t:.6,
      m:.6,
      dl:0,
      c:'#b6ff7a',
      R:200,
      w:10,
      ox:-17,
      oy:16
    },
    {
      k:'ring',
      t:.45,
      m:.45,
      dl:0,
      c:'#46663a',
      R:130,
      w:6,
      ox:-17,
      oy:16
    }
  );

  // Cria partículas ao redor do Necromante.
  for(let i=0;i<22;i++){
    const a=i*.2856;

    pt.push({
      x:P.x-17+Math.cos(a)*10,
      y:P.y+16+Math.sin(a)*6,
      vx:Math.cos(a)*240,
      vy:Math.sin(a)*140-40,
      l:.6,
      m:.6,
      c:i%2?'#b6ff7a':'#46663a',
      r:3
    });
  }

  // Tremor de tela e efeito sonoro.
  shake=14;
  sfx(90,.25,.07,'sawtooth');
}
