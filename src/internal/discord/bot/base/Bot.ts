/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Jean Vides. All rights reserved.
 *  See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Base from "../lib/clustering/structures/Base";
import Load from "./loader/Loader";

export default class Bot extends Base {
    public constructor(bot: any, clusterID: any) {
        super({ bot, clusterID });
    }

    public launch() {
        new Load(this.bot, this.ipc, this.clusterID);
    }
}