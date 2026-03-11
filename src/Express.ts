
import WebSocket, { WebSocketServer } from 'ws'
import express from 'express'
import { parse } from 'url'
import http from 'http'
import path from 'path'

import rootRoutes from '../routes/root.routes.ts'

export default class Express {
    private wss: WebSocketServer
    private app: express.Express
    private server: http.Server

    private trainsList = new Map<string, Set<WebSocket>>()

    constructor(port: string | number = 3000) {
        const isDev = process.env.NODE_ENV == "dev"

        this.app = express()
        this.server = http.createServer(this.app)
        this.wss = new WebSocketServer({ noServer: true })

        this.app.set("view engine", "ejs")
        this.app.set("layout", "components/layout")
        this.app.use(
            "/public",
            express.static(path.join(__dirname, "..", "public"), {
                etag: !isDev,
                lastModified: !isDev,
                maxAge: isDev ? 0 : '60s'
            })
        )

        this.app.use("/", rootRoutes)

        this.websockets()
        this.start(port)
    }

    private websockets() {
        this.server.on('upgrade', (req, soc, head) => {
            const { pathname, query } = parse(req.url ?? "", true)

            if (pathname !== '/ws') return soc.destroy()

            var train = query.train as string
            if (!train) {
                train = "activeTrains"
            }

            this.wss.handleUpgrade(req, soc, head, (ws) => {
                this.wss.emit("connection", ws, req, train)
            })
        })

        this.wss.on('connection', (ws: WebSocket, _req: Request, train: string) => {
            this.subscribe(train, ws)

            ws.on('close', () => this.unsubscribe(ws))
        })
    }

    private subscribe(train: string, ws: WebSocket) {
        if (!this.trainsList.has(train)) {
            this.trainsList.set(train, new Set())
        }

        this.trainsList.get(train)!.add(ws)
    }

    private unsubscribe(ws: WebSocket) {
        this.trainsList.forEach(subs => subs.delete(ws))
    }

    broadcast(train: string, message: object) {
        const subs = this.trainsList.get(train)
        if (!subs) return

        const payload = JSON.stringify(message)
        subs.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(payload)
            }
        })
    }

    private start(port: string | number) {
        this.server.listen(port, () => console.log(`Starting server on http://0.0.0.0:${port}`))
    }
}