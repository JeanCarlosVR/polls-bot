import Service from '../framework/structures/Service';

export default class Polls extends Service {
    public constructor() {
        super({
            name: "polls",
            available: false,
            on_development: true,
            premium: false,
            commands: [],
            events: []
        });
    }
}