import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "tempmultiple",
            description: "Create new polls with multiples custom options and limited time.",
            service: "polls",
            aliases: ["tm", "tmultiple"],
            usage: null,
            cooldown: {
                default: 2000,
                premium: 1000
            },
            disabled: false,
            for_developers: false
        });
    }

    public async run() {
        let [
            title,
            description,
            one,
            two,
            three,
            four,
            five,
            six,
            seven,
            eight,
            nine,
            ten
        ] = this.args.join(" ").split("|");

        if (!this.args.length || this.args.length <= 0 || !title) {
            return this.send({
                description: `You need provide a title. Usage: \`multiple Title|Description|Option 1|Option 2|...|Option 10\``
            });
        }

        if (!description) description = "None";

        if (title.length > 200) {
            return this.send({
                description: `The maximum number of characters for a title is 200 characters.`
            });
        }

        if (description.length > 300) {
            return this.send({
                description: `The maximum number of characters for a description is 300 characters.`
            });
        }

        if (!one) {
            return this.send({
                description: `You need provide minimum a option. Usage: \`multiple Title|Description|Option 1|Option 2|...|Option 10\``
            });
        }

        if (!two) two = "??";

        let _embedPoll: any = {
            title: `${title.slice(0, 200)}`,
            description: `${title.slice(0, 300)}`,
            fields: [],
            footer: {
                text: `${this.message.author.username}#${this.message.author.discriminator} Poll`,
                icon_url: `${this.message.author.avatarURL}`
            },
            color: this.guild.color
        }

        let options: any[] = [one, two, three, four, five, six, seven, eight, nine, ten];
        let _x = 0;
        for (let option of options) {
            _x = _x + 1;
            if (option) {
                _embedPoll.fields.push({
                    name: `Option ${_x}`,
                    value: `${option}`,
                    inline: false
                });
            }
        }

        let _pollMessage = await this.message.channel.send({ embed: _embedPoll });
        _x = 0;

        for await (let option of options) {
            _x = 1 + _x;
            if (!option) break;
            if (_x === 1) {
                await _pollMessage.addReaction("1️⃣");
            } else if (_x === 2) {
                await _pollMessage.addReaction("2️⃣");
            } else if (_x === 3) {
                await _pollMessage.addReaction("3️⃣");
            } else if (_x === 4) {
                await _pollMessage.addReaction("4️⃣");
            } else if (_x === 5) {
                await _pollMessage.addReaction("5️⃣");
            } else if (_x === 6) {
                await _pollMessage.addReaction("6️⃣");
            } else if (_x === 7) {
                await _pollMessage.addReaction("7️⃣");
            } else if (_x === 8) {
                await _pollMessage.addReaction("8️⃣");
            } else if (_x === 9) {
                await _pollMessage.addReaction("9️⃣");
            } else if (_x === 10) {
                await _pollMessage.addReaction("🔟");
            }
        }
    }
}