import { CCDestinationNode } from './base-destination-node';
import { CCSourceNode } from './base-source-node';
import { CCGainNode } from './base-gain-node';
import { CCAudioBuffer } from './base-audio-buffer';
import { CCStereoPannerNode } from './base-stereo-panner-node';

export interface AudioContextOptions {
    latencyHint?: AudioContextLatencyCategory | number;
    sampleRate?: number;
}
export type StateChangeCallback = (ctx: CCAudioContext, ev: Event) => any;
export interface DecodeSuccessCallback {
    (decodedData: AudioBuffer): void;
}
export interface DecodeErrorCallback {
    (error: DOMException): void;
}
export interface BaseAudioContextEventMap {
    'statechange': Event;
}
export type AudioContextState = 'closed' | 'running' | 'suspended';

export abstract class CCAudioContext {
    /** Available only in secure contexts */
    abstract readonly currentTime: number;
    abstract readonly destination: CCDestinationNode;
    // readonly listener: AudioListener;
    abstract onstatechange: StateChangeCallback | null;
    abstract readonly sampleRate: number;
    abstract readonly state: string;
    abstract createBuffer(numberOfChannels: number, length: number, sampleRate: number): CCAudioBuffer;
    abstract createSourceNode(buffer?: CCAudioBuffer): CCSourceNode;
    abstract createGain(): CCGainNode;
    abstract createStereoPanner(): CCStereoPannerNode;
    abstract decodeAudioData(
        url: string,
        successCallback?: DecodeSuccessCallback | null,
        errorCallback?: DecodeErrorCallback | null): Promise<CCAudioBuffer>;
    protected _state = 'closed';
    abstract close();
    abstract resume();
    abstract suspend();
    constructor (options?: AudioContextOptions) {
        this._state = 'running';
    }
}
