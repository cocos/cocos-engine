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

import { ParticleUpdateContext } from './particle-update-context';
import { ParticleSOAData } from './particle-soa-data';
import { ccclass, displayName, serializable, type } from '../core/data/decorators';
import { CCBoolean, CCString } from '../core';

export enum ParticleUpdateStage {
    EMITTER_UPDATE,
    EMITTING,
    INITIALIZE,
    PRE_UPDATE,
    COMPOSITION,
    POST_UPDATE,
}

@ccclass('cc.ParticleModule')
export abstract class ParticleModule {
    @type(CCBoolean)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        this._enable = val;
    }

    @type(CCString)
    @displayName('Name')
    private get inspectorName () {
        return this.name;
    }

    @serializable
    private _enable = false;

    public abstract get name (): string;
    public abstract get updateStage (): ParticleUpdateStage;
    public abstract get updatePriority (): number;
    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {}
    public onPlay () {}
    public onStop () {}
    public onPause () {}
}
