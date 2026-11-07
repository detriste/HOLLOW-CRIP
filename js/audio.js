/* Efeitos sonoros (Web Audio) */
function sfx(f,d=.06,v=.04,ty='square'){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}
