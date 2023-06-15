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
import { VFXExecutionStageFlags, VFXModule, VFXStage } from '../vfx-module';
import { Enum, TWO_PI, Vec3, clamp } from '../../core';
import { ShapeLocationModule } from './shape-location';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { P_POSITION, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

export enum TorusDistributionMode {
    RANDOM,
    DIRECT,
}

const pos = new Vec3();

@ccclass('cc.TorusLocationModule')
@VFXModule.register('TorusLocation', VFXExecutionStageFlags.SPAWN, [P_POSITION.name])
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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @type(Enum(TorusDistributionMode))
    public get distributionMode () {
        return this._distributionMode;
    }

    public set distributionMode (val) {
        this._distributionMode = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
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
    @serializable
    private _distributionMode = TorusDistributionMode.RANDOM;

    public compile (parameterMap: VFXParameterMap, owner: VFXStage) {
        super.compile(parameterMap, owner);
        this.largeRadius.compile(parameterMap, this);
        this.handleRadius.compile(parameterMap, this);
        if (this.distributionMode === TorusDistributionMode.RANDOM) {
            this.surfaceDistribution.compile(parameterMap, this);
            this.uDistribution.compile(parameterMap, this);
            this.vDistribution.compile(parameterMap, this);
        } else {
            this.uPosition.compile(parameterMap, this);
            this.vPosition.compile(parameterMap, this);
        }
    }

    public execute (parameterMap: VFXParameterMap): void {
        super.execute(parameterMap);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const largeRadiusExp = this._largeRadius as FloatExpression;
        const handleRadiusExp = this._handleRadius as FloatExpression;
        largeRadiusExp.bind(parameterMap);
        handleRadiusExp.bind(parameterMap);
        if (this._distributionMode === TorusDistributionMode.RANDOM) {
            const surfaceDistributionExp = this._surfaceDistribution as FloatExpression;
            const uDistributionExp = this._uDistribution as FloatExpression;
            const vDistributionExp = this._vDistribution as FloatExpression;
            surfaceDistributionExp.bind(parameterMap);
            uDistributionExp.bind(parameterMap);
            vDistributionExp.bind(parameterMap);
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
            uPositionExp.bind(parameterMap);
            vPositionExp.bind(parameterMap);
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
