import Express, { Request, Response } from 'express';
import { Client } from 'moyai-lib';
import fetch from 'node-fetch';

export interface Guild {
    id: string | number
    name: string
    icon: string
    owner: boolean
    permissions: number
    features: Array<any>
    permissions_new: string
    joined: boolean
    memberCount: number
}

export interface Data {
    id: string | number
    username: string
    discriminator: number
    avatar: string
    sessionToken: string
    guilds: Guild
}

export default class AuthRouter {

    #server: Express.Application;
    #client: Client | any;

    #guilds: object;
    #authVersion: number;

    constructor(server: Express.Application, client: Client | any) {
        this.#server = server;
        this.#client = client;
        this.#guilds = new Object();
        this.#authVersion = 1;

        this.init();
    }

    public init(): void {
        this.#server.get("/", (req: Request, res: Response) => {
            return res.json({
                exited_code: 0,
                status: 200,
                message: `cookies for my cat`
            });
        });

        this.#server.get(`/api/v${this.#authVersion}/auth/login`, (req: Request, res: Response) => {
            return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.API_URL + process.env.CALLBACK_ROUTE)}&response_type=code&scope=guilds%20identify`)
        });

        this.#server.get(`/api/v${this.#authVersion}/auth/logout`, (req: Request | any, res: Response) => {
            req.session.destroy(null);
            return res.redirect(process.env.USER_CLIENT_URL)
        });

        this.#server.get(`/api/v${this.#authVersion}/auth/callback`, async (req: Request | any, res: Response) => {
            let _r = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    "client_id": process.env.CLIENT_ID,
                    "client_secret": process.env.CLIENT_SECRET_ID,
                    "grant_type": 'authorization_code',
                    "code": req.query.code,
                    'redirect_uri': `${process.env.API_URL}/api/v1/auth/callback`,
                    "scope": "identify" 
                })
            }).then((_res: any) => _res.json());

            if(_r.error && _r.error === "invalid_request") {
                return res.json({
                    exited_code: 1,
                    status: 500,
                    message: `${_r.error}`
                });
            }
            
            req.session.data = {
                access_token: _r["access_token"],
                refresh_token: _r["refresh_token"],
                expires_in: _r["expires_in"]
            }

            return res.redirect(`${process.env.USER_CLIENT_URL}/dashboard`);
        });

        this.#server.get(`/api/v${this.#authVersion}/auth/get/data`, async (req: Request | any, res: Response) => {
            if(req.session && req.session.data && !req.session.data.access_token) return res.status(401).json({
                exited_code: 1,
                code: 401,
                message: "Not Authenticated."
            });

            const _data = await this.resolveData(req);

            return res.json({
                exited_code: 0,
                code: 200,
                data: _data || null
            });
        });

        return;
    }

    private async resolveData(req: Request | any): Promise<Data> {
        if(!req.session || (req.session && !req.session.data || (req.session.data && !req.session.data.access_token))) return null;

        const _getUser = await fetch("https://discord.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${req.session.data.access_token}`
            }
        }).then((_res: any ) => _res.json());

        const user = await _getUser;
        if(!user.id) return null;

        if(!this.#guilds[user.id]){
            const _getGuilds = await fetch("https://discord.com/api/users/@me/guilds", {
                headers: {
                    "Authorization": `Bearer ${req.session.data.access_token}`
                }
            }).then((_res: any) => _res.json());

            this.#guilds[user.id] = _getGuilds || [];

            setTimeout((): any => {
                return delete this.#guilds[user.id];
            }, 60000);
        }

        return <Data>{
            id: user.id || null,
            username: user.username || null,
            discriminator: user.discriminator || null,
            avatar: user.avatar || null,
            locale: user.locale || null,
            sessionToken: req.session.data.access_token || null,
            guilds: this.#guilds[user.id].map((guild: Guild): Guild => {
                let _guild = this.#client.guilds.get(`${guild.id}`);
                return {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon,
                    owner: guild.owner,
                    permissions: guild.permissions,
                    features: guild.features,
                    permissions_new: guild.permissions_new,
                    joined: _guild ? true : false,
                    memberCount: _guild ? _guild.memberCount : null
                }
            }).filter((guild: Guild): Guild["id"] => guild.id) || []
        }
    }
}