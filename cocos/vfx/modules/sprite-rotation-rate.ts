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

import { ccclass, tooltip, type, serializable } from 'cc.decorator';
import { VFXModule, ModuleExecStageFlags } from '../vfx-module';
import { FloatExpression } from '../expressions/float';
import { ModuleExecContext } from '../base';
import { ParticleDataSet, SPRITE_ROTATION } from '../particle-data-set';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';
import { ConstantFloatExpression } from '../expressions';

@ccclass('cc.SpriteRotationRateModule')
@VFXModule.register('SpriteRotationRate', ModuleExecStageFlags.UPDATE, [SPRITE_ROTATION.name], [])
export class SpriteRotationRateModule extends VFXModule {
    @type(FloatExpression)
    @tooltip('i18n:rotationOvertimeModule.z')
    public get rate () {
        if (!this._rate) {
            this._rate = new ConstantFloatExpression(0);
        }
        return this._rate;
    }

    public set rate (val) {
        this._rate = val;
    }

    @serializable
    private _rate: FloatExpression | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        particles.markRequiredParameter(SPRITE_ROTATION);
        this.rate.tick(particles, emitter, user, context);
    }

    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        const spriteRotation = particles.getFloatParameter(SPRITE_ROTATION);
        const { fromIndex, toIndex, deltaTime } = context;
        const exp = this.rate;
        exp.bind(particles, emitter, user, context);
        if (exp.isConstant) {
            const rate = exp.evaluate(0);
            for (let i = fromIndex; i < toIndex; i++) {
                spriteRotation.addFloatAt(rate * deltaTime, i);
            }
        } else {
            for (let i = fromIndex; i < toIndex; i++) {
                const rate = exp.evaluate(0);
                spriteRotation.addFloatAt(rate * deltaTime, i);
            }
        }
    }
}
