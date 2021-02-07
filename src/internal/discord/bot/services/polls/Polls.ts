import { Client } from 'moyai-lib';
import Service from '../../lib/structures/service/Service';

export default class Moderation extends Service {
    public constructor(client: Client) {
        super(client, {
            name: "polls",
            description: "Create varieties of polls with different types of polls in order to get people's opinion.",
            premium: false,
            disabled: false,
            events: []
        });
    }
}