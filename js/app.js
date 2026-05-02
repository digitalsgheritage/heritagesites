
let monuments=[];
const map=L.map("map").setView([1.3521,103.8198],12);
L.tileLayer("https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png",{maxZoom:19,minZoom:11,attribution:"Map data © Singapore Land Authority / OneMap"}).addTo(map);
const markersLayer=L.layerGroup().addTo(map);
function esc(t){return String(t||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function makePin(){return L.divIcon({className:"",html:'<div class="pin-marker"></div>',iconSize:[24,24],iconAnchor:[12,24],popupAnchor:[0,-24]});}
function popupHtml(i){
  const photo=i.photo?`<img src="${esc(i.photo)}" alt="">`:"";
  const disclosure=i.link?`<div class="popup-disclosure">网上翻译于<a href="${esc(i.link)}" target="_blank" rel="noopener noreferrer">文物局网站</a></div>`:"";
  return `<div class="popup">${photo}<div class="popup-cn">${esc(i.chineseName||"（无中文名称）")}</div><div class="popup-en">${esc(i.englishName||"")}</div><div class="popup-address">${esc(i.address||"地址资料暂缺")}</div><div class="popup-desc">${esc(i.descriptionCn||"中文简介暂缺")}</div>${disclosure}</div>`;
}
const bottomSheet=document.getElementById("bottomSheet");
const sheetToggle=document.getElementById("sheetToggle");
if(sheetToggle&&bottomSheet){sheetToggle.addEventListener("click",()=>{bottomSheet.classList.toggle("open");setTimeout(()=>map.invalidateSize(),260);});}
function collapseSheetOnMobile(){if(window.innerWidth<=900&&bottomSheet){bottomSheet.classList.remove("open");setTimeout(()=>map.invalidateSize(),260);}}
function render(rows){
  markersLayer.clearLayers();document.getElementById("stats").textContent=`${rows.length} 处国家古迹`;
  const list=document.getElementById("list");list.innerHTML="";const bounds=[];
  rows.forEach(i=>{const m=L.marker([i.lat,i.lon],{icon:makePin()}).bindPopup(popupHtml(i)).addTo(markersLayer);bounds.push([i.lat,i.lon]);const d=document.createElement("div");d.className="item";d.innerHTML=`<div class="item-cn">${esc(i.chineseName||"（无中文名称）")}</div><div class="item-en">${esc(i.englishName||"")}</div>`;d.onclick=()=>{map.setView([i.lat,i.lon],16);m.openPopup();collapseSheetOnMobile();};list.appendChild(d);});
  if(bounds.length)map.fitBounds(bounds,{padding:[30,30]});
}
document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();render(monuments.filter(i=>(`${i.chineseName} ${i.englishName} ${i.address} ${i.descriptionCn}`).toLowerCase().includes(q)));});
map.on("click",()=>{if(window.innerWidth<=900&&bottomSheet){bottomSheet.classList.remove("open");}});
fetch("data/national-monuments.json").then(r=>r.json()).then(d=>{monuments=d;render(d);});
