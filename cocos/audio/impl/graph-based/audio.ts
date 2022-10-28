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
    PLAYING,
    PAUSED,
    // Should restart
    DIRTY,
}
interface SourceNodeCacheProperties {
    playbackRate: number;
    loop: boolean;
    // When the source node start, we will save the context current time.
    startTime: number;
    // current time = past time + (ctx.current time - start time) * playback rate
    // past time =  last current time before playbackrate changes.
    pastTime: number;
}
export class SourceNode {
    // Note: Properties for rebuild
    private _absn: AudioBufferSourceNode | null;
    private _gain: GainNode | null;
    private _ctx: AudioContext;
    private _buffer: AudioBuffer | null = null;
    private _cacheProperties : SourceNodeCacheProperties;
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
        this._absn.connect(this._gain);
        this._absn.onended = () => {
            this._onEnded();
            this._rebuild();
        };
        this._cacheProperties = {
            playbackRate: 1,
            loop: false,
            startTime: 0,
            pastTime: 0,
        };
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
        if (this._innerState === ABSNState.UNSET) {
            this._innerState = ABSNState.READY;
        }
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
        this._cacheProperties.loop = val; //  cache the value for rebuild
        this._absn.loop = val;
    }
    get loop () {
        return this._cacheProperties.loop;
    }
    set currentTime (time: number) {
        // playback rate === 0 means 1.Not start 2. Pausing, both can be seen as not playing
        if (this._innerState !== ABSNState.PLAYING) {
            this._cacheProperties.pastTime = time;
            this._innerState = ABSNState.DIRTY;
        } else {
            this.start(time);
        }
    }
    get currentTime () {
        if (this._innerState !== ABSNState.PLAYING) {
            return this._cacheProperties.pastTime;
        } else {
            return this._cacheProperties.pastTime +  (this._ctx.currentTime - this._cacheProperties.startTime) * this._absn.playbackRate.value;
        }
    }
    /**
     * What rebuild should do:
     * 1. Create a new one and set all properties.
     * 2. Connect to gainNode.
     * 3. Set the state to READY
     * All operations relative to change the time will never be set here.
     */
    private _rebuild () {
        console.log('rebuild');
        this._absn.disconnect();
        this._absn.onended = null;
        this._absn = this._ctx.createBufferSource();
        this._absn.buffer = this._buffer;
        // this._absn.playbackRate.value = this._cacheProperties.playbackRate;
        this._absn.loop = this._cacheProperties.loop;

        this._absn.connect(this._gain);
        this._absn.onended = () => {
            this._onEnded();
            this._cacheProperties.pastTime = 0;
            this._rebuild();
        };
        this._innerState = ABSNState.READY;
    }
    set playbackRate (val: number) {
        val = clamp(val, 0, Infinity);

        // Update time properties
        this._cacheProperties.pastTime += (this._ctx.currentTime - this._cacheProperties.startTime) * this._absn.playbackRate.value;
        this._cacheProperties.playbackRate = val;
        this._cacheProperties.startTime = this._ctx.currentTime;

        // set dirty
        if (this._innerState === ABSNState.PLAYING) {
            this._absn.playbackRate.value = val;
        }
    }
    get playbackRate (): number {
        return this._cacheProperties.playbackRate;
    }
    // Offset is the number of second, should sync with absn
    start (time?: number) {
        if (!this._buffer) {
            throw new Error('[SourceNode] No buffer is provided!! Play audio faield');
        }
        if (time) {
            this._restart(time);
        } else {
            switch (this._innerState) {
            case ABSNState.PAUSED:
                this._absn.playbackRate.value = this._cacheProperties.playbackRate;
                this._cacheProperties.startTime = this._ctx.currentTime;
                this._innerState = ABSNState.PLAYING;
                break;
            case ABSNState.PLAYING:
                this._restart(0);
                break;
            case ABSNState.DIRTY:
                this._restart(this._cacheProperties.pastTime);
                break;
            case ABSNState.READY:
                this._pureStart(0);
                break;
            default:
                break;
            }
        }
    }
    _restart (time: number) {
        this.stop();
        this._rebuild();
        this._pureStart(time);
    }
    _pureStart (time: number) {
        this._cacheProperties.pastTime = time;
        this._absn.start(0, time);
        this._cacheProperties.startTime = this._ctx.currentTime;
        this._innerState = ABSNState.PLAYING;
    }
    pause () {
        if (this._innerState !== ABSNState.PLAYING) {
            return;
        }
        this._cacheProperties.pastTime = this.currentTime;
        this._absn.playbackRate.value = 0;
        this._innerState = ABSNState.PAUSED;
    }
    stop () {
        try {
            this._absn.stop();
            console.log('Stopped');
        } catch { /*DONOTHING*/ }
    }
    public onEnded (callback: ()=>void) {
        this._onExternalEnded = callback;
    }
    // Reset source node time when the audio is finish playing
    private _onEnded () {
        this._cacheProperties.pastTime = 0;
        this._cacheProperties.startTime = 0;
        console.log('[SourceNode] OnEnded');
        this._innerState = ABSNState.DIRTY;
        if (this._onExternalEnded) this._onExternalEnded();
    }
    private _onExternalEnded: (() => void) | undefined;
}
