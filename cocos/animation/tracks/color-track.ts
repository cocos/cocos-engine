import { ccclass, serializable } from 'cc.decorator';
import { RealCurve, Color } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { Channel, RealChannel, RuntimeBinding, Track } from './track';
import { maskIfEmpty } from './utils';

const CHANNEL_NAMES: ReadonlyArray<string> = ['Red', 'Green', 'Blue', 'Alpha'];

/**
 * @en
 * A color track animates a color attribute of target.
 * @zh
 * 颜色轨道描述目标上某个颜色属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}ColorTrack`)
export class ColorTrack extends Track {
    constructor () {
        super();
        this._channels = new Array(4) as ColorTrack['_channels'];
        for (let i = 0; i < this._channels.length; ++i) {
            const channel = new Channel<RealCurve>(new RealCurve());
            channel.name = CHANNEL_NAMES[i];
            this._channels[i] = channel;
        }
    }

    /**
     * @en The four channel of the track.
     * @zh 返回此轨道的四条通道。
     * @returns An readonly four length array in which
     * the element at n denotes the channel of n-th(in order of RGBA) color component(in form of integer within 0-255).
     */
    public channels () {
        return this._channels;
    }

    /**
     * @internal
     */
    public [createEvalSymbol] () {
        return new ColorTrackEval(
            maskIfEmpty(this._channels[0].curve),
            maskIfEmpty(this._channels[1].curve),
            maskIfEmpty(this._channels[2].curve),
            maskIfEmpty(this._channels[3].curve),
        );
    }

    @serializable
    private _channels: [RealChannel, RealChannel, RealChannel, RealChannel];
}

export class ColorTrackEval {
    constructor (
        private _x: RealCurve | undefined,
        private _y: RealCurve | undefined,
        private _z: RealCurve | undefined,
        private _w: RealCurve | undefined,
    ) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._x || !this._y || !this._z || !this._w) && runtimeBinding.getValue) {
            Color.copy(this._result, runtimeBinding.getValue() as Color);
        }

        if (this._x) {
            this._result.r = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.g = this._y.evaluate(time);
        }
        if (this._z) {
            this._result.b = this._z.evaluate(time);
        }
        if (this._w) {
            this._result.a = this._w.evaluate(time);
        }

        return this._result;
    }

    private _result: Color = new Color();
}
