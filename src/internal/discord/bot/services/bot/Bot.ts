import { Client } from 'moyai-lib';
import Service from '../../lib/structures/service/Service';

export default class Bot extends Service {
    public constructor(client: Client) {
        super(client, {
            name: "bot",
            description: "Get information about Moyai.",
            premium: false,
            disabled: false,
            events: []
        });
    }
}