import { DeskbuddyServer } from "./server";
import dotenv from 'dotenv';
dotenv.config()
const PORT = Number(process.env.PORT || process.env.SERVER_PORT);


export class App {
    public initialize(port: number) {
        const server = new DeskbuddyServer(port);
        server.start().then((output) => {
            console.log("Application listening: " + output);
        }).catch(err => {
            console.log("Application error: " + err);
        });
    };
}
const application = new App();
application.initialize(PORT);