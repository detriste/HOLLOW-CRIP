/* Lógica de cada quadro (movimento, inimigos, balas, pickups) */
function update(dt){tm+=dt;const s=P.s;if(s.regen&&(P.rg=(P.rg||0)+dt)>25){P.rg=0;P.hp=Math.min(P.max,P.hp+1)}if(P.ac>0)P.ac-=dt;if(P.poi>0){P.poi-=dt;P.pt-=dt;if(Math.random()<.3)pt.push({x:P.x+rnd(-10,10),y:P.y,vx:rnd(-15,15),vy:-50,l:.5,m:.5,c:'#8fd04a',r:2.5});if(P.pt<=0){P.pt=1.5;if(P.sl.length)P.sl.pop();else if(P.hp>1)P.hp--;shake=3;parts(P.x,P.y,'#8fd04a',8,140);sfx(150,.12,.05,'sine')}}if(P.ph>0){P.ph-=dt;P.inv=Math.max(P.inv,.12)}if(P.swt>0&&(P.swt-=dt)<=0)P.orb-=5;if(ct>0&&(ct-=dt)<=0)cb=0;if(P.db>0)P.db-=dt;if(P.bcd>0)P.bcd-=dt;
 let ix=(K.KeyD?1:0)-(K.KeyA?1:0),iy=(K.KeyS?1:0)-(K.KeyW?1:0),il=hy(ix,iy)||1;ix/=il;iy/=il;
 const tt=P.dash>0||P.ph>0?'':terrAt(P.x,P.y),mv=ix||iy,sp=s.spd*(P.ph>0?1.5:1)*(s.ground?1:tt=='m'?.45:tt=='w'?.65:1),fast=hy(P.vx,P.vy)>sp*1.3;if(tt=='l'&&!s.fire)hit(1);if(tt&&Math.random()<.25)pt.push({x:P.x,y:P.y+8,vx:rnd(-40,40),vy:tt=='l'?-70:rnd(-30,10),l:.4,m:.4,c:{l:'#e07b2a',w:'#9cc4d0',m:'#6b4a2a',i:'#e4f0f4'}[tt],r:2.5});
 if(P.dash>0)P.dash-=dt;else{const k=1-Math.pow(tt=='i'?.08:fast?1e-3:mv?1e-6:1e-8,dt);P.vx+=(ix*sp-P.vx)*k;P.vy+=(iy*sp-P.vy)*k}
 if(P.dcd>0)P.dcd-=dt;
 if(P.db>0&&P.dcd<=0&&P.dash<=0&&!(P.cur>0)){const dx=mv?ix:P.fx,dy=mv?iy:P.fy,l=hy(dx,dy)||1;P.dash=.13;P.dcd=s.dcd*(P.acc==2?.65:1);P.vx=dx/l*760;P.vy=dy/l*760;P.inv=Math.max(P.inv,.28);P.db=0;shake=4;sfx(300,.1,.04,'triangle')}
 if(P.dash>0)pt.push({x:P.x,y:P.y,vx:0,vy:0,l:.25,m:.25,c:P.ch.c,r:11});else if(mv&&Math.random()<.3)pt.push({x:P.x,y:P.y+9,vx:rnd(-25,25),vy:rnd(-25,25),l:.3,m:.3,c:'#ffffff44',r:2});
 P.x+=P.vx*dt;P.y+=P.vy*dt;P.x=cl(P.x,L+P.r,RT-P.r);P.y=cl(P.y,U+P.r,BT-P.r);pushRocks(P);
 if(P.inv>0)P.inv-=dt;P.oa+=dt*3;if(P.vf)P.vf=P.vf.filter(f=>f.dl>0?(f.dl-=dt,true):(f.t-=dt)>0);if(P.bs>0)P.bs-=dt;if(P.gf>0)P.gf-=dt;if(P.pend>0&&(P.pend-=dt)<=0)necroSuper();if(P.gn>0){P.gn-=dt;P.gr=(P.gr||0)+dt*2;while(P.gv<3&&GUN_T-P.gn>.2+P.gv*.3)gunVolley(++P.gv)}
 let ax=(K.ArrowRight?1:0)-(K.ArrowLeft?1:0),ay=(K.ArrowDown?1:0)-(K.ArrowUp?1:0);
 if(M.a&&!ax&&!ay){const mx=M.x-P.x,my=M.y-P.y,l=hy(mx,my)||1;P.fx+=(mx/l-P.fx)*.5;P.fy+=(my/l-P.fy)*.5;if(M.d){ax=mx;ay=my}}
 if(ax||ay){const l=hy(ax,ay);P.fx+=(ax/l-P.fx)*.4;P.fy+=(ay/l-P.fy)*.4;P.cd-=dt;if(P.cd<=0){shoot(ax,ay);P.cd=1/s.rate*(P.cur>0?1.6:1)}}else if(P.cd>0)P.cd-=dt;
 // portas
 const dr=doors(room);if(room.cleared)for(const d of dr){const tx=d.a?(d.a>0?P.x>=RT-P.r-1:P.x<=L+P.r+1)&&Math.abs(P.y-300)<42:(d.b>0?P.y>=BT-P.r-1:P.y<=U+P.r+1)&&Math.abs(P.x-480)<42;
  if(tx){if(d.r.locked){if(P.keys>0){if(P.acc!=7)P.keys--;d.r.locked=false;sfx(700,.2)}else{if(ban.t<.3)ban={t:1.2,s:'Trancado — precisa de chave'};continue}}goRoom(d.r,[d.a,d.b]);return}}
 // balas
 for(const b of bul){b.l-=dt;
  if(b.ho&&!b.h){let n=null,m=320;for(const e of en){const d=hy(e.x-b.x,e.y-b.y);if(d<m){m=d;n=e}}if(n){const sp=hy(b.vx,b.vy),a=Math.atan2(b.vy,b.vx),t=Math.atan2(n.y-b.y,n.x-b.x);let da=Math.atan2(Math.sin(t-a),Math.cos(t-a));const na=a+cl(da,-4*dt,4*dt);b.vx=Math.cos(na)*sp;b.vy=Math.sin(na)*sp}}
  b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.x<L||b.x>RT||b.y<U||b.y>BT){if(b.bo>0&&!b.h){b.bo--;if(b.x<L||b.x>RT)b.vx*=-1;else b.vy*=-1;b.x=cl(b.x,L,RT);b.y=cl(b.y,U,BT)}else b.l=-1}
  if(rockAt(b.x,b.y)){if(b.h||b.bo<=0)b.l=-1;else{b.bo--;b.vx*=-1;b.vy*=-1}}
  if(b.h){if(P.orb)for(let i=0;i<P.orb;i++){const a=P.oa+i*6.283/P.orb;if(hy(b.x-(P.x+Math.cos(a)*46),b.y-(P.y+Math.sin(a)*46))<14){b.l=-1;parts(b.x,b.y,'#cfc08a',4,120)}}
   if(b.l>0&&hy(b.x-P.x,b.y-P.y)<b.r+P.r-3){const ok=P.inv<=0&&P.dash<=0;hit(1);if(b.cu&&ok){P.cur=4;parts(P.x,P.y,'#b06aff',12,160);sfx(100,.3,.06,'sine')}if(b.po&&ok){P.poi=3;P.pt=1.5;parts(P.x,P.y,'#8fd04a',10,160)}b.l=-1}}
  else for(const e of en)if(b.l>0&&!(e.w>0)&&!(e.t=='wraith'&&e.s)&&!b.hs.includes(e)&&hy(b.x-e.x,b.y-e.y)<b.r+e.r){hurt(e,b.d,b.ab);b.hs.push(e);e.vx+=b.vx*.04;e.vy+=b.vy*.04;parts(b.x,b.y,e.c,3,150);sfx(260,.04,.02);
   if(b.ex){AB=b.ab;boom(b.x,b.y,55,b.d*.8,false);AB=0}if(b.pi>0)b.pi--;else b.l=-1}}
 for(const b of bul)if(b.mn&&b.l<=0)for(let i=0;i<8;i++)eb(b.x,b.y,i*.785,170,'#d08a3c');bul=bul.filter(b=>b.l>0);
 // inimigos
 for(const e of en){if(e.w>0){e.w-=dt;continue}e.fl-=dt;e.cd-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx*=.9;e.vy*=.9;const a=ang(e),d=hy(P.x-e.x,P.y-e.y);let mv=1;const sp0=e.sp,tz=e.t=='bat'?'':terrAt(e.x,e.y);if(tz=='w')e.sp*=.6;else if(tz=='m')e.sp*=.4;else if(tz=='l'){e.hp-=dt*(e.t=='boss'?2:5);if(Math.random()<.2)pt.push({x:e.x,y:e.y,vx:rnd(-30,30),vy:-60,l:.4,m:.4,c:'#e07b2a',r:3})}
  if(e.t=='drone'){if(e.s==0){e.x+=Math.cos(a)*e.sp*dt;e.y+=Math.sin(a)*e.sp*dt;if(d<90){e.s=1;e.cd=.75;sfx(900,.1,.04)}}else{e.x+=Math.cos(a)*e.sp*dt*.35;e.y+=Math.sin(a)*e.sp*dt*.35;if(e.cd<=0){e.hp=0;boom(e.x,e.y,85,6,false);if(hy(P.x-e.x,P.y-e.y)<90+P.r)hit(1);for(let i=0;i<8;i++)eb(e.x,e.y,i*.785+.39,200,'#d9623f')}}}
  else if(e.t=='mini'){e.x+=Math.cos(a)*e.sp*dt;e.y+=Math.sin(a)*e.sp*dt}
  else if(e.t=='blob'){e.x+=Math.cos(a)*e.sp*dt;e.y+=Math.sin(a)*e.sp*dt;if(e.cd<=0){e.cd=2.8;const sv=190*(1+.08*(fl-1));bul.push({x:e.x,y:e.y,vx:Math.cos(a)*sv,vy:Math.sin(a)*sv,r:8,h:1,l:3.5,c:'#8fd04a',po:1});sfx(180,.12,.04,'sine')}}
  else if(e.t=='turret'){const k=d>240?1:d<170?-1:0;e.x+=(Math.cos(a)*k-Math.sin(a)*.5)*e.sp*dt;e.y+=(Math.sin(a)*k+Math.cos(a)*.5)*e.sp*dt;
   if(e.cd<=0){e.cd=1.7;const n=[1,3,5][fl-1];for(let i=0;i<n;i++)eb(e.x,e.y,a+(i-(n-1)/2)*.3,230,'#d9a043')}}
  else if(e.t=='spin'){e.a+=dt*2;e.x+=Math.cos(e.a*.7)*e.sp*dt;e.y+=Math.sin(e.a*.5)*e.sp*dt;if(e.cd<=0){e.cd=2;for(let i=0;i<8;i++)eb(e.x,e.y,e.a+i*.785,190,'#b08ac0')}}
  else if(e.t=='charger'){if(e.s==0){e.x+=Math.cos(a)*e.sp*dt*.6;e.y+=Math.sin(a)*e.sp*dt*.6;if(e.cd<=0){e.s=1;e.cd=.6;e.a=a}}
   else if(e.s==1){if(e.cd<=0){e.s=2;e.cd=.9}}else if(e.s==2){e.x+=Math.cos(e.a)*430*dt;e.y+=Math.sin(e.a)*430*dt;if(e.cd<=0||e.hit){e.s=3;e.cd=.7}}else if(e.cd<=0){e.s=0;e.cd=1}}
  else if(e.t=='mage'){if(e.cd<=0){e.cd=2.6;e.x=rnd(L+60,RT-60);e.y=rnd(U+60,BT-60);parts(e.x,e.y,e.c,10,150);for(let i=-1;i<=1;i++)eb(e.x,e.y,ang(e)+i*.35,210,'#b58ac4')}}
  else if(e.t=='sniper'){const k=d>300?1:d<220?-1:0;e.x+=Math.cos(a)*k*e.sp*dt;e.y+=Math.sin(a)*k*e.sp*dt;if(e.s==0&&e.cd<=0){e.s=1;e.cd=.9;e.a=a}else if(e.s==1){if(e.cd<=0){e.s=0;e.cd=2.4;eb(e.x,e.y,e.a,520,'#8fbcc0')}else if(e.cd>.3)e.a=ang(e)}}
  else if(e.t=='healer'){const k=d<280?-1:.15;e.x+=Math.cos(a)*k*e.sp*dt;e.y+=Math.sin(a)*k*e.sp*dt;if(e.cd<=0){e.cd=3;for(const o of en)if(o!=e&&o.hp<o.mhp&&hy(o.x-e.x,o.y-e.y)<260)o.hp=Math.min(o.mhp,o.hp+o.mhp*.4);parts(e.x,e.y,'#8fb86f',16,220);sfx(700,.15,.03,'sine')}}
  else if(e.t=='sapper'){const k=d<200?-.5:1;e.x+=Math.cos(a)*k*e.sp*dt;e.y+=Math.sin(a)*k*e.sp*dt;if(e.cd<=0){e.cd=2.2;bul.push({x:e.x,y:e.y,vx:0,vy:0,r:9,h:1,l:1.8,mn:1,c:'#d08a3c'})}}
  else if(e.t=='brute'){e.x+=Math.cos(a)*e.sp*dt;e.y+=Math.sin(a)*e.sp*dt;if(e.cd<=0){e.cd=2.4;for(let i=0;i<12;i++)eb(e.x,e.y,i*.5236+e.a,150,'#c98b3a');e.a+=.2;shake=4}}else if(e.t=='wraith'){e.q=(e.q==null?rnd(1,2):e.q)-dt;if(e.q<=0){e.s=e.s?0:1;e.q=e.s?1.8:2.6;parts(e.x,e.y,e.c,14,170);sfx(e.s?240:420,.15,.03,'sine');if(!e.s){for(let i=-2;i<=2;i++)eb(e.x,e.y,a+i*.22,270,'#a8a0c0');e.cd=1.2}}const f=e.s?(d>50?1.5:.2):(d>200?1:-.5),sd=e.s?.2:.7;e.x+=(Math.cos(a+1.4)*sd+Math.cos(a)*f)*e.sp*dt;e.y+=(Math.sin(a+1.4)*sd+Math.sin(a)*f)*e.sp*dt;if(e.s&&Math.random()<.25)pt.push({x:e.x+rnd(-e.r,e.r),y:e.y+rnd(-e.r,e.r),vx:0,vy:-20,l:.35,m:.35,c:'#a8a0c0',r:2});if(e.cd<=0&&!e.s){e.cd=1.5;for(let i=-1;i<=1;i++)eb(e.x,e.y,a+i*.2,260,'#a8a0c0')}}else if(e.t=='bat'){e.a+=dt*(6+Math.sin(tm*3)*3);e.x+=(Math.cos(a)+Math.cos(e.a)*1.1)*e.sp*dt*.6;e.y+=(Math.sin(a)+Math.sin(e.a)*1.1)*e.sp*dt*.6}
  else if(e.t=='boss'){const ph=e.hp/e.mhp>.66?0:e.hp/e.mhp>.33?1:2;e.a+=dt*(1+ph*.5);
   if(e.s==0){e.x+=Math.cos(a)*e.sp*dt*.7;e.y+=Math.sin(a)*e.sp*dt*.7;if(e.cd<=0){const m=(e.tb||e.sm)&&Math.random()<.6?pick(BX.filter(z=>z!=e.lm)):BP[e.bt][ri(0,BP[e.bt].length-1)];e.lm=m;e.m=m;
    if(m>=11){bossSpell(e,m,ph,a);if(ph==2&&Math.random()<.3)bossSpell(e,pick(BX.filter(z=>z!=m)),ph,a)}else if(m==0){for(let i=-3;i<=3;i++)eb(e.x,e.y,a+i*.16,260,'#a65a3a')}
    else if(m==1){for(let i=0;i<14+ph*4;i++)eb(e.x,e.y,e.a+i*6.283/(14+ph*4),200,'#d98f5a')}
    else if(m==2){e.s=1;e.a=a;e.q=0}
    else if(m==3){e.s=2;e.cd=0;e.q=0}
    else if(m==7){for(let i=0;i<20+ph*8;i++)eb(e.x,e.y,e.a+i*.62,120+i*7,'#d98f5a')}else if(m==8){const g=rnd(L+90,RT-90);for(let x=L+20;x<RT;x+=34)if(Math.abs(x-g)>62)eb(x,U+12,1.57,190+ph*30,'#7a6a9a')}else if(m==9){parts(e.x,e.y,e.c,20,200);e.x=rnd(L+90,RT-90);e.y=rnd(U+90,BT-90);for(let i=-2-ph;i<=2+ph;i++)eb(e.x,e.y,ang(e)+i*.2,300,'#d9623f')}else if(m==10){const w=mk(pick(['charger','sniper','turret']),e.x+rnd(-60,60),e.y+rnd(-60,60));elite(w);en.push(w)}else if(m==5){for(let i=0;i<10+ph*3;i++)eb(rnd(L+20,RT-20),U+12,1.57,rnd(190,280),'#7a6a9a')}else if(m==6){for(let q=0;q<3;q++)for(let i=0;i<10+ph*2;i++)eb(e.x,e.y,q*.2+i*6.283/(10+ph*2),150+q*60,'#d4a93a')}else{for(let i=0;i<2+ph;i++)en.push(mk(pick(['drone','bat','mage']),e.x+rnd(-50,50),e.y+rnd(-50,50)))}
    if(e.s==0)e.cd=(1.3-ph*.28-(fl-1)*.1)*(e.tb||e.sm?.72:1);else if(e.s==1)e.cd=.9}}
   else if(e.s==1){if(e.cd<=0){e.s=3;e.cd=.8}}else if(e.s==3){e.x+=Math.cos(e.a)*520*dt;e.y+=Math.sin(e.a)*520*dt;if(e.cd<=0||e.hit){e.s=0;e.cd=1.2}}
   else if(e.s==2){if(e.cd<=0){e.cd=.07;e.q++;eb(e.x,e.y,e.q*.45,230,'#a65a3a');eb(e.x,e.y,e.q*.45+3.14,230,'#a65a3a');if(e.q>40){e.s=0;e.cd=1.4}}}}
  e.sp=sp0;e.hit=0;e.x=cl(e.x,L+e.r,RT-e.r);e.y=cl(e.y,U+e.r,BT-e.r);pushRocks(e);
  for(const o of en)if(o!=e){const dx=e.x-o.x,dy=e.y-o.y,dl=hy(dx,dy);if(dl<e.r+o.r&&dl>0){e.x+=dx/dl*40*dt;e.y+=dy/dl*40*dt}}
  if(d<e.r+P.r-2)hit(e.t=='boss'||e.el?2:1);if(P.ph>0&&d<e.r+P.r+8)hurt(e,dt*40,1);
  if(P.orb)for(let i=0;i<P.orb;i++){const q=P.oa+i*6.283/P.orb;if(hy(e.x-(P.x+Math.cos(q)*46),e.y-(P.y+Math.sin(q)*46))<e.r+8)hurt(e,dt*10,P.swt>0)}}
 for(const e of en.slice())if(e.hp<=0)kill(e);en=room.en=en.filter(e=>e.hp>0);
 if(!room.cleared&&!en.length&&!room.tot){room.cleared=true;clearHz();sfx(660,.3,.05,'triangle');
  if(room.summ){room.summ=0;pk.push({t:'i',id:27,x:480,y:300,pr:0});ban={t:3.5,s:'Os dois chefes caíram! Item recebido'}}else if(room.t=='boss'){room.pk.push({t:'i',id:take(),x:480,y:260,pr:0});room.trap={x:480,y:410};bossRooms(room)}
  else if(room.tb)pk.push({t:'i',id:ri(24,26),x:480,y:300,pr:0});else if(Math.random()<.05)pk.push({t:'i',id:take(),x:480,y:300,pr:0});else if(Math.random()<.95)pk.push({t:dropT(Math.random()),x:480,y:300,pr:0})}
 if(room.trap&&hy(P.x-480,P.y-410)<26){if(fl>=3){st='win';return}fl++;newFloor();return}
 // pickups
 for(const q of pk.slice()){if(!pk.includes(q)||q.nx>tm)continue;const dq=hy(q.x-P.x,q.y-P.y);if(!q.pr&&q.t!='i'&&q.t!='x'&&dq<(P.acc==3?220:100)&&dq>1&&!(q.t=='h'&&P.hp>=P.max)){q.x+=(P.x-q.x)/dq*260*dt;q.y+=(P.y-q.y)/dq*260*dt}if(dq>24||(q.t=='h'&&P.hp>=P.max))continue;
  if(q.pr>P.coins){if(ban.t<.3)ban={t:1.2,s:'Moedas insuficientes ('+q.pr+')'};continue}if(q.ph){if(P.max<=q.ph){if(ban.t<.3)ban={t:1.2,s:'Vida insuficiente'};continue}P.max-=q.ph;P.hp=Math.min(P.hp,P.max)}if(q.g)for(const o of pk.slice())if(o!=q&&o.g)pk.splice(pk.indexOf(o),1);P.coins-=q.pr;
  if(q.t=='c')P.coins++;else if(q.t=='h')P.hp=Math.min(P.max,P.hp+2);else if(q.t=='b')P.bombs++;else if(q.t=='k')P.keys++;else if(q.t=='a'||q.t=='n'){P.sl.push(q.t,q.t);P.sl=P.sl.slice(-12)}else if(q.t=='e'){P.max+=2;P.hp=Math.min(P.max,P.hp+2)}else if(q.t=='s'){P.sm=(P.sm||0)+1;ban={t:3.5,s:'Totem de Invocação — aperte '+kn('summon')+' numa sala limpa',ic:['p',3]}}else if(q.t=='x'){if(P.acc>=0)pk.push({t:'x',id:P.acc,x:q.x,y:q.y+40,pr:0,nx:tm+1.5});P.acc=q.id;ban={t:3.5,s:ACC[q.id][0]+' — '+ACC[q.id][1],ic:['x',q.id]}}
  else{const it=IT[q.id];it[2](P.s,P);P.items.push(q.id);ban={t:3.5,s:it[0]+' — '+it[1],ic:['i',q.id]}}
  pk.splice(pk.indexOf(q),1);sfx(880,.12,.04,'triangle')}
 hzUp(dt);for(const b of bm.slice()){b.t-=dt;if(b.t<=0){bm.splice(bm.indexOf(b),1);if(b.ib!=null)ibomb(b);else boom(b.x,b.y,110,40,true)}}
 if(room.tot){const t=room.tot;t.t-=dt;if(Math.random()<.5)pt.push({x:t.x+rnd(-30,30),y:t.y+rnd(-30,30),vx:0,vy:-60,l:.5,m:.5,c:'#8c6f9e',r:3});if(t.t<=0){room.tot=null;const cs=[[200,150],[760,150],[200,450],[760,450]].sort((a,b)=>hy(b[0]-P.x,b[1]-P.y)-hy(a[0]-P.x,a[1]-P.y));for(let i=0;i<2;i++){const b=mk('boss',cs[i][0],cs[i][1]),k=ri(0,4);b.bt=k;b.c=BN[k][1];b.nm=BN[k][0]+' (invocado)';b.sm=1;if(k==2)b.sp*=1.5;en.push(b)}ban={t:2.5,s:'Dois chefes foram invocados!'};shake=14;sfx(70,.5,.09,'sawtooth')}}
 pt=pt.filter(p=>(p.l-=dt)>0);for(const p of pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.93;p.vy*=.93}
 shake*=.88;ban.t-=dt}
