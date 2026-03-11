
import type { BackEndTrains, Train } from '../types/train'

import { Server } from '..'
import WebSocket from 'ws'

export default class WebsocketClient {
    private retryDelay: number = 2000
    private socket!: WebSocket
    
    constructor() {
        this.start()
    }

    private start() {
        this.socket = new WebSocket("wss://trainmap.pv.lv/ws")         // wss://trainmap.vivi.lv/ws

        this.socket.onmessage = (event) => {
            const raw = typeof event.data === "string" ? event.data : event.data.toString()
            const data: BackEndTrains = JSON.parse(raw)
            
            if (data.type !== "back-end") return

            this.broadcastTrains(data)
            data.data.forEach(train => {
                this.broadcastTrain(train.returnValue.train, train) 
            })

            this.retryDelay = 2000
        }

        this.socket.onclose = () => {
            console.error(`Socket has closed. Retrying in ${this.retryDelay}ms...`)
            setTimeout(() => {
                this.start()
            }, this.retryDelay)

            this.retryDelay = Math.min(this.retryDelay * 2, 60000)
        }

        this.socket.onerror = (err) => {
            console.error(`Socket error: ${err.message}`)
            this.socket.close()
        }
    }
    
    private broadcastTrains(data: BackEndTrains) {
        const trains = data.data.map(train => ({
            id: train.returnValue.train,
            name: train.name,
            nextStop: train.returnValue.currentStop,
        }))

        Server.broadcast("activeTrains", trains)
    }

    private broadcastTrain(train: string, data: Train) {
        Server.broadcast(train, data)
    }
}