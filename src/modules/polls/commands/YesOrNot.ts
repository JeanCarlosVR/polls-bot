import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "yesornot",
            description: "Create new polls with 2 options (Yes or Not).",
            category: "polls",
            linked_service: "polls",
            aliases: ["yrn", "yon", "yn", "yorn"],
            available: true,
            premium: false,
            development: false,
            usage: {
                parameters: []
            },
            permissions: ["sendMessages", "manageMessages"],
            userPermissions: ["sendMessages", "manageMessages"],
            cooldown: {
                default: 12000,
                premium: 6000,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<MessageChannel | boolean> {

        let text = args.join(" ");
        let textstring = text.split("|");
        let [title, description] = textstring;

        if(!args.length || args.length <= 0 || !title) {
            return this.send({
                author: {
                    name: `Arguments`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                description: `You need provide some text for create the poll. Usage: \`tyrn Title|Description\``
            });
        }
        if (!description) description = "None";

        if (title.length > 200) {
            return this.send({
                description: `The maximum number of characters for a title is 200 characters.`
            });
        }

        if (description.length > 2000) {
            return this.send({
                description: `The maximum number of characters for a description is 2000 characters.`
            });
        }

        let _pollMessage = await this.message.channel.send({
            embed: {
                title: `${title.slice(0, 200)}`,
                description: `${description.slice(0, 2000)}`,
                footer: {
                    text: `${this.message.author.username}#${this.message.author.discriminator} Poll`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                color: this.guild.color
            }
        });

        await _pollMessage.addReaction("✅");
        await _pollMessage.addReaction("❌");

        return;
    }
}