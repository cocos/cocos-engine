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

#include "base/TypeDef.h"
#include "cocos/base/Optional.h"

#include "core/assets/Material.h"

namespace cc {

struct IMaterialInstanceInfo {
    Material *parent{nullptr};
    //    RenderableComponent *owner{nullptr};
    index_t subModelIdx{0};
};

class PassInstance;

/**
 * @zh
 * 材质实例，当有材质修改需求时，根据材质资源创建的，可任意定制的实例。
 */
class MaterialInstance final : public Material {
public:
    using Super = Material;

    explicit MaterialInstance(const IMaterialInstanceInfo &info);

    Material *getParent() const override {
        return _parent.get();
    }

    //    RenderableComponent *getOwner() const override {
    //        return _owner;
    //    }

    void recompileShaders(const MacroRecord &overrides) override {
        MaterialInstance::recompileShaders(overrides, CC_INVALID_INDEX);
    }
    void recompileShaders(const MacroRecord &overrides, index_t passIdx) override;

    void overridePipelineStates(const PassOverrides &overrides) override {
        MaterialInstance::overridePipelineStates(overrides, CC_INVALID_INDEX);
    }
    void overridePipelineStates(const PassOverrides &overrides, index_t passIdx) override;

    bool destroy() override;

    void onPassStateChange(bool dontNotify);

    // For JS
    using RebuildPSOCallback = std::function<void(index_t index, Material *material)>;
    void setRebuildPSOCallback(const RebuildPSOCallback &cb);
    //

protected:
    std::vector<IntrusivePtr<scene::Pass>> createPasses() override;

private:
    IntrusivePtr<Material> _parent;
    //    RenderableComponent *_owner{nullptr};
    index_t _subModelIdx{0};

    RebuildPSOCallback _rebuildPSOCallback{nullptr};
};

} // namespace cc
