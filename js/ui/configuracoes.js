/* Configuração de teclas: remapeamento, tela de configurações e salvamento (localStorage) */
// l = código interno que o jogo já usa · d = teclas padrão (principal, alternativa)
const BIND_ACTIONS=[
{id:'up',l:'KeyW',n:'Mover para cima',d:['KeyW','']},
{id:'down',l:'KeyS',n:'Mover para baixo',d:['KeyS','']},
{id:'left',l:'KeyA',n:'Mover para a esquerda',d:['KeyA','']},
{id:'right',l:'KeyD',n:'Mover para a direita',d:['KeyD','']},
{id:'sUp',l:'ArrowUp',n:'Atirar para cima',d:['ArrowUp','']},
{id:'sDown',l:'ArrowDown',n:'Atirar para baixo',d:['ArrowDown','']},
{id:'sLeft',l:'ArrowLeft',n:'Atirar para a esquerda',d:['ArrowLeft','']},
{id:'sRight',l:'ArrowRight',n:'Atirar para a direita',d:['ArrowRight','']},
{id:'dash',l:'Space',n:'Dash',d:['Space','']},
{id:'ability',l:'KeyQ',n:'Habilidade especial',d:['KeyQ','ShiftLeft']},
{id:'bomb',l:'KeyE',n:'Colocar bomba',d:['KeyE','']},
{id:'summon',l:'KeyC',n:'Usar totem de invocação',d:['KeyC','']},
{id:'inv',l:'KeyI',n:'Inventário',d:['KeyI','']},
{id:'map',l:'Tab',n:'Mapa',d:['Tab','']},
{id:'restart',l:'KeyR',n:'Reiniciar partida',d:['KeyR','']},
{id:'pause',l:'KeyP',n:'Pausar',d:['KeyP','']}];
const SET_N=BIND_ACTIONS.length,SET_ROW0=114,SET_RH=24,BIND_KEY='cripta_teclas',BINDS={};
let KEYMAP=Object.create(null),setCur=0,setCol=0,setCap=null,setBack='menu',setMsg={t:0,s:''};

function keyName(c){if(!c)return '—';const m={Space:'Espaço',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',ShiftLeft:'Shift',ControlLeft:'Ctrl',Tab:'Tab',Backquote:'`',Minus:'-',Equal:'=',Comma:',',Period:'.',Slash:'/',Semicolon:';',Quote:"'",BracketLeft:'[',BracketRight:']',Backslash:'\\',CapsLock:'Caps',Backspace:'⌫',Enter:'Enter',Escape:'Esc'};
 return m[c]||c.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'Num ')}
const kn=id=>keyName(BINDS[id][0]||BINDS[id][1]);
function mvTxt(){const k=['up','left','down','right'].map(kn);return k.every(x=>x.length==1)?k.join(''):k.join(' ')}
function shTxt(){const k=['sUp','sLeft','sDown','sRight'].map(kn);return k.every(x=>/[←↑↓→]/.test(x))?'setas':k.join(' ')}

function applyBinds(){KEYMAP=Object.create(null);for(const a of BIND_ACTIONS)for(const k of BINDS[a.id])if(k)KEYMAP[k]=a.l}
function saveBinds(){try{localStorage.setItem(BIND_KEY,JSON.stringify(BINDS))}catch(e){}}
function resetBinds(){for(const a of BIND_ACTIONS)BINDS[a.id]=a.d.slice();applyBinds()}
function loadBinds(){resetBinds();try{const s=JSON.parse(localStorage.getItem(BIND_KEY)||'null');if(s){for(const a of BIND_ACTIONS)if(Array.isArray(s[a.id]))BINDS[a.id]=[0,1].map(i=>typeof s[a.id][i]=='string'?s[a.id][i]:'');applyBinds()}}catch(e){}}
loadBinds();

// Traduz a tecla física para o código interno do jogo (Enter e Esc são fixas)
function kmap(ev,up){let c=ev.code;if(c=='ShiftRight')c='ShiftLeft';if(c=='ControlRight')c='ControlLeft';
 if(!up&&(ev.altKey||ev.metaKey||(ev.ctrlKey&&!/^Control/.test(c))))return null;
 const l=c=='Enter'||c=='Escape'?c:KEYMAP[c];if(!l)return null;if(!up)ev.preventDefault();
 return{code:l,preventDefault(){}}}

function openSettings(){setBack=st;st='settings';setCur=0;setCol=0;setCap=null;for(const k in K)K[k]=0;M.d=0;C.style.cursor='default'}
function closeSettings(){setCap=null;st=setBack;for(const k in K)K[k]=0;M.d=0}
const setMsgSet=s=>{setMsg={t:performance.now()+3500,s}};
function bindKey(i,col,code){const a=BIND_ACTIONS[i];let r='';
 for(const o of BIND_ACTIONS)for(let s=0;s<2;s++)if(BINDS[o.id][s]==code&&!(o===a&&s==col)){BINDS[o.id][s]='';r=o.n}
 BINDS[a.id][col]=code;applyBinds();saveBinds();
 setMsgSet(r?'«'+keyName(code)+'» foi tirada de "'+r+'"':'Tecla definida: '+keyName(code))}
function settingsKey(ev){if(ev.altKey||ev.metaKey)return;ev.preventDefault();if(ev.repeat)return;let c=ev.code;
 if(c=='ShiftRight')c='ShiftLeft';if(c=='ControlRight')c='ControlLeft';
 if(setCap){if(c=='Escape'){setCap=null;return}
  if(c=='Enter'||/^F\d+$/.test(c)){setMsgSet('Essa tecla é reservada. Escolha outra.');return}
  bindKey(setCap.i,setCap.col,c);setCap=null;return}
 if(c=='Escape'||c=='F1'){closeSettings();return}
 if(c=='ArrowUp')setCur=(setCur+SET_N+1)%(SET_N+2);
 else if(c=='ArrowDown')setCur=(setCur+1)%(SET_N+2);
 else if(c=='ArrowLeft'||c=='ArrowRight')setCol=1-setCol;
 else if(c=='Delete'||c=='Backspace'){if(setCur<SET_N){BINDS[BIND_ACTIONS[setCur].id][setCol]='';applyBinds();saveBinds()}}
 else if(c=='Enter'||c=='Space'){if(setCur<SET_N)setCap={i:setCur,col:setCol};else if(setCur==SET_N){resetBinds();saveBinds();setMsgSet('Teclas restauradas para o padrão')}else closeSettings()}}
function settingsClick(){if(setCap){setCap=null;return}
 for(let i=0;i<SET_N;i++)for(let s=0;s<2;s++){const bx=500+s*140,ry=SET_ROW0+i*SET_RH;if(M.x>=bx&&M.x<=bx+120&&M.y>=ry-11&&M.y<=ry+11){setCur=i;setCol=s;setCap={i,col:s};return}}
 if(M.y>=536&&M.y<=576){if(M.x>=250&&M.x<=470){resetBinds();saveBinds();setCur=SET_N;setMsgSet('Teclas restauradas para o padrão')}else if(M.x>=490&&M.x<=710)closeSettings()}}

function settingsBtn(x,y,w,h,s,on){const hv=M.x>x&&M.x<x+w&&M.y>y&&M.y<y+h;X.fillStyle='#241e17';X.strokeStyle=on||hv?'#a8452f':'#5a4a35';X.lineWidth=2;X.beginPath();X.roundRect(x,y,w,h,8);X.fill();X.stroke();txt(s,x+w/2,y+h/2+5,14,'#e6dcc6')}
function drawSettings(){X.setTransform(1,0,0,1,0,0);C.style.cursor='default';X.fillStyle='#14100d';X.fillRect(0,0,W,H);
 txt('CONFIGURAÇÕES — TECLAS',480,46,28,'#d8cbb0');
 txt('Clique numa tecla (ou use ↑ ↓ ← → e ENTER) e aperte a nova  •  DEL limpa  •  ESC volta',480,70,13,'#9a8f7c');
 X.fillStyle='#1a1612';X.strokeStyle='#4a4032';X.lineWidth=2;X.beginPath();X.roundRect(160,82,640,SET_N*SET_RH+34,10);X.fill();X.stroke();
 txt('Principal',560,98,11,'#9a8f7c');txt('Alternativa',700,98,11,'#9a8f7c');
 BIND_ACTIONS.forEach((a,i)=>{const ry=SET_ROW0+i*SET_RH,none=!BINDS[a.id][0]&&!BINDS[a.id][1];
  if(i%2){X.fillStyle='#ffffff08';X.fillRect(168,ry-12,624,SET_RH)}
  if(i==4||i==8){X.fillStyle='#4a4032';X.fillRect(176,ry-12,608,1)}
  txt(a.n,190,ry+5,14,none?'#c9462f':'#e6dcc6','left');
  for(let s=0;s<2;s++){const bx=500+s*140,cap=setCap&&setCap.i==i&&setCap.col==s,cur=setCur==i&&setCol==s,v=BINDS[a.id][s];
   X.fillStyle=cap?'#3a1d16':'#241e17';X.strokeStyle=cap||cur?'#a8452f':'#5a4a35';X.lineWidth=cap||cur?2:1.5;X.beginPath();X.roundRect(bx,ry-11,120,22,6);X.fill();X.stroke();
   txt(cap?'aperte a tecla…':keyName(v),bx+60,ry+5,13,cap?'#e8a25a':v?'#efe4c8':'#6a5f50')}});
 if(performance.now()<setMsg.t)txt(setMsg.s,480,520,13,'#e8a25a');
 settingsBtn(250,536,220,40,'Restaurar padrão',setCur==SET_N);settingsBtn(490,536,220,40,'Voltar (ESC)',setCur==SET_N+1)}
