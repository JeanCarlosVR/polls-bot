import { MyClient } from '../Client';

import UsersCache from './types/Users';

export default class CacheManager {

    protected client: typeof MyClient;

    public constructor(client: typeof MyClient) {
        this.client = client;
        
        new UsersCache(this.client);    
    }
}