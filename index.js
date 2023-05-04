import { generateVideo } from './src/edit.js';

import { init } from './src/setup.js';
import { download } from './src/fetch.js';

// generateVideo();
// fetchAllVideosFromChannel()

await init();
// download('https://soundcloud.com/thorpey/thorpey-rock-with-you-free-download');
generateVideo('fenorofficialdj-cano-que-bonita-fer-gomez-rumbaton-mashup');
