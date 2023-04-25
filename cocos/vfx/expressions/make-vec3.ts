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
import { Vec3, serializable } from '../../core';
import { ccclass, type } from '../../core/data/class-decorator';
import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { ParticleDataSet } from '../particle-data-set';
import { RandomStream } from '../random-stream';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

@ccclass('cc.MakeVec3Expression')
export class MakeVec3Expression extends Vec3Expression {
    @type(FloatExpression)
    @serializable
    public x: FloatExpression = new ConstantFloatExpression();

    @type(FloatExpression)
    @serializable
    public y: FloatExpression = new ConstantFloatExpression();

    @type(FloatExpression)
    @serializable
    public z: FloatExpression = new ConstantFloatExpression();

    public get isConstant (): boolean {
        return this.x.isConstant && this.y.isConstant && this.z.isConstant;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.x.tick(particles, emitter, user, context);
        this.y.tick(particles, emitter, user, context);
        this.z.tick(particles, emitter, user, context);
    }
    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.x.bind(particles, emitter, user, context);
        this.y.bind(particles, emitter, user, context);
        this.z.bind(particles, emitter, user, context);
    }

    public evaluate (index: number, out: Vec3) {
        out.x = this.x.evaluate(index);
        out.y = this.y.evaluate(index);
        out.z = this.z.evaluate(index);
        return out;
    }

    public evaluateSingle (time: number, randomStream: RandomStream, out: Vec3) {
        out.x = this.x.evaluateSingle(time, randomStream);
        out.y = this.y.evaluateSingle(time, randomStream);
        out.z = this.z.evaluateSingle(time, randomStream);
        return out;
    }
}
