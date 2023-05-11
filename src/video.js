import { spawn } from 'child_process';
import { webSocket } from '../app.js';

//for testing
// let webSocket = { send: () => {} };

export const generateVideo = async (id) => {
  console.log('B > Video starting → ' + id);

  // let duration;
  let duration = 10;
  let FPS = 30;

  const args = [
    '-y',
    ...(duration ? ['-t', duration] : []),
    '-i',
    `output/a/${id}.mp3`,
    '-loop',
    '1',
    '-framerate',
    FPS,
    '-i',
    'assets/pic.jpg',
    '-i',
    'assets/logo.png',
    '-filter_complex',
    '"' +
      `[0:a]aformat=channel_layouts=mono,showwaves=s=1280x720:mode=cline:r=${FPS}:colors=white[spectrum]` +
      ';' +
      '[1:v]scale=1280:trunc(ow/a/2)*2[img]' +
      ';' +
      '[2:v]scale=490:-1[logo]' +
      ';' +
      '[img][spectrum]overlay=format=auto:x=(W-w)/2:y=(H-h)/2[background]' +
      ';' +
      '[background][logo]overlay=format=auto:x=(W-w)/2:y=(H-h)/2[outv]' +
      '"',
    '-map',
    '"[outv]"',
    '-map',
    '0:a',
    '-c:v',
    'libx264',
    '-c:a',
    'aac',
    '-shortest',
    '-s',
    '1280x720',
    `output/b/${id}.mp4`,
  ];

  const startDate = Date.now();

  const ffmpeg = spawn('ffmpeg', args, { shell: true });

  let totalFrames;

  ffmpeg.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  ffmpeg.stderr.on('data', function (data) {
    const message = data.toString();

    // return;

    if (message.includes('Duration: ') && !totalFrames) {
      let i = message.indexOf('Duration: ') + 10;
      let time = message.slice(i, i + 8);
      let seconds =
        duration || new Date('1970-01-01T' + time + 'Z').getTime() / 1000;
      totalFrames = seconds * FPS;
    }
    if (message.includes('frame=')) {
      const currentFrame = parseInt(message.slice(6, 11));
      const prog = Math.floor((currentFrame * 100) / totalFrames);
      webSocket.send(JSON.stringify({ type: 'videoProgress', prog, id }));
    }
    if (
      message.includes('cannot') ||
      message.includes('Error') ||
      message.includes('Invalid')
    ) {
      console.log('❌' + message);
      webSocket.send(message);
    }
  });

  await new Promise((resolve, reject) => {
    ffmpeg.on('error', (e) => {
      console.log(e), reject();
    });
    ffmpeg.on('exit', resolve);
  });

  console.log('B > Video finished ✅ → ' + id);
  webSocket.send(JSON.stringify({ type: 'videoCompleted', id }));

  console.log(
    'Took ' + new Date(Date.now() - startDate).toTimeString().slice(3, 8) + 's'
  );
};
