import{ createServer } from 'http'
import WebSocketService from './services/websocket';

async function startServer (){  
    const httpServer = createServer();
    const PORT = process.env.PORT ? process.env.PORT :8080
    const WSServer = new WebSocketService({Server:httpServer});
    WSServer.initListeners();
    httpServer.listen(PORT,()=>console.log(`HTTP Server Running at ${PORT}`))
}
startServer();