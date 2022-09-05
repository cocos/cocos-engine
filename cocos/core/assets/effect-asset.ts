/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, serializable, editable, editorOnly } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Root } from '../root';
import { BlendState, DepthStencilState, RasterizerState,
    DynamicStateFlags, PrimitiveMode, ShaderStageFlags, Type, Uniform, MemoryAccess, Format, deviceManager } from '../gfx';
import { RenderPassStage } from '../pipeline/define';
import { MacroRecord } from '../renderer/core/pass-utils';
import { programLib } from '../renderer/core/program-lib';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';

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

const legacyBuiltinEffectNames = [
    'planar-shadow',
    'skybox',
    'deferred-lighting',
    'bloom',
    'post-process',
    'profiler',
    'splash-screen',
    'standard',
    'unlit',
    'sprite',
    'particle',
    'particle-gpu',
    'particle-trail',
    'billboard',
    'terrain',
    'graphics',
    'clear-stencil',
    'spine',
    'occlusion-query',
    'geometry-renderer',
    'debug-renderer',
];

/**
 * @en Effect asset is the base template for instantiating material, all effects should be unique globally.
 * All effects are managed in a static map of EffectAsset.
 * @zh Effect 资源，作为材质实例初始化的模板，每个 effect 资源都应是全局唯一的。
 * 所有 Effect 资源都由此类的一个静态对象管理。
 */
@ccclass('cc.EffectAsset')
export class EffectAsset extends Asset {
    /**
     * @en Register the effect asset to the static map
     * @zh 将指定 effect 注册到全局管理器。
     */
    public static register (asset: EffectAsset) {
        EffectAsset._effects[asset.name] = asset;
        EffectAsset._layoutValid = false;
    }

    /**
     * @en Unregister the effect asset from the static map
     * @zh 将指定 effect 从全局管理器移除。
     */
    public static remove (asset: EffectAsset | string) {
        if (typeof asset !== 'string') {
            if (EffectAsset._effects[asset.name] && EffectAsset._effects[asset.name] === asset) {
                delete EffectAsset._effects[asset.name];
            }
        } else {
            if (EffectAsset._effects[asset]) { delete EffectAsset._effects[asset]; return; }
            for (const n in EffectAsset._effects) {
                if (EffectAsset._effects[n]._uuid === asset) {
                    delete EffectAsset._effects[n];
                    return;
                }
            }
        }
    }

    /**
     * @en Get the effect asset by the given name.
     * @zh 获取指定名字的 effect 资源。
     */
    public static get (name: string) {
        if (EffectAsset._effects[name]) { return EffectAsset._effects[name]; }
        for (const n in EffectAsset._effects) {
            if (EffectAsset._effects[n]._uuid === name) {
                return EffectAsset._effects[n];
            }
        }
        if (legacyBuiltinEffectNames.includes(name)) {
            warnID(16101, name);
        }
        return null;
    }

    /**
     * @en Get all registered effect assets.
     * @zh 获取所有已注册的 effect 资源。
     */
    public static getAll () { return EffectAsset._effects; }
    protected static _effects: Record<string, EffectAsset> = {};

    public static isLayoutValid (): boolean { return EffectAsset._layoutValid; }
    public static setLayoutValid (): void { EffectAsset._layoutValid = true; }
    protected static _layoutValid = true;

    /**
     * @en The techniques used by the current effect.
     * @zh 当前 effect 的所有可用 technique。
     */
    @serializable
    @editable
    public techniques: EffectAsset.ITechniqueInfo[] = [];

    /**
     * @en The shaders used by the current effect.
     * @zh 当前 effect 使用的所有 shader。
     */
    @serializable
    @editable
    public shaders: EffectAsset.IShaderInfo[] = [];

    /**
     * @en The preprocess macro combinations for the shader
     * @zh 每个 shader 需要预编译的宏定义组合。
     */
    @serializable
    @editable
    public combinations: EffectAsset.IPreCompileInfo[] = [];

    @serializable
    @editorOnly
    public hideInEditor = false;

    /**
     * @en The loaded callback which should be invoked by the [[CCLoader]], will automatically register the effect.
     * @zh 通过 [[CCLoader]] 加载完成时的回调，将自动注册 effect 资源。
     */
    public onLoaded () {
        programLib.register(this);
        EffectAsset.register(this);
        if (!EDITOR || legacyCC.GAME_VIEW) { legacyCC.game.once(legacyCC.Game.EVENT_RENDERER_INITED, this._precompile, this); }
    }

    protected _precompile () {
        const root = legacyCC.director.root as Root;
        for (let i = 0; i < this.shaders.length; i++) {
            const shader = this.shaders[i];
            const combination = this.combinations[i];
            if (!combination) { continue; }
            const defines = Object.keys(combination).reduce((out, name) => out.reduce((acc, cur) => {
                const choices = combination[name];
                for (let i = 0; i < choices.length; ++i) {
                    const defines = { ...cur };
                    defines[name] = choices[i];
                    acc.push(defines);
                }
                return acc;
            }, [] as MacroRecord[]), [{}] as MacroRecord[]);
            defines.forEach(
                (defines) => programLib.getGFXShader(deviceManager.gfxDevice, shader.name, defines, root.pipeline),
            );
        }
    }

    public destroy () {
        EffectAsset.remove(this);
        return super.destroy();
    }

    public initDefault (uuid?: string) {
        super.initDefault(uuid);
        const effect = EffectAsset.get('builtin-unlit');
        this.name = 'builtin-unlit';
        this.shaders = effect!.shaders;
        this.combinations = effect!.combinations;
        this.techniques = effect!.techniques;
    }

    public validate () {
        return this.techniques.length > 0 && this.shaders.length > 0;
    }
}

legacyCC.EffectAsset = EffectAsset;
