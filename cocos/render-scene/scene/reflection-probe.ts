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
import { EDITOR } from 'internal:constants';
import { type } from 'cc.decorator';
import { Camera, CameraAperture, CameraFOVAxis, CameraISO, CameraProjection, CameraShutter, CameraType, SKYBOX_FLAG, TrackingType } from './camera';
import { Node } from '../../scene-graph/node';
import { CCObject, Color, Enum, Quat, Rect, toRadian, Vec2, Vec3 } from '../../core';
import { CAMERA_DEFAULT_MASK, IRenderObject } from '../../rendering/define';
import { AABB } from '../../core/geometry/aabb';
import { legacyCC } from '../../core/global-exports';
import { ClearFlagBit } from '../../gfx';
import { TextureCube } from '../../asset/assets/texture-cube';
import { RenderTexture } from '../../asset/assets/render-texture';

export enum ProbeClearFlag {
    SKYBOX= SKYBOX_FLAG | ClearFlagBit.DEPTH_STENCIL,
    SOLID_COLOR= ClearFlagBit.ALL,
}

export enum ProbeType {
    CUBE= 0,
    PLANAR= 1,
}
const cameraDir: Vec3[] = [
    new Vec3(0, -90, 0),
    new Vec3(0, 90, 0),
    new Vec3(90, 0, 0),
    new Vec3(-90, 0, 0),
    new Vec3(0, 0, 0),
    new Vec3(0, 180, 0),
];
enum ProbeFaceIndex {
    right = 0,
    left = 1,
    top = 2,
    bottom = 3,
    front = 4,
    back = 5,
}

export class ReflectionProbe {
    public static probeFaceIndex = ProbeFaceIndex;

    public bakedCubeTextures: RenderTexture[] = [];

    public realtimePlanarTexture: RenderTexture | null = null;

    protected _resolution = 512;
    protected _clearFlag:number = ProbeClearFlag.SKYBOX;
    protected _backgroundColor = new Color(0, 0, 0, 255);
    protected _visibility = CAMERA_DEFAULT_MASK;
    protected _probeType = ProbeType.CUBE;
    protected _cubemap: TextureCube | null = null;
    protected _size = new Vec3(1, 1, 1);
    /**
     * @en Objects inside bouding box.
     * @zh 包围盒范围内的物体
     */
    private _renderObjects: IRenderObject[] = [];

    /**
     * @en Render cubemap's camera
     * @zh 渲染cubemap的相机
     */
    private _camera: Camera | null = null;

    /**
     * @en Unique id of probe.
     * @zh probe的唯一id
     */
    private _probeId = 0;

    private _needRefresh = false;

    private _needRender = false;

    private _node: Node | null = null;

    private _cameraNode: Node | null = null;

    /**
     * @en The AABB bounding box and probe only render the objects inside the bounding box.
     * @zh AABB包围盒，probe只渲染包围盒内的物体
     */
    private _boundingBox: AABB | null = null;

    /**
     * @en The position of the camera in world space.
     * @zh 世界空间相机的位置
     */
    private _cameraWorldPos = new Vec3();

    /**
     * @en The rotation of the camera in world space.
     * @zh 世界空间相机的旋转
     */
    private _cameraWorldRotation = new Quat();

    /**
     * @en The forward direction vertor of the camera in world space.
     * @zh 世界空间相机朝前的方向向量
     */
    private _forward = new Vec3();
    /**
     * @en The up direction vertor of the camera in world space.
     * @zh 世界空间相机朝上的方向向量
     */
    private _up = new Vec3();

    /**
     * @en Set probe type,cube or planar.
     * @zh 设置探针类型，cube或者planar
     */
    set probeType (value: number) {
        this._probeType = value;
    }
    get probeType () {
        return this._probeType;
    }

    /**
     * @en set render texture size
     * @zh 设置渲染纹理大小
     */
    set resolution (value: number) {
        if (value !== this._resolution) {
            this.bakedCubeTextures.forEach((rt, idx) => {
                rt.resize(value, value);
            });
        }
        this._resolution = value;
    }
    get resolution () {
        return this._resolution;
    }

    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    set clearFlag (value: number) {
        this._clearFlag = value;
        this.camera.clearFlag = this._clearFlag;
    }
    get clearFlag () {
        return this._clearFlag;
    }

    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    set backgroundColor (val: Color) {
        this._backgroundColor = val;
        this.camera.clearColor = this._backgroundColor;
    }
    get backgroundColor () {
        return this._backgroundColor;
    }
    /**
     * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
     * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    get visibility () {
        return this._visibility;
    }
    set visibility (val) {
        this._visibility = val;
        this._camera!.visibility = this._visibility;
    }

    /**
     * @en Gets or sets the size of the box, in local space.
     * @zh 获取或设置盒的大小。
     */
    set size (value) {
        this._size = value;

        const pos = this.node.getWorldPosition();
        AABB.set(this._boundingBox!, pos.x, pos.y, pos.z, this._size.x, this._size.y, this._size.z);
    }
    get size () {
        return this._size;
    }

    set cubemap (val: TextureCube) {
        this._cubemap = val;
    }

    get cubemap () {
        return this._cubemap!;
    }

    /**
     * @en Object to be render by probe
     * @zh probe需要渲染的物体。
     */
    set renderObjects (val) {
        this._renderObjects = val;
    }

    get renderObjects () {
        return this._renderObjects;
    }

    /**
     * @en The node of the probe.
     * @zh probe绑定的节点
     */
    get node () {
        return this._node!;
    }

    get camera () {
        return this._camera!;
    }

    /**
     * @en Refresh the objects that use this probe.
     * @zh 刷新使用该probe的物体
     */
    set needRefresh (value: boolean) {
        this._needRefresh = value;
    }

    get needRefresh () {
        return this._needRefresh;
    }

    get needRender () {
        return this._needRender;
    }

    get boundingBox () {
        return this._boundingBox!;
    }

    get cameraNode () {
        return this._cameraNode!;
    }

    constructor (id: number) {
        this._probeId = id;
    }

    public initialize (node: Node) {
        this._node = node;
        this._cameraNode = new Node('ReflectionProbeCamera');
        this._cameraNode.hideFlags |= CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
        node.scene.addChild(this._cameraNode);

        const pos = this.node.getWorldPosition();
        this._boundingBox = AABB.create(pos.x, pos.y, pos.z, this._size.x, this._size.y, this._size.z);
        this._createCamera();
    }

    public initBakedTextures () {
        //wait for scene data initialize, so create rendertexture in the start function
        if (this.bakedCubeTextures.length === 0) {
            for (let i = 0; i < 6; i++) {
                const renderTexture = this._createTargetTexture(this._resolution, this._resolution);
                this.bakedCubeTextures.push(renderTexture);
            }
        }
    }

    public async captureCubemap () {
        this._renderObjects = [];
        this._resetCameraParams();
        await this._renderCubemap();
    }

    /**
     * @en Render real-time planar reflection textures
     * @zh 渲染实时平面反射贴图
     * @param sourceCamera render planar reflection for this camera
     */
    public renderPlanarReflection (sourceCamera: Camera) {
        if (!sourceCamera) return;
        if (!this.realtimePlanarTexture) {
            const canvasSize = legacyCC.view.getDesignResolutionSize();
            this.realtimePlanarTexture = this._createTargetTexture(canvasSize.width, canvasSize.height);
        }
        this._syncCameraParams(sourceCamera);
        this._transformReflectionCamera(sourceCamera);
        this._attachCameraToScene();
        this._needRender = true;
    }

    public switchProbeType (type: number, sourceCamera?: Camera) {
        if (type === ProbeType.CUBE) {
            this._needRender = false;
            this._detachCameraFromScene();
        } else if (sourceCamera !== undefined) {
            this.renderPlanarReflection(sourceCamera);
        }
    }

    public setTargetTexture (rt: RenderTexture | null = null) {
        if (!this.camera) return;
        if (rt) {
            const window = rt.window!;
            this.camera.changeTargetWindow(window);
            this.camera.setFixedSize(window.width, window.height);
            this.camera.update();
        } else {
            this.camera.changeTargetWindow(EDITOR ? legacyCC.director.root.tempWindow : null);
            this.camera.isWindowSize = true;
        }
    }

    public getProbeId () {
        return this._probeId;
    }

    public async waitForNextFrame () {
        return new Promise<void>((resolve, reject) => {
            legacyCC.director.once(legacyCC.Director.EVENT_END_FRAME, () => {
                resolve();
            });
        });
    }

    public renderArea (): Vec2 {
        if (this._probeType === ProbeType.PLANAR) {
            return new Vec2(this.realtimePlanarTexture!.width, this.realtimePlanarTexture!.height);
        } else {
            return new Vec2(this.resolution, this.resolution);
        }
    }

    public isFinishedRendering () {
        return true;
    }

    public validate () {
        return this.cubemap !== null;
    }

    public destroy () {
        if (this._camera) {
            this._camera.destroy();
            this._camera = null;
        }
        for (let i = 0; i < this.bakedCubeTextures.length; i++) {
            this.bakedCubeTextures[i].destroy();
        }
        this.bakedCubeTextures = [];

        if (this.realtimePlanarTexture) {
            this.realtimePlanarTexture.destroy();
            this.realtimePlanarTexture = null;
        }
    }

    public updateCameraDir (faceIdx: number) {
        this.cameraNode.setRotationFromEuler(cameraDir[faceIdx]);
        this.camera.update(true);
    }

    public _syncCameraParams (camera: Camera) {
        this.camera.projectionType = camera.projectionType;
        this.camera.orthoHeight = camera.orthoHeight;
        this.camera.nearClip = camera.nearClip;
        this.camera.farClip = camera.farClip;
        this.camera.fov = camera.fov;
        this.camera.visibility = camera.visibility;
        this.camera.clearFlag = camera.clearFlag;
        this.camera.clearColor = camera.clearColor;
        this.camera.priority = camera.priority - 1;
    }

    public updateBoundingBox () {
        if (this.node) {
            const pos = this.node.getWorldPosition();
            AABB.set(this._boundingBox!, pos.x, pos.y, pos.z, this._size.x, this._size.y, this._size.z);
        }
    }

    private async _renderCubemap () {
        this._attachCameraToScene();
        this._needRender = true;
        await this.waitForNextFrame();
        this._needRender = false;
        this._detachCameraFromScene();
    }

    private _createCamera () {
        const root = legacyCC.director.root;
        if (!this._camera) {
            this._camera = (legacyCC.director.root).createCamera();
            if (!this._camera) return null;
            this._camera.initialize({
                name: this.cameraNode.name,
                node: this.cameraNode,
                projection: CameraProjection.PERSPECTIVE,
                window: EDITOR ? legacyCC.director.root && legacyCC.director.root.mainWindow
                    : legacyCC.director.root && legacyCC.director.root.tempWindow,
                priority: 0,
                cameraType: CameraType.REFLECTION_PROBE,
                trackingType: TrackingType.NO_TRACKING,
            });
        }
        this._camera.setViewportInOrientedSpace(new Rect(0, 0, 1, 1));
        this._camera.fovAxis = CameraFOVAxis.VERTICAL;
        this._camera.fov = toRadian(90);
        this._camera.orthoHeight = 10;
        this._camera.nearClip = 1;
        this._camera.farClip = 1000;
        this._camera.clearColor = this._backgroundColor;
        this._camera.clearDepth = 1.0;
        this._camera.clearStencil = 0.0;
        this._camera.clearFlag = this._clearFlag;
        this._camera.visibility = this._visibility;
        this._camera.aperture = CameraAperture.F16_0;
        this._camera.shutter = CameraShutter.D125;
        this._camera.iso = CameraISO.ISO100;
        return this._camera;
    }

    private _resetCameraParams () {
        this.camera.projectionType = CameraProjection.PERSPECTIVE;
        this.camera.orthoHeight = 10;
        this.camera.nearClip = 1;
        this.camera.farClip = 1000;
        this.camera.fov = toRadian(90);
        this.camera.priority = 0;

        this.camera.visibility = this._visibility;
        this.camera.clearFlag = this._clearFlag;
        this.camera.clearColor = this._backgroundColor;

        this.cameraNode.worldPosition = this.node.worldPosition;
        this.cameraNode.worldRotation = this.node.worldRotation;
        this.camera.update(true);
    }

    private _createTargetTexture (width: number, height: number) {
        const rt = new RenderTexture();
        rt.reset({ width, height });
        return rt;
    }

    private _attachCameraToScene () {
        if (!this.node.scene || !this.camera) {
            return;
        }
        const rs = this.node.scene.renderScene;
        rs!.addCamera(this.camera);
    }

    private _detachCameraFromScene () {
        if (this.camera && this.camera.scene) {
            this.camera.scene.removeCamera(this.camera);
        }
    }

    private _transformReflectionCamera (sourceCamera: Camera) {
        const offset = Vec3.dot(this.node.worldPosition, Vec3.UP);
        this._reflect(this._cameraWorldPos, sourceCamera.node.worldPosition, Vec3.UP, offset);
        this.cameraNode.worldPosition = this._cameraWorldPos;

        Vec3.transformQuat(this._forward, Vec3.FORWARD, sourceCamera.node.worldRotation);
        this._reflect(this._forward, this._forward, Vec3.UP, 0);
        this._forward.normalize();
        this._forward.negative();

        const up = new Vec3();
        Vec3.transformQuat(up, Vec3.UP, sourceCamera.node.worldRotation);
        this._reflect(this._up, up, Vec3.UP, 0);
        this._up.normalize();

        Quat.fromViewUp(this._cameraWorldRotation, this._forward, this._up);

        this.cameraNode.worldRotation = this._cameraWorldRotation;

        this.camera.update(true);
    }
    private _reflect (out: Vec3, point: Vec3, normal: Vec3, offset: number) {
        const n = Vec3.clone(normal);
        n.normalize();
        const dist = Vec3.dot(n, point) - offset;
        n.multiplyScalar(2.0 * dist);
        Vec3.subtract(out, point, n);
        return out;
    }
}
