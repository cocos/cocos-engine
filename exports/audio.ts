/**
 * @hidden
 */

export { AudioClip } from '../cocos/audio/assets/clip';
import '../cocos/audio/audio-downloader';

import { AudioSourceComponent } from '../cocos/audio/audio-source-component';
import { legacyCC } from '../cocos/core/global-exports';

export { AudioSourceComponent };
legacyCC.AudioSourceComponent = AudioSourceComponent;