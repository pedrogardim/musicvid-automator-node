import editly from 'editly';

//TODO draw spectrum after decoding audio
async function func({ canvas }) {
  async function onRender(progress) {
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40 * (1 + progress * 0.5);
    //frame = progress * duration * fps;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'hsl(350, 100%, 37%)';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#ffffff';
    context.stroke();
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}

export const generateVideo = async (id) => {
  const editSpec = {
    outPath: '../output/c/out.mp4',
    width: 1280,
    height: 720,
    fps: 30,
    allowRemoteRequests: false,
    clips: [
      {
        duration: 20,
        layers: [
          { type: 'image', path: 'pic.png', zoomAmount: 0 },
          {
            type: 'title',
            text: 'Test',
            fontPath: 'fonts/urbanist.ttf',
            textColor: '#FF0000',
            zoomAmount: 0,
          },
          //   { type: 'canvas', func },
        ],
      },
    ],
    // clipsAudioVolume: 1,
    // outputVolume: 1,
    audioTracks: [
      {
        path: '../output/a/s88r_q7oufE.webm',
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
};
