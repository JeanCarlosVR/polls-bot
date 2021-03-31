import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "support",
            description: "Get support about bot issues or another things.",
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
            description: `You can join to the Discord Support Server\nhttps://discord.gg/xVkMuMAmqQ`
        });

        return true;
    }
}