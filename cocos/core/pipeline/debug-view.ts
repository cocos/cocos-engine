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

import { JSB } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { Root } from '../root';
import { GlobalDSManager } from './global-descriptor-set-manager';
import { Device } from '../gfx';
import { Enum } from '../value-types';

const enum DebugViewType {
    NONE,
    SINGLE,
    COMPOSITE_AND_MISC,
}
export const enum DebugViewSingleType {
    /**
     * @zh
     * 单项调试模式
     * @en
     * single debug mode
     * @readonly
     */
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

export const enum DebugViewCompositeType {
    /**
     * @zh
     * 组合调试模式
     * @en
     * composite debug mode
     * @readonly
     */
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
 * @en Rendering Debug View Control
 * @zh 渲染调试控制
 */
export class DebugView {
    /**
     * @en whether enabled with specified composite debug mode
     * @zh 获取指定的组合调试模式是否开启
     * @param specified composite type
     */
    public isCompositeModeEnabled (val : number) : boolean {
        const mode = this._compositeModeValue & (1 << val);
        return mode !== 0;
    }
    /**
     * @en toggle specified composite debug mode
     * @zh 开关指定的组合调试模式
     * @param specified composite type, enable or disable
     */
    public enableCompositeMode (val: DebugViewCompositeType, enable: boolean) {
        this._enableCompositeMode(val, enable);
        this._updatePipeline();
    }

    /**
     * @en toggle all composite debug mode
     * @zh 开关所有的组合调试模式
     */
    public enableAllCompositeMode (enable: boolean) {
        this._enableAllCompositeMode(enable);
        this._updatePipeline();
    }

    /**
     * @en toggle single debug mode
     * @zh 设置单项调试模式
     */
    public get singleMode () : DebugViewSingleType {
        return this._singleMode;
    }
    public set singleMode (val : DebugViewSingleType) {
        this._singleMode = val;
        this._updatePipeline();
    }

    /**
     * @en toggle pure lighting mode
     * @zh 切换正常光照和仅光照模式
     */
    public get lightingWithAlbedo () : boolean {
        return this._lightingWithAlbedo;
    }
    public set lightingWithAlbedo (val : boolean) {
        this._lightingWithAlbedo = val;
        this._updatePipeline();
    }

    /**
     * @en toggle CSM layer coloration mode
     * @zh 切换层叠阴影贴图染色调试模式
     */
    public get csmLayerColoration () : boolean {
        return this._csmLayerColoration;
    }
    public set csmLayerColoration (val : boolean) {
        this._csmLayerColoration = val;
        this._updatePipeline();
    }

    /**
     * @en get debug view on / off state
     * @zh 当前是否开启了调试模式
     */
    public isDebugViewEnabled () {
        return this._getDebugViewType() !== DebugViewType.NONE;
    }

    protected _singleMode = DebugViewSingleType.NONE;
    protected _compositeModeValue = 0;
    protected _lightingWithAlbedo = true;
    protected _csmLayerColoration = false;

    /**
     * @internal
     */
    constructor () {
        this.activate();
    }

    private _enableCompositeMode (val: DebugViewCompositeType, enable: boolean) {
        if (enable) {
            this._compositeModeValue |= (1 << val);
        } else {
            this._compositeModeValue &= (~(1 << val));
        }
    }

    private _enableAllCompositeMode (enable: boolean) {
        for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
            this._enableCompositeMode(i, enable);
        }
    }

    private _getDebugViewType () : DebugViewType {
        if (this._singleMode !== DebugViewSingleType.NONE) {
            return DebugViewType.SINGLE;
        } else if (this._lightingWithAlbedo !== true || this._csmLayerColoration !== false) {
            return DebugViewType.COMPOSITE_AND_MISC;
        } else {
            for (let i = 0; i < DebugViewCompositeType.MAX_BIT_COUNT; i++) {
                if (!this.isCompositeModeEnabled(i)) {
                    return DebugViewType.COMPOSITE_AND_MISC;
                }
            }
        }
        return DebugViewType.NONE;
    }

    public activate () {
        this._singleMode = DebugViewSingleType.NONE;
        this._enableAllCompositeMode(true);
        this._lightingWithAlbedo = true;
        this._csmLayerColoration = false;
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root as Root;
        const pipeline = root.pipeline;

        const useDebugView = this._getDebugViewType();

        if (pipeline.macros.CC_USE_DEBUG_VIEW !== useDebugView) {
            pipeline.macros.CC_USE_DEBUG_VIEW = useDebugView;
            root.onGlobalPipelineStateChanged();
        }
    }

    public destroy () {
    }
}

legacyCC.debugView = new DebugView();
