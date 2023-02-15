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
import { ccclass, displayOrder, serializable, tooltip, type, range } from '../../core/data/decorators';
import Burst from '../burst';
import { CurveRange } from '../curve-range';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';

@ccclass('cc.BurstEmissionModule')
export class BurstEmissionModule extends ParticleModule {
    /**
      * @zh 设定在指定时间发射指定数量的粒子的 burst 的数量。
      */
    @type([Burst])
    @serializable
    @displayOrder(16)
    @tooltip('i18n:particle_system.bursts')
    public bursts: Burst[] = [];

    public get name (): string {
        return 'BurstEmissionModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.EMITTER_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext) {
        const { normalizedTimeInCycle, emitterAccumulatedTime: time, emitterDeltaTime } = context;
        const preTime = time - emitterDeltaTime;
        for (let i = 0; i < this.bursts.length; i++) {
            const burst = this.bursts[i];
            if ((preTime < burst.time && time > burst.time) || (preTime > burst.time && burst.repeatCount > 1)) {
                const preEmitTime = Math.floor((preTime - burst.time) / burst.repeatInterval);
                if (preEmitTime < burst.repeatCount) {
                    const currentEmitTime = Math.min(Math.floor((time - burst.time) / burst.repeatInterval), burst.repeatCount);
                    const toEmitTime = currentEmitTime - preEmitTime;
                    if (burst.count.mode === CurveRange.Mode.Constant) {
                        for (let j = 0; j < toEmitTime; j++) {
                            context.burstEmittingCount += Math.floor(burst.count.constant);
                        }
                    } else if (burst.count.mode === CurveRange.Mode.Curve) {
                        const { spline, multiplier } = burst.count;
                        for (let j = 0; j < toEmitTime; j++) {
                            context.burstEmittingCount += Math.floor(spline.evaluate(normalizedTimeInCycle[i]) * multiplier);
                        }
                    } else if (burst.count.mode === CurveRange.Mode.TwoConstants) {
                        const { constantMin, constantMax } = burst.count;
                        for (let j = 0; j < toEmitTime; j++) {
                            context.burstEmittingCount += Math.floor(lerp(constantMin, constantMax, Math.random()));
                        }
                    } else {
                        const { splineMin, splineMax, multiplier } = burst.count;
                        for (let j = 0; j < toEmitTime; j++) {
                            context.burstEmittingCount += Math.floor(lerp(splineMin.evaluate(normalizedTimeInCycle[i]), splineMax.evaluate(normalizedTimeInCycle[i]), Math.random()) * multiplier);
                        }
                    }
                }
            }
        }
    }
}
