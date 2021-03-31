import { MyClient } from '../../Client';
import GuildSchema from '../models/Guild';

export default class GuildGateway {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    async getGuild(guild_id: string) {
        let _guild = await GuildSchema.findOne({ id: guild_id });
        if(!_guild) return false;

        return _guild;
    }

    async insert(guild_id: string) {
        let _guild = new GuildSchema({
            id: guild_id
        }).save();

        if(!_guild) return false;

        return _guild;
    }

    public async update(guild_id: string, update: object): Promise<boolean> {

        let error: boolean = false;

        try {
            await GuildSchema.findOneAndUpdate({ id: guild_id }, update);
        } catch(err) {
            error = err;
        }

        return Promise.resolve(error);
    }

    public async delete(guild_id: number | string) {
        let error: boolean = false;

        try {
            await GuildSchema.deleteOne({ id: guild_id }).remove().exec();
        } catch {
            error = true;
        }

        return Promise.resolve(error);
    }
}