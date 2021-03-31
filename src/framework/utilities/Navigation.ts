import { continuousListener } from './ReactionManager';
const client_color = 0x000000;

export class Navigation {

    protected message;
    protected page: any;
    protected embeds;
    protected firstEmbedID;
    protected options;
    protected reactions: any[];

    protected id;

    public constructor(message: any, embeds: any, firstEmbedID: number, options: any) {
        this.message = message;
        this.embeds = embeds;
        this.firstEmbedID = firstEmbedID;
        this.options = options;

        this.id = this.embeds[this.firstEmbedID].id;
        this.reactions = ["⏮", "⏪", "⏹️", "⏩", "⏭️", "ℹ"];
    }

    public async render(): Promise<void> {
        for(let embed of this.embeds) {
            embed.footer = {
                text: `Page ${embed.id + 1}/${this.embeds.length}`,
            }

            embed.color = this.message.channel.guild.preferences.color;
        }

        if(this.embeds.length > 1) {
            this.page = await this.message.channel.send({
                embed: {
                    description: `Loading...`,
                    color: this.message.channel.guild.preferences.color
                }
            });

            await this.LoadReactions();

            const reactionViewer = new continuousListener(this.page, (userID: string | number) => userID === this.message.author.id, false, { maxMatches: this.options.maxMatches, time: this.options.time, passedReactions: this.reactions });

            this.MainEvent(reactionViewer,this.message.channel.guild.preferences.color);
        } else {
            this.message.channel.send({ embed: this.embeds[0] });
        }
    }

    private async LoadReactions()  {
        for await(let emoji of this.reactions){
            await this.page.addReaction(emoji);
        }

        await this.page.edit({
            embed: this.embeds[this.firstEmbedID]
        });

        return true;
    }

    private MainEvent(reactionViewer: any, _color: any): void {
        reactionViewer.on("reacted", async (reaction: any) => {
            try {
                await this.page.removeReaction(reaction.emoji.name, reaction.userID);
                switch (reaction.emoji.name) {
                    case "⏩":
                        if((this.id + 1) >= (this.embeds.length)) return;
                        this.id += 1;

                        this.page.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏪":
                        if((this.id - 1) < 0) return;
                        this.id = this.id - 1;

                        this.page.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏮":
                        this.id = this.firstEmbedID;

                        this.page.edit({
                            embed: this.embeds[this.firstEmbedID]
                        }); 
                        break;
                    case "⏭️":
                        this.id = this.embeds.length - 1;

                        this.page.edit({
                            embed: this.embeds[this.id]
                        }); 
                        break;
                    case "⏹️":
                        this.page.delete();
                        break;
                    case "ℹ":
                        this.id = 0;
                        this.page.edit({
                            embed: {
                                description: `⏮ Go to first page.\n⏪ Turn a page back.\n⏹️ Stop pagination.\n⏩ Turn a page next.\n⏭️ Go to last page.\nℹ Show this page.`,
                                color: _color
                            },
                            footer: {
                                text: `Page help/${this.embeds.length}`
                            }
                        });
                }
            } catch {
                return;
            }
        });
    }

    public toJSON() {
        return {
            message: this.message,
            page: this.page,
            embeds: this.embeds,
            firstEmbedID: this.firstEmbedID,
            actualPageID: this.id,
            filters: {
                user: this.message.author.id,
                reactions: this.reactions
            }
        }
    }

    public toString() {
        return `[Pagination ${this.message.id}]`
    }
}