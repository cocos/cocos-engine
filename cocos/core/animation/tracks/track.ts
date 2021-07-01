import { ccclass, serializable } from 'cc.decorator';
import type { IntegerCurve, ObjectCurve, QuaternionCurve, RealCurve } from '../../curves';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { HierarchyPath, TargetPath } from '../target-path';
import { IValueProxyFactory } from '../value-proxy';
import { Range } from './utils';

export type TrackPath = TargetPath[];

/**
 * A track describes the path of animate a target.
 * It's the basic unit of animation clip.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}Track`)
export class Track {
    @serializable
    public path: TrackPath = [];

    @serializable
    public setter!: IValueProxyFactory | undefined;

    public getChannels (): Channel[] {
        return [];
    }

    public getRange (): Range {
        const range: Range = { min: Infinity, max: -Infinity };
        for (const channel of this.getChannels()) {
            range.min = Math.min(range.min, channel.curve.rangeMin);
            range.max = Math.max(range.max, channel.curve.rangeMax);
        }
        return range;
    }

    public [createEvalSymbol] (runtimeBinding: RuntimeBinding): TrackEval {
        throw new Error(`No Impl`);
    }
}

export interface TrackEval {
    /**
     * Evaluates the track.
     * @param time The time.
     */
    evaluate(time: number, runtimeBinding: RuntimeBinding): unknown;
}

export type Curve = RealCurve | IntegerCurve | QuaternionCurve | ObjectCurve<unknown>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}Channel`)
export class Channel<T = Curve> {
    constructor (curve: T) {
        this._curve = curve;
    }

    @serializable
    public name = '';

    get curve () {
        return this._curve;
    }

    @serializable
    private _curve!: T;
}

export type RealChannel = Channel<RealCurve>;

export type IntegerChannel = Channel<IntegerCurve>;

export type QuaternionChannel = Channel<QuaternionCurve>;

@ccclass(`${CLASS_NAME_PREFIX_ANIM}SingleChannelTrack`)
export abstract class SingleChannelTrack<TCurve extends Curve> extends Track {
    constructor () {
        super();
        this._channel = new Channel<TCurve>(this.createCurve());
    }

    get channel () {
        return this._channel;
    }

    public getChannels () {
        return [this._channel];
    }

    protected createCurve (): TCurve {
        throw new Error(`Not impl`);
    }

    public [createEvalSymbol] (_runtimeBinding: RuntimeBinding): TrackEval {
        const { curve } = this._channel;
        return {
            evaluate: (time) => curve.evaluate(time),
        };
    }

    @serializable
    private _channel: Channel<TCurve>;
}

export type RuntimeBinding = {
    setValue(value: unknown): void;

    getValue?(): unknown;
};

export type Binder = (path: TrackPath, setter: IValueProxyFactory | undefined) => undefined | RuntimeBinding;

export type TrsTrackPath = [HierarchyPath, 'position' | 'rotation' | 'scale' | 'eulerAngles'];

export function isTargetingTRS (path: TargetPath[]): path is TrsTrackPath {
    let prs: string | undefined;
    if (path.length === 1 && typeof path[0] === 'string') {
        prs = path[0];
    } else if (path.length > 1) {
        for (let i = 0; i < path.length - 1; ++i) {
            if (!(path[i] instanceof HierarchyPath)) {
                return false;
            }
        }
        prs = path[path.length - 1] as string;
    }
    switch (prs) {
    case 'position':
    case 'scale':
    case 'rotation':
    case 'eulerAngles':
        return true;
    default:
        return false;
    }
}
