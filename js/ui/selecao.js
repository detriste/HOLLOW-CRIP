/* Tela de escolha do herói */
function drawSel(){const t=performance.now()/1000;txt('ESCOLHA SEU HERÓI',480,70,30,'#d8cbb0');
 CH.forEach((h,i)=>{const x=60+i*220,y=120,on=i==sel;X.fillStyle=on?'#241e17':'#17130f';X.strokeStyle=on?h.c:'#3d3428';X.lineWidth=on?3:1.5;X.beginPath();X.roundRect(x,y,200,380,12);X.fill();X.stroke();
  body(h,x+100,y+72+Math.sin(t*2+i)*(on?3:1),on?34:28,Math.sin(t*(on?1.5:.6)+i)*.8,on?.7:0,t);txt(h.n,x+100,y+140,20,h.c);X.fillStyle='#0d0b09';X.beginPath();X.arc(x+100,y+273,17,0,6.283);X.fill();X.strokeStyle=h.c;X.lineWidth=1.5;X.stroke();icon('q',h.k,x+100,y+273,26);
  [['VIDA',h.hp/8],['DANO',h.dmg/4.6],['CAD.',h.rate/3.2],['VEL.',h.spd/310]].forEach(([l,v],j)=>{txt(l,x+16,y+185+j*22,11,'#9a8f7c','left');X.fillStyle='#ffffff18';X.fillRect(x+80,y+177+j*22,104,6);X.fillStyle=h.c;X.fillRect(x+80,y+177+j*22,104*Math.min(1,v),6)});
  h.d.forEach((l,j)=>txt(l.replace(/^Q ·/,kn('ability')+' ·'),x+100,y+300+j*20,12,j?'#a89d88':h.c))});
 txt('A/D ou ←/→ escolher  •  ENTER ou clique para confirmar',480,545,14,'#9a8f7c')}
