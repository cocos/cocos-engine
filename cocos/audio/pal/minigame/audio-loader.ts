import { audioPool } from '../../impl/audio-context/audio-pool-ctx';
import { AudioInfo } from '../../type';

class AudioLoader {
    load (url: string): Promise<AudioInfo> {
        return new Promise((resolve, reject) => {
            audioPool.loadCtx(url).then((info) => {
                resolve({ duration: info.duration });
            }).catch(() => {
                console.error(`small audio buffer load failed.`);
                reject();
            });
        });
    }
}
export const audioLoader: AudioLoader = new AudioLoader();
