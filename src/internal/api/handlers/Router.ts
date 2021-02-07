import Express from 'express';
import { Client } from 'moyai-lib';
import { readdirSync } from 'fs';
import Logger from '../../discord/bot/lib/utilities/Logger';

export default class RouterHandler {
    constructor(server: Express.Application, client: Client | any) {
        Promise.all(readdirSync("./bundle/internal/api/routes").map((router: string): void => {
            return (new (require(`../routes/${router}`)).default(server, client));
        })).then(() => Logger.prototype.load("API", "All routers loaded."));
    }
}