import { exec } from 'child_process';

export const splitTracks = (id) =>
  new Promise((resolve, reject) => {
    console.log('B > Spliting tracks → '.cyan + id.magenta);
    exec(
      `docker run -v $(pwd)/output:/output deezer/spleeter:3.6-5stems separate -p spleeter:5stems-16kHz -o /output/b /output/a/${id}.webm`,
      (err) => {
        if (err) {
          console.log(`❌ Spleeter Error (${id}):`.italic.red);
          console.log(err.message);
          reject();
          return;
        }
      }
    ).on('exit', () => {
      console.log('B > Tracks splitted ✅ → '.underline.cyan + id.magenta);
      resolve();
    });
  });
