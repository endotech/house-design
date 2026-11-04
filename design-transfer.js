'use strict';
const smartHouseFileButton=document.createElement('button');
smartHouseFileButton.textContent='スマートハウス用JSONを保存';
smartHouseFileButton.title='別の端末でも「CADで作った家を開く」から読み込めます';
document.querySelector('.file-actions').append(smartHouseFileButton);
function houseForSmartHouse(){
 if(reference)throw Error('「この家からつくる」を押してから引き継いでください');
 return SmartHouseTransfer.prepare(model,K);
}
smartHouseFileButton.onclick=()=>{
 try{
  const house=houseForSmartHouse();
  const name=house.name.replace(/[\\/:*?"<>|]/g,'_');
  download(name+'-スマートハウス.json',JSON.stringify(house,null,2),'application/json');
  toast('スマートハウス開発の「CADで作った家を開く」で読み込めます');
 }catch(error){toast(error.message);}
};
