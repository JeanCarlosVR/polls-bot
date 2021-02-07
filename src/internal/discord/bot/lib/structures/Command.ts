import { Client, Message } from 'moyai-lib';
import GuildSchema from '../../../../data/mongo/models/Guild';

interface Options {
    name: string | null
    description: string | null
    service: string
    aliases: any[]
    usage: any | string
    cooldown: {
        default: number
        premium: number
    }
    disabled: boolean,
    for_developers: boolean
}

export default abstract class Command {

    public client: any;
    public data: any;

    protected message: any;
    protected args: any;
    protected guild: typeof GuildSchema;
    
    public constructor(client: Client, options: Options) {
        this.client = client;
        this.data = {
            name: options.name || null,
            description: options.description || null,
            service: options.service || null,
            aliases: options.aliases || [],
            usage: options.usage || null,
            cooldown: {
                default: options.cooldown.default || 2000,
                premium: options.cooldown.premium || 500,
            },
            disabled: options.disabled || false,
            for_developers: options.for_developers || true
        }
    }

    public setup(message: Message, args: string[], guild: typeof GuildSchema) {
        this.message = message;
        this.args = args;
        this.guild = guild;
    }

    public send(content: any, file?: any) {
        if(typeof content === "object") {
            content.color = this.guild.preferences.color;
            return this.message.channel.send({
                embed: content
            }, file);
        } else {
            this.message.channel.send(content, file);
        }
    }

    public async getFlags(args: any[]): Promise<object> {
        let _match = {};

        args = args.filter((e) => e.startsWith("-"));
        args = args.filter((e) => e.includes("="));
        
        for await(let arg of args) {
            let _flagName = arg.split("=")[0];
            let _flagValue = arg.split("=")[1];

            if(_flagValue.length >= 1) {
                _match[_flagName.slice(1, 120)] = _flagValue.slice(0, 120);
            }
        }

        return _match;
    }

    public enable() {
        if(this.client.commands.get(`${this.data.name}`).disabled === false) return;
        this.client.commands.delete(`${this.data.name}`);
        this.data.disabled = false;
        this.client.commands.set(`${this.data.name}`, this.data);
    }

    public disable() {
        if(!this.client.commands.get(`${this.data.name}`).disabled === true) return;
        this.client.commands.delete(`${this.data.name}`);
        this.data.disabled = true;
        this.client.commands.set(`${this.data.name}`, this.data);
    }
}