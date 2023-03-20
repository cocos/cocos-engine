import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ModuleExecStage } from '../particle-module';
import { ParticleData, ParticleVec3Parameter } from '../particle-data';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

const tempVelocity = new Vec3();

@ccclass('SolveModule')
@ParticleModule.register('Solve', ModuleExecStage.UPDATE, 10)
export class SolveModule extends ParticleModule {
    constructor () {
        super();
        this.enabled = true;
    }

    public execute (particles: ParticleData, params: ParticleEmitterParams, context: ParticleExecContext) {
        const { fromIndex, toIndex, deltaTime } = context;
        const { speedModifier, position, angularVelocity, rotation, velocity, animatedVelocity } = particles;
        for (let particleHandle = fromIndex; particleHandle < toIndex; particleHandle++) {
            ParticleVec3Parameter.add(tempVelocity, velocity, animatedVelocity, particleHandle);
            position.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime * speedModifier[particleHandle]), particleHandle);
            angularVelocity.getVec3At(tempVelocity, particleHandle);
            rotation.addVec3At(Vec3.multiplyScalar(tempVelocity, tempVelocity, deltaTime), particleHandle);
        }
    }
}
