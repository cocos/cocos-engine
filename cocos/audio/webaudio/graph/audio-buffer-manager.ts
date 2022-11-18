import { CCAudioBufferManager, CCAudioContext } from '../../base';
import { WAAudioContext, waDefaultContext } from './wa-audio-context';

/**
 * This is a manager to manage the cache of audio buffer for web audio and dom audio.
 */
export class WAAudioBufferManager extends CCAudioBufferManager {
    public loadBuffer (url: string, ctx?: CCAudioContext): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            const cachedAudioBuffer = this.getCache(url);
            if (cachedAudioBuffer) {
                // this.retainCache(url);
                resolve(cachedAudioBuffer);
            }
            {
                const xhr = new XMLHttpRequest();
                const errInfo = `load audio failed: ${url}, status: `;
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 0) {
                        const arrBuf: ArrayBuffer = xhr.response;
                        const context = (ctx && ctx instanceof WAAudioContext) ? ctx.ctx : waDefaultContext.ctx;
                        context.decodeAudioData(arrBuf,
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
            }
        });
    }
}
export const waAudioBufferManager = new WAAudioBufferManager();
