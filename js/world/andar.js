
/* ============================================================
   GERAÇÃO DE ANDARES, SALAS, PORTAS, TERRENO E NAVEGAÇÃO
   ============================================================ */


/* ============================================================
   CRIA SALAS ESPECIAIS ADICIONAIS
   ============================================================ */

function bossRooms(r){

  // Procura espaços vazios ao redor da sala recebida.
  const c = D4.map(([a,b]) => [r.x+a,r.y+b])
    .filter(([x,y]) =>
      x>=0 && y>=0 && x<7 && y<7 && !G[x+','+y]
    );

  // Prioriza espaços que possuem apenas uma conexão.
  let f = c.filter(([x,y]) =>
    D4.filter(([a,b]) => G[(x+a)+','+(y+b)]).length == 1
  );

  if(!f.length) f = c;

  // Adiciona uma sala especial em uma posição disponível.
  const add = t => {
    if(!f.length) return;

    const [x,y] = f.splice(ri(0,f.length-1),1)[0];
    G[x+','+y] = {x,y,t};
  };

  // Sempre adiciona uma loja.
  add('shop');

  // Sorteia uma sala do diabo ou do anjo.
  const q = Math.random();

  if(q < .25) add('devil');
  else if(q < .4) add('angel');

  ban = {t:3,s:'Novas portas se abriram'};
}


/* ============================================================
   GERA O TERRENO DA SALA
   ============================================================ */

function genTerr(r){

  r.tm = {};

  // Quantidade de áreas de terreno.
  const n = ri(0,3) + (fl>1 ? 1 : 0);

  for(let b=0;b<n;b++){

    // Tipo de terreno disponível no andar atual.
    const t = pick(TB[fl-1]);

    const m = ri(3,9);

    let x = ri(1,12);
    let y = ri(1,6);

    // Espalha o terreno pelo mapa.
    for(let i=0;i<m;i++){

      if(
        x>=0 && x<14 &&
        y>=0 && y<8 &&
        !safe(x,y) &&
        !r.rocks.some(o => o.x==x && o.y==y)
      ){
        r.tm[tk(x,y)] = t;
      }

      const [d,e] = pick(D4);

      x += d;
      y += e;
    }
  }
}


/* ============================================================
   INICIA UM NOVO ANDAR
   ============================================================ */

function newFloor(){

  G = genFloor();

  goRoom(G['3,3'],null);

  ban = {
    t:3.5,
    s:'Andar '+fl+' — '+FN[fl-1]
  };
}


/* ============================================================
   FUNÇÕES AUXILIARES DE SALAS
   ============================================================ */

// Retorna uma sala vizinha.
const nb = (r,a,b) => G[(r.x+a)+','+(r.y+b)];

// Calcula a distância da sala inicial.
const dd = r => Math.abs(r.x-3)+Math.abs(r.y-3);


/* ============================================================
   GERA O MAPA DO ANDAR
   ============================================================ */

function genFloor(){

  // A sala central sempre é a sala inicial.
  const g = {
    '3,3':{x:3,y:3,t:'start'}
  };

  const cells = [[3,3]];

  const n = 7 + fl*2 + ri(0,2);

  G = g;

  // Cria as salas conectadas.
  while(cells.length<n){

    const [cx,cy] = pick(cells);
    const [dx,dy] = pick(D4);

    const x = cx+dx;
    const y = cy+dy;

    // Impede salas fora do mapa ou duplicadas.
    if(x<0 || y<0 || x>6 || y>6 || g[x+','+y]) continue;

    let k = 0;

    for(const [a,b] of D4){
      if(g[(x+a)+','+(y+b)]) k++;
    }

    // Evita excesso de conexões.
    if(k>1 && Math.random()<.75) continue;

    g[x+','+y] = {x,y,t:'n'};

    cells.push([x,y]);
  }

  // Calcula a prioridade de cada sala para receber
  // os tipos especiais.
  const sc = r =>
    (D4.filter(([a,b]) => nb(r,a,b)).length==1 ? 100 : 0)
    + dd(r)
    + Math.random();

  const c = Object.values(g)
    .filter(r => r.t=='n')
    .sort((a,b) => sc(b)-sc(a));

  // Define as salas especiais principais.
  c[0].t = 'boss';

  c[1].t = 'treasure';
  c[1].locked = true;

  c[2].t = 'shop';

  // Procura uma posição para a sala secreta.
  const e = [];

  for(let x=0;x<7;x++){
    for(let y=0;y<7;y++){

      if(!g[x+','+y]){

        const k = D4.filter(([a,b]) =>
          g[(x+a)+','+(y+b)]
        ).length;

        if(k) e.push([x,y,k]);
      }
    }
  }

  // Prioriza espaços com mais conexões.
  e.sort((a,b) => b[2]-a[2] || Math.random()-.5);

  if(e.length){

    g[e[0][0]+','+e[0][1]] = {
      x:e[0][0],
      y:e[0][1],
      t:'secret',
      sec:1
    };
  }

  return g;
}


/* ============================================================
   RETORNA AS PORTAS DISPONÍVEIS
   ============================================================ */

function doors(r){

  return D4.map(([a,b]) => ({
    a,
    b,
    r:nb(r,a,b)
  })).filter(d =>
    d.r && (!d.r.sec || d.r.rev)
  );
}


/* ============================================================
   INICIALIZA UMA SALA
   ============================================================ */

function initRoom(r){

  r.init = 1;

  r.rocks = [];
  r.en = [];
  r.pk = [];
  r.cleared = true;


  /* ----------------------------------------------------------
     CRIA PEDRAS E OBSTÁCULOS
     ---------------------------------------------------------- */

  if(r.t=='n' || r.t=='boss'){

    const ly = r.t=='n' ? ri(0,4) : 0;
    const q = ly ? 0 : r.t=='n' ? ri(4,9) : 2;

    // Carrega o desenho do terreno predefinido.
    if(ly){

      LY[ly-1].split(' ').forEach((w,y) =>
        [...w].forEach((c,x) => {
          if(c=='#') r.rocks.push({x,y});
        })
      );
    }

    // Cria obstáculos aleatórios.
    for(let i=0;i<q;i++){

      const tx = ri(0,13);
      const ty = ri(0,7);

      // Mantém a região central livre.
      if(
        (tx>=5 && tx<=8 && ty>=2 && ty<=5) ||
        (tx>=6 && tx<=7 && (ty<2 || ty>5)) ||
        (ty>=3 && ty<=4 && (tx<2 || tx>11))
      ) continue;

      r.rocks.push({x:tx,y:ty});
    }
  }


  // Gera o terreno da sala.
  if(r.t=='n' || r.t=='boss') genTerr(r);


  /* ========================================================
     SALA NORMAL: GERA OS INIMIGOS
     ======================================================== */

  if(r.t=='n'){

    r.cleared = false;

    // Lista de inimigos disponíveis por andar.
    const pl = [
      ['drone','turret','blob','bat','sapper','seal','rep'],

      ['charger','spin','sniper','healer','turret',
       'blob','sapper','brute','bat',
       'seal','bomber','frost','rep'],

      ['mage','sniper','charger','spin','healer',
       'wraith','wraith','brute','turret',
       'seal','bomber','frost','frost','rep']
    ][fl-1];

    const n = ri(2,3)+fl+(fl>1?1:0);

    for(let i=0;i<n;i++){

      let x,y,k=0;

      // Procura uma posição segura para o inimigo.
      do{

        x = rnd(L+60,RT-60);
        y = rnd(U+60,BT-60);

        k++;

      }while(
        k<30 &&
        (
          hy(x-P.x,y-P.y)<230 ||
          r.tm[tk(Math.floor((x-L)/TS),Math.floor((y-U)/TS))]=='l' ||
          r.rocks.some(o =>
            Math.abs(x-(L+o.x*TS+30))<45 &&
            Math.abs(y-(U+o.y*TS+30))<45
          )
        )
      );

      const m = mk(pick(pl),x,y);

      // Chance de criar um inimigo de elite.
      if(Math.random()<.13+.03*fl) elite(m);

      r.en.push(m);

      // Morcegos podem aparecer acompanhados.
      if(m.t=='bat'){
        for(let j=1;j<3;j++){
          r.en.push(mk('bat',x+j*22,y+j*10));
        }
      }
    }
  }


  /* ========================================================
     SALA DE CHEFE: TODOS OS BOSSES VOLTAM A APARECER
     ======================================================== */

  if(r.t=='boss'){

    r.cleared = false;

    // Cria o chefe.
    const b = mk('boss',480,200);

    // Escolhe aleatoriamente um chefe conforme o andar:
    //
    // 1º andar: chefes 0 e 1.
    // 2º andar: chefes 2, 3 e 5.
    // 3º andar: chefes 4, 3, 2 e 5.
    //
    // Assim, todos os chefes voltam a aparecer.
    const i = pick([
      [0,1],
      [2,3,5],
      [5]
    ][fl-1]);

    // Aplica a identificação e aparência do chefe.
    b.bt = i;
    b.c = BN[i][1];
    b.nm = BN[i][0];

    // Mantém o bônus especial do chefe de índice 2.
    if(i==2) b.sp *= 1.5;

    r.en.push(b);

    ban = {
      t:2.5,
      s:b.nm
    };
  }


  /* ========================================================
     SALA DO TESOURO
     ======================================================== */

  if(r.t=='treasure'){

    // Chance de aparecer um chefe guardando o tesouro.
    if(Math.random()<.17){

      r.cleared = false;
      r.tb = 1;

      const b = mk('boss',480,200);

      // Chefe aleatório para proteger o tesouro.
      b.bt = ri(0,4);

      b.c = '#d4a93a';
      b.nm = 'Guardião do Tesouro';

      b.hp = b.mhp = b.hp*1.6;
      b.sp *= 1.25;
      b.tb = 1;

      r.en.push(b);

      ban = {
        t:2.5,
        s:b.nm
      };

    }else{

      // Caso não apareça chefe, coloca o item diretamente.
      r.pk.push({
        t:'i',
        id:take(),
        x:480,
        y:300,
        pr:0
      });
    }
  }


  /* ========================================================
     SALA DO DIABO
     ======================================================== */

  if(r.t=='devil'){

    r.pk.push(
      {t:'i',id:take(),x:400,y:300,pr:0,ph:2},
      {t:'i',id:take(),x:560,y:300,pr:0,ph:2}
    );
  }


  /* ========================================================
     SALA DO ANJO
     ======================================================== */

  if(r.t=='angel'){

    r.pk.push(
      {t:'i',id:take(),x:400,y:300,pr:0,g:1},
      {t:'i',id:take(),x:560,y:300,pr:0,g:1}
    );
  }


  /* ========================================================
     SALA SECRETA
     ======================================================== */

  if(r.t=='secret'){

    // Coloca três itens aleatórios.
    for(let i=0;i<3;i++){

      r.pk.push({
        t:pick(['c','c','b','k','a','h']),
        x:400+i*80,
        y:300,
        pr:0
      });
    }

    // Chance de aparecer um acessório.
    if(Math.random()<.35){

      r.pk.push({
        t:'x',
        id:accessory(),
        x:480,
        y:230,
        pr:0
      });
    }
  }


  /* ========================================================
     LOJA
     ======================================================== */

  if(r.t=='shop'){

    r.pk.push(

      // Itens.
      {t:'i',id:take(),x:300,y:250,pr:12+fl*3},
      {t:'i',id:take(),x:420,y:250,pr:10+fl*3},

      // Acessório.
      {t:'x',id:accessory(),x:540,y:250,pr:14},

      // Melhorias e recursos.
      {t:'a',x:660,y:250,pr:6},
      {t:'h',x:300,y:360,pr:4},
      {t:'b',x:420,y:360,pr:5},
      {t:'k',x:540,y:360,pr:5}
    );
  }
}


/* ============================================================
   RETIRA UM ITEM DA LISTA DISPONÍVEL
   ============================================================ */

function take(){

  // Recarrega a lista quando todos os itens forem utilizados.
  if(!pool.length){
    pool = IT.slice(0,24).map((_,i)=>i);
  }

  return pool.splice(ri(0,pool.length-1),1)[0];
}


/* ============================================================
   ENTRA EM UMA SALA
   ============================================================ */

function goRoom(r,d){

  // Garante um pequeno período de invulnerabilidade na entrada.
  P.inv = Math.max(P.inv,.7);

  room = r;

  // Inicializa a sala apenas na primeira visita.
  if(!r.init) initRoom(r);

  r.vis = 1;

  // Atualiza as referências dos inimigos e itens.
  en = r.en;
  pk = r.pk;

  // Limpa projéteis, bombas e efeitos anteriores.
  bul = [];
  bm = [];

  clearHz();

  // Define a posição inicial do jogador.
  if(d){

    P.x = d[0]==1 ? L+40 :
          d[0]==-1 ? RT-40 : 480;

    P.y = d[1]==1 ? U+40 :
          d[1]==-1 ? BT-40 : 300;

  }else{

    // Posição padrão para entrar em uma sala.
    P.x = 480;
    P.y = 300;
  }
}
