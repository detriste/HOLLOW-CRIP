/* Perigos de chefes: raios, fogo, pilares, lava e sigilos */
let hz=[],lvr=[];

const BX=[11,12,13,14,15,16];

function clearHz(){novoClear();hz=[];for(const l of lvr){if(l.o)l.r.tm[l.k]=l.o;else delete l.r.tm[l.k]}lvr=[];if(P)P.cur=0;if(typeof room!='undefined'&&room&&room.rocks)room.rocks=room.rocks.filter(k=>!k.t)}

function lavaLine(ph){const hz0=Math.random()<.5,pi=cl(Math.floor((P.x-L)/TS),0,13),pj=cl(Math.floor((P.y-U)/TS),0,7),tl=[];
 const line=(h,idx)=>{const n=h?14:8,g=ri(1,n-3);for(let q=0;q<n;q++){if(q==g||q==g+1)continue;const i=h?q:idx,j=h?idx:q;if(!room.rocks.some(o=>o.x==i&&o.y==j))tl.push([i,j])}};
 line(hz0,hz0?pj:pi);if(ph>0)line(!hz0,hz0?pi:pj);hz.push({k:'lav',t:1,d:1,tl});sfx(80,.6,.07,'sawtooth');shake=Math.max(shake,8)}

function pillars(ph){const n=5+ph*2,pi=Math.floor((P.x-L)/TS),pj=Math.floor((P.y-U)/TS);let c=0;for(let k=0;k<60&&c<n;k++){const i=ri(0,13),j=ri(0,7);if((i>=6&&i<=7&&(j<2||j>5))||(j>=3&&j<=4&&(i<2||i>11)))continue;if(Math.max(Math.abs(i-pi),Math.abs(j-pj))<2)continue;if(room.rocks.some(o=>o.x==i&&o.y==j)||hz.some(h=>h.k=='pil'&&h.i==i&&h.j==j))continue;hz.push({k:'pil',i,j,t:.9,d:.9});c++}sfx(100,.4,.06,'square')}

function bossSpell(e,m,ph,a){
 if(m==11){const n=1+(ph>0?1:0)+(ph>1?1:0);for(let i=-n;i<=n;i++)bul.push({x:e.x,y:e.y,vx:Math.cos(a+i*.3)*155,vy:Math.sin(a+i*.3)*155,r:11,h:1,l:5,c:'#9a4fd0',cu:1});sfx(110,.35,.06,'sine');parts(e.x,e.y,'#9a4fd0',16,220)}
 else if(m==12){const n=4+ph*2+(fl>2?1:0);for(let i=0;i<n;i++){const d=.75+i*.2,px=i==0?P.x:i%2?rnd(L+40,RT-40):P.x+rnd(-100,100),py=i==0?P.y:i%2?rnd(U+40,BT-40):P.y+rnd(-100,100);hz.push({k:'bolt',x:cl(px,L+30,RT-30),y:cl(py,U+30,BT-30),t:d,d,r:38})}sfx(300,.4,.05,'sawtooth')}
 else if(m==13){const n=3+ph;for(let i=0;i<n;i++){const q=rnd(0,6.283),dd=i?rnd(90,200):0,px=cl(P.x+P.vx*.4+Math.cos(q)*dd,L+60,RT-60),py=cl(P.y+P.vy*.4+Math.sin(q)*dd,U+60,BT-60);hz.push({k:'fire',x:px,y:py,r:58,t:.9,d:.9,l:6})}for(let i=0;i<8;i++)eb(e.x,e.y,e.a+i*.785,175,'#f07a2a');sfx(140,.4,.06,'sawtooth')}
 else if(m==14)pillars(ph);
 else if(m==15)lavaLine(ph);
 else if(m==16){hz.push({k:'sig',x:P.x,y:P.y,r:78,t:1.1,d:1.1});if(ph>0)hz.push({k:'sig',x:cl(P.x+P.vx*.6+rnd(-150,150),L+80,RT-80),y:cl(P.y+P.vy*.6+rnd(-110,110),U+80,BT-80),r:78,t:1.3,d:1.3});sfx(90,.5,.06,'sine')}}

function hzUp(dt){
 if(P.cur>0){P.cur-=dt;if(Math.random()<.35)pt.push({x:P.x+rnd(-12,12),y:P.y+rnd(-12,8),vx:0,vy:-45,l:.5,m:.5,c:'#9a4fd0',r:2.5})}
 for(const l of lvr.slice()){l.t-=dt;if(l.t<=0){if(l.o)l.r.tm[l.k]=l.o;else delete l.r.tm[l.k];lvr.splice(lvr.indexOf(l),1)}}
 for(const k of room.rocks)if(k.t&&(k.t-=dt)<=0){parts(L+k.x*TS+30,U+k.y*TS+30,'#8a8374',10,160);room.rocks=room.rocks.filter(o=>o!=k)}
 for(const h of hz.slice()){h.t-=dt;
  if(h.k=='bolt'){if(!h.f){if(h.t<=0){h.f=1;h.t=.25;shake=Math.max(shake,8);sfx(1200,.12,.06,'sawtooth');if(hy(P.x-h.x,P.y-h.y)<h.r+P.r-4)hit(1);for(let i=0;i<4;i++)eb(h.x,h.y,i*1.5708+.785,170,'#bfe8ff')}}else if(h.t<=0)hz.splice(hz.indexOf(h),1)}
  else if(h.k=='fire'){if(!h.f){if(h.t<=0){h.f=1;h.t=h.l;sfx(160,.2,.05,'sawtooth')}}else{if(Math.random()<.4)pt.push({x:h.x+rnd(-h.r,h.r)*.8,y:h.y+rnd(-h.r,h.r)*.5,vx:0,vy:-70,l:.5,m:.5,c:Math.random()<.5?'#ffb84a':'#ff6a1a',r:3});if(!P.s.fire&&hy(P.x-h.x,P.y-h.y)<h.r)hit(1);if(h.t<=0)hz.splice(hz.indexOf(h),1)}}
  else if(h.k=='sig'){if(!h.f){if(h.t<=0){h.f=1;h.t=.3;shake=Math.max(shake,8);sfx(70,.4,.08,'sawtooth');parts(h.x,h.y,'#b06aff',24,260);for(let i=0;i<10;i++)eb(h.x,h.y,i*.628+tm,170,'#9a4fd0');if(hy(P.x-h.x,P.y-h.y)<h.r){const ok=P.inv<=0&&P.dash<=0;hit(1);if(ok){P.cur=4;sfx(100,.3,.06,'sine')}}}}else if(h.t<=0)hz.splice(hz.indexOf(h),1)}
  else if(h.k=='pil'){if(h.t<=0){hz.splice(hz.indexOf(h),1);if(!room.rocks.some(o=>o.x==h.i&&o.y==h.j))room.rocks.push({x:h.i,y:h.j,t:10});parts(L+h.i*TS+30,U+h.j*TS+30,'#8a8374',12,200);shake=Math.max(shake,4)}}
  else if(h.k=='lav'){if(h.t<=0){hz.splice(hz.indexOf(h),1);room.tm=room.tm||{};for(const[i,j]of h.tl){const key=tk(i,j),ex=lvr.find(l=>l.r==room&&l.k==key);if(ex)ex.t=Math.max(ex.t,5.5);else{lvr.push({r:room,k:key,o:room.tm[key]||null,t:5.5});room.tm[key]='l'}}shake=Math.max(shake,6)}}}}

function hzDraw(){for(const h of hz){
 if(h.k=='bolt'){if(!h.f){const p=1-h.t/h.d;X.strokeStyle='rgba(190,230,255,'+(.25+.5*p)+')';X.lineWidth=2;X.beginPath();X.arc(h.x,h.y,h.r*(1.25-.25*p),0,6.283);X.stroke();X.fillStyle='rgba(190,230,255,'+(.08+.2*p)+')';X.beginPath();X.arc(h.x,h.y,h.r*p,0,6.283);X.fill()}
  else{X.fillStyle='rgba(220,240,255,.45)';X.beginPath();X.arc(h.x,h.y,h.r*1.1,0,6.283);X.fill();for(const[col,lw2]of[['#e8f6ff',5],['#7fb8ff',2]]){X.strokeStyle=col;X.lineWidth=lw2;X.beginPath();let yy=U-20,xx=h.x+rnd(-8,8);X.moveTo(xx,yy);while(yy<h.y-20){yy+=rnd(24,40);xx=h.x+rnd(-20,20);X.lineTo(xx,Math.min(yy,h.y))}X.lineTo(h.x,h.y);X.stroke()}}}
 else if(h.k=='fire'){if(!h.f){X.setLineDash([7,6]);X.strokeStyle='rgba(255,140,50,'+(.4+.4*(1-h.t/h.d))+')';X.lineWidth=3;X.beginPath();X.arc(h.x,h.y,h.r,0,6.283);X.stroke();X.setLineDash([]);X.fillStyle='rgba(255,120,40,.1)';X.beginPath();X.arc(h.x,h.y,h.r,0,6.283);X.fill()}
  else{const fa=Math.min(1,h.t/.5),g=X.createRadialGradient(h.x,h.y,4,h.x,h.y,h.r);g.addColorStop(0,'rgba(255,210,90,'+.85*fa+')');g.addColorStop(.6,'rgba(240,100,30,'+.6*fa+')');g.addColorStop(1,'rgba(160,30,10,0)');X.fillStyle=g;X.beginPath();X.arc(h.x,h.y,h.r,0,6.283);X.fill();
   for(let i=0;i<7;i++){const q=i*.897+h.x,rr=h.r*(.25+.5*((Math.sin(q*3)+1)/2)),fx=h.x+Math.cos(q)*rr,fy=h.y+Math.sin(q)*rr*.7,fh=10+7*Math.sin(tm*10+i*2);X.fillStyle=i%2?'#ffb84a':'#ff6a1a';X.globalAlpha=fa;X.beginPath();X.moveTo(fx-5,fy+3);X.quadraticCurveTo(fx-3,fy-fh*.5,fx,fy-fh);X.quadraticCurveTo(fx+3,fy-fh*.5,fx+5,fy+3);X.closePath();X.fill();X.globalAlpha=1}}}
 else if(h.k=='sig'){const p=h.f?1:1-h.t/h.d;X.save();X.translate(h.x,h.y);X.rotate(tm*(h.f?6:1.5));X.strokeStyle='rgba(176,106,255,'+(h.f?.9:.35+.4*p)+')';X.lineWidth=3;X.beginPath();X.arc(0,0,h.r*(h.f?1.1:1),0,6.283);X.stroke();X.beginPath();for(let i=0;i<5;i++){const q=i*2.513-1.571;X[i?'lineTo':'moveTo'](Math.cos(q)*h.r*.85,Math.sin(q)*h.r*.85)}X.closePath();X.stroke();X.fillStyle='rgba(120,50,170,'+(.08+.25*p)+')';X.beginPath();X.arc(0,0,h.r*p,0,6.283);X.fill();X.restore()}
 else if(h.k=='pil'){const p=1-h.t/h.d,x=L+h.i*TS,y=U+h.j*TS;X.fillStyle='rgba(30,20,10,'+(.25+.35*p)+')';X.fillRect(x+4,y+4,TS-8,TS-8);X.strokeStyle='rgba(200,170,110,.8)';X.lineWidth=2;X.setLineDash([5,5]);X.strokeRect(x+5,y+5,TS-10,TS-10);X.setLineDash([])}
 else if(h.k=='lav'){const p=1-h.t/h.d;X.fillStyle='rgba(240,110,30,'+(.12+.3*p*Math.abs(Math.sin(tm*14)))+')';X.strokeStyle='rgba(255,160,60,.8)';X.lineWidth=2;for(const[i,j]of h.tl){X.fillRect(L+i*TS,U+j*TS,TS,TS);X.strokeRect(L+i*TS+3,U+j*TS+3,TS-6,TS-6)}}}}
