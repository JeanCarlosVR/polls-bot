import MoyaiLib from 'moyai-lib';
import fs from 'fs';
import Logger from '../../lib/utilities/Logger';

export default class AdditionHandler {
    public constructor(client) {
        // handler based on the bundle
        fs.readdirSync("./bundle/internal/discord/bot/lib/utilities/additions").map((dir: any) => {
            fs.readdirSync(`./bundle/internal/discord/bot/lib/utilities/additions/${dir}`).map((addition: any) => {
                let _addition = require(`../utilities/additions/${dir}/${addition}`);
                _addition.default(MoyaiLib);
            });
            
            Logger.prototype.load("Addition Handler", `All additions loaded from ${dir}`);
        });
    }
}