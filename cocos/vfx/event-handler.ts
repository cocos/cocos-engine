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
import { InheritedProperty, ParticleEmitterParams, ParticleEventType, ParticleExecContext } from './particle-base';
import { ParticleEmitter } from './particle-emitter';
import { ModuleExecStage, ParticleModuleStage } from './particle-module';
import { ParticleFloatArrayParameter, ParticleUint32ArrayParameter } from './particle-parameter';
import { ParticleDataSet } from './particle-data-set';

export class EventSpawnStates {
    private _version = 0;
    private _id2IndexMap = {};
    private _count = 0;
    private _id = new ParticleUint32ArrayParameter();
    private _lastUsed = new ParticleUint32ArrayParameter();
    private _spawnFraction = new ParticleFloatArrayParameter();

    public getSpawnFraction (id: number) {
        if (id in this._id2IndexMap) {
            const index = this._id2IndexMap[id];
            this._lastUsed.setUint32At(this._version, index);
            return this._spawnFraction.getFloatAt(index);
        }
        const index = this._count;
        this._id.reserve(index + 1);
        this._lastUsed.reserve(index + 1);
        this._spawnFraction.reserve(index + 1);
        this._id2IndexMap[id] = index;
        this._spawnFraction.setFloatAt(0, index);
        this._id.setUint32At(id, index);
        this._lastUsed.setUint32At(this._version, index);
        this._count++;
        return 0;
    }

    public setSpawnFraction (id: number, value: number) {
        if (DEBUG) {
            assertIsTrue(id in this._id2IndexMap, 'id not found');
            assertIsTrue(this._lastUsed.getUint32At(this._id2IndexMap[id]) === this._version);
        }
        const index = this._id2IndexMap[id];
        this._spawnFraction.setFloatAt(value, index);
    }

    public tick () {
        const lastUsed = this._lastUsed;
        const spawnFraction  = this._spawnFraction;
        const id = this._id;
        for (let i = this._count - 1; i >= 0; i--) {
            if (lastUsed.getUint32At(i) !== this._version) {
                delete this._id2IndexMap[id.getUint32At(i)];
                const last = this._count - 1;
                id.move(last, i);
                spawnFraction.move(last, i);
                lastUsed.move(last, i);
                this._count--;
            }
        }
        this._version++;
    }
}

@ccclass('cc.EventHandler')
export class EventHandler extends ParticleModuleStage {
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

    public get eventSpawnStates () {
        if (!this._eventSpawnStates) {
            this._eventSpawnStates = new EventSpawnStates();
        }
        return this._eventSpawnStates;
    }
    private _eventSpawnStates: EventSpawnStates | null = null;

    public tick (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        this._eventSpawnStates?.tick();
        super.tick(particles, params, context);
    }

    constructor () {
        super(ModuleExecStage.EVENT_HANDLER);
    }
}
