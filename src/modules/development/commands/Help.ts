import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "help",
            description: "Get help about the bot.",
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
        if(args[0]) {
            let _command = this.client.commands.get(`${args[0].slice(0, 100)}`);
            if(!_command) return this.send({
                description: `Unknown command, try to check all commands with \`p!help\` `
            });

            this.send({
                author: {
                    name: `${_command.name} Help`,
                    icon_url: `${this.client.user.avatarURL}`
                },
                description: `**Name**: ${_command.help.name}\n**Description**: ${_command.help.description}\n**Category**: ${_command.help.category}\n**Current Cooldown**: ${this.client.util.humanize(_command.help.cooldown.default)}\n**Premium Cooldown**: ${this.client.util.humanize(_command.help.cooldown.premium)}\n**Premium**: ${_command.help.premium ? "Yes" : "No"}`
            });
        } else {
            this.send({
                author: {
                    name: `${this.client.user.username} Help`,
                    avatar_url: `${this.client.user.avatarURL}`
                },
                description: `\nUsage: \`p!<command> <arguments>\``,
                fields: [
                    {
                        name: `:question: / Yes or Not`,
                        value: "`yesornot` `tempyesornot`",
                        inline: false
                    },
                    {
                        name: `:bar_chart: / **Multiple**`,
                        value: "`multiple`",
                        inline: false
                    },
                    {
                        name: `:gear: / **Vanity**`,
                        value: "`setprefix`",
                        inline: false
                    },
                    {
                        name: `:robot: / **Bot**`,
                        value: " `ping` `shards` `support` `invite`",
                        inline: false
                    }
                ]
            });
        }

        return true;
    }
}
