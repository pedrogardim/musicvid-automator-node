import fs from 'fs';
import dotenv from 'dotenv';
import scdl from 'soundcloud-downloader';

import { webSocket } from '../app.js';

dotenv.config();

export const download = async (url, id) =>
  new Promise((resolve, reject) => {
    console.log('A > Starting download → ' + id);
    webSocket.send(JSON.stringify({ type: 'downloadStart', id }));
    scdl.default.download(url).then((stream) =>
      stream
        .pipe(fs.createWriteStream(`output/a/${id}.mp3`))
        .on('error', (e) => {
          console.log(e);
          reject();
        })
        .on('finish', () => {
          console.log('A > Download finished ✅ → ' + id);
          webSocket.send(JSON.stringify({ type: 'downloadFinish', id }));
          resolve();
        })
    );
  });
