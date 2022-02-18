/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module component/light
 */

import { ccclass, range, slide, type, editable, visible, help, executeInEditMode,
    menu, tooltip, serializable, formerlySerializedAs } from 'cc.decorator';
import { Light } from './light-component';
import { scene } from '../../core/renderer';
import { legacyCC } from '../../core/global-exports';
import { Camera, PCFType, Shadows, ShadowType, CSMLevel } from '../../core/renderer/scene';
import { Root } from '../../core/root';
import { property } from '../../core/data/class-decorator';
import { CCBoolean, CCFloat } from '../../core/data/utils/attribute';
import { clamp, Vec2 } from '../../core';

@ccclass('cc.DirectionalLight')
@help('i18n:cc.DirectionalLight')
@menu('Light/DirectionalLight')
@executeInEditMode
export class DirectionalLight extends Light {
    @property
    @formerlySerializedAs('_illuminance')
    protected _illuminanceHDR = 65000;

    @serializable
    protected _illuminanceLDR = 1.0;

    // Public properties of shadow
    @serializable
    protected _shadowEnabled = false;

    // Shadow map properties
    @serializable
    protected _shadowPcf = PCFType.HARD;
    @serializable
    protected _shadowBias = 0.00001;
    @serializable
    protected _shadowNormalBias = 0.0;
    @serializable
    protected _shadowSaturation = 1.0;
    @serializable
    protected _shadowDistance = 100;
    @serializable
    protected _shadowInvisibleOcclusionRange = 200;
    @serializable
    protected _shadowCSMLevel = CSMLevel.level_3;

    // fixed area properties
    @serializable
    protected _shadowFixedArea = false;
    @serializable
    protected _shadowNear = 0.1;
    @serializable
    protected _shadowFar = 10.0;
    @serializable
    protected _shadowOrthoSize = 5;

    protected _type = scene.LightType.DIRECTIONAL;
    protected _light: scene.DirectionalLight | null = null;

    /**
     * @en
     * The light source intensity.
     * @zh
     * 光源强度。
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

    /**
     * @en Whether activate shadow
     * @zh 是否启用阴影？
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 1 } })
    @editable
    @type(CCBoolean)
    get shadowEnabled () {
        return this._shadowEnabled;
    }
    set shadowEnabled (val) {
        this._shadowEnabled = val;
        if (this._light) {
            this._light.shadowEnabled = this._shadowEnabled;
        }
    }

    /**
     * @en get or set shadow pcf.
     * @zh 获取或者设置阴影pcf等级。
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 5  } })
    @editable
    @type(PCFType)
    get shadowPcf () {
        return this._shadowPcf;
    }
    set shadowPcf (val) {
        this._shadowPcf = val;
        if (this._light) {
            this._light.shadowPcf = this._shadowPcf;
        }
    }

    /**
     * @en get or set shadow map sampler offset
     * @zh 获取或者设置阴影纹理偏移值
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 6 } })
    @editable
    @type(CCFloat)
    get shadowBias () {
        return this._shadowBias;
    }
    set shadowBias (val) {
        this._shadowBias = val;
        if (this._light) {
            this._light.shadowBias = this._shadowBias;
        }
    }

    /**
     * @en get or set normal bias.
     * @zh 设置或者获取法线偏移。
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 7 } })
    @editable
    @type(CCFloat)
    get shadowNormalBias () {
        return this._shadowNormalBias;
    }
    set shadowNormalBias (val) {
        this._shadowNormalBias = val;
        if (this._light) {
            this._light.shadowNormalBias = this._shadowNormalBias;
        }
    }

    /**
     * @en Shadow color saturation
     * @zh 阴影颜色饱和度
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 8 } })
    @editable
    @range([0.0, 1.0, 0.01])
    @slide
    @type(CCFloat)
    get shadowSaturation () {
        return this._shadowSaturation;
    }
    set shadowSaturation (val) {
        this._shadowSaturation = clamp(val, 0.0, 1.0);

        if (this._light) {
            this._light.shadowSaturation = this._shadowSaturation;
        }
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
     */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
        === ShadowType.ShadowMap && this._shadowFixedArea === false;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 9 } })
    @editable
    @tooltip('shadow visible distance: shadow quality is inversely proportional of the magnitude of this value')
    @range([0.0, 2000.0, 0.1])
    @slide
    @type(CCFloat)
    get shadowDistance () {
        return this._shadowDistance;
    }
    set shadowDistance (val) {
        this._shadowDistance = Math.min(val, Shadows.MAX_FAR);
        if (this._light) {
            this._light.shadowDistance = this._shadowDistance;
            this._light.shadowCSMValueDirty = true;
        }
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
    */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
        === ShadowType.ShadowMap && this._shadowFixedArea === false;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 10 } })
    @editable
    @tooltip('if shadow has been culled, increase this value to fix it')
    @range([0.0, 2000.0, 0.1])
    @slide
    @type(CCFloat)
    get shadowInvisibleOcclusionRange () {
        return this._shadowInvisibleOcclusionRange;
    }
    set shadowInvisibleOcclusionRange (val) {
        this._shadowInvisibleOcclusionRange = Math.min(val, Shadows.MAX_FAR);
        if (this._light) {
            this._light.shadowInvisibleOcclusionRange = this._shadowInvisibleOcclusionRange;
        }
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置潜在阴影产生的范围
    */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
            === ShadowType.ShadowMap && this._shadowFixedArea === false;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 11 } })
    @editable
    @tooltip('CSM Level')
    @slide
    @type(CSMLevel)
    get shadowCSMLevel () {
        return this._shadowCSMLevel;
    }
    set shadowCSMLevel (val) {
        this._shadowCSMLevel = val;
        if (this._light) {
            this._light.shadowCSMLevel = this._shadowCSMLevel;
            this._light.shadowCSMValueDirty = true;
        }
    }

    /**
     * @en get or set fixed area shadow
     * @zh 是否是固定区域阴影
     */
    @visible(() => (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type === ShadowType.ShadowMap)
    @property({ group: { name: 'ShadowSettings', displayOrder: 11 } })
    @editable
    @type(CCBoolean)
    get fixedArea () {
        return this._shadowFixedArea;
    }
    set fixedArea (val) {
        this._shadowFixedArea = val;
        if (this._light) {
            this._light.fixedArea = this._shadowFixedArea;
        }
    }

    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
        === ShadowType.ShadowMap && this._shadowFixedArea === true;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 12 } })
    @editable
    @type(CCFloat)
    get fixedNear () {
        return this._shadowNear;
    }
    set fixedNear (val) {
        this._shadowNear = val;
        if (this._light) {
            this._light.fixedNear = this._shadowNear;
        }
    }

    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
        === ShadowType.ShadowMap && this._shadowFixedArea === true;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 13 } })
    @editable
    @type(CCFloat)
    get fixedFar () {
        return this._shadowFar;
    }
    set fixedFar (val) {
        this._shadowFar = Math.min(val, Shadows.MAX_FAR);
        if (this._light) {
            this._light.fixedFar = this._shadowFar;
        }
    }

    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    @visible(function (this: DirectionalLight) {
        return (legacyCC.director.root as Root).pipeline.pipelineSceneData.shadows.type
        === ShadowType.ShadowMap && this._shadowFixedArea === true;
    })
    @property({ group: { name: 'ShadowSettings', displayOrder: 14 } })
    @type(CCFloat)
    get fixedOrthoSize () {
        return this._shadowOrthoSize;
    }
    set fixedOrthoSize (val) {
        this._shadowOrthoSize = val;
        if (this._light) {
            this._light.fixedOrthoSize = this._shadowOrthoSize;
        }
    }

    constructor () {
        super();
        this._lightType = scene.DirectionalLight;
    }

    protected _createLight () {
        super._createLight();
        this._illuminanceLDR = this._illuminanceHDR * Camera.standardExposureValue;
        if (this._light) {
            this._light.illuminanceHDR = this._illuminanceHDR;
            this._light.illuminanceLDR = this._illuminanceLDR;
            // shadow info
            this._light.shadowEnabled = this._shadowEnabled;
            this._light.shadowPcf = this._shadowPcf;
            this._light.shadowBias = this._shadowBias;
            this._light.shadowNormalBias = this._shadowNormalBias;
            this._light.shadowSaturation = this._shadowSaturation;
            this._light.fixedArea = this._shadowFixedArea;
            this._light.fixedNear = this._shadowNear;
            this._light.fixedFar = this._shadowFar;
            this._light.fixedOrthoSize = this._shadowOrthoSize;
            this._light.shadowCSMLevel = this._shadowCSMLevel;
        }
    }
}
