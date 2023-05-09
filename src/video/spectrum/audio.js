import { spawn } from 'child_process';
// import ffmpeg from 'ffmpeg-static';
import { getSpectrum } from './dsp.js';

export const skipEvery = (skipIndex) => (element, index) =>
  index % skipIndex === 0;

export const getPeaks = (spectrums, prevPeaks) => {
  if (!prevPeaks) {
    return spectrums;
  }
  const resultPeaks = [];
  for (let i = 0; i < spectrums.length; i++) {
    const currValue = spectrums[i];
    const currPrevPeak = prevPeaks[i] || 0;
    resultPeaks.push(currValue > currPrevPeak ? currValue : currPrevPeak);
  }
  return resultPeaks;
};

export const correctPeaks = (spectrums, peaks) => {
  const resultSpectrum = [];
  for (let i = 0; i < spectrums.length; i++) {
    const value = spectrums[i];
    const peakValue = peaks[i] || 0;
    if (value < 3) {
      resultSpectrum.push(value / 3);
    } else {
      resultSpectrum.push(value / peakValue);
    }
  }
  return resultSpectrum;
};

export const smoothValues = (spectrums, prevSpectrums) => {
  if (!prevSpectrums) {
    return spectrums;
  }
  const resultSpectrum = [];
  for (let i = 0; i < spectrums.length; i++) {
    const currValue = spectrums[i];
    const currPrevValue = prevSpectrums[i] || 0;
    const avgValue = (currValue + currPrevValue) / 2;
    resultSpectrum.push(avgValue);
  }
  return resultSpectrum;
};

export const createSpectrumsProcessor = (busesCount) => {
  let prevAudioDataNormalized = [];
  let prevPeaks = [];
  let prevSpectrums = [];
  const skipFrameIndex = 2;

  return (frameIndex, parseAudioData) => {
    const isFrameSkiped = frameIndex && frameIndex % skipFrameIndex === 0;
    const audioDataNomrmalized = isFrameSkiped
      ? prevAudioDataNormalized
      : normalizeAudioData(parseAudioData());
    prevAudioDataNormalized = audioDataNomrmalized;

    const spectrum = getSpectrum(audioDataNomrmalized);
    // const skipIndex = Math.trunc(spectrum.length / busesCount);
    // const spectrumReduced = spectrum.filter(skipEvery(skipIndex));
    const spectrumReduced = spectrum;
    const peaks = getPeaks(spectrumReduced, prevPeaks);
    const correctedSpectrum = correctPeaks(spectrumReduced, peaks);
    const smoothSpectrum = smoothValues(correctedSpectrum, prevSpectrums);
    prevSpectrums = smoothSpectrum;
    prevPeaks = peaks;

    console.log(smoothSpectrum.length);

    return smoothSpectrum;
  };
};

export const bufferToUInt8 = (buffer, start, end) => {
  const numbers = [];
  for (let i = start; i < end; i += 1) {
    numbers.push(buffer.readUInt8(i));
  }
  return numbers;
};

// export const normalizeAudioData = (PCMData) =>
//   PCMData.map((num) => (num - 128) / 128);

export const normalizeAudioData = (PCMData) => PCMData;

export const spawnFfmpegAudioReader = (filename, format) => {
  //   const ffmpegProcess = spawn(ffmpeg.path, [
  const ffmpegProcess = spawn('ffmpeg', [
    '-i',
    filename,
    '-f',
    // format,
    'u8',
    '-ac',
    '1',
    '-',
  ]);
  return ffmpegProcess;
};

export const createAudioBuffer = (filename, format) =>
  new Promise((resolve, reject) => {
    let sampleRate;
    const sampleRateRegExp = /(\d+) Hz/m;
    const audioBuffers = [];
    const ffmpegAudioReader = spawnFfmpegAudioReader(filename, format);

    ffmpegAudioReader.stderr.on('data', function (data) {
      const match = data.toString().match(sampleRateRegExp);
      if (!sampleRate && match) {
        sampleRate = match[1];
      }
    });
    ffmpegAudioReader.stdout.on('data', function (chunkBuffer) {
      audioBuffers.push(chunkBuffer);
    });
    ffmpegAudioReader.stdout.on('end', function () {
      const audioBuffer = Buffer.concat(audioBuffers);
      resolve({ audioBuffer, sampleRate });
    });
  });
