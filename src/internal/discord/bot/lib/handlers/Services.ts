import fs from 'fs';
import Logger from '../../lib/utilities/Logger';

export default class ServiceHandler {
    public constructor(client) {
        // handler based on the bundle
        fs.readdirSync("./bundle/internal/discord/bot/services").map(async (service: any) => {
            let _Service = require(`../../services/${service}/${service[0].toUpperCase()+service.slice(1)}`);

            if(!new _Service.default) return;
            let Service = new _Service.default(client);
            if(!Service || (Service && client.services.get(Service.data.name))) return;

            await (() => {
                new Promise(async (resolve, eject) => {
                    await fs.readdirSync(`./bundle/internal/discord/bot/services/${service}/events`).map((_serviceEvent: any) => {
                        Service.data.events = Service.data.events.push(_serviceEvent);
                    });

                    return resolve(true);
                });
            });

            client.services.set(`${Service.data.name}`, Service);
            Logger.prototype.load("Service Handler", `Loaded ${Service.data.name}`);
        });
    }
}