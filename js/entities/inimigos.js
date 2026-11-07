/* Tabelas de inimigos/chefes, versão elite e criação de inimigos */
const SH={brute:[6,.2],wraith:[3,3],mage:[5,.8],sniper:[3,0],healer:[6,.3],sapper:[8,-.6],bat:[3,5]},BN=[['Colosso Prisma','#a65a3a'],['Hidra Sombria','#6a9a5a'],['Rei Carmesim','#a8332f'],['Arauto do Vazio','#7a6a9a'],['Olho Eterno','#d4a93a'],['Ladrão Fantasma','#e8ecf4']],BP=[[0,1,2,3,4,7,9],[3,4,0,3,8,10],[2,1,0,2,6,7,9],[5,3,1,5,4,8,10],[6,6,0,3,5,9,10]];

function elite(m){m.el=1;m.hp=m.mhp=m.hp*2.8;m.r*=1.35;m.sp*=1.15}

function mk(t,x,y){const f=1+.45*(fl-1),B={drone:[6,12,95,'#b8493d'],turret:[10,14,55,'#c98b3a'],spin:[16,16,40,'#8c6f9e'],charger:[12,14,70,'#d8bd4a'],blob:[18,18,50,'#6f9a5a'],mini:[5,10,115,'#6f9a5a'],mage:[9,13,45,'#b58ac4'],sniper:[8,13,50,'#8fbcc0'],healer:[14,15,50,'#8fb86f'],sapper:[10,14,80,'#d08a3c'],bat:[4,10,170,'#a4473a'],brute:[34,20,42,'#8a6a4a'],wraith:[12,12,95,'#a8a0c0'],boss:[260,38,60,'#a65a3a']}[t];
 const hp=B[0]*(t=='boss'?1.25+.75*(fl-1):f);return{t,x,y,hp,mhp:hp,r:B[1],sp:B[2]*(1+.07*(fl-1)),c:B[3],cd:rnd(.6,1.5),a:0,s:0,vx:0,vy:0,fl:0,w:t=='mini'?.15:.8}}
