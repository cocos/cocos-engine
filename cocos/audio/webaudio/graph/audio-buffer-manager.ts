import { CCAudioBufferManager, CCAudioContext } from '../../base';
import { waDefaultContext } from './wa-audio-context';
/**
 * This is a manager to manage the cache of audio buffer for web audio and dom audio.
 */
export class WAAudioBufferManager extends CCAudioBufferManager {
    public loadBuffer (url: string, ctx?: CCAudioContext): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            const cachedbuffer = this.getCache(url);
            if (cachedbuffer) {
                resolve(cachedbuffer);
            }
            (ctx || waDefaultContext).decodeAudioData(url).then((buffer) => {
                this.addCache(url, buffer);
                resolve(buffer);
            }).catch(reject);
        });
    }
}
export const waAudioBufferManager = new WAAudioBufferManager();
