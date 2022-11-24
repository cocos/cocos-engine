import { AudioContextOptions } from './base';

import { AudioContext, nativeDefaultContext } from './native';
import { AudioBackend, AudioInfo } from './type';
export { audioBufferManager } from './native';

class AudioContextManager {
    public defaultContext: AudioContext;
    public createAudioContext (backend: AudioBackend, options?: AudioContextOptions): AudioContext {
        return new AudioContext(options);
    }
    public load (url: string):Promise<AudioInfo> {
        return new Promise<AudioInfo>((resolve, reject) => {
            nativeDefaultContext.decodeAudioData(url).then((buffer) => {
                    resolve({
                        duration: buffer.duration,
                        pcmHeader: null });
                }).catch(() => {
                    reject();
                });
            });
    }
    constructor () {
        this.defaultContext = nativeDefaultContext;
    }
}
export const audioContextManager = new AudioContextManager();
