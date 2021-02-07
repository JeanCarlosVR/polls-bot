import { Client } from 'moyai-lib';
import Command from "../../../lib/structures/Command";

export default class extends Command {
    public constructor(client: Client) {
        super(client, {
            name: "ban",
            description: "Ban a member from the server.",
            service: "moderation",
            aliases: [],
            usage: `<member> (reason)`,
            cooldown: {
                default: 2000,
                premium: 500,
            },
            disabled: true,
            for_developers: false
        });
    }

    public async run() {
        
        if(!this.message.channel.guild.me.permission.has("banMembers")){
            return this.send({
                  description: `I not have \`Ban Members\` permissions. Please re-invite me.`
            });
        }
      
        if (!(this.message.member.permission.has("banMembers"))) {
            return this.send({
                description: "You not have `Ban Members` permissions."
            });
        }

        if(!this.args[0]) {
            return this.send({
                description: `Oops apparently you are missing some arguments, which would be:\n- \`member\`\nUsage: \`${this.data.name} ${this.data.usage}\``
            });
        }

        let member: any = await this.client.getRESTGuildMember(this.message.channel.guild.id, this.client.functions.getMemberID(this.args[0]));
        if(!member) {
            return this.send({
                description: `Member not found on this server, try trying to mention it, provide its ID, or at least its name.`
            });
        }
      
        if(!member) {
            return this.send({
                  description: "I couldn't find this member in the current guild."
            });
        }
      
        if(this.message.author.id === member.id) {
            return this.send({
                description: "You cannot ban yourself."
            });
        }
      
        if(member.id === this.client.user.id) {
            return this.send({
                description: "I can't ban myself"
            });
        }
      
        if(!(this.message.member.id === this.message.channel.guild.ownerID || this.message.member.permission.has("administrator"))) {
            if (!this.message.member.highestRole.higherThan(member.highestRole)) {
                return this.send({
                    description: "You cannot ban a member with a higher role than yours."
                });
            }
      
            if (this.message.member.highestRole.position >= member.highestRole.position) {
                return this.send({
                    description: "You cannot ban a member with a higher or equal role than yours."
                });
            }
        }

        if(member.highestRole.higherThan(this.message.channel.guild.me.highestRole)) {
            return this.send({
                description: "My role is lower than that of this user, please put him on top of all the roles."
            });
        }
      
        if(member.highestRole.position === this.message.channel.guild.me.highestRole.position) {
            return this.send({
                description: "My role is equal than that of this user, please put him on top of all the roles."
            });
        }
      
        if(!member.punishable) {
            return this.send({
                description: "This member is not bannable."
            });
        }
      
        let reason = this.args.slice(1).join(" ");
        if(reason.length > 150) {
            return this.send({
                description: "This reason is so long."
            });
        }
        if(!reason) reason = "Misconduct";

        try {
            member.ban(7, reason);
        } catch {
            return this.send({
                description: `An unexpected error has occurred.`
            });
        }
      
        return this.send({
            fields: [
                {
                    name: `Moderator`,
                    value: `<@${this.message.author.id}>`,
                    inline: true
                },
                {
                    name: `Member`,
                    value: `<@${member.id}>`,
                    inline: true
                },
                {
                    name: `Reason`,
                    value: `${reason}`,
                    inline: true
                }
            ]
        });
    }
}