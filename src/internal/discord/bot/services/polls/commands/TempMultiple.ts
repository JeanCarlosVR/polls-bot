import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";
import ms from 'ms';

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "multiple",
            description: "Create new polls with multiples custom options.",
            service: "polls",
            aliases: ["m"],
            usage: null,
            cooldown: {
                default: 10000,
                premium: 2000
            },
            disabled: false,
            for_developers: false
        });
    }

    public async run() {
        let [
            title,
            description,
            time,
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

        if(!this.args.length || this.args.length <= 0 || !title) {
            return this.send({
                description: `You need provide a title. Usage: \`multiple Title|Description|Time|Option 1|Option 2|...|Option 10\``
            });
        }

        if (!time) {
            return this.send({
                author: {
                    name: `Arguments`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                description: `You need provide a time for limit the time of the poll. (\`45s\` \`1m\` \`5h\` \`1d\`), Usage: \`tempmultiple Title|Description|Time|Option 1|Option 2|...|Option 10\``
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

        let timer = ms(time);
        if (timer > 2419200000) {
            return this.send({
                description: `The maximum time for any poll is 28 days (\`28d\`)`
            });
        }
        if (timer < 5000) {
            return this.send({
                description: `The minimum time for any poll is 5 seconds (\`5s\`)`
            });
        }

        if (!one) return this.send({
            description: `You need provide minimum a option. Usage: \`multiple Title|Description|Time|Option 1|Option 2|...|Option 10\``
        });

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
        for(let option of options) {
            _x = _x + 1;
            if(option) {
                _embedPoll.fields.push({
                    name: `Option ${_x}`,
                    value: `${option}`,
                    inline: false
                });
            }
        }

        let _pollMessage = await this.message.channel.send({ embed: _embedPoll });
        if(!_pollMessage) return;

        let _reactionsActive = [];
        for await (let option of options) {
            _x = 1 + _x;
            if (!option)
                break;
            if (_x === 1) {
                _reactionsActive.push("1️⃣");
                await _pollMessage.addReaction("1️⃣");
            }
            else if (_x === 2) {
                _reactionsActive.push("2️⃣");
                await _pollMessage.addReaction("2️⃣");
            }
            else if (_x === 3) {
                _reactionsActive.push("3️⃣");
                await _pollMessage.addReaction("3️⃣");
            }
            else if (_x === 4) {
                _reactionsActive.push("4️⃣");
                await _pollMessage.addReaction("4️⃣");
            }
            else if (_x === 5) {
                _reactionsActive.push("5️⃣");
                await _pollMessage.addReaction("5️⃣");
            }
            else if (_x === 6) {
                _reactionsActive.push("6️⃣");
                await _pollMessage.addReaction("6️⃣");
            }
            else if (_x === 7) {
                _reactionsActive.push("7️⃣");
                await _pollMessage.addReaction("7️⃣");
            }
            else if (_x === 8) {
                _reactionsActive.push("8️⃣");
                await _pollMessage.addReaction("8️⃣");
            }
            else if (_x === 9) {
                _reactionsActive.push("9️⃣");
                await _pollMessage.addReaction("9️⃣");
            }
            else if (_x === 10) {
                _reactionsActive.push("🔟");
                await _pollMessage.addReaction("🔟");
            }
        }

        
        let _pollTimeout = setTimeout(async () => {
            let _pollMessageUpdated = await this.client.getMessage(_pollMessage.channel.id, _pollMessage.id);
            if (!_pollMessageUpdated) return;
            if (!(_pollMessageUpdated.reactions["1️⃣"])) return;
            let _result = "";

            for(let reaction of _reactionsActive){
                if(_pollMessageUpdated.reactions[`${reaction}`]) {
                    _result = _result + `${reaction} ${_pollMessageUpdated.reactions[`${reaction}`].count - 1 || 0} Votes \n`;
                }
            }
        
            _pollMessageUpdated.removeReactions();
            return _pollMessage.edit({
                content: `<@${this.message.author.id}> Your poll has been ended.`,
                embed: {
                    title: `The @${this.message.author.username}#${this.message.author.discriminator} Poll has been ended`,
                    fields: [
                        {
                            name: `Author`,
                            value: `<@!${this.message.author.id}>`,
                            inline: false
                        },
                        {
                            name: `Poll Title`,
                            value: `${title.slice(0, 200)}`,
                            inline: true
                        },
                        {
                            name: `Poll Description`,
                            value: `${description.slice(0, 2000)}`,
                            inline: true
                        },
                        {
                            name: `Poll Duration`,
                            value: `${this.client.functions.format(timer)}`,
                            inline: false
                        },
                        {
                            name: `Result`,
                            value: `${_result}`,
                            inline: true
                        }
                    ],
                    color: 0x6EA2DC
                }
            });
        }, timer);

        this.client.polls.set(`${_pollMessage.id}`, {
            type: 1,
            message: _pollMessage,
            timeout: _pollTimeout,
            startReactions: _reactionsActive
        });
    }
}