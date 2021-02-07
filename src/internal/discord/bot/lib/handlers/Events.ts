import fs from 'fs';
import Logger from '../../lib/utilities/Logger';

export default class EventHandler {
    public constructor(client) {
        // handler based on the bundle
        fs.readdirSync("./bundle/internal/discord/bot/events").map((event: any) => {
            let _Event = require(`../../events/${event}`);
            
            let Event = new _Event(client);
            if(!Event || (Event && client.events.get(Event.data.name))) return;

            client.events.set(`${Event.data.name}`, Event);
            Logger.prototype.load("Event Handler", `Loaded ${Event.data.name}`);
        });
    }
}