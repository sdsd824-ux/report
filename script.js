let forms=[];

fetch(API_URL)
.then(r=>r.json())
.then(data=>{
forms=data;
init();
});

function init(){

renderFolders();
renderRecent();

document.getElementById("search").addEventListener("input",search);
document.getElementById("search").focus();
}

/* 검색 */

function search(){

const q=document.getElementById("search").value.toLowerCase();
const box=document.getElementById("searchResults");

box.innerHTML="";

if(!q) return;

forms
.filter(f=>f.title.toLowerCase().includes(q))
.forEach(f=>{

const div=document.createElement("div");
div.className="result";
div.innerText=f.title;

div.onclick=()=>{
showPreview(f);
addRecent(f);
};

box.appendChild(div);

});
}

/* preview */

let currentText="";

function showPreview(f){

currentText=f.content;

document.getElementById("previewTitle").innerText=f.title;
document.getElementById("previewContent").innerText=f.content;
}

/* modal */

function openModal(){

document.getElementById("modal").style.display="flex";

document.getElementById("modalTitle").innerText=
document.getElementById("previewTitle").innerText;

document.getElementById("modalContent").innerText=currentText;
}

function closeModal(){
document.getElementById("modal").style.display="none";
}

/* copy */

function copyText(){
navigator.clipboard.writeText(currentText);
}

/* folders */

function renderFolders(){

const box=document.getElementById("folders");

const categories={};

forms.forEach(f=>{
if(!categories[f.category]) categories[f.category]=[];
categories[f.category].push(f);
});

for(let c in categories){

const folder=document.createElement("div");
folder.className="folder";

const title=document.createElement("div");
title.className="folderTitle";
title.innerText="📁 "+c;

const items=document.createElement("div");
items.className="folderItems";

title.onclick=()=>{
items.style.display=
items.style.display==="block"?"none":"block";
};

categories[c].forEach(f=>{

const item=document.createElement("div");
item.className="folderItem";
item.innerText=f.title;

item.onclick=()=>{
showPreview(f);
addRecent(f);
};

items.appendChild(item);

});

folder.appendChild(title);
folder.appendChild(items);
box.appendChild(folder);

}
}

/* 최근 */

function addRecent(f){

let recent=JSON.parse(localStorage.getItem("recent")||"[]");

recent=recent.filter(x=>x.title!==f.title);
recent.unshift(f);

if(recent.length>5) recent.pop();

localStorage.setItem("recent",JSON.stringify(recent));

renderRecent();
}

function renderRecent(){

const box=document.getElementById("recent");

if(!box) return;

let recent=JSON.parse(localStorage.getItem("recent")||"[]");

box.innerHTML="";

recent.forEach(f=>{

const div=document.createElement("div");
div.className="simpleCard";
div.innerText=f.title;

div.onclick=()=>showPreview(f);

box.appendChild(div);

});
}

/* 다크모드 */

const toggle=document.getElementById("darkToggle");

if(localStorage.getItem("dark")==="1")
document.body.classList.add("dark");

toggle.onclick=()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"dark",
document.body.classList.contains("dark")?"1":"0"
);

};

/* ESC */

document.addEventListener("keydown",e=>{
if(e.key==="Escape") closeModal();
});
