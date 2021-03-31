import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

import ms from 'ms';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "tempmultiple",
            description: "Create new polls with multiples custom options with limited time.",
            category: "polls",
            linked_service: "polls",
            aliases: ["tm"],
            available: true,
            premium: false,
            development: false,
            usage: {
                parameters: []
            },
            permissions: ["sendMessages", "manageMessages"],
            userPermissions: ["sendMessages", "manageMessages"],
            cooldown: {
                default: 15000,
                premium: 10000,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<MessageChannel | boolean> {
        let _polls = this.client.tempPollsPerGuild.get(this.message.channel.guild.id);
        if (_polls && _polls.length >= 5) {
            return this.send({
                description: `You can only have 5 temporary surveys running at the same time per server.`
            });
        }
        var [title, description, time, one, two, three, four, five, six, seven, eight, nine, ten] = args.join(" ").split("|");

        if (!args.length || args.length <= 0 || !title) {
            return this.send({
                description: `You need provide a title. Usage: \`multiple Title|Description|Time|Option 1|Option 2|...|Option 10\``
            });
        }

        if (!description || (description && !description.length || (description.length && description.length <= 0))) description = "None";
        if (!time) {
            return this.send({
                author: {
                    name: `Arguments`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                description: `You need provide a time for limit the time of the poll. (\`45s\` \`1m\` \`5h\` \`1d\`), Usage: \`tempmultiple Title|Description|Time|Option 1|Option 2|...|Option 10\``
            });
        }

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

        if (timer < 15000) {
            return this.send({
                description: `The minimum time for any poll is 15 seconds (\`15s\`)`
            });
        }

        if (!one) {
            return this.send({
                description: `You need provide minimum a option. Usage: \`multiple Title|Description|Option 1|Option 2|...|Option 10\``
            });
        }

        if (!two) two = "??";

        let _embedPoll = {
            title: `${title.slice(0, 200)}`,
            description: `${title.slice(0, 300)}`,
            fields: [],
            footer: {
                text: `${this.message.author.username}#${this.message.author.discriminator} Poll`,
                icon_url: `${this.message.author.avatarURL}`
            },
            color: this.guild.color
        };

        let options = [one, two, three, four, five, six, seven, eight, nine, ten];
        let _optionNumber = 0;
        for (let option of options) {
            _optionNumber += 1;
            if (option) {
                _embedPoll.fields.push({
                    name: `Option ${_optionNumber}`,
                    value: `${option.slice(0, 250)}`,
                    inline: false
                });
            }
        }
        
        let _pollMessage = await this.message.channel.send({ embed: _embedPoll });

        _optionNumber = 0;
        let _reactionsActive = [];
        for await (let option of options) {
            _optionNumber += 1;
            if (!option)
                break;
            switch (_optionNumber) {
                case 1:
                    _reactionsActive.push(`1️⃣}`);
                    await _pollMessage.addReaction("1️⃣");
                    break;
                case 2:
                    _reactionsActive.push("2️⃣");
                    await _pollMessage.addReaction("2️⃣");
                    break;
                case 3:
                    _reactionsActive.push("3️⃣");
                    await _pollMessage.addReaction("3️⃣");
                    break;
                case 4:
                    _reactionsActive.push("4️⃣");
                    await _pollMessage.addReaction("4️⃣");
                    break;
                case 5:
                    _reactionsActive.push("5️⃣");
                    await _pollMessage.addReaction("5️⃣");
                    break;
                case 6:
                    _reactionsActive.push("6️⃣");
                    await _pollMessage.addReaction("6️⃣");
                    break;
                case 7:
                    _reactionsActive.push("7️⃣");
                    await _pollMessage.addReaction("7️⃣");
                    break;
                case 8:
                    _reactionsActive.push("8️⃣");
                    await _pollMessage.addReaction("8️⃣");
                    break;
                case 9:
                    _reactionsActive.push("9️⃣");
                    await _pollMessage.addReaction("9️⃣");
                    break;
                case 10:
                    _reactionsActive.push("🔟");
                    await _pollMessage.addReaction("🔟");
                    break;
                default:
                    break;
            }
        }
        let _pollsTimeout = setTimeout(async () => {
            let _pollsUpdated = this.client.tempPollsPerGuild.get(this.message.channel.guild.id);
            let _pollMessageUpdated = await this.client.getMessage(_pollMessage.channel.id, _pollMessage.id);
            if (!_pollMessageUpdated) return;
            if (!(_pollMessageUpdated.reactions["1️⃣"])) return;

            let _result = "";
            for (let reaction of _reactionsActive) {
                if (_pollMessageUpdated.reactions[`${reaction}`]) {
                    _result = _result + `${reaction} ${_pollMessageUpdated.reactions[`${reaction}`].count - 1 || 0} Votes \n`;
                }
            }

            if (_pollsUpdated) {
                let _value = _pollsUpdated.filter((poll: any) => poll.message !== _pollMessage.id) || [];

                this.client.tempPollsPerGuild.set(this.message.channel.guild.id, _value);
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
                            value: `${this.client.util.humanize(timer)}`,
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
        
        _polls = this.client.tempPollsPerGuild.get(this.message.channel.guild.id);
        this.client.tempPollsPerGuild.set(this.message.channel.guild.id, (_polls && _polls.length && _polls.length >= 0) ? _polls.concat([{
            type: `TEMPORAL_MULTIPLE`,
            start: Date.now(),
            timeout: _pollsTimeout,
            duration: timer,
            author: this.message.author.id || null,
            message: _pollMessage.id || null,
            channel: _pollMessage.channel.id || null
        }]) : [{
            type: `TEMPORAL_MULTIPLE`,
            start: Date.now(),
            timeout: _pollsTimeout,
            duration: timer,
            author: this.message.author.id || null,
            message: _pollMessage.id || null,
            channel: _pollMessage.channel.id || null
        }]);

        return true;
    }
}