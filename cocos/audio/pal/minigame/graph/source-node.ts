import { minigame } from 'pal/minigame';
import { clamp, clamp01 } from '../../../../core/math';
import { CCAudioBuffer } from './audio-buffer';
import { CCAudioContext } from './audio-context';
import { CCAudioNode, NodeType } from './audio-node';
import { ctxAudioPool } from './audio-pool';

function ensurePlaying (CCAudio: HTMLAudioElement): Promise<void> {
    return new Promise((resolve) => {
        const promise = CCAudio.play();
        if (promise === undefined) {  // Chrome50/Firefox53 below
            resolve();
        }
        promise.then(resolve).catch(() => {
            const onGesture = () => {
                CCAudio.play().catch((e) => {});
                resolve();
            };
            const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
            canvas?.addEventListener('touchend', onGesture, { once: true });
            canvas?.addEventListener('mousedown', onGesture, { once: true });
        });
        return null;
    });
}
export class CCSourceNode extends CCAudioNode implements CCSourceNode {
    protected _type: NodeType = NodeType.SOURCE;
    innerOperation: (() => void) | undefined;
    private _buffer: CCAudioBuffer | null = null;
    private _CCAudio: InnerAudioContext;
    get buffer (): CCAudioBuffer {
        if (!this._buffer) {
            throw new Error('No buffer avaliable');
        }
        return this._buffer;
    }
    set buffer (buffer: CCAudioBuffer) {
        this._buffer = buffer;
        if (this._CCAudio) {
            this._CCAudio.src = buffer.url;
        } else {
            this._CCAudio = ctxAudioPool.alloc(buffer.url);
        }
    }
    constructor (ctx: CCAudioContext, buffer?: CCAudioBuffer) {
        super(ctx);
        if (buffer) {
            this._buffer = buffer;
            this._CCAudio = ctxAudioPool.alloc(this._buffer.url);
        } else {
            this._CCAudio = minigame.createInnerAudioContext();
        }
        this._CCAudio.volume = this._weight * this._gain;
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
        this._CCAudio.volume = this._weight * this._gain;
    }
    get loop () {
        return this._CCAudio.loop;
    }
    set loop (loop:boolean) {
        this._CCAudio.loop = loop;
    }
    get currentTime (): number {
        return this._CCAudio.currentTime;
    }

    set currentTime (time: number) {
        if (!this._buffer) {
            throw new Error('No buffer is provided');
        }
        this._CCAudio.currentTime = time;
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
            this._CCAudio.currentTime = time;
        }
        this._CCAudio.play();
    }
    pause () {
        this._CCAudio.pause();
    }
    stop () {
        this._CCAudio.pause();
        this._CCAudio.currentTime = 0;
    }
    onEnded (callback: () => void) {
        this._onExternalEnded = callback;
    }
    _onEnded () {
        this._onExternalEnded && this._onExternalEnded();
    }
    _onExternalEnded: (() => void) | undefined;
}
