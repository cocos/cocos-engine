import { CCAudioBuffer } from '../../base';
import { domAudioPool } from './dom-audio-pool';

export class DomAudioBuffer implements CCAudioBuffer {
    private _url: string;
    set url (url: string) {
        this._url = url;
        this._duration = domAudioPool.loadDomSync(url).duration;
    }
    get url () {
        return this._url;
    }
    private _duration = 0;
    get sampleRate () {
        console.warn('Cannot get sample rate when using dom audio backend');
        return 0;
    }
    get length () {
        console.warn('Cannot get sample length when using dom audio backend');
        return 0;
    }
    get duration () {
        if (this._duration) { return this._duration; }
        return domAudioPool._infoMap[this._url].duration;
    }
    get numberOfChannels () {
        console.warn('Cannot get numberOfChannels when using dom audio backend');
        return 0;
    }
    copyFromChannel (destination: Float32Array, channelNumber: number, bufferOffset?: number | undefined): void {
        console.error('Cannot get manipulate buffer when using dom audio backend');
    }
    copyToChannel (source: Float32Array, channelNumber: number, bufferOffset?: number | undefined): void {
        console.error('Cannot get manipulate buffer when using dom audio backend');
    }
    getChannelData (channel: number): Float32Array {
        throw new Error('Cannot get manipulate buffer when using dom audio backend');
    }
    constructor (url?: string) {
        if (url) {
            this._url = url;
            this._duration = domAudioPool.loadDomSync(url).duration;
        } else {
            this._url = '';
        }
    }
}
