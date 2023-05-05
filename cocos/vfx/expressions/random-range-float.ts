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
import { lerp } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { BuiltinParticleParameterFlags, ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';

@ccclass('cc.RandomRangeFloat')
export class RandomRangeFloatExpression extends FloatExpression {
    @type(FloatExpression)
    @serializable
    public maximum: FloatExpression = new ConstantFloatExpression(0);

    @type(FloatExpression)
    @serializable
    public minimum: FloatExpression = new ConstantFloatExpression(0);

    public get isConstant (): boolean {
        return false;
    }

    private declare _seed: Uint32Array;
    private _randomOffset = 0;
    private declare _randomStream: RandomStream;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.maximum.tick(particles, emitter, user, context);
        this.minimum.tick(particles, emitter, user, context);
        particles.markRequiredParameter(RANDOM_SEED);
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.maximum.bind(particles, emitter, user, context);
        this.minimum.bind(particles, emitter, user, context);
        this._seed = particles.getUint32Parameter(RANDOM_SEED).data;
        this._randomOffset = context.moduleRandomSeed;
    }

    public evaluate (index: number): number {
        return lerp(this.minimum.evaluate(index), this.maximum.evaluate(index), RandomStream.getFloat(this._seed[index] + this._randomOffset));
    }

    public evaluateSingle (): number {
        const min = this.minimum.evaluateSingle();
        const max = this.maximum.evaluateSingle();
        return lerp(min, max, this._randomStream.getFloat());
    }
}
