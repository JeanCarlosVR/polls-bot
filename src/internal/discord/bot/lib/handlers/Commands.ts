import fs from 'fs';
import Logger from '../../lib/utilities/Logger';

export default class CommandHandler {
    public constructor(client) {
        // handler based on the bundle
        fs.readdirSync("./bundle/internal/discord/bot/services").map((dir: any) => {
            fs.readdirSync(`./bundle/internal/discord/bot/services/${dir}/commands`).map(async (command: any) => {
                let _Command = await (require(`../../services/${dir}/commands/${command}`));

                if(!new _Command.default) return;
                let Command = new _Command.default(client);
                if(!Command || (Command && client.commands.get(Command.data.name))) return;

                client.commands.set(Command.data.name, Command);
                Logger.prototype.load("Command Handler", `Loaded ${Command.data.name}`);
            });
        });
    }
}