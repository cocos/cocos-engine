import { CCAudioBufferManager } from '../../base';
import { DomAudioBuffer } from './dom-audio-buffer';

export class DomAudioBufferManager extends CCAudioBufferManager {
    loadBuffer (url: string): Promise<DomAudioBuffer> {
        return new Promise<DomAudioBuffer>((resolve, reject) => {
            try {
                const buffer = new DomAudioBuffer(url);
                this.addCache(url, buffer);
                resolve(buffer);
            } catch {
                reject();
            }
        });
    }
}
