import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "userinfo",
            description: "Show information about any user.",
            service: "moderation",
            aliases: ["ui", "u"],
            usage: null,
            cooldown: {
                default: 2000,
                premium: 1000
            },
            disabled: false,
            for_developers: false
        });
    }

    public async run() {

        let _embed: any = new Object();
        let _user;
        if (!this.args[0]) {
            _user = this.client.users.get(this.message.author.id);
            _embed.footer = {
                text: `You can provide an ID or mention a user to see their information.`
            }
        } else {

            _user = this.client.users.get(this.client.functions.getMemberID(this.args[0]));
            if (!_user) {
                return this.send({
                    description: `We couldn't find this user on all of Discord! Make sure you are talking about a real user.`
                });
            }
        }

        _embed.author = {
            name: `${this.message.member.username} information`,
            icon_url: `${_user.avatarURL}`
        }

        _embed.fields = [
            {
                name: `ID`,
                value: `${_user.id}`,
                inline: false
            },
            {
                name: `Username`,
                value: `${_user.username}`,
                inline: true
            },
            {
                name: `Discriminator`,
                value: `${_user.discriminator}`,
                inline: true
            },
            {
                name: `Bot`,
                value: `${_user.bot ? "Yes" : "No"}`,
                inline: false
            },
            {
                name: `Account Creation Date`,
                value: `${this.client.functions.date(_user.createdAt, 0)}`,
                inline: true
            },
            {
                name: `Avatar Sizes`,
                value: `[\`2048px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=2048) | [\`1024px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=1024) | [\`512px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=512) | [\`256px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=256) | [\`128px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=128) | [\`64px\`](https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.png?size=64)`
            }
        ]


        return this.send(_embed);
    }
}