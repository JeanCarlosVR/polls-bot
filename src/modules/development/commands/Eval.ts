import { MyClient } from '../../../framework/Client';
import Command from '../../../framework/structures/Command';
import { inspect } from 'util';

export default class extends Command {
    public constructor(client: typeof MyClient) {
        super(client, {
            name: "eval",
            description: null,
            category: "development",
            linked_service: null,
            aliases: ["e"],
            available: true,
            premium: false,
            development: true,
            usage: {
                parameters: ["[any]"]
            },
            permissions: [],
            userPermissions: [],
            cooldown: {
                default: 0,
                premium: 0,
                development: 0
            },
            helper: []
        });
    }

    public async execute(args: string[]): Promise<MessageChannel | boolean> {

        if(this.message.author.id !== "525842461655040011") return;

        const clean = (text: string) => {
            if (typeof(text) === "string"){ 
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            } else {
                return text;
            }
        }

        try {
            let entry = args.join(" ");
            let output = await eval(entry);
        
            if (typeof output !== "string"){
                output = await inspect(output, { depth: 0 });
            }

            if(clean(output).length > 6000){
                console.log(clean(output));
                output = `Exceded Embed Limits: Check Console. (${clean(output).length} Characters)`
            }

            if(["this.client.token", "client.token", "process"].includes(entry.toLowerCase())){
                entry = "Me gusta free fire 🥵🤑"
                output = `No me sorprende.`
            }

            this.send({
                author: {
                    name: "Evaluation (Successfully)",
                    icon_url: this.client.user.avatarURL
                },
                fields: [
                    {
                    name: "Input",
                    value: `\`\`\`js\n${entry}\n\`\`\``,
                    inline: true
                    }
                ],
                description: `**Output** \n\`\`\`js\n${clean(output)}\n\`\`\``
            })
        } catch (err) {
            this.send({
                author: {
                    name: "Evaluation (ERROR)",
                    icon_url: this.client.user.avatarURL
                },
                fields: [
                    {
                        name: "Output",
                        value: `\`\`\`xl\n${clean(err)}\n\`\`\``,
                        inline: true
                    }
                ]
            });
        }

        return true;
    }
}