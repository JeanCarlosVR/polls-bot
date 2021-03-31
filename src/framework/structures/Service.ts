import { serviceProperties } from '../Types';

export default class Service {

    public help: serviceProperties;

    public constructor(props: serviceProperties) {
        this.help = {
            name: props.name || null,
            available: props.available || false,
            on_development: props.on_development || false,
            premium: props.premium || false,
            commands: props.commands || [],
            events: props.events || []
        }
    }
}