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

/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, type, serializable, editable } from 'cc.decorator';
import { CCString } from '../data/utils/attribute';
import { AccessType, Format, LoadOp, StoreOp, TextureType, TextureUsageBit } from '../gfx';
import { ccenum } from '../value-types/enum';
import { RenderTexture } from '../assets/render-texture';
import { Material } from '../assets/material';

ccenum(TextureType);
ccenum(TextureUsageBit);
ccenum(StoreOp);
ccenum(LoadOp);
ccenum(AccessType);

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
    public name = '';
    @type(TextureType)
    public type: TextureType = TextureType.TEX2D;
    @type(TextureUsageBit)
    public usage: TextureUsageBit = TextureUsageBit.COLOR_ATTACHMENT;
    @type(Format)
    public format: Format = Format.UNKNOWN;
    @serializable
    @editable
    public width = -1;
    @serializable
    @editable
    public height = -1;
}

@ccclass('RenderTextureConfig')
export class RenderTextureConfig {
    @serializable
    @editable
    public name = '';
    @type(RenderTexture)
    public texture: RenderTexture | null = null;
}

@ccclass('MaterialConfig')
export class MaterialConfig {
    @serializable
    @editable
    public name = '';
    @type(Material)
    public material: Material | null = null;
}

@ccclass('FrameBufferDesc')
export class FrameBufferDesc {
    @serializable
    @editable
    public name = '';
    @serializable
    @editable
    public renderPass = 0;
    @type([CCString])
    public colorTextures: string[] = [];
    @serializable
    @editable
    public depthStencilTexture = '';
    @type(RenderTexture)
    public texture: RenderTexture | null = null;
}

@ccclass('ColorDesc')
export class ColorDesc {
    @type(Format)
    public format: Format = Format.UNKNOWN;
    @type(LoadOp)
    public loadOp: LoadOp = LoadOp.CLEAR;
    @type(StoreOp)
    public storeOp: StoreOp = StoreOp.STORE;
    @serializable
    @editable
    public sampleCount = 1;
    @type([AccessType])
    public beginAccesses: AccessType[] = [];
    @type([AccessType])
    public endAccesses: AccessType[] = [AccessType.COLOR_ATTACHMENT_WRITE];
}

@ccclass('DepthStencilDesc')
export class DepthStencilDesc {
    @type(Format)
    public format: Format = Format.UNKNOWN;
    @type(LoadOp)
    public depthLoadOp: LoadOp = LoadOp.CLEAR;
    @type(StoreOp)
    public depthStoreOp: StoreOp = StoreOp.STORE;
    @type(LoadOp)
    public stencilLoadOp: LoadOp = LoadOp.CLEAR;
    @type(StoreOp)
    public stencilStoreOp: StoreOp = StoreOp.STORE;
    @serializable
    @editable
    public sampleCount = 1;
    @type([AccessType])
    public beginAccesses: AccessType[] = [];
    @type([AccessType])
    public endAccesses: AccessType[] = [AccessType.DEPTH_STENCIL_ATTACHMENT_WRITE];
}

@ccclass('RenderPassDesc')
export class RenderPassDesc {
    @serializable
    @editable
    public index = -1;
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
    public isTransparent = false;

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
