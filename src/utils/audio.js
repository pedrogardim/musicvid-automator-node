import fs from 'fs';
import decodeAudio from 'audio-decode';

export const generateSpectrumFrames = async (id) => {
  let audioBuffer = await decodeAudio(fs.readFileSync(`output/a/${id}.mp3`));

  let totalFrames = Math.floor(30 * audioBuffer.duration);

  console.log(totalFrames);

  let frames = [];

  for (let x = 0; x < totalFrames; x++) {
    let avarage = audioBuffer._channelData[0]
      .slice(
        Math.floor((x * audioBuffer.length) / totalFrames),
        Math.floor(((x + 1) * audioBuffer.length) / totalFrames)
      )
      .reduce((a, b) => Math.abs(a + b)); /* / totalFrames */
    console.log(avarage);
    frames.push(avarage);
  }

  frames = simpleMovingAverage(frames, 10);

  return { frames, duration: audioBuffer.duration };
};

function simpleMovingAverage(prices, window = 5) {
  if (!prices || prices.length < window) {
    return [];
  }
  let index = window - 1;
  const length = prices.length + 1;
  const simpleMovingAverages = [];
  while (++index < length) {
    const windowSlice = prices.slice(index - window, index);
    const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
    simpleMovingAverages.push(sum / window);
  }
  return simpleMovingAverages;
}
