/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
import { ccclass, serializable, type, visible } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { BitMask, Enum, assertIsTrue } from '../core';
import { ModuleExecContext } from './base';
import { VFXEmitter } from './vfx-emitter';
import { ModuleExecStage, VFXModuleStage } from './vfx-module';
import { FloatArrayParameter, Uint32ArrayParameter } from './particle-parameter';
import { ParticleDataSet } from './particle-data-set';
import { ParticleEventType, InheritedProperty } from './enum';
import { EmitterDataSet } from './emitter-data-set';
import { UserDataSet } from './user-data-set';

export class EventSpawnStates {
    get capacity () {
        return this._particleId.capacity;
    }

    get count () {
        return this._count;
    }

    private _version = 1;
    private _particleId2Index = {};
    private _count = 0;
    private _particleId = new Uint32ArrayParameter();
    private _lastUsed = new Uint32ArrayParameter();
    private _spawnFraction = new FloatArrayParameter();

    public getSpawnFraction (id: number) {
        if (id in this._particleId2Index) {
            const index = this._particleId2Index[id];
            this._lastUsed.setUint32At(this._version, index);
            return this._spawnFraction.getFloatAt(index);
        }
        const index = this._count;
        if (index >= this.capacity) {
            const newCapacity = this.capacity * 2;
            this._particleId.reserve(newCapacity);
            this._lastUsed.reserve(newCapacity);
            this._spawnFraction.reserve(newCapacity);
        }
        this._particleId2Index[id] = index;
        this._spawnFraction.setFloatAt(0, index);
        this._particleId.setUint32At(id, index);
        this._lastUsed.setUint32At(this._version, index);
        this._count++;
        return 0;
    }

    public setSpawnFraction (id: number, value: number) {
        if (DEBUG) {
            assertIsTrue(id in this._particleId2Index, 'id not found');
            assertIsTrue(this._lastUsed.getUint32At(this._particleId2Index[id]) === this._version);
        }
        const index = this._particleId2Index[id];
        this._spawnFraction.setFloatAt(value, index);
    }

    public tick () {
        const lastUsed = this._lastUsed;
        const spawnFraction  = this._spawnFraction;
        const id = this._particleId;
        for (let i = this._count - 1; i >= 0; i--) {
            if (lastUsed.getUint32At(i) !== this._version) {
                const last = this._count - 1;
                const lastId = id.getUint32At(last);
                this._particleId2Index[lastId] = i;
                delete this._particleId2Index[id.getUint32At(i)];
                id.move(last, i);
                spawnFraction.move(last, i);
                lastUsed.move(last, i);
                this._count--;
            }
        }
        this._version++;
    }

    public clear () {
        this._version = 0;
        this._particleId2Index = {};
        this._count = 0;
    }
}

@ccclass('cc.EventHandler')
export class EventHandler extends VFXModuleStage {
    @visible(true)
    @serializable
    public target: VFXEmitter | null = null;

    @type(Enum(ParticleEventType))
    @visible(true)
    @serializable
    public eventType = ParticleEventType.UNKNOWN;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    public get eventSpawnStates () {
        if (!this._eventSpawnStates) {
            this._eventSpawnStates = new EventSpawnStates();
        }
        return this._eventSpawnStates;
    }
    private _eventSpawnStates: EventSpawnStates | null = null;

    public tick (particles: ParticleDataSet, emitter: EmitterDataSet, user: UserDataSet, context: ModuleExecContext) {
        this._eventSpawnStates?.tick();
        super.tick(particles, emitter, user, context);
    }

    constructor () {
        super(ModuleExecStage.EVENT_HANDLER);
    }
}
