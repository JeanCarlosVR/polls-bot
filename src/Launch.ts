import DotEnv from "dotenv";
import Client from "./framework/Client";
DotEnv.config()

new Client(process.env.TOKEN);