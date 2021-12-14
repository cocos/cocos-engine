import { EDITOR } from 'internal:constants';
import { systemInfo } from 'pal/system-info';
import { AudioEvent, AudioState, AudioType } from '../type';
import { EventTarget } from '../../../cocos/core/event';
import { clamp01 } from '../../../cocos/core';
import { enqueueOperation, OperationInfo, OperationQueueable } from '../operation-queue';
import AudioTimer from '../audio-timer';
import { audioBufferManager } from '../audio-buffer-manager';

// NOTE: fix CI
const AudioContextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
export class AudioContextAgent {
    public static support = !!AudioContextClass;
    private _context: AudioContext;
    constructor () {
        this._context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
    }

    get currentTime () {
        return this._context.currentTime;
    }

    public decodeAudioData (audioData: ArrayBuffer): Promise<AudioBuffer> {
        return new Promise((resolve) => {
            const promise = this._context.decodeAudioData(audioData, (audioBuffer) => {
                resolve(audioBuffer);
            }, (err) => {
                // TODO: need to reject the error.
                console.error('failed to load Web Audio', err);
            });
            promise?.catch((e) => {});  // Safari doesn't support the promise based decodeAudioData
        });
    }

    public runContext (): Promise<void> {
        return new Promise((resolve) => {
            const context = this._context;
            if (!context.resume) {
                resolve();
                return;
            }
            if (context.state === 'running') {
                resolve();
                return;
            }
            // Force running audio context if state is not 'running', may be 'suspended' or 'interrupted'.
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            const onGesture = () => {
                context.resume().then(resolve).catch((e) => {});
            };
            canvas?.addEventListener('touchend', onGesture, { once: true, capture: true });
            canvas?.addEventListener('mouseup', onGesture, { once: true, capture: true });
        });
    }

    public createBufferSource (audioBuffer?: AudioBuffer, loop?: boolean) {
        const sourceBufferNode = this._context.createBufferSource();
        if (audioBuffer !== undefined) {
            sourceBufferNode.buffer = audioBuffer;
        }
        if (loop !== undefined) {
            sourceBufferNode.loop = loop;
        }
        return sourceBufferNode;
    }

    public createGain (volume = 1) {
        const gainNode = this._context.createGain();
        this.setGainValue(gainNode, volume);
        return gainNode;
    }

    public setGainValue (gain: GainNode, volume: number) {
        if (gain.gain.setTargetAtTime) {
            try {
                gain.gain.setTargetAtTime(volume, this._context.currentTime, 0);
            } catch (e) {
                // Some unknown browsers may crash if timeConstant is 0
                gain.gain.setTargetAtTime(volume, this._context.currentTime, 0.01);
            }
        } else {
            gain.gain.value = volume;
        }
    }

    public connectContext (audioNode: GainNode) {
        if (!this._context) {
            return;
        }
        audioNode.connect(this._context.destination);
    }
}

let audioContextAgent: AudioContextAgent | undefined;
if (AudioContextAgent.support) {
    audioContextAgent = new AudioContextAgent();
}

export class OneShotAudioWeb {
    private _duration: number;
    private _bufferSourceNode: AudioBufferSourceNode;
    private _onPlayCb?: () => void;
    private _currentTimer = 0;
    private _url: string;

    get onPlay () {
        return this._onPlayCb;
    }
    set onPlay (cb) {
        this._onPlayCb = cb;
    }

    private _onEndCb?: () => void;
    get onEnd () {
        return this._onEndCb;
    }
    set onEnd (cb) {
        this._onEndCb = cb;
    }

    private constructor (audioBuffer: AudioBuffer, volume: number, url: string) {
        this._duration = audioBuffer.duration;
        this._url = url;
        this._bufferSourceNode = audioContextAgent!.createBufferSource(audioBuffer, false);
        const gainNode = audioContextAgent!.createGain(volume);
        this._bufferSourceNode.connect(gainNode);
        audioContextAgent!.connectContext(gainNode);
    }

    public play (): void {
        if (EDITOR) {
            return;
        }
        this._bufferSourceNode.start();
        // audioContextAgent does exist
        audioContextAgent!.runContext().then(() => {
            this.onPlay?.();
            this._currentTimer = window.setTimeout(() => {
                audioBufferManager.tryReleasingCache(this._url);
                this.onEnd?.();
            }, this._duration * 1000);
        }).catch((e) => {});
    }

    public stop (): void {
        clearTimeout(this._currentTimer);
        audioBufferManager.tryReleasingCache(this._url);
        this._bufferSourceNode.stop();
    }
}

export class AudioPlayerWeb implements OperationQueueable {
    private _src: string;
    private _audioBuffer: AudioBuffer;
    private _sourceNode?: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _currentTimer = 0;
    private _volume = 1;
    private _loop = false;
    private _state: AudioState = AudioState.INIT;
    private _audioTimer: AudioTimer;

    /**
     * @private_cc
     */
    public _eventTarget: EventTarget = new EventTarget();
    /**
     * @private_cc
     */
    public _operationQueue: OperationInfo[] = [];

    constructor (audioBuffer: AudioBuffer, url: string) {
        this._audioBuffer = audioBuffer;
        this._audioTimer = new AudioTimer(audioBuffer);
        this._gainNode = audioContextAgent!.createGain();
        audioContextAgent!.connectContext(this._gainNode);
        this._src = url;
        // event
        systemInfo.on('hide', this._onHide, this);
        systemInfo.on('show', this._onShow, this);
    }
    destroy () {
        this._audioTimer.destroy();
        if (this._audioBuffer) {
            // @ts-expect-error need to release AudioBuffer instance
            this._audioBuffer = null;
        }
        audioBufferManager.tryReleasingCache(this._src);
        systemInfo.off('hide', this._onHide, this);
        systemInfo.off('show', this._onShow, this);
    }
    static load (url: string): Promise<AudioPlayerWeb> {
        return new Promise((resolve) => {
            AudioPlayerWeb.loadNative(url).then((audioBuffer) => {
                resolve(new AudioPlayerWeb(audioBuffer, url));
            }).catch((e) => {});
        });
    }
    static loadNative (url: string): Promise<AudioBuffer> {
        return new Promise((resolve, reject) => {
            const cachedAudioBuffer = audioBufferManager.getCache(url);
            if (cachedAudioBuffer) {
                audioBufferManager.retainCache(url);
                resolve(cachedAudioBuffer);
                return;
            }
            const xhr = new XMLHttpRequest();
            const errInfo = `load audio failed: ${url}, status: `;
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 0) {
                    audioContextAgent!.decodeAudioData(xhr.response).then((decodedAudioBuffer) => {
                        audioBufferManager.addCache(url, decodedAudioBuffer);
                        resolve(decodedAudioBuffer);
                    }).catch((e) => {});
                } else {
                    reject(new Error(`${errInfo}${xhr.status}(no response)`));
                }
            };
            xhr.onerror = () => { reject(new Error(`${errInfo}${xhr.status}(error)`)); };
            xhr.ontimeout = () => { reject(new Error(`${errInfo}${xhr.status}(time out)`)); };
            xhr.onabort = () => { reject(new Error(`${errInfo}${xhr.status}(abort)`)); };

            xhr.send(null);
        });
    }
    static loadOneShotAudio (url: string, volume: number): Promise<OneShotAudioWeb> {
        return new Promise((resolve, reject) => {
            AudioPlayerWeb.loadNative(url).then((audioBuffer) => {
                // @ts-expect-error AudioPlayer should be a friend class in OneShotAudio
                const oneShotAudio = new OneShotAudioWeb(audioBuffer, volume, url);
                resolve(oneShotAudio);
            }).catch(reject);
        });
    }

    private _onHide () {
        if (this._state === AudioState.PLAYING) {
            this.pause().then(() => {
                this._state = AudioState.INTERRUPTED;
                this._eventTarget.emit(AudioEvent.INTERRUPTION_BEGIN);
            }).catch((e) => {});
        }
    }
    private _onShow () {
        if (this._state === AudioState.INTERRUPTED) {
            this.play().then(() => {
                this._eventTarget.emit(AudioEvent.INTERRUPTION_END);
            }).catch((e) => {});
        }
    }

    get src (): string {
        return this._src;
    }
    get type (): AudioType {
        return AudioType.WEB_AUDIO;
    }
    get state (): AudioState {
        return this._state;
    }
    get loop (): boolean {
        return this._loop;
    }
    set loop (val: boolean) {
        this._loop = val;
        if (this._sourceNode) {
            this._sourceNode.loop = val;
        }
    }
    get volume (): number {
        return this._volume;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._volume = val;
        audioContextAgent!.setGainValue(this._gainNode, val);
    }
    get duration (): number {
        return this._audioBuffer.duration;
    }
    get currentTime (): number {
        return this._audioTimer.currentTime;
    }

    @enqueueOperation
    seek (time: number): Promise<void> {
        return new Promise((resolve) => {
            this._audioTimer.seek(time);
            if (this._state === AudioState.PLAYING) {
                // one AudioBufferSourceNode can't start twice
                // need to create a new one to start from the offset
                this._doPlay().then(resolve).catch((e) => {});
            } else {
                resolve();
            }
        });
    }

    @enqueueOperation
    play (): Promise<void> {
        if (EDITOR) {
            return Promise.resolve();
        }
        return this._doPlay();
    }

    // The decorated play() method can't be call in seek()
    // so we define this method to ensure that the audio seeking works.
    private _doPlay (): Promise<void> {
        return new Promise((resolve) => {
            // one AudioBufferSourceNode can't start twice
            this._stopSourceNode();
            this._sourceNode = audioContextAgent!.createBufferSource(this._audioBuffer, this.loop);
            this._sourceNode.connect(this._gainNode);
            this._sourceNode.start(0, this._audioTimer.currentTime);
            audioContextAgent!.runContext().then(() => {
                this._state = AudioState.PLAYING;
                this._audioTimer.start();

                /* still not supported by all platforms *
                this._sourceNode.onended = this._onEnded;
                /* doing it manually for now */
                const checkEnded = () => {
                    if (this.loop) {
                        this._currentTimer = window.setTimeout(checkEnded, this._audioBuffer.duration * 1000);
                    } else {  // do ended
                        this._audioTimer.stop();
                        this._eventTarget.emit(AudioEvent.ENDED);
                        this._state = AudioState.INIT;
                    }
                };
                window.clearTimeout(this._currentTimer);
                this._currentTimer = window.setTimeout(checkEnded, (this._audioBuffer.duration - this._audioTimer.currentTime) * 1000);
                resolve();
            }).catch((e) => {});
        });
    }

    private _stopSourceNode () {
        try {
            this._sourceNode?.stop();
        } catch (e) {
            // sourceNode can't be stopped twice, especially on Safari.
        }
    }

    @enqueueOperation
    pause (): Promise<void> {
        if (this._state !== AudioState.PLAYING || !this._sourceNode) {
            return Promise.resolve();
        }
        this._audioTimer.pause();
        this._state = AudioState.PAUSED;
        window.clearTimeout(this._currentTimer);
        this._stopSourceNode();
        return Promise.resolve();
    }

    @enqueueOperation
    stop (): Promise<void> {
        if (!this._sourceNode) {
            return Promise.resolve();
        }
        this._audioTimer.stop();
        this._state = AudioState.STOPPED;
        window.clearTimeout(this._currentTimer);
        this._stopSourceNode();
        return Promise.resolve();
    }

    onInterruptionBegin (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_BEGIN, cb); }
    offInterruptionBegin (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_BEGIN, cb); }
    onInterruptionEnd (cb: () => void) { this._eventTarget.on(AudioEvent.INTERRUPTION_END, cb); }
    offInterruptionEnd (cb?: () => void) { this._eventTarget.off(AudioEvent.INTERRUPTION_END, cb); }
    onEnded (cb: () => void) { this._eventTarget.on(AudioEvent.ENDED, cb); }
    offEnded (cb?: () => void) { this._eventTarget.off(AudioEvent.ENDED, cb); }
}
