import { Client } from 'moyai-lib';

interface Options {
    name: string | null
    description: string | null
    service: string
    disabled: boolean
}

export default abstract class ServiceEvent {

    public client: any;
    public data: any;
    
    public constructor(client: Client, options: Options) {
        this.client = client;
        this.data = {
            name: options.name || null,
            description: options.description || null,
            service: options.service || null,
            disabled: options.disabled || true
        }
    }
}