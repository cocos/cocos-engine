import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterParams, ParticleUpdateContext } from '../particle-update-context';

@ccclass('cc.StateModule')
export class StateModule extends ParticleModule {
    public get name (): string {
        return 'ParticleState';
    }

    public get execStage (): ModuleExecStage {
        return ModuleExecStage.UPDATE;
    }

    public get execPriority (): number {
        return 1;
    }

    public update (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const { normalizedAliveTime, invStartLifeTime } = particles;
        for (let particleHandle = toIndex - 1; particleHandle >= fromIndex; particleHandle--) {
            normalizedAliveTime[particleHandle] += dt * invStartLifeTime[particleHandle];
            if (normalizedAliveTime[particleHandle] > 1) {
                particles.removeParticle(particleHandle);
            }
        }
    }
}
