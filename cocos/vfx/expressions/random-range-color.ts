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
import { Color, Enum } from '../../core';
import { ccclass, serializable, type, visible } from '../../core/data/decorators';
import { ColorExpression } from './color';
import { ConstantColorExpression } from './constant-color';
import { VFXExecutionStage, VFXModule } from '../vfx-module';
import { C_TICK_COUNT, E_RANDOM_SEED, P_ID, VFXRandomEvaluationMode } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { randFloat } from '../rand';

const tempColor = new Color();

@ccclass('cc.RandomRangeColor')
export class RandomRangeColorExpression extends ColorExpression {
    @type(ColorExpression)
    public get maximum () {
        if (!this._maximum) {
            this._maximum = new ConstantColorExpression();
        }
        return this._maximum;
    }

    public set maximum (val) {
        this._maximum = val;
        this.requireRecompile();
    }

    @type(ColorExpression)
    public get minimum () {
        if (!this._minimum) {
            this._minimum = new ConstantColorExpression();
        }
        return this._minimum;
    }

    public set minimum (val) {
        this._minimum = val;
        this.requireRecompile();
    }

    @type(Enum(VFXRandomEvaluationMode))
    @visible(function (this: RandomRangeColorExpression) { return this.usage !== VFXExecutionStage.SPAWN; })
    public get evaluationMode () {
        return this._evaluationMode;
    }

    public set evaluationMode (val: VFXRandomEvaluationMode) {
        this._evaluationMode = val;
        this.requireRecompile();
    }

    public get isConstant (): boolean {
        return false;
    }

    @serializable
    private _randomOffset = Math.floor(Math.random() * 0xffffffff);
    @serializable
    private _maximum: ColorExpression | null = null;
    @serializable
    private _minimum: ColorExpression | null = null;
    @serializable
    private _evaluationMode = VFXRandomEvaluationMode.SPAWN_ONLY;

    private declare _seed2: Uint32Array;
    private _randomSeed = 0;
    private _randomSeed2 = 0;
    private _getRandFloat: (index: number) => number = this._getParticleRandFloat;

    public compile (parameterMap: VFXParameterMap, owner: VFXModule) {
        super.compile(parameterMap, owner);
        this.maximum.compile(parameterMap, owner);
        this.minimum.compile(parameterMap, owner);
        if (this.usage === VFXExecutionStage.UPDATE || this.usage === VFXExecutionStage.SPAWN) {
            parameterMap.ensure(P_ID);
            this._getRandFloat = this._getParticleRandFloat;
        } else {
            this._getRandFloat = this._getEmitterRandFloat;
        }
    }

    public bind (parameterMap: VFXParameterMap) {
        this._maximum!.bind(parameterMap);
        this._minimum!.bind(parameterMap);
        if (this.usage === VFXExecutionStage.UPDATE || this.usage === VFXExecutionStage.SPAWN) {
            this._seed2 = parameterMap.getUint32ArrayValue(P_ID).data;
        }
        if (this._evaluationMode === VFXRandomEvaluationMode.SPAWN_ONLY || this.usage === VFXExecutionStage.SPAWN) {
            this._randomSeed = parameterMap.getUint32Value(E_RANDOM_SEED).data;
            this._randomSeed2 = this._randomOffset;
        } else {
            this._randomSeed = parameterMap.getUint32Value(E_RANDOM_SEED).data + this._randomOffset;
            this._randomSeed2 = parameterMap.getUint32Value(C_TICK_COUNT).data;
        }
    }

    public evaluate (index: number, out: Color) {
        return Color.lerp(out, this._minimum!.evaluate(index, out), this._maximum!.evaluate(index, tempColor), this._getRandFloat(index));
    }

    private _getParticleRandFloat (index: number) {
        return randFloat(this._randomSeed, this._seed2[index], this._randomSeed2);
    }

    private _getEmitterRandFloat (index: number) {
        return randFloat(this._randomSeed, 0, this._randomSeed2);
    }
}
