import { MyClient } from '../../Client';
import Cache from '../../structures/Cache';

export default class UsersCache extends Cache {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        super(client, client.users, {
            interval: 1000 * 60 * 60 * 6,
            stopAfter: null,
            except: []
        });
    }
}