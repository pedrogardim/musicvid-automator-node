import { readFile } from 'fs/promises';
import { writeJson } from './utils/json.js';

export let task = {};

export const init = async () => {
  console.log('Starting...'.bold.green);

  //load process.json
  const savedTask = await readFile(new URL('../task.json', import.meta.url));
  console.log('Task loaded'.bold.yellow);
  task = JSON.parse(savedTask);

  //start auto- saving
  setInterval(writeJson, 10000);
};
