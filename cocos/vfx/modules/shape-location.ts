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

import { ccclass, serializable, type } from 'cc.decorator';
import { Mat4, Quat, Vec3 } from '../../core';
import { VFXModule, VFXStage } from '../vfx-module';
import { VFXVec3Array } from '../data';
import { BindingVec3Expression, ConstantVec3Expression, Vec3Expression } from '../expressions';
import { P_POSITION } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const originVec = new Vec3(0, 0, 0);
const tempVec1 = new Vec3(0, 0, 0);
const tempVec2 = new Vec3(0, 0, 0);
const tempVec3 = new Vec3(0, 0, 0);
const tempQuat = new Quat(0, 0, 0, 0);

/**
 * 粒子在发射形状上的分布方式
 */
export enum DistributionMode {
    /**
     * 随机位置发射。
     */
    RANDOM,

    /**
     * 设置一个位置发射。
     */
    DIRECT,

    /**
     * 均匀分布在发射器形状上，依赖此帧发射的粒子总数。可以与 burst 配合使用。
     */
    UNIFORM,
}

@ccclass('cc.ShapeLocationModule')
export abstract class ShapeLocationModule extends VFXModule {
    /**
     * @zh 粒子发射器位置。
     */
    @type(Vec3Expression)
    public get position () {
        if (!this._position) {
            this._position = new ConstantVec3Expression();
        }
        return this._position;
    }
    public set position (val) {
        this._position = val;
        this.requireRecompile();
    }

    /**
     * @zh 粒子发射器旋转角度。
     */
    @type(Vec3Expression)
    public get rotation () {
        if (!this._rotation) {
            this._rotation = new ConstantVec3Expression();
        }
        return this._rotation;
    }
    public set rotation (val) {
        this._rotation = val;
        this.requireRecompile();
    }

    /**
     * @zh 粒子发射器缩放比例。
     */
    @type(Vec3Expression)
    public get scale () {
        if (!this._scale) {
            this._scale = new ConstantVec3Expression(1, 1, 1);
        }
        return this._scale;
    }
    public set scale (val) {
        this._scale = val;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    public get origin () {
        if (!this._origin) {
            this._origin = new BindingVec3Expression(P_POSITION);
        }
        return this._origin;
    }
    public set origin (val) {
        this._origin = val;
        this.requireRecompile();
    }

    @serializable
    private _position: Vec3Expression | null = null;
    @serializable
    private _rotation: Vec3Expression | null = null;
    @serializable
    private _scale: Vec3Expression | null = null;
    @serializable
    private _origin: Vec3Expression | null = null;
    private _mat = new Mat4();
    protected storePosition = this.storePositionFast;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        this.position.compile(parameterMap, this);
        this.rotation.compile(parameterMap, this);
        this.scale.compile(parameterMap, this);
        this.origin.compile(parameterMap, this);
        parameterMap.ensure(P_POSITION);
    }

    public execute (parameterMap: VFXParameterMap) {
        const positionExp = this._position as Vec3Expression;
        const rotationExp = this._rotation as Vec3Expression;
        const scaleExp = this._scale as Vec3Expression;
        const originExp = this._origin as Vec3Expression;
        positionExp.bind(parameterMap);
        rotationExp.bind(parameterMap);
        scaleExp.bind(parameterMap);
        originExp.bind(parameterMap);
        if (positionExp.isConstant && rotationExp.isConstant && scaleExp.isConstant) {
            rotationExp.evaluate(0, tempVec1);
            Mat4.fromSRT(this._mat, Quat.fromEuler(tempQuat, tempVec1.x, tempVec1.y, tempVec1.z), positionExp.evaluate(0, tempVec2), scaleExp.evaluate(0, tempVec3));
            this.storePosition = this.storePositionFast;
        } else {
            this.storePosition = this.storePositionSlow;
        }
    }

    protected storePositionFast (index: number, pos: Vec3, position: VFXVec3Array) {
        Vec3.transformMat4(pos, pos, this._mat);
        Vec3.add(pos, pos, (this._origin as Vec3Expression).evaluate(index, originVec));
        position.setVec3At(pos, index);
    }

    protected storePositionSlow (index: number, pos: Vec3, position: VFXVec3Array) {
        (this._rotation as Vec3Expression).evaluate(index, tempVec1);
        Mat4.fromSRT(this._mat, Quat.fromEuler(tempQuat, tempVec1.x, tempVec1.y, tempVec1.z),
            (this._position as Vec3Expression).evaluate(index, tempVec2), (this._scale as Vec3Expression).evaluate(index, tempVec3));
        Vec3.transformMat4(pos, pos, this._mat);
        Vec3.add(pos, pos, (this._origin as Vec3Expression).evaluate(index, originVec));
        position.setVec3At(pos, index);
    }
}
