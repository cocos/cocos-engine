import { RenderView } from "./render-view";
import { RenderFlow, RenderFlowInfo } from "./render-flow";
import { Root } from "../core/root";
import { GFXRenderPass } from "../gfx/render-pass";
import { GFXDevice } from "../gfx/device";
import { GFXBuffer } from "../gfx/buffer";
import { GFXInputAssembler, GFXInputAttribute } from "../gfx/input-assembler";
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXFormat } from "../gfx/define";

export enum RenderPassStage {
    FORWARD = 0,
    CUSTOM = 100,
};

export interface QuadVertex {
    position: number[];
    texCoord: number[];
}

export abstract class RenderPipeline {

    constructor(root: Root) {
        this._root = root;
        this._device = root.device;
    }

    public abstract initialize(): boolean;
    public abstract destroy();

    public render(view: RenderView) {
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

    public get quadIA(): GFXInputAssembler | null {
        return this._quadIA;
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

    protected _root: Root;
    protected _device: GFXDevice;
    protected _renderPasses: Map<number, GFXRenderPass> = new Map;
    protected _flows: RenderFlow[] = [];
    protected _quadVB: GFXBuffer | null = null;
    protected _quadIB: GFXBuffer | null = null;
    protected _quadIA: GFXInputAssembler | null = null;
};
