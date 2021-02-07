import { RedisClient, print } from 'redis';

export default class Redis {

    public client: any; 

    public constructor() {
        return new RedisClient({});
    }
}