/**
 * @hidden
 */

export { AudioClip } from '../cocos/audio/assets/clip';
import '../cocos/audio/audio-downloader';

import { AudioSource } from '../cocos/audio/audio-source';
import { legacyCC } from '../cocos/core/global-exports';

export { AudioSource };
legacyCC.AudioSource = AudioSource;