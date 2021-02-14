import express from 'express';
import bodyParser from 'body-parser';
import reservationRoute from './routes/reservation-routes';

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

  public start(): Promise<boolean> {
    return new Promise((fulfill, reject) => {
      try {
        this.handler = this.app.listen(this.port, () => {
          console.log(`Server is listening on ${this.port}`);
          fulfill(true);
        })
      } catch (err) {
        console.log(err);
        reject(err);
      }
    })
  }

  public stop(): Promise<boolean> {
    return new Promise((fulfill) => {
      this.handler.close(() => {
        fulfill(true);
      });
    })
  }
}
