import express from 'express';
import bodyParser from 'body-parser';

const sql = require('./config/db-handler');

const app = express();
const PORT = 3000;

// Json body settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add your custom routes
let reservationRoute = require('./routes/reservation-routes');

app.get('/', (req, res) => {
  res.send('Hello DeskBuddy!');
});

app.use('/reservation', reservationRoute);

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});