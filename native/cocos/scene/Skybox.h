/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

#include "3d/assets/Mesh.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "core/Root.h"
#include "core/assets/TextureCube.h"

namespace cc {

namespace pipeline {
class GlobalDSManager;
}
namespace scene {

enum class EnvironmentLightingType {
    /**
     * @zh
     * 半球漫反射
     * @en
     * hemisphere diffuse
     * @readonly
     */
    HEMISPHERE_DIFFUSE = 0,
    /**
     * @zh
     * 半球漫反射和环境反射
     * @en
     * hemisphere diffuse and Environment reflection
     * @readonly
     */
    AUTOGEN_HEMISPHERE_DIFFUSE_WITH_REFLECTION = 1,
    /**
     * @zh
     * 漫反射卷积图和环境反射
     * @en
     * diffuse convolution map and environment reflection
     * @readonly
     */
    DIFFUSEMAP_WITH_REFLECTION = 2
};

class Model;
class Skybox;

/**
 * @en Skybox related information
 * @zh 天空盒相关信息
 */
// @ccclass('cc.SkyboxInfo')
// @help('i18n:cc.Skybox')
class SkyboxInfo : public RefCounted {
public:
    SkyboxInfo(/* args */);
    ~SkyboxInfo() override;

    /**
     * @en Whether to use diffuse convolution map. Enabled -> Will use map specified. Disabled -> Will revert to hemispheric lighting
     * @zh 是否为IBL启用漫反射卷积图？不启用的话将使用默认的半球光照
     */
    // @visible(function (this : SkyboxInfo) {
    //     if (useIBL) {
    //         return true;
    //     }
    //     return false;
    // })
    // @editable
    // @tooltip('i18n:skybox.applyDiffuseMap')
    void setApplyDiffuseMap(bool val) const;

    bool isApplyDiffuseMap() const {
        return EnvironmentLightingType::DIFFUSEMAP_WITH_REFLECTION == _envLightingType;
    }
    void setEnvLightingType(EnvironmentLightingType val);
    EnvironmentLightingType getEnvLightingType() const {
        return _envLightingType;
    }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    // @editable
    // @tooltip('i18n:skybox.enabled')
    void setEnabled(bool val);
    inline bool isEnabled() const { return _enabled; }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    // @editable
    // @tooltip('i18n:skybox.useIBL')
    void setUseIBL(bool val) const;
    inline bool isUseIBL() const {
        return EnvironmentLightingType::HEMISPHERE_DIFFUSE != _envLightingType;
    }

    /**
     * @en Toggle HDR (TODO: This SHOULD be moved into it's own subgroup away from skybox)
     * @zh 是否启用HDR？
     */
    // @editable
    // @tooltip('i18n:skybox.useHDR')
    void setUseHDR(bool val);
    bool isUseHDR() const;
    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    // @editable
    // @type(TextureCube)
    // @tooltip('i18n:skybox.envmap')
    void setEnvmap(TextureCube *val);
    TextureCube *getEnvmap() const;

    inline void setEnvmapForJS(TextureCube *val) {
        _envmapHDR = val;
    }
    inline TextureCube *getEnvmapForJS() const {
        return _envmapHDR;
    }

    void setRotationAngle(float val);
    inline float getRotationAngle() const { return _rotationAngle; }

    /**
     * @en The optional diffusion convolution map used in tandem with IBL
     * @zh 使用的漫反射卷积图
     */
    // @visible(function (this : SkyboxInfo) {
    //     if (this.useIBL) {
    //         return true;
    //     }
    //     return false;
    // })
    // @editable
    // @readOnly
    // @type(TextureCube)
    void setDiffuseMap(TextureCube *val);
    TextureCube *getDiffuseMap() const;

    void setReflectionMap(TextureCube *val);
    TextureCube *getReflectionMap() const;

    void setSkyboxMaterial(Material *val);
    inline Material *getSkyboxMaterial() const { return _editableMaterial; }

    void setMaterialProperty(const ccstd::string &name, const MaterialPropertyVariant &val, index_t passIdx = CC_INVALID_INDEX) const;
    void updateEnvMap(TextureCube *val);

    void activate(Skybox *resource);

    // cjh JSB need to bind the property, so need to make it public
    // private:
    // @serializable
    // @type(TextureCube)
    // @formerlySerializedAs('_envmap')
    IntrusivePtr<TextureCube> _envmapHDR{nullptr};
    // @serializable
    // @type(TextureCube)
    IntrusivePtr<TextureCube> _envmapLDR{nullptr};
    // @serializable
    // @type(TextureCube)
    IntrusivePtr<TextureCube> _diffuseMapHDR{nullptr};
    // @serializable
    // @type(TextureCube)
    IntrusivePtr<TextureCube> _diffuseMapLDR{nullptr};
    IntrusivePtr<TextureCube> _reflectionHDR{nullptr};
    IntrusivePtr<TextureCube> _reflectionLDR{nullptr};
    // @serializable
    bool _enabled{false};
    // @serializable
    bool _useHDR{true};
    EnvironmentLightingType _envLightingType{EnvironmentLightingType::HEMISPHERE_DIFFUSE};
    IntrusivePtr<Material> _editableMaterial;
    float _rotationAngle{0.F};
    Skybox *_resource{nullptr};
};

class Skybox final {
public:
    Skybox() = default;
    ~Skybox() = default;

    void initialize(const SkyboxInfo &skyboxInfo);

    void setEnvMaps(TextureCube *envmapHDR, TextureCube *envmapLDR);

    void setDiffuseMaps(TextureCube *diffuseMapHDR, TextureCube *diffuseMapLDR);

    void setReflectionMaps(TextureCube *reflectionHDR, TextureCube *reflectionLDR);

    void activate();

    inline Model *getModel() const { return _model.get(); }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    inline bool isEnabled() const { return _enabled; }
    inline void setEnabled(bool val) {
        _enabled = val;
        if (val) {
            activate();
        } else {
            updatePipeline();
        }
    }

    /**
     * @en HDR
     * @zh 是否启用HDR？
     */
    inline bool isUseHDR() const { return _useHDR; }
    void setUseHDR(bool val);

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    inline bool isUseIBL() const { return _useIBL; }
    inline void setUseIBL(bool val) {
        _useIBL = val;
        updatePipeline();
    }

    /**
     * @en Whether use diffuse convolution map lighting
     * @zh 是否为IBL启用漫反射卷积图？
     */
    inline bool isUseDiffuseMap() const { return _useDiffuseMap; }
    inline void setUseDiffuseMap(bool val) {
        _useDiffuseMap = val;
        setDiffuseMaps(nullptr, nullptr);
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    TextureCube *getEnvmap() const;
    void setEnvmap(TextureCube *val);

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    bool isRGBE() const;

    /**
     * @en Whether to use offline baked convolutional maps
     * @zh 是否使用离线烘焙的卷积图？
     */
    bool isUsingConvolutionMap() const;

    /**
     * @en The texture cube used diffuse convolution map
     * @zh 使用的漫反射卷积图
     */
    TextureCube *getDiffuseMap() const;
    void setDiffuseMap(TextureCube *val);
    void setSkyboxMaterial(Material *skyboxMat);
    inline Material *getSkyboxMaterial() const { return _material; }
    /**
     * @en Set skybox rotate angle
     * @zh 设置天空盒旋转角度
     * @param angle  @en rotation angle @zh 旋转角度
     */
    void setRotationAngle(float angle);
    float getRotationAngle() const { return _rotationAngle; };

    TextureCube *getReflectionMap() const;

private:
    void updatePipeline() const;
    void updateGlobalBinding();
    void updateSubModes() const;

    IntrusivePtr<TextureCube> _envmapLDR;
    IntrusivePtr<TextureCube> _envmapHDR;
    IntrusivePtr<TextureCube> _diffuseMapLDR;
    IntrusivePtr<TextureCube> _diffuseMapHDR;
    IntrusivePtr<TextureCube> _reflectionHDR;
    IntrusivePtr<TextureCube> _reflectionLDR;
    pipeline::GlobalDSManager *_globalDSManager{nullptr};
    IntrusivePtr<Model> _model;
    IntrusivePtr<Mesh> _mesh;
    IntrusivePtr<Material> _material;
    IntrusivePtr<TextureCube> _default;
    bool _enabled{false};
    bool _useIBL{false};
    bool _useHDR{true};
    bool _useDiffuseMap{false};
    bool _activated{false};
    IntrusivePtr<Material> _editableMaterial;
    float _rotationAngle{0.F};
    CC_DISALLOW_COPY_MOVE_ASSIGN(Skybox);
};

} // namespace scene
} // namespace cc
