import { clamp, clamp01 } from '../../../core/math';

export const AudioContext =  window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
// export const AudioBuffer = window.AudioBuffer || window.webkitAudioBuffer || window.mozAudioBuffer;
// export const AudioNode = window.AudioNode || window.webkitAudioNode || window.mozAudioNode;
// export const AudioDestinationNode = window.AudioDestinationNode || window.webkitAudioDestinationNode || window.mozAudioDestinationNode;
// export const GainNode = window.GainNode || window.webkitGainNode || window.mozGainNode;
export const defaultContext = new AudioContext();
/**
 * SourceNode is a node that we eclaspe as a source, it contains absn and stream source node
 * When you hit sourcenode.start, it will automatically start to play with certain node.
 */
enum ABSNState {
    // Buffer is not set
    UNSET,
    // Buffer is set, not played
    READY,
    // ABSN is used but not stopped.
    USING,
    // For a stopped absn, you cannot stop it again.
    STOPPED
}
export class SourceNode {
    // Note: Properties for rebuild
    private _absn: AudioBufferSourceNode;
    private _gain: GainNode;
    private _ctx: AudioContext;
    private _buffer: AudioBuffer | null = null;
    private _cachePlaybackRate = 1;
    private _loop = false;
    // When the source node start, we will save the context current time.
    private _startTime = 0;
    private _pastTime = 0;
    private _innerState: ABSNState = ABSNState.UNSET;

    // private mediaStreamNode: MediaStreamAudioSourceNode;
    constructor (ctx: AudioContext, buffer?: AudioBuffer) {
        this._ctx = ctx;
        this._gain = ctx.createGain();
        this._absn = ctx.createBufferSource();
        // this._absn.addEventListener('ended', this._onEnded);
        if (buffer) {
            this._absn.buffer = buffer;
            this._buffer = buffer;
            this._innerState = ABSNState.READY;
        }
    }
    // If the buffer is given.
    get isReady (): boolean { return !!this._buffer; }

    // absn -> gain -> others.
    // TODO(timlyeee): Expend to the standard of AudioNode.
    connect (node: AudioNode) {
        this._gain.connect(node);
    }
    disconnect () {
        this._gain.disconnect();
    }

    // After the buffer is set, the audio should be stopped and waiting for another play
    set buffer (buffer: AudioBuffer) {
        this._buffer = buffer;
        this._rebuild();
    }
    get buffer (): AudioBuffer {
        if (!this._buffer) {
            throw new Error('No buffer avaliable');
        }
        return this._buffer;
    }

    // For most of time, we can set the volume directly from here.
    set volume (val: number) {
        val = clamp01(val);
        this._gain.gain.value = val;
    }
    get volume () {
        return this._gain.gain.value;
    }

    set loop (val: boolean) {
        this._absn.loop = val;
    }
    get loop () {
        return this._absn.loop;
    }
    set currentTime (time: number) {
        console.log('Setting current time');
        this.restartAt(time);
    }
    get currentTime () {
        return this._pastTime +  (this._ctx.currentTime - this._startTime) * this._absn.playbackRate.value;
    }
    /**
     * What rebuild should do:
     * 1. Create a new one and set all properties.
     * 2. Connect to gainNode.
     * 3. Set the state to READY
     * All operations relative to change the time will never be set here.
     */
    private _rebuild () {
        this.stop();
        this._absn = this._ctx.createBufferSource();
        this._absn.buffer = this._buffer;
        this._absn.playbackRate.value = this._cachePlaybackRate;
        this._absn.loop = this.loop;

        this._absn.connect(this._gain);
        this._innerState = ABSNState.READY;
    }
    set playbackRate (val: number) {
        val = clamp(val, 0, Infinity);
        this._pastTime += (this._ctx.currentTime - this._startTime) * this._absn.playbackRate.value;
        this._absn.playbackRate.value = val;
        this._cachePlaybackRate = val;
        this._startTime = this._ctx.currentTime;
    }
    get playbackRate (): number {
        return this._cachePlaybackRate;
    }

    startAt (offset: number) {
        // Start from the beginning
        this._absn.start(0, offset);
        this._startTime = this._ctx.currentTime;
        this._innerState = ABSNState.USING;
    }
    // For a restart logic, if the next node is not saved, we can never truly play an audio.
    restartAt (offset: number) {
        // Recreate absn
        this.stop();
        // Reset past time
        this._pastTime = offset * this.buffer.sampleRate;
        this.startAt(offset);
    }
    resume () {
        if (this._absn.playbackRate.value === 0) {
            this._absn.playbackRate.value = this._cachePlaybackRate;
        }
    }
    pause () {
        if (this._innerState !== ABSNState.USING) {
            return;
        }
        this._absn.playbackRate.value = 0;
    }
    stop () {
        try { this._absn.stop(); } catch { /*DONOTHING*/ }
        this._rebuild();
    }
}
