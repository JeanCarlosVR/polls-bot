import { Schema, model } from 'mongoose';

const BotSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true,
        default: 0
    },
    clusters: {
        type: Object,
        require: true,
        default: null
    },
    ignore: {
        type: Object,
        require: true,
        default: {
            guilds: [],
            users: []
        }
    }
});

export = model("bot", BotSchema);