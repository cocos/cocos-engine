import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ParticleVec3Parameter } from '../particle-parameter';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const tempVelocity = new Vec3();

@ccclass('SolveModule')
@ParticleModule.register('Solve', ModuleExecStage.UPDATE, 10)
export class SolveModule extends ParticleModule {
    constructor () {
        super();
        this.enabled = true;
    }

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, deltaTime } = context;
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY) && particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const { position, velocity } = particles;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                velocity.getVec3At(tempVelocity, particleHandle);
                position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION) && particles.hasParameter(BuiltinParticleParameter.ANGULAR_VELOCITY)) {
            const { angularVelocity, rotation } = particles;
            for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                angularVelocity.getVec3At(tempVelocity, particleHandle);
                rotation.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
            }
        }
    }
}
