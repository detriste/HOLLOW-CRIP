/* Bombas, explosões, tiros, dano, mortes e partículas */
function blast(){for(const e of en)hurt(e,6);parts(P.x,P.y,'#55505e',24,300);shake=8}

function parts(x,y,c,n,s=200){for(let i=0;i<n;i++){const a=rnd(0,6.28),v=rnd(.2,1)*s;pt.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:rnd(.3,.7),m:.7,c})}}

function pushRocks(o){for(const k of room.rocks){const rx=L+k.x*TS,ry=U+k.y*TS,cx=cl(o.x,rx,rx+TS),cy=cl(o.y,ry,ry+TS);let dx=o.x-cx,dy=o.y-cy,d=hy(dx,dy);
 if(d<o.r){if(d<.01){dx=1;dy=0;d=1}const p=(o.r-d)/d;o.x+=dx*p;o.y+=dy*p;o.hit=1}}}

const rockAt=(x,y)=>room.rocks.some(k=>x>L+k.x*TS&&x<L+k.x*TS+TS&&y>U+k.y*TS&&y<U+k.y*TS+TS);

function hit(d){if(P.inv>0||P.dash>0)return;if(P.acc==5&&d>1)d--;while(d>0&&P.sl.length){if(P.sl.pop()=='n')blast();d--}P.hp-=d;P.inv=1.1+(P.s.tuf||0);sentOrb();shake=12;parts(P.x,P.y,'#fff',14);sfx(120,.2,.07,'sawtooth');if(P.hp<=0){st='dead';sfx(60,.6,.08,'sawtooth')}}

function sentOrb(){if(P.ch.k!=0)return;P.so=(P.so||0)+1;P.orb++;sfx(500,.1,.04,'triangle');if(P.so>=5){P.orb-=P.so;P.so=0;shake=10;sfx(200,.3,.06,'sawtooth');for(const e of en){const dx=e.x-P.x,dy=e.y-P.y,d=hy(dx,dy)||1;if(d<260){e.vx+=dx/d*600;e.vy+=dy/d*600;hurt(e,P.s.dmg*2)}}bul=bul.filter(b=>!b.h);for(let i=0;i<40;i++){const a=i*.157;pt.push({x:P.x,y:P.y,vx:Math.cos(a)*350,vy:Math.sin(a)*350,l:.5,m:.5,c:'#c8b48a',r:3})}}}

function useSummon(){if(!(P.sm>0))return;if(!room.cleared||en.length||room.tot||/shop|devil|angel/.test(room.t)){ban={t:1.8,s:'Só pode ser usado numa sala comum já limpa'};return}
 P.sm--;room.summ=1;room.cleared=false;room.tot={x:P.x,y:P.y,t:1.4};ban={t:2,s:'Invocando dois chefes...'};sfx(90,.5,.08,'sawtooth');shake=10}

function ibomb(b){const k=b.ib,rad=k==1?150:k==2?120:100,x=b.x,y=b.y;boom(x,y,rad,0,true,true);let hits=0;
 for(const e of en)if(hy(e.x-x,e.y-y)<rad+e.r){hurt(e,e.t=='boss'?10:22);hits++;if(k==0){const dx=e.x-x,dy=e.y-y,d=hy(dx,dy)||1;e.vx+=dx/d*700;e.vy+=dy/d*700}}
 if(k==0){bul=bul.filter(q=>!q.h||hy(q.x-x,q.y-y)>rad+40);if(hy(P.x-x,P.y-y)<rad+40)P.inv=Math.max(P.inv,.7);parts(x,y,'#c8b48a',24,300)}
 else if(k==1){P.aid=(P.aid||0)+1;P.ph=Math.max(P.ph,1.2);P.dcd=0;parts(x,y,'#8d7fa8',24,300)}
 else if(k==2){for(let i=0;i<16;i++){const a=i*.3927;bul.push({x,y,vx:Math.cos(a)*P.s.shot,vy:Math.sin(a)*P.s.shot,d:P.s.dmg*1.1,r:7,l:P.s.range,pi:1,bo:0,ho:0,ex:0,h:0,hs:[]})}parts(x,y,'#d08a3c',24,300)}
 else{if(hits&&P.hp<P.max)P.hp++;for(let i=0;i<8;i++){const a=i*.785;bul.push({x,y,vx:Math.cos(a)*P.s.shot*.7,vy:Math.sin(a)*P.s.shot*.7,d:P.s.dmg*.9,r:6,l:P.s.range*1.3,pi:0,bo:0,ho:1,ex:0,h:0,hs:[]})}parts(x,y,'#7fae6a',24,300)}}

function placeBomb(){if(P.s.ibomb){if(P.bcd>0)return;P.bcd=.9;bm.push({x:P.x,y:P.y,t:1,ib:P.ch.k});return}if(P.bombs>0){if(!(P.acc==4&&Math.random()<.35))P.bombs--;bm.push({x:P.x,y:P.y,t:1.4})}}

function boom(x,y,rad,dmg,rocks,ns){shake=rocks?18:6;parts(x,y,'#d9923f',rocks?40:14,rocks?400:220);sfx(80,.3,.08,'sawtooth');
 for(const e of en)if(hy(e.x-x,e.y-y)<rad+e.r){hurt(e,dmg);if(rocks&&e.t=='rep'){e.hp=0;e.bk=1}}
 if(rocks){if(!ns&&hy(P.x-x,P.y-y)<rad)hit(2);room.rocks=room.rocks.filter(k=>hy(L+k.x*TS+30-x,U+k.y*TS+30-y)>rad+20);pk.forEach(q=>0);D4.forEach(([a,b])=>{const n=nb(room,a,b);if(n&&n.sec&&!n.rev&&hy(480+a*420-x,300+b*240-y)<rad+60){n.rev=1;ban={t:2.5,s:'Uma passagem secreta se abriu!'};sfx(500,.3,.05,'triangle')}})}}

let AB=0;

function hurt(e,d,ab){if((e.t=='wraith'&&e.s)||e.gh>0)return;ab=ab||AB;if(ab&&e.t=='boss'){if(e.abi!=P.aid){e.abi=P.aid;e.abd=0}d=Math.min(d,Math.max(0,e.mhp*.25-e.abd));e.abd+=d}e.hp-=d;e.fl=.08}

function kill(e){kills++;cb++;ct=3;if(e.t=='boss'&&!e.sm){P.bk=(P.bk||0)+1;if(P.bk%2==0){pk.push({t:'s',x:cl(e.x,L+40,RT-40),y:cl(e.y,U+40,BT-40),pr:0});ban={t:3,s:'Um Totem de Invocação caiu!'}}}
 if(P.ch.k==1&&e.t!='mini'){P.sk=(P.sk||0)+1;if(P.sk>=10){if(Math.ceil(P.sl.length/2)<3){P.sl.push('a','a');P.sk=0;ban={t:2.5,s:'Coração azul conquistado!'};sfx(900,.2,.05,'triangle');parts(P.x,P.y,'#7fa6c4',16,200)}else P.sk=10}}P.ac=Math.max(0,P.ac-.7);hs=e.t=='boss'?.25:.04;shake+=e.t=='boss'?20:2;parts(e.x,e.y,e.c,e.t=='boss'?80:16,e.t=='boss'?500:250);sfx(200,.12,.05,'triangle');
 if(P.hp<P.max&&Math.random()<P.s.leech+(P.acc==6?.1:0))P.hp++;
 if(e.t=='sapper'){boom(e.x,e.y,70,0,false);if(hy(P.x-e.x,P.y-e.y)<75)hit(1);for(let i=0;i<8;i++)eb(e.x,e.y,i*.785,170,'#d08a3c')}if(e.t=='blob'){for(let i=0;i<2;i++)en.push(mk('mini',e.x+rnd(-15,15),e.y+rnd(-15,15)))}
 else if(e.t!='mini'&&e.t!='boss'&&!(e.t=='rep'&&e.gen>0)){if(Math.random()<(e.el?.95:.5)*(P.acc==0?1.4:1)){const q=Math.random();pk.push({t:dropT(q),x:e.x,y:e.y,pr:0})}if(e.el&&Math.random()<.2)pk.push({t:'i',id:take(),x:e.x,y:e.y,pr:0})}}

function eb(x,y,a,sp,c){sp*=1+.08*(fl-1);bul.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:6,h:1,l:4,c:c||'#d9623f'})}

const ang=e=>Math.atan2(P.y-e.y,P.x-e.x);

function shoot(dx,dy){const s=P.s,a0=Math.atan2(dy,dx);for(let i=0;i<s.multi;i++){const a=a0+(i-(s.multi-1)/2)*.17+(s.multi==1?rnd(-.02,.02):0);
 bul.push({x:P.x,y:P.y,vx:Math.cos(a)*s.shot+P.vx*.3,vy:Math.sin(a)*s.shot+P.vy*.3,d:s.dmg*(P.acc==1?1.2:1)*(P.weak>0?.6:1)*(1+Math.min(cb,10)*.03),r:5+Math.min(5,s.dmg*.35),l:s.range,pi:s.pierce+(P.ph>0?9:0),bo:s.bounce,ho:s.home,ex:s.expl,h:0,hs:[]})}P.vx-=Math.cos(a0)*18;P.vy-=Math.sin(a0)*18;sfx(520,.05,.025)}
