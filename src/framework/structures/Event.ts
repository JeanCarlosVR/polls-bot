import { MyClient } from '../Client';
import cooldownUser from '../cooldown/User';
import { eventProperties } from '../Types';
import CommandStructure from './Command';

export default class EventStructure {

    protected client: typeof MyClient;
    protected help: eventProperties;
    protected cooldowns: cooldownUser;

    constructor(client: typeof MyClient, props: eventProperties) {
        this.client = client;
        this.help = {
            name: props.name || null,
            listener: props.listener || null,
            linked_service: props.linked_service || null
        }

        this.cooldowns = new cooldownUser(this.client);
    }

    public putCooldown(message: any, command: CommandStructure, timeout: number, options?: any) {
        return this.cooldowns.put(message, command, timeout, options);
    }

    public checkCooldown(message: any, command: CommandStructure) {
        return this.client.cooldowns.get(message.channel.guild.id, [command.help.name][message.author.id]);
    }
}