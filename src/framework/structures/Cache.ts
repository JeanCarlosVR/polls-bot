import { MyClient } from '../Client';
import Collection from '../utilities/Collection';
import { cacheOptions } from '../Types';

export default class CacheStructure {

    protected client: typeof MyClient;
    protected cache: Collection;
    protected options: cacheOptions;

    private _stop: any;

    public constructor(client: typeof MyClient, cache: Collection, options?: any) {
        this.client = client;
        this.cache = cache;

        if(options) options = new Object;
        this.options = {
            interval: options.interval || (1000 * 60 * 60 * 6),
            except: options.except || []
        }

        setInterval(() => {
            for(let [key] of this.cache) {
                if(this._stop === true) break;
                if(!this.options.except.includes(key)) {
                    cache.delete(key);
                }
            }
        }, options.interval);
    }

    public stop() {
        this._stop = true;
    }
}