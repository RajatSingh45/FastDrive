import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import app from './app.js'
import { intializeSocket } from './socket/socket.js'

const port = process.env.PORT || 4000;

const server=http.createServer(app)

intializeSocket(server)

server.listen(port,()=>{
    console.log("server listening to port 4000")
})
