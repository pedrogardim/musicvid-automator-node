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
