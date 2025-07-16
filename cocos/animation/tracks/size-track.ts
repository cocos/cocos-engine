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
import { RealCurve, Size } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { Channel, RealChannel, RuntimeBinding, Track, TrackEval } from './track';
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
    public channels (): [RealChannel, RealChannel] {
        return this._channels;
    }

    /**
     * @internal
     */
    public [createEvalSymbol] (): SizeTrackEval {
        return new SizeTrackEval(
            maskIfEmpty(this._channels[0].curve),
            maskIfEmpty(this._channels[1].curve),
        );
    }

    @serializable
    private _channels: [RealChannel, RealChannel];
}

export class SizeTrackEval implements TrackEval<Size> {
    constructor (
        private _width: RealCurve | undefined,
        private _height: RealCurve | undefined,
    ) {

    }

    public get requiresDefault (): boolean {
        return !this._width || !this._height;
    }

    public evaluate (time: number, defaultValue?: Readonly<Size>): Size {
        if (defaultValue) {
            this._result.x = defaultValue.x;
            this._result.y = defaultValue.y;
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
