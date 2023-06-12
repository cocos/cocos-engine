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
import { Color } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { RandomStream } from '../random-stream';
import { ColorExpression } from './color';
import { ConstantColorExpression } from './constant-color';
import { ModuleExecStage } from '../vfx-module';
import { P_RANDOM_SEED } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const tempColor = new Color();

@ccclass('cc.RandomRangeColor')
export class RandomRangeColorExpression extends ColorExpression {
    @type(ColorExpression)
    @serializable
    public maximum: ColorExpression = new ConstantColorExpression();

    @type(ColorExpression)
    @serializable
    public minimum: ColorExpression = new ConstantColorExpression();

    public get isConstant (): boolean {
        return false;
    }

    private declare _seed: Uint32Array;
    private _randomOffset = 0;
    private declare _randomStream: RandomStream;

    public tick (parameterMap: VFXParameterMap) {
        this.maximum.tick(parameterMap);
        this.minimum.tick(parameterMap);
        if (this.usage === ModuleExecStage.UPDATE) {
            parameterMap.ensureParameter(P_RANDOM_SEED);
        }
    }

    public bind (parameterMap: VFXParameterMap) {
        this.maximum.bind(parameterMap);
        this.minimum.bind(parameterMap);
        if (this.usage === ModuleExecStage.UPDATE) {
            this._seed = parameterMap.getUint32ArrayValue(P_RANDOM_SEED).data;
            this._randomOffset = parameterMap.moduleRandomSeed;
        } else {
            this._randomStream = parameterMap.moduleRandomStream;
        }
    }

    public evaluate (index: number, out: Color) {
        return Color.lerp(out, this.minimum.evaluate(index, out), this.maximum.evaluate(index, tempColor), RandomStream.getFloat(this._seed[index] + this._randomOffset));
    }

    public evaluateSingle (out: Color) {
        const min = this.minimum.evaluateSingle(out);
        const max = this.maximum.evaluateSingle(tempColor);
        return Color.lerp(out, min, max, this._randomStream.getFloat());
    }
}
