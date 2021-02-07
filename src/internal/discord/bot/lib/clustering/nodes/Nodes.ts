import Events from 'events';
import WS from 'ws';
import Logger from '../../utilities/Logger';

export default class Nodes extends Events.EventEmitter {

    public client: any;
    public wsURL = "ws://localhost:7000";
    public wsOpened: boolean;
    public postInterval: any;

    public constructor(_data: any) {
        super();
        (async() => {

            this.client = {
                node: _data
            }
            
            this.main();
        })();

    }

    public async connect() {
        let _ws = new WS("ws://localhost:7000");

        return _ws;
    }

    public async main(): Promise<void> {
        let _ws = new WS("ws://localhost:7000");
        _ws.on("open", async () => {
            this.wsOpened = true;
            this.client.ws = _ws;
            Logger.prototype.log("Nodes Interconnection", `Successfully conencted to ${this.wsURL}.`);

            this.postNodeData();
            this.postInterval = setInterval(() => {
                this.postNodeData();
                this.broadcast({ hello: "Hola" });
            }, 15000);
        });

        _ws.on("message", (message: any) => {
            console.log(message);
            if(message && typeof message === "string" && message === "hello") return this.emit("hello");
            else {
                this.emit(message.name, JSON.parse(message.data));
            }
        });

        _ws.on("close", () => {
            Logger.prototype.warn("Nodes Interconnection", `The Nodes Interconnection service is now down`);
            if(this.postInterval) clearInterval(this.postInterval);
        });
    }

    public async postNodeData() {
        if(this.wsOpened) {
            this.client.ws.send(JSON.stringify({
                name: "discord_bot_nodes",
                data: this.client.node
            }));

            return true;
        }

        return false;
    }

    public async broadcast(content: any) {
        return this.client.ws.send(JSON.stringify({
            name: "broadcast",
            data: content
        }));
    }
}