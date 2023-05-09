import { spawn } from 'child_process';

//FFMPEG

// export const generateVideo = async (id) => {
//   console.log('B > Video starting → '.yellow + id.magenta);

//   const args = [
//     '-y',
//     '-t',
//     '10',
//     '-i',
//     `output/a/${id}.mp3`,
//     '-loop',
//     '1',
//     '-framerate',
//     '30',
//     '-i',
//     'assets/pic.jpg',
//     '-i',
//     'assets/logo.png',
//     '-filter_complex',
//     '"' +
//       '[0:a]aformat=channel_layouts=mono,showwaves=s=1280x720:mode=cline:r=30:colors=white[spectrum]' +
//       ';' +
//       '[1:v]scale=1280:trunc(ow/a/2)*2[img]' +
//       ';' +
//       '[2:v]scale=490:-1[logo]' +
//       ';' +
//       '[img][spectrum]overlay=format=auto:x=(W-w)/2:y=(H-h)/2[background]' +
//       ';' +
//       '[background][logo]overlay=format=auto:x=(W-w)/2:y=(H-h)/2[outv]' +
//       '"',
//     '-map',
//     '"[outv]"',
//     '-map',
//     '0:a',
//     '-c:v',
//     'libx264',
//     '-c:a',
//     'aac',
//     '-shortest',
//     '-s',
//     '1280x720',
//     `output/b/${id}.mp4`,
//   ];

//   const startDate = Date.now();

//   const ffmpeg = spawn('ffmpeg', args, { shell: true });

//   ffmpeg.stdout.on('data', function (data) {
//     console.log('stdout: ' + data.toString());
//   });

//   ffmpeg.stderr.on('data', function (data) {
//     const message = data.toString();
//     // console.log(message);
//     // return;
//     if (message.includes('frame=')) console.log(message.green);
//     if (
//       message.includes('cannot') ||
//       message.includes('Error') ||
//       message.includes('Invalid')
//     )
//       console.log('❌' + message.red);
//   });

//   await new Promise((resolve, reject) => {
//     ffmpeg.on('error', (e) => {
//       console.log(e), reject();
//     });
//     ffmpeg.on('exit', resolve);
//   });

//   console.log('B > Video finished ✅ → '.underline.yellow + id.magenta);
//   console.log(
//     String(
//       'Took ' +
//         new Date(Date.now() - startDate).toTimeString().slice(3, 8) +
//         's'
//     ).italic.yellow
//   );
// };

import editly from 'editly';
import { drawSpectrum } from './utils/spectrum.js';
import { generateSpectrumFrames } from './utils/audio.js';

export const generateVideo = async (id) => {
  console.log('B > Video starting → '.yellow + id.magenta);

  const { frames, duration } = await generateSpectrumFrames(id);

  console.log(frames, duration);

  const editSpec = {
    outPath: `output/b/${id}.mp4`,
    width: 1280,
    height: 720,
    fps: 30,
    allowRemoteRequests: true,
    clips: [
      {
        duration: 10,
        // duration,
        layers: [
          { type: 'image', path: 'assets/pic.jpg', zoomAmount: 0 },
          // {
          //   type: 'title',
          //   text: 'Test',
          //   fontPath: 'assets/fonts/urbanist.ttf',
          //   textColor: '#FF0000',
          //   zoomAmount: 0,
          // },
          {
            type: 'canvas',
            func: ({ canvas }) => drawSpectrum({ canvas }, frames, duration),
          },
        ],
      },
    ],
    // clipsAudioVolume: 1,
    // outputVolume: 1,
    audioTracks: [
      {
        path: `output/a/${id}.mp3`,
        mixVolume: 1,
      },
    ],
    // audioNorm: {
    //   enable: false,
    //   gaussSize: 5,
    //   maxGain: 30,
    // },

    fast: false,
  };

  // See editSpec documentation
  await editly(editSpec);
  console.log('B > Video finished ✅ → '.underline.yellow + id.magenta);
};
