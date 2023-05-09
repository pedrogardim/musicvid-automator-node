// import { generateFftFrames } from './spectrum/index.js';
import { generateFftFrames } from './fft/index.js';
import { drawSpectrum } from './canvas/index.js';
import editly from 'editly';

export const createVideo = async (id) => {
  console.log('B > Video starting → '.yellow + id.magenta);

  const { fttFrames, audioDuration, framesCount } = await generateFftFrames(
    `output/a/${id}.mp3`
  );
  return;
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
            func: ({ canvas }) =>
              drawSpectrum({ canvas }, fttFrames, audioDuration),
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
