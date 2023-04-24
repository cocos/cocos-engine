/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, displayOrder, executeInEditMode, executionOrder, menu, serializable, type } from '../../core/data/decorators';
import CurveRange from './curve-range';
import ForceField from './force-field';
import { Component, Mat4 } from '../../core';
import { ShapeType } from '../enum';
import { forceFieldManager } from '../force-field-manager';

const _tempWorldTrans = new Mat4();

@ccclass('cc.ForceFieldComp')
@menu('Effects/ForceFieldComp')
@executionOrder(99)
@executeInEditMode
export class ForceFieldComp extends Component {
    private _field: ForceField;

    public get field () {
        return this._field;
    }

    @type(ShapeType)
    @serializable
    @displayOrder(0)
    public shape = ShapeType.Box;

    @serializable
    @displayOrder(1)
    public startRange = 0;

    @serializable
    @displayOrder(2)
    public endRange = 1;

    @type(CurveRange)
    @serializable
    @displayOrder(3)
    public directionX = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(4)
    public directionY = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(5)
    public directionZ = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(6)
    public gravity = new CurveRange();

    @serializable
    @displayOrder(7)
    public gravityFocus = 0;

    @type(CurveRange)
    @serializable
    @displayOrder(8)
    public rotationSpeed = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(9)
    public rotationAttraction = new CurveRange();

    @serializable
    @displayOrder(10)
    public rotationRandomnessX = 0;

    @serializable
    @displayOrder(11)
    public rotationRandomnessY = 0;

    @type(CurveRange)
    @serializable
    @displayOrder(12)
    public drag = new CurveRange();

    @serializable
    @displayOrder(13)
    public multiplyDragByParticleSize = true;

    @serializable
    @displayOrder(14)
    public multiplyDragByParticleVelocity = true;

    constructor () {
        super();
        this._field = new ForceField();
    }

    public updateFirst () {
        this._field.updateFirst();
    }

    protected update (dt: number) {
        this.node.getWorldMatrix(_tempWorldTrans);
        this._field.fieldLocalToWorld = _tempWorldTrans;

        this._field.mode = this.shape;
        this._field.startRange = this.startRange;
        this._field.endRange = this.endRange;
        this._field.setRotationRandomness(this.rotationRandomnessX, this.rotationRandomnessY);
        this._field.multiplyDragByParticleSize = this.multiplyDragByParticleSize;
        this._field.multiplyDragByParticleVelocity = this.multiplyDragByParticleVelocity;

        this._field.directionCacheX = this.directionX;
        this._field.directionCacheY = this.directionY;
        this._field.directionCacheZ = this.directionZ;
        this._field.gravityCache = this.gravity;
        this._field.gravityFocus = this.gravityFocus;
        this._field.rotationSpeedCache = this.rotationSpeed;
        this._field.rotationAttractionCache = this.rotationAttraction;
        this._field.dragCache = this.drag;
    }

    protected onEnable () {
        forceFieldManager.addForceField(this);
    }

    protected onDisable () {
        forceFieldManager.removeForceField(this);
    }
}
