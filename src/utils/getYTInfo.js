import fs from "fs";
import ytdl from "ytdl-core";

export const getYTInfo = async (url, id) => {
  try {
    const info = await ytdl.getInfo(url);
    return info.videoDetails;
  } catch (e) {
    return e;
    return {};
  }
};
