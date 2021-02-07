import Event from '../lib/structures/Event';
import GuildSchema from '../../../data/mongo/models/Guild';
import { Guild } from 'moyai-lib';

export = class guildCreate extends Event {
    public constructor(client: any) {
        super(client, {
            name: "guildCreate",
            description: "Fired when the client joins to a new guild, or the client create a guild.",
            service: null,
            disabled: false
        });

        this.client.on("guildCreate", async (guild: Guild): Promise<void> => {
            let _sessionDataStats = this.client.sessionData.get("stats");
            _sessionDataStats.receivedEvents.guildCreate.total += 1;

            let _event = this.client.events.get(`${this.data.name}`);
            if(!_event || (_event && _event.data.disabled)) return;

            let _newDocumentCreated = await this.onCreateGuild(guild);

            if(_newDocumentCreated) {
                _sessionDataStats.receivedEvents.guildCreate.newDocumentCreated += 1;
            }

            return this.client.sessionData.set("stats", _sessionDataStats);
        });
    }

    public async onCreateGuild(guild: Guild): Promise<boolean> {
        try {
            new GuildSchema({ id: guild.id }).save();
            return true;
        } catch(e) {
            return false;
        }
    }
}