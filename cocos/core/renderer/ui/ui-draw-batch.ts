import { UI } from "./ui";
import { Camera } from "../scene/camera";
import { MeshBuffer } from "../../../ui";
import { Model } from "../scene/model";
import { Material } from "../../assets";
import { GFXTextureView, GFXPipelineState } from "../../gfx";
import { INode } from "../../utils/interfaces";
import { GFXBindingLayout } from "../../gfx/binding-layout";

export class UIDrawBatch {
    public camera: Camera | null = null;
    public bufferBatch: MeshBuffer | null = null;
    public model: Model | null = null;
    public material: Material | null = null;
    public texView: GFXTextureView | null = null;
    public firstIdx: number = 0;
    public idxCount: number = 0;
    public pipelineState: GFXPipelineState | null = null;
    public bindingLayout: GFXBindingLayout | null = null;
    public useLocalData: INode | null = null;
    public isStatic = false;

    public destroy (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }

        if (this.bindingLayout) {
            this.bindingLayout = null;
        }
    }

    public clear (ui: UI) {
        if (this.pipelineState) {
            ui._getUIMaterial(this.material!).revertPipelineState(this.pipelineState);
            this.pipelineState = null;
        }
        this.camera = null;
        this.bufferBatch = null;
        this.material = null;
        this.texView = null;
        this.firstIdx = 0;
        this.idxCount = 0;
        this.model = null;
        this.isStatic = false;
    }
}
