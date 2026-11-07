/* Canvas, constantes, estado de entrada e variáveis globais do jogo */
const C=document.getElementById('c'),X=C.getContext('2d'),W=960,H=600,L=60,U=60,RT=900,BT=540,TS=60;

const K={},M={x:480,y:300,d:0,a:0};

const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[ri(0,a.length-1)],cl=(v,a,b)=>Math.max(a,Math.min(b,v)),hy=Math.hypot,D4=[[1,0],[-1,0],[0,1],[0,-1]];

let st='menu',P,fl=1,G,room,bul=[],en=[],pk=[],bm=[],pt=[],shake=0,hs=0,sel=0,cb=0,ct=0,ban={t:0,s:''},kills=0,tm=0,pool=[],AC,last=0;
