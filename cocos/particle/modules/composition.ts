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
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData, RecordReason } from '../particle-soa-data';
import { ParticleUpdateContext } from '../particle-update-context';

const velocity = new Vec3();
const animatedVelocity = new Vec3();
const angularVelocity = new Vec3();

@ccclass('cc.CompositionModule')
export class CompositionModule extends ParticleModule {
    public get name (): string {
        return 'CompositionModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.COMPOSITION;
    }

    public get updatePriority (): number {
        return 0;
    }

    constructor () {
        super();
        this.enable = true;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {
        const deltaTime = particleUpdateContext.deltaTime;
        const { speedModifier, normalizedAliveTime, invStartLifeTime } = particles;
        const count = particles.count;
        for (let particleHandle = 0; particleHandle < count; particleHandle++) {
            particles.getVelocityAt(velocity, particleHandle);
            particles.getAnimatedVelocityAt(animatedVelocity, particleHandle);
            velocity.add(animatedVelocity);
            particles.addPositionAt(Vec3.multiplyScalar(velocity, velocity, deltaTime * speedModifier[particleHandle]), particleHandle);
        }

        for (let particleHandle = 0; particleHandle < count; particleHandle++) {
            particles.getAngularVelocityAt(angularVelocity, particleHandle);
            particles.addRotationAt(Vec3.multiplyScalar(angularVelocity, angularVelocity, deltaTime), particleHandle);
        }

        for (let i = particles.count - 1; i >= 0; i--) {
            normalizedAliveTime[i] += deltaTime * invStartLifeTime[i];

            if (normalizedAliveTime[i] > 1) {
                particles.recordParticleSnapshot(i, RecordReason.DEATH);
                particles.removeParticle(i);
            }
        }
    }
}
