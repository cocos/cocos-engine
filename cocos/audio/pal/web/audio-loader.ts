import { audioBufferManager } from '../../impl/graph-based/audio-buffer-manager';
import { AudioInfo } from '../../type';
import { domAudioPool } from '../../impl/dom/audio-pool-dom';

class AudioLoader {
    load (url: string): Promise<AudioInfo> {
        return new Promise((resolve, reject) => {
            audioBufferManager.loadBuffer(url).then((buffer) => {
                resolve({ duration: buffer.duration });
            }).catch(() => {
                console.error(`small audio buffer load failed.`);
                reject();
            });
        });
    }
}
export const audioLoader: AudioLoader = new AudioLoader();
