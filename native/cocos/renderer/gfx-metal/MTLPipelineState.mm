/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLGPUObjects.h"
#include "MTLPipelineLayout.h"
#include "MTLPipelineState.h"
#include "MTLSampler.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "MTLUtils.h"
#include "MTLRenderPass.h"

#import <Metal/MTLDevice.h>
#import <Metal/MTLVertexDescriptor.h>
#import <Metal/MTLComputePipeline.h>

namespace cc {
namespace gfx {

CCMTLPipelineState::CCMTLPipelineState() : PipelineState() {
    _typedID = generateObjectID<decltype(this)>();
}

void CCMTLPipelineState::doInit(const PipelineStateInfo &info) {
    createGPUPipelineState();
}

void CCMTLPipelineState::doDestroy() {
    CC_SAFE_DELETE(_GPUPipelineState);

    id<MTLRenderPipelineState> renderPipelineState = _mtlRenderPipelineState;
    _mtlRenderPipelineState = nil;
    id<MTLDepthStencilState> depthStencilState = _mtlDepthStencilState;
    _mtlDepthStencilState = nil;

    std::function<void(void)> destroyFunc = [=]() {
        if (renderPipelineState) {
            [renderPipelineState release];
        }
        if (depthStencilState) {
            [depthStencilState release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

bool CCMTLPipelineState::initRenderPipeline() {
    if (!createMTLRenderPipelineState()) {
        return false;
    }
    // Application can run with wrong depth/stencil state.
    if (!createMTLDepthStencilState()) {
        return false;
    }

    _GPUPipelineState->mtlDepthStencilState = _mtlDepthStencilState;
    _GPUPipelineState->mtlRenderPipelineState = _mtlRenderPipelineState;
    _GPUPipelineState->cullMode = static_cast<MTLCullMode>(mu::toMTLCullMode(_rasterizerState.cullMode));
    _GPUPipelineState->fillMode = static_cast<MTLTriangleFillMode>(mu::toMTLTriangleFillMode(_rasterizerState.polygonMode));
    _GPUPipelineState->depthClipMode = static_cast<MTLDepthClipMode>(mu::toMTLDepthClipMode(_rasterizerState.isDepthClip != 0));
    _GPUPipelineState->winding = static_cast<MTLWinding>(mu::toMTLWinding(_rasterizerState.isFrontFaceCCW != 0));
    _GPUPipelineState->stencilRefFront = _depthStencilState.stencilRefFront;
    _GPUPipelineState->stencilRefBack = _depthStencilState.stencilRefBack;
    _GPUPipelineState->primitiveType = mu::toMTLPrimitiveType(_primitive);
    if (_pipelineLayout)
        _GPUPipelineState->gpuPipelineLayout = static_cast<CCMTLPipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    _GPUPipelineState->gpuShader = static_cast<CCMTLShader *>(_shader)->gpuShader();
    
    _renderPipelineReady = true;
    return true;
}

void CCMTLPipelineState::check() {
    if(!_renderPipelineReady) {
        initRenderPipeline();
    }
}

bool CCMTLPipelineState::createGPUPipelineState() {
    _GPUPipelineState = CC_NEW(CCMTLGPUPipelineState);
    if (!_GPUPipelineState) {
        CC_LOG_ERROR("CCMTLPipelineState: CC_NEW CCMTLGPUPipelineState failed.");
        return false;
    }

    if(_bindPoint == PipelineBindPoint::GRAPHICS) {
        if(_renderPass->getSubpasses().empty()) {
            initRenderPipeline();
        }
    }
    else if (_bindPoint == PipelineBindPoint::COMPUTE) {
        if (!createMTLComputePipelineState()) {
            return false;
        }
        _GPUPipelineState->mtlComputePipelineState = _mtlComputePipeline;
        _GPUPipelineState->gpuShader = static_cast<CCMTLShader *>(_shader)->gpuShader();
        if (_pipelineLayout)
            _GPUPipelineState->gpuPipelineLayout = static_cast<CCMTLPipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    }

    return true;
}

bool CCMTLPipelineState::createMTLComputePipelineState() {
    //create with function
    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    NSError* err;
    _mtlComputePipeline = [mtlDevice newComputePipelineStateWithFunction:((CCMTLShader *)_shader)->getComputeMTLFunction()
                                                                   error:&err];
    if (!_mtlComputePipeline) {
        CC_LOG_ERROR("Create compute pipeline failed: %s", [err.localizedDescription UTF8String]);
        return false;
    }
    return true;
}

bool CCMTLPipelineState::createMTLDepthStencilState() {
    MTLDepthStencilDescriptor *descriptor = [[MTLDepthStencilDescriptor alloc] init];
    if (descriptor == nil) {
        CC_LOG_ERROR("CCMTLPipelineState: MTLDepthStencilDescriptor could not be allocated.");
        return false;
    }

    descriptor.depthWriteEnabled = _depthStencilState.depthWrite != 0;

    if (!_depthStencilState.depthTest)
        descriptor.depthCompareFunction = MTLCompareFunctionAlways;
    else
        descriptor.depthCompareFunction = mu::toMTLCompareFunction(_depthStencilState.depthFunc);

    if (_depthStencilState.stencilTestFront) {
        descriptor.frontFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_depthStencilState.stencilFuncFront);
        descriptor.frontFaceStencil.readMask = _depthStencilState.stencilReadMaskFront;
        descriptor.frontFaceStencil.writeMask = _depthStencilState.stencilWriteMaskFront;
        descriptor.frontFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilFailOpFront);
        descriptor.frontFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilZFailOpFront);
        descriptor.frontFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_depthStencilState.stencilPassOpFront);
    } else {
        descriptor.frontFaceStencil = nil;
    }

    if (_depthStencilState.stencilTestBack) {
        descriptor.backFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_depthStencilState.stencilFuncBack);
        descriptor.backFaceStencil.readMask = _depthStencilState.stencilReadMaskBack;
        descriptor.backFaceStencil.writeMask = _depthStencilState.stencilWriteMaskBack;
        descriptor.backFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilFailOpBack);
        descriptor.backFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilZFailOpBack);
        descriptor.backFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_depthStencilState.stencilPassOpBack);
    } else {
        descriptor.backFaceStencil = nil;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlDepthStencilState = [mtlDevice newDepthStencilStateWithDescriptor:descriptor];
    [descriptor release];

    if (!_mtlDepthStencilState) {
        CC_LOG_ERROR("Failed to create MTLDepthStencilState.");
        return false;
    }
    return true;
}

bool CCMTLPipelineState::createMTLRenderPipelineState() {
    bool ret = true;
    MTLRenderPipelineDescriptor *descriptor = [[MTLRenderPipelineDescriptor alloc] init];
    if (descriptor == nil) {
        CC_LOG_ERROR("CCMTLPipelineState: MTLRenderPipelineDescriptor could not be allocated.");
        return false;
    }
    setMTLFunctionsAndFormats(descriptor);
    setVertexDescriptor(descriptor);
    setBlendStates(descriptor);
    ret = createMTLRenderPipeline(descriptor);
    [descriptor release];

    return ret;
}

//TODO: reconstruction
void CCMTLPipelineState::setVertexDescriptor(MTLRenderPipelineDescriptor *descriptor) {
    auto activeAttributes = static_cast<CCMTLShader *>(_shader)->getAttributes();
    vector<std::tuple<int /**vertexBufferBindingIndex*/, uint /**stream*/>> layouts;
    unordered_map<int /**vertexBufferBindingIndex*/, std::tuple<uint /**stride*/, bool /**isInstanced*/>> map;
    vector<uint> streamOffsets(CCMTLDevice::getInstance()->getCapabilities().maxVertexAttributes, 0u);
    vector<bool> activeAttribIdx(activeAttributes.size(), false);
    for (const auto &inputAttrib : _inputState.attributes) {
        auto bufferIndex = static_cast<CCMTLShader *>(_shader)->getAvailableBufferBindingIndex(ShaderStageFlagBit::VERTEX, inputAttrib.stream);

        for (auto i = 0; i < activeAttributes.size(); i++) {
            const auto &activeAttribute = activeAttributes[i];
            if (inputAttrib.name == activeAttribute.name) {
                descriptor.vertexDescriptor.attributes[activeAttribute.location].format = mu::toMTLVertexFormat(inputAttrib.format, inputAttrib.isNormalized);
                descriptor.vertexDescriptor.attributes[activeAttribute.location].offset = streamOffsets[inputAttrib.stream];
                descriptor.vertexDescriptor.attributes[activeAttribute.location].bufferIndex = bufferIndex;
                auto tuple = std::make_tuple(bufferIndex, inputAttrib.stream);
                if (std::find(layouts.begin(), layouts.end(), tuple) == layouts.end())
                    layouts.emplace_back(tuple);
                activeAttribIdx[i] = true;
                break;
            }
        }
        streamOffsets[inputAttrib.stream] += GFX_FORMAT_INFOS[(int)inputAttrib.format].size;
        map[bufferIndex] = std::make_tuple(streamOffsets[inputAttrib.stream], inputAttrib.isInstanced);
    }

    for (auto i = 0; i < activeAttribIdx.size(); i++) {
        if (activeAttribIdx[i]) continue;

        const auto &dummy = activeAttributes[i];
        descriptor.vertexDescriptor.attributes[dummy.location].format = MTLVertexFormatFloat;
        descriptor.vertexDescriptor.attributes[dummy.location].offset = 0;
        descriptor.vertexDescriptor.attributes[dummy.location].bufferIndex = static_cast<CCMTLShader *>(_shader)->getAvailableBufferBindingIndex(ShaderStageFlagBit::VERTEX, dummy.stream);
        CC_LOG_WARNING("Attribute %s is missing, add a dummy data for it.", dummy.name.c_str());
    }

    // layouts
    for (const auto &layout : layouts) {
        auto index = std::get<0>(layout);
        descriptor.vertexDescriptor.layouts[index].stride = std::get<0>(map[index]);
        descriptor.vertexDescriptor.layouts[index].stepFunction = std::get<1>(map[index]) ? MTLVertexStepFunctionPerInstance : MTLVertexStepFunctionPerVertex;
        descriptor.vertexDescriptor.layouts[index].stepRate = 1;
        //to improve performance: https://developer.apple.com/documentation/metal/mtlpipelinebufferdescriptor?language=objc
        if (@available(iOS 11.0, macOS 10.13, *)) {
            descriptor.vertexBuffers[index].mutability = MTLMutabilityImmutable;
        }
    }

    _GPUPipelineState->vertexBufferBindingInfo = std::move(layouts);
}

void CCMTLPipelineState::setMTLFunctionsAndFormats(MTLRenderPipelineDescriptor *descriptor) {
    const SubpassInfoList& subpasses = _renderPass->getSubpasses();
    const ColorAttachmentList& colorAttachments = _renderPass->getColorAttachments();
    const auto& ccShader = static_cast<CCMTLShader*>(_shader);
    
    std::vector<uint> bindingIndices;
    std::vector<int> bindingOffsets;
    
    const CCMTLGPUShader* gpuShader = ccShader->gpuShader();
    uint32_t outputNum = static_cast<uint32_t>(gpuShader->outputs.size());
    bindingIndices.reserve(outputNum);
    bindingOffsets.reserve(outputNum);
    MTLPixelFormat mtlPixelFormat;
    std::set<uint> inputs;
    if(!subpasses.empty()) {
        for(size_t passIndex = 0; passIndex < subpasses.size(); ++passIndex) {
            const SubpassInfo& subpass = subpasses[passIndex];
            for (size_t i = 0; i < subpass.inputs.size(); ++i) {
                uint input = subpass.inputs[i];
                if(inputs.find(input) == inputs.end()) {
                    inputs.insert(input);
                    mtlPixelFormat = mu::toMTLPixelFormat(colorAttachments[input].format);
                    descriptor.colorAttachments[input].pixelFormat = mtlPixelFormat;
                }
            }
            
            for (size_t i = 0; i < subpass.colors.size(); ++i) {
                uint output = subpass.colors[i];
                mtlPixelFormat = mu::toMTLPixelFormat(colorAttachments[output].format);
                descriptor.colorAttachments[output].pixelFormat = mtlPixelFormat;
            }
        }
        const uint curIndex = static_cast<CCMTLRenderPass*>(_renderPass)->getCurrentSubpassIndex();
        const SubpassInfo& curSubpass = subpasses[curIndex];
        for (size_t i = 0; i < curSubpass.colors.size(); ++i) {
            bindingIndices.emplace_back(i);
            bindingOffsets.emplace_back(curSubpass.colors[i]);
        }
    } else {
        mtlPixelFormat = mu::toMTLPixelFormat(colorAttachments[0].format);
        descriptor.colorAttachments[0].pixelFormat = mtlPixelFormat;
        bindingIndices.emplace_back(0);
        bindingOffsets.emplace_back(0);
    }

    auto *ccMTLShader = static_cast<CCMTLShader*>(_shader);
    descriptor.vertexFunction = ccMTLShader->getVertMTLFunction();
    descriptor.fragmentFunction = ccMTLShader->getSpecializedFragFunction(bindingIndices.data(), bindingOffsets.data(), static_cast<uint32_t>(bindingIndices.size()));

    mtlPixelFormat = mu::toMTLPixelFormat(_renderPass->getDepthStencilAttachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid) {
        descriptor.stencilAttachmentPixelFormat = mtlPixelFormat;
        descriptor.depthAttachmentPixelFormat = mtlPixelFormat;
    }
}

void CCMTLPipelineState::setBlendStates(MTLRenderPipelineDescriptor *descriptor) {
    //FIXME: how to handle these two attributes?
    //    BlendState::isIndepend
    //    BlendState::blendColor;

    descriptor.alphaToCoverageEnabled = _blendState.isA2C != 0;

    int i = 0;
    for (const auto blendTarget : _blendState.targets) {
        MTLRenderPipelineColorAttachmentDescriptor *colorDescriptor = descriptor.colorAttachments[i];
        colorDescriptor.blendingEnabled = blendTarget.blend != 0;
        if (!blendTarget.blend)
            continue;

        colorDescriptor.writeMask = mu::toMTLColorWriteMask(blendTarget.blendColorMask);
        colorDescriptor.sourceRGBBlendFactor = mu::toMTLBlendFactor(blendTarget.blendSrc);
        colorDescriptor.destinationRGBBlendFactor = mu::toMTLBlendFactor(blendTarget.blendDst);
        colorDescriptor.rgbBlendOperation = mu::toMTLBlendOperation(blendTarget.blendEq);
        colorDescriptor.sourceAlphaBlendFactor = mu::toMTLBlendFactor(blendTarget.blendSrcAlpha);
        colorDescriptor.destinationAlphaBlendFactor = mu::toMTLBlendFactor(blendTarget.blendDstAlpha);
        colorDescriptor.alphaBlendOperation = mu::toMTLBlendOperation(blendTarget.blendAlphaEq);

        ++i;
    }
}

bool CCMTLPipelineState::createMTLRenderPipeline(MTLRenderPipelineDescriptor *descriptor) {
    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    NSError *nsError = nil;
    _mtlRenderPipelineState = [mtlDevice newRenderPipelineStateWithDescriptor:descriptor error:&nsError];
    if (!_mtlRenderPipelineState) {
        CC_LOG_ERROR("Failed to create MTLRenderPipelineState: %s", [nsError.localizedDescription UTF8String]);
        return false;
    }

    return true;
}

} // namespace gfx
} // namespace cc
