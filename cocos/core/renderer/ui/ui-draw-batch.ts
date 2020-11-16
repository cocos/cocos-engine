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
import { Texture, Sampler, DescriptorSetInfo } from '../../gfx';
import { Node } from '../../scene-graph';
import { Camera } from '../scene/camera';
import { Model } from '../scene/model';
import { UI } from './ui';
import { InputAssemblerHandle, DescriptorSetHandle, NULL_HANDLE, DSPool } from '../core/memory-pools';

export class UIDrawBatch {

    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public hInputAssembler: InputAssemblerHandle = NULL_HANDLE;
    public hDescriptorSet: DescriptorSetHandle = NULL_HANDLE;
    public useLocalData: Node | null = null;
    public isStatic = false;

    public textureHash: number = 0;
    public samplerHash: number = 0;

    public destroy (ui: UI) {
        if (this.hDescriptorSet) {
            this.hDescriptorSet = NULL_HANDLE;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this.hInputAssembler = NULL_HANDLE;
        this.camera = null;
        this.material = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
    }
}
