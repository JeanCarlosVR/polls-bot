/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const clientSchemaModel = new (require("mongoose")).Schema({
    id: {
        type: String,
        required: true,
        default: "741539390140055622"
    },
    data: {
        type: Object,
        required: true,
        default: {}
    },
});

export default (require("mongoose")).model("client", clientSchemaModel);