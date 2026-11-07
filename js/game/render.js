/* Desenho completo de cada quadro */
function draw(){X.save();X.fillStyle='#0d0b09';X.fillRect(0,0,W,H);
 if(st=='select'){drawSel();X.restore();return}if(st=='settings'){drawSettings();X.restore();return}
 if(st=='menu'){txt('CRIPTA DO VAZIO',480,230+Math.sin(performance.now()/700)*4,60,'#a8452f');txt('um roguelike de cripta, lama e brasa — 4 heróis, 3 andares, '+(IT.length-4)+' itens, '+ACC.length+' acessórios',480,275,16,'#9a8f7c');
  txt(mvTxt()+' mover  •  MOUSE mira, clique atira (ou '+shTxt()+')  •  '+kn('dash').toUpperCase()+' dash',480,345,15);txt(kn('ability')+' habilidade  •  '+kn('bomb')+' ou botão direito bomba  •  '+kn('inv')+' inventário  •  '+kn('map')+' mapa  •  '+kn('restart')+' reiniciar',480,370,15);txt('Lava queima • água e lama retardam • gelo escorrega',480,395,13,'#9a8f7c');txt('Pressione ENTER ou clique para escolher o herói',480,430,20,'#a8452f');settingsBtn(360,462,240,42,'⚙ Configurar teclas (F1)');X.restore();return}
 if(shake>.5)X.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);
 const bi=BI[fl-1]||BI[0];X.fillStyle=bi.w;X.fillRect(0,0,W,H);
 for(let i=0;i<14;i++)for(let j=0;j<8;j++){const h=(i*73856093^j*19349663^(room.x||0)*83492791^(room.y||0)*2654435)>>>0,x=L+i*TS,y=U+j*TS;X.fillStyle=bi.f[h%3];X.fillRect(x,y,TS,TS);X.strokeStyle='#0003';X.lineWidth=1;X.strokeRect(x+.5,y+.5,TS-1,TS-1);if(h%7==0){X.fillStyle=bi.d;X.fillRect(x+(h>>3)%40+6,y+(h>>5)%40+6,7,3)}}
 if(/boss|shop|treasure|devil|angel|secret/.test(room.t)){X.fillStyle={boss:'#a8332f1c',devil:'#8a1f1f40',angel:'#f0f0e044',secret:'#6a9a5a18'}[room.t]||'#d4a93a14';X.fillRect(L,U,RT-L,BT-U)}
 for(const k in room.tm){const[i,j]=k.split(',').map(Number),t=room.tm[k],x=L+i*TS,y=U+j*TS,w=Math.sin(tm*2+i+j*1.7);X.fillStyle=t=='l'?'hsl('+(12+w*6)+',85%,'+(34+w*5)+'%)':t=='w'?'hsl(197,38%,'+(28+w*3)+'%)':t=='m'?'#4a3622':'#a9c4cc';X.fillRect(x,y,TS,TS);
  X.strokeStyle=t=='l'?'#f0a040':t=='w'?'#8fb8c4':t=='m'?'#33241a':'#e4f0f4';X.lineWidth=2;X.beginPath();
  if(t=='m'){X.arc(x+18+w*3,y+22,6,0,6.3);X.moveTo(x+46,y+40+w*2);X.arc(x+42,y+40+w*2,4,0,6.3)}else for(let q=0;q<3;q++){const yy=y+14+q*18;X.moveTo(x+6,yy);X.quadraticCurveTo(x+22,yy+w*5,x+34,yy);X.quadraticCurveTo(x+46,yy-w*5,x+54,yy)}X.stroke()}
 X.strokeStyle='#1c130d';X.lineWidth=6;X.strokeRect(L,U,RT-L,BT-U);
 for(const d of doors(room)){const c=d.r.locked?'#d4a93a':room.cleared?'#6b4a2a':'#2a1a14',x=480+d.a*420,y=300+d.b*240;X.fillStyle=c;X.strokeStyle='#1c130d';X.lineWidth=3;if(d.a){X.fillRect(x-9,268,18,64);X.strokeRect(x-9,268,18,64)}else{X.fillRect(448,y-9,64,18);X.strokeRect(448,y-9,64,18)}
  const ic={boss:'☠',shop:'$',treasure:'★',devil:'D',angel:'A'}[d.r.t];if(ic)txt(ic,x-d.a*26,y-d.b*26+6,16,'#e6dcc6')}
 for(const k of room.rocks){const x=L+k.x*TS,y=U+k.y*TS;X.fillStyle='#0004';X.beginPath();X.ellipse(x+TS/2+3,y+TS-6,TS*.42,9,0,0,6.283);X.fill();X.fillStyle='#6a645a';X.strokeStyle='#1c130d';X.lineWidth=3;X.beginPath();X.roundRect(x+5,y+5,TS-10,TS-12,12);X.fill();X.stroke();X.fillStyle='#8a8374';X.beginPath();X.roundRect(x+10,y+9,TS-26,10,5);X.fill()}
 if(room.trap){poly(480,410,24,6,tm,'#8c6f9e','#1a0f33');txt('▼',480,418,18,'#8c6f9e')}
 hzDraw();if(room.tot){const t=room.tot,z=1+Math.sin(tm*14)*.12;X.strokeStyle='#8c6f9e';X.lineWidth=3;X.beginPath();X.arc(t.x,t.y,30+(1.4-t.t)*20,0,6.283);X.stroke();X.save();X.translate(t.x,t.y);X.scale(z,z);icon('p',3,0,0,44);X.restore()}
 for(const q of pk){const bob=Math.sin(tm*4+q.x)*3;if(q.t=='i'||q.t=='x'){X.fillStyle='#0007';X.beginPath();X.ellipse(q.x,q.y+24,16,6,0,0,6.283);X.fill();X.fillStyle=q.t=='x'?'#1d2a26':'#241e17';X.strokeStyle=q.t=='x'?'#8fb0a0':'#d4a93a';X.lineWidth=3;X.beginPath();X.arc(q.x,q.y+bob,21,0,6.283);X.fill();X.stroke();icon(q.t,q.id,q.x,q.y+bob,32)}
  else if(q.t=='c'){X.fillStyle='#0006';X.beginPath();X.ellipse(q.x,q.y+14,7,2.5,0,0,6.283);X.fill();X.save();X.translate(q.x,q.y+bob);X.scale(.25+.75*Math.abs(Math.cos(tm*3+q.x)),1);icon('p',0,0,0,22);X.restore()}else if('hane'.includes(q.t))txt('♥',q.x,q.y+bob+7,22,{h:'#b5342f',a:'#7fa6c4',n:'#55505e',e:'#e8dcc8'}[q.t]);else{X.fillStyle='#0006';X.beginPath();X.ellipse(q.x,q.y+17,8,3,0,0,6.283);X.fill();icon('p',q.t=='b'?1:q.t=='s'?3:2,q.x,q.y+bob,q.t=='b'?26:28)}
  if(q.ph)txt('-'+q.ph/2+' ♥',q.x,q.y+34,14,'#b5342f');if((q.t=='i'||q.t=='x')&&hy(q.x-P.x,q.y-P.y)<90)txt((q.t=='x'?ACC:IT)[q.id][0],q.x,q.y-26,12,'#efe4c8');if(q.pr)txt('$'+q.pr,q.x,q.y+34,14,'#d4a93a')}
 for(const b of bm)drawBomb(b)
 for(const p of pt){X.globalAlpha=Math.max(0,p.l/p.m);X.fillStyle=p.c;X.beginPath();X.arc(p.x,p.y,p.r||2.5,0,6.283);X.fill()}X.globalAlpha=1;
 for(const e of en){if(e.w>0){poly(e.x,e.y,e.r*(1-e.w)+4,6,tm*6,e.c+'88');continue}const c=e.fl>0||(e.t=='drone'&&e.s==1&&Math.sin(tm*40)>0)?'#fff':e.c;X.fillStyle='#0005';X.beginPath();X.ellipse(e.x,e.y+e.r,e.r*.9,e.r*.28,0,0,6.283);X.fill();X.save();X.translate(0,Math.sin(tm*7+e.r*3)*1.8);if(e.t=='wraith'&&e.s)X.globalAlpha=.07+.04*Math.sin(tm*9);
  if(e.t=='drone'){if(e.s==1){X.strokeStyle='#d9623f66';X.lineWidth=2;X.beginPath();X.arc(e.x,e.y,85,0,6.283);X.stroke()}poly(e.x,e.y,e.r,3,ang(e),c,'#2a0a14')}else if(e.t=='turret')poly(e.x,e.y,e.r,4,.785,c,'#2a1808');
  else if(e.t=='spin'){X.save();X.translate(e.x,e.y);X.rotate(e.a);poly(0,0,e.r,8,0,c,'#1a0f33');poly(0,0,e.r*.5,4,0,c);X.restore()}
  else if(e.t=='charger'){const w=e.s==1&&Math.sin(tm*40)>0;poly(e.x,e.y,e.r+(e.s==2?3:0),4,e.a||0,w?'#fff':c,'#2a2508');if(e.s==1){X.strokeStyle='#d8bd4a55';X.beginPath();X.moveTo(e.x,e.y);X.lineTo(e.x+Math.cos(e.a)*300,e.y+Math.sin(e.a)*300);X.stroke()}}
  else if(e.t=='boss'){const ph=e.hp/e.mhp>.66?0:e.hp/e.mhp>.33?1:2;if(e.s==1){X.strokeStyle='#a65a3a55';X.lineWidth=8;X.beginPath();X.moveTo(e.x,e.y);X.lineTo(e.x+Math.cos(e.a)*500,e.y+Math.sin(e.a)*500);X.stroke()}
   if(e.tb||e.sm){const ac=e.tb?'#d4a93a':'#b06aff';X.strokeStyle=ac+'88';X.lineWidth=2;X.beginPath();X.arc(e.x,e.y,e.r+14+Math.sin(tm*4)*3,0,6.283);X.stroke();for(let i=0;i<6;i++){const q=tm*1.3+i*1.047;poly(e.x+Math.cos(q)*(e.r+14),e.y+Math.sin(q)*(e.r+14),4,3,q,ac,1)}}poly(e.x,e.y,e.r,4+e.bt+ph*2,e.a,c,'#240a22');poly(e.x,e.y,e.r*.55,3+ph,-e.a*1.5,c);X.fillStyle=c;X.beginPath();X.arc(e.x,e.y,5,0,6.283);X.fill()}
  else if(SH[e.t])poly(e.x,e.y,e.r+Math.sin(tm*6),SH[e.t][0],tm*SH[e.t][1],c,'#12081a');else poly(e.x,e.y,e.r+Math.sin(tm*6)*1.5,e.t=='mini'?5:7,0,c,'#082a1c');
  face(e,c);if(e.t!='boss'&&e.hp<e.mhp){X.fillStyle='#fff3';X.fillRect(e.x-14,e.y-e.r-9,28,3);X.fillStyle=c;X.fillRect(e.x-14,e.y-e.r-9,28*e.hp/e.mhp,3)}X.restore()}
 for(const b of bul){X.strokeStyle='#1c130d';X.lineWidth=2;X.fillStyle=b.h?b.c:'#efe4c8';X.beginPath();X.arc(b.x,b.y,b.r,0,6.283);X.fill();X.stroke()}
 if(P.orb)for(let i=0;i<P.orb;i++){const a=P.oa+i*6.283/P.orb;poly(P.x+Math.cos(a)*46,P.y+Math.sin(a)*46,7,4,tm*3,'#cfc08a','#0a2a33')}
 if(!(P.inv>0&&P.ph<=0&&Math.sin(tm*50)>0)){const a=Math.atan2(P.fy,P.fx),v=hy(P.vx,P.vy),va=Math.atan2(P.vy,P.vx);X.save();X.globalAlpha=P.ph>0?.5:1;X.translate(P.x,P.y);X.rotate(va);X.scale(1+v*.0007,1-v*.00035);X.rotate(-va);body(P.ch,0,0,P.r+2,a,Math.min(1,v/200),tm);if(P.poi>0){X.fillStyle='rgba(120,200,60,.35)';X.beginPath();X.arc(0,0,P.r+2,0,6.283);X.fill()}if(P.cur>0){X.strokeStyle='#b06aff';X.lineWidth=2;X.setLineDash([4,4]);X.beginPath();X.arc(0,0,P.r+8,tm*3,tm*3+6.283);X.stroke();X.setLineDash([])}X.restore()}
 // HUD
 drawHUD();
 
 
 
 for(const r of Object.values(G)){const vs=r.vis,adj=doors(r).some(d=>d.r.vis);if((!vs&&!adj)||(r.sec&&!r.rev))continue;const x=W-100+(r.x-3)*12+36,y=4+r.y*8;X.fillStyle=r==room?'#fff':!vs?'#ffffff22':rc(r);X.fillRect(x,y,10,6)}
 en.filter(e=>e.t=='boss').forEach((bo,i)=>{const by=548-i*16;X.fillStyle='#ffffff22';X.fillRect(280,by,400,8);X.fillStyle=bo.c;X.fillRect(280,by,400*Math.max(0,bo.hp)/bo.mhp,8);txt(bo.nm,270,by+8,11,bo.c,'right')});
 if(ban.t>0){const a=Math.min(1,ban.t);X.globalAlpha=a;X.font='600 22px Georgia,serif';const ix=ban.ic?36:0,w=X.measureText(ban.s).width+36+ix;X.fillStyle='#1a1612dd';X.strokeStyle='#4a4032';X.lineWidth=2;X.beginPath();X.roundRect(480-w/2,76-(1-a)*12,w,38,8);X.fill();X.stroke();if(ban.ic)icon(ban.ic[0],ban.ic[1],480-w/2+30,95-(1-a)*12,28);txt(ban.s,480+ix/2,102-(1-a)*12,22,'#efe4c8');X.globalAlpha=1}
 if(st=='inv')drawInv();if(st=='map')drawMap();if(st=='pause'){txt('PAUSADO — '+kn('pause')+' para continuar',480,300,30);X.fillStyle='#241e17';X.strokeStyle='#5a4a35';X.lineWidth=2;X.beginPath();X.roundRect(380,350,200,42,8);X.fill();X.stroke();txt('Reiniciar partida ('+kn('restart')+')',480,377,14,'#e6dcc6');settingsBtn(380,402,200,42,'Configurar teclas (F1)')}
 if(st=='dead'){X.fillStyle='#000a';X.fillRect(0,0,W,H);txt('VOCÊ CAIU',480,260,56,'#b5342f');txt('Andar '+fl+' • '+kills+' abates • '+P.items.length+' itens',480,310,18);txt('ENTER para tentar de novo',480,370,20,'#cfc08a')}
 if(st=='win'){X.fillStyle='#000a';X.fillRect(0,0,W,H);txt('VITÓRIA!',480,260,60,'#6f9a5a');txt(kills+' abates • '+P.items.length+' itens • '+Math.round(tm)+'s',480,310,18);txt('ENTER para jogar de novo',480,370,20,'#cfc08a')}
 X.restore()}
