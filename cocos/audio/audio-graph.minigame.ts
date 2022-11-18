import { AudioContextOptions } from './base';

import { defaultInnerContext, InnerctxAudioBufferManager, InnerctxAudioContext } from './innerctx';
import { AudioBackend, AudioInfo } from './type';


class AudioContextManager {
    public defaultContext: InnerctxAudioContext;
    public createAudioContext (backend: AudioBackend, options?: AudioContextOptions): InnerctxAudioContext {
        return new InnerctxAudioContext(options);
    }
    public load (url: string):Promise<AudioInfo> {
        return new Promise<AudioInfo>((resolve, reject) => {
                defaultInnerContext.decodeAudioData(url).then((buffer) => {
                    resolve({
                        duration: buffer.duration,
                        pcmHeader: null });
                }).catch(() => {
                    reject();
                });
            });
    }
    constructor () {
        this.defaultContext = defaultInnerContext;
    }
}
export const audioContextManager = new AudioContextManager();
export const audioBufferManager = new InnerctxAudioBufferManager();
