import { readFile } from 'fs/promises';
import { writeJson } from './utils/json.js';
import { ws } from '../app.js';

export let task = {};

export const initSongProcess = async ({ link, title, author, genre }) => {
  console.log(link, title, author, genre);
  console.log('Starting...'.bold.green);
  ws.send(JSON.stringify({ id: title + author, type: 'starting' }));

  //load process.json
  const savedTask = await readFile(new URL('../task.json', import.meta.url));
  console.log('Task loaded'.bold.yellow);
  task = JSON.parse(savedTask);

  //start auto- saving
  setInterval(writeJson, 10000);
};
