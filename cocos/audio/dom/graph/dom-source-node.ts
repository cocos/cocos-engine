import { clamp, clamp01 } from '../../../core/math';
import { CCSourceNode } from '../../base';
import { DomAudioBuffer } from './dom-audio-buffer';
import { DomAudioContext } from './dom-audio-context';
import { DomAudioNode, NodeType } from './dom-audio-node';
import { domAudioPool } from './dom-audio-pool';

function ensurePlaying (domAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = domAudio.play();
        console.log('ensure play');
        if (promise === undefined) {  // Chrome50/Firefox53 below
            resolve();
        }
        promise.then(resolve).catch(() => {
            const onGesture = () => {
                domAudio.play().catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { once: true });
            canvas?.addEventListener('mousedown', onGesture, { once: true });
        });
        return null;
    });
}
export class DomSourceNode extends DomAudioNode implements CCSourceNode {
    innerOperation: (() => void) | undefined;
    protected _type: NodeType = NodeType.SOURCE;
    private _buffer: DomAudioBuffer | null = null;
    private _domAudio: HTMLAudioElement;
    get buffer (): DomAudioBuffer {
        if (!this._buffer) {
            throw new Error('No buffer avaliable');
        }
        return this._buffer;
    }
    set buffer (buffer: DomAudioBuffer) {
        this._buffer = buffer;
        if (this._domAudio) {
            this._domAudio.src = buffer.url;
        } else {
            this._domAudio = domAudioPool.alloc(buffer.url);
        }
    }
    constructor (ctx: DomAudioContext, buffer?: DomAudioBuffer) {
        super(ctx);
        if (buffer) {
            this._buffer = buffer;
            this._domAudio = domAudioPool.alloc(this._buffer.url);
        } else {
            this._domAudio = new Audio();
        }
        this._domAudio.volume = this._weight * this._gain;
    }
    get isReady (): boolean {
        return !!this._buffer;
    }
    get volume (): number {
        return this._gain;
    }
    set volume (val: number) {
        val = clamp01(val);
        this._gain = val;
        this._domAudio.volume = this._weight * this._gain;
    }
    get loop () {
        return this._domAudio.loop;
    }
    set loop (loop:boolean) {
        this._domAudio.loop = loop;
    }
    get currentTime (): number {
        return this._domAudio.currentTime;
    }

    set currentTime (time: number) {
        if (!this._buffer) {
            throw new Error('No buffer is provided');
        }
        this._domAudio.currentTime = time;
    }
    set playbackRate (rate: number) {
        clamp(rate, 0.25, rate);
        this._domAudio.playbackRate = rate;
    }
    get playbackRate (): number {
        return this._domAudio.playbackRate;
    }
    start (time?: number | undefined) {
        if (!this._buffer) {
            throw new Error('[SourceNode] No buffer is provided!! Play audio failed');
        }
        if (time) {
            this._domAudio.currentTime = time;
        }

        ensurePlaying(this._domAudio).catch(() => {
            console.log('play failed');
        });
    }
    pause () {
        this._domAudio.pause();
    }
    stop () {
        this._domAudio.pause();
        this._domAudio.currentTime = 0;
    }
    onEnded (callback: () => void) {
        this._onExternalEnded = callback;
    }
    _onEnded () {
        this._onExternalEnded && this._onExternalEnded();
    }
    _onExternalEnded: (() => void) | undefined;
}
