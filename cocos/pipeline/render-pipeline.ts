import { RenderView } from "./render-view";
import { RenderFlow, RenderFlowInfo } from "./render-flow";
import { Root } from "../core/root";
import { GFXRenderPass } from "../gfx/render-pass";
import { GFXDevice } from "../gfx/device";
import { GFXBuffer } from "../gfx/buffer";
import { GFXInputAssembler, GFXInputAttribute } from "../gfx/input-assembler";
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXFormat } from "../gfx/define";
import { Camera } from "../renderer/scene/camera";
import vec4 from "../core/vmath/vec4";
import mat4 from "../core/vmath/mat4";

export enum RenderPassStage {
    FORWARD = 100,
};

export class UBOGlobal {
    static TIME_OFFSET: number = 0;
    static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
    static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
    static MAT_VIEW_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
    static MAT_VIEW_INV_OFFSET: number = UBOGlobal.MAT_VIEW_OFFSET + 16;
    static MAT_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
    static MAT_PROJ_INV_OFFSET: number = UBOGlobal.MAT_PROJ_OFFSET + 16;
    static MAT_VIEW_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
    static MAT_VIEW_PROJ_INV_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_OFFSET + 16;
    static CAMERA_POS_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET + 16;
    static COUNT: number = UBOGlobal.CAMERA_POS_OFFSET + 4;
    static SIZE: number = UBOGlobal.COUNT * 4;

    view: Float32Array = new Float32Array(UBOGlobal.COUNT);
};

export class UBOLocal {
    static MAT_WORLD_OFFSET: number = 0;
    static MAT_WORLD_VIEW_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
    static MAT_WORLD_VIEW_PROJ_OFFSET: number = UBOLocal.MAT_WORLD_VIEW_OFFSET + 16;
    static WORLD_POS_OFFSET: number = UBOLocal.MAT_WORLD_VIEW_PROJ_OFFSET + 16;
    static COUNT: number = UBOLocal.WORLD_POS_OFFSET + 4;
    static SIZE: number = UBOGlobal.COUNT * 4;

    view: Float32Array = new Float32Array(UBOLocal.COUNT);
};

let _vec4Array = new Float32Array(4);
let _mat4Array = new Float32Array(16);
let _outMat = new mat4;

export abstract class RenderPipeline {

    constructor(root: Root) {
        this._root = root;
        this._device = root.device;
    }

    public abstract initialize(): boolean;
    public abstract destroy();

    public render(view: RenderView) {

        this.updateUBOs(view);

        for (let i = 0; i < this._flows.length; ++i) {
            this._flows[i].render(view);
        }
    }

    public addRenderPass(stage: number, renderPass: GFXRenderPass) {
        if (renderPass) {
            this._renderPasses.set(stage, renderPass);
        }
    }

    public getRenderPass(stage: number): GFXRenderPass | null {
        let renderPass = this._renderPasses.get(stage);
        if (renderPass) {
            return renderPass;
        } else {
            return null;
        }
    }

    public removeRenderPass(stage: number) {
        this._renderPasses.delete(stage);
    }

    public clearRenderPasses() {
        this._renderPasses.clear();
    }

    public createFlow<T extends RenderFlow>(clazz: new (pipeline: RenderPipeline) => T, info: RenderFlowInfo): RenderFlow | null {
        let flow: RenderFlow = new clazz(this);
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

    public destroyFlows() {
        for (let i = 0; i < this._flows.length; ++i) {
            this._flows[i].destroy();
        }
        this._flows = [];
    }

    public get root(): Root {
        return this._root;
    }

    public get device(): GFXDevice {
        return this._device;
    }

    public get flows(): RenderFlow[] {
        return this._flows;
    }

    public get quadIA(): GFXInputAssembler {
        return <GFXInputAssembler>this._quadIA;
    }

    public get uboGlobal(): UBOGlobal {
        return this._uboGlobal;
    }

    public get globalUBO(): GFXBuffer {
        return <GFXBuffer>this._globalUBO;
    }

    protected createQuadInputAssembler(): boolean {

        // create vertex buffer

        let vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        let vbSize = vbStride * 4;

        this._quadVB = this._device.createBuffer({
            usage: GFXBufferUsageBit.VERTEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: vbSize,
            stride: vbStride,
        });

        if(!this._quadVB) {
            return false;
        }

        let verts = new Float32Array(4 * 4);
        let n = 0;
        verts[n++] = -1.0; verts[n++] = -1.0; verts[n++] = 0.0; verts[n++] = 0.0;
        verts[n++] = 1.0; verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0;
        verts[n++] = -1.0; verts[n++] = 1.0; verts[n++] = 0.0; verts[n++] = 1.0;
        verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0; verts[n++] = 1.0;

        this._quadVB.update(verts);

        // create index buffer
        let ibStride = Uint8Array.BYTES_PER_ELEMENT;
        let ibSize = ibStride * 6;

        this._quadIB = this._device.createBuffer({
            usage: GFXBufferUsageBit.INDEX | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
            size: ibSize,
            stride: ibStride,
        });

        if(!this._quadIB) {
            return false;
        }

        let indices = new Uint8Array(6);
        indices[0] = 0; indices[1] = 1; indices[2] = 2;
        indices[3] = 1; indices[4] = 3; indices[5] = 2;

        this._quadIB.update(indices);

        // create input assembler

        let attributes: GFXInputAttribute[] = [
            {name: "a_position", format: GFXFormat.RG32F},
            {name: "a_texCoord", format: GFXFormat.RG32F},
        ];

        this._quadIA = this._device.createInputAssembler({
            attributes,
            vertexBuffers: [this._quadVB],
            indexBuffer: this._quadIB,
        });

        return true;
    }

    protected destroyQuadInputAssembler() {
        if(this._quadVB) {
            this._quadVB.destroy();
            this._quadVB = null;
        }

        if(this._quadIB) {
            this._quadIB.destroy();
            this._quadIB = null;
        }

        if(this._quadIA) {
            this._quadIA.destroy();
            this._quadIA = null;
        }
    }

    protected createUBOs(): boolean {
        this._globalUBO = this._root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOGlobal.SIZE,
        });

        if(!this._globalUBO) {
            return false;
        }

        return true;
    }

    protected destroyUBOs() {
        if(this._globalUBO) {
            this._globalUBO.destroy();
            this._globalUBO = null;
        }
    }

    protected updateUBOs(view: RenderView) {
        let camera = <Camera>view.camera;
        camera.update();

        // update UBOGlobal
        _vec4Array[0] = this._root.frameTime;
        _vec4Array[1] = 0.0;
        _vec4Array[2] = 0.0;
        _vec4Array[3] = 0.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.TIME_OFFSET);

        _vec4Array[0] = this._root.device.width;
        _vec4Array[1] = this._root.device.height;
        _vec4Array[2] = 1.0/_vec4Array[0];
        _vec4Array[3] = 1.0/_vec4Array[1];
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.SCREEN_SIZE_OFFSET);

        _vec4Array[0] = 1.0;
        _vec4Array[1] = 1.0;
        _vec4Array[2] = 1.0;
        _vec4Array[3] = 1.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.SCREEN_SCALE_OFFSET);

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

        mat4.invert(_outMat, camera.matViewProj);
        mat4.array(_mat4Array, _outMat);
        this._uboGlobal.view.set(_mat4Array, UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);

        vec4.array(_vec4Array, camera.position);
        _vec4Array[3] = 1.0;
        this._uboGlobal.view.set(_vec4Array, UBOGlobal.CAMERA_POS_OFFSET);

        // update ubos
        (<GFXBuffer>this._globalUBO).update(this._uboGlobal.view);
    }

    protected _root: Root;
    protected _device: GFXDevice;
    protected _renderPasses: Map<number, GFXRenderPass> = new Map;
    protected _flows: RenderFlow[] = [];
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
    protected _uboGlobal: UBOGlobal = new UBOGlobal;
    protected _globalUBO: GFXBuffer | null = null;
};
