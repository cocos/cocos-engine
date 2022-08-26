/*
 Copyright (c) 2022-2022 Xiamen Yaji Software Co., Ltd.
 http://www.cocos2d-x.org
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
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

import { ccclass, help, executeInEditMode,
    menu, tooltip, serializable, formerlySerializedAs } from 'cc.decorator';
import { Light } from './light-component';
import { scene } from '../../core/renderer';
import { legacyCC } from '../../core/global-exports';
import { Camera } from '../../core/renderer/scene';
import { Root } from '../../core/root';
import { property } from '../../core/data/class-decorator';

/**
 * @en The fill light component, Multiple fill light sources are allowed in a scene.
 * @zh 补充光源组件，一个场景允许存在多个补充光源。
 */
@ccclass('cc.RangedDirectionalLight')
@help('i18n:cc.RangedDirectionalLight')
@menu('Light/RangedDirectionalLight')
@executeInEditMode
export class RangedDirectionalLight extends Light {
    @property
    @formerlySerializedAs('_illuminance')
    protected _illuminanceHDR = 65000;

    @serializable
    protected _illuminanceLDR = 65000 * Camera.standardExposureValue;

    protected _type = scene.LightType.RANGEDDIR;
    protected _light: scene.RangedDirectionalLight | null = null;

    /**
     * @en The light source intensity.
     * @zh 光源强度。
     */
    @tooltip('i18n:lights.illuminance')
    get illuminance () {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._illuminanceHDR;
        } else {
            return this._illuminanceLDR;
        }
    }
    set illuminance (val) {
        const isHDR = (legacyCC.director.root as Root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this._illuminanceHDR = val;
            this._light && (this._light.illuminanceHDR = this._illuminanceHDR);
        } else {
            this._illuminanceLDR = val;
            this._light && (this._light.illuminanceLDR = this._illuminanceLDR);
        }
    }

    constructor () {
        super();
        this._lightType = scene.RangedDirectionalLight;
    }

    protected _createLight () {
        super._createLight();
        if (this._light) {
            this._light.illuminanceHDR = this._illuminanceHDR;
            this._light.illuminanceLDR = this._illuminanceLDR;
        }
    }
}
