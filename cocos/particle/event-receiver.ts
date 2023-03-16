import { ParticleEmitter } from './particle-emitter';
import { BitMask, Color, Enum, Mat4, MissingScript, Vec3 } from '../core';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { ModuleExecStage, ParticleModuleStage } from './particle-module';
import { InheritedProperty, ParticleEvents, ParticleEventType } from './particle-base';

const mismatchArray: number[] = [];
export class SpawnFractionCollection {
    get spawnFraction () {
        return this._spawnFraction;
    }
    private _capacity = 16;
    private _count = 0;
    private _id = new Uint32Array(this._capacity);
    private _spawnFraction = new Float32Array(this._capacity);

    sync (locationEvents: ParticleEvents) {
        this.reserve(locationEvents.capacity);
        const id = locationEvents.particleId;
        const iterationTimes = Math.min(locationEvents.count, this._count);
        mismatchArray.length = 0;
        for (let i = 0; i < iterationTimes; i++) {
            if (this._id[i] === id[i]) {
                continue;
            } else {
                const mismatchId = this._id[i];
                for (let j = mismatchArray.length - 1; j >= 0; j--) {
                    if (id[mismatchArray[j]] === mismatchId) {
                        this._spawnFraction[mismatchArray[j]] = this._spawnFraction[i];
                        mismatchArray[j] = mismatchArray[mismatchArray.length - 1];
                        mismatchArray.length--;
                    }
                }
                mismatchArray.push(i);
                this._id[i] = id[i];
                this._spawnFraction[i] = 0;
            }
        }
        if (locationEvents.count < this._count) {
            for (let i = locationEvents.count; i < this._count; i++) {
                const mismatchId = this._id[i];
                for (let j = mismatchArray.length - 1; j >= 0; j--) {
                    const mismatchIndex = mismatchArray[j];
                    if (id[mismatchIndex] === mismatchId) {
                        this._spawnFraction[mismatchIndex] = this._spawnFraction[i];
                        mismatchArray[j] = mismatchArray[mismatchArray.length - 1];
                        mismatchArray.length--;
                    }
                }
            }
        } else if (locationEvents.count > this._count) {
            for (let i = this._count; i < locationEvents.count; i++) {
                this._id[i] = id[i];
                this._spawnFraction[i] = 0;
            }
        }
        this._count = locationEvents.count;
    }

    reserve (capacity: number) {
        if (capacity > this._capacity) {
            const oldSpawnFraction = this._spawnFraction;
            const oldId = this._id;
            this._spawnFraction = new Float32Array(capacity);
            this._spawnFraction.set(oldSpawnFraction);
            this._id = new Uint32Array(capacity);
            this._id.set(oldId);
            this._capacity = capacity;
        }
    }
}

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

    get spawnFractionCollection () {
        if (!this._spawnFractionCollection) {
            this._spawnFractionCollection = new SpawnFractionCollection();
        }
        return this._spawnFractionCollection;
    }

    @serializable
    private _stage = new ParticleModuleStage(ModuleExecStage.EVENT_HANDLER);
    private _spawnFractionCollection: SpawnFractionCollection | null = null;
}
