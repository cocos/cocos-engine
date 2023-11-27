/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUPipelineState.h"
#include <emscripten/html5_webgpu.h>
#include <algorithm>
#include <numeric>
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUPipelineLayout.h"
#include "WGPURenderPass.h"
#include "WGPUShader.h"
#include "WGPUUtils.h"
#include "base/std/container/vector.h"

namespace cc {
namespace gfx {
ccstd::map<ccstd::hash_t, void *> CCWGPUPipelineState::pipelineMap;

namespace {
using ccstd::hash_combine;
ccstd::hash_t hash(const WGPURenderPipelineDescriptor &desc) {
    ccstd::hash_t hash = 9527;
    hash_combine(hash, desc.layout);
    hash_combine(hash, desc.vertex.module);
    hash_combine(hash, desc.vertex.entryPoint);
    hash_combine(hash, desc.vertex.constantCount);
    for (uint32_t i = 0; i < desc.vertex.constantCount; ++i) {
        hash_combine(hash, desc.vertex.constants[i].key);
        hash_combine(hash, desc.vertex.constants[i].value);
    }

    hash_combine(hash, desc.vertex.bufferCount);
    for (size_t i = 0; i < desc.vertex.bufferCount; ++i) {
        const auto &buffer = desc.vertex.buffers[i];
        hash_combine(hash, buffer.arrayStride);
        hash_combine(hash, buffer.stepMode);
        hash_combine(hash, buffer.attributeCount);
        for (size_t j = 0; j < buffer.attributeCount; ++j) {
            const auto &attribute = buffer.attributes[j];
            hash_combine(hash, attribute.shaderLocation);
            hash_combine(hash, attribute.offset);
            hash_combine(hash, attribute.format);
        }
    }

    hash_combine(hash, desc.primitive.topology);
    hash_combine(hash, desc.primitive.stripIndexFormat);
    hash_combine(hash, desc.primitive.frontFace);
    hash_combine(hash, desc.primitive.cullMode);

    if (desc.depthStencil) {
        hash_combine(hash, desc.depthStencil->format);
        hash_combine(hash, desc.depthStencil->depthWriteEnabled);
        hash_combine(hash, desc.depthStencil->depthCompare);
        hash_combine(hash, desc.depthStencil->stencilFront.compare);
        hash_combine(hash, desc.depthStencil->stencilFront.failOp);
        hash_combine(hash, desc.depthStencil->stencilFront.depthFailOp);
        hash_combine(hash, desc.depthStencil->stencilFront.passOp);
        hash_combine(hash, desc.depthStencil->stencilBack.compare);
        hash_combine(hash, desc.depthStencil->stencilBack.failOp);
        hash_combine(hash, desc.depthStencil->stencilBack.depthFailOp);
        hash_combine(hash, desc.depthStencil->stencilBack.passOp);
        hash_combine(hash, desc.depthStencil->stencilReadMask);
        hash_combine(hash, desc.depthStencil->stencilWriteMask);
        hash_combine(hash, desc.depthStencil->depthBias);
        hash_combine(hash, desc.depthStencil->depthBiasSlopeScale);
        hash_combine(hash, desc.depthStencil->depthBiasClamp);
    }

    hash_combine(hash, desc.multisample.count);
    hash_combine(hash, desc.multisample.mask);
    hash_combine(hash, desc.multisample.alphaToCoverageEnabled);

    if (desc.fragment) {
        hash_combine(hash, desc.fragment->module);
        hash_combine(hash, desc.fragment->entryPoint);
        hash_combine(hash, desc.fragment->constantCount);
        for (uint32_t i = 0; i < desc.fragment->constantCount; ++i) {
            hash_combine(hash, desc.fragment->constants[i].key);
            hash_combine(hash, desc.fragment->constants[i].value);
        }

        hash_combine(hash, desc.fragment->targetCount);
        for (uint32_t i = 0; i < desc.fragment->targetCount; ++i) {
            hash_combine(hash, desc.fragment->targets[i].format);
            if (desc.fragment->targets[i].blend) {
                hash_combine(hash, desc.fragment->targets[i].blend->color.operation);
                hash_combine(hash, desc.fragment->targets[i].blend->color.srcFactor);
                hash_combine(hash, desc.fragment->targets[i].blend->color.dstFactor);
                hash_combine(hash, desc.fragment->targets[i].blend->alpha.operation);
                hash_combine(hash, desc.fragment->targets[i].blend->alpha.srcFactor);
                hash_combine(hash, desc.fragment->targets[i].blend->alpha.dstFactor);
            }
            hash_combine(hash, desc.fragment->targets[i].writeMask);
        }
    }
    return hash;
}

ccstd::hash_t hash(const WGPUComputePipelineDescriptor &desc) {
    ccstd::hash_t hash = 9527;
    hash_combine(hash, desc.layout);
    // hash_combine(hash, desc.compute);
    return hash;
}

} // namespace

CCWGPUPipelineState::CCWGPUPipelineState() : PipelineState() {
}

CCWGPUPipelineState::~CCWGPUPipelineState() {
    doDestroy();
}

void CCWGPUPipelineState::doInit(const PipelineStateInfo &info) {
    _gpuPipelineStateObj = ccnew CCWGPUPipelineStateObject;
}

void CCWGPUPipelineState::check(RenderPass *renderPass, bool forceUpdate) {
    if (_renderPass != renderPass) {
        _renderPass = renderPass;
        // _forceUpdate = true;
    }
    _forceUpdate |= forceUpdate;
}

void CCWGPUPipelineState::prepare(const ccstd::set<uint8_t> &setInUse) {
    auto *pipelineLayout = static_cast<CCWGPUPipelineLayout *>(_pipelineLayout);

    const DepthStencilAttachment &dsAttachment = _renderPass->getDepthStencilAttachment();
    if (_bindPoint == PipelineBindPoint::GRAPHICS) {
        if (_gpuPipelineStateObj->wgpuRenderPipeline && !_forceUpdate) {
            return;
        }

        if (!_gpuPipelineStateObj->redundantAttr.empty()) {
            _gpuPipelineStateObj->redundantAttr.clear();
        }

        auto maxStreamAttr = std::max_element(_inputState.attributes.begin(), _inputState.attributes.end(), [&](const Attribute &lhs, const Attribute &rhs) {
            return lhs.stream < rhs.stream;
        });

        auto longestAttr = std::max_element(_inputState.attributes.begin(), _inputState.attributes.end(), [&](const Attribute &lhs, const Attribute &rhs) {
            return GFX_FORMAT_INFOS[static_cast<uint32_t>(lhs.format)].size < GFX_FORMAT_INFOS[static_cast<uint32_t>(rhs.format)].size;
        });
        uint8_t mostToleranceStream = (*longestAttr).stream;

        const uint8_t streamCount = (*maxStreamAttr).stream + 1;

        ccstd::vector<WGPUVertexBufferLayout> vbLayouts(streamCount);
        ccstd::vector<ccstd::vector<WGPUVertexAttribute>> wgpuAttrsVec(streamCount);

        const AttributeList &attrs = _shader->getAttributes();
        uint64_t offset[256] = {0};
        // ccstd::vector<WGPUVertexAttribute> wgpuAttrs;

        for (size_t i = 0; i < _inputState.attributes.size(); ++i) {
            const auto &attr = _inputState.attributes[i];
            const auto &attrName = attr.name;
            auto iter = std::find_if(attrs.begin(), attrs.end(), [attrName](const Attribute &attr) {
                return strcmp(attrName.c_str(), attr.name.c_str()) == 0;
            });
            if (iter != attrs.end()) {
                Format format = attr.format;
                WGPUVertexAttribute attrInfo = {
                    .format = toWGPUVertexFormat(format),
                    .offset = offset[attr.stream],
                    .shaderLocation = (*iter).location,
                };
                wgpuAttrsVec[attr.stream].push_back(attrInfo);
                offset[attr.stream] += GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
                vbLayouts[attr.stream].stepMode = attr.isInstanced ? WGPUVertexStepMode_Instance : WGPUVertexStepMode_Vertex;
            } else {
                // all none-input attr are put in 1st buffer layout with offset = 0;
                Format format = attr.format;
                offset[attr.stream] += GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
            }
        }

        // printf("cr shname %s %d\n", _shader->getName().c_str(), streamCount);
        // wgpuAttrsVec[0] ∪ wgpuAttrsVec[1] ∪ ... ∪ wgpuAttrsVec[n] == shader.attrs
        for (size_t i = 0; i < attrs.size(); i++) {
            ccstd::string attrName = attrs[i].name;
            auto iter = std::find_if(_inputState.attributes.begin(), _inputState.attributes.end(), [attrName](const Attribute &attr) {
                return strcmp(attrName.c_str(), attr.name.c_str()) == 0;
            });

            if (iter == _inputState.attributes.end()) {
                // all none-input attr are put in 1st buffer layout with offset = 0;
                Format format = attrs[i].format;
                WGPUVertexAttribute attr = {
                    .format = toWGPUVertexFormat(format),
                    .offset = 0,
                    .shaderLocation = attrs[i].location,
                };

                if (GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size > GFX_FORMAT_INFOS[static_cast<uint32_t>((*longestAttr).format)].size) {
                    // printf("found attr %s %s in shader exceed size of longest attr %s %s\n", attrName.c_str(), GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].name.c_str(),
                    //        (*longestAttr).name.c_str(), GFX_FORMAT_INFOS[static_cast<uint32_t>((*longestAttr).format)].name.c_str());
                    _gpuPipelineStateObj->redundantAttr.push_back(attr);
                    if (GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size > _gpuPipelineStateObj->maxAttrLength) {
                        _gpuPipelineStateObj->maxAttrLength = GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
                    }
                } else {
                    wgpuAttrsVec[mostToleranceStream].push_back(attr);
                }
            }

            // printf("sl %s, %d, %d\n", attrName.c_str(), attrs[i].location, attrs[i].stream);
        }

        if (_gpuPipelineStateObj->maxAttrLength > 0) {
            wgpuAttrsVec.push_back(_gpuPipelineStateObj->redundantAttr);
            vbLayouts.resize(vbLayouts.size() + 1);
        }
        // _gpuPipelineStateObj->slotCount = vbLayouts.size();

        // std::set<uint32_t> locSet;
        for (size_t i = 0; i < wgpuAttrsVec.size(); ++i) {
            vbLayouts[i].arrayStride = offset[i];
            vbLayouts[i].attributeCount = static_cast<uint32_t>(wgpuAttrsVec[i].size());
            vbLayouts[i].attributes = wgpuAttrsVec[i].data();
            // for (size_t j = 0; j < wgpuAttrsVec[i].size(); ++j) {
            //     printf("wg %d, %llu, %d\n", wgpuAttrsVec[i][j].shaderLocation, wgpuAttrsVec[i][j].offset, wgpuAttrsVec[i][j].format);

            //     // if (locSet.find(wgpuAttrsVec[i][j].shaderLocation) != locSet.end() && wgpuAttrsVec[i][j].shaderLocation != 0) {
            //     //     printf("duplicate location %d\n", wgpuAttrsVec[i][j].shaderLocation);
            //     //     while (1) {
            //     //     }
            //     // }
            //     // locSet.insert(wgpuAttrsVec[i][j].shaderLocation);
            // }
        }

        WGPUVertexState vertexState = {
            .nextInChain = nullptr,
            .module = static_cast<CCWGPUShader *>(_shader)->gpuShaderObject()->wgpuShaderVertexModule,
            .entryPoint = "main",
            .bufferCount = vbLayouts.size(),
            .buffers = vbLayouts.data(),
        };

        bool stripTopology = (_primitive == PrimitiveMode::LINE_STRIP || _primitive == PrimitiveMode::TRIANGLE_STRIP);

        WGPUPrimitiveState primitiveState = {
            .nextInChain = nullptr,
            .topology = toWGPUPrimTopology(_primitive),
            .stripIndexFormat = stripTopology ? WGPUIndexFormat_Uint16 : WGPUIndexFormat_Undefined, // TODO_Zeqiang: ???
            .frontFace = _rasterizerState.isFrontFaceCCW ? WGPUFrontFace::WGPUFrontFace_CCW : WGPUFrontFace::WGPUFrontFace_CW,
            .cullMode = _rasterizerState.cullMode == CullMode::FRONT  ? WGPUCullMode::WGPUCullMode_Front
                        : _rasterizerState.cullMode == CullMode::BACK ? WGPUCullMode::WGPUCullMode_Back
                                                                      : WGPUCullMode::WGPUCullMode_None,
        };

        WGPUStencilFaceState stencilFront = {
            .compare = toWGPUCompareFunction(_depthStencilState.stencilFuncFront),
            .failOp = toWGPUStencilOperation(_depthStencilState.stencilFailOpFront),
            .depthFailOp = toWGPUStencilOperation(_depthStencilState.stencilZFailOpFront),
            .passOp = toWGPUStencilOperation(_depthStencilState.stencilPassOpFront),
        };
        WGPUStencilFaceState stencilBack = {
            .compare = toWGPUCompareFunction(_depthStencilState.stencilFuncBack),
            .failOp = toWGPUStencilOperation(_depthStencilState.stencilFailOpBack),
            .depthFailOp = toWGPUStencilOperation(_depthStencilState.stencilZFailOpBack),
            .passOp = toWGPUStencilOperation(_depthStencilState.stencilPassOpBack),
        };

        WGPUDepthStencilState dsState = {
            .nextInChain = nullptr,
            .format = toWGPUTextureFormat(dsAttachment.format),
            .depthWriteEnabled = _depthStencilState.depthWrite != 0,
            .depthCompare = _depthStencilState.depthTest ? toWGPUCompareFunction(_depthStencilState.depthFunc) : WGPUCompareFunction_Always,
            .stencilFront = stencilFront,
            .stencilBack = stencilBack,
            .stencilReadMask = _depthStencilState.stencilReadMaskFront,
            .stencilWriteMask = _depthStencilState.stencilWriteMaskFront,
            .depthBias = static_cast<int32_t>(_rasterizerState.depthBias),
            .depthBiasSlopeScale = _rasterizerState.depthBiasSlop,
            .depthBiasClamp = _rasterizerState.depthBiasClamp,
        };

        WGPUMultisampleState msState = {
            .count = static_cast<CCWGPURenderPass *>(_renderPass)->gpuRenderPassObject()->sampleCount,
            .mask = 0xFFFFFFFF,
            .alphaToCoverageEnabled = _blendState.isA2C != 0,
        };

        const ColorAttachmentList &colors = _renderPass->getColorAttachments();
        ccstd::vector<WGPUColorTargetState> colorTargetStates(colors.size());

        ccstd::vector<WGPUBlendState> blendState(colors.size());

        for (size_t i = 0, targetIndex = 0; i < colors.size(); i++) {
            colorTargetStates[i].format = toWGPUTextureFormat(colors[i].format);
            auto colorBO = _blendState.targets[targetIndex].blendEq;
            blendState[i].color = {
                .operation = toWGPUBlendOperation(colorBO),
                .srcFactor = toWGPUBlendFactor(colorBO == BlendOp::MAX ? BlendFactor::ONE : _blendState.targets[targetIndex].blendSrc),
                .dstFactor = toWGPUBlendFactor(colorBO == BlendOp::MAX ? BlendFactor::ONE : _blendState.targets[targetIndex].blendDst),
            };
            auto alphaBO = _blendState.targets[targetIndex].blendAlphaEq;
            blendState[i].alpha = {
                .operation = toWGPUBlendOperation(alphaBO),
                .srcFactor = toWGPUBlendFactor(alphaBO == BlendOp::MAX ? BlendFactor::ONE : _blendState.targets[targetIndex].blendSrcAlpha),
                .dstFactor = toWGPUBlendFactor(alphaBO == BlendOp::MAX ? BlendFactor::ONE : _blendState.targets[targetIndex].blendDstAlpha),
            };
            // only textureSampleType with float can be blended.
            colorTargetStates[i].blend = (_blendState.targets[targetIndex].blend && (textureSampleTypeTrait(colors[i].format) == WGPUTextureSampleType_Float)) ? &blendState[i] : nullptr;
            colorTargetStates[i].writeMask = toWGPUColorWriteMask(_blendState.targets[targetIndex].blendColorMask);
            if (targetIndex < _blendState.targets.size() - 1) {
                ++targetIndex;
            }
        }

        WGPUFragmentState fragmentState = {
            .module = static_cast<CCWGPUShader *>(_shader)->gpuShaderObject()->wgpuShaderFragmentModule,
            .entryPoint = "main",
            .targetCount = colorTargetStates.size(),
            .targets = colorTargetStates.data(),
        };

        // pipelineLayout->prepare(setInUse);

        WGPURenderPipelineDescriptor piplineDesc = {
            .nextInChain = nullptr,
            .label = static_cast<CCWGPUShader *>(_shader)->getName().c_str(),
            .layout = pipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout,
            .vertex = vertexState,
            .primitive = primitiveState,
            .depthStencil = dsState.format == WGPUTextureFormat_Undefined ? nullptr : &dsState,
            .multisample = msState,
            .fragment = &fragmentState,
        };

        auto hashVal = hash(piplineDesc);
        _hash = hashVal;

        auto iter = pipelineMap.find(hashVal);
        if (iter == pipelineMap.end()) {
            _gpuPipelineStateObj->wgpuRenderPipeline = wgpuDeviceCreateRenderPipeline(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &piplineDesc);
            printf("ppl %s\n", static_cast<CCWGPUShader *>(_shader)->getName().c_str());
            pipelineMap[hashVal] = _gpuPipelineStateObj->wgpuRenderPipeline;
        } else {
            _gpuPipelineStateObj->wgpuRenderPipeline = static_cast<WGPURenderPipeline>(iter->second);
        }
        _ppl = pipelineLayout;
        _forceUpdate = false;
    } else if (_bindPoint == PipelineBindPoint::COMPUTE) {
        if (_gpuPipelineStateObj->wgpuComputePipeline && !_forceUpdate)
            return;
        WGPUProgrammableStageDescriptor psDesc = {
            .module = static_cast<CCWGPUShader *>(_shader)->gpuShaderObject()->wgpuShaderComputeModule,
            .entryPoint = "main",
        };
        // pipelineLayout->prepare(setInUse);
        WGPUComputePipelineDescriptor piplineDesc = {
            .layout = pipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout,
            .compute = psDesc,
        };
        auto hashVal = hash(piplineDesc);
        _hash = hashVal;

        auto iter = pipelineMap.find(hashVal);
        if (iter == pipelineMap.end()) {
            _gpuPipelineStateObj->wgpuComputePipeline = wgpuDeviceCreateComputePipeline(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &piplineDesc);
            printf("ppl %s\n", static_cast<CCWGPUShader *>(_shader)->getName().c_str());
            pipelineMap[hashVal] = _gpuPipelineStateObj->wgpuComputePipeline;
        } else {
            _gpuPipelineStateObj->wgpuComputePipeline = static_cast<WGPUComputePipeline>(iter->second);
        }
        _ppl = pipelineLayout;
        _forceUpdate = false;
    } else {
        printf("unsupport pipeline bind point");
    }
}

void CCWGPUPipelineState::doDestroy() {
    if (_gpuPipelineStateObj) {
        if (_gpuPipelineStateObj->wgpuRenderPipeline) {
            wgpuRenderPipelineRelease(_gpuPipelineStateObj->wgpuRenderPipeline);
        }
        if (_gpuPipelineStateObj->wgpuComputePipeline) {
            wgpuComputePipelineRelease(_gpuPipelineStateObj->wgpuComputePipeline);
        }

        delete _gpuPipelineStateObj;
        _gpuPipelineStateObj = nullptr;
    }
}

} // namespace gfx
} // namespace cc
