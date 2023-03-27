import { ShapeModule } from './shape';
import { ccclass, displayOrder, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { ModuleExecStage, ParticleModule } from '../particle-module';
import { Enum, Vec3 } from '../../core';
import { ParticleDataSet } from '../particle-data-set';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';

export enum EmitFrom {
    VOLUME,
    EDGE,
    SHELL,
}

@ccclass('cc.BoxShapeModule')
@ParticleModule.register('BoxShape', ModuleExecStage.SPAWN)
export class BoxShapeModule extends ShapeModule {
    @type(Enum(EmitFrom))
    @serializable
    public emitFrom = EmitFrom.VOLUME;

    @serializable
    @displayOrder(12)
    @tooltip('i18n:shapeModule.boxThickness')
    @visible(function (this: BoxShapeModule) { return this.emitFrom !== EmitFrom.VOLUME; })
    public boxThickness = new Vec3(0, 0, 0);

    private _boxThickness = new Vec3(0, 0, 0);

    public tick (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        super.tick(particles, params, context);
        this._boxThickness.set(1 - this.boxThickness.x, 1 - this.boxThickness.y, 1 - this.boxThickness.z);
    }

    public execute (particles: ParticleDataSet,  params: ParticleEmitterParams, context: ParticleExecContext) {
        const boxThickness = this._boxThickness;
        const { fromIndex, toIndex } = context;
        const { position, startDir, vec3Register } = particles;
        switch (this.emitFrom) {
        case EmitFrom.VOLUME:
            for (let i = fromIndex; i < toIndex; ++i) {
                Vec3.set(tmpPosition,
                    randomRange(-0.5, 0.5),
                    randomRange(-0.5, 0.5),
                    randomRange(-0.5, 0.5));
                vec3Register.setVec3At(tmpPosition, i);
            }
            break;
        case EmitFrom.SHELL:
            for (let i = fromIndex; i < toIndex; ++i) {
                shuffleArray[0] = randomRange(-0.5, 0.5);
                shuffleArray[1] = randomRange(-0.5, 0.5);
                shuffleArray[2] = randomSign() * 0.5;
                shuffleFloat3(shuffleArray);
                applyBoxThickness(shuffleArray, boxThickness);
                Vec3.set(tmpPosition, shuffleArray[0], shuffleArray[1], shuffleArray[2]);
                vec3Register.setVec3At(tmpPosition, i);
            }
            break;
        case EmitFrom.EDGE:
            for (let i = fromIndex; i < toIndex; ++i) {
                shuffleArray[0] = randomRange(-0.5, 0.5);
                shuffleArray[1] = randomSign() * 0.5;
                shuffleArray[2] = randomSign() * 0.5;
                shuffleFloat3(shuffleArray);
                applyBoxThickness(shuffleArray, boxThickness);
                Vec3.set(tmpPosition, shuffleArray[0], shuffleArray[1], shuffleArray[2]);
                vec3Register.setVec3At(tmpPosition, i);
            }
            break;
        default:
        }
    }
}
