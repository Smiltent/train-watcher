
import WebSocket from 'ws'

export default class WebsocketClient {
    private socket!: WebSocket
    
    constructor() {
        this.start()
        this.socketMessages()
    }

    private start() {
        this.socket = new WebSocket("wss://trainmap.pv.lv/ws")         // wss://trainmap.vivi.lv/ws
    }

    private socketMessages() {
        this.socket.onmessage = (event) => {
            const raw = typeof event.data === "string" ? event.data : event.data.toString()
            const data = JSON.parse(raw)
            
            if (data.type !== "back-end") return

            console.log(data)
        }

        this.socket.onclose = () => {
            this.start()
        }

        this.socket.onerror = () => {
            this.start()
        }
    }
}