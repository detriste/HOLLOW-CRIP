/* Inventário, detalhes de item e tela de inventário */
const HU={};

let DT=0,RS=0,DV=null;

function wrapT(s,x,y,w,lh,sz,c){X.font='600 '+sz+'px Georgia,serif';let l='';for(const t of s.split(' ')){const n=l?l+' '+t:t;if(X.measureText(n).width>w&&l){txt(l,x,y,sz,c,'left');y+=lh;l=t}else l=n}if(l){txt(l,x,y,sz,c,'left');y+=lh}return y}

function invCount(){const c={};P.items.forEach(i=>c[i]=(c[i]||0)+1);return c}

function invClick(){if(DV){DV=null;return}const ks=Object.keys(invCount());for(let i=0;i<ks.length;i++){const x=310+(i%2)*292,y=104+Math.floor(i/2)*37;if(M.x>x&&M.x<x+282&&M.y>y&&M.y<y+33){DV=['i',+ks[i]];return}}if(P.acc>=0&&M.x>80&&M.x<560&&M.y>524&&M.y<548)DV=['x',P.acc]}

function drawDet(cnt){if(!DV)return;const k=DV[0],id=DV[1],it=k=='i'?IT[id]:ACC[id],n=k=='i'?(cnt[id]||1):1;
 X.fillStyle='#000b';X.fillRect(0,0,W,H);X.fillStyle='#1f1a14';X.strokeStyle='#d4a93a';X.lineWidth=3;X.beginPath();X.roundRect(170,100,620,400,12);X.fill();X.stroke();
 X.fillStyle='#0d0b09';X.strokeStyle=k=='x'?'#8fb0a0':'#d4a93a';X.beginPath();X.arc(250,180,42,0,6.283);X.fill();X.stroke();icon(k,id,250,180,68);
 txt(it[0]+(n>1?' ×'+n:''),315,172,28,'#efe4c8','left');txt(k=='x'?'Acessório (só 1 por vez)':'Item',315,198,13,'#9a8f7c','left');
 X.fillStyle='#4a4032';X.fillRect(210,232,540,2);
 let y=wrapT('Resumo: '+it[1],210,262,540,22,15,'#d4a93a');y=wrapT((k=='i'?DET:ADT)[id],210,y+8,540,24,16,'#e6dcc6');
 if(n>1)wrapT('Você tem '+n+' cópias: o efeito foi aplicado '+n+' vezes e se acumula.',210,y+10,540,22,14,'#8fb0a0');
 txt('Clique ou ESC para fechar',480,484,12,'#9a8f7c')}

function drawInv(){base();X.fillStyle='#000c';X.fillRect(0,0,W,H);X.fillStyle='#1a1612';X.strokeStyle='#5a4a35';X.lineWidth=3;X.beginPath();X.roundRect(50,36,860,528,10);X.fill();X.stroke();
 const h=P.ch,s=P.s;txt('Inventário',480,76,26,'#d8cbb0');body(h,175,140,30,Math.sin(tm*1.2)*.8,0,tm);txt(h.n,175,200,18,h.c);h.d.forEach((l,i)=>txt(l,175,224+i*16,11,i?'#a89d88':h.c));icon('q',h.k,175,273,20);
 [['Vida',P.hp/2+' / '+P.max/2],['Dano',s.dmg.toFixed(1)],['Cadência',s.rate.toFixed(1)+'/s'],['Velocidade',s.spd|0],['Alcance',(s.range*100|0)+'%'],['Tiros por disparo',s.multi],['Perfuração',s.pierce],['Ricochetes',s.bounce],['Recarga da habilidade',(h.cd*s.acd).toFixed(1)+'s'],['Poder da habilidade','×'+s.apw.toFixed(1)]].forEach(([l,v],i)=>{txt(l,80,296+i*24,13,'#9a8f7c','left');txt(v,270,296+i*24,13,'#e6dcc6','right')});
 const cnt={};P.items.forEach(i=>cnt[i]=(cnt[i]||0)+1);const ks=Object.keys(cnt);
 if(!ks.length)txt('Nenhum item coletado ainda.',600,300,16,'#9a8f7c');
 ks.forEach((id,i)=>{const x=310+(i%2)*292,y=104+Math.floor(i/2)*37,hv=!DV&&M.x>x&&M.x<x+282&&M.y>y&&M.y<y+33;X.fillStyle=hv?'#2e261c':'#241e17';X.strokeStyle=hv?'#d4a93a':'#4a4032';X.lineWidth=1.5;X.beginPath();X.roundRect(x,y,282,33,6);X.fill();X.stroke();icon('i',id,x+17,y+17,24);txt(IT[id][0]+(cnt[id]>1?' ×'+cnt[id]:''),x+36,y+14,12,'#e6dcc6','left');txt(IT[id][1],x+36,y+27,10,'#9a8f7c','left')});
 if(P.acc>=0){icon('x',P.acc,92,536,22);txt('Acessório: '+ACC[P.acc][0]+' — '+ACC[P.acc][1],110,540,11,(!DV&&M.x>80&&M.x<560&&M.y>524&&M.y<548)?'#d4a93a':'#8fb0a0','left')}else txt('Acessório: nenhum',80,540,11,'#9a8f7c','left');txt('Clique em um item para ver os detalhes  •  I ou ESC para voltar',480,556,12,'#9a8f7c');drawDet(cnt)}
