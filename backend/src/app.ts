import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello DeskBuddy!');
});

app.listen(PORT, () => {
  return console.log(`Server is listening on ${PORT}`);
});