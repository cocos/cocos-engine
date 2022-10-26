import { ccclass, serializable } from 'cc.decorator';
import { RealCurve } from '../../core/curves';
import { Size } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { Channel, RealChannel, RuntimeBinding, Track } from './track';
import { maskIfEmpty } from './utils';

const CHANNEL_NAMES: ReadonlyArray<string> = ['Width', 'Height'];

/**
 * @en
 * A size track animates a size attribute of target.
 * @zh
 * 尺寸轨道描述目标上某个尺寸属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}SizeTrack`)
export class SizeTrack extends Track {
    constructor () {
        super();
        this._channels = new Array(2) as SizeTrack['_channels'];
        for (let i = 0; i < this._channels.length; ++i) {
            const channel = new Channel<RealCurve>(new RealCurve());
            channel.name = CHANNEL_NAMES[i];
            this._channels[i] = channel;
        }
    }

    /**
     * @en The width channel and the height channel of the track.
     * @zh 返回此轨道的宽度通道和高度通道。
     * @returns An readonly array in which
     * the first element is the width channel and the second element is the height channel.
     */
    public channels () {
        return this._channels;
    }

    /**
     * @internal
     */
    public [createEvalSymbol] () {
        return new SizeTrackEval(
            maskIfEmpty(this._channels[0].curve),
            maskIfEmpty(this._channels[1].curve),
        );
    }

    @serializable
    private _channels: [RealChannel, RealChannel];
}

export class SizeTrackEval {
    constructor (
        private _width: RealCurve | undefined,
        private _height: RealCurve | undefined,
    ) {

    }

    public evaluate (time: number, runtimeBinding: RuntimeBinding) {
        if ((!this._width || !this._height) && runtimeBinding.getValue) {
            const size = runtimeBinding.getValue() as Size;
            this._result.x = size.x;
            this._result.y = size.y;
        }

        if (this._width) {
            this._result.width = this._width.evaluate(time);
        }
        if (this._height) {
            this._result.height = this._height.evaluate(time);
        }

        return this._result;
    }

    private _result: Size = new Size();
}
