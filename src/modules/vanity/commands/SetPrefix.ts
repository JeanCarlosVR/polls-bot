import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "setprefix",
            description: "Set a new prefix for run the commands.",
            category: "vanity",
            linked_service: null,
            aliases: ["prefix", "sp"],
            available: true,
            premium: false,
            development: false,
            usage: {
                parameters: []
            },
            permissions: [],
            userPermissions: [],
            cooldown: {
                default: 8000,
                premium: 2500,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<MessageChannel | boolean> {
        if(!args[0]) {
            return this.send({
                description: "Okay, tell me what is the new prefix you want to setup."
            });
        }

        if(args[0].length <= 0 || args[0].length >= 10) {
            return this.send({
                description: "The prefix number characters cannot be higher than 10 characters."
            });
        }

        this.guildGateway.update(this.message.channel.guild.id, {
            preferences: {
                prefix: `${args[0].slice(0, 10).trim()}`
            }
        });

        this.send({
            description: `The prefix has been changed! Try it: \`${args[0].slice(0, 10).trim()}help\``
        });

        return true;
    }
}
