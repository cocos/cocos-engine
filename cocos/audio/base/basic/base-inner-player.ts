import { AudioPCMDataView, AudioState, AudioType } from '../../type';
import { enqueueOperation, OperationInfo, OperationQueueable } from './operation-queue';
import { EventTarget } from '../../../core';

export abstract class BaseInnerOneShotAudio {
    abstract get onPlay ();
    abstract set onPlay (cb);
    abstract get onEnd ();
    abstract set onEnd (cb);
    public abstract play (): void;
    public abstract stop (): void;
}
export abstract class BaseInnerAudioPlayer implements OperationQueueable {
    protected _state: AudioState = AudioState.INIT;

    public abstract _eventTarget: EventTarget;
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public abstract _operationQueue: OperationInfo[];

    abstract destroy();
    static load: (url: string) => Promise<BaseInnerAudioPlayer>;

    static loadOneShotAudio: (url: string, volume: number) => Promise<BaseInnerOneShotAudio>;
    protected abstract _onEnded: () => void;
    protected abstract _onHide ();
    protected abstract _onShow ();

    abstract readonly src;
    abstract readonly type: AudioType;
    abstract readonly state: AudioState;
    abstract loop: boolean;
    abstract volume: number;
    abstract readonly duration: number;
    abstract readonly currentTime: number;
    abstract readonly sampleRate: number;

    public abstract getPCMData (channelIndex: number): AudioPCMDataView | undefined;

    abstract seek (time: number): Promise<void>;
    abstract play (): Promise<void>;
    abstract pause (): Promise<void>;
    abstract stop (): Promise<void>;
    abstract onInterruptionBegin (cb: () => void);
    abstract offInterruptionBegin (cb?: () => void);
    abstract onInterruptionEnd (cb: () => void);
    abstract offInterruptionEnd (cb?: () => void);
    abstract onEnded (cb: () => void);
    abstract offEnded (cb?: () => void);
}
