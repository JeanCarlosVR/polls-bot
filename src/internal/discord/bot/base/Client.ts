/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Mongo from '../../../data/mongo/Connect';
import Sharder from '../lib/clustering/sharding/ClusterManager';
import Logger from '../lib/utilities/Logger';

export default class Client {
    public constructor(token: string, mongo_atlas_uri: string, node: { firstShardID: number, shards: number }) {

        Logger.prototype.debug("Nodes Interconnection", `The minimun shard ID on this Node is ${node.firstShardID} with a total of ${node.shards} shards.`);
        new Mongo().connect(mongo_atlas_uri);
        let clientSharder = new Sharder(token, {
            clientOptions: {
                restMode: true,
                messageLimit: 100,
                autoreconnect: true,
                setMaxListeners: 0,
                defaultImageFormat: "png",
                compress: true,
                guildSubscriptions: false,
                requestTimeout: 20000,
                allowedMentions: {
                    everyone: false
                },
            },
            stats: true,
            clusters: 1, // 8
            shards: node.shards, // NODE1=250, NODE2=500, NODE3=750, NODE4=1000, NODE5=1250
            firstShardID: node.firstShardID, // NODE1=0, NODE2=250, NODE3=500, NODE4=750, NODE5=1000
            lastShardID: node.shards, // NODE1=250, NODE2=500, NODE3=750, NODE4=1000, NODE5=1250
            //guildPerShard: 2500,
            debug: true,
            name: "Moyai",
            setMaxListeners: 0,
            intents: 1537
        });

        clientSharder.on("stats", async (stats: any) => {
            console.log(stats);
        });
    }
}