import { Client, Message } from 'moyai-lib';
import Event from '../lib/structures/Event';
import GuildSchema from '../../../data/mongo/models/Guild';
import Command from '../lib/structures/Command';

export = class MessageCreate extends Event {
    public constructor(client: Client) {
        super(client, {
            name: "messageCreate",
            description: "Fired when a messages was sent.",
            service: null,
            disabled: false
        });

        this.client.on("messageCreate", async (message: Message): Promise<void> => {

            let _sessionDataStats = this.client.sessionData.get("stats");
            _sessionDataStats.receivedEvents.messageCreate += 1;

            let _event = this.client.events.get(`${this.data.name}`);
            if(!_event || (_event && _event.data.disabled)) return;

            let _messageProcess = await this.onMessageCreate(message);
            if(_messageProcess) {
                _sessionDataStats.commandsRunSuccessfully += 1; 
            }

            return this.client.sessionData.set("stats", _sessionDataStats);
        });
    }

    public async onMessageCreate(message: any): Promise<boolean> {
        if(message.author.bot || !message.channel.guild) return;

        let guild = await GuildSchema.findOne({ id: `${message.channel.guild.id}` });
        if(!guild) return;
        if(guild.preferences.ignored === true) return;

        if(!message.content.startsWith(`${guild.preferences.prefix}`)) return;

        let args = message.content.slice(guild.preferences.prefix.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        let cmd = this.client.commands.get(command) || this.client.commands.find((cmd: Command) => cmd.data.aliases && cmd.data.aliases.includes(command));

        if((!cmd || (cmd && !(cmd.data || cmd.prototype.run))) || cmd.data.disabled) return;
        
        let _commandService = this.client.services.get(`${cmd.data.service}`);
        if(!_commandService || (_commandService && _commandService.data.disabled)) return;

        if(cmd.data.for_developers && message.author.id !== process.env.DEVELOPER) return;
        
        try {
            cmd.setup(message, args, guild);
            cmd.run();
        } catch(err) {
            await message.channel.send({
                embed: {
                    author: {
                        name: `${this.client.user.username}`,
                        icon_url: `${this.client.user.avatarURL}`
                    },
                    description: `Apparently some goblins infiltrated our systems and have spoiled it. \n \nAn unexpected error has occurred, if you wish you can report it to our [support server](https://discord.moyai.ml/).`,
                    color: 0xFF5050
                }
            });

            return false;
        }

        return true;
    }
}