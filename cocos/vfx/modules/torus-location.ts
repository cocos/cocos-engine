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
import { Enum, TWO_PI, Vec3, clamp } from '../../core';
import { ParticleDataSet, EmitterDataSet, ContextDataSet, UserDataSet } from '../data-set';
import { ShapeLocationModule } from './shape-location';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX } from '../define';

export enum TorusDistributionMode {
    RANDOM,
    DIRECT,
}

const pos = new Vec3();

@ccclass('cc.TorusLocationModule')
@VFXModule.register('TorusLocation', ModuleExecStageFlags.SPAWN, [P_POSITION.name])
export class TorusLocationModule extends ShapeLocationModule {
    @type(FloatExpression)
    public get largeRadius () {
        if (!this._largeRadius) {
            this._largeRadius = new ConstantFloatExpression(1);
        }
        return this._largeRadius;
    }

    public set largeRadius (val) {
        this._largeRadius = val;
    }

    @type(FloatExpression)
    public get handleRadius () {
        if (!this._handleRadius) {
            this._handleRadius = new ConstantFloatExpression(0.25);
        }
        return this._handleRadius;
    }

    public set handleRadius (val) {
        this._handleRadius = val;
    }

    @type(Enum(TorusDistributionMode))
    @serializable
    public distributionMode = TorusDistributionMode.RANDOM;

    @type(FloatExpression)
    @visible(function (this: TorusLocationModule) {
        return this.distributionMode === TorusDistributionMode.RANDOM;
    })
    public get surfaceDistribution () {
        if (!this._surfaceDistribution) {
            this._surfaceDistribution = new ConstantFloatExpression(0);
        }
        return this._surfaceDistribution;
    }

    public set surfaceDistribution (val) {
        this._surfaceDistribution = val;
    }

    @type(FloatExpression)
    @visible(function (this: TorusLocationModule) {
        return this.distributionMode === TorusDistributionMode.RANDOM;
    })
    public get uDistribution () {
        if (!this._uDistribution) {
            this._uDistribution = new ConstantFloatExpression(0);
        }
        return this._uDistribution;
    }

    public set uDistribution (val) {
        this._uDistribution = val;
    }

    @type(FloatExpression)
    @visible(function (this: TorusLocationModule) {
        return this.distributionMode === TorusDistributionMode.RANDOM;
    })
    public get vDistribution () {
        if (!this._vDistribution) {
            this._vDistribution = new ConstantFloatExpression(0);
        }
        return this._vDistribution;
    }

    public set vDistribution (val) {
        this._vDistribution = val;
    }

    @type(FloatExpression)
    @visible(function (this: TorusLocationModule) {
        return this.distributionMode === TorusDistributionMode.DIRECT;
    })
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
    @visible(function (this: TorusLocationModule) {
        return this.distributionMode === TorusDistributionMode.DIRECT;
    })
    public get vPosition () {
        if (!this._vPosition) {
            this._vPosition = new ConstantFloatExpression(0);
        }
        return this._vPosition;
    }

    public set vPosition (val) {
        this._vPosition = val;
    }

    @serializable
    private _largeRadius: FloatExpression | null = null;
    @serializable
    private _handleRadius: FloatExpression | null = null;
    @serializable
    private _surfaceDistribution: FloatExpression | null = null;
    @serializable
    private _uDistribution: FloatExpression | null = null;
    @serializable
    private _vDistribution: FloatExpression | null = null;
    @serializable
    private _uPosition: FloatExpression | null = null;
    @serializable
    private _vPosition: FloatExpression | null = null;

    public tick (dataStore: VFXDataStore) {
        super.tick(dataStore);
        this.largeRadius.tick(dataStore);
        this.handleRadius.tick(dataStore);
        if (this.distributionMode === TorusDistributionMode.RANDOM) {
            this.surfaceDistribution.tick(dataStore);
            this.uDistribution.tick(dataStore);
            this.vDistribution.tick(dataStore);
        } else {
            this.uPosition.tick(dataStore);
            this.vPosition.tick(dataStore);
        }
    }

    public execute (dataStore: VFXDataStore): void {
        super.execute(particles, emitter, user, context);
        const fromIndex = context.getUint32Parameter(C_FROM_INDEX).data;
        const toIndex = context.getUint32Parameter(C_TO_INDEX).data;
        const position = particles.getVec3ArrayParameter(P_POSITION);
        const largeRadiusExp = this._largeRadius as FloatExpression;
        const handleRadiusExp = this._handleRadius as FloatExpression;
        largeRadiusExp.bind(dataStore);
        handleRadiusExp.bind(dataStore);
        if (this.distributionMode === TorusDistributionMode.RANDOM) {
            const surfaceDistributionExp = this._surfaceDistribution as FloatExpression;
            const uDistributionExp = this._uDistribution as FloatExpression;
            const vDistributionExp = this._vDistribution as FloatExpression;
            surfaceDistributionExp.bind(dataStore);
            uDistributionExp.bind(dataStore);
            vDistributionExp.bind(dataStore);
            const randomStream = this.randomStream;
            for (let i = fromIndex; i < toIndex; ++i) {
                const largeRadius = largeRadiusExp.evaluate(i);
                const surfaceDistribution = clamp(surfaceDistributionExp.evaluate(i), 0, 999);
                const uDistribution = clamp(uDistributionExp.evaluate(i), 0, 1);
                const vDistribution = clamp(vDistributionExp.evaluate(i), 0, 1);
                const randomU = randomStream.getFloatFromRange(uDistribution, 1) * TWO_PI;
                const randomV = randomStream.getFloatFromRange(vDistribution, 1) * TWO_PI;
                const randomRadius = randomStream.getFloatFromRange(surfaceDistribution, 1);
                const handleRadius = Math.sqrt(randomRadius) * handleRadiusExp.evaluate(i);
                const radius = largeRadius + handleRadius * Math.cos(randomV);
                Vec3.set(pos, radius * Math.cos(randomU), radius * Math.sin(randomU), handleRadius * Math.sin(randomV));
                this.storePosition(i, pos, position);
            }
        } else {
            const uPositionExp = this._uPosition as FloatExpression;
            const vPositionExp = this._vPosition as FloatExpression;
            uPositionExp.bind(dataStore);
            vPositionExp.bind(dataStore);
            for (let i = fromIndex; i < toIndex; ++i) {
                const largeRadius = largeRadiusExp.evaluate(i);
                const uPosition = uPositionExp.evaluate(i);
                const vPosition = vPositionExp.evaluate(i);
                const u = uPosition * TWO_PI;
                const v = vPosition * TWO_PI;
                const handleRadius = handleRadiusExp.evaluate(i);
                const radius = largeRadius + handleRadius * Math.cos(v);
                Vec3.set(pos, radius * Math.cos(u), radius * Math.sin(u), handleRadius * Math.sin(v));
                this.storePosition(i, pos, position);
            }
        }
    }
}
