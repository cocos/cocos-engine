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

#include "base/CoreStd.h"

namespace cc {
namespace gfx {
class DescriptorSet;
class DescriptorSetLayout;
class Sampler;
class Buffer;
class Texture;
class Device;
} // namespace gfx
namespace pipeline {
class RenderPipeline;

class GlobalDSManager : public Object {
public:
    GlobalDSManager()           = default;
    ~GlobalDSManager() override = default;

    inline std::unordered_map<uint, gfx::DescriptorSet *> getDescriptorSetMap() const { return _descriptorSetMap; }
    inline gfx::Sampler *                                 getLinearSampler() const { return _linearSampler; }
    inline gfx::Sampler *                                 getPointSampler() const { return _pointSampler; }
    inline gfx::DescriptorSetLayout *                     getDescriptorSetLayout() const { return _descriptorSetLayout; }
    inline gfx::DescriptorSet *                           getGlobalDescriptorSet() const { return _globalDescriptorSet; }

    void                activate(gfx::Device *device, RenderPipeline *pipeline);
    void                bindBuffer(uint binding, gfx::Buffer *buffer);
    void                bindTexture(uint binding, gfx::Texture *texture);
    void                bindSampler(uint binding, gfx::Sampler *sampler);
    void                update();
    gfx::DescriptorSet *getOrCreateDescriptorSet(uint idx);
    void                destroy();

protected:
    static void setDescriptorSetLayout();

private:
    RenderPipeline *                               _pipeline            = nullptr;
    gfx::Device *                                  _device              = nullptr;
    gfx::Sampler *                                 _linearSampler       = nullptr;
    gfx::Sampler *                                 _pointSampler        = nullptr;
    gfx::DescriptorSetLayout *                     _descriptorSetLayout = nullptr;
    gfx::DescriptorSet *                           _globalDescriptorSet = nullptr;
    std::unordered_map<uint, gfx::DescriptorSet *> _descriptorSetMap{};
    std::vector<gfx::Buffer *>                     _shadowUBOs;
};

} // namespace pipeline
} // namespace cc
