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

import { Vec4 } from '../../math';
import { legacyCC } from '../../global-exports';
import { AmbientInfo } from '../../scene-graph/scene-globals';

/**
 * @en Ambient lighting representation in the render scene.
 * The initial data is setup in [[SceneGlobals.ambient]].
 * @zh 渲染场景中的环境光照设置。
 * 初始值是由 [[SceneGlobals.ambient]] 设置的。
 */
export class Ambient {
    /**
     * @en Default sun illuminance
     * @zh 默认太阳亮度
     */
    public static SUN_ILLUM = 65000.0;
    /**
     * @en Default sky illuminance
     * @zh 默认天空亮度
     */
    public static SKY_ILLUM = 20000.0;

    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    set enabled (val: boolean) {
        this._enabled = val;
    }
    get enabled (): boolean {
        return this._enabled;
    }
    /**
     * @en Sky color
     * @zh 天空颜色
     */
    get skyColor (): Vec4 {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._skyColorHDR;
        } else {
            return this._skyColorLDR;
        }
    }
    set skyColor (color: Vec4) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._skyColorHDR.set(color);
        } else {
            this._skyColorLDR.set(color);
        }
    }

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    get skyIllum (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._skyIllumHDR;
        } else {
            return this._skyIllumLDR;
        }
    }
    set skyIllum (illum: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._skyIllumHDR = illum;
        } else {
            this._skyIllumLDR = illum;
        }
    }
    /**
     * @en Ground color
     * @zh 地面颜色
     */
    get groundAlbedo (): Vec4 {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._groundAlbedoHDR;
        } else {
            return this._groundAlbedoLDR;
        }
    }
    set groundAlbedo (color: Vec4) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._groundAlbedoHDR.set(color);
        } else {
            this._groundAlbedoLDR.set(color);
        }
    }

    protected _groundAlbedoHDR = new Vec4(0.2, 0.2, 0.2, 1.0);
    protected _skyColorHDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    protected _skyIllumHDR = 0;

    protected _groundAlbedoLDR = new Vec4(0.2, 0.2, 0.2, 1.0);
    protected _skyColorLDR = new Vec4(0.2, 0.5, 0.8, 1.0);
    protected _skyIllumLDR = 0;

    protected _mipmapCount = 1;

    protected _enabled = false;

    public initialize (ambientInfo: AmbientInfo) {
        // Init HDR/LDR from serialized data on load
        this._skyColorHDR = ambientInfo.skyColorHDR;
        this._groundAlbedoHDR.set(ambientInfo.groundAlbedoHDR);
        this._skyIllumHDR = ambientInfo.skyIllumHDR;

        this._skyColorLDR = ambientInfo.skyColorLDR;
        this._groundAlbedoLDR.set(ambientInfo.groundAlbedoLDR);
        this._skyIllumLDR = ambientInfo.skyIllumLDR;
    }
}

legacyCC.Ambient = Ambient;
