import fs from 'fs';
import ytdl from 'ytdl-core';
import axios from 'axios';
import dotenv from 'dotenv';

import { task } from './setup.js';
import { processVideoTitle } from './utils/text.js';

dotenv.config();

const { YT_BASE_URL, YT_API_KEY } = process.env;

export const addVideosToDownloadCue = async (playlistId) => {
  console.log(
    '>> Adding videos to download cue from playlist: '.brightBlue +
      playlistId.brightCyan
  );
  task.current.id = playlistId;

  const maxItems = 20;
  const videosUrl = `${YT_BASE_URL}/playlistItems?part=snippet%2CcontentDetails&maxResults=${maxItems}&pageToken=${task.current.nextPageToken}&playlistId=${playlistId}&key=${YT_API_KEY}`;
  const playlistData = (await axios.get(videosUrl)).data;

  task.current.nextPageToken = playlistData.nextPageToken;

  playlistData.items.map((item) => {
    let videoId = item.contentDetails.videoId;
    task.items[videoId] = {
      id: videoId,
      title: processVideoTitle(item.snippet.title),
      channelTitle: item.snippet.videoOwnerChannelTitle,
      channelId: item.snippet.videoOwnerChannelId,
      thumbnail: item.snippet.thumbnails?.standard?.url,
      stage: 'to download',
    };
  });

  for (let item in playlistData.items) {
    await download(playlistData.items[item].contentDetails.videoId);
  }

  console.log(`${playlistData.items.length} items added`.brightBlue);
};

export const download = async (id) =>
  new Promise((resolve, reject) => {
    if (task.items[id].stage !== 'to download') return;
    console.log('A > Starting download → '.brightGreen + id.magenta);
    ytdl(id, { filter: 'audioonly', format: 'webm' })
      .pipe(fs.createWriteStream(`output/a/${id}.webm`))
      .on('error', (e) => {
        console.log(e);
        reject();
      })
      .on('finish', () => {
        console.log(
          'A > Download finished ✅ → '.underline.brightGreen + id.magenta
        );
        resolve();
      });
  });
