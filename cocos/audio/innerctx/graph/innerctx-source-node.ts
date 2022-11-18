import { minigame } from 'pal/minigame';
import { clamp, clamp01 } from '../../../core/math';
import { CCSourceNode } from '../../base';
import { InnerctxAudioBuffer } from './innerctx-audio-buffer';
import { InnerctxAudioContext } from './innerctx-audio-context';
import { InnerctxAudioNode } from './innerctx-audio-node';
import { ctxAudioPool } from './innerctx-audio-pool';

function ensurePlaying (innerctxAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = innerctxAudio.play();
        console.log('ensure play');
        if (promise === undefined) {  // Chrome50/Firefox53 below
            resolve();
        }
        promise.then(resolve).catch(() => {
            const onGesture = () => {
                innerctxAudio.play().catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { once: true });
            canvas?.addEventListener('mousedown', onGesture, { once: true });
        });
        return null;
    });
}
export class InnerctxSourceNode extends InnerctxAudioNode implements CCSourceNode {
    private _buffer: InnerctxAudioBuffer | null = null;
    private _innerctxAudio: InnerAudioContext;
    get buffer (): InnerctxAudioBuffer {
        if (!this._buffer) {
            throw new Error('No buffer avaliable');
        }
        return this._buffer;
    }
    set buffer (buffer: InnerctxAudioBuffer) {
        this._buffer = buffer;
        if (this._innerctxAudio) {
            this._innerctxAudio.src = buffer.url;
        } else {
            this._innerctxAudio = ctxAudioPool.alloc(buffer.url);
        }
    }
    constructor (ctx: InnerctxAudioContext, buffer?: InnerctxAudioBuffer) {
        super(ctx);
        if (buffer) {
            this._buffer = buffer;
            this._innerctxAudio = ctxAudioPool.alloc(this._buffer.url);
        } else {
            this._innerctxAudio = minigame.createInnerAudioContext();
        }
        this._innerctxAudio.volume = this._weight * this._gain;
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
        this._innerctxAudio.volume = this._weight * this._gain;
    }
    get loop () {
        return this._innerctxAudio.loop;
    }
    set loop (loop:boolean) {
        this._innerctxAudio.loop = loop;
    }
    get currentTime (): number {
        return this._innerctxAudio.currentTime;
    }

    set currentTime (time: number) {
        if (!this._buffer) {
            throw new Error('No buffer is provided');
        }
        this._innerctxAudio.currentTime = time;
    }
    set playbackRate (rate: number) {
        throw new Error('Cannot manipulate playback rate on current backend');
    }
    get playbackRate (): number {
        console.warn('Cannot manipulate playback rate on current backend');
        return 1;
    }
    start (time?: number | undefined) {
        if (!this._buffer) {
            throw new Error('[SourceNode] No buffer is provided!! Play audio failed');
        }
        if (time) {
            this._innerctxAudio.currentTime = time;
        }
        this._innerctxAudio.play();
    }
    pause () {
        this._innerctxAudio.pause();
    }
    stop () {
        this._innerctxAudio.pause();
        this._innerctxAudio.currentTime = 0;
    }
    onEnded (callback: () => void) {
        this._onExternalEnded = callback;
    }
    _onEnded () {
        this._onExternalEnded && this._onExternalEnded();
    }
    _onExternalEnded: (() => void) | undefined;
}
