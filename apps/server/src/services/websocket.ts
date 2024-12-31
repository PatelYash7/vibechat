import { Server } from "http";
import { RawData, WebSocketServer } from "ws";

class WebSocketService {
  private _wss: WebSocketServer;
  constructor({ Server }: { Server: Server }) {
    console.log("Websocket Server Init");
    this._wss = new WebSocketServer({ server: Server });
  }
  public initListeners() {
    const wss = this._wss;
    console.log("Init Socket Listener");
    wss.on("connection", (ws) => {
      console.log(`New Socker Conntect`);
      ws.listenerCount;
      ws.on("message", async (message: RawData, isBinary) => {
        console.log("New Messge Received:" + message);
        wss.clients.forEach((clients) => {
          if (clients.readyState === ws.OPEN) {
            clients.send(message, { binary: isBinary });
          }
        });
      });
    });
  }
  get wss() {
    return this._wss;
  }
}

export default WebSocketService;
