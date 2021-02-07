/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Collection from '../../lib/utilities/Collection';
import Functions from '../../lib/utilities/Functions';

import Redis from '../../../../data/redis/Redis';

import AdditionHandler from '../../lib/handlers/Additions';
import EventHandler from '../../lib/handlers/Events';
import ServiceHandler from '../../lib/handlers/Services';
import CommandHandler from '../../lib/handlers/Commands';

import API from '../../../../api/Server';

export default class Loader {

    public client: any;

    public constructor(client: any, ipc: any, clusterID: any) {
        this.client = client;
        this.client.ipc = ipc;
        this.client.clusterID = clusterID;
        this.client.redis = new Redis();
        
        this.start();
    }

    public async start() {
        this.client.services = new Collection();
        this.client.commands = new Collection();
        this.client.events = new Collection();
        this.client.polls = new Collection();

        this.client.sessionData = new Collection();
        this.client.functions = new Functions(this.client, "jean", {
            danger: true
        });

        this.client.sessionData.set("stats", {
            start: Date.now(),
            commandsRunSuccessfully: 0,
            receivedEvents: {
                messageCreate: 0,
                guildCreate: {
                    total: 0,
                    newDocumentCreated: 0
                }
            }
        });

        new ServiceHandler(this.client);
        new CommandHandler(this.client);
        new EventHandler(this.client);
        new AdditionHandler(this.client);

        new API(this.client).listen();
    }
}