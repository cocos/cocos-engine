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

#include "pipeline/xr/ar/ARBackground.h"
#include "ar/ARModule.h"
#include "base/memory/Memory.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXTexture.h"
#include "pipeline/Define.h"
#include "pipeline/PipelineStateManager.h"
#include "pipeline/forward/ForwardPipeline.h"
#include "platform/interfaces/modules/Device.h"
#include "scene/Camera.h"

namespace cc {
namespace pipeline {

ARBackground::~ARBackground() {
    destroy();
}

void ARBackground::activate(RenderPipeline *pipeline, gfx::Device *dev) {
    _device = dev;

#pragma region _shader

    ShaderSources<StandardShaderSource> sources;

    sources.glsl4 = {
        R"(
            precision highp float;
            layout(location = 0) in vec2 a_position;
            layout(location = 1) in vec2 a_texCoord;

            layout(location = 0) out vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
                v_texCoord = a_texCoord;
            }
        )",
        R"(
            precision highp float;
            layout(location = 0) in vec2 v_texCoord;
            layout(set = 1, binding = 0) uniform sampler2D u_YTex;
            layout(set = 1, binding = 1) uniform sampler2D u_CbCrTex;
            layout(set = 1, binding = 2) uniform Transfer_Mat {
                mat4 u_YCbCrToRGB;
            };

            layout(location = 0) out vec4 o_color;
            void main() {
                vec4 ycbcr = vec4(texture(u_YTex, v_texCoord).r, texture(u_CbCrTex, v_texCoord).rg, 1);
                o_color = u_YCbCrToRGB * ycbcr;
            }
        )",
    };

    sources.glsl3 = {
        R"(
            in vec2 a_position;
            in vec2 a_texCoord;
            layout(std140) uniform Mats {
                mat4 u_MVP;
                mat4 u_CoordMatrix;
            };

            out vec2 v_texCoord;
            void main() {
                v_texCoord = (u_CoordMatrix * vec4(a_texCoord, 0, 1)).xy;
                gl_Position = u_MVP * vec4(a_position, 0, 1);
            }
        )",
        R"(
            #extension GL_OES_EGL_image_external_essl3 : require
            precision mediump float;

            in vec2 v_texCoord;
            uniform samplerExternalOES u_texture;

            out vec4 o_color;
            void main() {
                o_color = texture(u_texture, v_texCoord);
            }
        )",
    };

    sources.glsl1 = {
        R"(
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            uniform mat4 u_MVP;
            uniform mat4 u_CoordMatrix;

            varying vec2 v_texCoord;
            void main() {
                v_texCoord = (u_CoordMatrix * vec4(a_texCoord, 0, 1)).xy;
                gl_Position = u_MVP * vec4(a_position, 0, 1);
            }
        )",
        R"(
            #extension GL_OES_EGL_image_external : require
            precision mediump float;

            varying vec2 v_texCoord;
            uniform samplerExternalOES u_texture;

            void main() {
                gl_FragColor = texture2D(u_texture, v_texCoord);
            }
        )",
    };

    StandardShaderSource &source = getAppropriateShaderSource(sources);

    gfx::ShaderStageList shaderStageList;

    gfx::ShaderStage vertexShaderStage;
    vertexShaderStage.stage = gfx::ShaderStageFlagBit::VERTEX;
    vertexShaderStage.source = source.vert;
    shaderStageList.emplace_back(std::move(vertexShaderStage));

    gfx::ShaderStage fragmentShaderStage;
    fragmentShaderStage.stage = gfx::ShaderStageFlagBit::FRAGMENT;
    fragmentShaderStage.source = source.frag;
    shaderStageList.emplace_back(std::move(fragmentShaderStage));

    gfx::AttributeList attributeList = {
        {"a_position", gfx::Format::RG32F, false, 0, false, 0},
        {"a_texCoord", gfx::Format::RG32F, false, 0, false, 1},
    };

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    gfx::UniformBlockList blockList = {{materialSet, 0, "Mats", {{"u_MVP", gfx::Type::MAT4, 1}, {"u_CoordMatrix", gfx::Type::MAT4, 1}}, 2}};
    gfx::UniformSamplerTextureList samplerTextures = {{materialSet, 1, "u_texture", gfx::Type::SAMPLER2D, 1}};
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    gfx::UniformBlockList blockList = {{materialSet, 2, "Transfer_Mat", {{"u_YCbCrToRGB", gfx::Type::MAT4, 1}}, 1}};
    gfx::UniformSamplerTextureList samplerTextures = {{materialSet, 0, "u_YTex", gfx::Type::SAMPLER2D, 1}, {materialSet, 1, "u_CbCrTex", gfx::Type::SAMPLER2D, 1}};
#endif
    gfx::ShaderInfo shaderInfo;
    shaderInfo.name = "ARBackGround";
    shaderInfo.stages = std::move(shaderStageList);
    shaderInfo.attributes = attributeList;
    shaderInfo.blocks = std::move(blockList);
    shaderInfo.samplerTextures = std::move(samplerTextures);
    _shader = _device->createShader(shaderInfo);

#pragma endregion

#pragma region _inputAssembler

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    float vertices[] = {-1, -1, 0, 0,
                        -1, 1, 0, 1,
                        1, -1, 1, 0,
                        1, 1, 1, 1};
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    float vertices[] = {-1, -1, 0, 1,
                        -1, 1, 0, 0,
                        1, -1, 1, 1,
                        1, 1, 1, 0};
#endif
    _vertexBuffer = _device->createBuffer({
        gfx::BufferUsage::VERTEX,
        gfx::MemoryUsage::DEVICE,
        sizeof(vertices),
        4 * sizeof(float),
    });
    _vertexBuffer->update(vertices, sizeof(vertices));

    uint16_t indices[] = {0, 2, 1, 1, 2, 3};
    gfx::BufferInfo indexBufferInfo = {
        gfx::BufferUsageBit::INDEX,
        gfx::MemoryUsage::DEVICE,
        sizeof(indices),
        sizeof(uint16_t),
    };
    auto *indexBuffer = _device->createBuffer(indexBufferInfo);
    indexBuffer->update(indices, sizeof(indices));

    gfx::DrawInfo drawInfo;
    drawInfo.indexCount = 6;
    gfx::BufferInfo indirectBufferInfo = {
        gfx::BufferUsageBit::INDIRECT,
        gfx::MemoryUsage::DEVICE,
        sizeof(gfx::DrawInfo),
        sizeof(gfx::DrawInfo),
    };
    auto *indirectBuffer = _device->createBuffer(indirectBufferInfo);
    indirectBuffer->update(&drawInfo, sizeof(gfx::DrawInfo));

    gfx::InputAssemblerInfo inputAssemblerInfo;
    inputAssemblerInfo.attributes = std::move(attributeList);
    inputAssemblerInfo.vertexBuffers.emplace_back(_vertexBuffer);
    inputAssemblerInfo.indexBuffer = indexBuffer;
    inputAssemblerInfo.indirectBuffer = indirectBuffer;
    _inputAssembler = _device->createInputAssembler(inputAssemblerInfo);

#pragma endregion

    gfx::DescriptorSetLayoutInfo dslInfo;
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    dslInfo.bindings.push_back({0, gfx::DescriptorType::UNIFORM_BUFFER, 1, gfx::ShaderStageFlagBit::VERTEX});
    dslInfo.bindings.push_back({1, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::FRAGMENT});
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    dslInfo.bindings.push_back({0, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::FRAGMENT});
    dslInfo.bindings.push_back({1, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::FRAGMENT});
    dslInfo.bindings.push_back({2, gfx::DescriptorType::UNIFORM_BUFFER, 1, gfx::ShaderStageFlagBit::FRAGMENT});
#endif
    _descriptorSetLayout = _device->createDescriptorSetLayout(dslInfo);

    _descriptorSet = _device->createDescriptorSet({_descriptorSetLayout});

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    gfx::BufferInfo uniformBufferInfo = {
        gfx::BufferUsage::UNIFORM,
        gfx::MemoryUsage::DEVICE,
        2 * sizeof(Mat4),
    };
    _uniformBuffer = _device->createBuffer(uniformBufferInfo);
    float mats[] = {
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, 0,
        0, 0, -1, 1,
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1};
    _uniformBuffer->update(mats, 2 * sizeof(Mat4));
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    gfx::BufferInfo transferUniformBufferInfo = {
        gfx::BufferUsage::UNIFORM,
        gfx::MemoryUsage::DEVICE,
        sizeof(Mat4),
    };
    float transferMats[] = {
        1.0000f, 1.0000f, 1.0000f, 0.0000f,
        0.0000f, -.3441f, 1.7720f, 0.0000f,
        1.4020f, -.7141f, 0.0000f, 0.0000f,
        -.7010f, 0.5291f, -.8860f, 1.0000f};
    _ycbcrTransferBuffer = _device->createBuffer(transferUniformBufferInfo);
    _ycbcrTransferBuffer->update(transferMats, sizeof(Mat4));
#endif

    _pipelineLayout = _device->createPipelineLayout({{pipeline->getDescriptorSetLayout(), _descriptorSetLayout}});

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    // background id
    glGenTextures(1, &_glTex);
#endif
}

void ARBackground::render(cc::scene::Camera *camera, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    auto *const armodule = cc::ar::ARModule::get();
    if (!armodule) return;
    int apiState = armodule->getAPIState();
    if (apiState < 0) return;

#if CC_PLATFORM == CC_PLATFORM_ANDROID
    if (armodule->getTexInitFlag()) {
        gfx::SamplerInfo samplerInfo = {
                gfx::Filter::LINEAR,
                gfx::Filter::LINEAR,
                gfx::Filter::NONE,
                gfx::Address::CLAMP,
                gfx::Address::CLAMP,
                gfx::Address::CLAMP,
        };

        auto *sampler = _device->getSampler(samplerInfo);
        armodule->setCameraTextureName(static_cast<int>(_glTex));

        gfx::TextureInfo textureInfo;
        textureInfo.usage = gfx::TextureUsage::SAMPLED | gfx::TextureUsage::TRANSFER_SRC;
        textureInfo.format = gfx::Format::RGBA8;
        textureInfo.width = camera->getWidth();
        textureInfo.height = camera->getHeight();
        textureInfo.externalRes = reinterpret_cast<void *>(_glTex);
        gfx::Texture *backgroundTex = _device->createTexture(textureInfo);

        _descriptorSet->bindBuffer(0, _uniformBuffer);
        _descriptorSet->bindSampler(1, sampler);
        _descriptorSet->bindTexture(1, backgroundTex);
        _descriptorSet->update();

        armodule->resetTexInitFlag();
    }
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    if (armodule->getTexInitFlag()) {
        auto *pixelBuffer = armodule->getCameraTextureRef();
        if (pixelBuffer != nullptr) {
            gfx::SamplerInfo samplerInfo;
            auto *sampler = _device->getSampler(samplerInfo);

            gfx::TextureInfo yTexInfo;
            yTexInfo.usage = gfx::TextureUsage::SAMPLED | gfx::TextureUsage::TRANSFER_SRC;
            yTexInfo.format = gfx::Format::R8;
            // TODO: need improvement
            // here do not effect exactly, just for CC_ASSERT in TextureValidator::doInit
            yTexInfo.width = 1;
            yTexInfo.height = 1;
            yTexInfo.externalRes = pixelBuffer;
            yTexInfo.layerCount = 0;
            gfx::TextureInfo cbcrTexInfo;
            cbcrTexInfo.usage = gfx::TextureUsage::SAMPLED | gfx::TextureUsage::TRANSFER_SRC;
            cbcrTexInfo.format = gfx::Format::RG8;
            // TODO: need improvement
            // here do not effect exactly, just for CC_ASSERT in TextureValidator::doInit
            cbcrTexInfo.width = 1;
            cbcrTexInfo.height = 1;
            cbcrTexInfo.externalRes = pixelBuffer;
            cbcrTexInfo.layerCount = 1;
            gfx::Texture *yTex = _device->createTexture(yTexInfo);
            gfx::Texture *cbcrTex = _device->createTexture(cbcrTexInfo);

            _descriptorSet->bindSampler(0, sampler);
            _descriptorSet->bindTexture(0, yTex);
            _descriptorSet->bindSampler(1, sampler);
            _descriptorSet->bindTexture(1, cbcrTex);
            _descriptorSet->bindBuffer(2, _ycbcrTransferBuffer);
            _descriptorSet->update();

            armodule->resetTexInitFlag();
        }
    }
#endif

    auto data = armodule->getCameraTexCoords();
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    if (apiState > 1) {
        float vertices[] = {-1, -1, data[2], data[3],
                            -1, 1, data[0], data[1],
                            1, -1, data[6], data[7],
                            1, 1, data[4], data[5]};
        _vertexBuffer->update(vertices, sizeof(vertices));
    } else {
        float vertices[] = {-1, -1, data[0], data[1],
                            -1, 1, data[2], data[3],
                            1, -1, data[4], data[5],
                            1, 1, data[6], data[7]};
        _vertexBuffer->update(vertices, sizeof(vertices));
    }
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    float vertices[] = {-1, -1, data[2], data[3],
                        -1, 1, data[0], data[1],
                        1, -1, data[6], data[7],
                        1, 1, data[4], data[5]};
    _vertexBuffer->update(vertices, sizeof(vertices));
#endif

    gfx::PipelineStateInfo pipelineInfo;
    pipelineInfo.shader = _shader;
    pipelineInfo.pipelineLayout = _pipelineLayout;
    pipelineInfo.renderPass = renderPass;
    pipelineInfo.inputState = {_inputAssembler->getAttributes()};

    _pipelineState = _device->createPipelineState(pipelineInfo);

    cmdBuffer->bindInputAssembler(_inputAssembler);
    cmdBuffer->bindPipelineState(_pipelineState);
    cmdBuffer->bindDescriptorSet(materialSet, _descriptorSet);
    cmdBuffer->draw(_inputAssembler);
}

template <typename T>
T &ARBackground::getAppropriateShaderSource(ShaderSources<T> &sources) {
    switch (_device->getGfxAPI()) {
        case gfx::API::GLES2:
            return sources.glsl1;
        case gfx::API::GLES3:
            return sources.glsl3;
        case gfx::API::METAL:
        case gfx::API::VULKAN:
            return sources.glsl4;
        default: break;
    }
    return sources.glsl4;
}

void ARBackground::destroy() {
    CC_SAFE_DESTROY_AND_DELETE(_shader);
    CC_SAFE_DESTROY_AND_DELETE(_vertexBuffer);
#if CC_PLATFORM == CC_PLATFORM_ANDROID
    CC_SAFE_DESTROY_AND_DELETE(_uniformBuffer);
#elif CC_PLATFORM == CC_PLATFORM_MAC_IOS
    CC_SAFE_DESTROY_AND_DELETE(_ycbcrTransferBuffer);
#endif
    CC_SAFE_DESTROY_AND_DELETE(_inputAssembler);
    CC_SAFE_DESTROY_AND_DELETE(_descriptorSetLayout);
    CC_SAFE_DESTROY_AND_DELETE(_descriptorSet);
    CC_SAFE_DESTROY_AND_DELETE(_pipelineLayout);
    CC_SAFE_DESTROY_AND_DELETE(_pipelineState);
}

} // namespace pipeline
} // namespace cc
