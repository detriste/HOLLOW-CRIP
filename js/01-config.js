/* Canvas, constantes, estado de entrada e variáveis globais do jogo */
const C=document.getElementById('c'),X=C.getContext('2d'),W=960,H=600,L=60,U=60,RT=900,BT=540,TS=60;

/* Nitidez: o buffer do canvas acompanha o tamanho real exibido (x densidade de pixels), em vez de
   só esticar a imagem de 960x600. O jogo continua desenhando em coordenadas 960x600; base() aplica a escala. */
const base=()=>X.setTransform(C.width/W,0,0,C.height/H,0,0);
function fitCanvas(){const r=C.getBoundingClientRect();if(!r.width)return;const k=Math.min(3,Math.max(.5,r.width*(window.devicePixelRatio||1)/W)),nw=Math.round(W*k),nh=Math.round(H*k);if(C.width!=nw||C.height!=nh){C.width=nw;C.height=nh}}
fitCanvas();addEventListener('resize',fitCanvas);document.addEventListener('fullscreenchange',fitCanvas);if(window.ResizeObserver)new ResizeObserver(fitCanvas).observe(C);

const K={},M={x:480,y:300,d:0,a:0};

const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[ri(0,a.length-1)],cl=(v,a,b)=>Math.max(a,Math.min(b,v)),hy=Math.hypot,D4=[[1,0],[-1,0],[0,1],[0,-1]];

let st='menu',P,fl=1,G,room,bul=[],en=[],pk=[],bm=[],pt=[],shake=0,hs=0,sel=0,cb=0,ct=0,ban={t:0,s:''},kills=0,tm=0,pool=[],AC,last=0;
