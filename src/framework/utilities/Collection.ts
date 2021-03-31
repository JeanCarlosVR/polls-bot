export default class Collection extends Map {

    public constructor() {
        super();
    }

    public find(func: Function) {
        for(const item of this.values()) {
            if(func(item)) {
                return item;
            }
        }
        return undefined;
    }

    public filter(func: Function) {
        const arr = [];
        for(const item of this.values()) {
            if(func(item)) {
                arr.push(item);
            }
        }
        return arr;
    }

    public map(func: Function) {
        const arr = [];
        for(const item of this.values()) {
            arr.push(func(item));
        }
        return arr;
    }

    public every(func: Function) {
        for(const item of this.values()) {
            if(!func(item)) {
                return false;
            }
        }
        return true;
    }

    public some(func: Function) {
        for(const item of this.values()) {
            if(func(item)) {
                return true;
            }
        }
        return false;
    }

    public purge(max: number) {
        let count = 0;
        for(let [key] of this.values()) {
            if(count >= max) break;
            count += 1;
            //@ts-ignore
            delete this.values()[key];
        }
        return true;
    }

    public toString() {
        return "[Collection]"
    }

    public toJSON() {
        const json = {};
        for(const item of this.values()) {
            //@ts-ignore
            json[item.id] = item;
        }
        return json;
    }
}