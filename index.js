import { generateVideo } from './src/edit.js';

import { init } from './src/setup.js';
import { download } from './src/fetch.js';
import { createVideo } from './src/video/index.js';

// generateVideo();
// fetchAllVideosFromChannel()

await init();
// download(
//   'https://soundcloud.com/nassietheproducer/lil-uzi-i-just-wanna-rock-nxssie-remix-nxssiegang20-tiktok-moviee'
// );
// generateVideo('fenorofficialdj-cano-que-bonita-fer-gomez-rumbaton-mashup');

createVideo('3');
