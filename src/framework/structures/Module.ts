import { MyClient } from '../Client';
import { moduleProperties } from '../Types';

export default class ModuleStructure {

    protected client: typeof MyClient;

    public help: moduleProperties;

    public constructor(client: typeof MyClient, props: moduleProperties) {

        this.client = client;

        this.help = {
            name: props.name,
            premium: props.premium,
            categories: props.categories
        }
    }
}