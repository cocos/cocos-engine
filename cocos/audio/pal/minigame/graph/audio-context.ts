import { CCAudioBuffer } from './audio-buffer';
import { CCGainNode } from './gain-node';
import { CCDestinationNode } from './destination-node';
import { CCSourceNode } from './source-node';
import { CCStereoPannerNode } from './stereo-panner-node';

export type StateChangeCallback = (ctx: CCAudioContext, ev: Event) => any;
export class CCAudioContext {
    private _dest: CCDestinationNode;
    private _sources: CCSourceNode[] = []
    close () {
        // TODO: Close all audio inside, change state to close, call onStateChange
        this._sources.forEach((source) => {
            source.stop();
        });
        this._state = 'close';
    }
    resume () {
        this._sources.forEach((source) => {
            source.start();
        });
        this._state = 'running';
    }
    suspend () {
        this._sources.forEach((source) => {
            source.start();
        });
        this._state = 'suspend';
    }
    get currentTime () {
        console.warn('Current time is a meanless property');
        return 0;
    }
    get destination (): CCDestinationNode {
        return this._dest;
    }
    // listener: AudioListener;
    public onstatechange: StateChangeCallback;
    get sampleRate () {
        return 0;
    }
    private _state = 'running';
    get state (): string {
        return this._state;
    }
    createBuffer (numberOfChannels: number, length: number, sampleRate: number): CCAudioBuffer {
        return new CCAudioBuffer();
    }
    createSourceNode (buffer?: CCAudioBuffer): CCSourceNode {
        return new CCSourceNode(this, buffer);
    }
    createGain (): CCGainNode {
        return new CCGainNode(this);
    }
    createStereoPanner (): CCStereoPannerNode {
        return new CCStereoPannerNode(this);
    }
    decodeAudioData (url: string,
        successCallback?: DecodeSuccessCallback | null | undefined,
        errorCallback?: DecodeErrorCallback | null | undefined): Promise<CCAudioBuffer> {
        return new Promise<CCAudioBuffer>((resolve, reject) => {
            const buffer = new CCAudioBuffer(url);
            if (buffer.duration > 0) {
                resolve(buffer);
            }
            const message = `audio has no buffer inside or invalid, duration is 0`;
            reject(message);
        });
    }
    constructor (options?: AudioContextOptions) {
        this._dest = new CCDestinationNode(this);
        this.onstatechange = (ctx: CCAudioContext, ev: Event) => {};
    }
}
export const defaultInnerContext = new CCAudioContext();
