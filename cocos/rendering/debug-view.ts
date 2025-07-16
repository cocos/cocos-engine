/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { cclegacy } from '../core';
import { Root } from '../root';

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
    IOR,

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

    FRESNEL,
    DIRECT_TRANSMIT_DIFFUSE,
    DIRECT_TRANSMIT_SPECULAR,
    ENV_TRANSMIT_DIFFUSE,
    ENV_TRANSMIT_SPECULAR,
    TRANSMIT_ALL,
    DIRECT_TRT,
    ENV_TRT,
    TRT_ALL,

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

    FRESNEL,
    TRANSMIT_DIFFUSE,
    TRANSMIT_SPECULAR,
    TRT,
    TT,

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
    public get singleMode (): DebugViewSingleType {
        return this._singleMode;
    }
    public set singleMode (val: DebugViewSingleType) {
        this._singleMode = val;
        this._updatePipeline();
    }

    /**
     * @en Toggle normal / pure lighting mode.
     * @zh 切换正常光照和仅光照模式。
     */
    public get lightingWithAlbedo (): boolean {
        return this._lightingWithAlbedo;
    }
    public set lightingWithAlbedo (val: boolean) {
        this._lightingWithAlbedo = val;
        this._updatePipeline();
    }

    /**
     * @en Toggle CSM layer coloration mode.
     * @zh 切换级联阴影染色调试模式。
     */
    public get csmLayerColoration (): boolean {
        return this._csmLayerColoration;
    }
    public set csmLayerColoration (val: boolean) {
        this._csmLayerColoration = val;
        this._updatePipeline();
    }

    get debugViewType (): RenderingDebugViewType {
        return this._getType();
    }

    protected _singleMode = DebugViewSingleType.NONE;
    protected _compositeModeValue = 0;
    protected _lightingWithAlbedo = true;
    protected _csmLayerColoration = false;

    constructor () {
        this._activate();
    }

    /**
     * @en Whether enabled with specified rendering composite debug mode.
     * @zh 获取指定的渲染组合调试模式是否开启。
     * @param Specified composite type.
     */
    public isCompositeModeEnabled (val: number): boolean {
        const mode = this._compositeModeValue & (1 << val);
        return mode !== 0;
    }
    /**
     * @en Toggle specified rendering composite debug mode.
     * @zh 开关指定的渲染组合调试模式。
     * @param Specified composite type, enable or disable.
     */
    public enableCompositeMode (val: DebugViewCompositeType, enable: boolean): void {
        this._enableCompositeMode(val, enable);
        this._updatePipeline();
    }

    /**
     * @en Toggle all rendering composite debug mode.
     * @zh 开关所有的渲染组合调试模式。
     */
    public enableAllCompositeMode (enable: boolean): void {
        this._enableAllCompositeMode(enable);
        this._updatePipeline();
    }

    /**
     * @en Get rendering debug view on / off state.
     * @zh 查询当前是否开启了渲染调试模式。
     */
    public isEnabled (): boolean {
        return this._getType() !== RenderingDebugViewType.NONE;
    }

    /**
     * @en Disable all debug view modes, reset to standard rendering mode.
     * @zh 关闭所有的渲染调试模式，恢复到正常渲染。
     */
    public reset (): void {
        this._activate();
        this._updatePipeline();
    }

    /**
     * @internal
     */
    protected _activate (): void {
        this._singleMode = DebugViewSingleType.NONE;
        this._enableAllCompositeMode(true);
        this._lightingWithAlbedo = true;
        this._csmLayerColoration = false;
    }

    protected _updatePipeline (): void {
        const root = cclegacy.director.root as Root;
        const pipeline = root.pipeline;

        const useDebugView = this._getType();

        if (pipeline.macros.CC_USE_DEBUG_VIEW !== useDebugView) {
            pipeline.macros.CC_USE_DEBUG_VIEW = useDebugView;
            root.onGlobalPipelineStateChanged();
        }
    }

    private _enableCompositeMode (val: DebugViewCompositeType, enable: boolean): void {
        if (enable) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            this._compositeModeValue |= (1 << val);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            this._compositeModeValue &= (~(1 << val));
        }
    }

    private _enableAllCompositeMode (enable: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
            if (enable) {
                this._compositeModeValue |= (1 << i);
            } else {
                this._compositeModeValue &= (~(1 << i));
            }
        }
    }

    private _getType (): RenderingDebugViewType {
        if (this._singleMode !== DebugViewSingleType.NONE) {
            return RenderingDebugViewType.SINGLE;
        } else if (this._lightingWithAlbedo !== true || this._csmLayerColoration !== false) {
            return RenderingDebugViewType.COMPOSITE_AND_MISC;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
            for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                if (!this.isCompositeModeEnabled(i)) {
                    return RenderingDebugViewType.COMPOSITE_AND_MISC;
                }
            }
        }
        return RenderingDebugViewType.NONE;
    }
}
