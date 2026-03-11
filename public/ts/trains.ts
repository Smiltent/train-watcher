
import type { BackEndTrains, MintifiedTrain, Train } from "../../types/train"

const trains: MintifiedTrain[] = []

export function ws(path: string = "/ws") {
    const { protocol, host } = window.location

    const wsProtocol = protocol === "https:" ? "wss:" : "ws:"

    const socket = new WebSocket(`${wsProtocol}//${host}${path}`)

    socket.onmessage = (event) => {
        const message: MintifiedTrain[] = JSON.parse(event.data)
        
        trains.length = 0
        trains.push(...message)

        modifyList()
    }
}

function modifyList() {
    const list = document.getElementById("trainList")
    if (!list) return // mmmm... most likely will exist

    list.innerHTML = ""

    for (const train of trains) {
        const li = document.createElement('li')

        li.textContent = `${train.id} ${train.name}`
        list.appendChild(li)
    }
}

;(window as any).ws = ws