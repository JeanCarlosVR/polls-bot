import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "invite",
            description: "Invite the bot to another Discord servers.",
            category: "development",
            linked_service: null,
            aliases: [],
            available: true,
            premium: false,
            development: true,
            usage: {
                parameters: []
            },
            permissions: [],
            userPermissions: [],
            cooldown: {
                default: 5000,
                premium: 2500,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<MessageChannel | boolean> {
        this.send({
            description: `https://discord.com/api/oauth2/authorize?client_id=663104539163099137&permissions=391232&scope=bot`
        });

        return true;
    }
}