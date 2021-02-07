/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { connect } from 'mongoose';
import Logger from '../../discord/bot/lib/utilities/Logger';

export default class Mongo {

    public mongoClient: string;

    public constructor() {
        
    }

    public connect(mongo_atlas_uri: string) {
        connect(mongo_atlas_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(() => Logger.prototype.log("Mongo", "Mongo Atlas Successfelly connected."))
        .catch(() => Logger.prototype.log("Mongo", "Failed to try connect to Mongo Atlas."));
    }
}