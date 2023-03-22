import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

@ccclass('cc.StateModule')
@ParticleModule.register('State', ModuleExecStage.UPDATE, 20)
export class StateModule extends ParticleModule {
    constructor () {
        super();
        this.enabled = true;
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const normalizedAliveTime = particles.normalizedAliveTime.data;
        const invStartLifeTime = particles.invStartLifeTime.data;
        const { fromIndex, toIndex, deltaTime } = context;
        for (let particleHandle = toIndex - 1; particleHandle >= fromIndex; particleHandle--) {
            normalizedAliveTime[particleHandle] += deltaTime * invStartLifeTime[particleHandle];
            if (normalizedAliveTime[particleHandle] > 1) {
                context.setExecuteRange(fromIndex, toIndex - 1);
                particles.removeParticle(particleHandle);
            }
        }
    }
}
