import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

import Table from '../../../lib/utilities/Table';

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "ping",
            description: "Show latency of messages and connection between the bot with Discord API.",
            service: "bot",
            aliases: ["latency"],
            usage: null,
            cooldown: {
                default: 0,
                premium: 0,
            },
            disabled: false,
            for_developers: true
        });
    }

    public async run() {
        return this.send({
            description: `**Message** \`${this.message.timestamp - Date.now() || "Unavailable"}\`\n**Discord** \`${this.message.channel.guild.shard.latency}\``
        });
    }
}