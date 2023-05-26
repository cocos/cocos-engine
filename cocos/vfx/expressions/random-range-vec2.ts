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
import { lerp, Vec2 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ContextDataSet } from '../data-set/context';
import { EmitterDataSet } from '../data-set/emitter';
import { ParticleDataSet, RANDOM_SEED } from '../data-set/particle';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../data-set/user';
import { ModuleExecStage } from '../vfx-module';
import { ConstantVec2Expression, Uint32ArrayParameter, Vec2Expression } from '../../../exports/vfx';

const temp = new Vec2();
const tempRatio = new Vec2();

@ccclass('cc.RandomRangeVec2')
export class RandomRangeVec2Expression extends Vec2Expression {
    @type(Vec2Expression)
    @serializable
    public maximum: Vec2Expression = new ConstantVec2Expression(Vec2.ZERO);

    @type(Vec2Expression)
    @serializable
    public minimum: Vec2Expression = new ConstantVec2Expression(Vec2.ZERO);

    public get isConstant (): boolean {
        return false;
    }

    private declare _seed: Uint32Array;
    private _randomOffset = 0;
    private declare _randomStream: RandomStream;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.maximum.tick(particles, emitter, user, context);
        this.minimum.tick(particles, emitter, user, context);
        if (context.executionStage === ModuleExecStage.UPDATE) {
            particles.markRequiredParameter(RANDOM_SEED);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        this.maximum.bind(particles, emitter, user, context);
        this.minimum.bind(particles, emitter, user, context);
        if (context.executionStage === ModuleExecStage.UPDATE) {
            this._seed = particles.getParameterUnsafe<Uint32ArrayParameter>(RANDOM_SEED).data;
            this._randomOffset = context.moduleRandomSeed;
        } else {
            this._randomStream = context.moduleRandomStream;
        }
    }

    public evaluate (index: number, out: Vec2) {
        this.minimum.evaluate(index, out);
        this.maximum.evaluate(index, temp);
        const ratio = RandomStream.get2Float(this._seed[index] + this._randomOffset, tempRatio);
        out.x = lerp(out.x, temp.x, ratio.x);
        out.y = lerp(out.y, temp.y, ratio.y);
        return out;
    }

    public evaluateSingle (out: Vec2) {
        this.minimum.evaluateSingle(out);
        this.maximum.evaluateSingle(temp);
        out.x = lerp(out.x, temp.x, this._randomStream.getFloat());
        out.y = lerp(out.y, temp.y, this._randomStream.getFloat());
        return out;
    }
}
