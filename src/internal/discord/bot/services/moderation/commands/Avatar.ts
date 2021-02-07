import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "avatar",
            description: "Show the avatar of any user.",
            service: "moderation",
            aliases: ["av", "profile"],
            usage: null,
            cooldown: {
                default: 2000,
                premium: 1000
            },
            disabled: true,
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

        return this.send({
            image: {
                url: `https://cdn.discord.com/avatars/${_user.id}/${_user.avatar}.png?size=2048`
            }
        });
    }
}