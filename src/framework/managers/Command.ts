import fs from 'fs';
import Logger from '../utilities/Logger';
import { MyClient } from '../Client';

export default class CommandsManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async Load() {
        await fs.readdirSync("./bundle/src/modules/").map(async (dir) => {
            await fs.readdirSync(`./bundle/src/modules/${dir}/commands/`).map(async (thisCommand) => {
                let command = new (await import(`../../modules/${dir}/commands/${thisCommand}`)).default(this.client);
                Logger.load("Handler Commands", `Loaded ${command.help.name.toUpperCase()}`);

                if(command.help.linked_service !== null) {

                    let _service = this.client.services.get(command.help.linked_service);
                    if(!_service) return;

                    _service.help.commands.push(command);

                    this.client.services.set(_service.help.name, _service)
                }

                this.client.commands.set(command.help.name, command);
            });
        });

        return {
            success: true,
            failed: false,
            error: false,
            type: "client.commands",
            commands: this.client.commands.size,
        }
    }
}