/* ============================================================
   HUD DURANTE O JOGO E MAPA
   ============================================================ */


/* ------------------------------------------------------------
   ANIMAÇÃO DE ALTERAÇÃO DOS ELEMENTOS DO HUD

   Detecta quando um valor muda e aplica uma pequena animação
   de aumento, dando destaque à alteração.
   ------------------------------------------------------------ */
function pp(k,v){
  // Cria o registro da animação caso ainda não exista.
  const o=HU[k]||(HU[k]={v,t:0});

  // Se o valor mudou, reinicia a animação.
  if(o.v!=v){
    o.v=v;
    o.t=.35;
  }

  // Diminui o tempo da animação.
  o.t-=DT;

  // Retorna a escala do elemento.
  return 1+Math.max(0,o.t)*1.2;
}


/* ------------------------------------------------------------
   DESENHO DOS CORAÇÕES DE VIDA

   x, y = posição do coração.
   v    = quantidade de vida representada.
   s    = tamanho do coração.
   col  = cor do preenchimento.
   ------------------------------------------------------------ */
function heart(x,y,v,s,col){
  X.save();

  // Posiciona e define o tamanho do coração.
  X.translate(x,y);
  X.scale(s,s);

  // Configura o contorno.
  X.lineWidth=2.5;
  X.strokeStyle='#1c130d';
  X.lineJoin='round';

  // Desenha o formato do coração.
  const p=()=>{
    X.beginPath();
    X.moveTo(0,10);
    X.bezierCurveTo(-16,-2,-10,-14,0,-6);
    X.bezierCurveTo(10,-14,16,-2,0,10);
    X.closePath();
  };

  // Desenha o fundo do coração.
  p();
  X.fillStyle='#3b2a25';
  X.fill();

  // Preenche a quantidade de vida disponível.
  if(v>0){
    X.save();

    p();
    X.clip();

    X.fillStyle=col||'#b5342f';

    // Coração cheio ou meio coração.
    X.fillRect(-20,-20,v>1?40:20,40);

    X.restore();
  }

  // Desenha o contorno novamente.
  p();
  X.stroke();

  X.restore();
}


/* ------------------------------------------------------------
   DESENHO PRINCIPAL DO HUD

   Exibe:
   - Vida do jogador.
   - Barra de recarga do dash.
   - Habilidade especial.
   - Moedas, bombas e chaves.
   - Itens e acessórios.
   - Andar e quantidade de abates.
   - Efeitos e informações adicionais.
   ------------------------------------------------------------ */
function drawHUD(){

  // Desenha a base da interface.
  base();

  // Informações do personagem.
  const h=P.ch,c=h.c,lo=P.hp<=2;

  // Esconde o cursor durante o jogo quando necessário.
  C.style.cursor=st=='play'&&M.a?'none':'default';


  /* ----------------------------------------------------------
     ILUMINAÇÃO ESCURA NAS BORDAS DA TELA
     ---------------------------------------------------------- */
  const lg=X.createRadialGradient(P.x,P.y,90,P.x,P.y,450);

  lg.addColorStop(0,'rgba(8,6,4,0)');
  lg.addColorStop(1,'rgba(8,6,4,.7)');

  X.fillStyle=lg;
  X.fillRect(0,0,W,H);


  /* ----------------------------------------------------------
     EFEITO VISUAL DE INVULNERABILIDADE
     ---------------------------------------------------------- */
  if(P.inv>.8){
    X.fillStyle='rgba(150,20,10,'+(P.inv-.8)*.9+')';
    X.fillRect(0,0,W,H);
  }


  /* ----------------------------------------------------------
     AVISO DE ENVENENAMENTO
     ---------------------------------------------------------- */
  if(P.poi>0){
    X.fillStyle='rgba(90,170,40,.10)';
    X.fillRect(0,0,W,H);

    txt(
      'ENVENENADO '+P.poi.toFixed(1)+'s',
      62,72,11,'#8fd04a','left'
    );
  }


  /* ----------------------------------------------------------
     AVISO DE MALDIÇÃO
     ---------------------------------------------------------- */
  if(P.cur>0){
    X.fillStyle='rgba(120,50,170,.12)';
    X.fillRect(0,0,W,H);

    txt(
      'AMALDIÇOADO '+P.cur.toFixed(1)+'s — sem dash, tiros lentos',
      62,86,11,'#c08aff','left'
    );
  }


  /* ----------------------------------------------------------
     RETRATO DO PERSONAGEM
     ---------------------------------------------------------- */

  // Fundo do retrato.
  X.fillStyle='#1a1612';
  X.strokeStyle='#4a4032';
  X.lineWidth=2;

  X.beginPath();
  X.roundRect(8,6,46,46,8);
  X.fill();
  X.stroke();

  // Desenha o personagem dentro do retrato.
  body(h,31,28,11,Math.atan2(P.fy,P.fx),0,tm);


  /* ----------------------------------------------------------
     CORAÇÕES DE VIDA
     ---------------------------------------------------------- */

  // Animação quando a vida muda.
  const hb=pp('hp',P.hp);

  // Desenha os corações de vida.
  for(let i=0;i<P.max/2;i++){
    heart(
      76+i*28,
      26,
      P.hp-i*2,
      hb*(lo
        ?1+.14*Math.max(0,Math.sin(tm*9))
        :1+.03*Math.sin(tm*2+i)
      )
    );
  }

  // Desenha os corações de vida extra.
  for(let i=0;i<Math.ceil(P.sl.length/2);i++){
    heart(
      76+(P.max/2+i)*28,
      26,
      P.sl.length-i*2,
      hb,
      P.sl[i*2]=='n'?'#55505e':'#7fa6c4'
    );
  }


  /* ----------------------------------------------------------
     BARRA DE RECARGA DO DASH
     ---------------------------------------------------------- */

  // Fundo da barra.
  X.fillStyle='#ffffff18';
  X.fillRect(62,44,90,5);

  // Preenchimento da barra.
  X.fillStyle=P.dcd>0?'#6b6354':c;
  X.fillRect(
    62,
    44,
    90*(1-Math.max(0,P.dcd)/P.s.dcd),
    5
  );

  // Nome da habilidade de movimento.
  txt('dash',158,50,10,'#9a8f7c','left');


  /* ----------------------------------------------------------
     HABILIDADE ESPECIAL

     O ícone continua aparecendo normalmente.
     O círculo mostra o tempo de recarga.

     REMOVIDO:
     txt('Q',60,575,...)

     Isso remove somente a letra Q da interface,
     sem alterar o funcionamento da habilidade.
     ---------------------------------------------------------- */

  // Calcula o tempo de recarga.
  const am=h.cd*P.s.acd;
  const ar=P.ac>0?1-P.ac/am:1;
  const rd=ar>=1;

  // Desenha o círculo de fundo.
  X.lineWidth=4;
  X.strokeStyle='#ffffff22';

  X.beginPath();
  X.arc(36,570,18,0,6.283);
  X.stroke();

  // Desenha o progresso da recarga.
  X.strokeStyle=rd?c:'#6b6354';

  X.beginPath();
  X.arc(
    36,
    570,
    18+(rd?Math.sin(tm*5)*1.5:0),
    -1.57,
    -1.57+6.283*ar
  );

  X.stroke();

  // Deixa o ícone mais transparente enquanto recarrega.
  X.globalAlpha=rd?1:.4;

  // Desenha o ícone da habilidade.
  icon('q',h.k,36,570,23);

  // Restaura a transparência.
  X.globalAlpha=1;


  /* ----------------------------------------------------------
     MOEDAS, BOMBAS E CHAVES

     Exibe os três contadores na parte inferior esquerda.
     ---------------------------------------------------------- */
  const cn=(k,v,ic,x,col)=>{

    // Anima quando a quantidade muda.
    const z=pp(k,v);

    X.save();

    X.translate(x,575);
    X.scale(z,z);

    // Desenha o ícone do recurso.
    icon('p',ic,8,-5,22);

    // Exibe a quantidade.
    txt('×'+v,24,0,15,col,'left');

    X.restore();
  };

  // Contador de moedas.
  cn('c',P.coins,0,70,'#d4a93a');

  // Contador de bombas.
  cn('b',P.s.ibomb?'∞':P.bombs,1,136,'#c98b3a');

  // Contador de chaves.
  cn('k',P.keys,2,202,'#e8dcc8');


  /* ----------------------------------------------------------
     ITENS COLETADOS

     Mostra os últimos 8 itens adquiridos.
     O último item recebe uma animação de destaque.
     ---------------------------------------------------------- */

  const ps=pp('it',P.items.length);

  P.items.slice(-8).forEach((id,i,a)=>{

    // Verifica se é o item mais recente.
    const l=i==a.length-1;

    // Aplica animação somente ao último item.
    const z=l?ps:1;

    X.save();

    X.translate(281+i*28,569);
    X.scale(z,z);

    // Fundo do espaço do item.
    X.fillStyle='#1a1612';

    // Contorno do item mais recente.
    X.strokeStyle=l&&ps>1?'#d4a93a':'#4a4032';

    X.lineWidth=1.5;

    X.beginPath();
    X.roundRect(-11,-11,22,22,5);
    X.fill();
    X.stroke();

    // Desenha o ícone do item.
    icon('i',id,0,0,19);

    X.restore();
  });


  /* ----------------------------------------------------------
     INVENTÁRIO E CONTROLES
     ---------------------------------------------------------- */

  // Texto do inventário.
  txt(
    kn('inv')+' inventário',
    500,573,11,'#9a8f7c','left'
  );

  // Controles de mapa, reinício e pausa.
  txt(
    kn('map')+' mapa · '+kn('restart')+' reiniciar · '+kn('pause')+' pausa',
    500,590,10,'#9a8f7c','left'
  );


  /* ----------------------------------------------------------
     ACESSÓRIO EQUIPADO
     ---------------------------------------------------------- */

  if(P.acc>=0){

    // Pequena animação de pulsação.
    const z=1+Math.sin(tm*3)*.04;

    X.save();

    X.translate(627,569);
    X.scale(z,z);

    // Fundo do acessório.
    X.fillStyle='#1a1612';
    X.strokeStyle='#8fb0a0';
    X.lineWidth=1.5;

    X.beginPath();
    X.roundRect(-11,-11,22,22,5);
    X.fill();
    X.stroke();

    // Desenha o ícone do acessório.
    icon('x',P.acc,0,0,19);

    X.restore();

    // Nome do acessório.
    txt(
      ACC[P.acc][0],
      644,573,10,'#9a8f7c','left'
    );
  }


  /* ----------------------------------------------------------
     ANDAR ATUAL E ABATES
     ---------------------------------------------------------- */

  txt(
    'ANDAR '+fl+' · '+FN[fl-1],
    RT,567,11,'#9a8f7c','right'
  );

  txt(
    kills+' abates',
    RT,583,11,'#9a8f7c','right'
  );


  /* ----------------------------------------------------------
     INFORMAÇÕES ESPECÍFICAS DOS PERSONAGENS
     ---------------------------------------------------------- */

  // Personagem 0: escudo.
  if(h.k==0){
    txt(
      'escudo '+(P.so|0)+'/5',
      196,50,10,'#c8b48a','left'
    );
  }

  // Personagem 1: almas.
  if(h.k==1){
    txt(
      'almas '+(P.sk|0)+'/10',
      196,50,10,'#7fa6c4','left'
    );
  }


  /* ----------------------------------------------------------
     CONTADOR DE SUPER / EFEITO ESPECIAL
     ---------------------------------------------------------- */

  if(P.sm>0){

    // Ícone do efeito especial.
    icon('p',3,872,84,28);

    // Quantidade de cargas.
    txt(
      'C ×'+P.sm,
      950,90,13,'#c9b6e8','right'
    );
  }


  /* ----------------------------------------------------------
     SISTEMA DE COMBO
     ---------------------------------------------------------- */

  if(cb>1){

    // Animação de aumento do texto.
    const pu=1+Math.max(0,ct-2.8)*1.5;

    X.save();

    X.translate(480,32);
    X.scale(pu,pu);

    // Texto do combo.
    txt(
      'COMBO ×'+cb,
      0,0,
      18+Math.min(cb,10),
      '#b04a32'
    );

    X.restore();

    // Barra de duração do combo.
    X.fillStyle='#b04a32';
    X.fillRect(420,40,120*ct/3,3);
  }


  /* ----------------------------------------------------------
     MIRA DO JOGADOR

     Desenha uma mira quando o mouse está ativo durante o jogo.
     ---------------------------------------------------------- */

  if(M.a&&st=='play'){

    X.strokeStyle=c;
    X.lineWidth=2;

    X.beginPath();

    // Círculo central.
    X.arc(M.x,M.y,9,0,6.283);

    // Linha esquerda.
    X.moveTo(M.x-16,M.y);
    X.lineTo(M.x-5,M.y);

    // Linha direita.
    X.moveTo(M.x+5,M.y);
    X.lineTo(M.x+16,M.y);

    // Linha superior.
    X.moveTo(M.x,M.y-16);
    X.lineTo(M.x,M.y-5);

    // Linha inferior.
    X.moveTo(M.x,M.y+5);
    X.lineTo(M.x,M.y+16);

    X.stroke();
  }
}


/* ============================================================
   MAPA DO JOGO
   ============================================================ */


/* ------------------------------------------------------------
   DESENHA A TELA DO MAPA

   Mostra as salas descobertas, suas conexões e seus tipos.
   ------------------------------------------------------------ */
function drawMap(){

  // Desenha a base da tela.
  base();

  // Fundo escuro do mapa.
  X.fillStyle='#000d';
  X.fillRect(0,0,W,H);

  // Título com o andar atual.
  txt(
    'Mapa — '+FN[fl-1],
    480,64,24,'#d8cbb0'
  );


  /* ----------------------------------------------------------
     DESENHO DAS SALAS
     ---------------------------------------------------------- */

  // Percorre todas as salas existentes.
  for(const r of Object.values(G)){

    // Verifica se a sala está visível.
    const vs=r.vis;

    // Verifica se alguma sala conectada está visível.
    const adj=doors(r).some(d=>d.r.vis);

    // Não mostra salas desconhecidas ou secretas não reveladas.
    if((!vs&&!adj)||(r.sec&&!r.rev))continue;

    // Calcula a posição da sala no mapa.
    const x=480+(r.x-3)*76-30;
    const y=310+(r.y-3)*54-20;


    /* --------------------------------------------------------
       CONEXÕES ENTRE AS SALAS
       -------------------------------------------------------- */

    for(const d of doors(r)){

      // Conexão horizontal.
      if(d.a>0){
        X.fillStyle='#4a4032';
        X.fillRect(x+60,y+16,16,8);
      }

      // Conexão vertical.
      if(d.b>0){
        X.fillStyle='#4a4032';
        X.fillRect(x+26,y+40,8,14);
      }
    }


    /* --------------------------------------------------------
       APARÊNCIA DA SALA
       -------------------------------------------------------- */

    // Cor de salas ainda não descobertas.
    // Salas descobertas recebem a cor correspondente ao tipo.
    X.fillStyle=!vs?'#ffffff22':rc(r);

    // Destaca a sala onde o jogador está.
    X.strokeStyle=r==room?'#fff':'#1c130d';

    // Aumenta o contorno da sala atual.
    X.lineWidth=r==room?4:2;

    // Desenha o retângulo da sala.
    X.fillRect(x,y,60,40);
    X.strokeRect(x,y,60,40);


    /* --------------------------------------------------------
       ÍCONES DOS TIPOS DE SALA
       -------------------------------------------------------- */

    // Escolhe o símbolo conforme o tipo da sala.
    const ic=vs
      ?{
        boss:'☠',
        shop:'$',
        treasure:'★',
        devil:'D',
        angel:'A',
        secret:'?'
      }[r.t]||(r.t=='n'&&!r.cleared?'!':'')
      :'';

    // Desenha o símbolo quando existir.
    if(ic){
      txt(ic,x+30,y+27,18,'#1c130d');
    }
  }


  /* ----------------------------------------------------------
     LEGENDA DO MAPA

     Explica o significado dos símbolos.
     ---------------------------------------------------------- */

  txt(
    '☠ chefe   $ loja   ★ tesouro   D demônio   A anjo   ? secreta   ! sala com inimigos',
    480,560,12,'#9a8f7c'
  );


  /* ----------------------------------------------------------
     INSTRUÇÃO PARA VOLTAR AO JOGO
     ---------------------------------------------------------- */

  txt(
    'Tab ou ESC para voltar',
    480,582,12,'#9a8f7c'
  );
}