/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, editable, editorOnly, serializable } from 'cc.decorator';
import { legacyCC } from '../global-exports';
import './asset';
import type { EffectAsset as JsbEffectAsset } from './effect-asset';

import type { BlendState, DepthStencilState, RasterizerState,
    DynamicStateFlags, PrimitiveMode, ShaderStageFlags, Type, Uniform, MemoryAccess, Format } from '../gfx';
import type { RenderPassStage } from '../pipeline/define';
import type { MacroRecord } from '../renderer/core/pass-utils';

declare const jsb: any;

export type EffectAsset = JsbEffectAsset;
export const EffectAsset: typeof JsbEffectAsset = jsb.EffectAsset;
export declare namespace EffectAsset {
    export interface IPropertyInfo {
        type: number; // auto-extracted from shader
        handleInfo?: [string, number, number]; // auto-generated from 'target'
        samplerHash?: number; // auto-generated from 'sampler'
        value?: number[] | string; // default value
        linear?: boolean; // whether to convert the input to linear space first before applying
    }
    // Pass instance itself are compliant to IPassStates too
    export interface IPassStates {
        priority?: number;
        primitive?: PrimitiveMode;
        stage?: RenderPassStage;
        rasterizerState?: RasterizerState;
        depthStencilState?: DepthStencilState;
        blendState?: BlendState;
        dynamicStates?: DynamicStateFlags;
        phase?: string | number;
    }
    export interface IPassInfo extends IPassStates {
        program: string; // auto-generated from 'vert' and 'frag'
        embeddedMacros?: MacroRecord;
        propertyIndex?: number;
        switch?: string;
        properties?: Record<string, IPropertyInfo>;
    }
    export interface ITechniqueInfo {
        passes: IPassInfo[];
        name?: string;
    }

    export interface IBlockInfo {
        binding: number;
        name: string;
        members: Uniform[];
        stageFlags: ShaderStageFlags;
    }
    export interface ISamplerTextureInfo {
        binding: number;
        name: string;
        type: Type;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    export interface ISamplerInfo {
        set: number;
        binding: number;
        name: string;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    export interface ITextureInfo {
        set: number;
        binding: number;
        name: string;
        type: Type;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    export interface IBufferInfo {
        binding: number;
        name: string;
        memoryAccess: MemoryAccess;
        stageFlags: ShaderStageFlags;
    }
    export interface IImageInfo {
        binding: number;
        name: string;
        type: Type;
        count: number;
        memoryAccess: MemoryAccess;
        stageFlags: ShaderStageFlags;
    }

    export interface IInputAttachmentInfo {
        set: number;
        binding: number;
        name: string;
        count: number;
        stageFlags: ShaderStageFlags;
    }
    export interface IAttributeInfo {
        name: string;
        format: Format;
        isNormalized: boolean;
        stream: number;
        isInstanced: boolean;
        location: number;
        defines: string[];
    }
    export interface IDefineInfo {
        name: string;
        type: string;
        range?: number[];
        options?: string[];
        default?: string;
    }
    export interface IBuiltin {
        name: string;
        defines: string[];
    }
    export interface IBuiltinInfo {
        buffers: IBuiltin[];
        blocks: IBuiltin[];
        samplerTextures: IBuiltin[];
        images: IBuiltin[];
    }
    export interface IShaderInfo {
        name: string;
        hash: number;
        glsl4: { vert: string, frag: string };
        glsl3: { vert: string, frag: string };
        glsl1: { vert: string, frag: string };
        builtins: { globals: IBuiltinInfo, locals: IBuiltinInfo, statistics: Record<string, number> };
        defines: IDefineInfo[];
        attributes: IAttributeInfo[];
        blocks: IBlockInfo[];
        samplerTextures: ISamplerTextureInfo[];
        samplers: ISamplerInfo[];
        textures: ITextureInfo[];
        buffers: IBufferInfo[];
        images: IImageInfo[];
        subpassInputs: IInputAttachmentInfo[];
    }
    export interface IPreCompileInfo {
        [name: string]: boolean[] | number[] | string[];
    }
}

legacyCC.EffectAsset = EffectAsset;

const effectAssetProto: any = EffectAsset.prototype;

effectAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this.hideInEditor = false;
};

// handle meta data, it is generated automatically
const EffectAssetProto = EffectAsset.prototype;
editable(EffectAssetProto, 'techniques');
serializable(EffectAssetProto, 'techniques');
editable(EffectAssetProto, 'shaders');
serializable(EffectAssetProto, 'shaders');
editable(EffectAssetProto, 'combinations');
serializable(EffectAssetProto, 'combinations');
editorOnly(EffectAssetProto, 'hideInEditor');
serializable(EffectAssetProto, 'hideInEditor');
ccclass('cc.EffectAsset')(EffectAsset);
