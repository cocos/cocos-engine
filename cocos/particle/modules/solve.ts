import { Vec3 } from '../../core';
import { ccclass } from '../../core/data/decorators';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystemParams, ParticleUpdateContext } from '../particle-update-context';

const velocity = new Vec3();

@ccclass('SolveModule')
export class SolveModule extends ParticleModule {
    public get name (): string {
        return 'SolveVelocityAndForce';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, params: ParticleSystemParams, context: ParticleUpdateContext,
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
