import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "purge",
            description: "Purge multiple messages from the actual channel.",
            service: "moderation",
            aliases: ["prg", "clear"],
            usage: null,
            cooldown: {
                default: 5000,
                premium: 1000
            },
            disabled: false,
            for_developers: false
        });
    }

    public async run() {
        let lines;
        if(!this.args[0]) {
            return this.send({
                description: `Need to provide some number of messages to be able to delete them, be careful that these do not exceed 1000, and are not less than 2.`
            });
        }

        lines = parseFloat(this.args[0]);

        if(lines < 2 || lines > 1000) {
            return this.send({
                description: `I told you, the number of messages is in a range of 2 and 1000 messages.`
            });
        }
        
        try {
            let totalCleared = await this.clear(lines, null);
            let messageCountDeleted = await this.send({
                description: ` A total of \`${totalCleared}\` messages have been deleted in <#${this.message.channel.id}>.`
            });

            setTimeout(() => {
                return messageCountDeleted.delete(`(${this.client.user.username.toUpperCase()} auto deleted message system)`)
            }, 2000);
        } catch {
            return this.send({
                description: `An error has occurred, most likely you do not have permissions to perform this action. Make sure it has specifically the \`Manage Messages\` or \`Administrator\` permission`
            });
        }
    }

    public async clear(lines: number, filter: any): Promise<Number> {
        let count = 0;

        function assign(counting) {
            count += counting;
        }

        if(lines > 0 && lines < 251) {
            await this.client.purgeChannel(this.message.channel.id, lines).then((total: number) => assign(total));
        } else if(lines > 251 && lines < 501) {
            let lines2 = Math.floor(lines/2);
            await this.client.purgeChannel(this.message.channel.id, lines2).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines2).then((total: number) => assign(total));
        } else if(lines > 501 && lines < 751) {
            let lines3 = Math.floor(lines/3);
            await this.client.purgeChannel(this.message.channel.id, lines3).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines3).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines3).then((total: number) => assign(total));
        } else if(lines > 751 && lines < 1001) {
            let lines4 = Math.floor(lines/4);
            await this.client.purgeChannel(this.message.channel.id, lines4).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then((total: number) => assign(total));
            await this.client.purgeChannel(this.message.channel.id, lines4).then((total: number) => assign(total));
        } else {
            await this.client.purgeChannel(this.message.channel.id, lines).then((total: number) => assign(total));
        }

        return count;
    }
}