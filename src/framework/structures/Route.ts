import { routeProperties } from '../Types';

export default class Route {

    public help: routeProperties;

    public constructor(props: routeProperties) {
        this.help = {
            name: props.name,
            routes: props.routes
        }
    }
}