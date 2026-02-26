const sheetID="1yeh0HWHJKLxXzjAd0Zl9Bz1KawVrEtZLFcGePvKMcXk";
const sheetName="보고양식";

const url=`https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let forms=[];

fetch(url)
.then(r=>r.json())
.then(data=>{

forms=data.map(row=>({
title:row.title||"",
category:row.category||"기타",
content:row.template||"",
keywords:row.keywords||""
}));

renderFolders();
});



/* 폴더 */

function renderFolders(){

const box=document.getElementById("folders");
box.innerHTML="";

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

item.onclick=()=>showModal(f);

items.appendChild(item);

});

folder.appendChild(title);
folder.appendChild(items);
box.appendChild(folder);

}

}



/* 검색 */

document.getElementById("search").addEventListener("input",e=>{

const q=e.target.value.toLowerCase();
const box=document.getElementById("searchResults");

box.innerHTML="";

if(!q) return;

forms
.filter(f=>
(f.title+f.category+f.keywords)
.toLowerCase()
.includes(q)
)
.forEach(f=>{

const div=document.createElement("div");
div.className="card";

div.innerHTML=`
<div class="cardTitle">${f.title}</div>
<div class="cardCategory">${f.category}</div>
`;

div.onclick=()=>showModal(f);

box.appendChild(div);

});

});



/* 모달 */

function showModal(f){

document.getElementById("modalTitle").innerText=f.title;
document.getElementById("modalContent").innerText=f.content;

window.currentCopy=f.content;

document.getElementById("modal").style.display="flex";

}

function closeModal(){
document.getElementById("modal").style.display="none";
}



/* 복사 */

function copyText(){

navigator.clipboard.writeText(window.currentCopy);

alert("복사 완료");

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
