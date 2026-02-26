const sheetID = "1yeh0HWHJKLxXzjAd0Zl9Bz1KawVrEtZLFcGePvKMcXk";
const sheetName = "보고양식";

const url =
`https://opensheet.elk.sh/${sheetID}/${sheetName}`;

let forms = [];

fetch(url)
.then(r=>r.json())
.then(data=>{

forms = data.map(row=>({
title: row.title || "",
category: row.category || "",
keywords: row.keywords || "",
content: row.template || ""
}));

renderAll();

});

function renderAll(){

const box = document.getElementById("allForms");
box.innerHTML="";

forms.forEach(f=>{
box.appendChild(makeCard(f));
});

}

function makeCard(f){

const div = document.createElement("div");
div.className="card";

div.innerHTML = `
<b>${f.title}</b>
`;

div.onclick=()=>{
showPreview(f);
};

return div;

}

function showPreview(f){

const results = document.getElementById("results");

results.innerHTML = `
<div class="preview">

<b>${f.title}</b>

<pre>${f.content}</pre>

<button onclick="copyText()">복사</button>

</div>
`;

window.currentCopy = f.content;

}

function copyText(){

const text = window.currentCopy;

const ta = document.createElement("textarea");
ta.value=text;
document.body.appendChild(ta);
ta.select();
document.execCommand("copy");
ta.remove();

alert("복사됨");

}

document.getElementById("search").addEventListener("input",e=>{

const q = e.target.value.toLowerCase();

const filtered = forms.filter(f=>
(f.title+f.category+f.keywords+f.content)
.toLowerCase()
.includes(q)
);

const box = document.getElementById("results");
box.innerHTML="";

filtered.forEach(f=>{
box.appendChild(makeCard(f));
});

});
