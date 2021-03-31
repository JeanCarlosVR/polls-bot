import fs from 'fs';
import Logger from '../utilities/Logger';
import { MyClient } from '../Client';
import JeanWrapper from  'jean-wrapper'

export default class AdditionsManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public async Load() {
        await fs.readdirSync("./bundle/src/framework/additions/").map(async (dir) => {
            (await import(`../additions/${dir}`)).default(JeanWrapper);
            Logger.load("Handler Additions", `Loaded ${dir.toUpperCase().slice(0, dir.length -3)}`);
        });
    }
}