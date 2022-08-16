/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUPipelineState.h"
#include <emscripten/html5_webgpu.h>
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

using namespace emscripten;

CCWGPUPipelineState::CCWGPUPipelineState() : wrapper<PipelineState>(val::object()) {
}

void CCWGPUPipelineState::doInit(const PipelineStateInfo &info) {
    _gpuPipelineStateObj = ccnew CCWGPUPipelineStateObject;
}

void CCWGPUPipelineState::check(RenderPass *renderPass) {
    if (_renderPass != renderPass) {
        _renderPass = renderPass;
        _forceUpdate = true;
    }
}

void CCWGPUPipelineState::prepare(const ccstd::set<uint8_t> &setInUse) {
    auto *pipelineLayout = static_cast<CCWGPUPipelineLayout *>(_pipelineLayout);

    const DepthStencilAttachment &dsAttachment = _renderPass->getDepthStencilAttachment();
    if (_bindPoint == PipelineBindPoint::GRAPHICS) {
        if (_gpuPipelineStateObj->wgpuRenderPipeline && !_forceUpdate) {
            return;
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
        bool isInstance = attrs.empty() ? false : attrs[0].isInstanced;
        uint8_t index = 0;

        // wgpuAttrsVec[0] ∪ wgpuAttrsVec[1] ∪ ... ∪ wgpuAttrsVec[n] == shader.attrs
        for (size_t i = 0; i < attrs.size(); i++) {
            ccstd::string attrName = attrs[i].name;
            auto iter = std::find_if(_inputState.attributes.begin(), _inputState.attributes.end(), [attrName](const Attribute &attr) {
                return strcmp(attrName.c_str(), attr.name.c_str()) == 0;
            });

            if (iter != _inputState.attributes.end()) {
                Format format = (*iter).format;
                WGPUVertexAttribute attr = {
                    .format = toWGPUVertexFormat(format),
                    .offset = offset[(*iter).stream],
                    .shaderLocation = attrs[i].location,
                };
                wgpuAttrsVec[(*iter).stream].push_back(attr);
                offset[(*iter).stream] += GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
            } else {
                // all none-input attr are put in 1st buffer layout with offset = 0;
                Format format = attrs[i].format;
                WGPUVertexAttribute attr = {
                    .format = toWGPUVertexFormat(format),
                    .offset = 0,
                    .shaderLocation = attrs[i].location,
                };

                if (GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size > GFX_FORMAT_INFOS[static_cast<uint32_t>((*longestAttr).format)].size) {
                    printf("found attr %s %s in shader exceed size of longest attr %s %s\n", attrName.c_str(), GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].name.c_str(),
                           (*longestAttr).name.c_str(), GFX_FORMAT_INFOS[static_cast<uint32_t>((*longestAttr).format)].name.c_str());
                    _gpuPipelineStateObj->redundantAttr.push_back(attr);
                    if (GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size > _gpuPipelineStateObj->maxAttrLength) {
                        _gpuPipelineStateObj->maxAttrLength = GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
                    }
                } else {
                    wgpuAttrsVec[mostToleranceStream].push_back(attr);
                }
            }
        }

        // input state has attr which shader hasnt.
        for (size_t i = 0; i < _inputState.attributes.size(); ++i) {
            ccstd::string attrName = _inputState.attributes[i].name;
            const auto &attribute = _inputState.attributes[i];
            auto iter = std::find_if(attrs.begin(), attrs.end(), [attrName](const Attribute &attr) {
                return strcmp(attrName.c_str(), attr.name.c_str()) == 0;
            });
            if (iter == attrs.end()) {
                Format format = attribute.format;
                offset[attribute.stream] += GFX_FORMAT_INFOS[static_cast<uint32_t>(format)].size;
            }
        }

        if (_gpuPipelineStateObj->maxAttrLength > 0) {
            wgpuAttrsVec.push_back(_gpuPipelineStateObj->redundantAttr);
            vbLayouts.resize(vbLayouts.size() + 1);
        }

        for (size_t i = 0; i < wgpuAttrsVec.size(); ++i) {
            vbLayouts[i] = {
                .arrayStride = offset[i],
                .stepMode = isInstance ? WGPUVertexStepMode_Instance : WGPUVertexStepMode_Vertex,
                .attributeCount = wgpuAttrsVec[i].size(),
                .attributes = wgpuAttrsVec[i].data(),
            };
        }

        // WGPUVertexBufferLayout vertexBufferLayout = {
        //     .arrayStride    = stride, // TODO_Zeqiang: ???
        //     .stepMode       = isInstance ? WGPUVertexStepMode_Instance : WGPUVertexStepMode_Vertex,
        //     .attributeCount = wgpuAttrs.size(),
        //     .attributes     = wgpuAttrs.data(),
        // };

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
            .stripIndexFormat = stripTopology ? WGPUIndexFormat_Uint16 : WGPUIndexFormat_Undefined, //TODO_Zeqiang: ???
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
            .depthCompare = _depthStencilState.depthTest ? toWGPUCompareFunction(_depthStencilState.depthFunc) : WGPUCompareFunction_Undefined,
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
            blendState[i].color = {
                .operation = toWGPUBlendOperation(_blendState.targets[targetIndex].blendEq),
                .srcFactor = toWGPUBlendFactor(_blendState.targets[targetIndex].blendSrc),
                .dstFactor = toWGPUBlendFactor(_blendState.targets[targetIndex].blendDst),
            };
            blendState[i].alpha = {
                .operation = toWGPUBlendOperation(_blendState.targets[targetIndex].blendAlphaEq),
                .srcFactor = toWGPUBlendFactor(_blendState.targets[targetIndex].blendSrcAlpha),
                .dstFactor = toWGPUBlendFactor(_blendState.targets[targetIndex].blendDstAlpha),
            };
            colorTargetStates[i].blend = &blendState[i];
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

        pipelineLayout->prepare(setInUse);
        // const auto setLayouts = pipelineLayout->getSetLayouts();
        // for (size_t i = 0; i < setLayouts.size(); ++i) {
        //     const auto* layout = setLayouts[i];
        //     if (layout) {
        //         printf("---set %d---\n", i);
        //         static_cast<const CCWGPUDescriptorSetLayout*>(layout)->print();
        //     }
        // }

        WGPURenderPipelineDescriptor piplineDesc = {
            .nextInChain = nullptr,
            .label = nullptr,
            .layout = pipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout,
            .vertex = vertexState,
            .primitive = primitiveState,
            .depthStencil = dsState.format == WGPUTextureFormat_Undefined ? nullptr : &dsState,
            .multisample = msState,
            .fragment = &fragmentState,
        };
        _gpuPipelineStateObj->wgpuRenderPipeline = wgpuDeviceCreateRenderPipeline(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &piplineDesc);
        _ppl = pipelineLayout;
        _forceUpdate = false;
    } else if (_bindPoint == PipelineBindPoint::COMPUTE) {
        if (_gpuPipelineStateObj->wgpuComputePipeline)
            return;
        WGPUProgrammableStageDescriptor psDesc = {
            .module = static_cast<CCWGPUShader *>(_shader)->gpuShaderObject()->wgpuShaderComputeModule,
            .entryPoint = "main",
        };
        pipelineLayout->prepare(setInUse);
        WGPUComputePipelineDescriptor piplineDesc = {
            .layout = pipelineLayout->gpuPipelineLayoutObject()->wgpuPipelineLayout,
            .compute = psDesc,
        };
        _gpuPipelineStateObj->wgpuComputePipeline = wgpuDeviceCreateComputePipeline(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &piplineDesc);
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
    }
}

} // namespace gfx
} // namespace cc