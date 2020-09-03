export { AudioClip } from './assets/clip';
import './audio-downloader';

import { AudioSource } from './audio-source';
import { legacyCC } from '../core/global-exports';
import { js } from '../core/utils/js';

export { AudioSource };

export { AudioSource as AudioSourceComponent };
legacyCC.AudioSourceComponent = AudioSource;
js.setClassAlias(AudioSource, 'cc.AudioSourceComponent');
