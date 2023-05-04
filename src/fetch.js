import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

import scdl from 'soundcloud-downloader';

import { task } from './setup.js';
import { idFromUrl } from './utils/text.js';
import { generateVideo } from './edit.js';

dotenv.config();

export const download = async (url) =>
  new Promise((resolve, reject) => {
    const id = idFromUrl(url);
    console.log('A > Starting download → '.brightGreen + id.magenta);
    scdl.default.download(url).then((stream) =>
      stream
        .pipe(fs.createWriteStream(`output/a/${id}.mp3`))
        .on('error', (e) => {
          console.log(e);
          reject();
        })
        .on('finish', () => {
          console.log(
            'A > Download finished ✅ → '.underline.brightGreen + id.magenta
          );
          generateVideo(id);
          resolve();
        })
    );
  });
