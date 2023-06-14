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
import { VFXDynamicBuffer } from './vfx-dynamic-buffer';
import { Buffer, BufferInfo, BufferUsageBit, MemoryUsageBit, deviceManager, Attribute, FormatInfos } from '../gfx';
import { meshPosition, meshUv } from './define';

export class VFXManager extends System {
    get totalFrames () {
        return this._totalFrames;
    }

    get sharedSpriteVertexBufferAttributes (): ReadonlyArray<Attribute> {
        return this._sharedSpriteVertexBufferAttributes;
    }

    get sharedSpriteVertexCount () {
        return this._sharedSpriteVertexCount;
    }

    get sharedSpriteIndexCount () {
        return this._sharedSpriteIndexCount;
    }

    private _emitters: VFXEmitter[] = [];
    private _renderers: VFXRenderer[] = [];
    private _sharedSpriteVertexBufferAttributes = [meshPosition, meshUv];
    private _sharedSpriteVertexBuffer: Buffer | null = null;
    private _sharedSpriteIndexBuffer: Buffer | null = null;
    private _sharedSpriteVertexCount = 4;
    private _sharedSpriteIndexCount = 6;
    private _totalFrames = 0;
    private _sharedDynamicBufferMap: Record<string, VFXDynamicBuffer> = {};

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
        this.resetBuffer();
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

    resetBuffer () {
        for (const hash in this._sharedDynamicBufferMap) {
            const dynamicBuffer = this._sharedDynamicBufferMap[hash];
            dynamicBuffer.reset();
        }
    }

    updateBuffer () {
        for (const hash in this._sharedDynamicBufferMap) {
            const dynamicBuffer = this._sharedDynamicBufferMap[hash];
            dynamicBuffer.update();
        }
    }

    getOrCreateSharedSpriteVertexBuffer () {
        if (!this._sharedSpriteVertexBuffer) {
            let size = 0;
            for (let i = 0; i < this._sharedSpriteVertexBufferAttributes.length; i++) {
                const attr = this._sharedSpriteVertexBufferAttributes[i];
                size += FormatInfos[attr.format].size;
            }
            this._sharedSpriteVertexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                size * this.sharedSpriteVertexCount,
                size,
            ));
            const vertexBufferData = new Float32Array([
                0, 0, 0, 0, 0, 0, // bottom-left
                1, 0, 0, 1, 0, 0, // bottom-right
                0, 1, 0, 0, 1, 0, // top-left
                1, 1, 0, 1, 1, 0, // top-right
            ]);
            this._sharedSpriteVertexBuffer.update(vertexBufferData);
        }
        return this._sharedSpriteVertexBuffer;
    }

    getOrCreateSharedSpriteIndexBuffer () {
        if (!this._sharedSpriteIndexBuffer) {
            this._sharedSpriteIndexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                Uint16Array.BYTES_PER_ELEMENT * this.sharedSpriteIndexCount,
                Uint16Array.BYTES_PER_ELEMENT,
            ));

            const indexBufferData = new Uint16Array([
                0, 1, 2, 3, 2, 1,
            ]);
            this._sharedSpriteIndexBuffer.update(indexBufferData);
        }
        return this._sharedSpriteIndexBuffer;
    }

    getOrCreateDynamicBuffer (hash: string, streamSize: number, bufferUsageBit: BufferUsageBit) {
        if (!this._sharedDynamicBufferMap[hash]) {
            this._sharedDynamicBufferMap[hash] = new VFXDynamicBuffer(deviceManager.gfxDevice,
                streamSize, bufferUsageBit);
        }
        return this._sharedDynamicBufferMap[hash];
    }
}

export const vfxManager = new VFXManager();
director.registerSystem('particle-system', vfxManager, 0);
