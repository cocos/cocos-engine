import { ShapeModule } from './shape';
import { ccclass, displayOrder, serializable, tooltip } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Vec3 } from '../../core';

@ccclass('cc.BoxShapeModule')
@ParticleModule.register('BoxShape', ModuleExecStage.SPAWN)
export class BoxShapeModule extends ShapeModule {
    /**
     * @zh 粒子发射器发射位置。
     */
    @serializable
    @displayOrder(12)
    @tooltip('i18n:shapeModule.boxThickness')
    public boxThickness = new Vec3(0, 0, 0);

    private _boxThickness = new Vec3(0, 0, 0);

    public execute () {

    }
}
