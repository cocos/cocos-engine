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

import { Joint2D } from './joint-2d';
import { IMouseJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { CCFloat, Vec2, _decorator } from '../../../../core';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.MouseJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/MouseJoint2D')
export class MouseJoint2D extends Joint2D {
    TYPE = EJoint2DType.MOUSE;

    get target (): Vec2 {
        return this._target;
    }
    set target (v) {
        this._target = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setTarget(v);
        }
    }

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹簧系数。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.frequency')
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v: number) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.dampingRatio')
    get dampingRatio (): number {
        return this._dampingRatio;
    }
    set dampingRatio (v: number) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setDampingRatio(v);
        }
    }

    /**
     * @en
     * The maximum force.
     * @zh
     * 最大阻力值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxForce')
    get maxForce (): number {
        return this._maxForce;
    }
    set maxForce (v: number) {
        this._maxForce = v;
        if (this._joint) {
            (this._joint as IMouseJoint).setMaxForce(v);
        }
    }

    update (dt): void {
        this._joint!.update!(dt);
    }

    @serializable
    private _maxForce = 1000;

    @serializable
    private _dampingRatio = 0.7;

    @serializable
    private _frequency = 5;

    private _target = new Vec2();
}
