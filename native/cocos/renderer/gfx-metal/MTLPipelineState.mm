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
    _is = info.is;
    _rs = info.rs;
    _dss = info.dss;
    _bs = info.bs;
    _dynamicStates = info.dynamic_states;
    layout_ = info.layout;
    _renderPass = info.render_pass;
    
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
    
    for (const auto& bindingUnit : bl->bindingUnits() )
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
            if (block.originBinding == bindingUnit.binding && bindingUnit.tex_view)
            {
                block.texture = static_cast<CCMTLTextureView*>(bindingUnit.tex_view)->getMTLTexture();
                break;
            }
        }
        
        for (auto& block : _fragmentTextures)
        {
            if (block.originBinding == bindingUnit.binding && bindingUnit.tex_view)
            {
                block.texture = static_cast<CCMTLTextureView*>(bindingUnit.tex_view)->getMTLTexture();
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
    _GPUPipelieState->cullMode = mu::toMTLCullMode(_rs.cull_mode);
    _GPUPipelieState->fillMode = mu::toMTLTriangleFillMode(_rs.polygon_mode);
    _GPUPipelieState->depthClipMode = mu::toMTLDepthClipMode(_rs.is_depth_clip);
    _GPUPipelieState->winding = mu::toMTLWinding(_rs.is_front_face_ccw);
    _GPUPipelieState->stencilRefFront = _dss.stencil_ref_front;
    _GPUPipelieState->stencilRefBack = _dss.stencil_ref_back;
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
    if (!_dss.depth_test &&
        !_dss.depth_write &&
        !_dss.stencil_test_front &&
        !_dss.stencil_test_back)
    {
        return;
    }
    
    MTLDepthStencilDescriptor* descriptor = [[MTLDepthStencilDescriptor alloc] init];
    descriptor.depthWriteEnabled = _dss.depth_write;
    
    if (!_dss.depth_test)
        descriptor.depthCompareFunction = MTLCompareFunctionAlways;
    else
        descriptor.depthCompareFunction = mu::toMTLCompareFunction(_dss.depth_func);
    
    if (_dss.stencil_test_front)
    {
        descriptor.frontFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_dss.stencil_func_front);
        descriptor.frontFaceStencil.readMask = _dss.stencil_read_mask_front;
        descriptor.frontFaceStencil.writeMask = _dss.stencil_write_mask_front;
        descriptor.frontFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_dss.stencil_fail_op_front);
        descriptor.frontFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_dss.stencil_z_fail_op_front);
        descriptor.frontFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_dss.stencil_pass_op_front);
    }
    else
    {
        descriptor.frontFaceStencil.stencilCompareFunction = MTLCompareFunctionAlways;
        descriptor.frontFaceStencil.readMask = _dss.stencil_read_mask_front;
        descriptor.frontFaceStencil.writeMask = _dss.stencil_write_mask_front;
        descriptor.frontFaceStencil.stencilFailureOperation = MTLStencilOperationKeep;
        descriptor.frontFaceStencil.depthFailureOperation = MTLStencilOperationKeep;
        descriptor.frontFaceStencil.depthStencilPassOperation = MTLStencilOperationKeep;
    }
    
    if (_dss.stencil_test_back)
    {
        descriptor.backFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(_dss.stencil_func_back);
        descriptor.backFaceStencil.readMask = _dss.stencil_read_mask_back;
        descriptor.backFaceStencil.writeMask = _dss.stencil_write_mask_back;
        descriptor.backFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(_dss.stencil_fail_op_back);
        descriptor.backFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(_dss.stencil_z_fail_op_back);
        descriptor.backFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(_dss.stencil_pass_op_back);
    }
    else
    {
        descriptor.backFaceStencil.stencilCompareFunction = MTLCompareFunctionAlways;
        descriptor.backFaceStencil.readMask = _dss.stencil_read_mask_back;
        descriptor.backFaceStencil.writeMask = _dss.stencil_write_mask_back;
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
    uint streamOffsets[GFX_MAX_VERTEX_ATTRIBUTES] = {0};
    int i = 0;
    uint stride = 0;
    for (const auto& attrib : _is.attributes)
    {
        descriptor.vertexDescriptor.attributes[i].format = mu::toMTLVertexFormat(attrib.format);
        descriptor.vertexDescriptor.attributes[i].offset = streamOffsets[i];
        //FIXME: because translated metal shader binds argument buffers from 0. So bind vertex buffer to max buffer index: 30.
        descriptor.vertexDescriptor.attributes[i].bufferIndex = 30;
        
        streamOffsets[i] += GFX_FORMAT_INFOS[(int)attrib.format].size;
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
    for (const auto& colorAttachment : _renderPass->colorAttachments())
    {
        mtlPixelFormat = mu::toMTLPixelFormat(colorAttachment.format);
        if (mtlPixelFormat != MTLPixelFormatInvalid)
            descriptor.colorAttachments[i].pixelFormat = mtlPixelFormat;
        
        ++i;
    }
    
    mtlPixelFormat = mu::toMTLPixelFormat(_renderPass->depthStencilAttachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.depthAttachmentPixelFormat = mtlPixelFormat;
    
    mtlPixelFormat = mu::toMTLPixelFormat(_renderPass->depthStencilAttachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.stencilAttachmentPixelFormat = mtlPixelFormat;
}

void CCMTLPipelineState::setBlendStates(MTLRenderPipelineDescriptor* descriptor)
{
    //FIXME: how to handle these two attributes?
//    GFXBlendState::is_independ
//    GFXBlendState::blend_color;
    
    descriptor.alphaToCoverageEnabled = _bs.is_a2c;
    
    int i = 0;
    for (const auto& blendTarget : _bs.targets)
    {
        MTLRenderPipelineColorAttachmentDescriptor* colorDescriptor = descriptor.colorAttachments[i];
        colorDescriptor.blendingEnabled = blendTarget.is_blend;
        if (! blendTarget.is_blend)
            continue;
        
        colorDescriptor.writeMask = mu::toMTLColorWriteMask(blendTarget.blend_color_mask);
        colorDescriptor.sourceRGBBlendFactor = mu::toMTLBlendFactor(blendTarget.blend_src);
        colorDescriptor.destinationRGBBlendFactor = mu::toMTLBlendFactor(blendTarget.blend_dst);
        colorDescriptor.rgbBlendOperation = mu::toMTLBlendOperation(blendTarget.blend_eq);
        colorDescriptor.sourceAlphaBlendFactor = mu::toMTLBlendFactor(blendTarget.blend_src_alpha);
        colorDescriptor.destinationAlphaBlendFactor = mu::toMTLBlendFactor(blendTarget.blend_dst_alpha);
        colorDescriptor.alphaBlendOperation = mu::toMTLBlendOperation(blendTarget.blend_alpha_eq);
        
        ++i;
    }
}

bool CCMTLPipelineState::createMTLRenderPipeline(MTLRenderPipelineDescriptor* descriptor)
{
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)_device)->getMTLDevice() );
    MTLRenderPipelineReflection* reflection;
    NSError* nsError;
    _mtlRenderPipelineState = [mtlDevice newRenderPipelineStateWithDescriptor: descriptor
                                                                      options:MTLPipelineOptionArgumentInfo
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
    for (MTLStructMember* member in argument.bufferStructType.members)
    {
        const char* memberName = [member.name UTF8String];
        for (const auto& block : _shader->blocks() )
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
    if (!layout_)
        return;
    
    const char* argumentName = [argument.name UTF8String];
    for (auto bindingLayout : layout_->layouts() )
    {
        for (const auto& bindingUnit : bindingLayout->bindingUnits() )
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
    for (auto bindingLayout : layout_->layouts() )
    {
        for (const auto& bindingUnit : bindingLayout->bindingUnits() )
        {
            if (bindingUnit.binding == originBinding)
            {
                if (isVertex)
                {
                    _vertexTextures.push_back({ (uint)argument.index,
                                                originBinding,
                                                bindingUnit.tex_view ? static_cast<CCMTLTextureView*>(bindingUnit.tex_view)->getMTLTexture()
                                                                     : nullptr
                    });
                }
                else
                {
                    _fragmentTextures.push_back({ (uint)argument.index,
                                                  originBinding,
                                                  bindingUnit.tex_view ? static_cast<CCMTLTextureView*>(bindingUnit.tex_view)->getMTLTexture()
                                                                       : nullptr
                    });
                }
            }
        }
    }
}

void CCMTLPipelineState::bindSamplerState(MTLArgument* argument, uint originBinding, bool isVertex)
{
    for (auto bindingLayout : layout_->layouts() )
    {
        for (const auto& bindingUnit : bindingLayout->bindingUnits() )
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
