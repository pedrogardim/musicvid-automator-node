import { readFile } from "fs/promises";
import { downloadFromYT } from "./fetch.js";
import { generateVideo } from "./video.js";
import { draw } from "./draw.js";
import { getSCInfo } from "./utils/getSoundcloudInfo.js";
import { getYTInfo } from "./utils/getYTInfo.js";

export const appState = {
  isAddingSong: false,
  errorMessage: "",
  songs: {},
};

// export const initSongProcess = async ({ link, title, author, genre }) => {
export const initSongProcess = async (url) => {
  appState.errorMessage = "";

  if (!url.includes("youtube.com")) {
    appState.errorMessage = "Invalid YouTube URL!";
    draw();
    return;
  }

  appState.songs[url] = {
    title: "Loading title",
    stage: "gettingInfo",
  };

  draw();

  // const { id, title, author, genre } = await getSCInfo(soundcloudUrl);

  const { title, videoId } = await getYTInfo(url);

  delete appState.songs[url];

  if (appState.songs[videoId]) {
    appState.errorMessage = "This video is already being generated";
    draw();
    return;
  }

  appState.songs[videoId] = {
    title,
    stage: "downloadingAudio",
  };

  draw();

  await downloadFromYT(url, videoId);

  appState.songs[videoId].stage = "renderingVideo";
  draw();

  await generateVideo(videoId);
};
