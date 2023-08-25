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
import { RealCurve, Vec2, Vec3, Vec4 } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { Channel, RealChannel, RuntimeBinding, Track, TrackEval } from './track';
import { maskIfEmpty } from './utils';

const CHANNEL_NAMES: ReadonlyArray<string> = ['X', 'Y', 'Z', 'W'];

/**
 * @en
 * A vector track animates a vector(in 2, 3, 4 dimension) attribute of target.
 * @zh
 * 向量轨道描述目标上某个（二、三、四维）向量属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}VectorTrack`)
export class VectorTrack extends Track {
    constructor () {
        super();
        this._channels = new Array(4) as VectorTrack['_channels'];
        for (let i = 0; i < this._channels.length; ++i) {
            const channel = new Channel<RealCurve>(new RealCurve());
            channel.name = CHANNEL_NAMES[i];
            this._channels[i] = channel;
        }
    }

    /**
     * @en Gets or sets the count of components(dimension) available while evaluating of this track.
     * @zh 获取或设置此轨道在求值时有效的分量数（维度）。
     */
    get componentsCount (): number {
        return this._nComponents;
    }

    set componentsCount (value) {
        this._nComponents = value;
    }

    /**
     * @en The four channel of the track.
     * @zh 返回此轨道的四条通道。
     * @returns An readonly four length array in which
     * the element at n denotes the channel of n-th vector component.
     */
    public channels (): [RealChannel, RealChannel, RealChannel, RealChannel] {
        return this._channels;
    }

    /**
     * @internal
     */
    public [createEvalSymbol] (): Vec2TrackEval | Vec3TrackEval | Vec4TrackEval {
        switch (this._nComponents) {
        default:
        case 2:
            return new Vec2TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
            );
        case 3:
            return new Vec3TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
                maskIfEmpty(this._channels[2].curve),
            );
        case 4:
            return new Vec4TrackEval(
                maskIfEmpty(this._channels[0].curve),
                maskIfEmpty(this._channels[1].curve),
                maskIfEmpty(this._channels[2].curve),
                maskIfEmpty(this._channels[3].curve),
            );
        }
    }

    @serializable
    private _channels: [RealChannel, RealChannel, RealChannel, RealChannel];

    @serializable
    private _nComponents: number = 4;
}

export class Vec2TrackEval implements TrackEval<Vec2> {
    constructor (private _x: RealCurve | undefined, private _y: RealCurve | undefined) {

    }

    public get requiresDefault (): boolean {
        return !this._x || !this._y;
    }

    public evaluate (time: number, defaultValue?: Readonly<Vec2>): Vec2 {
        if (defaultValue) {
            Vec2.copy(this._result, defaultValue);
        }

        if (this._x) {
            this._result.x = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.y = this._y.evaluate(time);
        }

        return this._result;
    }

    private _result: Vec2 = new Vec2();
}

export class Vec3TrackEval implements TrackEval<Vec3> {
    constructor (private _x: RealCurve | undefined, private _y: RealCurve | undefined, private _z: RealCurve | undefined) {

    }

    public get requiresDefault (): boolean {
        return !this._x || !this._y || !this._z;
    }

    public evaluate (time: number, defaultValue?: Readonly<Vec3>): Vec3 {
        const { _x, _y, _z, _result } = this;
        if (defaultValue) {
            Vec3.copy(_result, defaultValue);
        }
        if (_x) {
            _result.x = _x.evaluate(time);
        }
        if (_y) {
            _result.y = _y.evaluate(time);
        }
        if (_z) {
            _result.z = _z.evaluate(time);
        }
        return _result;
    }

    private _result: Vec3 = new Vec3();
}

export class Vec4TrackEval implements TrackEval<Vec4> {
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

    public evaluate (time: number, defaultValue?: Readonly<Vec4>): Vec4 {
        if (defaultValue) {
            Vec4.copy(this._result, defaultValue);
        }

        if (this._x) {
            this._result.x = this._x.evaluate(time);
        }
        if (this._y) {
            this._result.y = this._y.evaluate(time);
        }
        if (this._z) {
            this._result.z = this._z.evaluate(time);
        }
        if (this._w) {
            this._result.w = this._w.evaluate(time);
        }

        return this._result;
    }

    private _result: Vec4 = new Vec4();
}
