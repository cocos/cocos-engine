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

export interface CCAudioContext {
    /** Available only in secure contexts */
    readonly currentTime: number;
    readonly destination: CCDestinationNode;
    // readonly listener: AudioListener;
    onstatechange: StateChangeCallback | null;
    readonly sampleRate: number;
    readonly state: string;
    createBuffer(numberOfChannels: number, length: number, sampleRate: number): CCAudioBuffer;
    createSourceNode(buffer?: CCAudioBuffer): CCSourceNode;
    createGain(): CCGainNode;
    createStereoPanner(): CCStereoPannerNode;
    decodeAudioData(
        url: string,
        successCallback?: DecodeSuccessCallback | null,
        errorCallback?: DecodeErrorCallback | null): Promise<CCAudioBuffer>;
    close();
    resume();
    suspend();

}
