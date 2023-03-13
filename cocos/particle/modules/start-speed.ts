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

import { ccclass, displayOrder, range, serializable, tooltip, type } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterContext, ParticleEmitterParams, ParticleUpdateContext } from '../particle-update-context';
import { CurveRange } from '../curve-range';
import { lerp, Mat4, pseudoRandom, randomRangeInt, Vec3 } from '../../core/math';
import { INT_MAX } from '../../core/math/bits';
import { Space } from '../enum';

const velocity = new Vec3();

@ccclass('cc.StartSpeedModule')
export class StartSpeedModule extends ParticleModule {
    /**
      * @zh 粒子初始速度。
      */
    @type(CurveRange)
    @serializable
    @range([-1, 1])
    @tooltip('i18n:particle_system.startSpeed')
    public startSpeed = new CurveRange(5);

    public get name (): string {
        return 'StartSpeedModule';
    }

    public get execStage (): ModuleExecStage {
        return ModuleExecStage.SPAWN;
    }

    public get execPriority (): number {
        return 1;
    }

    public spawn (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleEmitterContext,
        fromIndex: number, toIndex: number, currentTime: number) {
        const normalizedTimeInCycle = currentTime / params.duration;
        if (this.startSpeed.mode === CurveRange.Mode.Constant) {
            const constant = this.startSpeed.constant;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = constant;
                particles.getStartDirAt(velocity, i);
                Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                particles.setVelocityAt(velocity, i);
            }
        } else if (this.startSpeed.mode ===  CurveRange.Mode.TwoConstants) {
            const { constantMin, constantMax } = this.startSpeed;
            for (let i = fromIndex; i < toIndex; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                const curveStartSpeed = lerp(constantMin, constantMax, rand);
                particles.getStartDirAt(velocity, i);
                Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                particles.setVelocityAt(velocity, i);
            }
        } else if (this.startSpeed.mode ===  CurveRange.Mode.Curve) {
            const { spline, multiplier } = this.startSpeed;
            for (let i = fromIndex; i < toIndex; ++i) {
                const curveStartSpeed = spline.evaluate(normalizedTimeInCycle) * multiplier;
                particles.getStartDirAt(velocity, i);
                Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                particles.setVelocityAt(velocity, i);
            }
        } else {
            const { splineMin, splineMax, multiplier } = this.startSpeed;
            for (let i = fromIndex; i < toIndex; ++i) {
                const rand = pseudoRandom(randomRangeInt(0, INT_MAX));
                const curveStartSpeed = lerp(splineMin.evaluate(normalizedTimeInCycle), splineMax.evaluate(normalizedTimeInCycle), rand) * multiplier;
                particles.getStartDirAt(velocity, i);
                Vec3.multiplyScalar(velocity, velocity, curveStartSpeed);
                particles.setVelocityAt(velocity, i);
            }
        }
    }
}
