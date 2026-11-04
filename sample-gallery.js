'use strict';
(function(){
 const S=HouseSamples;
 const methodNames={timber:'木造軸組',platform:'木造枠組壁（2×4）',steel:'鉄骨造',rc:'RC造'};
 const oldGallery=gallery;
 function thumbnail(model){
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
  const floors=model.parts.filter(p=>p.kind==='floor'&&p.level===0);
  const minC=Math.min(...floors.map(p=>p.c)),maxC=Math.max(...floors.map(p=>p.c+1)),minR=Math.min(...floors.map(p=>p.r)),maxR=Math.max(...floors.map(p=>p.r+1));
  svg.setAttribute('viewBox',[minC*20-8,minR*20-8,(maxC-minC)*20+16,(maxR-minR)*20+16].join(' '));
  svg.setAttribute('role','img');svg.setAttribute('aria-label',model.name+'の1階の間取り');
  const shape=(tag,attrs)=>{const node=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);svg.append(node);};
  for(const p of floors)shape('rect',{x:p.c*20,y:p.r*20,width:20,height:20,fill:p.finish==='tile'?'#d8dedb':p.finish==='walnut'?'#bea18a':'#eddbb8',stroke:'#f8f6ed','stroke-width':.5});
  for(const p of model.parts.filter(p=>K.isFurniture(p.kind)&&!K.specs[p.kind].mount&&p.level===0)){
   const b=K.furnitureBounds(p);shape('rect',{x:b.left/K.UNIT*20,y:b.near/K.UNIT*20,width:(b.right-b.left)/K.UNIT*20,height:(b.far-b.near)/K.UNIT*20,fill:K.specs[p.kind].color,rx:1});
  }
  for(const p of model.parts.filter(p=>HouseMethods.wallKinds.includes(p.kind)&&p.level===0)){
   if(p.kind==='door')continue;
   shape('line',{x1:p.c*20,y1:p.r*20,x2:(p.c+(p.axis==='x'?1:0))*20,y2:(p.r+(p.axis==='z'?1:0))*20,stroke:p.kind==='window'?'#73a9b8':p.kind==='wall'?'#9a9c8b':'#486a54','stroke-width':p.kind==='window'?2:3});
  }
  return svg;
 }
 gallery=function(){
  const dialog=$('sampleDialog');dialog.replaceChildren();
  const heading=document.createElement('div');heading.className='dialog-head';
  const title=document.createElement('h2');title.textContent='家の見本を選ぶ';
  const close=document.createElement('button');close.textContent='✕';close.setAttribute('aria-label','見本一覧を閉じる');close.onclick=()=>dialog.close();heading.append(title,close);dialog.append(heading);
  const note=document.createElement('p');note.className='muted';note.textContent=S.entries.length+'つの見本から選べます。自分の設計は保持され、「自分の設計に戻る」で戻れます。補強前の見本は改善を考えるための例です。';dialog.append(note);
  const grid=document.createElement('div');grid.className='sample-grid';
  for(const entry of S.entries){
   const model=S.create(entry.id),result=HouseChallenge.evaluate(model);
   const card=document.createElement('article');card.className='sample-card';card.append(thumbnail(model));
   const h=document.createElement('h3');h.textContent=entry.title;card.append(h);
   const details=document.createElement('p');details.textContent=entry.description;card.append(details);
   const meta=document.createElement('p');meta.className='sample-meta';
   const area=model.parts.filter(p=>p.kind==='floor').length*K.UNIT**2/1e6;
   const storeys=Math.max(...model.parts.filter(p=>p.kind==='floor').map(p=>p.level))+1;
   meta.textContent=methodNames[model.method]+' ／ '+storeys+'階建て ／ 延床 '+area.toFixed(1)+' m² ／ '+K.finishes.roofShapes[model.finishes?.roofShape||'flat'];card.append(meta);
   const strength=document.createElement('p');strength.className='sample-strength';strength.dataset.strength=result.strength.tone;strength.textContent='教材モデルの強さ：'+result.strength.label;card.append(strength);
   const button=document.createElement('button');button.className='primary wide';button.textContent='この見本を見る';button.dataset.sampleId=entry.id;
   if(entry.id==='basic')button.id='previewSample';if(entry.id==='advanced')button.id='advancedSample';
   button.onclick=()=>previewHouse(S.create(entry.id));card.append(button);grid.append(card);
  }
  dialog.append(grid);oldGallery();
 };
})();
