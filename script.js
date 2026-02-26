const sheetID = "1yeh0HWHJKLxXzjAd0Zl9Bz1KawVrEtZLFcGePvKMcXk";
const sheetName = "보고양식";

const url = `https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let forms = [];

fetch(url)
.then(r=>r.json())
.then(data=>{

forms = data.map(row=>({
title: row.title || "",
category: row.category || "기타",
keywords: row.keywords || "",
content: row.template || ""
}));

makeFolders();

});


/* 폴더 생성 */

function makeFolders(){

const box = document.getElementById("folders");

const categories = [...new Set(forms.map(f=>f.category))];

box.innerHTML="";

categories.forEach(cat=>{

const folder = document.createElement("div");
folder.className="folder";

const title = document.createElement("div");
title.className="folderTitle";
title.innerText="📁 "+cat;

const items = document.createElement("div");
items.className="folderItems";

forms
.filter(f=>f.category===cat)
.forEach(f=>{

const item = document.createElement("div");
item.className="folderItem";
item.innerText=f.title;

item.onclick=()=>showPreview(f);

items.appendChild(item);

});

title.onclick=()=>{
items.style.display =
items.style.display==="block"?"none":"block";
};

folder.appendChild(title);
folder.appendChild(items);

box.appendChild(folder);

});

}


/* 검색 */

document.getElementById("search").addEventListener("input",e=>{

const q = e.target.value.toLowerCase();

const results = document.getElementById("searchResults");

if(!q){
results.innerHTML="";
return;
}

const filtered = forms.filter(f=>
(f.title+f.category+f.keywords+f.content)
.toLowerCase()
.includes(q)
);

results.innerHTML="";

filtered.forEach(f=>{

const div = document.createElement("div");
div.className="searchCard";
div.innerText=f.title;

div.onclick=()=>showPreview(f);

results.appendChild(div);

});

});


/* 미리보기 */

function showPreview(f){

const modal = document.getElementById("modal");

document.getElementById("modalTitle").innerText=f.title;
document.getElementById("modalContent").innerText=f.content;

window.currentCopy=f.content;

modal.style.display="flex";

}

function closeModal(){
document.getElementById("modal").style.display="none";
}

function copyText(){

navigator.clipboard.writeText(window.currentCopy);

closeModal();

alert("복사 완료");

}
/* 자동 포커스 */
document.getElementById("search").focus();

/* Enter → 첫 결과 열기 */
document.getElementById("search").addEventListener("keydown",e=>{
if(e.key==="Enter"){
const first=document.querySelector("#searchResults .searchCard");
if(first) first.click();
}
});

/* 최근 사용 */
function addRecent(f){

let recent=JSON.parse(localStorage.getItem("recent")||"[]");

recent=recent.filter(r=>r.title!==f.title);
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

renderRecent();

/* showPreview 안에 이 줄 추가 */
const originalShowPreview=showPreview;
showPreview=function(f){
originalShowPreview(f);
addRecent(f);
}

/* ESC 닫기 */
document.addEventListener("keydown",e=>{
if(e.key==="Escape") closeModal();
});
