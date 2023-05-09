import { Config } from './config.js';

const WAVE_DURATION = Math.PI / 8;
let waveFrameX = 0;
let waveFrameY = 0;
let waveSpeedX = 1;
let waveSpeedY = 1;
let waveAmplitudeX = 1;
let waveAmplitudeY = 1;
let trigX = Math.round(Math.random());
let trigY = Math.round(Math.random());

export let clearCallback = function ({ canvas, ctx }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export let shakeCallback = function ({ canvas, ctx, level }) {
  ctx.save();

  let step = Config.maxShakeIntensity * level;
  waveFrameX += step * waveSpeedX;
  if (waveFrameX > WAVE_DURATION) {
    waveFrameX = 0;
    waveAmplitudeX = random(Config.minShakeScalar, Config.maxShakeScalar);
    waveSpeedX =
      random(Config.minShakeScalar, Config.maxShakeScalar) *
      (Math.random() < 0.5 ? -1 : 1);
    trigX = Math.round(Math.random());
  }
  waveFrameY += step * waveSpeedY;
  if (waveFrameY > WAVE_DURATION) {
    waveFrameY = 0;
    waveAmplitudeY = random(Config.minShakeScalar, Config.maxShakeScalar);
    waveSpeedY =
      random(Config.minShakeScalar, Config.maxShakeScalar) *
      (Math.random() < 0.5 ? -1 : 1);
    trigY = Math.round(Math.random());
  }

  let trigFuncX = trigX == 0 ? Math.cos : Math.sin;
  let trigFuncY = trigY == 0 ? Math.cos : Math.sin;

  let dx =
    trigFuncX(waveFrameX) *
    Config.maxShakeDisplacement *
    waveAmplitudeX *
    level;
  let dy =
    trigFuncY(waveFrameY) *
    Config.maxShakeDisplacement *
    waveAmplitudeY *
    level;

  ctx.translate(dx, dy);
};

export let postCallback = function ({ canvas, ctx }) {
  ctx.restore();
};

const random = function (min, max) {
  return Math.random() * (max - min) + min;
};
