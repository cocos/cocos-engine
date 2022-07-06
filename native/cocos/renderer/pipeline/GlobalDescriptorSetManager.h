/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include <cstdint>
#include "base/Ptr.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace cc {
namespace scene {
class Light;
}
namespace gfx {
class DescriptorSet;
class DescriptorSetLayout;
class Sampler;
class Buffer;
class Texture;
class Device;
} // namespace gfx
namespace pipeline {

class GlobalDSManager final {
public:
    GlobalDSManager() = default;
    ~GlobalDSManager() = default;

    inline gfx::Sampler *getLinearSampler() const { return _linearSampler; }
    inline gfx::Sampler *getPointSampler() const { return _pointSampler; }
    inline gfx::DescriptorSetLayout *getDescriptorSetLayout() const { return _descriptorSetLayout; }
    inline gfx::DescriptorSet *getGlobalDescriptorSet() const { return _globalDescriptorSet; }

    void activate(gfx::Device *device);
    void bindBuffer(uint32_t binding, gfx::Buffer *buffer);
    void bindTexture(uint32_t binding, gfx::Texture *texture);
    void bindSampler(uint32_t binding, gfx::Sampler *sampler);
    void update();
    gfx::DescriptorSet *getOrCreateDescriptorSet(const scene::Light *light);
    void destroy();

    static void setDescriptorSetLayout();

private:
    // weak reference
    gfx::Device *_device{nullptr};

    // Samplers are hold by device
    gfx::Sampler *_linearSampler{nullptr};
    gfx::Sampler *_pointSampler{nullptr};

    IntrusivePtr<gfx::DescriptorSetLayout> _descriptorSetLayout;
    IntrusivePtr<gfx::DescriptorSet> _globalDescriptorSet;
    ccstd::vector<IntrusivePtr<gfx::Buffer>> _shadowUBOs;
    // light is weak reference
    ccstd::unordered_map<const scene::Light *, IntrusivePtr<gfx::DescriptorSet>> _descriptorSetMap;
};

} // namespace pipeline
} // namespace cc
