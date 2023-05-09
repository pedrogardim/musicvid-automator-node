import {
  bufferToUInt8,
  createAudioBuffer,
  createSpectrumsProcessor,
} from './audio.js';

export const generateFftFrames = async (filepath) => {
  const FPS = 30;

  const spectrumBusesCount = 8;

  const audioReader = await createAudioBuffer(filepath);
  const audioBuffer = audioReader.audioBuffer;
  const sampleRate = audioReader.sampleRate;

  const audioDuration = audioBuffer.length / sampleRate;
  const framesCount = Math.trunc(audioDuration * FPS);
  const audioDataStep = Math.trunc(audioBuffer.length / framesCount);

  const processSpectrum = createSpectrumsProcessor(spectrumBusesCount);

  const fttFrames = [];

  for (let i = 0; i < framesCount; i++) {
    const audioDataParser = () =>
      bufferToUInt8(
        audioBuffer,
        i * audioDataStep,
        i * audioDataStep + audioDataStep
      );
    const spectrum = processSpectrum(i, audioDataParser);
    fttFrames.push(spectrum);
  }

  return { fttFrames, audioDuration, framesCount };
};
