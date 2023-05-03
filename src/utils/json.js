import fs from 'fs';
import { readFile } from 'fs/promises';
import colors from 'colors';

colors.enable();

import { task } from '../setup.js';

export const writeJson = async () => {
  const savedTask = JSON.stringify(
    JSON.parse(await readFile(new URL('../../task.json', import.meta.url)))
  );

  const currentTask = JSON.stringify(task);

  if (savedTask !== currentTask) {
    fs.writeFile('task.json', currentTask, 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('task.json file saved'.green);
    });
  }
};
