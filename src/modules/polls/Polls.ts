import Module from '../../framework/structures/Module';

export default class Settings extends Module {
    public constructor(client: any) {
        super(client, {
            name: "Polls",
            premium: false,
            categories: ["Polls"]
        });
    }
}