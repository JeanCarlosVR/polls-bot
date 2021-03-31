import fs from 'fs';
import Logger from '../utilities/Logger';
import { MyClient } from '../Client';

export default class EventsManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async Load() {
        await fs.readdirSync(`./bundle/src/events/`).map(async (thisEvent) => {
            let Event = new (await import(`../../events/${thisEvent}`)).default(this.client);

            Event.listen();

            if(Event.help.linked_service !== null) {

                let _service = this.client.services.get(Event.help.linked_service);
                if(!_service) return;

                _service.help.events.push(Event);

                this.client.services.set(_service.help.name, _service)
            }

            Logger.load("Handler Events", `Loaded ${Event.help.name}`);
            this.client.events.set(Event.help.listener, Event)
        });

        return {
            success: true,
            failed: false,
            error: false,
            type: "client.events",
            events: this.client.events
        }
    }
}