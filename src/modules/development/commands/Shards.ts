import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';
import Table from '../../../framework/utilities/Table';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "shards",
            description: "Look at the amount of Shards, and useful information that can help you, such as the latency of each of them.",
            category: "development",
            linked_service: null,
            aliases: ["shard"],
            available: true,
            premium: false,
            development: true,
            usage: {
                parameters: []
            },
            permissions: [],
            userPermissions: [],
            cooldown: {
                default: 5000,
                premium: 2500,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<boolean> {

        let _shards = [];

        for await(let shard of this.client.shards) {
            shard = shard[1];

            let _shard = shard.id;
            let _uptime = this.client.util.humanize(Date.now() - shard.client.startTime, { units: ["h", "m"] });
            let _latency = `${shard.latency}`;

            if(shard.id === this.guild.shard.id) _shard = `${shard.id} (You)`;

            if(shard.latency === Infinity) {
                _uptime =  "Offline";
                _latency = "?";
            }

            _shards.push({
                1: `${_shard}`,
                2: `${_latency}`,
                3: `${Object.keys(this.client.guildShardMap).filter(key => this.client.guildShardMap[key] === shard.id).length || 0}`,
                4: `${_uptime}`
            });
        }
        let myTable = await Table(["ID", "PING", "GUILDS", "UPTIME"], _shards, { maxSpace: 9, language: "css" });

        this.send(myTable);

        return true;
    }
}