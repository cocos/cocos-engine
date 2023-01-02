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
import { serializable, type } from '../core/data/decorators';
import { CCBoolean } from '../core';

export enum ParticleUpdateStage {
    EMITTER_UPDATE = 0,
    INITIALIZE = 100,
    UPDATE = 200,
    UPDATE_VELOCITY = 300,
    POST_UPDATE_VELOCITY = 400,
    UPDATE_POSITION = 500,
    POST_UPDATE_POSITION = 600,
    POST_UPDATE = 700,
}

export abstract class ParticleModule {
    @type(CCBoolean)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        this._enable = val;
    }

    @serializable
    private _enable = false;

    public abstract get name (): string;
    public abstract get updateStage (): ParticleUpdateStage;
    public onLoad () {}
    public update (particles: ParticleSOAData, particleUpdateContext: ParticleUpdateContext) {}
    public onDestroy () {}
    public onPlay () {}
    public onStop () {}
    public onPause () {}
}
