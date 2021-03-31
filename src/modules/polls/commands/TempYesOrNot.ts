import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';

import ms from 'ms';
import Polls from '../../../services/Polls';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "tempyesornot",
            description: "Create new polls with 2 options (Yes or Not) with limit time.",
            category: "polls",
            linked_service: "polls",
            aliases: ["tyrn", "tyon", "tyn", "tyorn", "tempyorn"],
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
        if(_polls && _polls.length >= 5) {
            return this.send({
                description: `You can only have 5 temporary surveys running at the same time per server.`
            });
        }

        let [title, description, time] = args.join(" ").split("|");

        if(!args.length || args.length <= 0 || !title) {
            return this.send({
                author: {
                    name: `Arguments`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                description: `You need provide some text for create the poll. Usage: \`tyrn Title|Description|Time\``
            });
        }
        if (!description) description = "None";
        if(!time) {
            return this.send({
                author: {
                    name: `Arguments`,
                    icon_url: `${this.message.author.avatarURL}`
                },
                description: `You need provide a time for limit the time of the poll. (\`45s\` \`1m\` \`5h\` \`1d\`), Usage: \`tyrn Title|Description|Time\``
            });
        }

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

        let timer: any = ms(time);
    
        if(timer > 2419200000){
            return this.send({
                description: `The maximum time for any poll is 28 days (\`28d\`)`
            });
        }

        if(timer < 15000){
            return this.send({
                description: `The minimum time for any poll is 15 seconds (\`15s\`)`
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

        const _pollsTimeout = setTimeout(async () => {
            let _pollsUpdated = this.client.tempPollsPerGuild.get(this.message.channel.guild.id);
            let _pollMessageUpdated = await this.client.getMessage(_pollMessage.channel.id, _pollMessage.id);
            if(!_pollMessageUpdated) return;
            if(!(_pollMessageUpdated.reactions["✅"] || _pollMessageUpdated.reactions["❌"])) return;

            let up = _pollMessageUpdated.reactions["✅"].count - 1;
            let down = _pollMessageUpdated.reactions["❌"].count - 1;
            let _embedColor;

            if(up > down) _embedColor = 0x23FF00;
            else if(down > up) _embedColor = 0xFF0000;
            else if(up === down) _embedColor = 0x9E9E9E;


            if(_pollsUpdated) {
                this.client.tempPollsPerGuild.set(this.message.channel.guild.id, _pollsUpdated.filter((poll: any) => poll.message !== _pollMessage.id) || []);
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
                            name: `Up Votes`,
                            value: `${up} Votes`,
                            inline: true
                        },
                        {
                            name: `Down Votes`,
                            value: `${down} Votes`,
                            inline: true
                        }
                    ],
                    color: _embedColor
                }
            });
        }, timer);

        if(!_polls) {
            this.client.tempPollsPerGuild.set(this.message.channel.guild.id, [{
                type: `TEMPORAL_YES_OR_NOT`,
                start: Date.now(),
                timeout: _pollsTimeout,
                duration: timer,
                author: this.message.author.id,
                message: _pollMessage.id,
                channel: _pollMessage.channel.id
            }]);
        } else if(_polls && _polls.length && _polls.length >= 0) {
            this.client.tempPollsPerGuild.set(this.message.channel.guild.id, _polls.concat([{
                type: `TEMPORAL_YES_OR_NOT`,
                start: Date.now(),
                timeout: _pollsTimeout,
                duration: timer,
                author: this.message.author.id || null,
                message: _pollMessage.id || null,
                channel: _pollMessage.channel.id || null
            }])); 
        }

        return;
    }
}