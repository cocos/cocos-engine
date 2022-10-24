import { clamp } from '../../../core/math';
import { AudioClip } from '../../audio-clip';
import { audioBufferManager } from '../shared/audio-buffer-manager';

export const AudioContext =  window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
// export const AudioBuffer = window.AudioBuffer || window.webkitAudioBuffer || window.mozAudioBuffer;
// export const AudioNode = window.AudioNode || window.webkitAudioNode || window.mozAudioNode;
// export const AudioDestinationNode = window.AudioDestinationNode || window.webkitAudioDestinationNode || window.mozAudioDestinationNode;
// export const GainNode = window.GainNode || window.webkitGainNode || window.mozGainNode;

/**
 * SourceNode is a node that we eclaspe as a source, it contains absn and stream source node
 * When you hit sourcenode.start, it will automatically start to play with certain node.
 */
export class SourceNode {
    private _absn: AudioBufferSourceNode;
    private _buffer: AudioBuffer | null = null;
    private _ctx: AudioContext;
    // When the source node start, we will save the context current time.
    private _startTime = 0;
    private _pastTime = 0;
    private _loop = false;
    private _cachePlaybackRate = 1;

    private _cbLists: (() => void)[] = [];
    // private mediaStreamNode: MediaStreamAudioSourceNode;
    constructor (ctx: AudioContext, url: string) {
        // TODO(timlyeee): check frame count instead to choose absn or mediastream
        this._ctx = ctx;
        this._absn = ctx.createBufferSource();
        this._absn.addEventListener('ended', this._onEnded);

        audioBufferManager.loadNative(ctx, url).then((buffer) => {
            this._buffer = buffer;
            this._absn.buffer = buffer;
        }).catch((err: Error) => {
            console.error(err.message);
        });
    }
    // For ABSN implementation, if the buffer is loaded, then the audio is prepared to play.
    get isReady (): boolean { return !!this._buffer; }
    connect (node: AudioNode) {
        // TODO: connect streaming node.
        this._absn.connect(node);
    }
    disconnect () {
        this._absn.disconnect();
    }

    set loop (val: boolean) {
        this._absn.loop = val;
    }
    get loop () {
        return this._absn.loop;
    }
    set currentTime (time: number) {
        this.restartAt(time);
    }
    get currentTime () {
        return this._pastTime +  (this._ctx.currentTime - this._startTime) * this._absn.playbackRate.value;
    }
    private _rebuild () {
        this._absn = this._ctx.createBufferSource();
        this._absn.addEventListener('ended', this._onEnded);
    }
    set playbackRate (val: number) {
        val = clamp(val, 0, Infinity);
        this._pastTime += (this._ctx.currentTime - this._startTime) * this._absn.playbackRate.value;
        this._absn.playbackRate.value = val;
        this._cachePlaybackRate = val;
        this._startTime = this._ctx.currentTime;
    }
    get playbackRate (): number {
        //IF absn
        return this._cachePlaybackRate;
    }
    startAt (offset: number) {
        //resume or start to play.
        if (this._absn.playbackRate.value === 0) {
            this._absn.playbackRate.value = this._cachePlaybackRate;
            return;
        }
        this._absn.start(0, offset);
        this._startTime = this._ctx.currentTime;
    }
    restartAt (offset: number) {
        // Recreate absn
        this.stop();
        this._rebuild();
        this.startAt(offset);

        // Reset properties
        this._pastTime = 0;
        this._startTime = this._ctx.currentTime;
    }
    pause () {
        this._absn.playbackRate.value = 0;
    }
    stop () {
        this._absn.stop();
        this._absn.disconnect();
    }
    _onEnded () {
        this._cbLists.forEach((cb) => {
            cb();
        });
    }
    onEnded (cb:()=>void) {
        this._cbLists.push(cb);
    }
}
