import { ModuleExecContext } from '../base';
import { EmitterDataSet } from '../emitter-data-set';
import { ParticleDataSet } from '../particle-data-set';
import { UserDataSet } from '../user-data-set';
import { VFXModule } from '../vfx-module';

export class SetParameterModule extends VFXModule {
    public execute (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        throw new Error('Method not implemented.');
    }
}
