import { AudioContextOptions, CCAudioContext, StateChangeCallback } from '../../base';
import { WAGainNode } from './wa-gain-node';
import { WASourceNode } from './wa-source-node';
import { WAStereoPannerNode } from './wa-stereo-panner-node';
import { WADestinationNode } from './wa-destination-node';

export class WAAudioContext implements CCAudioContext {
    private _ctx: AudioContext;
    private _destination: WADestinationNode;
    get ctx () { return this._ctx; }
    get currentTime (): number {
        return this._ctx.currentTime;
    }
    get destination (): WADestinationNode {
        return this._destination;
    }
    private _onStateChange:  StateChangeCallback | null = null;
    get onstatechange (): StateChangeCallback | null {
        return this._onStateChange;
    }
    set onStateChange (cb: StateChangeCallback) {
        this._onStateChange = cb;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const thiz = this;
        this._ctx.onstatechange = (ev) => {
            cb(thiz, ev);
        };
    }
    get sampleRate (): number {
        return this._ctx.sampleRate;
    }
    get state (): string {
        return this._ctx.state;
    }
    createBuffer (numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
        return this._ctx.createBuffer(numberOfChannels, length, sampleRate);
    }
    createSourceNode (buffer?: AudioBuffer): WASourceNode {
        return new WASourceNode(this._ctx, buffer);
    }
    createGain (): WAGainNode {
        return new WAGainNode(this._ctx);
    }
    createStereoPanner (): WAStereoPannerNode {
        return new WAStereoPannerNode(this._ctx);
    }
    decodeAudioData (url: string,
        successCallback?: DecodeSuccessCallback | null | undefined,
        errorCallback?: DecodeErrorCallback | null | undefined): Promise<AudioBuffer> {
        //TODO: optimize audiobuffermanager to load buffer dynamically.
        return new Promise<AudioBuffer>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const errInfo = `load audio failed: ${url}, status: `;
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 0) {
                    const arrBuf: ArrayBuffer = xhr.response;
                    this._ctx.decodeAudioData(arrBuf,
                        null,
                        () => { console.log('decode failed'); })
                        .then((decodedAudioBuffer) => {
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
    protected _state = 'closed';
    close () {
        this._ctx.close().catch(() => {});
    }
    resume () {
        this._ctx.resume().catch(() => {});
    }
    suspend () {
        this._ctx.suspend().catch(() => {});
    }
    constructor (options?: AudioContextOptions) {
        this._ctx = new AudioContext(options);
        this._state = this._ctx.state;
        this._destination = new WADestinationNode(this._ctx);
    }
}
export const waDefaultContext = new WAAudioContext();
