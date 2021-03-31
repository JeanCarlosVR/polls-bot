import Module from '../../framework/structures/Module';

export default class Settings extends Module {
    public constructor(client: any) {
        super(client, {
            name: "Vanity",
            premium: false,
            categories: ["vanity"]
        });
    }
}