/* Criação do jogador e habilidade especial do herói */
function newP(){return{x:480,y:300,vx:0,vy:0,r:13,hp:CH[sel].hp,max:CH[sel].hp,coins:0,bombs:1,keys:0,cd:0,inv:0,dash:0,dcd:0,orb:CH[sel].orb||0,oa:0,ac:0,ph:0,swt:0,db:0,ch:CH[sel],fx:1,fy:0,items:[],sl:[],acc:-1,s:{dmg:CH[sel].dmg,rate:CH[sel].rate,spd:CH[sel].spd,range:.85,shot:460,multi:1,pierce:0,bounce:0,home:CH[sel].home||0,leech:CH[sel].lc||0,expl:0,acd:1,apw:1,dcd:CH[sel].dcd||.9}}}

function ability(){if(P.ac>0)return;const k=P.ch.k;P.ac=P.ch.cd*P.s.acd;P.aid=(P.aid||0)+1;sfx(150,.3,.07,'sawtooth');shake=10;if(k==0)P.inv=Math.max(P.inv,.8);
 if(k==0){for(const e of en){const dx=e.x-P.x,dy=e.y-P.y,d=hy(dx,dy)||1;if(d<320){e.vx+=dx/d*900;e.vy+=dy/d*900;e.cd=Math.max(e.cd,1);hurt(e,P.s.dmg*3*P.s.apw,1)}}bul=bul.filter(b=>!b.h);for(let i=0;i<64;i++){const a=i*.098;pt.push({x:P.x,y:P.y,vx:Math.cos(a)*400,vy:Math.sin(a)*400,l:.5,m:.5,c:'#c8b48a',r:3})}}
 else if(k==1){P.ph=3*P.s.apw;P.dcd=0}
 else if(k==2){for(let q=0;q<3;q++)for(let i=0;i<20;i++){const a=i*.314+q*.1,w=.8+q*.25;bul.push({x:P.x,y:P.y,vx:Math.cos(a)*P.s.shot*w,vy:Math.sin(a)*P.s.shot*w,d:P.s.dmg*1.5*P.s.apw,ab:1,r:7,l:P.s.range,pi:P.s.pierce+1,bo:0,ho:0,ex:P.s.expl,h:0,hs:[]})}}
 else{P.orb+=5;P.swt=9*P.s.apw;P.hp=Math.min(P.max,P.hp+1)}}
