import { CCAudioContext, CCSourceNode, StateChangeCallback } from '../../base';
import { DomAudioBuffer } from './dom-audio-buffer';
import { DomGainNode } from './dom-gain-node';
import { DomDestinationNode } from './dom-destination-node';
import { DomSourceNode } from './dom-source-node';
import { DomStereoPannerNode } from './dom-stereo-panner-node';

export class DomAudioContext extends CCAudioContext {
    private _dest: DomDestinationNode;
    private _sources: CCSourceNode[] = []
    close () {
        // TODO: Close all audio inside, change state to close, call onStateChange
        this._sources.forEach((source) => {
            source.stop();
        });
    }
    resume () {
        this._sources.forEach((source) => {
            source.start();
        });
    }
    suspend () {
        this._sources.forEach((source) => {
            source.start();
        });
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
        return new DomSourceNode(this, buffer);
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
        super();
        this._dest = new DomDestinationNode(this);
        this.onstatechange = (ctx: CCAudioContext, ev: Event) => {};
    }
}
export const domDefaultContext = new DomAudioContext();
