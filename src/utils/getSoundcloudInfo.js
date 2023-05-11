import fs from 'fs';
import scdl from 'soundcloud-downloader';

import { webSocket } from '../../app.js';

export const getSCInfo = async (url, id) => {
  const info = await scdl.default.getInfo(url);
  const {
    permalink,
    title,
    user: { username },
    genre,
  } = info;
  console.log(info);
  webSocket.send(
    JSON.stringify({
      type: 'songInfo',
      id: permalink,
      title,
      author: username,
      genre:
        genre &&
        genre
          .match(/[A-Z][a-z]+|[0-9]+/g)
          .join(',')
          .toLowerCase(),
    })
  );
};
