import express from 'express';
import bodyParser from 'body-parser';
import reservationRoute from './routes/reservation-routes';
import DB from './config/db-handler';

export class DeskbuddyServer {
  private app;
  private port;
  private handler: any;

  constructor(port: number) {
    this.port = port;
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.get('/', (req, res) => {
      res.send('Hello DeskBuddy!');
    });

    this.app.use('/reservation', reservationRoute);
  }

  public getApp() {
    return this.app;
  }

  public start(): Promise<boolean> {
    return new Promise((fulfill, reject) => {
      const listenPromise = new Promise((listenFulfill, listenReject) => {
        try {
          this.handler = this.app.listen(this.port, () => {
            console.log(`Server is listening on ${this.port}`);
            listenFulfill(true);
          });
        } catch (err) {
          console.log(err);
          listenReject(err);
        }
      });
      const DBPromise = new Promise((dbFulfill, dbReject) => {
          DB.createCon().then(output => {
            if (output === true) {
              dbFulfill(true);
            } else {
              dbReject(output);
            }
          })
      });
      const promiseArray = [listenPromise, DBPromise];
      return Promise.all(promiseArray).then((allPromises) => {
        fulfill(true);
      }).catch((err: any) => {
        reject(err);
      });
    });
  }

  public stop(): Promise<boolean> {
    return new Promise((fulfill) => {
      const serverClose = new Promise((serverFulfill) => {
        this.handler.close(() => {
          console.log("Server stopped listening at: ", this.port)
          serverFulfill(true);
        });
      });
      const dbClose = new Promise((dbFulfill) => {
        DB.closeDB().then(() => {
          console.log("Database connection successfully terminated");
          dbFulfill(true);
        });
      });
      const promiseArray = [serverClose, dbClose];
      return Promise.all(promiseArray).then((allPromises) => {
        fulfill(true);
      });
    });
  }
}
