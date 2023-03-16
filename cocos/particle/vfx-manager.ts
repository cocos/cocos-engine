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

import { Director, director, game, js } from '../core';
import System from '../core/components/system';
import { ParticleEmitter } from './particle-emitter';
import { ParticleEmitterRenderer } from './particle-emitter-renderer';

export class VFXManager extends System {
    get totalFrames () {
        return this._totalFrames;
    }

    private _emitters: ParticleEmitter[] = [];
    private _renderers: ParticleEmitterRenderer[] = [];
    private _totalFrames = 0;

    init () {
        director.on(Director.EVENT_UPDATE_PARTICLE, this.tick, this);
    }

    addEmitter (particleSystem: ParticleEmitter) {
        this._emitters.push(particleSystem);
    }

    removeEmitter (particleSystem: ParticleEmitter) {
        const index = this._emitters.indexOf(particleSystem);
        if (index !== -1) {
            js.array.fastRemoveAt(this._emitters, index);
        }
    }

    addRenderer (renderer: ParticleEmitterRenderer) {
        this._renderers.push(renderer);
    }

    removeRenderer (renderer: ParticleEmitterRenderer) {
        const index = this._renderers.indexOf(renderer);
        if (index !== -1) {
            js.array.fastRemoveAt(this._renderers, index);
        }
    }

    tick () {
        this._totalFrames++;
        const dt = game.deltaTime;
        const emitters = this._emitters;
        const renderers = this._renderers;
        for (let i = 0, length = emitters.length; i < length; i++) {
            this.simulate(emitters[i], dt);
        }
        for (let i = 0, length = renderers.length; i < length; i++) {
            renderers[i].updateRenderData();
        }
    }

    simulate (emitter: ParticleEmitter, dt: number) {
        if (emitter.lastSimulateFrame === this._totalFrames) {
            return;
        }
        if (emitter.eventReceivers.length > 0) {
            for (let i = 0, length = emitter.eventReceivers.length; i < length; i++) {
                const parentEmitter = emitter.eventReceivers[i].target;
                if (parentEmitter && parentEmitter.isValid && parentEmitter.isPlaying) {
                    this.simulate(parentEmitter, dt);
                }
            }
        }
        emitter.simulate(dt);
    }
}

export const vfxManager = new VFXManager();
director.registerSystem('particle-system', vfxManager, 0);
