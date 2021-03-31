import { MyClient } from '../framework/Client';
import Event from '../framework/structures/Event';

export default class GuildMemberAdd extends Event {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        super(client, {
            name: "MemberAdd",
            listener: "guildMemberAdd",
            linked_service: null
        });

        this.client = client;
    }

    public listen() {
        this.client.on("guildMemberAdd", async (guild: any, member: any) => {
            
        });
    }
}