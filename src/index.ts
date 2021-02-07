/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Bot from './internal/discord/bot/base/Client';
import Nodes from './internal/discord/bot/lib/clustering/nodes/Nodes';
import dotenv from 'dotenv';
dotenv.config();

(() => {
    let _node = {
        id: parseInt(process.env.NODE_ID),
        name: `node${parseInt(process.env.NODE_ID)}`,
        token: process.env.NODE_TOKEN,
        online: true
    }

    //new Nodes(_node);
    new Bot(process.env.TOKEN, process.env.MONGO, { 
        firstShardID: parseInt(process.env.MINIMUM_SHARD_ID),
        shards: parseInt(process.env.TOTAL_SHARDS)
    });
})();