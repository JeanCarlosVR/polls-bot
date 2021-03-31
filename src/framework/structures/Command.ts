import { MyClient } from '../Client';
import { commandProperties } from '../Types';
import GuildGateway from '../mongo/gateway/Guild';

export default class CommandStructure {

    protected client: typeof MyClient;
    public help: commandProperties;

    public message: any;
    public guild: any;

    public guildGateway: GuildGateway; 

    public constructor(client: typeof MyClient, props: commandProperties) {
        this.client = client;
        this.help = {
            name: props.name || undefined,
            description: props.description || null,
            category: props.category || null,
            linked_service: props.linked_service || null,
            aliases: props.aliases || [],
            available: props.available || false,
            premium: props.premium || false,
            development: props.development || false,
            usage: {
                parameters: props.usage.parameters || []
            },
            permissions: props.permissions || [],
            userPermissions: props.userPermissions || [],
            cooldown: {
                default: props.cooldown.default,
                premium: props.cooldown.premium,
                development: props.cooldown.development
            },
            helper: props.helper
        }

        this.guildGateway = new GuildGateway(this.client);
    }

    public async send(content: any, options?: any): Promise<MessageChannel> {
        let message = null;

        if(typeof content === "object") {
            let _embed = content;

            if(!options) options = {};

            if(!options.color) {
                _embed.color = this.guild.color;
            }

            message = await this.message.channel.send({
                embed: _embed
            });
        } else if(typeof content === "string") {
            message = await this.message.channel.send(`${content}`)
        } else {
            message = await this.message.channel.send(content);
        }

        return message;
    }

    public assign(message: any): void {
        this.message = message;
        this.guild = message.channel.guild;
        return;
    }

    public getOptions(args: string[], options?: { slice: number }): string[] {

        if(options) options = {
            slice: null
        };

        args = args.slice(options.slice);
        args = args.filter(argument => argument.startsWith(("--" || "-")));
        return args;
    }

    public get getUsage() {
        return (`\`${this.help.name}\` ${this.help.aliases.map(alias => `\`${alias}\``).join(", ")}`);
    }
}
