import { clearCallback, postCallback, shakeCallback } from './setup.js';
import { transform, multiplier } from '../utils/math.js';
import { spectrumDrawCallback } from './spectrum.js';

// let currentFrame = 0;

export async function drawSpectrum({ canvas }, frames, duration) {
  // currentFrame = 0;
  async function onRender(progress) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let currentFrame = Math.floor(10 * 30 * progress);

    let spectrum = transform(frames[currentFrame]);
    let level = Math.pow(multiplier(spectrum), 0.8);

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowBlur = 25;

    // clearCallback(canvas);
    shakeCallback({ canvas, ctx, level });

    //

    spectrumDrawCallback({ canvas, ctx, spectrum, level });

    //

    postCallback({ canvas, ctx });

    currentFrame++;
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}
