import { MyClient } from '../framework/Client';
import Event from '../framework/structures/Event';
import GuildSchema from '../framework/mongo/models/Guild';

export default class GuildCreate extends Event {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        super(client, {
            name: "Guild Create",
            listener: "guildCreate",
            linked_service: null
        });

        this.client = client;
    }

    public listen() {
        this.client.on("guildCreate", async (guild: any) => {
            try {
                let newGuildDocument = new GuildSchema({
                    id: guild.id
                });

                return (await newGuildDocument.save());
            } catch {
                return;
            }
        });
    }
}