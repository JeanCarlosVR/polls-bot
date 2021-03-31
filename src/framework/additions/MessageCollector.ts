import events from "events";
import { Channel } from 'jean-wrapper';

const collectors: any[] = [];
export class MessageCollector extends events.EventEmitter {

	public filter: Function;
	public channel: Channel;
	public ended: boolean;
	public options;
	public collected: any;

	public constructor(channel: Channel, filter: Function, options: { time: number, maxMatches: number }) {
		super();
		this.filter = filter;
		this.channel = channel;
		this.options = options;
		this.ended = false;
		this.collected = [];

		collectors.push(this);
		if(options.time) {
			setTimeout(() => this.stop("time"), options.time);
		}
	}

	public verify(message: any): boolean {
		if(this.channel.id !== message.channel.id) return false;
		if(this.filter(message)) {
			this.collected.push(message);

			this.emit("message", message);
			if(this.collected.length >= this.options.maxMatches) this.stop("maxMatches");
			return true;
		}

		return false;
	}

	public stop(reason: any): this {
		if(this.ended) return;
		this.ended = true;

		collectors.splice(collectors.indexOf(this), 1);
		this.emit("end", this.collected, reason);
	}
}

let listening = false;
export default (Lib: any) => {
	Lib.Channel.prototype.awaitMessages = function (filter: any, options: any) {
		if(!listening) {
			this.client.on("messageCreate", (message: any) => {
				for(const collector of collectors) collector.verify(message);
			});

			listening = true;
		}

		const collector = new MessageCollector(this, filter, options);
		return new Promise(resolve => collector.on("end", resolve));
	};
};