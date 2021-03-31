import { MyClient } from '../Client';
import humanize from 'humanize-duration';

export default class Functions {

    private client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
    }

    public date(timestamp: Date): string {
        if(!timestamp) throw new Error("Unknown timestamp.");

        let options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(timestamp).toLocaleString("en-US", options);
    }

    public humanize(timestamp: number, options?: any): any {
        if(!options) options = {};
        return (humanize(timestamp, {
            delimiter: ", ",
            round: true,
            conjunction: " and ",
            units: options.units || ['y', 'mo', 'w', 'd', 'h', 'm', 's']
        }));
    }

    public toString(): string {
        return `[Functions ${this.client.user.id}]`
    }
}