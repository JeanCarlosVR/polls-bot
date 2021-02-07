import { Client } from 'moyai-lib';
import Event from '../Event';

interface _Service {
    name: string | null
    description: string | null
    premium: boolean
    disabled: boolean
    events: Event[] | any[]
}

export default abstract class Service {

    public client: any;
    public data: any;

    public constructor(client: Client, data: _Service) {
        this.client = client;
        this.data = {
            name: data.name || null,
            description: data.description || null,
            premium: data.premium || false,
            disabled: data.disabled || false,
            events: data.events || []
        }
    }

    public enable() {
        if(this.client.services.get(`${this.data.name}`).disabled === false) return;
        this.client.services.delete(`${this.data.name}`);
        this.data.disabled = false;
        this.client.services.set(`${this.data.name}`, this.data);
    }

    public disable() {
        if(!this.client.services.get(`${this.data.name}`).disabled === true) return;
        this.client.services.delete(`${this.data.name}`);
        this.data.disabled = true;
        this.client.services.set(`${this.data.name}`, this.data);
    }
}