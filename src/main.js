import { readFile } from 'fs/promises';
import { webSocket } from '../app.js';
import { download } from './fetch.js';
import { generateVideo } from './video.js';

export const initSongProcess = async ({ link, title, author, genre }) => {
  const id = author + '_' + title;

  if (!link || !title) {
    webSocket.send('Invalid input');
    return;
  }
  if (!link.includes('soundcloud.com')) {
    webSocket.send('Invalid link');
    return;
  }
  console.log('Starting...', author + title);

  webSocket.send(
    JSON.stringify({
      type: 'init',
      title,
      author,
    })
  );

  await download(link, id);
  await generateVideo(id);
};
