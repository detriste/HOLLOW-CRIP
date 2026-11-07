
/* =========================================================
   LÓGICA DE CADA QUADRO DO JOGO
   =========================================================
   Esta função é executada continuamente durante a partida.
   Ela controla movimento, inimigos, balas, habilidades,
   colisões, itens, efeitos visuais e salas.
   ========================================================= */

function update(dt){

  // Atualiza o tempo geral do jogo.
  tm+=dt;

  // Atalho para acessar os atributos do jogador.
  const s=P.s;

  // =======================================================
  // REGENERAÇÃO DE VIDA
  // =======================================================
  // Se o jogador possuir regeneração, recupera 1 de vida
  // a cada 25 segundos, sem ultrapassar a vida máxima.

  if(s.regen&&(P.rg=(P.rg||0)+dt)>25){
    P.rg=0;
    P.hp=Math.min(P.max,P.hp+1);
  }

  // Reduz o tempo de recarga da habilidade.
  if(P.ac>0)P.ac-=dt;

  // =======================================================
  // EFEITO DE VENENO
  // =======================================================

  if(P.poi>0){
    P.poi-=dt;
    P.pt-=dt;

    if(Math.random()<.3)
      pt.push({
        x:P.x+rnd(-10,10),
        y:P.y,
        vx:rnd(-15,15),
        vy:-50,
        l:.5,m:.5,
        c:'#8fd04a',
        r:2.5
      });

    // A cada intervalo, o veneno causa dano.
    if(P.pt<=0){
      P.pt=1.5;

      if(P.sl.length)P.sl.pop();
      else if(P.hp>1)P.hp--;

      shake=3;
      parts(P.x,P.y,'#8fd04a',8,140);
      sfx(150,.12,.05,'sine');
    }
  }

  // =======================================================
  // FASE FANTASMA
  // =======================================================

  if(P.ph>0){
    P.ph-=dt;
    P.inv=Math.max(P.inv,.12);
  }

  // =======================================================
  // FINAL DA SUPER DO NECROMANTE
  // =======================================================
  // Quando o tempo da super termina:
  //
  // 1. Os orbes temporários desaparecem.
  // 2. Os orbes permanentes aumentam em 1 por super usada.
  // 3. O limite de permanentes é 4.
  // 4. O total passa a ser somente os permanentes.
  //
  // Exemplo:
  // Antes da primeira super: 1 orbe.
  // Durante a super: 1 permanente + 4 temporários = 5.
  // Depois da super: 2 permanentes.
  //
  // Segunda super:
  // Durante: 2 permanentes + 4 temporários = 6.
  // Depois: 3 permanentes.
  //
  // Terceira super:
  // Durante: 3 permanentes + 4 temporários = 7.
  // Depois: 4 permanentes.
  //
  // A partir daí, não ganha mais permanentes.
  // =======================================================

  if(P.swt>0 && (P.swt-=dt)<=0){

    if(P.ch.k==3){

      // Transforma em permanentes os orbes reservados
      // durante o uso da super.
      P.obase=Math.min(4,P.obase+(P.opend||0));

      // Limpa os ganhos que estavam aguardando o fim da super.
      P.opend=0;

      // Remove todos os orbes temporários.
      P.swb=0;

      // Atualiza o total de orbes ativos.
      P.orb=P.obase;

    }else{

      // Mantém o comportamento anterior dos outros heróis.
      P.orb-=5;
    }
  }

  // =======================================================
  // OUTROS TEMPORIZADORES
  // =======================================================

  if(ct>0&&(ct-=dt)<=0)cb=0;

  if(P.db>0)P.db-=dt;
  if(P.bcd>0)P.bcd-=dt;

  // =======================================================
  // MOVIMENTAÇÃO DO JOGADOR
  // =======================================================

  // Calcula a direção do movimento pelas teclas WASD.
  let ix=(K.KeyD?1:0)-(K.KeyA?1:0);
  let iy=(K.KeyS?1:0)-(K.KeyW?1:0);

  // Normaliza a direção para evitar movimento diagonal mais rápido.
  let il=hy(ix,iy)||1;
  ix/=il;
  iy/=il;

  // Verifica o terreno onde o jogador está.
  const tt=P.dash>0||P.ph>0?'':terrAt(P.x,P.y);

  const mv=ix||iy;
  const sp=s.spd*(P.ph>0?1.5:1)*
    (s.ground?1:tt=='m'?.45:tt=='w'?.65:1);

  const fast=hy(P.vx,P.vy)>sp*1.3;

  // Terreno de lava causa dano se o jogador não possuir proteção.
  if(tt=='l'&&!s.fire)hit(1);

  // Partículas de acordo com o terreno.
  if(tt&&Math.random()<.25)
    pt.push({
      x:P.x,
      y:P.y+8,
      vx:rnd(-40,40),
      vy:tt=='l'?-70:rnd(-30,10),
      l:.4,m:.4,
      c:{
        l:'#e07b2a',
        w:'#9cc4d0',
        m:'#6b4a2a',
        i:'#e4f0f4'
      }[tt],
      r:2.5
    });

  // Movimento normal ou desaceleração durante o dash.
  if(P.dash>0){
    P.dash-=dt;
  }else{
    const k=1-Math.pow(
      tt=='i'?.08:
      fast?1e-3:
      mv?1e-6:1e-8,
      dt
    );

    P.vx+=(ix*sp-P.vx)*k;
    P.vy+=(iy*sp-P.vy)*k;
  }

  if(P.dcd>0)P.dcd-=dt;

  // =======================================================
  // DASH
  // =======================================================
  // Quando o dash está disponível e o jogador solicita,
  // ele avança rapidamente na direção desejada.

  if(P.db>0&&P.dcd<=0&&P.dash<=0&&!(P.cur>0)){

    const dx=mv?ix:P.fx;
    const dy=mv?iy:P.fy;
    const l=hy(dx,dy)||1;

    P.dash=.13;
    P.dcd=s.dcd*(P.acc==2?.65:1);

    P.vx=dx/l*760;
    P.vy=dy/l*760;

    P.inv=Math.max(P.inv,.28);
    P.db=0;

    shake=4;
    sfx(300,.1,.04,'triangle');
  }

  // Partículas durante o dash ou movimento.
  if(P.dash>0){
    pt.push({
      x:P.x,y:P.y,
      vx:0,vy:0,
      l:.25,m:.25,
      c:P.ch.c,
      r:11
    });
  }else if(mv&&Math.random()<.3){
    pt.push({
      x:P.x,y:P.y+9,
      vx:rnd(-25,25),
      vy:rnd(-25,25),
      l:.3,m:.3,
      c:'#ffffff44',
      r:2
    });
  }

  // Atualiza a posição do jogador.
  P.x+=P.vx*dt;
  P.y+=P.vy*dt;

  // Impede que o jogador saia dos limites da sala.
  P.x=cl(P.x,L+P.r,RT-P.r);
  P.y=cl(P.y,U+P.r,BT-P.r);

  pushRocks(P);

  // =======================================================
  // EFEITOS E TEMPORIZADORES DO JOGADOR
  // =======================================================

  if(P.inv>0)P.inv-=dt;

  // Atualiza o ângulo dos orbes.
  P.oa+=dt*3;

  // Atualiza os efeitos visuais.
  if(P.vf)
    P.vf=P.vf.filter(f=>
      f.dl>0?(f.dl-=dt,true):(f.t-=dt)>0
    );

  if(P.bs>0)P.bs-=dt;
  if(P.gf>0)P.gf-=dt;

  // =======================================================
  // ATIVAÇÃO DA SUPER DO NECROMANTE
  // =======================================================
  // Quando o tempo de preparação termina, chama a função
  // necroSuper(), que adiciona os orbes temporários.

  if(P.pend>0&&(P.pend-=dt)<=0)necroSuper();

  // =======================================================
  // HABILIDADE DO ARTILHEIRO
  // =======================================================

  if(P.gn>0){
    P.gn-=dt;
    P.gr=(P.gr||0)+dt*2;

    while(P.gv<3&&GUN_T-P.gn>.2+P.gv*.3)
      gunVolley(++P.gv);
  }

  // =======================================================
  // DIREÇÃO DE MIRA E DISPARO
  // =======================================================

  let ax=(K.ArrowRight?1:0)-(K.ArrowLeft?1:0);
  let ay=(K.ArrowDown?1:0)-(K.ArrowUp?1:0);

  // Mira com o mouse.
  if(M.a&&!ax&&!ay){
    const mx=M.x-P.x;
    const my=M.y-P.y;
    const l=hy(mx,my)||1;

    P.fx+=(mx/l-P.fx)*.5;
    P.fy+=(my/l-P.fy)*.5;

    if(M.d){
      ax=mx;
      ay=my;
    }
  }

  // Atualiza a direção e dispara.
  if(ax||ay){
    const l=hy(ax,ay);

    P.fx+=(ax/l-P.fx)*.4;
    P.fy+=(ay/l-P.fy)*.4;

    P.cd-=dt;

    if(P.cd<=0){
      shoot(ax,ay);
      P.cd=1/s.rate*(P.cur>0?1.6:1);
    }
  }else if(P.cd>0){
    P.cd-=dt;
  }

  // =======================================================
  // PORTAS
  // =======================================================

  const dr=doors(room);

  if(room.cleared)
    for(const d of dr){

      const tx=d.a?
        (d.a>0?P.x>=RT-P.r-1:P.x<=L+P.r+1)&&
        Math.abs(P.y-300)<42:
        (d.b>0?P.y>=BT-P.r-1:P.y<=U+P.r+1)&&
        Math.abs(P.x-480)<42;

      if(tx){

        // Verifica se a porta está trancada.
        if(d.r.locked){

          if(P.keys>0){
            if(P.acc!=7)P.keys--;
            d.r.locked=false;
            sfx(700,.2);
          }else{
            if(ban.t<.3)
              ban={t:1.2,s:'Trancado — precisa de chave'};

            continue;
          }
        }

        // Entra na próxima sala.
        goRoom(d.r,[d.a,d.b]);
        return;
      }
    }

  // =======================================================
  // BALAS
  // =======================================================

  for(const b of bul){

    // Reduz o tempo de vida do projétil.
    b.l-=dt;

    // =====================================================
    // RASTREAMENTO DE INIMIGOS
    // =====================================================

    if(b.ho&&!b.h){

      let n=null,m=320;

      for(const e of en){
        const d=hy(e.x-b.x,e.y-b.y);

        if(d<m){
          m=d;
          n=e;
        }
      }

      if(n){
        const sp=hy(b.vx,b.vy);
        const a=Math.atan2(b.vy,b.vx);
        const t=Math.atan2(n.y-b.y,n.x-b.x);

        let da=Math.atan2(
          Math.sin(t-a),
          Math.cos(t-a)
        );

        const na=a+cl(da,-4*dt,4*dt);

        b.vx=Math.cos(na)*sp;
        b.vy=Math.sin(na)*sp;
      }
    }

    // Atualiza a posição da bala.
    b.x+=b.vx*dt;
    b.y+=b.vy*dt;

    // =====================================================
    // LIMITES DA SALA
    // =====================================================

    if(b.x<L||b.x>RT||b.y<U||b.y>BT){

      if(b.bo>0&&!b.h){
        b.bo--;

        if(b.x<L||b.x>RT)b.vx*=-1;
        else b.vy*=-1;

        b.x=cl(b.x,L,RT);
        b.y=cl(b.y,U,BT);

      }else{
        b.l=-1;
      }
    }

    // Colisão com pedras.
    if(rockAt(b.x,b.y)){

      if(b.h||b.bo<=0){
        b.l=-1;
      }else{
        b.bo--;
        b.vx*=-1;
        b.vy*=-1;
      }
    }

    // =====================================================
    // COLISÃO DOS ORBES DO NECROMANTE COM PROJÉTEIS
    // =====================================================
    // Cada orbe gira ao redor do jogador.
    // Se um projétil inimigo tocar um orbe, ele é destruído.
    //
    // P.orb contém o total de orbes ativos, incluindo
    // permanentes e temporários.
    // =====================================================

    if(b.h){

      if(P.orb)
        for(let i=0;i<P.orb;i++){

          const a=P.oa+i*6.283/P.orb;

          if(
            hy(
              b.x-(P.x+Math.cos(a)*46),
              b.y-(P.y+Math.sin(a)*46)
            )<14
          ){
            b.l=-1;
            parts(b.x,b.y,'#cfc08a',4,120);
          }
        }

      // Colisão do projétil inimigo com o jogador.
      if(b.l>0&&hy(b.x-P.x,b.y-P.y)<b.r+P.r-3){

        const ok=P.inv<=0&&P.dash<=0;

        hit(1);

        if(b.cu&&ok){
          P.cur=4;
          parts(P.x,P.y,'#b06aff',12,160);
          sfx(100,.3,.06,'sine');
        }

        if(b.po&&ok){
          P.poi=3;
          P.pt=1.5;
          parts(P.x,P.y,'#8fd04a',10,160);
        }

        b.l=-1;
      }

    }else{

      // ===================================================
      // COLISÃO DOS PROJÉTEIS DO JOGADOR COM INIMIGOS
      // ===================================================

      for(const e of en)
        if(
          b.l>0&&
          !(e.w>0)&&
          !(e.t=='wraith'&&e.s)&&!(e.gh>0)&&
          !b.hs.includes(e)&&
          hy(b.x-e.x,b.y-e.y)<b.r+e.r
        ){

          hurt(e,b.d,b.ab);

          b.hs.push(e);

          e.vx+=b.vx*.04;
          e.vy+=b.vy*.04;

          parts(b.x,b.y,e.c,3,150);
          sfx(260,.04,.02);

          // Explosão do projétil, caso tenha esse efeito.
          if(b.ex){
            AB=b.ab;
            boom(b.x,b.y,55,b.d*.8,false);
            AB=0;
          }

          // Verifica se o projétil atravessa inimigos.
          if(b.pi>0)b.pi--;
          else b.l=-1;
        }
    }
  }

  // Projéteis especiais que explodem ao desaparecer.
  for(const b of bul)
    if(b.mn&&b.l<=0)
      for(let i=0;i<8;i++)
        eb(b.x,b.y,i*.785,170,'#d08a3c');

  // Remove projéteis que terminaram sua duração.
  bul=bul.filter(b=>b.l>0);

  // =======================================================
  // INIMIGOS
  // =======================================================

  for(const e of en){

    // Tempo de aparecimento do inimigo.
    if(e.w>0){
      e.w-=dt;
      continue;
    }

    // Atualiza temporizadores e movimento.
    e.fl-=dt;
    e.cd-=dt;

    e.x+=e.vx*dt;
    e.y+=e.vy*dt;

    e.vx*=.9;
    e.vy*=.9;

    const a=ang(e);
    const d=hy(P.x-e.x,P.y-e.y);

    let mv=1;

    const sp0=e.sp;
    const tz=e.t=='bat'?'':terrAt(e.x,e.y);

    // Efeitos do terreno sobre os inimigos.
    if(tz=='w')e.sp*=.6;
    else if(tz=='m')e.sp*=.4;
    else if(tz=='l'){

      e.hp-=dt*(e.t=='boss'?2:5);

      if(Math.random()<.2)
        pt.push({
          x:e.x,
          y:e.y,
          vx:rnd(-30,30),
          vy:-60,
          l:.4,m:.4,
          c:'#e07b2a',
          r:3
        });
    }

    // =====================================================
    // DRONE
    // =====================================================

    if(e.t=='drone'){

      if(e.s==0){
        e.x+=Math.cos(a)*e.sp*dt;
        e.y+=Math.sin(a)*e.sp*dt;

        if(d<90){
          e.s=1;
          e.cd=.75;
          sfx(900,.1,.04);
        }

      }else{
        e.x+=Math.cos(a)*e.sp*dt*.35;
        e.y+=Math.sin(a)*e.sp*dt*.35;

        if(e.cd<=0){
          e.hp=0;
          boom(e.x,e.y,85,6,false);

          if(hy(P.x-e.x,P.y-e.y)<90+P.r)
            hit(1);

          for(let i=0;i<8;i++)
            eb(e.x,e.y,i*.785+.39,200,'#d9623f');
        }
      }

    }

    // =====================================================
    // MINI INIMIGO
    // =====================================================

    else if(e.t=='mini'){
      e.x+=Math.cos(a)*e.sp*dt;
      e.y+=Math.sin(a)*e.sp*dt;
    }

    // =====================================================
    // BLOB
    // =====================================================

    else if(e.t=='blob'){

      e.x+=Math.cos(a)*e.sp*dt;
      e.y+=Math.sin(a)*e.sp*dt;

      if(e.cd<=0){
        e.cd=2.8;

        const sv=190*(1+.08*(fl-1));

        bul.push({
          x:e.x,y:e.y,
          vx:Math.cos(a)*sv,
          vy:Math.sin(a)*sv,
          r:8,h:1,l:3.5,
          c:'#8fd04a',
          po:1
        });

        sfx(180,.12,.04,'sine');
      }
    }

    // =====================================================
    // TORRETA
    // =====================================================

    else if(e.t=='turret'){

      const k=d>240?1:d<170?-1:0;

      e.x+=(Math.cos(a)*k-Math.sin(a)*.5)*e.sp*dt;
      e.y+=(Math.sin(a)*k+Math.cos(a)*.5)*e.sp*dt;

      if(e.cd<=0){
        e.cd=1.7;

        const n=[1,3,5][fl-1];

        for(let i=0;i<n;i++)
          eb(e.x,e.y,a+(i-(n-1)/2)*.3,230,'#d9a043');
      }
    }

    // =====================================================
    // INIMIGO GIRATÓRIO
    // =====================================================

    else if(e.t=='spin'){

      e.a+=dt*2;

      e.x+=Math.cos(e.a*.7)*e.sp*dt;
      e.y+=Math.sin(e.a*.5)*e.sp*dt;

      if(e.cd<=0){
        e.cd=2;

        for(let i=0;i<8;i++)
          eb(e.x,e.y,e.a+i*.785,190,'#b08ac0');
      }
    }

    // =====================================================
    // CARREGADOR
    // =====================================================

    else if(e.t=='charger'){

      if(e.s==0){

        e.x+=Math.cos(a)*e.sp*dt*.6;
        e.y+=Math.sin(a)*e.sp*dt*.6;

        if(e.cd<=0){
          e.s=1;
          e.cd=.6;
          e.a=a;
        }

      }else if(e.s==1){

        if(e.cd<=0){
          e.s=2;
          e.cd=.9;
        }

      }else if(e.s==2){

        e.x+=Math.cos(e.a)*430*dt;
        e.y+=Math.sin(e.a)*430*dt;

        if(e.cd<=0||e.hit){
          e.s=3;
          e.cd=.7;
        }

      }else if(e.cd<=0){

        e.s=0;
        e.cd=1;
      }
    }

    // =====================================================
    // MAGO
    // =====================================================

    else if(e.t=='mage'){

      if(e.cd<=0){

        e.cd=2.6;

        e.x=rnd(L+60,RT-60);
        e.y=rnd(U+60,BT-60);

        parts(e.x,e.y,e.c,10,150);

        for(let i=-1;i<=1;i++)
          eb(e.x,e.y,ang(e)+i*.35,210,'#b58ac4');
      }
    }

    // =====================================================
    // SNIPER
    // =====================================================

    else if(e.t=='sniper'){

      const k=d>300?1:d<220?-1:0;

      e.x+=Math.cos(a)*k*e.sp*dt;
      e.y+=Math.sin(a)*k*e.sp*dt;

      if(e.s==0&&e.cd<=0){
        e.s=1;
        e.cd=.9;
        e.a=a;

      }else if(e.s==1){

        if(e.cd<=0){
          e.s=0;
          e.cd=2.4;
          eb(e.x,e.y,e.a,520,'#8fbcc0');

        }else if(e.cd>.3){
          e.a=ang(e);
        }
      }
    }

    // =====================================================
    // CURANDEIRO
    // =====================================================

    else if(e.t=='healer'){

      const k=d<280?-1:.15;

      e.x+=Math.cos(a)*k*e.sp*dt;
      e.y+=Math.sin(a)*k*e.sp*dt;

      if(e.cd<=0){

        e.cd=3;

        for(const o of en)
          if(o!=e&&o.hp<o.mhp&&hy(o.x-e.x,o.y-e.y)<260)
            o.hp=Math.min(o.mhp,o.hp+o.mhp*.4);

        parts(e.x,e.y,'#8fb86f',16,220);
        sfx(700,.15,.03,'sine');
      }
    }

    // =====================================================
    // SAPADOR
    // =====================================================

    else if(e.t=='sapper'){

      const k=d<200?-.5:1;

      e.x+=Math.cos(a)*k*e.sp*dt;
      e.y+=Math.sin(a)*k*e.sp*dt;

      if(e.cd<=0){

        e.cd=2.2;

        bul.push({
          x:e.x,y:e.y,
          vx:0,vy:0,
          r:9,h:1,l:1.8,
          mn:1,
          c:'#d08a3c'
        });
      }
    }

    // =====================================================
    // BRUTAMONTES
    // =====================================================

    else if(e.t=='brute'){

      e.x+=Math.cos(a)*e.sp*dt;
      e.y+=Math.sin(a)*e.sp*dt;

      if(e.cd<=0){

        e.cd=2.4;

        for(let i=0;i<12;i++)
          eb(e.x,e.y,i*.5236+e.a,150,'#c98b3a');

        e.a+=.2;
        shake=4;
      }

    }

    // =====================================================
    // ESPECTRO
    // =====================================================

    else if(e.t=='wraith'){

      e.q=(e.q==null?rnd(1,2):e.q)-dt;

      if(e.q<=0){

        e.s=e.s?0:1;
        e.q=e.s?1.8:2.6;

        parts(e.x,e.y,e.c,14,170);
        sfx(e.s?240:420,.15,.03,'sine');

        if(!e.s){

          for(let i=-2;i<=2;i++)
            eb(e.x,e.y,a+i*.22,270,'#a8a0c0');

          e.cd=1.2;
        }
      }

      const f=e.s?(d>50?1.5:.2):(d>200?1:-.5);
      const sd=e.s?.2:.7;

      e.x+=(Math.cos(a+1.4)*sd+Math.cos(a)*f)*e.sp*dt;
      e.y+=(Math.sin(a+1.4)*sd+Math.sin(a)*f)*e.sp*dt;

      if(e.s&&Math.random()<.25)
        pt.push({
          x:e.x+rnd(-e.r,e.r),
          y:e.y+rnd(-e.r,e.r),
          vx:0,vy:-20,
          l:.35,m:.35,
          c:'#a8a0c0',
          r:2
        });

      if(e.cd<=0&&!e.s){

        e.cd=1.5;

        for(let i=-1;i<=1;i++)
          eb(e.x,e.y,a+i*.2,260,'#a8a0c0');
      }

    }

    // =====================================================
    // MORCEGO
    // =====================================================

    else if(e.t=='bat'){

      e.a+=dt*(6+Math.sin(tm*3)*3);

      e.x+=(Math.cos(a)+Math.cos(e.a)*1.1)*e.sp*dt*.6;
      e.y+=(Math.sin(a)+Math.sin(e.a)*1.1)*e.sp*dt*.6;
    }

    // =====================================================
    // CHEFE
    // =====================================================

    else if(e.t=='boss'){

      const ph=e.hp/e.mhp>.66?0:e.hp/e.mhp>.33?1:2;

      e.a+=dt*(1+ph*.5);

      if(e.s==0){

        e.x+=Math.cos(a)*e.sp*dt*.7;
        e.y+=Math.sin(a)*e.sp*dt*.7;

        if(e.cd<=0){

          const m=(e.tb||e.sm)&&Math.random()<.6?
            pick(BX.filter(z=>z!=e.lm)):
            BP[e.bt][ri(0,BP[e.bt].length-1)];

          e.lm=m;
          e.m=m;

          if(m>=11){

            bossSpell(e,m,ph,a);

            if(ph==2&&Math.random()<.3)
              bossSpell(e,pick(BX.filter(z=>z!=m)),ph,a);

          }else if(m==0){

            for(let i=-3;i<=3;i++)
              eb(e.x,e.y,a+i*.16,260,'#a65a3a');

          }else if(m==1){

            for(let i=0;i<14+ph*4;i++)
              eb(e.x,e.y,e.a+i*6.283/(14+ph*4),200,'#d98f5a');

          }else if(m==2){

            e.s=1;
            e.a=a;
            e.q=0;

          }else if(m==3){

            e.s=2;
            e.cd=0;
            e.q=0;

          }else if(m==7){

            for(let i=0;i<20+ph*8;i++)
              eb(e.x,e.y,e.a+i*.62,120+i*7,'#d98f5a');

          }else if(m==8){

            const g=rnd(L+90,RT-90);

            for(let x=L+20;x<RT;x+=34)
              if(Math.abs(x-g)>62)
                eb(x,U+12,1.57,190+ph*30,'#7a6a9a');

          }else if(m==9){

            parts(e.x,e.y,e.c,20,200);

            e.x=rnd(L+90,RT-90);
            e.y=rnd(U+90,BT-90);

            for(let i=-2-ph;i<=2+ph;i++)
              eb(e.x,e.y,ang(e)+i*.2,300,'#d9623f');

          }else if(m==10){

            const w=mk(
              pick(['charger','sniper','turret']),
              e.x+rnd(-60,60),
              e.y+rnd(-60,60)
            );

            elite(w);
            en.push(w);

          }else if(m==5){

            for(let i=0;i<10+ph*3;i++)
              eb(rnd(L+20,RT-20),U+12,1.57,rnd(190,280),'#7a6a9a');

          }else if(m==6){

            for(let q=0;q<3;q++)
              for(let i=0;i<10+ph*2;i++)
                eb(
                  e.x,e.y,
                  q*.2+i*6.283/(10+ph*2),
                  150+q*60,
                  '#d4a93a'
                );

          }else{

            for(let i=0;i<2+ph;i++)
              en.push(
                mk(
                  pick(['drone','bat','mage']),
                  e.x+rnd(-50,50),
                  e.y+rnd(-50,50)
                )
              );
          }

          if(e.s==0)
            e.cd=(1.3-ph*.28-(fl-1)*.1)*(e.tb||e.sm?.72:1);
          else if(e.s==1)
            e.cd=.9;
        }

      }else if(e.s==1){

        if(e.cd<=0){
          e.s=3;
          e.cd=.8;
        }

      }else if(e.s==3){

        e.x+=Math.cos(e.a)*520*dt;
        e.y+=Math.sin(e.a)*520*dt;

        if(e.cd<=0||e.hit){
          e.s=0;
          e.cd=1.2;
        }

      }else if(e.s==2){

        if(e.cd<=0){

          e.cd=.07;
          e.q++;

          eb(e.x,e.y,e.q*.45,230,'#a65a3a');
          eb(e.x,e.y,e.q*.45+3.14,230,'#a65a3a');

          if(e.q>40){
            e.s=0;
            e.cd=1.4;
          }
        }
      }
    }

    // =====================================================
    // FINALIZAÇÃO DO MOVIMENTO DO INIMIGO
    // =====================================================

    e.sp=sp0;
    e.hit=0;

    // Mantém o inimigo dentro da sala.
    e.x=cl(e.x,L+e.r,RT-e.r);
    e.y=cl(e.y,U+e.r,BT-e.r);

    pushRocks(e);

    // Evita que os inimigos fiquem sobrepostos.
    for(const o of en)
      if(o!=e){

        const dx=e.x-o.x;
        const dy=e.y-o.y;
        const dl=hy(dx,dy);

        if(dl<e.r+o.r&&dl>0){
          e.x+=dx/dl*40*dt;
          e.y+=dy/dl*40*dt;
        }
      }

    // =====================================================
    // COLISÃO DO INIMIGO COM O JOGADOR
    // =====================================================

    if(d<e.r+P.r-2)
      hit(e.t=='boss'||e.el?2:1);

    // Dano causado pela fase fantasma.
    if(P.ph>0&&d<e.r+P.r+8)
      hurt(e,dt*40,1);

    // =====================================================
    // DANO CAUSADO PELOS ORBES
    // =====================================================
    // Todos os orbes ativos causam dano ao encostar nos
    // inimigos, sejam eles permanentes ou temporários.
    // =====================================================

    if(P.orb)
      for(let i=0;i<P.orb;i++){

        const q=P.oa+i*6.283/P.orb;

        if(
          hy(
            e.x-(P.x+Math.cos(q)*46),
            e.y-(P.y+Math.sin(q)*46)
          )<e.r+8
        ){
          hurt(e,dt*10,P.swt>0);
        }
      }
  }

  // =======================================================
  // REMOÇÃO DE INIMIGOS MORTOS
  // =======================================================

  for(const e of en.slice())
    if(e.hp<=0)kill(e);

  en=room.en= en.filter(e=>e.hp>0);

  // =======================================================
  // VERIFICA SE A SALA FOI LIMPA
  // =======================================================

  if(!room.cleared&&!en.length&&!room.tot){

    room.cleared=true;

    clearHz();
    sfx(660,.3,.05,'triangle');

    if(room.summ){

      room.summ=0;

      pk.push({
        t:'i',
        id:27,
        x:480,y:300,
        pr:0
      });

      ban={
        t:3.5,
        s:'Os dois chefes caíram! Item recebido'
      };

    }else if(room.t=='boss'){

      room.pk.push({
        t:'i',
        id:take(),
        x:480,y:260,
        pr:0
      });

      room.trap={x:480,y:410};

      bossRooms(room);

    }else if(room.tb){

      pk.push({
        t:'i',
        id:ri(24,26),
        x:480,y:300,
        pr:0
      });

    }else if(Math.random()<.05){

      pk.push({
        t:'i',
        id:take(),
        x:480,y:300,
        pr:0
      });

    }else if(Math.random()<.95){

      pk.push({
        t:dropT(Math.random()),
        x:480,y:300,
        pr:0
      });
    }
  }

  // =======================================================
  // ARMADILHA DA SALA DO CHEFE
  // =======================================================

  if(room.trap&&hy(P.x-480,P.y-410)<26){

    if(fl>=3){
      st='win';
      return;
    }

    fl++;
    newFloor();
    return;
  }

  // =======================================================
  // COLETA DE ITENS E PICKUPS
  // =======================================================

  for(const q of pk.slice()){

    if(!pk.includes(q)||q.nx>tm)continue;

    const dq=hy(q.x-P.x,q.y-P.y);

    // Alguns itens são atraídos pelo jogador.
    if(
      !q.pr&&
      q.t!='i'&&
      q.t!='x'&&
      dq<(P.acc==3?220:100)&&
      dq>1&&
      !(q.t=='h'&&P.hp>=P.max)
    ){

      q.x+=(P.x-q.x)/dq*260*dt;
      q.y+=(P.y-q.y)/dq*260*dt;
    }

    // Verifica a distância para coletar o item.
    if(dq>24||(q.t=='h'&&P.hp>=P.max))
      continue;

    // Verifica se o jogador possui moedas suficientes.
    if(q.pr>P.coins){

      if(ban.t<.3)
        ban={
          t:1.2,
          s:'Moedas insuficientes ('+q.pr+')'
        };

      continue;
    }

    // Alguns itens diminuem a vida máxima.
    if(q.ph){

      if(P.max<=q.ph){

        if(ban.t<.3)
          ban={
            t:1.2,
            s:'Vida insuficiente'
          };

        continue;
      }

      P.max-=q.ph;
      P.hp=Math.min(P.hp,P.max);
    }

    // Remove outros itens pertencentes ao mesmo grupo.
    if(q.g)
      for(const o of pk.slice())
        if(o!=q&&o.g)
          pk.splice(pk.indexOf(o),1);

    // Desconta o preço do item.
    P.coins-=q.pr;

    // =====================================================
    // EFEITOS DE CADA TIPO DE ITEM
    // =====================================================

    if(q.t=='c'){

      P.coins++;

    }else if(q.t=='h'){

      P.hp=Math.min(P.max,P.hp+2);

    }else if(q.t=='b'){

      P.bombs++;

    }else if(q.t=='k'){

      P.keys++;

    }else if(q.t=='a'||q.t=='n'){

      P.sl.push(q.t,q.t);
      P.sl=P.sl.slice(-12);

    }else if(q.t=='e'){

      P.max+=2;
      P.hp=Math.min(P.max,P.hp+2);

    }else if(q.t=='s'){

      P.sm=(P.sm||0)+1;

      ban={
        t:3.5,
        s:'Totem de Invocação — aperte '+kn('summon')+' numa sala limpa',
        ic:['p',3]
      };

    }else if(q.t=='x'){

      if(P.acc>=0)
        pk.push({
          t:'x',
          id:P.acc,
          x:q.x,
          y:q.y+40,
          pr:0,
          nx:tm+1.5
        });

      P.acc=q.id;

      ban={
        t:3.5,
        s:ACC[q.id][0]+' — '+ACC[q.id][1],
        ic:['x',q.id]
      };

    }else{

      // Aplica o efeito do item nos atributos do jogador.
      const it=IT[q.id];

      it[2](P.s,P);

      P.items.push(q.id);

      ban={
        t:3.5,
        s:it[0]+' — '+it[1],
        ic:['i',q.id]
      };
    }

    // Remove o item coletado.
    pk.splice(pk.indexOf(q),1);

    sfx(880,.12,.04,'triangle');
  }

  // =======================================================
  // ATUALIZAÇÃO DE EFEITOS E BOMBAS
  // =======================================================

  hzUp(dt);

  for(const b of bm.slice()){

    b.t-=dt;

    if(b.t<=0){

      bm.splice(bm.indexOf(b),1);

      if(b.ib!=null)
        ibomb(b);
      else
        boom(b.x,b.y,110,40,true);
    }
  }

  // =======================================================
  // EVENTO DE INVOCAÇÃO DE CHEFES
  // =======================================================

  if(room.tot){

    const t=room.tot;

    t.t-=dt;

    if(Math.random()<.5)
      pt.push({
        x:t.x+rnd(-30,30),
        y:t.y+rnd(-30,30),
        vx:0,
        vy:-60,
        l:.5,m:.5,
        c:'#8c6f9e',
        r:3
      });

    if(t.t<=0){

      room.tot=null;

      const cs=[
        [200,150],
        [760,150],
        [200,450],
        [760,450]
      ].sort((a,b)=>
        hy(b[0]-P.x,b[1]-P.y)-
        hy(a[0]-P.x,a[1]-P.y)
      );

      // Invoca dois chefes em posições afastadas do jogador.
      for(let i=0;i<2;i++){

        const b=mk('boss',cs[i][0],cs[i][1]);
        const k=ri(0,4);

        b.bt=k;
        b.c=BN[k][1];
        b.nm=BN[k][0]+' (invocado)';
        b.sm=1;

        if(k==2)b.sp*=1.5;

        en.push(b);
      }

      ban={
        t:2.5,
        s:'Dois chefes foram invocados!'
      };

      shake=14;
      sfx(70,.5,.09,'sawtooth');
    }
  }

  // =======================================================
  // PARTÍCULAS
  // =======================================================

  // Remove partículas cujo tempo acabou.
  pt=pt.filter(p=>(p.l-=dt)>0);

  // Atualiza posição e velocidade das partículas.
  for(const p of pt){

    p.x+=p.vx*dt;
    p.y+=p.vy*dt;

    p.vx*=.93;
    p.vy*=.93;
  }

  // =======================================================
  // FINALIZAÇÃO DO QUADRO
  // =======================================================

  // Reduz gradualmente o tremor da tela.
  shake*=.88;

  // Reduz o tempo das mensagens exibidas na tela.
  ban.t-=dt;
}
