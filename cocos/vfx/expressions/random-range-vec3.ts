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
import { lerp, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { RandomStream } from '../random-stream';
import { ConstantVec3Expression } from './constant-vec3';
import { Vec3Expression } from './vec3';
import { VFXExecutionStage, VFXModule } from '../vfx-module';
import { P_RANDOM_SEED } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';

const temp = new Vec3();
const tempRatio = new Vec3();

@ccclass('cc.RandomRangeVec3')
export class RandomRangeVec3Expression extends Vec3Expression {
    @type(Vec3Expression)
    public get maximum () {
        if (!this._maximum) {
            this._maximum = new ConstantVec3Expression();
        }
        return this._maximum;
    }

    public set maximum (val) {
        this._maximum = val;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    public get minimum () {
        if (!this._minimum) {
            this._minimum = new ConstantVec3Expression();
        }
        return this._minimum;
    }

    public set minimum (val) {
        this._minimum = val;
        this.requireRecompile();
    }

    public get isConstant (): boolean {
        return false;
    }

    @serializable
    private _maximum: Vec3Expression | null = null;
    @serializable
    private _minimum: Vec3Expression | null = null;
    private declare _seed: Uint32Array;
    private _randomOffset = 0;
    private declare _randomStream: RandomStream;

    public compile (parameterMap: VFXParameterMap, owner: VFXModule) {
        super.compile(parameterMap, owner);
        this.maximum.compile(parameterMap, owner);
        this.minimum.compile(parameterMap, owner);
        if (this.usage === VFXExecutionStage.UPDATE) {
            parameterMap.ensure(P_RANDOM_SEED);
        }
    }

    public bind (parameterMap: VFXParameterMap) {
        this._maximum!.bind(parameterMap);
        this._minimum!.bind(parameterMap);
        if (this.usage === VFXExecutionStage.UPDATE) {
            this._seed = parameterMap.getUint32ArrayValue(P_RANDOM_SEED).data;
            this._randomOffset = parameterMap.getUint32Value(C_MODULE_INITIAL_RANDOM_SEED).data;
        } else {
            this._randomStream = parameterMap.moduleRandomStream;
        }
    }

    public evaluate (index: number, out: Vec3) {
        this._minimum!.evaluate(index, out);
        this._maximum!.evaluate(index, temp);
        const ratio = RandomStream.get3Float(this._seed[index] + this._randomOffset, tempRatio);
        out.x = lerp(out.x, temp.x, ratio.x);
        out.y = lerp(out.y, temp.y, ratio.y);
        out.z = lerp(out.z, temp.z, ratio.z);
        return out;
    }

    public evaluateSingle (out: Vec3) {
        this._minimum!.evaluateSingle(out);
        this._maximum!.evaluateSingle(temp);
        out.x = lerp(out.x, temp.x, this._randomStream.getFloat());
        out.y = lerp(out.y, temp.y, this._randomStream.getFloat());
        out.z = lerp(out.z, temp.z, this._randomStream.getFloat());
        return out;
    }
}
