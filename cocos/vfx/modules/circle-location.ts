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
import { Enum, TWO_PI, Vec3, random } from '../../core';
import { ConstantFloatExpression, FloatExpression } from '../expressions';
import { DistributionMode, ShapeLocationModule } from './shape-location';
import { C_FROM_INDEX, C_TO_INDEX, E_RANDOM_SEED, P_ID, P_POSITION } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { randRangedFloat } from '../rand';
import { VFXParameterRegistry } from '../vfx-parameter';

const pos = new Vec3();
@ccclass('cc.CircleLocationModule')
@VFXModule.register('CircleLocation', VFXExecutionStageFlags.SPAWN, [P_POSITION.name])
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
        this.requireRecompile();
    }

    /**
      * @zh 粒子在扇形范围内的发射方式 [[ArcMode]]。
      */
    @type(Enum(DistributionMode))
    public get distributionMode () {
        return this._distributionMode;
    }

    public set distributionMode (val) {
        this._distributionMode = val;
        this.requireRecompile();
    }

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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(function (this: CircleLocationModule) {
        return this.distributionMode === DistributionMode.DIRECT;
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
        this.requireRecompile();
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
        this.requireRecompile();
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
        this.requireRecompile();
    }

    @serializable
    private _radius: FloatExpression | null = null;
    @serializable
    private _radiusCoverage: FloatExpression | null = null;
    @serializable
    private _thetaCoverage: FloatExpression | null = null;
    @serializable
    private _uPosition: FloatExpression | null = null;
    @serializable
    private _radiusPosition: FloatExpression | null = null;
    @serializable
    private _uniformSpiralAmount: FloatExpression | null = null;
    @serializable
    private _uniformSpiralFalloff: FloatExpression | null = null;
    @serializable
    private _distributionMode: DistributionMode = DistributionMode.RANDOM;
    @serializable
    private _randomOffset = Math.floor(Math.random() * 0xFFFFFFFF);

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXStage) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        compileResult &&= this.radius.compile(parameterMap, parameterRegistry, this);
        if (this.distributionMode === DistributionMode.RANDOM) {
            parameterMap.ensure(P_ID);
            compileResult &&= this.radiusCoverage.compile(parameterMap, parameterRegistry, this);
            compileResult &&= this.thetaCoverage.compile(parameterMap, parameterRegistry, this);
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            compileResult &&= this.uPosition.compile(parameterMap, parameterRegistry, this);
            compileResult &&= this.radiusPosition.compile(parameterMap, parameterRegistry, this);
        }
        return compileResult;
    }

    public execute (parameterMap: VFXParameterMap) {
        super.execute(parameterMap);
        const fromIndex = parameterMap.getUint32Value(C_FROM_INDEX).data;
        const toIndex = parameterMap.getUint32Value(C_TO_INDEX).data;
        const position = parameterMap.getVec3ArrayValue(P_POSITION);
        const radiusExp = this._radius as FloatExpression;
        radiusExp.bind(parameterMap);
        if (this.distributionMode === DistributionMode.RANDOM) {
            const randomSeed = parameterMap.getUint32Value(E_RANDOM_SEED).data;
            const id = parameterMap.getUint32ArrayValue(P_ID).data;
            const randomOffset = this._randomOffset;
            const randomOffsetTheta = randomOffset + 8718230;
            const radiusCoverageExp = this._radiusCoverage as FloatExpression;
            const thetaCoverageExp = this._thetaCoverage as FloatExpression;
            radiusCoverageExp.bind(parameterMap);
            thetaCoverageExp.bind(parameterMap);
            for (let i = fromIndex; i < toIndex; ++i) {
                const r = Math.sqrt(randRangedFloat(1 - radiusCoverageExp.evaluate(i), 1, randomSeed, id[i], randomOffset)) * radiusExp.evaluate(i);
                const theta = randRangedFloat(1 - thetaCoverageExp.evaluate(i), 1, randomSeed, id[i], randomOffsetTheta) * TWO_PI;
                pos.x = Math.cos(theta) * r;
                pos.y = Math.sin(theta) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        } else if (this.distributionMode === DistributionMode.DIRECT) {
            const uPositionExp = this._uPosition as FloatExpression;
            const radiusPositionExp = this._radiusPosition as FloatExpression;
            uPositionExp.bind(parameterMap);
            radiusPositionExp.bind(parameterMap);
            for (let i = fromIndex; i < toIndex; ++i) {
                const r = radiusPositionExp.evaluate(i) * radiusExp.evaluate(i);
                const t = uPositionExp.evaluate(i) * TWO_PI;
                pos.x = Math.cos(t) * r;
                pos.y = Math.sin(t) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        } else {
            const uniformSpiralAmountExp = this._uniformSpiralAmount as FloatExpression;
            const uniformSpiralFalloffExp = this._uniformSpiralFalloff as FloatExpression;
            uniformSpiralAmountExp.bind(parameterMap);
            uniformSpiralFalloffExp.bind(parameterMap);
            const executionCount = toIndex - fromIndex;
            for (let i = fromIndex; i < toIndex; ++i) {
                const t = Math.sqrt((i - fromIndex) / executionCount);
                const r = t ** uniformSpiralFalloffExp.evaluate(i) * radiusExp.evaluate(i);
                const theta = (i - fromIndex) * 1.618034 * (TWO_PI / uniformSpiralAmountExp.evaluate(i));
                pos.x = Math.cos(theta) * r;
                pos.y = Math.sin(theta) * r;
                pos.z = 0;
                this.storePosition(i, pos, position);
            }
        }
    }
}
