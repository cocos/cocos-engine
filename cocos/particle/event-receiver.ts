import { ParticleEmitter } from './particle-emitter';
import { BitMask, Color, Enum, Mat4, Vec3 } from '../core';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { ModuleExecStage, ParticleModuleStage } from './particle-module';
import { InheritedProperty, ParticleEventType } from './particle-base';

@ccclass('cc.EventReceiver')
export class EventReceiver {
    @type(ParticleEmitter)
    @serializable
    public target: ParticleEmitter | null = null;

    @type(Enum(ParticleEventType))
    @serializable
    public eventType = ParticleEventType.UNKNOWN;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    @type(ParticleModuleStage)
    get stage () {
        return this._stage;
    }

    @serializable
    private _stage = new ParticleModuleStage(ModuleExecStage.EVENT_HANDLER);
    private _accumulatorCapacity = 16;
    private _accumulatorId: Uint32Array | null = null;
    private _accumulator: Float32Array | null = null;

    getAccumulator (id: number) {
        return 0;
    }

    setAccumulator (id: number, accumulator: number) {

    }
}
