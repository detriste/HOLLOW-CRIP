/*
 * ============================================================
 * DESENHO DOS HERÓIS
 * ============================================================
 *
 * 0 - Sentinela: espada à direita e escudo à esquerda,
 *     ambos completamente fora do corpo.
 * 1 - Espectro: fumaça escura com tentáculos azuis,
 *     sem arcos que pareçam letras "C".
 * 2 - Artilheiro: desenho ORIGINAL preservado.
 * 3 - Necromante: visual original com detalhes sombrios.
 *
 * Mantidos os parâmetros e as animações originais.
 */

function body(h,x,y,r,a,w,t,bt){

  const c=h.c;
  const sn=Math.sin(t*12);
  const bl=Math.sin(t*1.9)>.96;
  const k=h.k;
  const ca=Math.cos(a);
  const sa=Math.sin(a);

  const O='#1c130d';
  const lw=Math.max(2,r*.17);
  const R=r-lw/2;

  X.save();
  X.lineJoin='round';
  X.lineCap='round';
  X.lineWidth=lw;
  X.strokeStyle=O;

  // Sombra.
  X.fillStyle='#0005';
  X.beginPath();
  X.ellipse(x,y+r+3,r*.9,r*.3,0,0,6.283);
  X.fill();

  // Pés.
  if(k!=1){
    X.fillStyle=['#77736b','','#4a2e16','#20291b'][k];

    for(const s of[-1,1]){
      X.beginPath();
      X.ellipse(x+s*r*.5,y+r*.8+sn*s*w*3,r*.3,r*.2,0,0,6.283);
      X.fill();
      X.stroke();
    }
  }

  // Movimento vertical.
  y-=k==1
    ?2+Math.sin(t*3)*r*.12
    :Math.abs(sn)*w*3;

  // Olhos.
  const eyes=(col,rx,ry,gl)=>{
    for(const s of[-1,1]){
      const ex=x+s*r*.36+ca*r*.1;
      const ey=y-r*.08+sa*r*.1;

      if(gl){
        X.fillStyle=gl;
        X.beginPath();
        X.arc(ex,ey,rx*2.1,0,6.283);
        X.fill();
      }

      if(bl){
        X.strokeStyle=col;
        X.lineWidth=2;
        X.beginPath();
        X.moveTo(ex-rx,ey);
        X.lineTo(ex+rx,ey);
        X.stroke();
        X.strokeStyle=O;
        X.lineWidth=lw;
      }else{
        X.fillStyle=col;
        X.beginPath();
        X.ellipse(ex,ey,rx,ry,0,0,6.283);
        X.fill();
      }
    }
  };


  // ==========================================================
  // 0 - SENTINELA
  // ==========================================================

  if(k==0){

    // Corpo.
    X.fillStyle=c;
    X.beginPath();
    X.arc(x,y,r,0,6.283);
    X.fill();
    X.stroke();

    X.fillStyle='rgba(0,0,0,.2)';
    X.beginPath();
    X.arc(x,y,R,.2,2.94);
    X.closePath();
    X.fill();

    // --------------------------------------------------------
    // ESCUDO À ESQUERDA.
    // A posição foi afastada para não entrar no corpo.
    // --------------------------------------------------------

    const shx=x-r*1.48;
    const shy=y+r*.15;

    X.save();
    X.translate(shx,shy);
    X.rotate(-.12);

    X.fillStyle='#b7b5a7';
    X.beginPath();
    X.moveTo(-r*.43,-r*.52);
    X.lineTo(r*.43,-r*.52);
    X.lineTo(r*.43,r*.12);
    X.quadraticCurveTo(r*.38,r*.72,0,r*.96);
    X.quadraticCurveTo(-r*.38,r*.72,-r*.43,r*.12);
    X.closePath();
    X.fill();
    X.stroke();

    X.fillStyle='#52616a';
    X.beginPath();
    X.moveTo(-r*.31,-r*.39);
    X.lineTo(r*.31,-r*.39);
    X.lineTo(r*.31,r*.1);
    X.quadraticCurveTo(r*.27,r*.57,0,r*.76);
    X.quadraticCurveTo(-r*.27,r*.57,-r*.31,r*.1);
    X.closePath();
    X.fill();

    X.fillStyle='#d4ad4e';
    X.beginPath();
    X.moveTo(0,-r*.23);
    X.lineTo(r*.17,0);
    X.lineTo(0,r*.25);
    X.lineTo(-r*.17,0);
    X.closePath();
    X.fill();
    X.stroke();

    X.fillStyle='#e9d18b';
    for(const sy of[-.32,.32]){
      X.beginPath();
      X.arc(0,r*sy,r*.055,0,6.283);
      X.fill();
    }

    X.restore();

    // --------------------------------------------------------
    // ESPADA À DIREITA.
    // Mais afastada e inclinada para fora do corpo.
    // --------------------------------------------------------

    const swx=x+r*1.48;
    const swy=y+r*.05;

    const hit=bt>0
      ?Math.max(0,1-Math.abs(bt-.15)/.15)
      :0;

    X.save();
    X.translate(swx,swy);

    // Inclinação corrigida: a ponta da espada fica para fora.
    X.rotate(.45+hit*.9);

    // Lâmina.
    X.fillStyle='#dce4e6';
    X.beginPath();
    X.moveTo(-r*.12,-r*.22);
    X.lineTo(r*.12,-r*.22);
    X.lineTo(r*.09,-r*1.55);
    X.lineTo(0,-r*1.82);
    X.lineTo(-r*.09,-r*1.55);
    X.closePath();
    X.fill();
    X.stroke();

    X.strokeStyle='#fff';
    X.lineWidth=Math.max(1,r*.045);
    X.beginPath();
    X.moveTo(r*.04,-r*.4);
    X.lineTo(r*.025,-r*1.55);
    X.stroke();

    // Guarda.
    X.strokeStyle=O;
    X.lineWidth=lw;
    X.fillStyle='#c99a38';
    X.beginPath();
    X.roundRect(-r*.38,-r*.32,r*.76,r*.15,r*.05);
    X.fill();
    X.stroke();

    X.fillStyle='#f0d27a';
    X.beginPath();
    X.arc(0,-r*.25,r*.1,0,6.283);
    X.fill();

    // Cabo.
    X.fillStyle='#56351e';
    X.beginPath();
    X.roundRect(-r*.11,-r*.2,r*.22,r*.58,r*.06);
    X.fill();
    X.stroke();

    X.strokeStyle='#d4ad4e';
    X.lineWidth=Math.max(1,r*.055);

    for(let i=0;i<3;i++){
      X.beginPath();
      X.moveTo(-r*.1,-r*.08+i*r*.16);
      X.lineTo(r*.1,r*.02+i*r*.16);
      X.stroke();
    }

    X.fillStyle='#d4ad4e';
    X.beginPath();
    X.arc(0,r*.42,r*.13,0,6.283);
    X.fill();
    X.stroke();

    X.restore();

    // Capacete.
    X.fillStyle='#9aa3a8';
    X.beginPath();
    X.arc(x,y,R,Math.PI,6.283);
    X.closePath();
    X.fill();
    X.stroke();

    X.fillStyle=O;
    X.fillRect(x-r*.86,y-r*.3,r*1.72,r*.36);

    X.fillStyle='#c9a13a';
    X.fillRect(x-r*.07,y-r*.3,r*.14,r*.36);

    // Placa frontal.
    X.fillStyle='#d4ad4e';
    X.beginPath();
    X.moveTo(x,y-r*.17);
    X.lineTo(x+r*.17,y+r*.02);
    X.lineTo(x,y+r*.21);
    X.lineTo(x-r*.17,y+r*.02);
    X.closePath();
    X.fill();
    X.stroke();

    // Crista vermelha.
    const sw2=Math.sin(t*4)*r*.12;

    X.fillStyle='#b5342f';
    X.beginPath();
    X.moveTo(x-r*.18,y-r*.95);
    X.quadraticCurveTo(
      x-r*.5+sw2,y-r*1.75,
      x+r*.55+sw2,y-r*1.4
    );
    X.quadraticCurveTo(
      x+r*.15,y-r*1.2,
      x+r*.2,y-r*.95
    );
    X.closePath();
    X.fill();
    X.stroke();

    eyes('#ffe9a0',r*.12,r*.09,'rgba(255,233,160,.22)');
  }


  // ==========================================================
  // 1 - ESPECTRO
  // ==========================================================

  else if(k==1){

    const pulse=Math.sin(t*3)*r*.08;
    const wave=Math.sin(t*4)*r*.12;

    const dark='#101827';
    const blue='#172b43';
    const mid='#294766';
    const light='#5d8eae';
    const glow='#8ce5ff';

    // Aura azul.
    const aura=X.createRadialGradient(
      x,y-r*.15,2,
      x,y-r*.15,r*1.8
    );

    aura.addColorStop(0,'rgba(65,150,210,.24)');
    aura.addColorStop(.55,'rgba(30,90,145,.12)');
    aura.addColorStop(1,'rgba(10,25,45,0)');

    X.fillStyle=aura;
    X.beginPath();
    X.arc(x,y-r*.15,r*1.8,0,6.283);
    X.fill();

    // Tentáculo esquerdo.
    X.fillStyle=dark;
    X.beginPath();
    X.moveTo(x-r*.48,y-r*.05);
    X.bezierCurveTo(
      x-r*1.15,y-r*.35,
      x-r*1.3,y+r*.25+wave,
      x-r*1.55,y+r*.55
    );
    X.bezierCurveTo(
      x-r*1.65,y+r*.8,
      x-r*1.25,y+r*.85,
      x-r*1.12,y+r*.55
    );
    X.bezierCurveTo(
      x-r*.92,y+r*.35,
      x-r*.8,y+r*.4,
      x-r*.55,y+r*.55
    );
    X.closePath();
    X.fill();
    X.stroke();

    X.beginPath();
    X.moveTo(x-r*1.48,y+r*.55);
    X.bezierCurveTo(
      x-r*1.9,y+r*.9,
      x-r*1.9,y+r*.25,
      x-r*1.55,y+r*.35
    );
    X.strokeStyle=dark;
    X.lineWidth=lw*1.4;
    X.stroke();

    // Tentáculo direito.
    X.fillStyle='#111b2b';
    X.beginPath();
    X.moveTo(x+r*.48,y-r*.05);
    X.bezierCurveTo(
      x+r*1.05,y-r*.35,
      x+r*1.2,y+r*.15-wave,
      x+r*1.5,y+r*.38
    );
    X.bezierCurveTo(
      x+r*1.75,y+r*.62,
      x+r*1.4,y+r*.85,
      x+r*1.25,y+r*.55
    );
    X.bezierCurveTo(
      x+r*.95,y+r*.4,
      x+r*.82,y+r*.55,
      x+r*.55,y+r*.55
    );
    X.closePath();
    X.fill();
    X.stroke();

    X.beginPath();
    X.moveTo(x+r*1.48,y+r*.48);
    X.bezierCurveTo(
      x+r*1.9,y+r*.8,
      x+r*1.9,y+r*.2,
      x+r*1.55,y+r*.3
    );
    X.strokeStyle=dark;
    X.lineWidth=lw*1.4;
    X.stroke();

    // Corpo principal.
    X.fillStyle=dark;
    X.beginPath();
    X.moveTo(x-r*.75,y+r*.12);
    X.bezierCurveTo(
      x-r*1.05,y-r*.45,
      x-r*.55,y-r*1.15,
      x-r*.05,y-r*1.35-pulse
    );
    X.bezierCurveTo(
      x+r*.55,y-r*1.45,
      x+r*1.05,y-r*.75,
      x+r*.78,y-r*.05
    );
    X.bezierCurveTo(
      x+r*1.12,y+r*.5,
      x+r*.48,y+r*.9,
      x+r*.3,y+r*1.15
    );
    X.bezierCurveTo(
      x+r*.1,y+r*1.4,
      x-r*.15,y+r*1.2,
      x-r*.32,y+r*.95
    );
    X.bezierCurveTo(
      x-r*.8,y+r*.8,
      x-r*1.05,y+r*.55,
      x-r*.75,y+r*.12
    );
    X.closePath();
    X.fill();
    X.stroke();

    // Camadas de fumaça.
    X.fillStyle=blue;
    X.beginPath();
    X.arc(x-r*.42,y+r*.08,r*.48,0,6.283);
    X.arc(x+r*.35,y+r*.05,r*.5,0,6.283);
    X.arc(x-r*.15,y+r*.45,r*.53,0,6.283);
    X.fill();

    X.fillStyle=mid;
    X.beginPath();
    X.arc(x-r*.2,y+r*.35,r*.36,0,6.283);
    X.arc(x+r*.35,y+r*.35,r*.32,0,6.283);
    X.fill();

    // Reflexos.
    X.globalAlpha=.65;
    X.fillStyle=light;

    X.beginPath();
    X.ellipse(x-r*.35,y+r*.35,r*.16,r*.32,-.5,0,6.283);
    X.fill();

    X.beginPath();
    X.ellipse(x+r*.25,y+r*.55,r*.14,r*.25,.5,0,6.283);
    X.fill();

    X.globalAlpha=1;

    // Fumaça inferior.
    X.fillStyle='#14263a';
    X.beginPath();
    X.moveTo(x-r*.5,y+r*.55);
    X.quadraticCurveTo(x-r*.45,y+r*1.2,x-r*.05,y+r*1.35);
    X.quadraticCurveTo(x+r*.05,y+r*1.65,x+r*.3,y+r*1.25);
    X.quadraticCurveTo(x+r*.65,y+r*.95,x+r*.48,y+r*.55);
    X.closePath();
    X.fill();
    X.stroke();

    // Rosto escuro.
    X.fillStyle='#080f1a';
    X.beginPath();
    X.ellipse(x,y+r*.02,r*.62,r*.49,0,0,6.283);
    X.fill();
    X.stroke();

    // Olhos azuis.
    for(const s of[-1,1]){
      const ex=x+s*r*.29;
      const ey=y-r*.02;

      X.fillStyle='rgba(90,200,255,.32)';
      X.beginPath();
      X.arc(ex,ey,r*.25,0,6.283);
      X.fill();

      X.fillStyle=glow;
      X.beginPath();
      X.ellipse(ex,ey,r*.12,r*.17,0,0,6.283);
      X.fill();

      X.fillStyle='#e2fbff';
      X.beginPath();
      X.arc(ex-r*.035,ey-r*.045,r*.045,0,6.283);
      X.fill();
    }

    // Partículas azuis.
    for(let i=0;i<4;i++){
      const q=t*1.8+i*1.57;
      const px=x+Math.cos(q)*r*1.35;
      const py=y+Math.sin(q)*r*.85;

      X.fillStyle='rgba(140,210,255,.7)';
      X.beginPath();
      X.arc(px,py,r*.07,0,6.283);
      X.fill();
    }
  }


  // ==========================================================
  // 2 - ARTILHEIRO
  // RESTAURADO EXATAMENTE DO CÓDIGO ORIGINAL ENVIADO.
  // ==========================================================

  else if(k==2){

    // Movimento da arma durante a rajada.
    const kick=bt>0
      ?Math.sin(Math.min(1,bt/.3)*Math.PI)*r*.12
      :0;

    // Corpo principal.
    X.fillStyle='#b66b2b';
    X.beginPath();
    X.ellipse(x,y,r*1.04,r*.98,0,0,6.283);
    X.fill();
    X.stroke();

    // Sombra da armadura.
    X.fillStyle='#75421f';
    X.beginPath();
    X.ellipse(x,y+r*.48,r*.78,r*.42,0,0,6.283);
    X.fill();

    // Placa do peito.
    X.fillStyle='#d78a36';
    X.strokeStyle=O;

    X.beginPath();
    X.roundRect(x-r*.64,y+r*.02,r*1.28,r*.68,r*.18);
    X.fill();
    X.stroke();

    // Placa metálica central.
    X.fillStyle='#3f4140';
    X.beginPath();
    X.roundRect(x-r*.3,y+r*.12,r*.6,r*.4,r*.08);
    X.fill();
    X.stroke();

    // Parafusos.
    X.fillStyle='#e7bd68';

    for(const s of[-1,1]){
      X.beginPath();
      X.arc(x+s*r*.49,y+r*.16,r*.065,0,6.283);
      X.fill();
    }

    // Bandoleira.
    X.strokeStyle='#3c2b1d';
    X.lineWidth=r*.2;

    X.beginPath();
    X.moveTo(x-r*.75,y-r*.55);
    X.lineTo(x+r*.72,y+r*.62);
    X.stroke();

    X.strokeStyle='#d8a044';
    X.lineWidth=r*.09;

    X.beginPath();
    X.moveTo(x-r*.75,y-r*.55);
    X.lineTo(x+r*.72,y+r*.62);
    X.stroke();

    // Munições.
    for(let i=0;i<4;i++){
      const q=i/3;
      const ax=x-r*.65+q*r*1.25;
      const ay=y-r*.45+q*r*.98;

      X.save();
      X.translate(ax,ay);
      X.rotate(.7);

      X.fillStyle='#e3b34e';
      X.strokeStyle=O;
      X.lineWidth=1.5;

      X.beginPath();
      X.roundRect(-r*.07,-r*.12,r*.14,r*.27,r*.035);
      X.fill();
      X.stroke();

      X.restore();
    }

    // Óculos de combate.
    X.fillStyle='#282a29';
    X.beginPath();
    X.roundRect(x-r*.82,y-r*.48,r*1.64,r*.48,r*.15);
    X.fill();
    X.stroke();

    // Lente esquerda.
    X.fillStyle='#9ddce4';
    X.beginPath();
    X.ellipse(x-r*.4,y-r*.25,r*.23,r*.19,-.2,0,6.283);
    X.fill();
    X.stroke();

    // Lente direita.
    X.fillStyle='#8ec9d7';
    X.beginPath();
    X.ellipse(x+r*.4,y-r*.25,r*.23,r*.19,.2,0,6.283);
    X.fill();
    X.stroke();

    // Reflexos.
    X.fillStyle='#fff';

    for(const s of[-1,1]){
      X.beginPath();
      X.arc(x+s*r*.43-r*.06,y-r*.31,r*.055,0,6.283);
      X.fill();
    }

    // Narigueira.
    X.fillStyle='#4a3524';
    X.beginPath();
    X.roundRect(x-r*.12,y-r*.22,r*.24,r*.16,r*.04);
    X.fill();

    // Arma mecânica.
    X.save();
    X.translate(x+r*.3,y+r*.08-kick);
    X.rotate(.55);

    // Cano principal.
    X.fillStyle='#393b39';
    X.strokeStyle=O;
    X.lineWidth=lw*.85;

    X.beginPath();
    X.roundRect(-r*.12,-r*1.15,r*.32,r*1.5,r*.08);
    X.fill();
    X.stroke();

    // Parte superior do cano.
    X.fillStyle='#777b76';
    X.beginPath();
    X.roundRect(-r*.07,-r*1.12,r*.12,r*1.22,r*.04);
    X.fill();

    // Boca da arma.
    X.fillStyle='#222523';
    X.beginPath();
    X.roundRect(-r*.2,-r*1.3,r*.48,r*.25,r*.06);
    X.fill();
    X.stroke();

    // Interior da boca.
    X.fillStyle='#0b0d0c';
    X.beginPath();
    X.ellipse(r*.04,-r*1.18,r*.12,r*.06,0,0,6.283);
    X.fill();

    // Corpo da arma.
    X.fillStyle='#a85e24';
    X.beginPath();
    X.roundRect(-r*.38,-r*.15,r*.85,r*.48,r*.08);
    X.fill();
    X.stroke();

    // Placa dourada.
    X.fillStyle='#e2a83e';
    X.fillRect(-r*.27,-r*.08,r*.48,r*.1);

    // Tambor.
    X.fillStyle='#777b75';
    X.beginPath();
    X.roundRect(r*.18,-r*.05,r*.28,r*.4,r*.06);
    X.fill();
    X.stroke();

    // Empunhadura.
    X.fillStyle='#493021';
    X.beginPath();
    X.moveTo(-r*.32,r*.2);
    X.lineTo(-r*.08,r*.2);
    X.lineTo(r*.02,r*.72);
    X.lineTo(-r*.28,r*.72);
    X.closePath();
    X.fill();
    X.stroke();

    // Detalhes da empunhadura.
    X.strokeStyle='#d69a46';
    X.lineWidth=r*.05;

    for(let i=0;i<3;i++){
      X.beginPath();
      X.moveTo(-r*.25,r*.3+i*r*.12);
      X.lineTo(-r*.03,r*.34+i*r*.12);
      X.stroke();
    }

    X.restore();

    // Mochila lateral.
    X.fillStyle='#654222';
    X.beginPath();
    X.roundRect(x-r*1.05,y-r*.12,r*.38,r*.75,r*.12);
    X.fill();
    X.stroke();

    // Detalhes da mochila.
    X.fillStyle='#d18a35';
    X.fillRect(x-r*.99,y+r*.02,r*.26,r*.12);

    // Indicador luminoso.
    X.fillStyle='#f4d17b';
    X.beginPath();
    X.arc(x-r*.86,y+r*.42,r*.07,0,6.283);
    X.fill();
  }


  // ==========================================================
  // 3 - NECROMANTE
  // VISUAL ORIGINAL COM DETALHES SOMBRIOS ADICIONADOS.
  // ==========================================================

  else{

    const sx=x-r*1.15;
    const pu=1+Math.sin(t*5)*.13;

    // Animação original do cajado.
    const ly=bt>0
      ?(
        bt<.25
          ?-r*1.1*Math.sin((bt/.25)*1.5708)
          :bt<.30
            ?-r*1.1*(1-(bt-.25)/.05)
            :0
      )
      :0;

    // --------------------------------------------------------
    // CAJADO
    // --------------------------------------------------------

    X.save();
    X.translate(0,ly);

    X.strokeStyle=O;
    X.lineWidth=lw+r*.1;

    X.beginPath();
    X.moveTo(sx,y+r*1.05);
    X.lineTo(sx,y-r*1.3);
    X.stroke();

    X.strokeStyle='#29271c';
    X.lineWidth=r*.14;

    X.beginPath();
    X.moveTo(sx,y+r*1.05);
    X.lineTo(sx,y-r*1.3);
    X.stroke();

    // Detalhes da haste.
    X.strokeStyle='#617044';
    X.lineWidth=r*.045;

    for(let i=0;i<4;i++){
      X.beginPath();
      X.moveTo(sx-r*.07,y+r*.55-i*r*.43);
      X.lineTo(sx+r*.07,y+r*.42-i*r*.43);
      X.stroke();
    }

    // Espinhos escuros na haste.
    X.fillStyle='#151b11';
    X.strokeStyle=O;
    X.lineWidth=r*.035;

    for(let i=0;i<3;i++){
      const yy=y+r*.25-i*r*.65;

      X.beginPath();
      X.moveTo(sx-r*.08,yy);
      X.lineTo(sx-r*.3,yy-r*.2);
      X.lineTo(sx-r*.13,yy+r*.08);
      X.closePath();
      X.fill();
      X.stroke();

      X.beginPath();
      X.moveTo(sx+r*.08,yy-r*.12);
      X.lineTo(sx+r*.29,yy-r*.32);
      X.lineTo(sx+r*.14,yy+r*.02);
      X.closePath();
      X.fill();
      X.stroke();
    }

    // Aura da caveira.
    X.fillStyle='rgba(83,125,49,.24)';
    X.beginPath();
    X.arc(sx,y-r*1.55,r*.72*pu,0,6.283);
    X.fill();

    // Aura externa sombria.
    X.fillStyle='rgba(15,35,10,.22)';
    X.beginPath();
    X.arc(sx,y-r*1.55,r*.88*pu,0,6.283);
    X.fill();

    // Aro.
    X.strokeStyle='#617c39';
    X.lineWidth=r*.13;

    X.beginPath();
    X.arc(sx,y-r*1.55,r*.48,0,6.283);
    X.stroke();

    // Pontas do aro.
    X.strokeStyle='#202b16';
    X.lineWidth=r*.07;

    for(let i=0;i<4;i++){
      const q=i*Math.PI/2;
      const ax=sx+Math.cos(q)*r*.48;
      const ay=y-r*1.55+Math.sin(q)*r*.48;

      X.beginPath();
      X.moveTo(ax,ay);
      X.lineTo(
        sx+Math.cos(q)*r*.72,
        y-r*1.55+Math.sin(q)*r*.72
      );
      X.stroke();
    }

    // Caveira do cajado.
    X.fillStyle='#b4b99a';
    X.strokeStyle=O;
    X.lineWidth=lw*.8;

    X.beginPath();
    X.arc(sx,y-r*1.55,r*.3,0,6.283);
    X.fill();
    X.stroke();

    // Maxilar.
    X.fillStyle='#888f70';
    X.beginPath();
    X.roundRect(sx-r*.2,y-r*1.5,r*.4,r*.27,r*.07);
    X.fill();
    X.stroke();

    // Órbitas.
    X.fillStyle='#182312';

    for(const q of[-1,1]){
      X.beginPath();
      X.arc(sx+q*r*.12,y-r*1.58,r*.075,0,6.283);
      X.fill();
    }

    // Brilho dos olhos.
    X.fillStyle='#b6ff7a';

    for(const q of[-1,1]){
      X.beginPath();
      X.arc(sx+q*r*.12,y-r*1.59,r*.035,0,6.283);
      X.fill();
    }

    // Fagulhas verdes ao redor da caveira.
    X.fillStyle='#a6d65b';

    for(let i=0;i<4;i++){
      const q=t*2+i*Math.PI/2;
      const px=sx+Math.cos(q)*r*.62;
      const py=y-r*1.55+Math.sin(q)*r*.62;

      X.beginPath();
      X.arc(px,py,r*.035,0,6.283);
      X.fill();
    }

    X.restore();

    // --------------------------------------------------------
    // MANTO PRINCIPAL
    // --------------------------------------------------------

    X.fillStyle='#171d15';
    X.beginPath();

    X.moveTo(x-r,y);
    X.arc(x,y,r,Math.PI,6.283);
    X.lineTo(x+r*1.08,y+r*1.0);

    for(let i=0;i<4;i++){
      const x1=x+r*1.08-(i+1)*r*.54;

      X.lineTo(
        x1+r*.27,
        y+r*1.3+Math.sin(t*4+i)*r*.05
      );

      X.lineTo(x1,y+r*1.0);
    }

    X.closePath();
    X.fill();
    X.stroke();

    // Sombras profundas nas laterais do manto.
    X.fillStyle='rgba(0,0,0,.38)';

    X.beginPath();
    X.moveTo(x-r*.92,y+r*.05);
    X.quadraticCurveTo(x-r*.75,y+r*.65,x-r*.82,y+r*1.12);
    X.lineTo(x-r*.55,y+r*1.27);
    X.lineTo(x-r*.48,y+r*.5);
    X.closePath();
    X.fill();

    X.beginPath();
    X.moveTo(x+r*.92,y+r*.05);
    X.quadraticCurveTo(x+r*.75,y+r*.65,x+r*.82,y+r*1.12);
    X.lineTo(x+r*.55,y+r*1.27);
    X.lineTo(x+r*.48,y+r*.5);
    X.closePath();
    X.fill();

    // Camada interna.
    X.fillStyle='#27321d';
    X.beginPath();

    X.moveTo(x-r*.7,y+r*.05);
    X.quadraticCurveTo(x-r*.3,y+r*.65,x,y+r*.75);
    X.quadraticCurveTo(x+r*.3,y+r*.65,x+r*.7,y+r*.05);

    X.lineTo(x+r*.55,y+r*.95);
    X.lineTo(x,y+r*1.15);
    X.lineTo(x-r*.55,y+r*.95);

    X.closePath();
    X.fill();

    // Bordas verde-musgo.
    X.strokeStyle='#526b35';
    X.lineWidth=r*.07;

    X.beginPath();
    X.moveTo(x-r*.75,y+r*.05);
    X.quadraticCurveTo(x,y+r*.55,x+r*.75,y+r*.05);
    X.stroke();

    // Rasgos escuros no tecido.
    X.strokeStyle='#090e09';
    X.lineWidth=r*.045;

    for(const s of[-1,1]){
      X.beginPath();
      X.moveTo(x+s*r*.72,y+r*.25);
      X.lineTo(x+s*r*.58,y+r*.52);
      X.lineTo(x+s*r*.68,y+r*.78);
      X.stroke();

      X.beginPath();
      X.moveTo(x+s*r*.86,y+r*.55);
      X.lineTo(x+s*r*.75,y+r*.83);
      X.stroke();
    }

    // Símbolo central.
    X.fillStyle='#536c37';
    X.strokeStyle='#91a86b';
    X.lineWidth=r*.055;

    X.beginPath();
    X.moveTo(x,y+r*.08);
    X.lineTo(x+r*.32,y+r*.42);
    X.lineTo(x,y+r*.72);
    X.lineTo(x-r*.32,y+r*.42);
    X.closePath();
    X.fill();
    X.stroke();

    // Runa.
    X.strokeStyle='#c1d48c';
    X.lineWidth=r*.055;

    X.beginPath();
    X.moveTo(x,y+r*.2);
    X.lineTo(x,y+r*.6);
    X.moveTo(x-r*.15,y+r*.4);
    X.lineTo(x+r*.15,y+r*.4);
    X.stroke();

    // Marcas mágicas.
    X.fillStyle='#9bb76a';

    for(const s of[-1,1]){
      X.beginPath();
      X.arc(x+s*r*.48,y+r*.4,r*.065,0,6.283);
      X.fill();
    }

    // Correntes sombrias decorativas.
    X.strokeStyle='#0b100a';
    X.lineWidth=r*.045;

    for(const s of[-1,1]){
      X.beginPath();
      X.moveTo(x+s*r*.45,y+r*.12);
      X.lineTo(x+s*r*.58,y+r*.28);
      X.lineTo(x+s*r*.48,y+r*.42);
      X.stroke();

      X.fillStyle='#667d3e';
      X.beginPath();
      X.arc(x+s*r*.48,y+r*.42,r*.045,0,6.283);
      X.fill();
    }

    // --------------------------------------------------------
    // ESPINHOS ÓSSEOS NOS OMBROS
    // --------------------------------------------------------

    for(const s of[-1,1]){

      X.fillStyle='#c0c0a0';
      X.strokeStyle='#292b20';
      X.lineWidth=r*.055;

      X.beginPath();
      X.moveTo(x+s*r*.62,y-r*.22);
      X.lineTo(x+s*r*1.02,y-r*.65);
      X.lineTo(x+s*r*.88,y-r*.18);
      X.lineTo(x+s*r*1.12,y-r*.08);
      X.lineTo(x+s*r*.72,y+r*.02);
      X.closePath();
      X.fill();
      X.stroke();

      // Sombra do osso.
      X.strokeStyle='#747b5d';
      X.lineWidth=r*.035;

      X.beginPath();
      X.moveTo(x+s*r*.7,y-r*.12);
      X.lineTo(x+s*r*.94,y-r*.48);
      X.stroke();
    }

    // --------------------------------------------------------
    // CAPUZ
    // --------------------------------------------------------

    X.fillStyle='#10160f';
    X.beginPath();

    X.moveTo(x-r*1.02,y+r*.1);
    X.quadraticCurveTo(x-r*.9,y-r*1.1,x+r*.5,y-r*1.6);
    X.quadraticCurveTo(x+r*.45,y-r*1.0,x+r*1.02,y+r*.1);
    X.quadraticCurveTo(x,y+r*.55,x-r*1.02,y+r*.1);

    X.closePath();
    X.fill();
    X.stroke();

    // Interior.
    X.fillStyle='#070b08';
    X.beginPath();
    X.ellipse(x,y+r*.0,r*.62,r*.48,0,0,6.283);
    X.fill();

    // Sombra verde.
    X.strokeStyle='#344a29';
    X.lineWidth=r*.07;

    X.beginPath();
    X.moveTo(x-r*.65,y-r*.35);
    X.quadraticCurveTo(
      x-r*.2,y-r*1.25,
      x+r*.5,y-r*1.35
    );
    X.stroke();

    // Segunda camada de sombra no capuz.
    X.strokeStyle='#080d08';
    X.lineWidth=r*.12;

    X.beginPath();
    X.moveTo(x-r*.72,y-r*.15);
    X.quadraticCurveTo(
      x-r*.25,y-r*.95,
      x+r*.55,y-r*1.12
    );
    X.stroke();

    // Pequenas marcas de desgaste.
    X.strokeStyle='#52623a';
    X.lineWidth=r*.035;

    X.beginPath();
    X.moveTo(x-r*.78,y-r*.05);
    X.lineTo(x-r*.62,y+r*.12);
    X.moveTo(x+r*.78,y-r*.05);
    X.lineTo(x+r*.62,y+r*.12);
    X.stroke();

    // Olhos verdes luminosos.
    eyes('#b6ff7a',r*.13,r*.18,'rgba(100,180,55,.3)');

    // --------------------------------------------------------
    // CAVEIRA NO PEITO
    // --------------------------------------------------------

    X.fillStyle='#b6b99b';
    X.strokeStyle=O;
    X.lineWidth=r*.06;

    X.beginPath();
    X.arc(x,y+r*.57,r*.22,0,6.283);
    X.fill();
    X.stroke();

    // Maxilar.
    X.fillStyle='#858c70';
    X.beginPath();
    X.roundRect(x-r*.16,y+r*.62,r*.32,r*.18,r*.04);
    X.fill();
    X.stroke();

    // Órbitas.
    X.fillStyle='#10160e';

    for(const q of[-1,1]){
      X.beginPath();
      X.arc(x+q*r*.09,y+r*.55,r*.065,0,6.283);
      X.fill();
    }

    // Nariz.
    X.beginPath();
    X.moveTo(x,y+r*.59);
    X.lineTo(x-r*.045,y+r*.66);
    X.lineTo(x+r*.045,y+r*.66);
    X.closePath();
    X.fill();

    // Dentes.
    X.strokeStyle='#1b2115';
    X.lineWidth=r*.025;

    for(let i=-1;i<=1;i++){
      X.beginPath();
      X.moveTo(x+i*r*.07,y+r*.7);
      X.lineTo(x+i*r*.07,y+r*.77);
      X.stroke();
    }

    // Brilho verde dentro das órbitas da caveira.
    X.fillStyle='rgba(153,255,83,.8)';

    for(const q of[-1,1]){
      X.beginPath();
      X.arc(x+q*r*.09,y+r*.55,r*.025,0,6.283);
      X.fill();
    }

    // --------------------------------------------------------
    // PEQUENAS CAVEIRAS NA BARRA DO MANTO
    // --------------------------------------------------------

    for(const s of[-1,1]){
      const cx=x+s*r*.7;
      const cy=y+r*.95;

      X.fillStyle='#a4a88a';
      X.strokeStyle=O;
      X.lineWidth=r*.045;

      X.beginPath();
      X.arc(cx,cy,r*.105,0,6.283);
      X.fill();
      X.stroke();

      X.fillStyle='#10160e';

      for(const q of[-1,1]){
        X.beginPath();
        X.arc(cx+q*r*.045,cy-r*.01,r*.025,0,6.283);
        X.fill();
      }
    }

    // --------------------------------------------------------
    // RASGOS E PONTAS NA BARRA DO MANTO
    // --------------------------------------------------------

    X.strokeStyle='#090d08';
    X.lineWidth=r*.055;

    for(let i=0;i<3;i++){
      const px=x-r*.45+i*r*.45;

      X.beginPath();
      X.moveTo(px,y+r*1.02);
      X.lineTo(px-r*.1,y+r*1.23);
      X.lineTo(px+r*.04,y+r*1.15);
      X.stroke();
    }

    // Pequenas runas verdes na parte inferior.
    X.fillStyle='#78934b';

    for(const s of[-1,1]){
      X.beginPath();
      X.arc(x+s*r*.35,y+r*1.08,r*.035,0,6.283);
      X.fill();
    }
  }

  // Finalização.
  X.restore();
}


/*
 * ============================================================
 * ROSTO DOS INIMIGOS
 * MANTIDO ORIGINALMENTE.
 * ============================================================
 */

function face(e,c){

  const r=e.r;
  const a=ang(e);
  const k=r*.34;
  const ey=e.y-r*.12;

  const mad=e.s>0||(e.cd<.35&&e.cd>-.5);

  if(e.t=='sniper'&&e.s==1){

    X.strokeStyle='#8fbcc066';
    X.lineWidth=2;

    X.beginPath();
    X.moveTo(e.x,e.y);
    X.lineTo(
      e.x+Math.cos(e.a)*700,
      e.y+Math.sin(e.a)*700
    );
    X.stroke();
  }

  for(const s of[-1,1]){

    X.fillStyle='#fff';

    X.beginPath();
    X.ellipse(
      e.x+s*k,
      ey,
      r*.2,
      r*.24,
      0,0,6.283
    );
    X.fill();

    X.fillStyle='#10060c';

    X.beginPath();
    X.arc(
      e.x+s*k+Math.cos(a)*r*.09,
      ey+Math.sin(a)*r*.09,
      r*.1,
      0,6.283
    );
    X.fill();

    X.strokeStyle='#10060c';
    X.lineWidth=2;

    X.beginPath();
    X.moveTo(e.x+s*(k+r*.26),ey-r*.4);
    X.lineTo(e.x+s*(k-r*.22),ey-r*(mad?.14:.28));
    X.stroke();
  }

  X.fillStyle='#10060c';
  X.strokeStyle='#10060c';

  X.beginPath();

  if(mad||e.fl>0){

    X.ellipse(e.x,e.y+r*.45,r*.22,r*.17,0,0,6.283);
    X.fill();

  }else{

    X.arc(e.x,e.y+r*.62,r*.25,3.5,5.9);
    X.stroke();
  }

  if(e.el){

    poly(
      e.x,
      e.y-r-8,
      7,
      3,
      -1.57,
      '#d4a93a',
      '#332b00'
    );

    X.strokeStyle='#d4a93a66';
    X.lineWidth=2;

    X.beginPath();
    X.arc(e.x,e.y,r+6,0,6.283);
    X.stroke();
  }
}