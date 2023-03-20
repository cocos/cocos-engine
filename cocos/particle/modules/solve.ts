import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleData } from '../particle-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const velocity = new Vec3();

@ccclass('SolveModule')
@ParticleModule.register('Solve', ModuleExecStage.UPDATE, 10)
export class SolveModule extends ParticleModule {
    constructor () {
        super();
        this.enabled = true;
    }

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, deltaTime } = context;
        const { speedModifier } = particles;
        for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
            particles.getFinalVelocityAt(velocity, particleHandle);
            particles.addPositionAt(Vec3.multiplyScalar(velocity, velocity, deltaTime * speedModifier[particleHandle]), particleHandle);
            particles.getAngularVelocityAt(velocity, particleHandle);
            particles.addRotationAt(Vec3.multiplyScalar(velocity, velocity, deltaTime), particleHandle);
        }
    }
}
