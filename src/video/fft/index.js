import fs from 'fs';
import decodeAudio from 'audio-decode';
import fftJs from 'fft-js';

const { fft, util: fftUtil, dft } = fftJs;

export const generateFftFrames = async (filepath) => {
  let audioBuffer = await decodeAudio(fs.readFileSync(filepath));
  const FPS = 30;
  const framesCount = Math.trunc(audioBuffer.duration * FPS);
  console.log('>>>>>>>' + framesCount);
  const audioDataStep = Math.trunc(audioBuffer.length / framesCount);

  const fttFrames = [];

  for (let i = 0; i < framesCount; i++) {
    const frameAudioBuffer = audioBuffer._channelData[0].slice(
      i * audioDataStep,
      i * audioDataStep + audioDataStep
    );

    const spectrum = getFrameFft(frameAudioBuffer, audioBuffer.sampleRate);
    fttFrames.push(spectrum);
  }
};

const getFrameFft = (arr, sampleRate) => {
  var phasors = dft(arr);

  var frequencies = fftUtil.fftFreq(phasors, sampleRate), // Sample rate and coef is just used for length, and frequency step
    magnitudes = fftUtil.fftMag(phasors);

  var both = frequencies.map((f, ix) => ({
    frequency: f,
    magnitude: magnitudes[ix],
  }));

  console.log(Math.max(...magnitudes));
};
