import { ShapeModule } from './shape';
import { ccclass } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';

@ccclass('cc.BoxShapeModule')
@ParticleModule.register('BoxShape', ModuleExecStage.SPAWN)
export class BoxShapeModule extends ShapeModule {

}
