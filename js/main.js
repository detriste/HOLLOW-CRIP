/* Loop principal e inicialização */
function loop(t){let dt=Math.min(.05,(t-last)/1000||0);last=t;DT=dt;RS=Math.max(0,RS-dt);if(st=='play'){if(hs>0){hs-=dt;dt*=.15}update(dt)}if(st!='menu'&&!P)return;if(st=='menu'){P=P||newP();room=room}draw();requestAnimationFrame(loop)}

room={rocks:[],t:'x'};

en=[];

pk=[];

G={};

requestAnimationFrame(loop);
