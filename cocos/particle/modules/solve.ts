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
        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        const hasAnimatedVelocity = particles.hasParameter(BuiltinParticleParameter.ANIMATED_VELOCITY);
        const hasSpeedModifier = particles.hasParameter(BuiltinParticleParameter.SPEED_MODIFIER);
        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        if (hasPosition) {
            if (hasVelocity && hasAnimatedVelocity && hasSpeedModifier) {
                const { position, velocity, animatedVelocity } = particles;
                const speedModifier = particles.speedModifier.data;
                for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                    ParticleVec3Parameter.addSingle(tempVelocity, velocity, animatedVelocity, particleHandle);
                    position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime * speedModifier[particleHandle]), particleHandle);
                }
            } else if (hasVelocity && hasAnimatedVelocity) {
                const { position, velocity, animatedVelocity } = particles;
                for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                    ParticleVec3Parameter.addSingle(tempVelocity, velocity, animatedVelocity, particleHandle);
                    position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
                }
            } else if (hasVelocity) {
                const { position, velocity } = particles;
                for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                    velocity.getVec3At(tempVelocity, particleHandle);
                    position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
                }
            } else if (hasAnimatedVelocity) {
                const { position, animatedVelocity } = particles;
                for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
                    animatedVelocity.getVec3At(tempVelocity, particleHandle);
                    position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
                }
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
