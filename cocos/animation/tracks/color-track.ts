/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, serializable } from 'cc.decorator';
import { RealCurve, Color } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { Channel, RealChannel, RuntimeBinding, Track, TrackEval } from './track';
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
    public channels (): [RealChannel, RealChannel, RealChannel, RealChannel] {
        return this._channels;
    }

    /**
     * @internal
     */
    public [createEvalSymbol] (): ColorTrackEval {
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

export class ColorTrackEval implements TrackEval<Color> {
    constructor (
        private _x: RealCurve | undefined,
        private _y: RealCurve | undefined,
        private _z: RealCurve | undefined,
        private _w: RealCurve | undefined,
    ) {

    }

    public get requiresDefault (): boolean {
        return !this._x || !this._y || !this._z || !this._w;
    }

    public evaluate (time: number, defaultValue?: Color): Color {
        if (defaultValue) {
            Color.copy(this._result, defaultValue);
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
