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
import { ccclass, executeInEditMode, menu, playOnFocus, readOnly, serializable, tooltip, type, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { CCBoolean, Color, Enum, Vec3 } from '../core';
import { BufferTextureCopy } from '../gfx/base/define';

import { deviceManager } from '../gfx';
import { Component } from '../scene-graph/component';
import { CAMERA_DEFAULT_MASK } from '../rendering/define';
import { RenderTexture, TextureCube } from '../asset/assets';
import { ReflectionProbeManager } from '../rendering/reflectionProbeManager';
import { Layers } from '../scene-graph/layers';
import { legacyCC } from '../core/global-exports';
import { Camera } from './camera-component';
import { scene } from '../render-scene';
import { ProbeClearFlag, ProbeType } from '../render-scene/scene/reflection-probe';

export const ProbeResolution = Enum({
    /**
     * @zh 分辨率 128 * 128。
     * @en renderTexture resolution 128 * 128.
     * @readonly
     */
    Low_128x128: 128,
    /**
     * @zh 分辨率 256 * 256。
     * @en renderTexture resolution 256 * 256.
     * @readonly
     */
    Low_256x256: 256,

    /**
      * @zh 分辨率 512 * 512。
      * @en renderTexture resolution 512 * 512.
      * @readonly
      */
    Medium_512x512: 512,

    /**
      * @zh 分辨率 1024 * 1024。
      * @en renderTexture resolution 1024 * 1024.
      * @readonly
      */
    High_1024x1024: 1024,

    /**
      * @zh 分辨率 2048 * 2048。
      * @en renderTexture resolution 2048 * 2048.
      * @readonly
      */
    Ultra_2048x2048: 2048,
});
@ccclass('cc.ReflectionProbe')
@menu('Rendering/ReflectionProbe')
@executeInEditMode
@playOnFocus
export class ReflectionProbe extends Component {
    @serializable
    protected _resolution = 512;
    @serializable
    protected _clearFlag = ProbeClearFlag.SKYBOX;

    @serializable
    protected _backgroundColor = new Color(0, 0, 0, 255);

    @serializable
    protected _visibility = CAMERA_DEFAULT_MASK;

    @serializable
    protected _probeType = ProbeType.CUBE;

    @serializable
    protected _cubemap: TextureCube | null = null;

    @serializable
    protected _size = new Vec3();

    @serializable
    protected _sourceCamera: Camera | null = null;

    @serializable
    private _probeId = -1;

    protected _probe: scene.ReflectionProbe | null = null;

    /**
     * @en
     * Gets or sets the size of the box
     * @zh
     * 获取或设置包围盒的大小。
     */
    set size (value) {
        this._size = value;
        this.probe.size = this._size;
    }
    get size () {
        return this._size;
    }

    /**
     * @en Environment reflection or plane reflection.
     * @zh 设置探针类型，环境反射或者平面反射
     */
    @type(ProbeType)
    set probeType (value: number) {
        this._probeType = value;
        this.probe.probeType = value;

        if (this._probeType === ProbeType.CUBE) {
            this.probe.switchProbeType(value);
        } else if (!this._sourceCamera) {
            console.error('the reflection camera is invalid, please set the reflection camera');
        } else {
            this.probe.switchProbeType(value, this._sourceCamera.camera);
        }
    }
    get probeType () {
        return this._probeType;
    }

    /**
     * @en set render texture size
     * @zh 设置渲染纹理大小
     */
    @type(ProbeResolution)
    set resolution (value: number) {
        this._resolution = value;
        this.probe.resolution = value;
    }
    get resolution () {
        return this._resolution;
    }

    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    @type(ProbeClearFlag)
    set clearFlag (value: number) {
        this._clearFlag = value;
        this.probe.clearFlag = this._clearFlag;
    }
    get clearFlag () {
        return this._clearFlag;
    }

    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    @visible(function (this: ReflectionProbe) { return this._clearFlag === ProbeClearFlag.SOLID_COLOR; })
    @type(Color)
    set backgroundColor (val: Color) {
        this._backgroundColor = val;
        this.probe.backgroundColor = this._backgroundColor;
    }
    get backgroundColor () {
        return this._backgroundColor;
    }

    /**
     * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
     * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    @type(Layers.BitMask)
    @tooltip('i18n:camera.visibility')
    get visibility () {
        return this._visibility;
    }
    set visibility (val) {
        this._visibility = val;
        this.probe.visibility = this._visibility;
    }

    /**
     * @en The camera to render planar reflections, specified by the user
     * @zh 需要渲染平面反射的相机，由用户指定
     */
    @visible(function (this: ReflectionProbe) { return this.probeType === ProbeType.PLANAR; })
    @type(Camera)
    set sourceCamera (camera: Camera) {
        this._sourceCamera = camera;
        if (camera) {
            this.visibility = camera.visibility;
            this.clearFlag = camera.clearFlags;
            this.backgroundColor = camera.clearColor;
            if (this.probeType === ProbeType.PLANAR) {
                this.probe.switchProbeType(this.probeType, camera.camera);
            }
        }
    }
    get sourceCamera () {
        return this._sourceCamera!;
    }

    set cubemap (val: TextureCube) {
        this._cubemap = val;
        this.probe.cubemap = val;
    }

    get probe () {
        return this._probe!;
    }

    public onLoad () {
        if (EDITOR || this.probeType === ProbeType.PLANAR) {
            this._createProbe();
        }
    }

    onEnable () {
        if (EDITOR || this.probeType === ProbeType.PLANAR) {
            ReflectionProbeManager.probeManager.register(this._probe!);
        }
    }
    onDisable () {
        if (EDITOR || this.probeType === ProbeType.PLANAR) {
            ReflectionProbeManager.probeManager.unregister(this._probe!);
        }
    }

    public start () {
        if (EDITOR) {
            this.probe.initBakedTextures();
        }
        if (this._sourceCamera && this.probeType === ProbeType.PLANAR) {
            this.probe.switchProbeType(this.probeType, this.sourceCamera.camera);
        }
    }

    public onDestroy () {
        this.probe.destroy();
    }

    public update (dt: number) {
        if (!EDITOR && this.probeType === ProbeType.CUBE) return;
        if (this.node.hasChangedFlags) {
            this.probe.updateBoundingBox();
            ReflectionProbeManager.probeManager.updateModes(this.probe);
        }
    }

    public async bakeCubemap () {
        if (this.probeType === ProbeType.CUBE) {
            await this.captureCube();
        }
    }

    /* eslint-disable no-await-in-loop */
    /**
     * @en Render the six faces of the Probe and use the tool to generate a cubemap and save it to the asset directory.
     * @zh 渲染Probe的6个面，并且使用工具生成cubemap保存至asset目录。
     */
    public async captureCube () {
        await this.probe.captureCubemap();
        //Save rendertexture data to the resource directory
        const caps = (legacyCC.director.root).device.capabilities;
        const files: string[] = [];
        for (let faceIdx = 0; faceIdx < 6; faceIdx++) {
            const fileName = `capture_${faceIdx}.png`;
            files.push(fileName);
            let pixelData = this._readPixels(this.probe.bakedCubeTextures[faceIdx]);
            if (caps.clipSpaceMinZ === -1) {
                pixelData = this._flipImage(pixelData, this._resolution, this._resolution);
            }
            await EditorExtends.Asset.saveDataToImage(pixelData, this._resolution, this._resolution, this.node.scene.name, fileName);
        }
        //use the tool to generate a cubemap and save to asset directory
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        await EditorExtends.Asset.bakeReflectionProbe(files, isHDR, this.node.scene.name, this.probe.getProbeId(), (assert: any) => {
            this.cubemap = assert;
        });
        if (this._cubemap) {
            ReflectionProbeManager.probeManager.updateBakedCubemap(this.probe);
        }
    }

    private _createProbe () {
        if (this._probeId < 0 || ReflectionProbeManager.probeManager.exists(this._probeId)) {
            this._probeId = this.node.scene.getNewReflectionProbeId();
        }
        this._probe = new scene.ReflectionProbe(this._probeId);
        this._probe.initialize(this.node);
        if (this.enabled) {
            ReflectionProbeManager.probeManager.register(this._probe);
        }
        this._probe.resolution = this._resolution;
        this._probe.clearFlag = this._clearFlag;
        this._probe.backgroundColor = this._backgroundColor;
        this._probe.visibility = this._visibility;
        this._probe.probeType = this._probeType;
        this._probe.size = this._size;
        this._probe.cubemap = this._cubemap!;
    }

    private _readPixels (rt: RenderTexture): Uint8Array | null {
        const width = rt.width;
        const height = rt.height;

        const needSize = 4 * width * height;
        const buffer = new Uint8Array(needSize);

        const gfxTexture = rt.getGFXTexture();
        if (!gfxTexture) {
            return null;
        }

        const gfxDevice = deviceManager.gfxDevice;

        const bufferViews: ArrayBufferView[] = [];
        const regions: BufferTextureCopy[] = [];

        const region0 = new BufferTextureCopy();
        region0.texOffset.x = 0;
        region0.texOffset.y = 0;
        region0.texExtent.width = rt.width;
        region0.texExtent.height = rt.height;
        regions.push(region0);

        bufferViews.push(buffer);
        gfxDevice?.copyTextureToBuffers(gfxTexture, bufferViews, regions);
        return buffer;
    }

    private _flipImage (data: Uint8Array | null, width: number, height: number) {
        if (!data) {
            return null;
        }
        const newData = new Uint8Array(data.length);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const index = (width * i + j) * 4;
                const newIndex = (width * (height - i - 1) + j) * 4;
                newData[newIndex] = data[index];
                newData[newIndex + 1] = data[index + 1];
                newData[newIndex + 2] = data[index + 2];
                newData[newIndex + 3] = data[index + 3];
            }
        }
        return newData;
    }
}
