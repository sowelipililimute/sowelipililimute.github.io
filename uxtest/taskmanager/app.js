function shuffle(selector) {
    let panel = document.querySelector(selector)
    for (let i = panel.children.length; i >= 0; i--) {
        panel.appendChild(panel.children[Math.random() * i | 0])
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let itemCount
function task() {
    if (current >= count) {
        $("#results").text(diffs)
        $("#outro").modal()
        return
    }
    if (current == midway) {
        $(".item-horizontal-popup").addClass("as-column")
    }
    if (current > 0) {
        diffs.push({"time": Date.now() - timer, "items": itemCount})
    }

    document.querySelectorAll(".item-horizontal-popup-window").forEach((elm) => elm.style.display = "none")
    let shuffled = items.sort(() => Math.random() - Math.random())
    itemCount = getRandomInt(2, 6)
    let taskItems = shuffled.slice(0, itemCount)
    taskItems.forEach((item) => document.querySelector(`.item-horizontal-popup-window.${item.name}`).style.display = "initial")
    let item = taskItems[Math.random() * taskItems.length | 0]

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
const count = 40
const midway = 20
let current = 0
let diffs = []

let timer
let lookingFor

let initial = function(_) {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen()
    }
    task()
}
$("#intro").modal()
$("#intro").on("hidden.bs.modal", initial)
$(".item-horizontal-popup-window, .title").click(
    function(event) {
        if (event.target.classList.contains(lookingFor)
         || event.target.parentElement.classList.contains(lookingFor)) {
            current++
            task()
        }
    }
)