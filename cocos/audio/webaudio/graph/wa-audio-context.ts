import { AudioContextOptions, CCAudioContext, StateChangeCallback } from '../../base';
import { waAudioBufferManager } from './audio-buffer-manager';
import { WAGainNode } from './wa-gain-node';
import { WASourceNode } from './wa-source-node';
import { WAStereoPannerNode } from './wa-stereo-panner-node';

export class WAAudioContext extends CCAudioContext {
    private _ctx: AudioContext;
    get ctx () { return this._ctx; }
    get currentTime (): number {
        return this._ctx.currentTime;
    }
    get destination (): AudioDestinationNode {
        return this._ctx.destination;
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
        return waAudioBufferManager.loadBuffer(url, this);
    }
    protected _state = 'closed';
    close () {
        throw new Error('Method not implemented.');
    }
    resume () {
        throw new Error('Method not implemented.');
    }
    suspend () {
        throw new Error('Method not implemented.');
    }
    constructor (options?: AudioContextOptions) {
        super(options);
        this._ctx = new AudioContext(options);
        this._state = this._ctx.state;
    }
}
export const waDefaultContext = new WAAudioContext();
