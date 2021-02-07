/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const guildSchemaModel = new (require("mongoose")).Schema({
    id: {
        type: String,
        require: true,
        unique: true
    },
    preferences: {
        type: Object,
        require: true,
        default: {
            prefix: "!",
            lang: 0,
            private: false,
            premium: false,
            canary: false,
            ignored: false,
            color: 0xF1F1F1
        }
    }
});

export = (require("mongoose")).model("guild", guildSchemaModel);