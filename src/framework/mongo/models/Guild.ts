import { Schema, model } from 'mongoose';

const GuildSchema = new Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    premium: {
        type: String,
        require: true,
        default: false
    },
    preferences: {
        type: Object,
        require: true,
        default: {
            prefix: "p!",
            language: 0
        }
    },
    modules: {
        type: Object,
        require: true,
        default: {
            disabledCommands: [],
            moderation: {
                status: true,
                moderators: {
                    roles: [],
                    users: []
                }
            },
            development: {},
            settings: {},
            tickets: {}
        }
    },
    services: {
        type: Object,
        require: true,
        default: {
            music: {
                status: true,
                defaultVolume: 50, // In percentage 1-100;
                quality: 0, // Low: 0; Medium: 1; High: 2;
                platforms: [1, 2, 3, 4], //1: Spotify; 2: Youtube; 3: Soundcloud; 4: Radio
                distort: false,
                availableChannels: [] 
            },
            tickets: {
                status: true,
                all_tickets: []
            },
            auto_moderator: {
                status: false,
                systems: {
                    spam: {
                        status: false,
                        ignore: {
                            channels: [],
                            roles: []
                        }
                    }
                }
            }
        }
    }
});

export = model("guild", GuildSchema);