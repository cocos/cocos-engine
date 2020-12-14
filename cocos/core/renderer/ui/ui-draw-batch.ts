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

/**
 * @packageDocumentation
 * @hidden
 */

import { MeshBuffer } from '../../../ui';
import { Material } from '../../assets/material';
import { Texture, Sampler } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { InputAssemblerHandle, DescriptorSetHandle, NULL_HANDLE, UIBatchHandle, UIBatchPool, UIBatchView, DSPool } from '../core/memory-pools';
import { Layers } from '../../scene-graph/layers';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class UIDrawBatch {
    public get handle () {
        return this._handle;
    }
    public get hInputAssembler () {
        return UIBatchPool.get(this._handle, UIBatchView.INPUT_ASSEMBLER);
    }
    public set hInputAssembler (handle) {
        UIBatchPool.set(this._handle, UIBatchView.INPUT_ASSEMBLER, handle);
    }
    public get hDescriptorSet () {
        return UIBatchPool.get(this._handle, UIBatchView.DESCRIPTOR_SET);
    }
    public set hDescriptorSet (handle) {
        UIBatchPool.set(this._handle, UIBatchView.DESCRIPTOR_SET, handle);
    }
    public get material () {
        return this._material;
    }
    public get passes () {
        return this._material!.passes;
    }
    public set material (mat) {
        this._material = mat;
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            UIBatchPool.set(this._handle, UIBatchView.PASS_COUNT, passes.length);
            let passOffset = UIBatchView.PASS_0 as const;
            let shaderOffset = UIBatchView.SHADER_0 as const;
            for (let i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
                UIBatchPool.set(this._handle, passOffset, passes[i].handle);
                UIBatchPool.set(this._handle, shaderOffset, passes[i].getShaderVariant());
            }
        }
    }
    public get visFlags () {
        return UIBatchPool.get(this._handle, UIBatchView.VIS_FLAGS);
    }
    public set visFlags (vis) {
        UIBatchPool.set(this._handle, UIBatchView.VIS_FLAGS, vis);
    }
    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public model: Model | null = null;
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;
    public textureHash: number = 0;
    public samplerHash: number = 0;
    private _material: Material | null = null;
    private _handle: UIBatchHandle = NULL_HANDLE;

    constructor () {
        this._handle = UIBatchPool.alloc();
        UIBatchPool.set(this._handle, UIBatchView.VIS_FLAGS, UI_VIS_FLAG);
        UIBatchPool.set(this._handle, UIBatchView.INPUT_ASSEMBLER, NULL_HANDLE);
        UIBatchPool.set(this._handle, UIBatchView.DESCRIPTOR_SET, NULL_HANDLE);
    }

    public destroy (ui: UI) {
        if (this._handle) {
            UIBatchPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }

    public clear () {
        this._material = null;
        this.bufferBatch = null;
        this.hInputAssembler = NULL_HANDLE;
        this.hDescriptorSet = NULL_HANDLE
        this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
    }
}
