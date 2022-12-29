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

import b2 from '@cocos/box2d';
import { ISliderJoint } from '../../spec/i-physics-joint';
import { b2Joint } from './joint-2d';
import { SliderJoint2D } from '../../framework';
import { PHYSICS_2D_PTM_RATIO } from '../../framework/physics-types';
import { toRadian } from '../../../core';

export class b2SliderJoint extends b2Joint implements ISliderJoint {
    // limit
    enableLimit (v: boolean) {
        if (this._b2joint) {
            (this._b2joint as b2.PrismaticJoint).EnableLimit(v);
        }
    }
    setLowerLimit (v: number) {
        this.updateLimits();
    }
    setUpperLimit (v: number) {
        this.updateLimits();
    }
    updateLimits () {
        if (this._b2joint) {
            const comp = this._jointComp as SliderJoint2D;
            (this._b2joint as b2.PrismaticJoint).SetLimits(comp.lowerLimit / PHYSICS_2D_PTM_RATIO, comp.upperLimit / PHYSICS_2D_PTM_RATIO);
        }
    }

    // motor
    enableMotor (v: boolean) {
        if (this._b2joint) {
            (this._b2joint as b2.PrismaticJoint).EnableMotor(v);
        }
    }
    setMaxMotorForce (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.PrismaticJoint).SetMaxMotorForce(v);
        }
    }
    setMotorSpeed (v: number) {
        if (this._b2joint) {
            (this._b2joint as b2.PrismaticJoint).SetMotorSpeed(v);
        }
    }

    _createJointDef () {
        const comp = this._jointComp as SliderJoint2D;
        const def = new b2.PrismaticJointDef();
        def.localAnchorA.Set(comp.anchor.x / PHYSICS_2D_PTM_RATIO, comp.anchor.y / PHYSICS_2D_PTM_RATIO);
        def.localAnchorB.Set(comp.connectedAnchor.x / PHYSICS_2D_PTM_RATIO, comp.connectedAnchor.y / PHYSICS_2D_PTM_RATIO);
        const angle = toRadian(comp.angle);
        def.localAxisA.Set(Math.cos(angle), Math.sin(angle));
        def.referenceAngle = 0;
        def.enableLimit = comp.enableLimit;
        def.lowerTranslation = comp.lowerLimit / PHYSICS_2D_PTM_RATIO;
        def.upperTranslation = comp.upperLimit / PHYSICS_2D_PTM_RATIO;
        def.enableMotor = comp.enableMotor;
        def.maxMotorForce = comp.maxMotorForce;
        def.motorSpeed = comp.motorSpeed;
        return def;
    }
}
