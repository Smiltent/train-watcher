
import WebsocketClient from "./src/ClientWebsocket"
import Express from "./src/Express"

import dotenv from "dotenv"
dotenv.config()

export const Server = new Express(process.env.PORT)
export const Client = new WebsocketClient()