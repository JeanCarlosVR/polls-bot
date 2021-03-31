import { connect } from 'mongoose';
import Logger from '../utilities/Logger';
import BotSchema from './models/Bot';
import { bot_schema_model } from '../../../config.json';

export default class ConnectionMongo {
    public constructor(mongo_atlas_url: string) {
        connect(mongo_atlas_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).then(() => {
            Logger.log("Mongo Atlas", "Now connected to Mongo Atlas");
        }).catch((err) => {
            Logger.error("Mongo Atlas", `Error: ${err}`)
        });

        this.botSchema();
    }

    public async botSchema() {
        let _bot = await BotSchema.findOne({ id: bot_schema_model });
        if(!_bot) {
            let _new_bot_doc = new BotSchema({
                id: bot_schema_model
            });

            try {
                _new_bot_doc.save();
            } catch {
                Logger.error("Mongo Atlas", "Bot schema cannot be created");
            }
        }
    }
}