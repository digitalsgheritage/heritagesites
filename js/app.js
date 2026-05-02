
let monuments=[];
const map=L.map("map").setView([1.3521,103.8198],12);
L.tileLayer("https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png",{maxZoom:19,minZoom:11}).addTo(map);
const markersLayer=L.layerGroup().addTo(map);
function esc(t){return String(t||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));}
function makePin(){return L.divIcon({className:"",html:'<div class="pin-marker"></div>',iconSize:[24,24],iconAnchor:[12,24]});}
function popupHtml(i){return `<div class="popup">${i.photo?`<img src="${esc(i.photo)}">`:""}<div><b>${esc(i.chineseName)}</b></div><div>${esc(i.englishName)}</div><div>${esc(i.address)}</div><div>${esc(i.descriptionCn)}</div>${i.link?`<div class="popup-disclosure">网上翻译于<a href="${esc(i.link)}" target="_blank">文物局网站</a></div>`:""}</div>`;}
function render(rows){markersLayer.clearLayers();const list=document.getElementById("list");list.innerHTML="";const bounds=[];rows.forEach(i=>{const m=L.marker([i.lat,i.lon],{icon:makePin()}).bindPopup(popupHtml(i)).addTo(markersLayer);bounds.push([i.lat,i.lon]);const d=document.createElement("div");d.className="item";d.innerHTML=`<b>${esc(i.chineseName)}</b><br>${esc(i.englishName)}`;d.onclick=()=>{map.setView([i.lat,i.lon],16);m.openPopup();};list.appendChild(d);});if(bounds.length)map.fitBounds(bounds,{padding:[30,30]});}
document.getElementById("search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();render(monuments.filter(i=>(`${i.chineseName} ${i.englishName} ${i.address} ${i.descriptionCn}`).toLowerCase().includes(q)));});
fetch("data/national-monuments.json").then(r=>r.json()).then(d=>{monuments=d;render(d);});
