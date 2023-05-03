import { generateVideo } from './src/edit.js';
import { addVideosToDownloadCue } from './src/fetch.js';
import { splitTracks } from './src/spleeter.js';

import { init } from './src/setup.js';

// generateVideo();
// fetchAllVideosFromChannel()

await init();
// addVideosToDownloadCue('PLn5WUujnvlppi1X8soscLXrXaQCaO5HTi');
splitTracks('2ZBtPf7FOoM');
