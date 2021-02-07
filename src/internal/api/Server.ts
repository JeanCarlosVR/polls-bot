import { Client } from 'moyai-lib';
import Express from 'express';
import Session from 'express-session';
import Cors from 'cors';
import Helmet from 'helmet';

import RouterHandler from './handlers/Router';

import Logger from '../discord/bot/lib/utilities/Logger';

export default class Server {

    #server: Express.Application;
    #client: Client | any;

    constructor(client: Client | any) {
        this.#server = Express();
        this.#client = client;
        
        this.#server.use(Helmet());
        this.#server.use(Cors({
            origin: true,
            credentials: true
        }));
        this.#server.use(Session({
            secret: "cat-cookie",
            resave: false,
            saveUninitialized: false,
            cookie: {
                sameSite: false,
                httpOnly: false,
                maxAge: 86400000,
            }
        }));
        
        new RouterHandler(this.#server, this.#client);
    }

    public listen(): any {
        return this.#server.listen(process.env.PORT, () => {
            Logger.prototype.info("API", `API running on ${process.env.PORT}.`)
        });
    }
}