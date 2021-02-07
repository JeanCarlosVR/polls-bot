import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "yesornot",
            description: "Create new polls with 2 options (Yes or Not).",
            service: "polls",
            aliases: ["yrn", "yon", "yn", "yorn"],
            usage: "tyn New Poll!|What do you think about add new items to the game? :D",
            cooldown: {
                default: 10000,
                premium: 2000
            },
            disabled: false,
            for_developers: false
        });
    }

    public async run() {
        let [title, description] = this.args.join(" ").split("|");;

        if(!this.args.length || this.args.length <= 0 || !title) {
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

        try {
            await _pollMessage.addReaction("✅");
            await _pollMessage.addReaction("❌");
        } catch {
            return false;
        }

        return true;
    }
}