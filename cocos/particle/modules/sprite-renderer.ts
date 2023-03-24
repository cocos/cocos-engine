import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleModule } from '../particle-module';

export class SpriteRendererModule extends ParticleModule {
    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        throw new Error('Method not implemented.');
    }
}
