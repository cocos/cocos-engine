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

import { Director, director, game } from '../game';
import { js, System } from '../core';
import { VFXEmitter } from './vfx-emitter';
import { VFXRenderer } from './vfx-renderer';
import { VFXDynamicBuffer } from './renderers/dynamic-buffer';
import { Buffer, BufferInfo, BufferUsageBit, MemoryUsageBit, deviceManager } from '../gfx';

export const globalDynamicBufferMap: Record<string, VFXDynamicBuffer> = {};

const fixedVertexBuffer = new Float32Array([
    0, 0, 0, 0, 0, 0, // bottom-left
    1, 0, 0, 1, 0, 0, // bottom-right
    0, 1, 0, 0, 1, 0, // top-left
    1, 1, 0, 1, 1, 0, // top-right
]);
const fixedIndexBuffer = new Uint16Array([
    0, 1, 2, 3, 2, 1,
]);

export let globalSpriteVB: Buffer | null = null;
export let globalSpriteIB: Buffer | null = null;

export class VFXManager extends System {
    get totalFrames () {
        return this._totalFrames;
    }

    private _emitters: VFXEmitter[] = [];
    private _renderers: VFXRenderer[] = [];
    private _totalFrames = 0;

    init () {
        director.on(Director.EVENT_UPDATE_PARTICLE, this.tick, this);
        director.on(Director.EVENT_BEFORE_COMMIT, this.render, this);
        director.on(Director.EVENT_UPLOAD_DYNAMIC_VBO, this.updateBuffer);
    }

    addEmitter (particleSystem: VFXEmitter) {
        this._emitters.push(particleSystem);
    }

    removeEmitter (particleSystem: VFXEmitter) {
        const index = this._emitters.indexOf(particleSystem);
        if (index !== -1) {
            js.array.fastRemoveAt(this._emitters, index);
        }
    }

    addRenderer (renderer: VFXRenderer) {
        this._renderers.push(renderer);
    }

    removeRenderer (renderer: VFXRenderer) {
        const index = this._renderers.indexOf(renderer);
        if (index !== -1) {
            js.array.fastRemoveAt(this._renderers, index);
        }
    }

    tick () {
        this._totalFrames++;
        const dt = game.deltaTime;
        const emitters = this._emitters;
        for (let i = 0, length = emitters.length; i < length; i++) {
            this.simulate(emitters[i], dt);
        }
    }

    render () {
        const renderers = this._renderers;
        for (let i = 0, length = renderers.length; i < length; i++) {
            if (renderers[i].isValid) {
                renderers[i].updateRenderData();
            }
        }
    }

    simulate (emitter: VFXEmitter, dt: number) {
        if (!emitter.isValid) {
            return;
        }
        if (emitter.lastSimulateFrame === this._totalFrames) {
            return;
        }
        if (emitter.eventHandlerCount > 0) {
            for (let i = 0, length = emitter.eventHandlerCount; i < length; i++) {
                const parentEmitter = emitter.eventHandlers[i].target;
                if (parentEmitter && parentEmitter.isValid && parentEmitter.isPlaying) {
                    this.simulate(parentEmitter, dt);
                }
            }
        }
        emitter.simulate(dt);
    }

    updateBuffer () {
        for (const key in globalDynamicBufferMap) {
            const dynamicVBO = globalDynamicBufferMap[key];
            dynamicVBO.update();
            dynamicVBO.reset();
        }
    }

    createGlobalBuffer () {
        const vertexStreamSizeStatic = 24;
        globalSpriteVB = deviceManager.gfxDevice.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            vertexStreamSizeStatic * 4,
            vertexStreamSizeStatic,
        ));
        globalSpriteVB.update(fixedVertexBuffer);
        globalSpriteIB = deviceManager.gfxDevice.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            Uint16Array.BYTES_PER_ELEMENT * 6,
            Uint16Array.BYTES_PER_ELEMENT,
        ));
        globalSpriteIB.update(fixedIndexBuffer);
    }

    getOrCreateDynamicVBO (vertexHash, streamSize) {
        if (!globalDynamicBufferMap[vertexHash]) {
            globalDynamicBufferMap[vertexHash] = new VFXDynamicBuffer(deviceManager.gfxDevice, 
                streamSize, BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST);
        }
        return globalDynamicBufferMap[vertexHash].buffer;
    }
}

export const vfxManager = new VFXManager();
director.registerSystem('particle-system', vfxManager, 0);
