export { AudioClip } from './assets/clip';
import './audio-downloader';

import { AudioSource } from './audio-source';
import { legacyCC } from '../core/global-exports';
import { ccclass } from '../core/data/class-decorator';
import { warnID } from '../core/platform/debug';

export { AudioSource };
legacyCC.AudioSource = AudioSource;

@ccclass('cc.AudioSourceComponent')
export class AudioSourceComponent extends AudioSource {
    constructor () {
        warnID(5400, 'AudioSourceComponent', 'AudioSource');
        super();
    }
}