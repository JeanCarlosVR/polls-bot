import { MyClient } from '../Client';

import Collection from '../utilities/Collection';
import Functions from '../utilities/Functions';

import CacheManager from '../cache/CacheManager';
import ModulesManager from '../managers/Module';
import EventsManager from '../managers/Event';
import CommandsManager from '../managers/Command';
import AdditionsManager from '../managers/Additions';
import ServicesManager from '../managers/Service';

export default class Loader {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async init(): Promise<{ client: any }> {
        this.client.commands = new Collection();
        this.client.events = new Collection();
        this.client.modules = new Collection();
        this.client.services = new Collection();

        this.client.cooldowns = new Collection();
        this.client.tempPollsPerGuild = new Collection();

        this.client.util = new Functions(this.client);
        
        new AdditionsManager(this.client).Load();
        new ServicesManager(this.client).Load();
        new ModulesManager(this.client).Load();
        new CommandsManager(this.client).Load();
        new CacheManager(this.client);
        new EventsManager(this.client).Load();

        return this.client;
    }
}