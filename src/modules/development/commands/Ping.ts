import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "ping",
            description: "Watch the frequency with which the bot responds to command messages, and its connection to the Discord API.",
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
            description: `**Command Response** ${this.message.timestamp - Date.now()}ms\n**Shard Latency** ${this.guild.shard.latency}ms`
        });

        return true;
    }
}