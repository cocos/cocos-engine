import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage, moduleName, execStages, execOrder, registerParticleModule } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleEmitterParams, ParticleUpdateContext } from '../particle-update-context';

const velocity = new Vec3();

@ccclass('SolveModule')
@registerParticleModule('Solve', ModuleExecStage.UPDATE, 0)
export class SolveModule extends ParticleModule {
    public update (particles: ParticleSOAData, params: ParticleEmitterParams, context: ParticleUpdateContext,
        fromIndex: number, toIndex: number, dt: number) {
        const { speedModifier } = particles;
        for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
            particles.getFinalVelocityAt(velocity, particleHandle);
            particles.addPositionAt(Vec3.multiplyScalar(velocity, velocity, dt * speedModifier[particleHandle]), particleHandle);
            particles.getAngularVelocityAt(velocity, particleHandle);
            particles.addRotationAt(Vec3.multiplyScalar(velocity, velocity, dt), particleHandle);
        }
    }
}
