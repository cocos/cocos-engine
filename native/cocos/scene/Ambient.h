/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos.com
 
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
 ****************************************************************************/

#pragma once

#include <array>
#include "base/Macros.h"
#include "base/RefCounted.h"
#include "core/Root.h"
#include "math/Color.h"

namespace cc {
namespace scene {

class AmbientInfo;

class Ambient final {
public:
    friend class Skybox;

    static constexpr float SUN_ILLUM{65000.0F};
    static constexpr float SKY_ILLUM{20000.0F};

    Ambient(/* args */) = default;
    ~Ambient()          = default;

    void initialize(AmbientInfo *info);

    /**
     * @en Enable ambient
     * @zh 是否开启环境光
     */
    inline void setEnabled(bool val) { _enabled = val; }
    inline bool isEnabled() const { return _enabled; }

    /**
     * @en Sky color
     * @zh 天空颜色
     */

    Vec4 &getSkyColor();
    void  setSkyColor(const Vec4 &color);

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    float getSkyIllum() const;
    void  setSkyIllum(float illum);

    /**
     * @en Ground color
     * @zh 地面颜色
     */
    Vec4 &getGroundAlbedo();
    void  setGroundAlbedo(const Vec4 &color);

protected:
    Vec4  _groundAlbedoHDR{0.2F, 0.2F, 0.2F, 1.F};
    Vec4  _skyColorHDR{0.2F, 0.5F, 0.8F, 1.F};
    float _skyIllumHDR{0.F};

    Vec4  _groundAlbedoLDR{0.2F, 0.2F, 0.2F, 1.F};
    Vec4  _skyColorLDR{0.2F, 0.5F, 0.8F, 1.F};
    float _skyIllumLDR{0.F};

    bool _enabled{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Ambient);
};

/**
 * @en Environment lighting information in the Scene
 * @zh 场景的环境光照相关信息
 */
// @ccclass('cc.AmbientInfo')
// @help('i18n:cc.Ambient')
class AmbientInfo : public RefCounted {
public:
    AmbientInfo(/* args */) = default;
    ~AmbientInfo() override = default;

    inline void        setSkyColorHDR(const Vec4 &val) { _skyColorHDR.set(val); };
    inline const Vec4 &getSkyColorHDR() const { return _skyColorHDR; };
    inline const Vec4 &getSkyColorLDR() const { return _skyColorLDR; };

    inline void        setGroundAlbedoHDR(const Vec4 &val) { _groundAlbedoHDR.set(val); };
    inline const Vec4 &getGroundAlbedoHDR() const { return _groundAlbedoHDR; };
    inline const Vec4 &getGroundAlbedoLDR() const { return _groundAlbedoLDR; };

    inline void         setSkyIllumHDR(float val) { _skyIllumHDR = val; };
    inline const float &getSkyIllumHDR() const { return _skyIllumHDR; };
    inline const float &getSkyIllumLDR() const { return _skyIllumLDR; };

    /**
     * @en Sky lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的天空光照颜色（通过颜色拾取器）
     */
    // @visible(() => {
    //     const scene = legacyCC.director.getScene();
    //     const skybox = scene.globals.skybox;
    //     if (skybox.useIBL && skybox.applyDiffuseMap) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // })
    // @editable
    // @tooltip('i18n:ambient.skyLightingColor')
    void         setSkyLightingColor(const Color &val);
    const Color &getSkyLightingColor() const;

    void setSkyColor(const Vec4 &val);

    /**
     * @en Sky illuminance
     * @zh 天空亮度
     */
    // @editable
    // @type(CCFloat)
    // @tooltip('i18n:ambient.skyIllum')
    void         setSkyIllum(float val);
    inline float getSkyIllum() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return isHDR ? _skyIllumHDR : _skyIllumLDR;
    }

    /**
     * @en Ground lighting color configurable in editor with color picker
     * @zh 编辑器中可配置的地面光照颜色（通过颜色拾取器）
     */
    // @visible(() => {
    //     const scene = legacyCC.director.getScene();
    //     const skybox = scene.globals.skybox;
    //     if (skybox.useIBL && skybox.applyDiffuseMap) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // })
    // @editable
    // @tooltip('i18n:ambient.groundLightingColor')
    void         setGroundLightingColor(const Color &val);
    const Color &getGroundLightingColor() const;

    void setGroundAlbedo(const Vec4 &val);

    void activate(Ambient *resource);

    //cjh JSB need to bind the property, so need to make it public
    //private:
    // @serializable
    // @formerlySerializedAs('_skyColor'));
    Vec4 _skyColorHDR{0.2F, 0.5F, 0.8F, 1.F};
    // @serializable
    // @formerlySerializedAs('_skyIllum')
    float _skyIllumHDR{Ambient::SKY_ILLUM};
    // @serializable
    // @formerlySerializedAs('_groundAlbedo')
    Vec4 _groundAlbedoHDR{0.2F, 0.2F, 0.2F, 1.F};

    // @serializable
    Vec4 _skyColorLDR{0.2F, 0.5F, 0.8F, 1.F};

    // @serializable
    float _skyIllumLDR{Ambient::SKY_ILLUM};
    // @serializable
    Vec4 _groundAlbedoLDR{0.2F, 0.2F, 0.2F, 1.F};

    Ambient *_resource{nullptr};
};

} // namespace scene
} // namespace cc
