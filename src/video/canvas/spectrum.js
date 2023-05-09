import { Config } from './config.js';

let spectrumCache = Array();

const maxBufferSize = Math.max.apply(null, Config.delays);

export const spectrumDrawCallback = function ({
  canvas,
  ctx,
  spectrum,
  level,
}) {
  if (spectrumCache.length >= maxBufferSize) {
    spectrumCache.shift();
  }
  spectrumCache.push(spectrum);

  let minSize = Config.minEmblemSize;
  let maxSize = Config.maxEmblemSize;
  let scalar = level * (maxSize - minSize) + minSize;

  let curRad = scalar / 2;

  for (let s = Config.spectrumCount - 1; s >= 0; s--) {
    let curSpectrum = smooth(
      spectrumCache[Math.max(spectrumCache.length - Config.delays[s] - 1, 0)],
      Config.smoothMargins[s]
    );

    let points = [];

    ctx.fillStyle = Config.colors[s];
    ctx.shadowColor = Config.colors[s];

    let len = curSpectrum.length;
    for (let i = 0; i < len; i++) {
      let t = Math.PI * (i / (len - 1)) - Math.PI / 2;
      let r =
        curRad +
        Math.pow(
          curSpectrum[i] * Config.spectrumHeightScalar * 1,
          // Util.getResolutionMultiplier(),
          Config.exponents[s]
        );
      let x = r * Math.cos(t);
      let y = r * Math.sin(t);
      points.push({ x: x, y: y });
    }

    drawPoints({ canvas, ctx, points });
  }
};

let drawPoints = function ({ canvas, ctx, points }) {
  if (points.length == 0) {
    return;
  }

  ctx.beginPath();

  let halfWidth = canvas.width / 2;
  let halfHeight = canvas.height / 2;

  for (let neg = 0; neg <= 1; neg++) {
    let xMult = neg ? -1 : 1;

    ctx.moveTo(halfWidth, points[0].y + halfHeight);

    let len = points.length;
    for (let i = 1; i < len - 2; i++) {
      let c = (xMult * (points[i].x + points[i + 1].x)) / 2 + halfWidth;
      let d = (points[i].y + points[i + 1].y) / 2 + halfHeight;
      ctx.quadraticCurveTo(
        xMult * points[i].x + halfWidth,
        points[i].y + halfHeight,
        c,
        d
      );
    }
    ctx.quadraticCurveTo(
      xMult * points[len - 2].x + halfWidth + neg * 2,
      points[len - 2].y + halfHeight,
      xMult * points[len - 1].x + halfWidth,
      points[len - 1].y + halfHeight
    );
  }
  ctx.fill();
};

let smooth = function (points, margin) {
  if (margin == 0) {
    return points;
  }

  let newArr = Array();
  for (let i = 0; i < points.length; i++) {
    let sum = 0;
    let denom = 0;
    for (let j = 0; j <= margin; j++) {
      if (i - j < 0 || i + j > points.length - 1) {
        break;
      }
      sum += points[i - j] + points[i + j];
      denom += (margin - j + 1) * 2;
    }
    newArr[i] = sum / denom;
  }
  return newArr;
};
