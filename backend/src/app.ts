import { DeskbuddyServer } from "./server";
const PORT = 3000;

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