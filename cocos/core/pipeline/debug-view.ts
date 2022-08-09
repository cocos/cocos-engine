/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

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

import { JSB } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Root } from '../root';
import { Enum } from '../value-types';
import { director } from '..';

const enum RenderingDebugViewType {
    NONE,
    SINGLE,
    COMPOSITE_AND_MISC,
}

/**
 * @zh
 * 渲染单项调试模式
 * @en
 * Rendering single debug mode
 * @readonly
 */
export const enum DebugViewSingleType {
    NONE,
    VERTEX_COLOR,
    VERTEX_NORMAL,
    VERTEX_TANGENT,
    WORLD_POS,
    VERTEX_MIRROR,
    FACE_SIDE,
    UV0,
    UV1,
    UV_LIGHTMAP,
    PROJ_DEPTH,
    LINEAR_DEPTH,

    FRAGMENT_NORMAL,
    FRAGMENT_TANGENT,
    FRAGMENT_BINORMAL,
    BASE_COLOR,
    DIFFUSE_COLOR,
    SPECULAR_COLOR,
    TRANSPARENCY,
    METALLIC,
    ROUGHNESS,
    SPECULAR_INTENSITY,

    DIRECT_DIFFUSE,
    DIRECT_SPECULAR,
    DIRECT_ALL,
    ENV_DIFFUSE,
    ENV_SPECULAR,
    ENV_ALL,
    EMISSIVE,
    LIGHT_MAP,
    SHADOW,
    AO,

    FOG,
}

/**
 * @zh
 * 渲染组合调试模式
 * @en
 * Rendering composite debug mode
 * @readonly
 */
export const enum DebugViewCompositeType {
    DIRECT_DIFFUSE = 0,
    DIRECT_SPECULAR,
    ENV_DIFFUSE,
    ENV_SPECULAR,
    EMISSIVE,
    LIGHT_MAP,
    SHADOW,
    AO,

    NORMAL_MAP,
    FOG,

    TONE_MAPPING,
    GAMMA_CORRECTION,
    MAX_BIT_COUNT
}

/**
 * @en Rendering debug view control class
 * @zh 渲染调试控制类
 */
export class DebugView {
    /**
     * @en Toggle rendering single debug mode.
     * @zh 设置渲染单项调试模式。
     */
    public get singleMode () : DebugViewSingleType {
        return this._singleMode;
    }
    public set singleMode (val : DebugViewSingleType) {
        this._singleMode = val;
        this._updatePipeline();

        if (JSB && this._nativeConfig) {
            this._nativeConfig.singleMode = this._singleMode;
        }
    }

    /**
     * @en Toggle normal / pure lighting mode.
     * @zh 切换正常光照和仅光照模式。
     */
    public get lightingWithAlbedo () : boolean {
        return this._lightingWithAlbedo;
    }
    public set lightingWithAlbedo (val : boolean) {
        this._lightingWithAlbedo = val;
        this._updatePipeline();

        if (JSB && this._nativeConfig) {
            this._nativeConfig.lightingWithAlbedo = this._lightingWithAlbedo;
        }
    }

    /**
     * @en Toggle CSM layer coloration mode.
     * @zh 切换级联阴影染色调试模式。
     */
    public get csmLayerColoration () : boolean {
        return this._csmLayerColoration;
    }
    public set csmLayerColoration (val : boolean) {
        this._csmLayerColoration = val;
        this._updatePipeline();

        if (JSB && this._nativeConfig) {
            this._nativeConfig.csmLayerColoration = this._csmLayerColoration;
        }
    }

    protected _singleMode = DebugViewSingleType.NONE;
    protected _compositeModeValue = 0;
    protected _lightingWithAlbedo = true;
    protected _csmLayerColoration = false;
    protected _nativeConfig: any = null;

    constructor () {
        this._activate();
        if (JSB && this._nativeConfig === null) {
            // @ts-expect-error jsb object access
            this._nativeConfig = new jsb.DebugViewConfig();
            this._nativeConfig.compositeModeBitCount = DebugViewCompositeType.MAX_BIT_COUNT;
        }
    }

    /**
     * @en Whether enabled with specified rendering composite debug mode.
     * @zh 获取指定的渲染组合调试模式是否开启。
     * @param Specified composite type.
     */
    public isCompositeModeEnabled (val : number) : boolean {
        const mode = this._compositeModeValue & (1 << val);
        return mode !== 0;
    }
    /**
     * @en Toggle specified rendering composite debug mode.
     * @zh 开关指定的渲染组合调试模式。
     * @param Specified composite type, enable or disable.
     */
    public enableCompositeMode (val: DebugViewCompositeType, enable: boolean) {
        this._enableCompositeMode(val, enable);
        this._updatePipeline();
    }

    /**
     * @en Toggle all rendering composite debug mode.
     * @zh 开关所有的渲染组合调试模式。
     */
    public enableAllCompositeMode (enable: boolean) {
        this._enableAllCompositeMode(enable);
        this._updatePipeline();
    }

    /**
     * @en Get rendering debug view on / off state.
     * @zh 查询当前是否开启了渲染调试模式。
     */
    public isEnabled () {
        return this._getType() !== RenderingDebugViewType.NONE;
    }

    /**
     * @en Disable all debug view modes, reset to standard rendering mode.
     * @zh 关闭所有的渲染调试模式，恢复到正常渲染。
     */
    public reset () {
        this._activate();
        this._updatePipeline();
    }

    /**
     * @internal
     */
    protected _activate () {
        this._singleMode = DebugViewSingleType.NONE;
        this._enableAllCompositeMode(true);
        this._lightingWithAlbedo = true;
        this._csmLayerColoration = false;

        if (JSB && this._nativeConfig) {
            this._nativeConfig.singleMode = this._singleMode;
            this._nativeConfig.compositeModeValue = this._compositeModeValue;
            this._nativeConfig.lightingWithAlbedo = this._lightingWithAlbedo;
            this._nativeConfig.csmLayerColoration = this._csmLayerColoration;
        }
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root as Root;
        const pipeline = root.pipeline;

        const useDebugView = this._getType();

        if (pipeline.macros.CC_USE_DEBUG_VIEW !== useDebugView) {
            pipeline.macros.CC_USE_DEBUG_VIEW = useDebugView;
            root.onGlobalPipelineStateChanged();
        }
    }

    private _enableCompositeMode (val: DebugViewCompositeType, enable: boolean) {
        if (enable) {
            this._compositeModeValue |= (1 << val);
        } else {
            this._compositeModeValue &= (~(1 << val));
        }

        if (JSB && this._nativeConfig) {
            this._nativeConfig.compositeModeValue = this._compositeModeValue;
        }
    }

    private _enableAllCompositeMode (enable: boolean) {
        for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
            if (enable) {
                this._compositeModeValue |= (1 << i);
            } else {
                this._compositeModeValue &= (~(1 << i));
            }

            if (JSB && this._nativeConfig) {
                this._nativeConfig.compositeModeValue = this._compositeModeValue;
            }
        }
    }

    private _getType () : RenderingDebugViewType {
        if (this._singleMode !== DebugViewSingleType.NONE) {
            return RenderingDebugViewType.SINGLE;
        } else if (this._lightingWithAlbedo !== true || this._csmLayerColoration !== false) {
            return RenderingDebugViewType.COMPOSITE_AND_MISC;
        } else {
            for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                if (!this.isCompositeModeEnabled(i)) {
                    return RenderingDebugViewType.COMPOSITE_AND_MISC;
                }
            }
        }
        return RenderingDebugViewType.NONE;
    }
}
