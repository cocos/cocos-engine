import { CCAudioBuffer, CCAudioContext } from './native-audio-context';

declare const jsb: any;

interface CachedAudioBufferData {
    usedCount: number,
    audioBuffer: CCAudioBuffer,
}
/**
 * This is a manager to manage the cache of audio buffer for web audio and dom audio.
 */
export class CCAudioBufferManager {
    //
    private _audioBufferDataMap: Map<string, CachedAudioBufferData> = new Map();
    public addCache (url: string, audioBuffer: CCAudioBuffer) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (audioBufferData) {
            console.warn(`Audio buffer ${url} has been cached`);
            return;
        }
        this._audioBufferDataMap.set(url, {
            usedCount: 1,
            audioBuffer,
        });
        // this._audioBufferDataMap[url] = {
        //     usedCount: 1,
        //     audioBuffer,
        // };
    }

    public retainCache (url: string) {
        const audioBufferData = this._audioBufferDataMap.get(url);
        if (!audioBufferData) {
            console.warn(`Audio buffer cache ${url} has not been added.`);
            return;
        }
        audioBufferData.usedCount++;
    }

    public getCache (url: string): CCAudioBuffer | undefined {
        const audioBufferData = this._audioBufferDataMap.get(url);
        if (!audioBufferData) {
            return undefined;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return audioBufferData.audioBuffer;
        }
    }

    public tryReleasingCache (url: string) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (!audioBufferData) {
            console.warn(`Audio buffer cache ${url} has not been added.`);
            return;
        }
        if (--audioBufferData.usedCount <= 0) {
            delete this._audioBufferDataMap[url];
        }
    }
    public loadBuffer (url: string, ctx: CCAudioContext): Promise<CCAudioBuffer> {
        return new Promise((resolve, reject) => {
            const cachedbuffer = this.getCache(url);
            if (cachedbuffer) {
                resolve(cachedbuffer);
            }
            (ctx).decodeAudioData(url).then((buffer) => {
                this.addCache(url, buffer);
                resolve(buffer);
            }).catch(reject);
        });
    }
}
export const audioBufferManager = new CCAudioBufferManager();
