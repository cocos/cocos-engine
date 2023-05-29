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
import { ccclass, displayName, serializable, type } from 'cc.decorator';
import { CCBoolean } from '../core';
import { AttributeName, Format, Attribute } from '../gfx';
import { EmitterDataSet, ParticleDataSet } from './data-set';
import { Model } from '../render-scene/scene';
import { Material, RenderingSubMesh } from '../asset/assets';
import { MaterialInstance } from '../render-scene';

export const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
export const CC_RENDER_MODE = 'CC_RENDER_MODE';
export const ROTATION_OVER_TIME_MODULE_ENABLE = 'ROTATION_OVER_TIME_MODULE_ENABLE';
export const INSTANCE_PARTICLE = 'CC_INSTANCE_PARTICLE';
export const CC_PARTICLE_POSITION = 'CC_PARTICLE_POSITION';
export const CC_PARTICLE_ROTATION = 'CC_PARTICLE_ROTATION';
export const CC_PARTICLE_SIZE = 'CC_PARTICLE_SIZE';
export const CC_PARTICLE_COLOR = 'CC_PARTICLE_COLOR';
export const CC_PARTICLE_FRAME_INDEX = 'CC_PARTICLE_FRAME_INDEX';
export const CC_PARTICLE_VELOCITY = 'CC_PARTICLE_VELOCITY';
export const RENDER_MODE_BILLBOARD = 0;
export const RENDER_MODE_STRETCHED_BILLBOARD = 1;
export const RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
export const RENDER_MODE_VERTICAL_BILLBOARD = 3;
export const RENDER_MODE_MESH = 4;

export const meshPosition = new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0);           // mesh position
export const meshUv = new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 0);                // mesh uv
export const meshNormal = new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F, false, 0);               // mesh normal
export const meshColorRGBA8 = new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0);              // mesh color
export const particlePosition = new Attribute('a_particle_position', Format.RGB32F, false, 1, true);       // particle position
export const particleRotation = new Attribute('a_particle_rotation', Format.RGB32F, false, 1, true);       // particle rotation
export const particleSize = new Attribute('a_particle_size', Format.RGB32F, false, 1, true);               // particle scale
export const particleColor = new Attribute('a_particle_color', Format.RGBA8, true, 1, true);               // particle color
export const particleFrameIndex = new Attribute('a_particle_frame_index', Format.R32F, false, 1, true);          // particle frame id
export const particleVelocity = new Attribute('a_particle_velocity', Format.RGB32F, false, 1, true);       // particle velocity

@ccclass('cc.ParticleRenderer')
export abstract class ParticleRenderer {
    @type(CCBoolean)
    public get enabled () {
        return this._enabled;
    }

    public set enabled (val) {
        this._enabled = val;
    }

    abstract get name (): string;

    @type(Material)
    @displayName('Material')
    public get sharedMaterial () {
        return this._sharedMaterial;
    }

    public set sharedMaterial (val) {
        if (this._sharedMaterial !== val) {
            this._sharedMaterial = val;
            this._material = null;
            this._isMaterialDirty = true;
        }
    }

    public get material () {
        if (!this._material && this._sharedMaterial) {
            this._material = new MaterialInstance({ parent: this._sharedMaterial });
        }
        return this._material;
    }

    public set material (val) {
        if (this._material !== val) {
            this._material = val;
            this._sharedMaterial = null;
            this._isMaterialDirty = true;
        }
    }

    public get renderingSubMesh () {
        return this._renderingSubMesh;
    }

    public get vertexCount () {
        return this._vertexCount;
    }

    public get indexCount () {
        return this._indexCount;
    }

    public get instanceCount () {
        return this._instanceCount;
    }

    protected _isMaterialDirty = false;
    protected _renderingSubMesh: RenderingSubMesh | null = null;
    protected _vertexCount = 0;
    protected _indexCount = 0;
    protected _instanceCount = 0;
    @serializable
    private _sharedMaterial: Material | null = null;
    private _material: MaterialInstance | null = null;
    @serializable
    private _enabled = true;

    public abstract render (particles: ParticleDataSet, emitter: EmitterDataSet);
}
