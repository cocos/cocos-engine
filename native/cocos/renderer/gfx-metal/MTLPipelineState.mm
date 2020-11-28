#include "MTLStd.h"

#include "MTLBuffer.h"
#include "MTLDevice.h"
#include "MTLGPUObjects.h"
#include "MTLPipelineLayout.h"
#include "MTLPipelineState.h"
#include "MTLSampler.h"
#include "MTLShader.h"
#include "MTLTexture.h"
#include "MTLUtils.h"

#import <Metal/MTLDevice.h>
#import <Metal/MTLVertexDescriptor.h>

namespace cc {
namespace gfx {

CCMTLPipelineState::CCMTLPipelineState(Device *device) : PipelineState(device) {}
CCMTLPipelineState::~CCMTLPipelineState() { destroy(); }

bool CCMTLPipelineState::initialize(const PipelineStateInfo &info) {
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _renderPass = info.renderPass;
    _pipelineLayout = info.pipelineLayout;

    if (!createGPUPipelineState()) {
        return false;
    }
    return true;
}

void CCMTLPipelineState::destroy() {
    if (_mtlRenderPipelineState) {
        [_mtlRenderPipelineState release];
        _mtlRenderPipelineState = nil;
    }

    if (_mtlDepthStencilState) {
        [_mtlDepthStencilState release];
        _mtlDepthStencilState = nil;
    }

    CC_SAFE_DELETE(_GPUPipelineState);
}

bool CCMTLPipelineState::createGPUPipelineState() {
    _GPUPipelineState = CC_NEW(CCMTLGPUPipelineState);
    if (!_GPUPipelineState) {
        CC_LOG_ERROR("CCMTLPipelineState: CC_NEW CCMTLGPUPipelineState failed.");
        return false;
    }

    if (!createMTLRenderPipelineState()) return false;

    // Application can run with wrong depth/stencil state.
    if (!createMTLDepthStencilState()) return false;

    _GPUPipelineState->mtlDepthStencilState = _mtlDepthStencilState;
    _GPUPipelineState->mtlRenderPipelineState = _mtlRenderPipelineState;
    _GPUPipelineState->cullMode = mu::toMTLCullMode(_rasterizerState.cullMode);
    _GPUPipelineState->fillMode = mu::toMTLTriangleFillMode(_rasterizerState.polygonMode);
    _GPUPipelineState->depthClipMode = mu::toMTLDepthClipMode(_rasterizerState.isDepthClip);
    _GPUPipelineState->winding = mu::toMTLWinding(_rasterizerState.isFrontFaceCCW);
    _GPUPipelineState->stencilRefFront = _depthStencilState.stencilRefFront;
    _GPUPipelineState->stencilRefBack = _depthStencilState.stencilRefBack;
    _GPUPipelineState->primitiveType = mu::toMTLPrimitiveType(_primitive);
    if (_pipelineLayout)
        _GPUPipelineState->gpuPipelineLayout = static_cast<CCMTLPipelineLayout *>(_pipelineLayout)->gpuPipelineLayout();
    _GPUPipelineState->gpuShader = static_cast<CCMTLShader *>(_shader)->gpuShader();
    return true;
}

bool CCMTLPipelineState::createMTLDepthStencilState() {
    MTLDepthStencilDescriptor *descriptor = [[MTLDepthStencilDescriptor alloc] init];
    if (descriptor == nil) {
        CC_LOG_ERROR("CCMTLPipelineState: MTLDepthStencilDescriptor could not be allocated.");
        return false;
    }

    descriptor.depthWriteEnabled = _depthStencilState.depthWrite;

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

    id<MTLDevice> mtlDevice = id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice());
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
    setMTLFunctions(descriptor);
    setVertexDescriptor(descriptor);
    setFormats(descriptor);
    setBlendStates(descriptor);
    ret = createMTLRenderPipeline(descriptor);
    [descriptor release];

    return ret;
}

void CCMTLPipelineState::setVertexDescriptor(MTLRenderPipelineDescriptor *descriptor) {
    auto activeAttributes = static_cast<CCMTLShader *>(_shader)->getAttributes();

    vector<std::tuple<int /**vertexBufferBindingIndex*/, uint /**stream*/>> layouts;
    unordered_map<int /**vertexBufferBindingIndex*/, std::tuple<uint /**stride*/, bool /**isInstanced*/>> map;
    vector<uint> streamOffsets(_device->getMaxVertexAttributes(), 0u);
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

void CCMTLPipelineState::setMTLFunctions(MTLRenderPipelineDescriptor *descriptor) {
    descriptor.vertexFunction = ((CCMTLShader *)_shader)->getVertMTLFunction();
    descriptor.fragmentFunction = ((CCMTLShader *)_shader)->getFragmentMTLFunction();
}

void CCMTLPipelineState::setFormats(MTLRenderPipelineDescriptor *descriptor) {
    int i = 0;
    MTLPixelFormat mtlPixelFormat;
    for (const auto &colorAttachment : _renderPass->getColorAttachments()) {
        mtlPixelFormat = mu::toMTLPixelFormat(colorAttachment.format);
        if (mtlPixelFormat != MTLPixelFormatInvalid)
            descriptor.colorAttachments[i].pixelFormat = mtlPixelFormat;

        ++i;
    }

    mtlPixelFormat = mu::toMTLPixelFormat(_renderPass->getDepthStencilAttachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.depthAttachmentPixelFormat = mtlPixelFormat;

    mtlPixelFormat = mu::toMTLPixelFormat(_renderPass->getDepthStencilAttachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.stencilAttachmentPixelFormat = mtlPixelFormat;
}

void CCMTLPipelineState::setBlendStates(MTLRenderPipelineDescriptor *descriptor) {
    //FIXME: how to handle these two attributes?
    //    BlendState::isIndepend
    //    BlendState::blendColor;

    descriptor.alphaToCoverageEnabled = _blendState.isA2C;

    int i = 0;
    for (const auto blendTarget : _blendState.targets) {
        MTLRenderPipelineColorAttachmentDescriptor *colorDescriptor = descriptor.colorAttachments[i];
        colorDescriptor.blendingEnabled = blendTarget.blend;
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
    id<MTLDevice> mtlDevice = id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice());
    NSError *nsError = nil;
    _mtlRenderPipelineState = [mtlDevice newRenderPipelineStateWithDescriptor:descriptor error:&nsError];
    if (!_mtlRenderPipelineState) {
        CC_LOG_ERROR("Failed to create MTLRenderPipelineState: %s", [nsError.localizedDescription UTF8String]);
        return false;
        ;
    }

    return true;
}

} // namespace gfx
} // namespace cc
