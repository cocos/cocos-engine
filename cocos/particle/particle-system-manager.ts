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
import { ParticleSystem } from './particle-system';
import { ParticleSystemRenderer } from './particle-system-renderer';

export class ParticleSystemManager extends System {
    private _particleSystems: ParticleSystem[] = [];
    private _particleSystemRenderers: ParticleSystemRenderer[] = [];

    init () {
        director.on(Director.EVENT_UPDATE_PARTICLE, this.tick, this);
    }

    addParticleSystem (particleSystem: ParticleSystem) {
        this._particleSystems.push(particleSystem);
    }

    removeParticleSystem (particleSystem: ParticleSystem) {
        const index = this._particleSystems.indexOf(particleSystem);
        if (index !== -1) {
            js.array.fastRemoveAt(this._particleSystems, index);
        }
    }

    addParticleSystemRenderer (particleSystemRenderer: ParticleSystemRenderer) {
        this._particleSystemRenderers.push(particleSystemRenderer);
    }

    removeParticleSystemRenderer (particleSystemRenderer: ParticleSystemRenderer) {
        const index = this._particleSystemRenderers.indexOf(particleSystemRenderer);
        if (index !== -1) {
            js.array.fastRemoveAt(this._particleSystemRenderers, index);
        }
    }

    tick () {
        const dt = game.deltaTime;
        for (let i = 0; i < this._particleSystems.length; i++) {
            this._particleSystems[i].simulate(dt);
        }
        for (let i = 0; i < this._particleSystemRenderers.length; i++) {
            this._particleSystemRenderers[i].updateRenderData();
        }
    }
}

export const particleSystemManager = new ParticleSystemManager();
director.registerSystem('particle-system', particleSystemManager, 0);