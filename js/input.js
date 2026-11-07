/* Teclado e mouse */
addEventListener('keydown',ev=>{if(st=='settings'){settingsKey(ev);return}if(ev.code=='F1'&&(st=='menu'||st=='pause')){ev.preventDefault();openSettings();return}const e=kmap(ev);if(!e)return;K[e.code]=1;if(/Arrow|Space/.test(e.code))e.preventDefault();if(st=='inv'&&DV&&/KeyP|Escape|KeyI/.test(e.code)){DV=null;return}
 if(e.code=='Enter'){if(st=='select')start();else if(st!='play'&&st!='pause'&&st!='inv'&&st!='map')st='select'}
 if(st=='select'){if(/KeyA|ArrowLeft/.test(e.code))sel=(sel+3)%4;if(/KeyD|ArrowRight/.test(e.code))sel=(sel+1)%4}
 if(e.code=='Space'&&P)P.db=.14;if(/Arrow/.test(e.code))M.a=0;
 if(e.code=='KeyP'||e.code=='Escape'){if(st=='play')st='pause';else if(st=='pause'||st=='inv'||st=='map')st='play'}if(e.code=='KeyI'&&(st=='play'||st=='inv'))st=st=='play'?'inv':'play';if(e.code=='Tab'){e.preventDefault();if(st=='play'||st=='map')st=st=='play'?'map':'play'}
 if(e.code=='KeyR'&&P){if(st=='dead'||st=='win')start();else if(st=='play'||st=='pause'||st=='inv'||st=='map'){if(RS>0){RS=0;start()}else{RS=2.5;ban={t:2.5,s:'Aperte '+kn('restart')+' de novo para reiniciar a partida'}}}}
 if(st=='play'){if(e.code=='KeyE')placeBomb();if(e.code=='KeyC')useSummon();if(/KeyQ|KeyF|Shift/.test(e.code))ability()}});

addEventListener('keyup',ev=>{const e=kmap(ev,1);if(e)K[e.code]=0});

C.addEventListener('mousemove',e=>{const r=C.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height;M.a=1});

C.addEventListener('mousedown',e=>{const r=C.getBoundingClientRect();M.x=(e.clientX-r.left)*W/r.width;M.y=(e.clientY-r.top)*H/r.height;M.a=1;if(st=='settings'){if(e.button==0)settingsClick();return}if(st=='menu'&&e.button==0&&M.x>360&&M.x<600&&M.y>462&&M.y<504){openSettings();return}if(e.button==2){if(st=='play')placeBomb();return}if(st=='inv'){invClick();return}M.d=1;if(st=='pause'&&M.x>380&&M.x<580&&M.y>350&&M.y<392){start();return}if(st=='pause'&&M.x>380&&M.x<580&&M.y>402&&M.y<444){openSettings();return}
 if(st=='select'){const i=Math.floor((M.x-60)/220);if(i>=0&&i<4&&M.x-60-i*220<200&&M.y>120&&M.y<500){if(sel==i)start();else sel=i}}else if(st=='menu'||st=='dead'||st=='win')st='select'});

C.addEventListener('contextmenu',e=>e.preventDefault());

addEventListener('mouseup',()=>M.d=0);
