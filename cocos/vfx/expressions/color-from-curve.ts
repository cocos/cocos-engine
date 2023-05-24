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
import { Color, Gradient, serializable } from '../../core';
import { ccclass, type } from '../../core/data/decorators';
import { ModuleExecContext } from '../base';
import { NORMALIZED_AGE, ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage } from '../vfx-module';
import { ColorExpression } from './color';
import { EmitterDataSet } from '../emitter-data-set';
import { UserDataSet } from '../user-data-set';

@ccclass('cc.ColorFromCurveExpression')
export class ColorFromCurveExpression extends ColorExpression {
    @type(Gradient)
    @serializable
    public curve = new Gradient();

    private declare _time: Float32Array;

    public get isConstant (): boolean {
        return false;
    }

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        if (context.executionStage === ModuleExecStage.UPDATE) {
            particles.markRequiredParameter(NORMALIZED_AGE);
        }
    }

    public bind (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this._time = context.executionStage === ModuleExecStage.UPDATE ? particles.getFloatParameter(NORMALIZED_AGE).data : particles.getFloatParameter(SPAWN_NORMALIZED_TIME).data;
    }

    public evaluateSingle (out: Color) {
        this.curve.evaluateFast(out, time);
        return out;
    }

    public evaluate (index: number, out: Color) {
        this.curve.evaluateFast(out, this._time[index]);
        return out;
    }
}
