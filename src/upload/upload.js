import fs from "fs";
import { google } from "googleapis";
import { authorize } from "./auth.js";
import { draw } from "../draw.js";
import { appState } from "../main.js";

// video category IDs for YouTube:
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28,
};

export const authUpload = (id, { title, description, tags }) =>
  new Promise((resolve, reject) => {
    //   assert(fs.existsSync(videoFilePath));
    //   assert(fs.existsSync(thumbFilePath));

    // Load client secrets from a local file.
    fs.readFile("client_secret.json", (err, content) => {
      if (err) {
        console.log("Error loading client secret file: " + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the YouTube API.
      authorize(JSON.parse(content), (auth) =>
        uploadVideo(auth, id, { title, description, tags })
          .then(resolve)
          .catch(reject)
      );
    });
  });

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const uploadVideo = (auth, id, { title, description, tags }) =>
  new Promise((resolve, reject) => {
    const service = google.youtube("v3");

    let uploadedBytes = 0;

    const filePath = `output/b/${id}.mp4`;
    const fileSize = fs.statSync(filePath).size;

    const media = {
      body: fs.createReadStream(filePath).on("data", (chunk) => {
        uploadedBytes += chunk.length;
        const progress = (uploadedBytes / fileSize) * 100;
        appState.songs[id].progress = Math.round(progress);
        draw();
      }),
    };

    service.videos.insert(
      {
        auth,
        part: "snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
            tags,
            categoryId: categoryIds.ScienceTechnology,
            defaultLanguage: "en",
            defaultAudioLanguage: "en",
          },
          status: {
            privacyStatus: "private",
          },
        },
        media,
      },
      (err, response) => {
        if (err) {
          console.log("The API returned an error: " + err);
          reject();
          return;
        }
        console.log(response.data);
        resolve();

        //  TODO: implement thumbnail
        //   console.log("Video uploaded. Uploading the thumbnail now.");
        //   service.thumbnails.set(
        //     {
        //       auth: auth,
        //       videoId: response.data.id,
        //       media: {
        //         body: fs.createReadStream(thumbFilePath),
        //       },
        //     },
        //     function (err, response) {
        //       if (err) {
        //         console.log("The API returned an error: " + err);
        //         return;
        //       }
        //       console.log(response.data);
        //     }
        //   );
      }
    );
  });
