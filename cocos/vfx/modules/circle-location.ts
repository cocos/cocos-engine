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
import { Enum, Vec3 } from '../../core';
import { POSITION, ParticleDataSet } from '../particle-data-set';
import { ModuleExecContext } from '../base';
import { AngleBasedLocationModule } from './angle-based-location';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { DistributionMode } from './shape-location';

const dir = new Vec3();
@ccclass('cc.CircleLocationModule')
@VFXModule.register('CircleLocation', ModuleExecStageFlags.SPAWN, [POSITION.name])
export class CircleLocationModule extends AngleBasedLocationModule {
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

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
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

    protected generatePos (index: number, angle: number, pos: Vec3) {
        const radiusRandom = Math.sqrt(this.randomStream.getFloatFromRange(this._innerRadius, 1.0));
        const r = radiusRandom * this.radius;
        dir.x = Math.cos(angle);
        dir.y = Math.sin(angle);
        dir.z = 0;
        Vec3.multiplyScalar(pos, dir, r);
    }
}
