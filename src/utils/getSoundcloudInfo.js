import fs from "fs";
import scdl from "soundcloud-downloader";

export const getSCInfo = async (url, id) => {
  try {
    const info = await scdl.default.getInfo(
      url,
      "uYFraMlJAAH8lgtb7EcvnLisXA9mbSYx"
    );
    const {
      permalink,
      title,
      user: { username },
      genre,
    } = info;
    return {
      id: permalink,
      title,
      author: username,
      genre:
        genre &&
        genre
          .match(/[A-Z][a-z]+|[0-9]+/g)
          .join(",")
          .toLowerCase(),
    };
  } catch (e) {
    // console.log(error);
    return {};
  }
};
