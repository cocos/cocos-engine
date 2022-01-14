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

#include "base/Macros.h"
#include "base/RefCounted.h"
#include "core/Root.h"
#include "core/assets/TextureCube.h"
#include "pipeline/GlobalDescriptorSetManager.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "scene/Model.h"

namespace cc {
namespace scene {

class Skybox;

/**
 * @en Skybox related information
 * @zh 天空盒相关信息
 */
// @ccclass('cc.SkyboxInfo')
// @help('i18n:cc.Skybox')
class SkyboxInfo : public RefCounted {
public:
    SkyboxInfo(/* args */) = default;
    ~SkyboxInfo() override = default;

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
    void setApplyDiffuseMap(bool val);

    bool isApplyDiffuseMap() const { return _applyDiffuseMap; }

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    // @editable
    // @tooltip('i18n:skybox.enabled')
    void        setEnabled(bool val);
    inline bool isEnabled() const { return _enabled; }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    // @editable
    // @tooltip('i18n:skybox.useIBL')
    void        setUseIBL(bool val);
    inline bool isUseIBL() const { return _useIBL; }

    /**
     * @en Toggle HDR (TODO: This SHOULD be moved into it's own subgroup away from skybox)
     * @zh 是否启用HDR？
     */
    // @editable
    // @tooltip('i18n:skybox.useHDR')
    void        setUseHDR(bool val);
    inline bool isUseHDR() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return _useHDR;
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    // @editable
    // @type(TextureCube)
    // @tooltip('i18n:skybox.envmap')
    void                setEnvmap(TextureCube *val);
    inline void setEnvmapForJS(TextureCube *val) {
        _envmapHDR = val;
    }
    inline TextureCube *getEnvmapForJS() const {
        return _envmapHDR;
    }

    inline TextureCube *getEnvmap() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return isHDR ? _envmapHDR : _envmapLDR;
    }

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
    void                setDiffuseMap(TextureCube *val);
    inline TextureCube *getDiffuseMap() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return isHDR ? _diffuseMapHDR : _diffuseMapLDR;
    }

    void activate(Skybox *resource);

    // cjh JSB need to bind the property, so need to make it public
    // private:
    //  @serializable
    bool _applyDiffuseMap{false};
    // @serializable
    // @type(TextureCube)
    // @formerlySerializedAs('_envmap')
    TextureCube *_envmapHDR{nullptr};
    // @serializable
    // @type(TextureCube)
    TextureCube *_envmapLDR{nullptr};
    // @serializable
    // @type(TextureCube)
    TextureCube *_diffuseMapHDR{nullptr};
    // @serializable
    // @type(TextureCube)
    TextureCube *_diffuseMapLDR{nullptr};
    // @serializable
    bool _enabled{false};
    // @serializable
    bool _useIBL{false};
    // @serializable
    bool _useHDR{true};

    Skybox *_resource{nullptr};
};

class Skybox final {
public:
    Skybox()  = default;
    ~Skybox() = default;

    void initialize(const SkyboxInfo &skyboxInfo);

    void setEnvMaps(TextureCube *envmapHDR, TextureCube *envmapLDR);

    void setDiffuseMaps(TextureCube *diffuseMapHDR, TextureCube *diffuseMapLDR);

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
    inline void setUseHDR(bool val) {
        _useHDR = val;
        setEnvMaps(_envmapHDR, _envmapLDR);
    }

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
        updateGlobalBinding();
        updatePipeline();
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    inline TextureCube *getEnvmap() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return isHDR ? _envmapHDR : _envmapLDR;
    }
    void setEnvmap(TextureCube *val);

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    inline bool isRGBE() const {
        auto *envmap = getEnvmap();
        return envmap != nullptr ? envmap->isRGBE : false;
    }

    /**
     * @en The texture cube used diffuse convolution map
     * @zh 使用的漫反射卷积图
     */
    inline TextureCube *getDiffuseMap() const {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        return isHDR ? _diffuseMapHDR.get() : _diffuseMapLDR.get();
    }
    inline void setDiffuseMap(TextureCube *val) {
        const bool isHDR = Root::getInstance()->getPipeline()->getPipelineSceneData()->isHDR();
        if (isHDR) {
            setDiffuseMaps(val, _envmapLDR);
        } else {
            setDiffuseMaps(_envmapHDR, val);
        }
    }

private:
    void updatePipeline() const;
    void updateGlobalBinding();

    IntrusivePtr<TextureCube>  _envmapLDR;
    IntrusivePtr<TextureCube>  _envmapHDR;
    IntrusivePtr<TextureCube>  _diffuseMapLDR;
    IntrusivePtr<TextureCube>  _diffuseMapHDR;
    pipeline::GlobalDSManager *_globalDSManager{nullptr};
    IntrusivePtr<Model>        _model;
    IntrusivePtr<TextureCube>  _default;
    bool                       _enabled{false};
    bool                       _useIBL{false};
    bool                       _useHDR{true};
    bool                       _useDiffuseMap{false};

    CC_DISALLOW_COPY_MOVE_ASSIGN(Skybox);
};

} // namespace scene
} // namespace cc
