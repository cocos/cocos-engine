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
import { Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { ModuleExecContext } from '../module-exec-context';
import { EmitterDataSet } from '../emitter-data-set';
import { ParticleDataSet } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

@ccclass('cc.Vec3FromFloatExpression')
export class Vec3FromFloatExpression extends Vec3Expression {
    @type(FloatExpression)
    @serializable
    public value: FloatExpression = new ConstantFloatExpression();

    public get isConstant (): boolean {
        return this.value.isConstant;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.value.tick(particles, emitter, user, context);
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this.value.bind(particles, emitter, user, context);
    }

    public evaluate (index: number, out: Vec3) {
        const val = this.value.evaluate(index);
        out.x = val;
        out.y = val;
        out.z = val;
        return out;
    }

    public evaluateSingle (out: Vec3): Vec3 {
        const val = this.value.evaluateSingle();
        out.x = val;
        out.y = val;
        out.z = val;
        return out;
    }
}
