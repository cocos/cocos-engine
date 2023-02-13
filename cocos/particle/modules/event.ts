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

import { BitMask, CCFloat, Enum } from '../../core';
import { ccclass, range, serializable, type, visible } from '../../core/data/decorators';
import { ParticleModule, ParticleUpdateStage } from '../particle-module';
import { ParticleSOAData } from '../particle-soa-data';
import { ParticleSystem } from '../particle-system';
import { ParticleUpdateContext } from '../particle-update-context';

export enum EventCondition {
    BIRTH,
    DEATH,
}

export enum InheritedProperty {
    COLOR = 1,
    SIZE = 1 << 1,
    ROTATION = 1 << 2,
    LIFETIME = 1 << 3,
    DURATION = 1 << 4
}

@ccclass('cc.EventData')
export class EventData {
    @type(Enum(EventCondition))
    @visible(true)
    @serializable
    public condition = EventCondition.BIRTH;

    @type(ParticleSystem)
    @visible(true)
    @serializable
    public emitter: ParticleSystem | null = null;

    @type(BitMask(InheritedProperty))
    @visible(true)
    @serializable
    public inheritedProperties = 0;

    @type(CCFloat)
    @range([0, 1])
    @serializable
    public probability = 1;
}

@ccclass('cc.EventModule')
export class EventModule extends ParticleModule {
    @type([EventData])
    @visible(true)
    @serializable
    public spawnEvents: EventData[] = [];

    public get name (): string {
        return 'EventModule';
    }

    public get updateStage (): ParticleUpdateStage {
        return ParticleUpdateStage.POST_UPDATE;
    }

    public get updatePriority (): number {
        return 0;
    }

    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {

    }
}
