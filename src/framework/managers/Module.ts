import fs from 'fs';
import Logger from '../utilities/Logger';
import { MyClient } from '../Client';

export default class ModulesManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async Load() {
        await fs.readdirSync("./bundle/src/modules/").map(async (dir) => {
            let Module = (new (await import(`../../modules/${dir}/${(dir.charAt(0).toUpperCase() + dir.slice(1))}`)).default(this.client));
            Logger.load("Handler Modules", `Loaded ${Module.help.name.toUpperCase()}`);

            this.client.modules.set(Module.help.name, Module);
        });

        return {
            success: true,
            failed: false,
            error: false,
            type: "client.modules",
            modules: this.client.modules.size,
        }
    }
}