/* Utilitários de desenho: polígonos e texto */
function poly(x,y,r,n,rot,c,f){X.beginPath();for(let i=0;i<n;i++){const a=rot+i*6.283/n;X[i?'lineTo':'moveTo'](x+Math.cos(a)*r,y+Math.sin(a)*r)}X.closePath();X.lineJoin='round';X.lineWidth=3;if(c.length>7){X.strokeStyle=c;X.stroke();return}if(f){X.fillStyle=c;X.fill()}X.strokeStyle='#1c130d';X.stroke()}

function txt(s,x,y,sz=16,c='#e6dcc6',al='center'){X.font='600 '+sz+'px Georgia,serif';X.textAlign=al;X.fillStyle=c;X.fillText(s,x,y)}
