export async function drawSpectrum({ canvas }, frames, duration) {
  const maxLevel = Math.max(...frames);
  async function onRender(progress) {
    const context = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const frame = Math.floor(progress * duration * 30);
    const radius = (20 * frames[frame]) / maxLevel + 60;
    // console.log(frame, radius);

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'hsl(350, 100%, 37%)';
    context.fill();
    // context.lineWidth = 5;
    // context.strokeStyle = '#ffffff';
    // context.stroke();
  }

  function onClose() {
    // Cleanup if you initialized anything
  }

  return { onRender, onClose };
}

//hola
