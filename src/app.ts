// lib/app.ts
import express from 'express';
import SocketIO from "./services/socketIo";

class App {
  private app: express.Application = express();
  private server: any = this.app.listen(3000);

  public async start() {
    console.log("App listening on port 3000!");
    await SocketIO.getInstance().connect(this.server);
    console.log("SocketIO is connected to the app!");
  }
}

new App().start();


