import express from 'express';
import open from 'open';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { initSongProcess } from './src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

express()
  .use((req, res) => res.sendFile('view/index.html', { root: __dirname }))
  .listen(3000, () => {
    open('http://localhost:3000');
    console.log(`Listening on ${3000}`);
  });

const wss = new WebSocketServer({ port: 8080 });

export let ws;

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws = ws;

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    console.log(parsedData);
    if (parsedData.type === 'newSong') {
      initSongProcess({ ...parsedData, ws });
    }
  });
});
