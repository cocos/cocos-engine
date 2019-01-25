import { intersect } from '../3d/geom-utils';
import { Root } from '../core/root';
import { Mat4 } from '../core/value-types';
import { mat4, vec3 } from '../core/vmath';
import { GFXBuffer } from '../gfx/buffer';
import { GFXBufferUsageBit, GFXFormat, GFXMemoryUsageBit, GFXType } from '../gfx/define';
import { GFXDevice } from '../gfx/device';
import { GFXInputAssembler, IGFXInputAttribute } from '../gfx/input-assembler';
import { GFXRenderPass } from '../gfx/render-pass';
import { GFXUniformBlock } from '../gfx/shader';
import { GFXTexture } from '../gfx/texture';
import { GFXTextureView } from '../gfx/texture-view';
import { IRenderFlowInfo, RenderFlow } from './render-flow';
import { RenderQueue } from './render-queue';
import { RenderView } from './render-view';

export class UBOGlobal {
    public static MAX_DIR_LIGHTS = 4;
    public static MAX_POINT_LIGHTS = 4;
    public static MAX_SPOT_LIGHTS = 4;

    public static TIME_OFFSET: number = 0;
    public static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
    public static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
    public static MAT_VIEW_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
    public static MAT_VIEW_INV_OFFSET: number = UBOGlobal.MAT_VIEW_OFFSET + 16;
    public static MAT_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
    public static MAT_PROJ_INV_OFFSET: number = UBOGlobal.MAT_PROJ_OFFSET + 16;
    public static MAT_VIEW_PROJ_OFFSET: number = UBOGlobal.MAT_PROJ_INV_OFFSET + 16;
    public static MAT_VIEW_PROJ_INV_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_OFFSET + 16;
    public static CAMERA_POS_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET + 16;
    public static DIR_LIGHT_DIR_OFFSET: number = UBOGlobal.CAMERA_POS_OFFSET + 4;
    public static DIR_LIGHT_COLOR_OFFSET: number = UBOGlobal.DIR_LIGHT_DIR_OFFSET + UBOGlobal.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_POS_RANGE_OFFSET: number = UBOGlobal.DIR_LIGHT_COLOR_OFFSET + UBOGlobal.MAX_DIR_LIGHTS * 4;
    public static POINT_LIGHT_COLOR_OFFSET: number = UBOGlobal.POINT_LIGHT_POS_RANGE_OFFSET + UBOGlobal.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_POS_RANGE_OFFSET: number = UBOGlobal.POINT_LIGHT_COLOR_OFFSET + UBOGlobal.MAX_POINT_LIGHTS * 4;
    public static SPOT_LIGHT_DIR_OFFSET: number = UBOGlobal.SPOT_LIGHT_POS_RANGE_OFFSET + UBOGlobal.MAX_SPOT_LIGHTS * 4;
    public static SPOT_LIGHT_COLOR_OFFSET: number = UBOGlobal.SPOT_LIGHT_DIR_OFFSET + UBOGlobal.MAX_SPOT_LIGHTS * 4;
    public static COUNT: number = UBOGlobal.SPOT_LIGHT_COLOR_OFFSET + UBOGlobal.MAX_SPOT_LIGHTS * 4;
    public static SIZE: number = UBOGlobal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 30, name: 'CCGlobal', members: [
            // constants
            { name: 'cc_time', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenSize', type: GFXType.FLOAT4, count: 1 },
            { name: 'cc_screenScale', type: GFXType.FLOAT4, count: 1 },
            // transform
            { name: 'cc_matView', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matViewProjInv', type: GFXType.MAT4, count: 1 },
            { name: 'cc_cameraPos', type: GFXType.FLOAT4, count: 1 },
            // lights
            { name: 'cc_dirLightDirection', type: GFXType.FLOAT4, count: UBOGlobal.MAX_DIR_LIGHTS },
            { name: 'cc_dirLightColor', type: GFXType.FLOAT4, count: UBOGlobal.MAX_DIR_LIGHTS },
            { name: 'cc_pointLightPositionAndRange', type: GFXType.FLOAT4, count: UBOGlobal.MAX_POINT_LIGHTS },
            { name: 'cc_pointLightColor', type: GFXType.FLOAT4, count: UBOGlobal.MAX_POINT_LIGHTS },
            { name: 'cc_spotLightPositionAndRange', type: GFXType.FLOAT4, count: UBOGlobal.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightDirection', type: GFXType.FLOAT4, count: UBOGlobal.MAX_SPOT_LIGHTS },
            { name: 'cc_spotLightColor', type: GFXType.FLOAT4, count: UBOGlobal.MAX_SPOT_LIGHTS },
        ],
    };

    public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
}

export class UBOLocal {
    public static MAT_WORLD_OFFSET: number = 0;
    public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
    public static COUNT: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
    public static SIZE: number = UBOLocal.COUNT * 4;

    public static BLOCK: GFXUniformBlock = {
        binding: 31, name: 'CCLocal', members: [
            { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
            { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
        ],
    };

    public view: Float32Array = new Float32Array(UBOLocal.COUNT);
}

const _idVec4Array = Float32Array.from([0, 0, 0, 1]);
const _vec4Array = new Float32Array(4);
const _mat4Array = new Float32Array(16);
const _outMat = new Mat4();

export abstract class RenderPipeline {

    public get root (): Root {
        return this._root;
    }

    public get device (): GFXDevice {
        return this._device;
    }

    public get queue (): RenderQueue {
        return this._queue;
    }

    public get flows (): RenderFlow[] {
        return this._flows;
    }

    public get quadIA (): GFXInputAssembler {
        return this._quadIA!;
    }

    public get uboGlobal (): UBOGlobal {
        return this._uboGlobal;
    }

    public get globalUBO (): GFXBuffer {
        return this._globalUBO!;
    }

    public get defaultTexture (): GFXTexture {
        return this._defaultTex!;
    }

    protected _root: Root;
    protected _device: GFXDevice;
    protected _queue: RenderQueue = new RenderQueue();
    protected _renderPasses: Map<number, GFXRenderPass> = new Map();
    protected _flows: RenderFlow[] = [];
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
    protected _uboGlobal: UBOGlobal = new UBOGlobal();
    protected _globalUBO: GFXBuffer | null = null;
    protected _defaultTex: GFXTexture | null = null;
    protected _defaultTexView: GFXTextureView | null = null;

    constructor (root: Root) {
        this._root = root;
        this._device = root.device;
    }

    public abstract initialize (): boolean;
    public abstract destroy ();

    public resize (width: number, height: number) {
        for (const flow of this._flows) {
            flow.resize(width, height);
        }
    }

    public render (view: RenderView) {

        view.camera.update();

        this.sceneCulling(view);

        this.updateUBOs(view);

        for (const flow of this._flows) {
            flow.render(view);
        }
    }

    public addRenderPass (stage: number, renderPass: GFXRenderPass) {
        if (renderPass) {
            this._renderPasses.set(stage, renderPass);
        }
    }

    public getRenderPass (stage: number): GFXRenderPass | null {
        const renderPass = this._renderPasses.get(stage);
        if (renderPass) {
            return renderPass;
        } else {
            return null;
        }
    }

    public removeRenderPass (stage: number) {
        this._renderPasses.delete(stage);
    }

    public clearRenderPasses () {
        this._renderPasses.clear();
    }

    public createFlow<T extends RenderFlow> (
        clazz: new (pipeline: RenderPipeline) => T,
        info: IRenderFlowInfo,
    ): RenderFlow | null {
        const flow: RenderFlow = new clazz(this);
        if (flow.initialize(info)) {
            this._flows.push(flow);
            this._flows.sort((a: RenderFlow, b: RenderFlow) => {
                return a.priority - b.priority;
            });

            return flow;
        } else {
            return null;
        }
    }

    public destroyFlows () {
        for (const flow of this._flows) {
            flow.destroy();
        }
        this._flows = [];
    }

    protected createQuadInputAssembler (): boolean {

        // create vertex buffer

        const vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        const vbSize = vbStride * 4;

        this._quadVB = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbSize,
            stride: vbStride,
        });

        if (!this._quadVB) {
            return false;
        }

        const verts = new Float32Array(4 * 4);
        let n = 0;
        verts[n++] = -1.0; verts[n++] = -1.0; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = 1.0; verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0;
        verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0;

        this._quadVB.update(verts);

        // create index buffer
        const ibStride = Uint8Array.BYTES_PER_ELEMENT;
        const ibSize = ibStride * 6;

        this._quadIB = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        if (!this._quadIB) {
            return false;
        }

        const indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        this._quadIB.update(indices);

        // create input assembler

        const attributes: IGFXInputAttribute[] = [
            { name: 'a_position', format: GFXFormat.RG32F },
            { name: 'a_texCoord', format: GFXFormat.RG32F },
        ];

        this._quadIA = this._device.createInputAssembler({
            attributes,
            vertexBuffers: [this._quadVB],
            indexBuffer: this._quadIB,
        });

        return true;
    }

    protected destroyQuadInputAssembler () {
        if (this._quadVB) {
            this._quadVB.destroy();
            this._quadVB = null;
        }

        if (this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if (this._quadIA) {
            this._quadIA.destroy();
            this._quadIA = null;
        }
    }

    protected createUBOs (): boolean {
        this._globalUBO = this._root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOGlobal.SIZE,
        });

        if (!this._globalUBO) {
            return false;
        }

        return true;
    }

    protected destroyUBOs () {
        if (this._globalUBO) {
            this._globalUBO.destroy();
            this._globalUBO = null;
        }
    }

    protected updateUBOs (view: RenderView) {

        // update UBOGlobal
        _vec4Array[0] = this._root.frameTime;
        _vec4Array[1] = 0.0;
        _vec4Array[2] = 0.0;
        _vec4Array[3] = 0.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.TIME_OFFSET);

        _vec4Array[0] = this._root.device.width;
        _vec4Array[1] = this._root.device.height;
        _vec4Array[2] = 1.0 / _vec4Array[0];
        _vec4Array[3] = 1.0 / _vec4Array[1];
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.SCREEN_SIZE_OFFSET);

        _vec4Array[0] = 1.0;
        _vec4Array[1] = 1.0;
        _vec4Array[2] = 1.0;
        _vec4Array[3] = 1.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.SCREEN_SCALE_OFFSET);

        const camera = view.camera;
        mat4.array(_mat4Array, camera.matView);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_VIEW_OFFSET);

        mat4.invert(_outMat, camera.matView);
        mat4.array(_mat4Array, _outMat);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_VIEW_INV_OFFSET);

        mat4.array(_mat4Array, camera.matProj);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_PROJ_OFFSET);

        mat4.invert(_outMat, camera.matProj);
        mat4.array(_mat4Array, _outMat);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_PROJ_INV_OFFSET);

        mat4.array(_mat4Array, camera.matViewProj);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_OFFSET);

        mat4.array(_mat4Array, camera.matViewProjInv);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);

        vec3.array(_vec4Array, camera.position);
        _vec4Array[3] = 1.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.CAMERA_POS_OFFSET);

        const scene = view.camera.scene;
        const dLights = scene.directionalLights;
        for (let i = 0; i < UBOGlobal.MAX_DIR_LIGHTS; i++) {
            const light = dLights[i];
            if (light && light.enabled) {
                light.update();
                this._uboGlobal.view.set(light.directionArray, UBOGlobal.DIR_LIGHT_DIR_OFFSET + i * 4);
                this._uboGlobal.view.set(light.colorData, UBOGlobal.DIR_LIGHT_COLOR_OFFSET + i * 4);
            } else {
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.DIR_LIGHT_DIR_OFFSET + i * 4);
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.DIR_LIGHT_COLOR_OFFSET + i * 4);
            }
        }
        const pLights = scene.pointLights;
        for (let i = 0; i < UBOGlobal.MAX_POINT_LIGHTS; i++) {
            const light = pLights[i];
            if (light && light.enabled) {
                light.update();
                this._uboGlobal.view.set(light.positionAndRange, UBOGlobal.POINT_LIGHT_POS_RANGE_OFFSET + i * 4);
                this._uboGlobal.view.set(light.colorData, UBOGlobal.POINT_LIGHT_COLOR_OFFSET + i * 4);
            } else {
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.POINT_LIGHT_POS_RANGE_OFFSET + i * 4);
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.POINT_LIGHT_COLOR_OFFSET + i * 4);
            }
        }
        const sLights = scene.spotLights;
        for (let i = 0; i < UBOGlobal.MAX_SPOT_LIGHTS; i++) {
            const light = sLights[i];
            if (light && light.enabled) {
                light.update();
                this._uboGlobal.view.set(light.positionAndRange, UBOGlobal.SPOT_LIGHT_POS_RANGE_OFFSET + i * 4);
                this._uboGlobal.view.set(light.directionArray, UBOGlobal.SPOT_LIGHT_DIR_OFFSET + i * 4);
                this._uboGlobal.view.set(light.colorData, UBOGlobal.SPOT_LIGHT_COLOR_OFFSET + i * 4);
            } else {
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.SPOT_LIGHT_POS_RANGE_OFFSET + i * 4);
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.SPOT_LIGHT_DIR_OFFSET + i * 4);
                this._uboGlobal.view.set(_idVec4Array, UBOGlobal.SPOT_LIGHT_COLOR_OFFSET + i * 4);
            }
        }

        // update ubos
        this._globalUBO!.update(this._uboGlobal.view);
    }

    protected sceneCulling (view: RenderView) {

        const camera = view.camera;
        const scene = camera.scene;

        this._queue.clear();

        for (const model of scene.models) {

            // filter model by view visibility
            if (view.visibility > 0 && model.viewID !== view.visibility || !model.enabled) {
                continue;
            }

            model._updateTransform();

            // frustum culling
            if (model.worldBounds && !intersect.aabb_frustum(model.worldBounds, camera.frustum)) {
                // console.log('model is not in view frustum.');
                continue;
            }

            model.updateUBOs();

            // add model pass to render queue
            this._queue.add(model, camera);
        }

        this._queue.sort();
    }
}
