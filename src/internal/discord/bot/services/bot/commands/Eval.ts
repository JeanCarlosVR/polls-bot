import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";
import { inspect } from "util";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "eval",
            description: "You dont need this.",
            service: "bot",
            aliases: ["e"],
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
        if (this.message.author.id !== process.env.DEVELOPER) return;
        
        const clean = (text: any) => {
            if (typeof (text) === "string") {
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            } else {
                return text;
            }
        }
        try {
            let code = this.args.join(" ");
            let evaled = await eval(code);

            if (typeof evaled !== "string") {
                evaled = await inspect(evaled, { depth: 0 });
            }

            if (clean(evaled).length > 2040) {
                console.log(evaled);
                evaled = `Exceded Embed Limits: Check Console. (${clean(evaled).length} Characters)`
            }

            if (["process.env", "client.token", "token", "process.env"].includes(code.toLowerCase())) {
                evaled = `Evalution don't allowed.`
            }

            return this.send({
                    author: {
                        name: "Evaluation",
                        icon_url: this.client.user.avatarURL
                    },
                    fields: [
                        {
                            name: "Input",
                            value: `\`\`\`js\n${code}\n\`\`\``,
                            inline: true
                        }
                    ],
                    description: `**Output** \n\`\`\`js\n${clean(evaled)}\n\`\`\``,
                    color: this.guild.preferences.color
            });
        } catch (err) {
            return this.send({
                    author: {
                        name: "Evaluation (\`ERROR)\`",
                        icon_url: this.client.user.avatarURL
                    },
                    fields: [
                        {
                            name: "Output",
                            value: `\`\`\`xl\n${clean(err)}\n\`\`\``,
                            inline: true
                        }
                    ],
                    color: this.guild.preferences.color
            });
        }
    }
}