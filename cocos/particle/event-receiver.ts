import { ParticleEmitter } from './particle-emitter';
import { BitMask, Enum } from '../core';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { ModuleExecStage, ParticleModuleStage } from './particle-module';

export enum EventType {
    LOCATION,
    DEATH,
    BIRTH,
    COLLISION,
}

export enum InheritedProperty {
    COLOR = 1,
    SIZE = 1 << 1,
    ROTATION = 1 << 2,
    LIFETIME = 1 << 3,
    DURATION = 1 << 4
}
@ccclass('cc.EventReceiver')
export class EventReceiver {
    @type(ParticleEmitter)
    @serializable
    target: ParticleEmitter | null = null;

    @type(Enum(EventType))
    @serializable
    eventType = EventType.LOCATION;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    @serializable
    private _stage = new ParticleModuleStage(ModuleExecStage.EVENT_HANDLER);
}
