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
import { VFXExecutionStageFlags, VFXModule, VFXStage } from '../vfx-module';
import { TWO_PI, Vec3, clamp } from '../../core';
import { ShapeLocationModule } from './shape-location';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { degreesToRadians } from '../../core/utils/misc';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const pos = new Vec3();

@ccclass('cc.ConeLocationModule')
@VFXModule.register('ConeLocation', VFXExecutionStageFlags.SPAWN, [P_POSITION.name])
export class ConeLocationModule extends ShapeLocationModule {
    @type(FloatExpression)
    get length () {
        if (!this._length) {
            this._length = new ConstantFloatExpression(0.5);
        }
        return this._length;
    }

    set length (val) {
        this._length = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    get angle () {
        if (!this._angle) {
            this._angle = new ConstantFloatExpression(30);
        }
        return this._angle;
    }

    set angle (val) {
        this._angle = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    get innerAngle () {
        if (!this._innerAngle) {
            this._innerAngle = new ConstantFloatExpression(0);
        }
        return this._innerAngle;
    }

    set innerAngle (val) {
        this._innerAngle = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    get radialAngle () {
        if (!this._radialAngle) {
            this._radialAngle = new ConstantFloatExpression(360);
        }
        return this._radialAngle;
    }

    set radialAngle (val) {
        this._radialAngle = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    get surfaceDistribution () {
        if (!this._surfaceDistribution) {
            this._surfaceDistribution = new ConstantFloatExpression(0);
        }
        return this._surfaceDistribution;
    }

    set surfaceDistribution (val) {
        this._surfaceDistribution = val;
        this.requireRecompile();
    }

    @serializable
    private _length: FloatExpression | null = null;
    @serializable
    private _angle: FloatExpression | null = null;
    @serializable
    private _innerAngle: FloatExpression | null = null;
    @serializable
    private _radialAngle: FloatExpression | null = null;
    @serializable
    private _surfaceDistribution: FloatExpression | null = null;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        this.length.compile(parameterMap, this);
        this.angle.compile(parameterMap, this);
        this.innerAngle.compile(parameterMap, this);
        this.radialAngle.compile(parameterMap, this);
        this.surfaceDistribution.compile(parameterMap, this);
    }

    public execute (parameterMap: VFXParameterMap) {
        super.execute(parameterMap);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const lengthExp = this._length as FloatExpression;
        const angleExp = this._angle as FloatExpression;
        const innerAngleExp = this._innerAngle as FloatExpression;
        const radialAngleExp = this._radialAngle as FloatExpression;
        const surfaceDistributionExp = this._surfaceDistribution as FloatExpression;
        lengthExp.bind(parameterMap);
        angleExp.bind(parameterMap);
        innerAngleExp.bind(parameterMap);
        radialAngleExp.bind(parameterMap);
        surfaceDistributionExp.bind(parameterMap);

        const randomStream = this.randomStream;
        for (let i = fromIndex; i < toIndex; ++i) {
            const length = lengthExp.evaluate(i);
            const angle = Math.cos(degreesToRadians(angleExp.evaluate(i) * 0.5));
            const innerAngle = Math.cos((1 - innerAngleExp.evaluate(i) * 0.5 / 360) * TWO_PI);
            const phi = Math.acos(randomStream.getFloatFromRange(angle, innerAngle));
            const radialAngle = clamp(degreesToRadians(radialAngleExp.evaluate(i)), 0, TWO_PI);
            const theta = randomStream.getFloatFromRange(0, radialAngle);
            Vec3.set(pos, Math.cos(theta), Math.sin(theta), 0);
            Vec3.multiplyScalar(pos, pos, Math.sin(phi));
            pos.z = Math.cos(phi);
            const surfaceDistribution = Math.max(surfaceDistributionExp.evaluate(i), 0);
            const distribution = randomStream.getFloatFromRange(surfaceDistribution, 1) ** 0.33333;
            Vec3.multiplyScalar(pos, pos, distribution * length);
            this.storePosition(i, pos, position);
        }
    }
}
