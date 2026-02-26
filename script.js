const sheetID = "1yeh0HWHJKLxXzjAd0Zl9Bz1KawVrEtZLFcGePvKMcXk";
const sheetName = "보고양식";

const url =
`https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let forms = [];
let currentFiltered = [];

fetch(url)
.then(r=>r.json())
.then(data=>{

forms = data.map(row=>({
title: row.title || "",
category: row.category || "",
keywords: row.keywords || "",
content: row.template || ""
}));

makeCategoryTabs();
renderAll();

});

function makeCategoryTabs(){

const box = document.getElementById("categoryTabs");
const categories = [...new Set(forms.map(f=>f.category))];

box.innerHTML = `<button onclick="filterCategory('')">전체</button>`;

categories.forEach(c=>{
if(!c) return;
box.innerHTML +=
`<button onclick="filterCategory('${c}')">${c}</button>`;
});

}

function filterCategory(cat){

if(!cat){
renderAll();
return;
}

const filtered = forms.filter(f=>f.category===cat);
renderList(filtered);

}

function renderAll(){
renderList(forms);
}

function renderList(list){

currentFiltered = list;

const box = document.getElementById("allForms");
box.innerHTML="";

list.forEach(f=>{
box.appendChild(makeCard(f));
});

}

function makeCard(f){

const div = document.createElement("div");
div.className="card";

const fav = isFavorite(f.title) ? "⭐" : "☆";

div.innerHTML = `
<div class="cardTitle">${fav} ${f.title}</div>
<div class="cardCategory">${f.category}</div>
`;

div.onclick=()=>{
showPreview(f);
};

div.ondblclick=()=>{
toggleFavorite(f.title);
};

return div;

}

function showPreview(f){

const modal = document.getElementById("modal");

document.getElementById("modalTitle").innerText = f.title;
document.getElementById("modalContent").innerText = f.content;

window.currentCopy = f.content;

modal.style.display = "flex";

}

function closeModal(){
document.getElementById("modal").style.display="none";
}

function copyText(){

const text = window.currentCopy;

navigator.clipboard.writeText(text);

closeModal();

alert("복사 완료");

}

function highlight(text, keyword){

if(!keyword) return text;

const reg = new RegExp(`(${keyword})`, "gi");
return text.replace(reg,"<mark>$1</mark>");

}

document.getElementById("search").addEventListener("input",e=>{

const q = e.target.value.toLowerCase();

const filtered = forms.filter(f=>
(f.title+f.category+f.keywords+f.content)
.toLowerCase()
.includes(q)
);

currentFiltered = filtered;

const box = document.getElementById("allForms");
box.innerHTML="";

filtered.forEach(f=>{

const div = makeCard(f);

div.querySelector(".cardTitle").innerHTML =
highlight(div.querySelector(".cardTitle").innerText,q);

box.appendChild(div);

});

});

document.getElementById("search").addEventListener("keydown",e=>{

if(e.key==="Enter" && currentFiltered.length>0){
window.currentCopy = currentFiltered[0].content;
navigator.clipboard.writeText(currentFiltered[0].content);
alert("첫번째 결과 복사 완료");
}

});

function toggleFavorite(title){

let favs = JSON.parse(localStorage.getItem("favorites")||"[]");

if(favs.includes(title)){
favs = favs.filter(t=>t!==title);
}else{
favs.push(title);
}

localStorage.setItem("favorites",JSON.stringify(favs));

renderAll();

}

function isFavorite(title){

let favs = JSON.parse(localStorage.getItem("favorites")||"[]");
return favs.includes(title);

}
