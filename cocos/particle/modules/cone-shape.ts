import { ShapeModule } from './shape';
import { ccclass, displayOrder, serializable, tooltip } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Vec3 } from '../../core';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

@ccclass('cc.ConeShapeModule')
@ParticleModule.register('ConeShape', ModuleExecStage.SPAWN)
export class ConeShapeModule extends ShapeModule {
    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        this._boxThickness.set(1 - this.boxThickness.x, 1 - this.boxThickness.y, 1 - this.boxThickness.z);
    }

    public execute () {

    }
}
