import { BitMask, Enum, Mat4, Quat, Vec3, lerp } from '../core';
import { ccclass, displayName, serializable, type, visible } from '../core/data/decorators';
import { Space } from './enum';
import { InheritedProperty, ParticleEmitterParams, ParticleEventInfo, ParticleEventType, ParticleExecContext } from './particle-base';
import { ParticleEmitter } from './particle-emitter';
import { ModuleExecStage, ParticleModuleStage } from './particle-module';
import { ParticleFloatArrayParameter } from './particle-parameter';
import { RandomStream } from './random-stream';
import { SpawnFractionCollection } from './spawn-fraction-collection';

@ccclass('cc.EventReceiver')
export class EventReceiver extends ParticleModuleStage {
    @visible(true)
    @serializable
    public target: ParticleEmitter | null = null;

    @type(Enum(ParticleEventType))
    @visible(true)
    @serializable
    public eventType = ParticleEventType.UNKNOWN;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    get spawnFractionCollection () {
        if (!this._spawnFractionCollection) {
            this._spawnFractionCollection = new SpawnFractionCollection();
        }
        return this._spawnFractionCollection;
    }

    private _spawnFractionCollection: SpawnFractionCollection | null = null;
    private _idToIndex: Map<number, number> = new Map();
    private _spawnFraction = new ParticleFloatArrayParameter();

    constructor () {
        super(ModuleExecStage.EVENT_HANDLER);
    }
}
