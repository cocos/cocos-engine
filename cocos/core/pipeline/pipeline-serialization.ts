/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, property } from '../data/class-decorator';
import { GFXFormat, GFXLoadOp, GFXStoreOp, GFXTextureLayout, GFXTextureType, GFXTextureUsageBit} from '../gfx/define';
import { ccenum } from '../value-types/enum';
import { RenderTexture } from './../assets/render-texture';
import { Material } from '../assets/material';

ccenum(GFXTextureType);
ccenum(GFXTextureUsageBit);
ccenum(GFXStoreOp);
ccenum(GFXLoadOp);
ccenum(GFXTextureLayout);

/**
 * @en The type of the render flow, including SCENE, POSTPROCESS and UI.
 * @zh 渲染流程的种类，包含：常规场景（SCENE），后处理（POSTPROCESS），UI 界面（UI）
 */
export enum RenderFlowType {
    SCENE,
    POSTPROCESS,
    UI,
}

ccenum(RenderFlowType);

@ccclass('RenderTextureDesc')
export class RenderTextureDesc {
    @property
    public name: string = '';
    @property({ type: GFXTextureType })
    public type: GFXTextureType = GFXTextureType.TEX2D;
    @property({ type: GFXTextureUsageBit })
    public usage: GFXTextureUsageBit = GFXTextureUsageBit.COLOR_ATTACHMENT;
    @property({ type: GFXFormat })
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @property
    public width: number = -1;
    @property
    public height: number = -1;
}

@ccclass('RenderTextureConfig')
export class RenderTextureConfig {
    @property
    public name: string = '';
    @property({ type: RenderTexture })
    public texture: RenderTexture | null = null;
}

@ccclass('MaterialConfig')
export class MaterialConfig {
    @property
    public name: string = '';
    @property({ type: Material })
    public material: Material | null = null;
}

@ccclass('FrameBufferDesc')
export class FrameBufferDesc {
    @property
    public name: string = '';
    @property
    public renderPass: number = 0;
    @property({ type: [CCString] })
    public colorTextures: string[] = [];
    @property
    public depthStencilTexture: string = '';
    @property({ type: RenderTexture })
    public texture: RenderTexture | null = null;
}

@ccclass('ColorDesc')
export class ColorDesc {
    @property({ type: GFXFormat })
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @property({ type: GFXLoadOp })
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @property({ type: GFXStoreOp })
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    @property
    public sampleCount: number = 1;
    @property({ type: GFXTextureLayout })
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    @property({ type: GFXTextureLayout })
    public endLayout: GFXTextureLayout = GFXTextureLayout.PRESENT_SRC;
}

@ccclass('DepthStencilDesc')
export class DepthStencilDesc {
    @property({ type: GFXFormat })
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @property({ type: GFXLoadOp })
    public depthLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @property({ type: GFXStoreOp })
    public depthStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    @property({ type: GFXLoadOp })
    public stencilLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @property({ type: GFXStoreOp })
    public stencilStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    @property
    public sampleCount: number = 1;
    @property({ type: GFXTextureLayout })
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    @property({ type: GFXTextureLayout })
    public endLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
}

@ccclass('RenderPassDesc')
export class RenderPassDesc {
    @property
    public index: number = -1;
    @property({ type: [ColorDesc] })
    public colorAttachments = [];
    @property({ type: DepthStencilDesc })
    public depthStencilAttachment: DepthStencilDesc = new DepthStencilDesc();
}

export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}

ccenum(RenderQueueSortMode);

/**
 * @en The render queue descriptor
 * @zh 渲染队列描述信息
 */
@ccclass('RenderQueueDesc')
export class RenderQueueDesc {

    /**
     * @en Whether the render queue is a transparent queue
     * @zh 当前队列是否是半透明队列
     */
    @property
    public isTransparent: boolean = false;

    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    @property({ type: RenderQueueSortMode })
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    /**
     * @en The stages using this queue
     * @zh 使用当前渲染队列的阶段列表
     */
    @property({ type: [CCString] })
    public stages: string[] = [];
}
