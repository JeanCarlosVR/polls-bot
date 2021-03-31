import { MyClient } from '../Client';
import CommandStructure from '../structures/Command';

export default class UserCooldown {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public put(message: any, command: CommandStructure, timeout: number, options?: { delete: Boolean }) {
        this.client.cooldowns.set(message.channel.guild.id, { [command.help.name]: { [message.author.id]: {
                    guild: message.channel.guild.id,
                    channel: message.channel.id,
                    user: message.author.id,
                    retries: 0,
                    timestamp: Date.now(),
                }
            }
        });

        setTimeout(() => {
            try {
                this.client.cooldowns.delete(message.channel.guild.id, [command.help.name][message.author.id]);
            } catch {
                return () => false;
            }
        }, timeout);

        return {
            message,
            command,
            timeout,
            options
        };
    }

    public addRetry(message: any, command: CommandStructure, addition: number) {
        let _x = this.client.cooldowns.get(message.channel.guild.id, [command.help.name][message.author.id]);
        if(!_x) return;

        _x[command.help.name][message.author.id].retries = _x[command.help.name][message.author.id].retries + addition

        return this.client.cooldowns.set(message.channel.guild.id, { [command.help.name]: _x[command.help.name] })
    }

    public delete(message: any, command: any) {
        if(!this.client.cooldowns.get(message.channel.guild.id, [command.help.name][message.author.id])) return;
        return this.client.cooldowns.delete(message.channel.guild.id, [command.help.name][message.author.id]) ? true : false;
    }
}