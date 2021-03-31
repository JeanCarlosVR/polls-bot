import Base from './sharder/structures/Base';
import Loader from './main/Loader';

export default class Rei extends Base {

    protected bot: any;
    protected clusterID: any;
    protected ipc: any;

    public constructor(client: any) {
        super(client);
        this.bot = client;
        this.bot.client.clusterID = this.clusterID;
        this.bot.client.ipc = this.ipc;
    }

    public async launch() {
        new Loader(this.bot.client).init();
    }
}