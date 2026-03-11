
function ws(path: string = "/ws") {
    const { protocol, host } = window.location

    const wsProtocol = protocol === "https:" ? "wss:" : "ws:"

    const socket = new WebSocket(`${wsProtocol}//${host}${path}`)
}

