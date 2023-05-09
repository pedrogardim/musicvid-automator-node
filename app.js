import express from 'express';
import songRoute from './src/routes/songRoute.js';

const app = express();
const port = 8080;

app.use('/song', songRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
