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
import { Enum, TWO_PI, Vec3 } from '../../core';
import { POSITION, ParticleDataSet } from '../data-set/particle';
import { FROM_INDEX, ContextDataSet, TO_INDEX } from '../data-set/context';
import { EmitterDataSet } from '../data-set/emitter';
import { UserDataSet } from '../data-set/user';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { DistributionMode, ShapeLocationModule } from './shape-location';
import { Uint32Parameter, Vec3ArrayParameter } from '../parameters';

const pos = new Vec3();
@ccclass('cc.CircleLocationModule')
@VFXModule.register('CircleLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class CircleLocationModule extends ShapeLocationModule {
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

    /**
      * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
      */
    @type(Enum(DistributionMode))
    @serializable
    public distributionMode = DistributionMode.RANDOM;

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.RANDOM;
    })
    public get radiusCoverage () {
        if (!this._radiusCoverage) {
            this._radiusCoverage = new ConstantFloatExpression(0);
        }
        return this._radiusCoverage;
    }

    public set radiusCoverage (val) {
        this._radiusCoverage = val;
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.RANDOM;
    })
    public get thetaCoverage () {
        if (!this._thetaCoverage) {
            this._thetaCoverage = new ConstantFloatExpression(1);
        }
        return this._thetaCoverage;
    }

    public set thetaCoverage (val) {
        this._thetaCoverage = val;
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.DIRECT;
    })
    public get theta () {
        if (!this._theta) {
            this._theta = new ConstantFloatExpression(0);
        }
        return this._theta;
    }

    public set theta (val) {
        this._theta = val;
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.DIRECT;
    })
    public get radiusPosition () {
        if (!this._radiusPosition) {
            this._radiusPosition = new ConstantFloatExpression(0);
        }
        return this._radiusPosition;
    }

    public set radiusPosition (val) {
        this._radiusPosition = val;
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.UNIFORM;
    })
    public get uniformSpiralAmount () {
        if (!this._uniformSpiralAmount) {
            this._uniformSpiralAmount = new ConstantFloatExpression(1);
        }
        return this._uniformSpiralAmount;
    }

    public set uniformSpiralAmount (val) {
        this._uniformSpiralAmount = val;
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.UNIFORM;
    })
    public get uniformSpiralFalloff () {
        if (!this._uniformSpiralFalloff) {
            this._uniformSpiralFalloff = new ConstantFloatExpression(1);
        }
        return this._uniformSpiralFalloff;
    }

    public set uniformSpiralFalloff (val) {
        this._uniformSpiralFalloff = val;
    }

    @serializable
    private _radius: FloatExpression | null = null;
    @serializable
    private _radiusCoverage: FloatExpression | null = null;
    @serializable
    private _thetaCoverage: FloatExpression | null = null;
    @serializable
    private _theta: FloatExpression | null = null;
    @serializable
    private _radiusPosition: FloatExpression | null = null;
    @serializable
    private _uniformSpiralAmount: FloatExpression | null = null;
    @serializable
    private _uniformSpiralFalloff: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        super.tick(particles, emitter, user, context);
        this.radius.tick(particles, emitter, user, context);
        if (this.distributionMode === DistributionMode.RANDOM) {
            this.radiusCoverage.tick(particles, emitter, user, context);
            this.thetaCoverage.tick(particles, emitter, user, context);
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            this.theta.tick(particles, emitter, user, context);
            this.radiusPosition.tick(particles, emitter, user, context);
        }
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        super.execute(particles, emitter, user, context);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const radius = this._radius as FloatExpression;
        radius.bind(particles, emitter, user, context);
        const position = particles.getParameterUnsafe<Vec3ArrayParameter>(POSITION);
        if (this.distributionMode === DistributionMode.RANDOM) {
            const radiusCoverage = this._radiusCoverage as FloatExpression;
            const thetaCoverage = this._thetaCoverage as FloatExpression;
            radiusCoverage.bind(particles, emitter, user, context);
            thetaCoverage.bind(particles, emitter, user, context);
            const randomStream = this.randomStream;
            for (let i = fromIndex; i < toIndex; ++i) {
                const r = Math.sqrt(randomStream.getFloatFromRange(1 - radiusCoverage.evaluate(i), 1)) * radius.evaluate(i);
                const theta = randomStream.getFloatFromRange(1 - thetaCoverage.evaluate(i), 1) * Math.PI * 2;
                pos.x = Math.cos(theta) * r;
                pos.y = Math.sin(theta) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            const theta = this._theta as FloatExpression;
            const radiusPosition = this._radiusPosition as FloatExpression;
            theta.bind(particles, emitter, user, context);
            radiusPosition.bind(particles, emitter, user, context);
            for (let i = fromIndex; i < toIndex; ++i) {
                const r = radiusPosition.evaluate(i) * radius.evaluate(i);
                const t = theta.evaluate(i) * Math.PI * 2;
                pos.x = Math.cos(t) * r;
                pos.y = Math.sin(t) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        } else {
            const uniformSpiralAmount = this._uniformSpiralAmount as FloatExpression;
            const uniformSpiralFalloff = this._uniformSpiralFalloff as FloatExpression;
            uniformSpiralAmount.bind(particles, emitter, user, context);
            uniformSpiralFalloff.bind(particles, emitter, user, context);
            const executionCount = toIndex - fromIndex;
            for (let i = fromIndex; i < toIndex; ++i) {
                const t = Math.sqrt((i - fromIndex) / executionCount);
                const r = t ** uniformSpiralFalloff.evaluate(i) * radius.evaluate(i);
                const theta = (i - fromIndex) * 1.618034 * (TWO_PI / uniformSpiralAmount.evaluate(i));
                pos.x = Math.cos(theta) * r;
                pos.y = Math.sin(theta) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        }
    }
}
