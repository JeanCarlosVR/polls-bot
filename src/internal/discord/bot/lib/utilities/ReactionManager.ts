import EventEmitter = require('events');

export default class reactionManager extends EventEmitter.EventEmitter {

    public client: any;
    public filter: any;
    public message: any;
    public options: any;
    public permanent: any;
    public ended: any;
    public collected: any;
    public listener: any;

    public constructor(message: any, filter: any, permanent = false, options: Object) {
        super();

        this.client     = (message.channel.guild) ? message.channel.guild.shard.client : message.channel.client;
        this.filter     = filter;
        this.message    = message;
        this.options    = options;
        this.permanent  = permanent;
        this.ended      = false;
        this.collected  = [];
        this.listener   = (msg: any, emoji: any, userID: any) => this.checkPreConditions(msg, emoji, userID);

        this.client.on('messageReactionAdd', this.listener);

        if (this.options.time) {
            setTimeout(() => this.stopListening('time'), this.options.time);
        }
    }

    public checkPreConditions(msg: any, emoji: any, userID: any) {
        if (this.message.id !== msg.id) {
            return false;
        }

        if(this.options.passedReactions && !this.options.passedReactions.includes(emoji.name)) {
            return false;
        }

        if (this.filter(userID)) {
            this.collected.push({ msg, emoji, userID });
            this.emit('reacted', { msg, emoji, userID });

            if (this.collected.length >= this.options.maxMatches) {
                this.stopListening('maxMatches');
                return true;
            }
        }

        return false;
    }

    public stopListening (reason: string | any) {
        if (this.ended) {
            return;
        }

        this.ended = true;

        if (!this.permanent) {
            this.client.removeListener('messageReactionAdd', this.listener);
        }
        
        this.emit('end', this.collected, reason);
    }

    public get getReacted() {
        return this.collected;
    }
}

export const continuousListener = reactionManager;
export const bulkListener = (message: any, filter: any, options: any) => {
    const bulkCollector = new reactionManager(message, filter, false, options);

    return new Promise((resolve) => {
        bulkCollector.on('end', resolve);
    });
}