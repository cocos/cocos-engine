/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-agent/DeviceAgent.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXPipelineLayout.h"
#include "gfx-base/GFXPipelineState.h"
#include "pipeline/RenderStage.h"
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    #include "gfx-gles3/GLES3Wrangler.h"
#endif

namespace cc {
namespace pipeline {

struct StandardShaderSource {
    ccstd::string vert;
    ccstd::string frag;
};

template <typename T>
struct ShaderSources {
    T glsl4;
    T glsl3;
    T glsl1;
};

class CC_DLL ARBackground {
public:
    ARBackground() = default;
    ~ARBackground();

    void activate(RenderPipeline* pipeline, gfx::Device* dev);
    void render(scene::Camera* camera, gfx::RenderPass* renderPass, gfx::CommandBuffer* cmdBuffer);
    void destroy();

private:
    template <typename T>
    T& getAppropriateShaderSource(ShaderSources<T>& sources);

    gfx::Device* _device{nullptr};

    gfx::Shader* _shader{nullptr};
    gfx::Buffer* _vertexBuffer{nullptr};

    gfx::InputAssembler* _inputAssembler{nullptr};
    gfx::DescriptorSetLayout* _descriptorSetLayout{nullptr};
    gfx::DescriptorSet* _descriptorSet{nullptr};
    gfx::PipelineLayout* _pipelineLayout{nullptr};
    gfx::PipelineState* _pipelineState{nullptr};

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    gfx::Buffer* _uniformBuffer{nullptr};
    GLuint _glTex{0U};
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    gfx::Buffer* _ycbcrTransferBuffer{nullptr};
#endif
};

} // namespace pipeline
} // namespace cc
