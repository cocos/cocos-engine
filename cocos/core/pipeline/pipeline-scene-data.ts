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

import { JSB } from 'internal:constants';
import { Fog } from '../renderer/scene/fog';
import { Ambient } from '../renderer/scene/ambient';
import { Skybox } from '../renderer/scene/skybox';
import { Shadows } from '../renderer/scene/shadows';
import { IRenderObject } from './define';
import { Device, Framebuffer, InputAssembler, InputAssemblerInfo, Buffer, BufferInfo,
    BufferUsageBit, MemoryUsageBit, Attribute, Format, Shader } from '../gfx';
import { RenderPipeline } from './render-pipeline';
import { Light } from '../renderer/scene/light';
import { Material } from '../assets';
import { Pass } from '../renderer/core/pass';
import { NativePipelineSharedSceneData } from '../renderer/scene';
import { PipelineEventType } from './pipeline-event';

export class PipelineSceneData {
    private _init (): void {
        if (JSB) {
            this._nativeObj = new NativePipelineSharedSceneData();
            this._nativeObj.fog = this.fog.native;
            this._nativeObj.ambient = this.ambient.native;
            this._nativeObj.skybox = this.skybox.native;
            this._nativeObj.shadow = this.shadows.native;
        }
    }

    public get native (): NativePipelineSharedSceneData {
        return this._nativeObj!;
    }

    /**
      * @en Is open HDR.
      * @zh 是否开启 HDR。
      * @readonly
      */
    public get isHDR () {
        return this._isHDR;
    }

    public set isHDR (val: boolean) {
        this._isHDR = val;
        if (JSB) {
            this._nativeObj!.isHDR = val;
        }
    }
    public get shadingScale () {
        return this._shadingScale;
    }

    public set shadingScale (val: number) {
        if (this._shadingScale !== val) {
            this._shadingScale = val;
            if (JSB) {
                this._nativeObj!.shadingScale = val;
            }
            this._pipeline.emit(PipelineEventType.ATTACHMENT_SCALE_CAHNGED, val);
        }
    }

    public fog: Fog = new Fog();
    public ambient: Ambient = new Ambient();
    public skybox: Skybox = new Skybox();
    public shadows: Shadows = new Shadows();
    /**
      * @en The list for render objects, only available after the scene culling of the current frame.
      * @zh 渲染对象数组，仅在当前帧的场景剔除完成后有效。
      */
    public validPunctualLights: Light[] = [];
    public renderObjects: IRenderObject[] = [];
    public castShadowObjects: IRenderObject[] = [];
    public dirShadowObjects: IRenderObject[] = [];
    public shadowFrameBufferMap: Map<Light, Framebuffer> = new Map();
    protected declare _device: Device;
    protected declare _pipeline: RenderPipeline;
    protected declare _nativeObj: NativePipelineSharedSceneData | null;
    protected _occlusionQueryVertexBuffer: Buffer | null = null;
    protected _occlusionQueryIndicesBuffer: Buffer | null = null;
    protected _occlusionQueryInputAssembler: InputAssembler | null = null;
    protected _occlusionQueryMaterial: Material | null = null;
    protected _occlusionQueryShader: Shader | null = null;
    protected _isHDR = true;
    protected _shadingScale = 1.0;

    constructor () {
        this._init();
        this.shadingScale = 1.0;
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        this._device = device;
        this._pipeline = pipeline;

        this.initOcclusionQuery();

        return true;
    }

    public initOcclusionQuery () {
        if (!this._occlusionQueryInputAssembler) {
            this._occlusionQueryInputAssembler = this._createOcclusionQueryIA();

            if (JSB) {
                this._nativeObj!.occlusionQueryInputAssembler = this._occlusionQueryInputAssembler;
            }
        }

        if (!this._occlusionQueryMaterial) {
            const mat = new Material();
            mat._uuid = 'default-occlusion-query-material';
            mat.initialize({ effectName: 'occlusion-query' });
            this._occlusionQueryMaterial = mat;
            this._occlusionQueryShader = mat.passes[0].getShaderVariant();

            if (JSB) {
                this._nativeObj!.occlusionQueryPass = this._occlusionQueryMaterial.passes[0].native;
                this._nativeObj!.occlusionQueryShader = this._occlusionQueryShader;
            }
        }
    }

    public getOcclusionQueryPass (): Pass | null {
        return this._occlusionQueryMaterial!.passes[0];
    }

    public onGlobalPipelineStateChanged () {
    }

    public destroy () {
        this.ambient.destroy();
        this.skybox.destroy();
        this.fog.destroy();
        this.shadows.destroy();
        this._occlusionQueryInputAssembler?.destroy();
        this._occlusionQueryInputAssembler = null;
        this._occlusionQueryVertexBuffer?.destroy();
        this._occlusionQueryVertexBuffer = null;
        this._occlusionQueryIndicesBuffer?.destroy();
        this._occlusionQueryIndicesBuffer = null;
        if (JSB) {
            this._nativeObj = null;
        }
    }

    private _createOcclusionQueryIA () {
        // create vertex buffer
        const device = this._device;
        const vertices = new Float32Array([-1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1]);
        const vbStride = Float32Array.BYTES_PER_ELEMENT * 3;
        const vbSize = vbStride * 8;
        this._occlusionQueryVertexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, vbSize, vbStride,
        ));
        this._occlusionQueryVertexBuffer.update(vertices);

        // create index buffer
        const indices = new Uint16Array([0, 2, 1, 1, 2, 3, 4, 5, 6, 5, 7, 6, 1, 3, 7, 1, 7, 5, 0, 4, 6, 0, 6, 2, 0, 1, 5, 0, 5, 4, 2, 6, 7, 2, 7, 3]);
        const ibStride = Uint16Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 36;
        this._occlusionQueryIndicesBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, ibSize, ibStride,
        ));
        this._occlusionQueryIndicesBuffer.update(indices);

        const attributes: Attribute[] = [
            new Attribute('a_position', Format.RGB32F),
        ];

        // create cube input assembler
        const info = new InputAssemblerInfo(attributes, [this._occlusionQueryVertexBuffer], this._occlusionQueryIndicesBuffer);
        const inputAssembler = device.createInputAssembler(info);

        return inputAssembler;
    }
}
