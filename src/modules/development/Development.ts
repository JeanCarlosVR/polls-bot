import Module from '../../framework/structures/Module';

export default class Development extends Module {
    public constructor(client: any) {
        super(client, {
            name: "development",
            premium: false,
            categories: ["development"]
        });
    }
}