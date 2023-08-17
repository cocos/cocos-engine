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

import { ccclass } from 'cc.decorator';
import { QuatCurve, Quat } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { SingleChannelTrack, TrackEval } from './track';

/**
 * @en
 * A quaternion track animates a quaternion(rotation) attribute of target.
 * @zh
 * 四元数轨道描述目标上某个四元数（旋转）属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}QuatTrack`)
export class QuatTrack extends SingleChannelTrack<QuatCurve> {
    /**
     * @internal
     */
    protected createCurve (): QuatCurve {
        return new QuatCurve();
    }

    /**
     * @internal
     */
    public [createEvalSymbol] (): QuatTrackEval {
        return new QuatTrackEval(this.channels()[0].curve);
    }
}

export class QuatTrackEval implements TrackEval<Quat> {
    constructor (private _curve: QuatCurve) {

    }

    public get requiresDefault (): boolean {
        return false;
    }

    public evaluate (time: number): Quat {
        this._curve.evaluate(time, this._result);
        return this._result;
    }

    private _result: Quat = new Quat();
}
