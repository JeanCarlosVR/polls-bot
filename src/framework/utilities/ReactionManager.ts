import { EventEmitter} from 'events';

class reactionManager extends EventEmitter {

    protected client;
    protected filter;
    protected message;
    protected options: any;
    protected permanent;
    protected ended;
    protected collected: any;
    protected listener: any;

    constructor(message: any, filter: Function, permanent = false, options: Object) {
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

    private checkPreConditions(msg: any, emoji: any, userID: any) {
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

    public stopListening (reason: any) {
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