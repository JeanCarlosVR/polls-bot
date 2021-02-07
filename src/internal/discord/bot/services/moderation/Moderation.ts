import { Client } from 'moyai-lib';
import Service from '../../lib/structures/service/Service';

export default class Moderation extends Service {
    public constructor(client: Client) {
        super(client, {
            name: "moderation",
            description: "Manage and protect the integrity of your Discord server.",
            premium: false,
            disabled: false,
            events: []
        });
    }
}