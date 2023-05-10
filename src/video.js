import { spawn } from 'child_process';

export const generateVideo = async (id) => {
  console.log('B > Video starting → ' + id);

  const args = [
    '-y',
    '-t',
    '10',
    '-i',
    `output/a/${id}.mp3`,
    '-loop',
    '1',
    '-framerate',
    '30',
    '-i',
    'assets/pic.jpg',
    '-i',
    'assets/logo.png',
    '-filter_complex',
    '"' +
      '[0:a]aformat=channel_layouts=mono,showwaves=s=1280x720:mode=cline:r=30:colors=white[spectrum]' +
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

  ffmpeg.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  ffmpeg.stderr.on('data', function (data) {
    const message = data.toString();
    // console.log(message);
    // return;
    if (message.includes('frame=')) {
      console.log(message.slice(6, 10));
    }
    if (
      message.includes('cannot') ||
      message.includes('Error') ||
      message.includes('Invalid')
    )
      console.log('❌' + message);
  });

  await new Promise((resolve, reject) => {
    ffmpeg.on('error', (e) => {
      console.log(e), reject();
    });
    ffmpeg.on('exit', resolve);
  });

  console.log('B > Video finished ✅ → ' + id);
  console.log(
    'Took ' + new Date(Date.now() - startDate).toTimeString().slice(3, 8) + 's'
  );
};
