/* Andares, biomas, layouts de sala, tabela de drops e acessórios */
const FN=['Cavernas de Musgo','Catacumbas de Pedra','O Abismo de Brasa'],
BI=[{f:['#3b3a2a','#35341f','#424130'],w:'#4a3d2b',d:'#2a2a1a'},{f:['#3b3835','#34312e','#423e3a'],w:'#4d463d',d:'#2a2724'},{f:['#3d2d29','#342522','#46332e'],w:'#52362d',d:'#2a1c18'}],
safe=(x,y)=>(x>=5&&x<=8&&y>=2&&y<=5)||(x>=6&&x<=7&&(y<2||y>5))||(y>=3&&y<=4&&(x<2||x>11)),
tk=(x,y)=>x+','+y,terrAt=(x,y)=>room.tm?room.tm[tk(Math.floor((x-L)/TS),Math.floor((y-U)/TS))]||'':'',
TB=[['m','w','m','w'],['w','l','i','m','w'],['l','l','i','w','l']],
LY=['.............. ..#........#.. ..##......##.. .............. .............. ..##......##.. ..#........#.. ..............','.............. .####....####. .............. .............. .............. .............. .####....####. ..............','.............. .##........##. .............. ..#........#.. ..#........#.. .............. .##........##. ..............','.............. .............. ...##....##... ..#........#.. ..#........#.. ...##....##... .............. ..............'];

const dropT=q=>q<.42?'c':q<.62?'b':q<.76?'k':q<.88?'h':q<.96?'a':q<.99?'n':'e',accessory=()=>ri(0,7),
rc=r=>({boss:'#a8332f',shop:'#d4a93a',treasure:'#c9a24a',devil:'#7a1f1f',angel:'#d8e2e8',secret:'#6a9a5a'}[r.t]||'#8a7f66'),
ACC=[['Moeda Furada','mais drops de pickups'],['Dente de Lobo','+20% de dano'],['Pena de Corvo','dash recarrega 35% mais rápido'],['Fita de Couro','ímã de pickups maior'],['Osso da Sorte','35% de chance da bomba não gastar'],['Anel de Ferro','golpes de 1 coração causam só meio'],['Garra Rubra','+10% de cura ao matar'],['Chave Mestra','chaves não gastam em portas']];
