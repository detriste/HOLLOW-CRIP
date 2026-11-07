/* HUD durante o jogo e mapa */
function pp(k,v){const o=HU[k]||(HU[k]={v,t:0});if(o.v!=v){o.v=v;o.t=.35}o.t-=DT;return 1+Math.max(0,o.t)*1.2}

function heart(x,y,v,s,col){X.save();X.translate(x,y);X.scale(s,s);X.lineWidth=2.5;X.strokeStyle='#1c130d';X.lineJoin='round';const p=()=>{X.beginPath();X.moveTo(0,10);X.bezierCurveTo(-16,-2,-10,-14,0,-6);X.bezierCurveTo(10,-14,16,-2,0,10);X.closePath()};
 p();X.fillStyle='#3b2a25';X.fill();if(v>0){X.save();p();X.clip();X.fillStyle=col||'#b5342f';X.fillRect(-20,-20,v>1?40:20,40);X.restore()}p();X.stroke();X.restore()}

function drawHUD(){base();const h=P.ch,c=h.c,lo=P.hp<=2;C.style.cursor=st=='play'&&M.a?'none':'default';
 const lg=X.createRadialGradient(P.x,P.y,90,P.x,P.y,450);lg.addColorStop(0,'rgba(8,6,4,0)');lg.addColorStop(1,'rgba(8,6,4,.7)');X.fillStyle=lg;X.fillRect(0,0,W,H);
 if(P.inv>.8){X.fillStyle='rgba(150,20,10,'+(P.inv-.8)*.9+')';X.fillRect(0,0,W,H)}
 if(P.poi>0){X.fillStyle='rgba(90,170,40,.10)';X.fillRect(0,0,W,H);txt('ENVENENADO '+P.poi.toFixed(1)+'s',62,72,11,'#8fd04a','left')}
 if(P.cur>0){X.fillStyle='rgba(120,50,170,.12)';X.fillRect(0,0,W,H);txt('AMALDIÇOADO '+P.cur.toFixed(1)+'s — sem dash, tiros lentos',62,86,11,'#c08aff','left')}
 X.fillStyle='#1a1612';X.strokeStyle='#4a4032';X.lineWidth=2;X.beginPath();X.roundRect(8,6,46,46,8);X.fill();X.stroke();body(h,31,28,11,Math.atan2(P.fy,P.fx),0,tm);
 const hb=pp('hp',P.hp);for(let i=0;i<P.max/2;i++)heart(76+i*28,26,P.hp-i*2,hb*(lo?1+.14*Math.max(0,Math.sin(tm*9)):1+.03*Math.sin(tm*2+i)));
 for(let i=0;i<Math.ceil(P.sl.length/2);i++)heart(76+(P.max/2+i)*28,26,P.sl.length-i*2,hb,P.sl[i*2]=='n'?'#55505e':'#7fa6c4');X.fillStyle='#ffffff18';X.fillRect(62,44,90,5);X.fillStyle=P.dcd>0?'#6b6354':c;X.fillRect(62,44,90*(1-Math.max(0,P.dcd)/P.s.dcd),5);txt('dash',158,50,10,'#9a8f7c','left');
 const am=h.cd*P.s.acd,ar=P.ac>0?1-P.ac/am:1,rd=ar>=1;X.lineWidth=4;X.strokeStyle='#ffffff22';X.beginPath();X.arc(36,570,18,0,6.283);X.stroke();X.strokeStyle=rd?c:'#6b6354';X.beginPath();X.arc(36,570,18+(rd?Math.sin(tm*5)*1.5:0),-1.57,-1.57+6.283*ar);X.stroke();X.globalAlpha=rd?1:.4;icon('q',h.k,36,570,23);X.globalAlpha=1;txt('Q',60,575,11,rd?c:'#6b6354','left');
 const cn=(k,v,ic,x,col)=>{const z=pp(k,v);X.save();X.translate(x,575);X.scale(z,z);icon('p',ic,8,-5,22);txt('×'+v,24,0,15,col,'left');X.restore()};cn('c',P.coins,0,70,'#d4a93a');cn('b',P.s.ibomb?'∞':P.bombs,1,136,'#c98b3a');cn('k',P.keys,2,202,'#e8dcc8');
 const ps=pp('it',P.items.length);P.items.slice(-8).forEach((id,i,a)=>{const l=i==a.length-1,z=l?ps:1;X.save();X.translate(281+i*28,569);X.scale(z,z);X.fillStyle='#1a1612';X.strokeStyle=l&&ps>1?'#d4a93a':'#4a4032';X.lineWidth=1.5;X.beginPath();X.roundRect(-11,-11,22,22,5);X.fill();X.stroke();icon('i',id,0,0,19);X.restore()});
 txt(kn('inv')+' inventário',500,573,11,'#9a8f7c','left');txt(kn('map')+' mapa · '+kn('restart')+' reiniciar · '+kn('pause')+' pausa',500,590,10,'#9a8f7c','left');if(P.acc>=0){const z=1+Math.sin(tm*3)*.04;X.save();X.translate(627,569);X.scale(z,z);X.fillStyle='#1a1612';X.strokeStyle='#8fb0a0';X.lineWidth=1.5;X.beginPath();X.roundRect(-11,-11,22,22,5);X.fill();X.stroke();icon('x',P.acc,0,0,19);X.restore();txt(ACC[P.acc][0],644,573,10,'#9a8f7c','left')}
 txt('ANDAR '+fl+' · '+FN[fl-1],RT,567,11,'#9a8f7c','right');txt(kills+' abates',RT,583,11,'#9a8f7c','right');if(h.k==0)txt('escudo '+(P.so|0)+'/5',196,50,10,'#c8b48a','left');if(h.k==1)txt('almas '+(P.sk|0)+'/10',196,50,10,'#7fa6c4','left');if(P.sm>0){icon('p',3,872,84,28);txt('C ×'+P.sm,950,90,13,'#c9b6e8','right')}
 if(cb>1){const pu=1+Math.max(0,ct-2.8)*1.5;X.save();X.translate(480,32);X.scale(pu,pu);txt('COMBO ×'+cb,0,0,18+Math.min(cb,10),'#b04a32');X.restore();X.fillStyle='#b04a32';X.fillRect(420,40,120*ct/3,3)}
 if(M.a&&st=='play'){X.strokeStyle=c;X.lineWidth=2;X.beginPath();X.arc(M.x,M.y,9,0,6.283);X.moveTo(M.x-16,M.y);X.lineTo(M.x-5,M.y);X.moveTo(M.x+5,M.y);X.lineTo(M.x+16,M.y);X.moveTo(M.x,M.y-16);X.lineTo(M.x,M.y-5);X.moveTo(M.x,M.y+5);X.lineTo(M.x,M.y+16);X.stroke()}}

function drawMap(){base();X.fillStyle='#000d';X.fillRect(0,0,W,H);txt('Mapa — '+FN[fl-1],480,64,24,'#d8cbb0');
 for(const r of Object.values(G)){const vs=r.vis,adj=doors(r).some(d=>d.r.vis);if((!vs&&!adj)||(r.sec&&!r.rev))continue;const x=480+(r.x-3)*76-30,y=310+(r.y-3)*54-20;
  for(const d of doors(r)){if(d.a>0){X.fillStyle='#4a4032';X.fillRect(x+60,y+16,16,8)}if(d.b>0){X.fillStyle='#4a4032';X.fillRect(x+26,y+40,8,14)}}
  X.fillStyle=!vs?'#ffffff22':rc(r);X.strokeStyle=r==room?'#fff':'#1c130d';X.lineWidth=r==room?4:2;X.fillRect(x,y,60,40);X.strokeRect(x,y,60,40);
  const ic=vs?{boss:'☠',shop:'$',treasure:'★',devil:'D',angel:'A',secret:'?'}[r.t]||(r.t=='n'&&!r.cleared?'!':''):'';if(ic)txt(ic,x+30,y+27,18,'#1c130d')}
 txt('☠ chefe   $ loja   ★ tesouro   D demônio   A anjo   ? secreta   ! sala com inimigos',480,560,12,'#9a8f7c');txt('Tab ou ESC para voltar',480,582,12,'#9a8f7c')}
