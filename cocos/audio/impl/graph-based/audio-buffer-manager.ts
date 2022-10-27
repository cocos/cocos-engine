import { defaultContext } from './audio';

interface CachedAudioBufferData {
    usedCount: number,
    audioBuffer: AudioBuffer,
}
interface AudioBufferDataMap {
    [url: string]: CachedAudioBufferData
}

/**
 * This is a manager to manage the cache of audio buffer for web audio and dom audio.
 */
class AudioBufferManager {
    //
    private _audioBufferDataMap: AudioBufferDataMap = {};
    public webAudioSupport = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
    public addCache (url: string, audioBuffer: AudioBuffer) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (audioBufferData) {
            console.warn(`Audio buffer ${url} has been cached`);
            return;
        }
        this._audioBufferDataMap[url] = {
            usedCount: 1,
            audioBuffer,
        };
    }

    public retainCache (url: string) {
        const audioBufferData = this._audioBufferDataMap[url];
        if (!audioBufferData) {
            console.warn(`Audio buffer cache ${url} has not been added.`);
            return;
        }
        audioBufferData.usedCount++;
    }

    public getCache (url: string): AudioBuffer | null | undefined {
        const audioBufferData = this._audioBufferDataMap[url];
        return audioBufferData?.audioBuffer;
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
    public loadBuffer (url: string): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            const cachedAudioBuffer = this.getCache(url);
            if (cachedAudioBuffer) {
                this.retainCache(url);
                resolve(cachedAudioBuffer);
                return;
            }
            const xhr = new XMLHttpRequest();
            const errInfo = `load audio failed: ${url}, status: `;
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 0) {
                    const arrBuf: ArrayBuffer = xhr.response;
                    defaultContext.decodeAudioData(arrBuf,
                        null,
                        () => { console.log('decode failed'); })
                        .then((decodedAudioBuffer) => {
                            this.addCache(url, decodedAudioBuffer);
                            resolve(decodedAudioBuffer);
                        }).catch((e) => {
                            console.error(`decode audio data failed, with error data${e.toString()}`);
                        });
                } else {
                    reject(new Error(`${errInfo}${xhr.status}(no response)`));
                }
            };
            xhr.onerror = () => { reject(new Error(`${errInfo}${xhr.status}(error)`)); };
            xhr.ontimeout = () => { reject(new Error(`${errInfo}${xhr.status}(time out)`)); };
            xhr.onabort = () => { reject(new Error(`${errInfo}${xhr.status}(abort)`)); };

            xhr.send(null);
        });
    }
}
export const audioBufferManager = new AudioBufferManager();
