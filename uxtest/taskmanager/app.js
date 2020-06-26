function shuffle(selector) {
    let panel = document.querySelector(selector)
    for (let i = panel.children.length; i >= 0; i--) {
        panel.appendChild(panel.children[Math.random() * i | 0])
    }
}
function task() {
    let item = items[Math.random() * items.length | 0]

    if (current >= count) {
        $("#results").text(diffs)
        $("#outro").modal()
        return
    }
    if (current == midway) {
        $(".item-horizontal-popup").addClass("as-column")
    }
    if (current > 0) {
        diffs.push(Date.now() - timer)
    }

    timer = Date.now()
    lookingFor = item.name

    shuffle("#panel")
    shuffle("#tooltip")

    $("#task-at-hand").text(`Locate ${item.display}\n${current+1} / ${count}`)
}

const items = [
    {
        "name": "a",
        "display": "Tracker"
    },
    {
        "name": "b",
        "display": "WebPositive"
    },
    {
        "name": "c",
        "display": "Settings"
    },
    {
        "name": "d",
        "display": "Gigasoft Groups"
    },
    {
        "name": "e",
        "display": "Chatcord"
    },
    {
        "name": "f",
        "display": "Cocoa"
    },
]
const count = 30
const midway = 15
let current = 0
let diffs = []

let timer
let lookingFor

let initial = function(_) {
    task()
}
$("#intro").modal()
$("#intro").on("hidden.bs.modal", initial)
$(".item-horizontal-popup-window").click(
    function(event) {
        if (event.target.classList.contains(lookingFor)) {
            current++
            task()
        }
    }
)