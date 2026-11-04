(function(root){
 'use strict';
 const K=typeof module!=='undefined'?require('./kit-core.js'):root.BlockKit;
 const entries=[
  {id:'basic',title:'基本の平屋｜補強を考える',description:'リビング・寝室・キッチン・浴室・トイレ。壁の量を増やして比較する出発点。',method:'timber',shape:'rectangle'},
  {id:'standard',title:'外周の壁を補強した平屋｜強い',description:'基本の平屋の外周に耐力壁を4か所追加。弱い・強い・十分強いの違いを同じ間取りで比較。',method:'timber',shape:'rectangle'},
  {id:'balanced',title:'面材で支える平屋｜2×4',description:'基本の平屋と同じ間取り。耐力壁を増やし、工法・仕上げの違いを比較。',method:'platform',shape:'rectangle'},
  {id:'compact',title:'コンパクトな切妻の家',description:'広さを抑えた平屋。廊下から各室へ入り、木の床とタイルを使い分ける。',method:'timber',shape:'compact'},
  {id:'steel-open',title:'広いLDKと片流れ屋根の家',description:'鉄骨造。リビング・ダイニング・キッチンをつなげた大きな空間。',method:'steel',shape:'open'},
  {id:'courtyard',title:'庭を囲むL字の家',description:'RC造。L字の平屋に生活空間と水回りを配置。平屋根とタイル仕上げ。',method:'rc',shape:'L'},
  {id:'advanced',title:'二階建て｜補強を考える',description:'階段・吹き抜け・柱で支えるバルコニー。上下階の壁配置を比較する出発点。',method:'timber',shape:'two-storey'},
  {id:'family',title:'書斎とバルコニーの二階建て',description:'上下の柱・耐力壁をそろえた家。階段で寝室・書斎・バルコニーへ。',method:'timber',shape:'two-storey-reinforced'}
 ];
 function add(model,kind,c,r,axis=null,level=0,rotation=0){
  const result=K.place(model,kind,{c,r,axis,level},rotation);
  if(!result.ok)throw Error('見本の配置エラー：'+kind+' '+level+':'+c+','+r+' '+result.error);
 }
 function run(m,axis,fixed,start,end,openings={}){
  for(let i=start;i<end;i++){const [c,r]=axis==='x'?[i,fixed]:[fixed,i];add(m,'frame',c,r,axis);add(m,openings[i]||'panel',c,r,axis);}
 }
 function floor(m,inside,width,depth){for(let c=0;c<width;c++)for(let r=0;r<depth;r++)if(inside(c,r))add(m,'floor',c,r);}
 function outline(m,width,depth,entry){
  const edges=new Map();
  for(const p of m.parts.filter(p=>p.kind==='floor'))for(const [dc,dr] of [[-1,0],[1,0],[0,-1],[0,1]]){
   if(K.floorAt(m,0,p.c+dc,p.r+dr))continue;
   const q={level:0,c:p.c+Math.max(0,dc),r:p.r+Math.max(0,dr),axis:dc?'z':'x'};edges.set(K.key({...q,kind:'wall'}),q);
  }
  for(const q of edges.values()){
   const isEntry=q.axis==='z'&&q.c===0&&q.r===entry;
   const window=!isEntry&&(q.axis==='x'?[2,Math.min(width-2,8)].includes(q.c):[1,Math.min(depth-2,7)].includes(q.r));
   add(m,'frame',q.c,q.r,q.axis);add(m,isEntry?'door':window?'window':'panel',q.c,q.r,q.axis);
  }
 }
 function roof(m){for(const p of [...m.parts])if(p.kind==='floor'&&!K.floorAt(m,p.level+1,p.c,p.r))add(m,'roof',p.c,p.r,null,p.level);}
 function furnish(m,items){for(const [kind,c,r,rotation=0] of items)add(m,kind,c,r,null,0,rotation);}
 function compact(){
  const m=K.empty();floor(m,()=>true,10,9);outline(m,10,9,5);
  run(m,'x',5,0,10,{3:'door',8:'door'});run(m,'x',6,0,10,{2:'door',6:'door',8:'door'});
  run(m,'z',6,0,5);run(m,'z',5,6,9);run(m,'z',8,6,9);
  furnish(m,[['sofa',1,1,90],['tv',4,1,90],['table',3,3],['bed',7,0],['shelf',9,1,90],['kitchen',0,8,180],['fridge',3,8,180],['microwave',4,8,180],['bath',5,7],['washer',7,8],['toilet',8,7,180]]);
  roof(m);return m;
 }
 function openPlan(){
  const m=K.empty();floor(m,()=>true,14,10);outline(m,14,10,5);
  run(m,'x',5,8,14,{10:'door'});run(m,'x',6,8,14,{9:'door',12:'door'});
  run(m,'z',8,0,5);run(m,'z',8,6,10);run(m,'z',11,6,10);
  furnish(m,[['leatherSofa',1,1,90],['tv',5,1,90],['table',3,5],['bed',10,0],['shelf',13,1,90],['kitchen',1,9,180],['fridge',5,9,180],['microwave',6,9,180],['bath',8,8],['washer',10,9],['toilet',12,8,180]]);
  roof(m);return m;
 }
 function courtyard(){
  const m=K.empty();floor(m,(c,r)=>r<6||c<7,13,11);outline(m,13,11,5);
  run(m,'x',5,0,13,{3:'door',9:'door'});run(m,'x',6,0,7,{3:'door'});
  run(m,'z',7,0,5);run(m,'z',3,6,11,{8:'door'});run(m,'z',4,6,11,{7:'door',10:'door'});run(m,'x',9,4,7);
  furnish(m,[['sofa',1,1,90],['tv',5,1,90],['table',3,3],['bed',9,0],['shelf',12,1,90],['kitchen',0,10,180],['fridge',0,8,180],['microwave',1,8,180],['bath',5,7],['washer',6,8],['toilet',5,9,180]]);
  roof(m);return m;
 }
 function reinforce(m){
  for(const p of [...m.parts].filter(p=>p.kind==='wall')){
   if(p.level>0){
    const below=m.parts.find(q=>K.specs[q.kind].category==='壁'&&q.level===p.level-1&&q.c===p.c&&q.r===p.r&&q.axis===p.axis);
    if(!below||['window','door'].includes(below.kind))continue;
    add(m,'panel',p.c,p.r,p.axis,p.level-1);
   }
   add(m,'panel',p.c,p.r,p.axis,p.level);
  }
  return m;
 }
 function family(){
  const m=K.furnishedSample(true);
  const tv=m.parts.find(p=>p.kind==='tv');K.remove(m,tv.id);add(m,'tv',3,1,null,0,90);
  for(const c of [4,9])run(m,'z',c,0,5,{3:'door'});
  furnish(m,[['desk',5,1],['modernChair',5,2]]);
  return reinforce(m);
 }
 function finishes(m,id){
  const rc=id==='courtyard',steel=id==='steel-open';
  m.finishes={wall:rc?'plaster':steel?'brick':'wood',wallColor:rc?'white':steel?'gray':'sand',roof:rc?'metal':steel?'slate':'metal',roofColor:steel?'charcoal':'brown',roofShape:rc?'flat':steel?'shed':'gable'};
  for(const p of m.parts.filter(p=>p.kind==='floor')){p.finish=p.r>=6?'tile':id==='balanced'?'walnut':'oak';p.wallpaper=p.r>=6?'ivory':id==='balanced'?'sage':'ivory';}
 }
 function devices(m){
  const placeFree=(kind,level,preferred)=>{
   const cells=preferred||m.parts.filter(p=>p.kind==='floor'&&p.level===level);
   for(const cell of cells){const result=K.place(m,kind,{...cell,level});if(result.ok)return;}
   throw Error('見本の機器を配置できません：'+kind);
  };
  for(let level=0;level<=Math.max(...m.parts.filter(p=>p.kind==='floor').map(p=>p.level));level++){
   const cells=m.parts.filter(p=>p.kind==='floor'&&p.level===level);
   placeFree('light',level,[cells[Math.floor(cells.length/3)]]);
   placeFree('ac',level);
  }
  const roofs=m.parts.filter(p=>p.kind==='roof');for(const p of roofs.slice(0,2))placeFree('solar',p.level,[p]);
  const entry=m.parts.find(p=>p.kind==='door'&&p.level===0&&K.edgeCells(p).filter(([c,r])=>K.floorAt(m,0,c,r)).length===1);
  if(entry){const cells=K.edgeCells(entry).filter(([c,r])=>K.floorAt(m,0,c,r)).map(([c,r])=>({c,r}));placeFree('lock',0,cells);}
 }
 function settleFurniture(m){
  // Keep the same coordinates across methods, clear even the 300-mm RC columns.
  const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.near<b.far&&a.far>b.near;
  const posts=m.parts.filter(p=>p.kind==='post').map(p=>({level:p.level,left:p.c*K.UNIT-150,right:p.c*K.UNIT+150,near:p.r*K.UNIT-150,far:p.r*K.UNIT+150}));
  const offsets=[0,...Array.from({length:10},(_,i)=>[-20*(i+1),20*(i+1)]).flat()];
  for(const p of m.parts.filter(p=>K.isFurniture(p.kind)&&!K.specs[p.kind].mount)){
   let placed=false;
   const candidates=offsets.flatMap(offsetX=>offsets.map(offsetZ=>({offsetX,offsetZ}))).sort((a,b)=>a.offsetX**2+a.offsetZ**2-b.offsetX**2-b.offsetZ**2);
   for(const delta of candidates){
    const candidate={...p,...delta},b=K.furnitureBounds(candidate);
    if(posts.some(post=>post.level===p.level&&intersects(b,post))||K.allowed(m,p.kind,candidate,p.rotation,p.id))continue;
    delete p.offsetX;delete p.offsetZ;if(delta.offsetX)p.offsetX=delta.offsetX;if(delta.offsetZ)p.offsetZ=delta.offsetZ;placed=true;break;
   }
   if(!placed)throw Error('柱と重ならない位置がありません：'+p.kind+' '+p.level+':'+p.c+','+p.r);
  }
 }
 function create(id){
  const entry=entries.find(p=>p.id===id);if(!entry)throw Error('見本が見つかりません');
  let m=id==='compact'?compact():id==='steel-open'?openPlan():id==='courtyard'?courtyard():id==='family'?family():K.furnishedSample(id==='advanced');
  if(id==='standard')for(const c of [0,13])for(const r of [3,6])add(m,'panel',c,r,'z');
  if(id==='balanced')reinforce(m);
  m.name=entry.title;m.method=entry.method;
  if(!['basic','standard','advanced'].includes(id))finishes(m,id);
  if(id==='courtyard')m.structural={rcFc:'30'};
  settleFurniture(m);devices(m);settleFurniture(m);return K.validate(m);
 }
 const api={entries,create};if(typeof module!=='undefined')module.exports=api;else root.HouseSamples=api;
})(globalThis);
