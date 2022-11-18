import { CCAudioBufferManager } from '../../base';
import { InnerctxAudioBuffer } from './innerctx-audio-buffer';

export class InnerctxAudioBufferManager extends CCAudioBufferManager {
    loadBuffer (url: string): Promise<InnerctxAudioBuffer> {
        return new Promise<InnerctxAudioBuffer>((resolve, reject) => {
            const cachedAudioBuffer = this.getCache(url);
            if (cachedAudioBuffer && cachedAudioBuffer instanceof InnerctxAudioBuffer) {
                // this.retainCache(url);
                resolve(cachedAudioBuffer);
            }
            try {
                const buffer = new InnerctxAudioBuffer(url);
                this.addCache(url, buffer);
                resolve(buffer);
            } catch {
                reject();
            }
        });
    }
}
