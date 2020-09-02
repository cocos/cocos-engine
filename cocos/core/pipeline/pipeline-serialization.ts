/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, type, serializable, editable } from 'cc.decorator';
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
 * @en The tag of the render flow, including SCENE, POSTPROCESS and UI.
 * @zh 渲染流程的标签，包含：常规场景（SCENE），后处理（POSTPROCESS），UI 界面（UI）
 */
export enum RenderFlowTag {
    SCENE,
    POSTPROCESS,
    UI,
}

ccenum(RenderFlowTag);

@ccclass('RenderTextureDesc')
export class RenderTextureDesc {
    @serializable
    @editable
    public name: string = '';
    @type(GFXTextureType)
    public type: GFXTextureType = GFXTextureType.TEX2D;
    @type(GFXTextureUsageBit)
    public usage: GFXTextureUsageBit = GFXTextureUsageBit.COLOR_ATTACHMENT;
    @type(GFXFormat)
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @serializable
    @editable
    public width: number = -1;
    @serializable
    @editable
    public height: number = -1;
}

@ccclass('RenderTextureConfig')
export class RenderTextureConfig {
    @serializable
    @editable
    public name: string = '';
    @type(RenderTexture)
    public texture: RenderTexture | null = null;
}

@ccclass('MaterialConfig')
export class MaterialConfig {
    @serializable
    @editable
    public name: string = '';
    @type(Material)
    public material: Material | null = null;
}

@ccclass('FrameBufferDesc')
export class FrameBufferDesc {
    @serializable
    @editable
    public name: string = '';
    @serializable
    @editable
    public renderPass: number = 0;
    @type([CCString])
    public colorTextures: string[] = [];
    @serializable
    @editable
    public depthStencilTexture: string = '';
    @type(RenderTexture)
    public texture: RenderTexture | null = null;
}

@ccclass('ColorDesc')
export class ColorDesc {
    @type(GFXFormat)
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @type(GFXLoadOp)
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @type(GFXStoreOp)
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    @serializable
    @editable
    public sampleCount: number = 1;
    @type(GFXTextureLayout)
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    @type(GFXTextureLayout)
    public endLayout: GFXTextureLayout = GFXTextureLayout.PRESENT_SRC;
}

@ccclass('DepthStencilDesc')
export class DepthStencilDesc {
    @type(GFXFormat)
    public format: GFXFormat = GFXFormat.UNKNOWN;
    @type(GFXLoadOp)
    public depthLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @type(GFXStoreOp)
    public depthStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    @type(GFXLoadOp)
    public stencilLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    @type(GFXStoreOp)
    public stencilStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    @serializable
    @editable
    public sampleCount: number = 1;
    @type(GFXTextureLayout)
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    @type(GFXTextureLayout)
    public endLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
}

@ccclass('RenderPassDesc')
export class RenderPassDesc {
    @serializable
    @editable
    public index: number = -1;
    @type([ColorDesc])
    public colorAttachments = [];
    @type(DepthStencilDesc)
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
    @serializable
    @editable
    public isTransparent: boolean = false;

    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    @type(RenderQueueSortMode)
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    /**
     * @en The stages using this queue
     * @zh 使用当前渲染队列的阶段列表
     */
    @type([CCString])
    public stages: string[] = [];
}
