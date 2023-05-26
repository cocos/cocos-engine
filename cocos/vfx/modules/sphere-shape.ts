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
import { ccclass, serializable, tooltip, type, visible } from 'cc.decorator';
import { ModuleExecStageFlags, VFXModule } from '../vfx-module';
import { clamp, Enum, TWO_PI, Vec2, Vec3 } from '../../core';
import { ParticleDataSet, POSITION } from '../particle-data-set';
import { FROM_INDEX, ModuleExecContext, TO_INDEX } from '../module-exec-context';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, ConstantVec2Expression, FloatExpression, Vec2Expression } from '../expressions';
import { DistributionMode, ShapeLocationModule } from './shape-location';
import { degreesToRadians } from '../../core/utils/misc';

const pos = new Vec3();
const distrib = new Vec2();

@ccclass('cc.SphereShapeModule')
@VFXModule.register('SphereShape', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class SphereShapeModule extends ShapeLocationModule {
    /**
      * @zh 粒子发射器半径。
      */
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
    @visible(function (this: SphereShapeModule) { return this.distributionMode === DistributionMode.RANDOM; })
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
    @visible(function (this: SphereShapeModule) { return this.distributionMode === DistributionMode.RANDOM; })
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
    @visible(function (this: SphereShapeModule) { return this.distributionMode === DistributionMode.DIRECT; })
    public get uPosition () {
        if (!this._uPosition) {
            this._uPosition = new ConstantFloatExpression(0);
        }
        return this._uPosition;
    }

    public set uPosition (val) {
        this._uPosition = val;
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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.tick(particles, emitter, user, context);
        this.radius.tick(particles, emitter, user, context);
        if (this.distributionMode === DistributionMode.RANDOM) {
            this.surfaceDistribution.tick(particles, emitter, user, context);
            this.hemisphereDistribution.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        super.execute(particles, emitter, user, context);
        const fromIndex = context.getUint32Parameter(FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(TO_INDEX).data;
        const radius = this._radius as FloatExpression;
        radius.bind(particles, emitter, user, context);
        if (this.distributionMode === DistributionMode.RANDOM) {
            const surfaceDistribution = this._surfaceDistribution as FloatExpression;
            const hemisphereDistribution = this._hemisphereDistribution as Vec2Expression;
            surfaceDistribution.bind(particles, emitter, user, context);
            hemisphereDistribution.bind(particles, emitter, user, context);
            const random = this.randomStream;
            for (let i = fromIndex; i < toIndex; ++i) {
                hemisphereDistribution.evaluate(i, distrib);
                const surfaceDistrib = Math.max(surfaceDistribution.evaluate(i), 0);
                const radialAngle = clamp(degreesToRadians(distrib.x), 0, TWO_PI);
                const angle = Math.acos(random.getFloatFromRange(Math.cos(degreesToRadians(distrib.y * 0.5)), 1));
                const theta = random.getFloatFromRange(0, radialAngle);
                Vec3.set(pos, Math.cos(theta), Math.sin(theta), 0);
                Vec3.multiplyScalar(pos, pos, Math.sin(angle));
                pos.z = Math.cos(angle);
                Vec3.multiplyScalar(pos, pos, random.getFloatFromRange(surfaceDistrib, 1.0) ** 0.3333 * radius.evaluate(i));
            }
        } else if (this.distributionMode === DistributionMode.DIRECT) {

        }
    }

    protected generatePosAndDir (index: number, angle: number, dir: Vec3, pos: Vec3) {
        const innerRadius = this._innerRadius;
        const radius = this.radius;
        const rand = this.randomStream;
        const z = rand.getFloatFromRange(-1, 1);
        const r = Math.sqrt(1 - z * z);
        Vec3.set(dir, r * Math.cos(angle), r * Math.sin(angle), z);
        Vec3.multiplyScalar(pos, dir, rand.getFloatFromRange(innerRadius, 1.0) ** 0.3333 * radius);
    }
}
