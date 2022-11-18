import { CCAudioBufferManager } from '../../base';
import { nativeDefaultContext } from './native-audio-context';

/**
 * This is a manager to manage the cache of audio buffer for web audio and dom audio.
 */
export class NativeAudioBufferManager extends CCAudioBufferManager {
    //
    public loadBuffer (url: string): Promise<AudioBuffer> { // NOLINT
        return new Promise((resolve, reject) => {
            const cachedAudioBuffer = this.getCache(url);
            if (cachedAudioBuffer) {
                // this.retainCache(url);
                resolve(cachedAudioBuffer);
            }

            // Register buffer from decode audio from url
            nativeDefaultContext.decodeAudioData(url).then((buffer: AudioBuffer) => {
                this.addCache(url, buffer);
                resolve(buffer);
            }).catch(() => {
                reject();
            });
        });
    }
}
