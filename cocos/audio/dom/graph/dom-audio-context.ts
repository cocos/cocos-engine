import { CCAudioContext, CCSourceNode, StateChangeCallback } from '../../base';
import { DomAudioBuffer } from './dom-audio-buffer';
import { DomGainNode } from './dom-gain-node';
import { DomDestinationNode } from './dom-destination-node';
import { DomSourceNode } from './dom-source-node';
import { DomStereoPannerNode } from './dom-stereo-panner-node';

export class DomAudioContext implements CCAudioContext {
    private _dest: DomDestinationNode;
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
    get destination (): DomDestinationNode {
        return this._dest;
    }
    // listener: AudioListener;
    public onstatechange: StateChangeCallback;
    private _state = 'running';
    get sampleRate () {
        return 0;
    }
    get state (): string {
        return this._state;
    }
    createBuffer (numberOfChannels: number, length: number, sampleRate: number): DomAudioBuffer {
        return new DomAudioBuffer();
    }
    createSourceNode (buffer?: DomAudioBuffer): DomSourceNode {
        const source = new DomSourceNode(this, buffer);
        this._sources.push(source);
        return source;
    }
    createGain (): DomGainNode {
        return new DomGainNode(this);
    }
    createStereoPanner (): DomStereoPannerNode {
        return new DomStereoPannerNode(this);
    }
    decodeAudioData (url: string,
        successCallback?: DecodeSuccessCallback | null | undefined,
        errorCallback?: DecodeErrorCallback | null | undefined): Promise<DomAudioBuffer> {
        return new Promise<DomAudioBuffer>((resolve, reject) => {
            const buffer = new DomAudioBuffer(url);
            if (buffer.duration > 0) {
                resolve(buffer);
            }
            const message = `audio has no buffer inside or invalid, duration is 0`;
            reject(message);
        });
    }
    constructor (options?: AudioContextOptions) {
        this._dest = new DomDestinationNode(this);
        this.onstatechange = (ctx: CCAudioContext, ev: Event) => {};
    }
}
export const domDefaultContext = new DomAudioContext();
