import { MyClient } from '../framework/Client';
import Event from '../framework/structures/Event';
import GuildSchema from '../framework/mongo/models/Guild';

export default class MessageCreate extends Event {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        super(client, {
            name: "Message Create",
            listener: "messageCreate",
            linked_service: null
        });

        this.client = client;
    }

    public listen() {
        this.client.on("messageCreate", async (message: any) => {
            if(message.author.bot) return;

            let guild: any = await GuildSchema.findOne({ id: message.channel.guild.id });
            if(!guild) {
                try {
                    let newGuildDocument = new GuildSchema({
                        id: guild.id
                    });
                    guild = newGuildDocument.save() || {"premium":"false","preferences":{"prefix":"p!","language":0},"modules":{"disabledCommands":[],"moderation":{"status":true,"moderators":{"roles":[],"users":[]}}},"services":{"music":{"status":true,"defaultVolume":50,"quality":0,"platforms":[1,2,3,4],"distort":false,"availableChannels":[]},"tickets":{"status":true,"all_tickets":[]},"auto_moderator":{"status":false,"systems":{"spam":{"status":false,"ignore":{"channels":[],"roles":[]}}}}},"id": message.channel.guild.id,"__v":0};
                } catch {
                    return;
                }
            }

            let prefix: string = guild.preferences.prefix;

            message.channel.guild.color = 0xF1F1F1;

            message.channel.guild.preferences = guild.preferences;
            message.channel.guild.modules = guild.modules;
            message.channel.guild.services = guild.services || null;

            if(!message.content.startsWith(prefix)) return;

            let args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
            let Command = args.shift().toLowerCase();
            let command = this.client.commands.get(Command) || this.client.commands.find((cmd: any) => cmd.help.aliases.includes(`${Command}`));
            if(!command) return;

            /*// Checking Availability
            if(guild.modules.disabledCommands.find((cmd: any) => cmd.name === command.help.name)) return;
            if(command.help.linked_service !== null && guild.services[command.help.linked_service] && guild.services[command.help.linked_service].status !== true) return;
            let _relationed_module = this.client.modules.find((x_module: any) => x_module.help.categories.find((category: any) => category === command.help.category));
            if(guild.modules[_relationed_module && _relationed_module.help.name] && guild.modules[_relationed_module &&_relationed_module.help.name].status !== true ) return;
*/
            try {
                let hasCooldown = this.checkCooldown(message, command);
                if(hasCooldown && hasCooldown[command.help.name] && hasCooldown[command.help.name][message.author.id]){
                    if(hasCooldown[command.help.name][message.author.id].retries === 0) {
                        await message.channel.send({
                            embed: {
                                description: `You need to wait \`${this.client.util.humanize(Date.now() - (hasCooldown[command.help.name][message.author.id]["timestamp"]))}\` to use this command again.`,
                                color: message.channel.guild.color
                            }
                        });
                    }

                    this.cooldowns.addRetry(message, command, 1);
                    return;
                } else {

                    let cooldown = command.help.cooldown.default;
                    if(guild.premium) cooldown = command.help.cooldown.premium;

                    for(let permission of command.help.userPermissions) {
                        if(!message.member.permission.has(permission)) {
                            return message.channel.send({
                                embed: {
                                    description: `You need \`${permission}\` permission to be able to execute this command.`,
                                    color: message.channel.guild.color
                                }
                            });
                        }
                    }

                    await command.assign(message);
                    let completed = command.execute(args);
                    if(completed === true) {
                        this.putCooldown(message, command, cooldown, {
                            delete: true
                        });
                    }
                }
            } catch(err) {
                return console.log(err);
            }
        });
    }
}