import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import decodeAudio from 'audio-decode';

export const generateSpectrumFrames = async (id) => {
  await new Promise((resolve, reject) => {
    ffmpeg(`output/a/${id}.mp3`)
      .audioFilters('lowpass=f=100')
      .on('error', reject)
      .on('end', resolve)
      .save(`output/a/${id}-filt.mp3`);
  });

  let buffer = fs.readFileSync(`output/a/${id}-filt.mp3`);

  let audioBuffer = await decodeAudio(buffer);

  let totalFrames = Math.floor(30 * audioBuffer.duration);

  let frames = [];

  for (let x = 0; x < totalFrames; x++) {
    let avarage = audioBuffer._channelData[0]
      .slice(
        Math.floor((x * audioBuffer.length) / totalFrames),
        Math.floor(((x + 1) * audioBuffer.length) / totalFrames)
      )
      .reduce((a, b) => Math.abs(a + b)); /* / totalFrames */
    frames.push(avarage);
  }

  fs.unlinkSync(`output/a/${id}-filt.mp3`);

  return { frames, duration: audioBuffer.duration };
};
