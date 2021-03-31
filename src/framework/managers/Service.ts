import fs from 'fs';
import Logger from '../utilities/Logger';
import { MyClient } from '../Client';

export default class ServicesManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async Load() {
        await fs.readdirSync("./bundle/src/services/").map(async (dir) => {
            let Service = (new (await import(`../../services/${dir}`)).default());
            Logger.load("Handler Services", `Loaded ${Service.help.name.toUpperCase()}`);

            this.client.services.set(Service.help.name, Service);
        });

        return {
            success: true,
            failed: false,
            error: false,
            type: "client.services",
            services: this.client.services.size,
        }
    }
}