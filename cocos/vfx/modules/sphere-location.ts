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
import { ccclass, serializable, type, visible } from 'cc.decorator';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { clamp, Enum, TWO_PI, Vec2, Vec3 } from '../../core';
import { ConstantFloatExpression, ConstantVec2Expression, FloatExpression, Vec2Expression } from '../expressions';
import { DistributionMode, ShapeLocationModule } from './shape-location';
import { degreesToRadians } from '../../core/utils/misc';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const pos = new Vec3();
const distribution = new Vec2();

@ccclass('cc.SphereLocationModule')
@VFXModule.register('SphereLocation', ModuleExecStageFlags.SPAWN, [P_POSITION.name])
export class SphereLocationModule extends ShapeLocationModule {
    @type(FloatExpression)
    public get radius () {
        if (!this._radius) {
            this._radius = new ConstantFloatExpression(1);
        }
        return this._radius;
    }

    public set radius (val) {
        this._radius = val;
    }

    @type(Enum(DistributionMode))
    @serializable
    public distributionMode = DistributionMode.RANDOM;

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.RANDOM; })
    public get surfaceDistribution () {
        if (!this._surfaceDistribution) {
            this._surfaceDistribution = new ConstantFloatExpression(1);
        }
        return this._surfaceDistribution;
    }

    public set surfaceDistribution (val) {
        this._surfaceDistribution = val;
    }

    @type(Vec2Expression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.RANDOM; })
    public get hemisphereDistribution () {
        if (!this._hemisphereDistribution) {
            this._hemisphereDistribution = new ConstantVec2Expression(new Vec2(360, 360));
        }
        return this._hemisphereDistribution;
    }

    public set hemisphereDistribution (val) {
        this._hemisphereDistribution = val;
    }

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.DIRECT; })
    public get uPosition () {
        if (!this._uPosition) {
            this._uPosition = new ConstantFloatExpression(0);
        }
        return this._uPosition;
    }

    public set uPosition (val) {
        this._uPosition = val;
    }

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.DIRECT; })
    public get vPosition () {
        if (!this._vPosition) {
            this._vPosition = new ConstantFloatExpression(0.5);
        }
        return this._vPosition;
    }

    public set vPosition (val) {
        this._vPosition = val;
    }

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.DIRECT; })
    public get radiusPosition () {
        if (!this._radiusPosition) {
            this._radiusPosition = new ConstantFloatExpression(1);
        }
        return this._radiusPosition;
    }

    public set radiusPosition (val) {
        this._radiusPosition = val;
    }

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.UNIFORM; })
    public get uniformDistribution () {
        if (!this._uniformDistribution) {
            this._uniformDistribution = new ConstantFloatExpression(1);
        }
        return this._uniformDistribution;
    }

    public set uniformDistribution (val) {
        this._uniformDistribution = val;
    }

    @type(FloatExpression)
    @visible(function (this: SphereLocationModule) { return this.distributionMode === DistributionMode.UNIFORM; })
    public get uniformSpiralAmount () {
        if (!this._uniformSpiralAmount) {
            this._uniformSpiralAmount = new ConstantFloatExpression(0);
        }
        return this._uniformSpiralAmount;
    }

    public set uniformSpiralAmount (val) {
        this._uniformSpiralAmount = val;
    }

    @serializable
    private _radius: FloatExpression | null = null;
    @serializable
    private _surfaceDistribution: FloatExpression | null = null;
    @serializable
    private _hemisphereDistribution: Vec2Expression | null = null;
    @serializable
    private _uPosition: FloatExpression | null = null;
    @serializable
    private _vPosition: FloatExpression | null = null;
    @serializable
    private _radiusPosition: FloatExpression | null = null;
    @serializable
    private _uniformDistribution: FloatExpression | null = null;
    @serializable
    private _uniformSpiralAmount: FloatExpression | null = null;

    public tick (parameterMap: VFXParameterMap) {
        super.tick(parameterMap);
        this.radius.tick(parameterMap);
        if (this.distributionMode === DistributionMode.RANDOM) {
            this.surfaceDistribution.tick(parameterMap);
            this.hemisphereDistribution.tick(parameterMap);
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            this.uPosition.tick(parameterMap);
            this.vPosition.tick(parameterMap);
            this.radiusPosition.tick(parameterMap);
        } else {
            this.uniformDistribution.tick(parameterMap);
            this.uniformSpiralAmount.tick(parameterMap);
        }
    }

    public execute (parameterMap: VFXParameterMap) {
        super.execute(parameterMap);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const radiusExp = this._radius as FloatExpression;
        radiusExp.bind(parameterMap);
        if (this.distributionMode === DistributionMode.RANDOM) {
            const surfaceDistributionExp = this._surfaceDistribution as FloatExpression;
            const hemisphereDistributionExp = this._hemisphereDistribution as Vec2Expression;
            surfaceDistributionExp.bind(parameterMap);
            hemisphereDistributionExp.bind(parameterMap);
            const random = this.randomStream;
            for (let i = fromIndex; i < toIndex; ++i) {
                hemisphereDistributionExp.evaluate(i, distribution);
                const surfaceDistribution = Math.max(surfaceDistributionExp.evaluate(i), 0);
                const radialAngle = clamp(degreesToRadians(distribution.x), 0, TWO_PI);
                const angle = Math.acos(random.getFloatFromRange(Math.cos(degreesToRadians(distribution.y * 0.5)), 1));
                const theta = random.getFloatFromRange(0, radialAngle);
                Vec3.set(pos, Math.cos(theta), Math.sin(theta), 0);
                Vec3.multiplyScalar(pos, pos, Math.sin(angle));
                pos.z = Math.cos(angle);
                Vec3.multiplyScalar(pos, pos, random.getFloatFromRange(surfaceDistribution, 1.0) ** 0.3333 * radiusExp.evaluate(i));
                this.storePosition(i, pos, position);
            }
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            const uPositionExp = this._uPosition as FloatExpression;
            const vPositionExp = this._vPosition as FloatExpression;
            const radiusPositionExp = this._radiusPosition as FloatExpression;
            uPositionExp.bind(parameterMap);
            vPositionExp.bind(parameterMap);
            radiusPositionExp.bind(parameterMap);

            for (let i = fromIndex; i < toIndex; ++i) {
                const u = uPositionExp.evaluate(i);
                const v = vPositionExp.evaluate(i);
                const r = radiusPositionExp.evaluate(i);

                const cosTheta = (Math.abs(v) % 1) * 2 - 1;
                const phi = u * TWO_PI;
                const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
                Vec3.set(pos, Math.cos(phi) * sinTheta, Math.sin(phi) * sinTheta, cosTheta);
                Vec3.multiplyScalar(pos, pos, r * radiusExp.evaluate(i));
                this.storePosition(i, pos, position);
            }
        } else {
            const uniformDistributionExp = this._uniformDistribution as FloatExpression;
            const uniformSpiralAmountExp = this._uniformSpiralAmount as FloatExpression;
            uniformDistributionExp.bind(parameterMap);
            uniformSpiralAmountExp.bind(parameterMap);
            const uniformCount = toIndex - fromIndex - 1;
            for (let i = fromIndex; i < toIndex; ++i) {
                const spiralAmount = uniformSpiralAmountExp.evaluate(i);
                const uniformDistrib = uniformDistributionExp.evaluate(i);
                const azimuthalAngle = Math.acos(1 - (clamp(uniformDistrib, 0, 1) * 2 * (i - fromIndex) / uniformCount));
                const polarAngle = (i - fromIndex) * spiralAmount * TWO_PI / 1.618033;
                const cosPolarAngle = Math.cos(polarAngle);
                const sinPolarAngle = Math.sin(polarAngle);
                const cosAzimuthalAngle = Math.cos(azimuthalAngle);
                const sinAzimuthalAngle = Math.sin(azimuthalAngle);
                Vec3.set(pos, cosPolarAngle * sinAzimuthalAngle, sinPolarAngle * sinAzimuthalAngle, cosAzimuthalAngle);
                Vec3.multiplyScalar(pos, pos, radiusExp.evaluate(i));
                this.storePosition(i, pos, position);
            }
        }
    }
}
