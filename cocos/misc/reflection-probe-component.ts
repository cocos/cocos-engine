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
import { ccclass, executeInEditMode, menu, playOnFocus, serializable, tooltip, type, visible } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { CCObject, Color, Enum, size, Vec3 } from '../core';

import { TextureCube } from '../asset/assets';
import { scene } from '../render-scene';
import { CAMERA_DEFAULT_MASK } from '../rendering/define';
import { ReflectionProbeManager } from '../rendering/reflection-probe-manager';
import { Component } from '../scene-graph/component';
import { Layers } from '../scene-graph/layers';
import { Camera } from './camera-component';
import { Node } from '../scene-graph';
import { ProbeClearFlag, ProbeType } from '../render-scene/scene/reflection-probe';

export enum ProbeResolution {
    /**
     * @zh 分辨率 256 * 256。
     * @en renderTexture resolution 256 * 256.
     * @readonly
     */
    Low_256x256 = 256,

    /**
      * @zh 分辨率 512 * 512。
      * @en renderTexture resolution 512 * 512.
      * @readonly
      */
    Medium_512x512 = 512,

    /**
      * @zh 分辨率 768 * 768
      * @en renderTexture resolution 768 * 768.
      * @readonly
      */
    High_768x768 = 768,
}
@ccclass('cc.ReflectionProbe')
@menu('Rendering/ReflectionProbe')
@executeInEditMode
@playOnFocus
export class ReflectionProbe extends Component {
    protected static readonly DEFAULT_CUBE_SIZE: Readonly<Vec3> =  new Vec3(1, 1, 1);
    protected static readonly DEFAULT_PLANER_SIZE: Readonly<Vec3> =  new Vec3(5, 0.5, 5);
    @serializable
    protected _resolution = 256;
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
    protected readonly _size = new Vec3(1, 1, 1);

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
        this._size.set(value);
        this.probe.size = this._size;
    }
    @type(Vec3)
    get size () {
        return this._size;
    }

    /**
     * @en Environment reflection or plane reflection.
     * @zh 设置探针类型，环境反射或者平面反射
     */
    @type(Enum(ProbeType))
    set probeType (value: number) {
        this._probeType = value;
        this.probe.probeType = value;

        if (this._probeType === ProbeType.CUBE) {
            this._size.set(ReflectionProbe.DEFAULT_CUBE_SIZE);
            this.probe.switchProbeType(value);
            if (EDITOR) {
                this._objFlags |= CCObject.Flags.IsRotationLocked;
            }
        } else {
            this._size.set(ReflectionProbe.DEFAULT_PLANER_SIZE);
            if (EDITOR && this._objFlags & CCObject.Flags.IsRotationLocked) {
                this._objFlags ^= CCObject.Flags.IsRotationLocked;
            }
            if (!this._sourceCamera) {
                console.warn('the reflection camera is invalid, please set the reflection camera');
                return;
            }
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
    @visible(function (this:ReflectionProbe) { return this.probeType === ProbeType.CUBE; })
    @type(Enum(ProbeResolution))
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
    @type(Enum(ProbeClearFlag))
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

    set cubemap (val: TextureCube | null) {
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
        if (this._sourceCamera && this.probeType === ProbeType.PLANAR) {
            ReflectionProbeManager.probeManager.updateUsePlanarModels(this.probe);
            this.probe.renderPlanarReflection(this.sourceCamera.camera);
        }
    }

    public onDestroy () {
        if (this.probe) {
            this.probe.destroy();
        }
    }

    public update (dt: number) {
        if (!this.probe) return;
        if (EDITOR) {
            if (this.probeType === ProbeType.PLANAR) {
                const cameraLst: scene.Camera[] | undefined = this.node.scene.renderScene?.cameras;
                if (cameraLst !== undefined) {
                    for (let i = 0; i < cameraLst.length; ++i) {
                        const camera: scene.Camera = cameraLst[i];
                        if (camera.name === 'Editor Camera') {
                            this.probe.renderPlanarReflection(camera);
                            break;
                        }
                    }
                }
            }
            this.probe.updateBoundingBox();
            ReflectionProbeManager.probeManager.updateUseCubeModels(this.probe);
            ReflectionProbeManager.probeManager.updateUsePlanarModels(this.probe);
        }
    }

    /**
     * @en Clear the baked cubemap.
     * @zh 清除烘焙的cubemap
     */
    public refresh () {
        this.cubemap = null;
        ReflectionProbeManager.probeManager.updateBakedCubemap(this.probe);
    }

    private _createProbe () {
        if (this._probeId === -1 || ReflectionProbeManager.probeManager.exists(this._probeId)) {
            this._probeId = this.node.scene.getNewReflectionProbeId();
        }
        this._probe = new scene.ReflectionProbe(this._probeId);
        if (this._probe) {
            const cameraNode = new Node('ReflectionProbeCamera');
            cameraNode.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
            this.node.scene.addChild(cameraNode);

            this._probe.initialize(this.node, cameraNode);
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
    }
}
