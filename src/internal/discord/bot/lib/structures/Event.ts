import { Client } from 'moyai-lib';

interface Options {
    name: string | null
    description: string | null
    service: string
    disabled: boolean
}

export default abstract class Event {

    public client: any;
    public data: any;
    
    public constructor(client: Client, options: Options) {
        this.client = client;
        this.data = {
            name: options.name || null,
            description: options.description || null,
            service: options.service || null,
            disabled: options.disabled || false
        }
    }

    public enable(): void {
        if(this.client.events.get(`${this.data.name}`).disabled === false) return;
        this.client.events.delete(`${this.data.name}`);
        this.data.disabled = false;
        this.client.events.set(`${this.data.name}`, this.data);
    }

    public disable(): void {
        if(!this.client.events.get(`${this.data.name}`).disabled === true) return;
        this.client.events.delete(`${this.data.name}`);
        this.data.disabled = true;
        this.client.events.set(`${this.data.name}`, this.data);
    }
}