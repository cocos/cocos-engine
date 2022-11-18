import { CCAudioContext, CCSourceNode, StateChangeCallback } from '../../base';
import { InnerctxAudioBuffer } from './innerctx-audio-buffer';
import { InnerctxGainNode } from './innerctx-gain-node';
import { InnerctxDestinationNode } from './innerctx-destination-node';
import { InnerctxSourceNode } from './innerctx-source-node';
import { InnerctxStereoPannerNode } from './innerctx-stereo-panner-node';

export class InnerctxAudioContext implements CCAudioContext {
    private _dest: InnerctxDestinationNode;
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
    get destination (): InnerctxDestinationNode {
        return this._dest;
    }
    // listener: AudioListener;
    public onstatechange: StateChangeCallback;
    get sampleRate () {
        return 0;
    }
    private _state = "running";
    get state (): string {
        return this._state;
    }
    createBuffer (numberOfChannels: number, length: number, sampleRate: number): InnerctxAudioBuffer {
        return new InnerctxAudioBuffer();
    }
    createSourceNode (buffer?: InnerctxAudioBuffer): InnerctxSourceNode {
        return new InnerctxSourceNode(this, buffer);
    }
    createGain (): InnerctxGainNode {
        return new InnerctxGainNode(this);
    }
    createStereoPanner (): InnerctxStereoPannerNode {
        return new InnerctxStereoPannerNode(this);
    }
    decodeAudioData (url: string,
        successCallback?: DecodeSuccessCallback | null | undefined,
        errorCallback?: DecodeErrorCallback | null | undefined): Promise<InnerctxAudioBuffer> {
        return new Promise<InnerctxAudioBuffer>((resolve, reject) => {
            const buffer = new InnerctxAudioBuffer(url);
            if (buffer.duration > 0) {
                resolve(buffer);
            }
            const message = `audio has no buffer inside or invalid, duration is 0`;
            reject(message);
        });
    }
    constructor (options?: AudioContextOptions) {
        this._dest = new InnerctxDestinationNode(this);
        this.onstatechange = (ctx: CCAudioContext, ev: Event) => {};
    }
}
export const defaultInnerContext = new InnerctxAudioContext();
