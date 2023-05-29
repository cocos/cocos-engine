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

import { ccclass, serializable, type } from 'cc.decorator';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { POSITION, ParticleDataSet, FROM_INDEX, ContextDataSet, TO_INDEX, EmitterDataSet, UserDataSet } from '../data-set';
import { Vec3 } from '../../core';
import { ConstantVec3Expression, Vec3Expression } from '../expressions';
import { Vec3ArrayParameter, Uint32Parameter } from '../parameters';

const tempPos = new Vec3();

@ccclass('cc.SetPositionModule')
@VFXModule.register('SetPosition', ModuleExecStageFlags.SPAWN | ModuleExecStageFlags.UPDATE, [POSITION.name], [])
export class SetPositionModule extends VFXModule {
    /**
      * @zh 设置粒子颜色。
      */
    @type(Vec3Expression)
    @serializable
    public position: Vec3Expression = new ConstantVec3Expression();

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        particles.markRequiredParameter(POSITION);
        this.position.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ContextDataSet) {
        const position = particles.getParameterUnsafe<Vec3ArrayParameter>(POSITION);
        const fromIndex = context.getParameterUnsafe<Uint32Parameter>(FROM_INDEX).data;
        const toIndex = context.getParameterUnsafe<Uint32Parameter>(TO_INDEX).data;
        const exp = this.position;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            position.fill(exp.evaluate(0, tempPos), fromIndex, toIndex);
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                position.setVec3At(exp.evaluate(i, tempPos), i);
            }
        }
    }
}
