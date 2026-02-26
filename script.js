let templates = []

fetch("templates.json")
.then(res => res.json())
.then(data => {
templates = data
renderAll()
})

const search = document.getElementById("search")

search.addEventListener("input", () => {

const q = search.value.toLowerCase()

const filtered = templates.filter(t =>
t.title.toLowerCase().includes(q) ||
t.keywords.join(" ").includes(q)
)

render(filtered)

})

function render(list){

const box = document.getElementById("results")

box.innerHTML = list.map(t => `
<div class="card" onclick="copyText(\`${t.template}\`)">
<b>${t.title}</b>
</div>
`).join("")

}

function renderAll(){

const box = document.getElementById("allTemplates")

box.innerHTML = templates.map(t => `
<div class="card" onclick="copyText(\`${t.template}\`)">
${t.title}
</div>
`).join("")

}

function copyText(text){

navigator.clipboard.writeText(text)

alert("양식 복사 완료")

}

function makeAI(){

const input = document.getElementById("aiInput").value

const result =
"업무 보고 초안:\n\n" + input

document.getElementById("aiResult").innerText = result

}
