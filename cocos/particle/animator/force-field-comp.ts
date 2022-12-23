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

import { ccclass, displayOrder, serializable, type } from '../../core/data/decorators';
import CurveRange from './curve-range';
import ForceField from './force-field';
import { Component, Mat4 } from '../../core';
import { ShapeType } from '../enum';
import { forceFieldManager } from '../force-field-manager';

const _tempWorldTrans = new Mat4();

@ccclass('cc.ForceFieldComp')
export class ForceFieldComp extends Component {
    private _field: ForceField;

    public get field () {
        return this._field;
    }

    @type(ShapeType)
    @serializable
    @displayOrder(7)
    private _shape;

    set shape (value) {
        this._shape = value;
        this._field.mode = this._shape;
    }

    get shape () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._shape;
    }

    @serializable
    @displayOrder(8)
    private _startRange = 0;

    set startRange (value) {
        this._startRange = value;
        this._field.startRange = this._startRange;
    }

    get startRange () {
        return this._startRange;
    }

    @serializable
    @displayOrder(9)
    private _endRange = 1;

    set endRange (value) {
        this._endRange = value;
        this._field.endRange = this._endRange;
    }

    get endRange () {
        return this._endRange;
    }

    @type(CurveRange)
    @serializable
    @displayOrder(0)
    public directionX = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(1)
    public directionY = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(2)
    public directionZ = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(3)
    public gravity = new CurveRange();

    @serializable
    @displayOrder(10)
    private _gravityFocus = 0;

    set gravityFocus (value) {
        this._gravityFocus = value;
        this._field.gravityFocus = this._gravityFocus;
    }

    get gravityFocus () {
        return this._gravityFocus;
    }

    @type(CurveRange)
    @serializable
    @displayOrder(4)
    public rotationSpeed = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(5)
    public rotationAttraction = new CurveRange();

    @serializable
    @displayOrder(11)
    private _rotationRandomnessX = 0;

    set rotationRandomnessX (value) {
        this._rotationRandomnessX = value;
        this._field.setRotationRandomness(this._rotationRandomnessX, this._rotationRandomnessY);
    }

    get rotationRandomnessX () {
        return this._rotationRandomnessX;
    }

    @serializable
    @displayOrder(12)
    private _rotationRandomnessY = 0;

    set rotationRandomnessY (value) {
        this._rotationRandomnessY = value;
        this._field.setRotationRandomness(this._rotationRandomnessX, this._rotationRandomnessY);
    }

    get rotationRandomnessY () {
        return this._rotationRandomnessY;
    }

    @type(CurveRange)
    @serializable
    @displayOrder(6)
    public drag = new CurveRange();

    @serializable
    @displayOrder(13)
    private _multiplyDragByParticleSize = true;

    set multiplyDragByParticleSize (value) {
        this._multiplyDragByParticleSize = value;
        this._field.multiplyDragByParticleSize = this._multiplyDragByParticleSize;
    }

    get multiplyDragByParticleSize () {
        return this._multiplyDragByParticleSize;
    }

    @serializable
    @displayOrder(14)
    private _multiplyDragByParticleVelocity = true;

    set multiplyDragByParticleVelocity (value) {
        this._multiplyDragByParticleVelocity = value;
        this._field.multiplyDragByParticleVelocity = this._multiplyDragByParticleVelocity;
    }

    get multiplyDragByParticleVelocity () {
        return this._multiplyDragByParticleVelocity;
    }

    constructor () {
        super();
        this._field = new ForceField();
    }

    protected update (dt: number) {
        this.node.getWorldMatrix(_tempWorldTrans);
        this._field.fieldLocalToWorld = _tempWorldTrans;

        this._field.directionCacheX = this.directionX;
        this._field.directionCacheY = this.directionY;
        this._field.directionCacheZ = this.directionZ;
        this._field.gravityCache = this.gravity;
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
