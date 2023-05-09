import express from 'express';
import mongoose from 'mongoose';

import songRoute from './src/routes/songRoute.js';

mongoose.connect(
  'mongodb+srv://musancm:d5U8qF60i0fELzuH@cluster.c3u1exx.mongodb.net/?retryWrites=true&w=majority'
);

const app = express();
const port = 3000;

app.use('/song', songRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
