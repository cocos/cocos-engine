#include "MTLStd.h"
#include "MTLPipelineState.h"
#include "MTLShader.h"
#include "MTLUtils.h"
#include "MTLDevice.h"
#include "MTLBuffer.h"
#include "MTLTexture.h"
#include "MTLTextureView.h"
#include "MTLSampler.h"
#include "MTLGPUObjects.h"
#include "MTLBindingLayout.h"

#import <Metal/MTLVertexDescriptor.h>
#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLPipelineState::CCMTLPipelineState(GFXDevice* device) : GFXPipelineState(device) {}
CCMTLPipelineState::~CCMTLPipelineState() { destroy(); }

bool CCMTLPipelineState::initialize(const GFXPipelineStateInfo& info)
{
    _primitive = info.primitive;
    _shader = info.shader;
    _inputState = info.inputState;
    _rasterizerState = info.rasterizerState;
    _depthStencilState = info.depthStencilState;
    _blendState = info.blendState;
    _dynamicStates = info.dynamicStates;
    _layout = info.layout;
    _renderPass = info.renderPass;
    
    return createGPUPipelineState();
}

void CCMTLPipelineState::destroy()
{
    if (_mtlRenderPipelineState)
    {
        [_mtlRenderPipelineState release];
        _mtlRenderPipelineState = nil;
    }
    
    if (_mtlDepthStencilState)
    {
        [_mtlDepthStencilState release];
        _mtlDepthStencilState = nil;
    }
    
    CC_SAFE_DELETE(_GPUPipelieState);
}

void CCMTLPipelineState::updateBindingBlocks(const GFXBindingLayout* bl)
{
    if (!bl)
        return;
    
    for (const auto& bindingUnit : bl->getBindingUnits() )
    {
        for (auto& block : _vertexUniformBlocks)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.buffer)
            {
                block.buffer = static_cast<CCMTLBuffer*>(bindingUnit.buffer)->getMTLBuffer();
                break;
            }
        }
        
        for (auto& block : _fragmentUniformBlocks)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.buffer)
            {
                block.buffer = static_cast<CCMTLBuffer*>(bindingUnit.buffer)->getMTLBuffer();
                break;
            }
        }
        
        for (auto& block : _vertexTextures)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.texView)
            {
                block.texture = static_cast<CCMTLTextureView*>(bindingUnit.texView)->getMTLTexture();
                break;
            }
        }
        
        for (auto& block : _fragmentTextures)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.texView)
            {
                block.texture = static_cast<CCMTLTextureView*>(bindingUnit.texView)->getMTLTexture();
                break;
            }
        }
        
        for (auto& block : _vertexSamplerStates)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.sampler)
            {
                block.samplerState = static_cast<CCMTLSampler*>(bindingUnit.sampler)->getMTLSamplerState();
                break;
            }
        }
        
        for (auto& block : _fragmentSamplerStates)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.sampler)
            {
                block.samplerState = static_cast<CCMTLSampler*>(bindingUnit.sampler)->getMTLSamplerState();
                break;
            }
        }
    }
}

bool CCMTLPipelineState::createGPUPipelineState()
{
    _GPUPipelieState = CC_NEW(CCMTLGPUPipelineState);
    if (!_GPUPipelieState) return false;
    
    if (!createMTLRenderPipelineState() ) return false;
    
    // Application can run with wrong depth/stencil state.
    createMTLDepthStencilState();

    _GPUPipelieState->mtlDepthStencilState = _mtlDepthStencilState;
    _GPUPipelieState->mtlRenderPipelineState = _mtlRenderPipelineState;
    _GPUPipelieState->cullMode = mu::toMTLCullMode(_rasterizerState.cullMode);
    _GPUPipelieState->fillMode = mu::toMTLTriangleFillMode(_rasterizerState.polygonMode);
    _GPUPipelieState->depthClipMode = mu::toMTLDepthClipMode(_rasterizerState.isDepthClip);
    _GPUPipelieState->winding = mu::toMTLWinding(_rasterizerState.isFrontFaceCCW);
    _GPUPipelieState->stencilRefFront = _depthStencilState.stencilRefFront;
    _GPUPipelieState->stencilRefBack = _depthStencilState.stencilRefBack;
    _GPUPipelieState->primitiveType = mu::toMTLPrimitiveType(_primitive);
    _GPUPipelieState->vertexUniformBlocks = &_vertexUniformBlocks;
    _GPUPipelieState->fragmentUniformBlocks = &_fragmentUniformBlocks;
    _GPUPipelieState->vertexTextureList = &_vertexTextures;
    _GPUPipelieState->fragmentTextureList = &_fragmentTextures;
    _GPUPipelieState->vertexSampleStateList = &_vertexSamplerStates;
    _GPUPipelieState->fragmentSampleStateList = &_fragmentSamplerStates;
    
    return true;
}

void CCMTLPipelineState::createMTLDepthStencilState()
{
    if (!_depthStencilState.depthTest &&
        !_depthStencilState.depthWrite &&
        !_depthStencilState.stencilTestFront &&
        !_depthStencilState.stencilTestBack)
    {
        return;
    }
    
    MTLDepthStencilDescriptor* descriptor = [[MTLDepthStencilDescriptor alloc] init];
    descriptor.depthWriteEnabled = _depthStencilState.depthWrite;
    
    if (!_depthStencilState.depthTest)
        descriptor.depthCompareFunction = MTLCompareFunctionAlways;
    else
        descriptor.depthCompareFunction = mu::toMTLCompareFunction(_depthStencilState.depthFunc);
    
    if (_depthStencilState.stencilTestFront)
    {
        descriptor.frontFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_depthStencilState.stencilFuncFront);
        descriptor.frontFaceStencil.readMask = _depthStencilState.stencilReadMaskFront;
        descriptor.frontFaceStencil.writeMask = _depthStencilState.stencilWriteMaskFront;
        descriptor.frontFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilFailOpFront);
        descriptor.frontFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilZFailOpFront);
        descriptor.frontFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_depthStencilState.stencilPassOpFront);
    }
    else
    {
        descriptor.frontFaceStencil.stencilCompareFunction = MTLCompareFunctionAlways;
        descriptor.frontFaceStencil.readMask = _depthStencilState.stencilReadMaskFront;
        descriptor.frontFaceStencil.writeMask = _depthStencilState.stencilWriteMaskFront;
        descriptor.frontFaceStencil.stencilFailureOperation = MTLStencilOperationKeep;
        descriptor.frontFaceStencil.depthFailureOperation = MTLStencilOperationKeep;
        descriptor.frontFaceStencil.depthStencilPassOperation = MTLStencilOperationKeep;
    }
    
    if (_depthStencilState.stencilTestBack)
    {
        descriptor.backFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_depthStencilState.stencilFuncBack);
        descriptor.backFaceStencil.readMask = _depthStencilState.stencilReadMaskBack;
        descriptor.backFaceStencil.writeMask = _depthStencilState.stencilWriteMaskBack;
        descriptor.backFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilFailOpBack);
        descriptor.backFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_depthStencilState.stencilZFailOpBack);
        descriptor.backFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_depthStencilState.stencilPassOpBack);
    }
    else
    {
        descriptor.backFaceStencil.stencilCompareFunction = MTLCompareFunctionAlways;
        descriptor.backFaceStencil.readMask = _depthStencilState.stencilReadMaskBack;
        descriptor.backFaceStencil.writeMask = _depthStencilState.stencilWriteMaskBack;
        descriptor.backFaceStencil.stencilFailureOperation = MTLStencilOperationKeep;
        descriptor.backFaceStencil.depthFailureOperation = MTLStencilOperationKeep;
        descriptor.backFaceStencil.depthStencilPassOperation = MTLStencilOperationKeep;
    }
    
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)_device)->getMTLDevice() );
    _mtlDepthStencilState = [mtlDevice newDepthStencilStateWithDescriptor:descriptor];
    
    if (!_mtlDepthStencilState)  CC_LOG_ERROR("Failed to create MTLDepthStencilState.");
}

bool CCMTLPipelineState::createMTLRenderPipelineState()
{
    bool ret = true;
    MTLRenderPipelineDescriptor* descriptor = [[MTLRenderPipelineDescriptor alloc] init];
    setMTLFunctions(descriptor);
    setVertexDescriptor(descriptor);
    setFormats(descriptor);
    setBlendStates(descriptor);
    ret = createMTLRenderPipeline(descriptor);
    [descriptor release];
    
    return ret;
}

void CCMTLPipelineState::setVertexDescriptor(MTLRenderPipelineDescriptor* descriptor)
{
    // attributes
    int i = 0;
    uint stride = 0;
    for (const auto& attrib : _inputState.attributes)
    {
        descriptor.vertexDescriptor.attributes[i].format = mu::toMTLVertexFormat(attrib.format);
        descriptor.vertexDescriptor.attributes[i].offset = stride;
        //FIXME: because translated metal shader binds argument buffers from 0. So bind vertex buffer to max buffer index: 30.
        descriptor.vertexDescriptor.attributes[i].bufferIndex = 30;
        
        stride += GFX_FORMAT_INFOS[(int)attrib.format].size;
        ++i;
    }
    
    // layouts
    descriptor.vertexDescriptor.layouts[30].stride = stride;
    descriptor.vertexDescriptor.layouts[30].stepFunction = MTLVertexStepFunctionPerVertex;
    descriptor.vertexDescriptor.layouts[30].stepRate = 1;
}

void CCMTLPipelineState::setMTLFunctions(MTLRenderPipelineDescriptor* descriptor)
{
    descriptor.vertexFunction = ((CCMTLShader*)_shader)->getVertMTLFunction();
    descriptor.fragmentFunction = ((CCMTLShader*)_shader)->getFragmentMTLFunction();
}

void CCMTLPipelineState::setFormats(MTLRenderPipelineDescriptor* descriptor)
{
    int i = 0;
    MTLPixelFormat mtlPixelFormat;
    for (const auto& colorAttachment : _renderPass->getColorAttachments())
    {
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

void CCMTLPipelineState::setBlendStates(MTLRenderPipelineDescriptor* descriptor)
{
    //FIXME: how to handle these two attributes?
//    GFXBlendState::isIndepend
//    GFXBlendState::blendColor;
    
    descriptor.alphaToCoverageEnabled = _blendState.isA2C;
    
    int i = 0;
    for (const auto& blendTarget : _blendState.targets)
    {
        MTLRenderPipelineColorAttachmentDescriptor* colorDescriptor = descriptor.colorAttachments[i];
        colorDescriptor.blendingEnabled = blendTarget.blend;
        if (! blendTarget.blend)
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

bool CCMTLPipelineState::createMTLRenderPipeline(MTLRenderPipelineDescriptor* descriptor)
{
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)_device)->getMTLDevice() );
    MTLRenderPipelineReflection* reflection;
    NSError* nsError;
    _mtlRenderPipelineState = [mtlDevice newRenderPipelineStateWithDescriptor: descriptor
                                                                      options:MTLPipelineOptionBufferTypeInfo
                                                                   reflection:&reflection
                                                                        error:&nsError];
    if (!_mtlRenderPipelineState)
    {
        CC_LOG_ERROR("Failed to create MTLRenderPipelineState: %s", [nsError.localizedFailureReason UTF8String]);
        return false;;
    }
    
    bindLayout(reflection);
    
    return true;
}

void CCMTLPipelineState::bindLayout(MTLRenderPipelineReflection* reflection)
{
    // Use uniform names to match a uniform block.
    for (MTLArgument* mtlArgument in reflection.vertexArguments)
    {
        if (!mtlArgument.isActive)
            continue;
        
        if (mtlArgument.type == MTLArgumentTypeBuffer)
            bindBuffer(mtlArgument, true);
        if (mtlArgument.type == MTLArgumentTypeTexture ||
            mtlArgument.type == MTLArgumentTypeSampler)
        {
            bindTextureAndSampler(mtlArgument, true);
        }
    }
    
    for (MTLArgument* mtlArgument in reflection.fragmentArguments)
    {
        if (!mtlArgument.isActive)
            continue;
        
        if (mtlArgument.type == MTLArgumentTypeBuffer)
            bindBuffer(mtlArgument, false);
        
        if (mtlArgument.type == MTLArgumentTypeTexture ||
            mtlArgument.type == MTLArgumentTypeSampler)
        {
            bindTextureAndSampler(mtlArgument, false);
        }
    }
}

void CCMTLPipelineState::bindBuffer(MTLArgument* mtlArgument, bool isVertex)
{
    auto bindingInfo = getBufferBinding(mtlArgument);
    if (std::get<0>(bindingInfo) != UINT_MAX)
    {
        if (isVertex)
        {
            _vertexUniformBlocks.push_back({std::get<0>(bindingInfo),
                                            std::get<1>(bindingInfo),
                                            nullptr});
        }
        else
        {
            _fragmentUniformBlocks.push_back({std::get<0>(bindingInfo),
                                              std::get<1>(bindingInfo),
                                              nullptr});
        }
    }
}

std::tuple<uint,uint> CCMTLPipelineState::getBufferBinding(MTLArgument* argument) const
{
    CCASSERT(MTLDataTypeStruct == argument.bufferDataType, "Must be a struct!");
    for (MTLStructMember* member in argument.bufferStructType.members)
    {
        const char* memberName = [member.name UTF8String];
        for (const auto& block : _shader->getBlocks() )
        {
            for (const auto& uniform : block.uniforms)
            {
                if (std::strcmp(memberName, uniform.name.c_str()) == 0)
                    return std::make_tuple( (int)argument.index, block.binding);
            }
        }
    }
  
    return std::make_tuple(UINT_MAX, UINT_MAX);
}

void CCMTLPipelineState::bindTextureAndSampler(MTLArgument* argument, bool isVertex)
{
    if (!_layout)
        return;
    
    const char* argumentName = [argument.name UTF8String];
    for (auto bindingLayout : _layout->getLayouts() )
    {
        for (const auto& bindingUnit : bindingLayout->getBindingUnits() )
        {
            if (bindingUnit.sampler)
            {
                if (bindingUnit.name.compare(argumentName) == 0)
                    bindTexture(argument, bindingUnit.binding, isVertex);
                if (CCMTLPipelineState::matchSamplerName(argumentName, bindingUnit.name) )
                    bindSamplerState(argument, bindingUnit.binding, isVertex);
            }
        }
    }
}
                    
bool CCMTLPipelineState::matchSamplerName(const char* argumentName, const std::string& samplerName)
{
    std::string newName(samplerName);
    newName.append("Smplr");
    return (newName.compare(argumentName) == 0);
}

void CCMTLPipelineState::bindTexture(MTLArgument* argument, uint originBinding, bool isVertex)
{
    for (auto bindingLayout : _layout->getLayouts() )
    {
        for (const auto& bindingUnit : bindingLayout->getBindingUnits() )
        {
            if (bindingUnit.binding == originBinding)
            {
                if (isVertex)
                {
                    _vertexTextures.push_back({ (uint)argument.index,
                                                originBinding,
                                                bindingUnit.texView ? static_cast<CCMTLTextureView*>(bindingUnit.texView)->getMTLTexture()
                                                                     : nullptr
                    });
                }
                else
                {
                    _fragmentTextures.push_back({ (uint)argument.index,
                                                  originBinding,
                                                  bindingUnit.texView ? static_cast<CCMTLTextureView*>(bindingUnit.texView)->getMTLTexture()
                                                                       : nullptr
                    });
                }
            }
        }
    }
}

void CCMTLPipelineState::bindSamplerState(MTLArgument* argument, uint originBinding, bool isVertex)
{
    for (auto bindingLayout : _layout->getLayouts() )
    {
        for (const auto& bindingUnit : bindingLayout->getBindingUnits() )
        {
            if (bindingUnit.sampler && bindingUnit.binding == originBinding)
            {
                if (isVertex)
                {
                    _vertexSamplerStates.push_back({(uint)argument.index,
                                                    originBinding,
                                                    static_cast<CCMTLSampler*>(bindingUnit.sampler)->getMTLSamplerState()});
                }
                else
                {
                    _fragmentSamplerStates.push_back({(uint)argument.index,
                                                      originBinding,
                                                      static_cast<CCMTLSampler*>(bindingUnit.sampler)->getMTLSamplerState()});
                }
            }
        }
    }
}

NS_CC_END
