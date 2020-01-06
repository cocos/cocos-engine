#include "MTLStd.h"
#include "MTLPipelineState.h"
#include "MTLShader.h"
#include "MTLUtils.h"
#include "MTLDevice.h"
#include "MTLBuffer.h"
#include "MTLGPUObjects.h"

#import <Metal/MTLVertexDescriptor.h>
#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLPipelineState::CCMTLPipelineState(GFXDevice* device) : GFXPipelineState(device) {}
CCMTLPipelineState::~CCMTLPipelineState() { Destroy(); }

bool CCMTLPipelineState::Initialize(const GFXPipelineStateInfo& info)
{
    primitive_ = info.primitive;
    shader_ = info.shader;
    is_ = info.is;
    rs_ = info.rs;
    dss_ = info.dss;
    bs_ = info.bs;
    dynamic_states_ = info.dynamic_states;
    layout_ = info.layout;
    render_pass_ = info.render_pass;
    
    return  createGPUPipelineState();
}

void CCMTLPipelineState::Destroy()
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

void CCMTLPipelineState::bindBuffer(GFXBindingLayout* bl)
{
    if (!bl)
        return;
    
    for (const auto& bindingUnit : bl->binding_units() )
    {
        for (auto& block : _vertexUniformBlocks)
        {
            if (block.originBinding == bindingUnit.binding)
            {
                block.buffer = static_cast<CCMTLBuffer*>(bindingUnit.buffer)->getMTLBuffer();
                break;
            }
        }
        
        for (auto& block : _fragmentUniformBlocks)
        {
            if (block.originBinding == bindingUnit.binding)
            {
                block.buffer = static_cast<CCMTLBuffer*>(bindingUnit.buffer)->getMTLBuffer();
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
    _GPUPipelieState->cullMode = mu::toMTLCullMode(rs_.cull_mode);
    _GPUPipelieState->fillMode = mu::toMTLTriangleFillMode(rs_.polygon_mode);
    _GPUPipelieState->depthClipMode = mu::toMTLDepthClipMode(rs_.is_depth_clip);
    _GPUPipelieState->winding = mu::toMTLWinding(rs_.is_front_face_ccw);
    _GPUPipelieState->stencilRefFront = dss_.stencil_ref_front;
    _GPUPipelieState->stencilRefBack = dss_.stencil_ref_back;
    _GPUPipelieState->primitiveType = mu::toMTLPrimitiveType(primitive_);
    _GPUPipelieState->vertexUniformBlocks = &_vertexUniformBlocks;
    _GPUPipelieState->fragmentUniformBlocks = &_fragmentUniformBlocks;
    
    return true;
}

void CCMTLPipelineState::createMTLDepthStencilState()
{
    if (!dss_.depth_test &&
        !dss_.depth_write &&
        !dss_.stencil_test_front &&
        !dss_.stencil_ref_back)
    {
        return;
    }
    
    MTLDepthStencilDescriptor* descriptor = [[MTLDepthStencilDescriptor alloc] init];
    descriptor.depthWriteEnabled = dss_.depth_write;
    
    if (!dss_.depth_test)
        descriptor.depthCompareFunction = MTLCompareFunctionAlways;
    else
        descriptor.depthCompareFunction = mu::toMTLCompareFunction(dss_.depth_func);
    
    if (dss_.stencil_test_front)
    {
        descriptor.frontFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(dss_.stencil_func_front);
        descriptor.frontFaceStencil.readMask = dss_.stencil_read_mask_front;
        descriptor.frontFaceStencil.writeMask = dss_.stencil_write_mask_front;
        descriptor.frontFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(dss_.stencil_fail_op_front);
        descriptor.frontFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(dss_.stencil_z_fail_op_front);
        descriptor.frontFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(dss_.stencil_pass_op_front);
    }
    
    if (dss_.stencil_test_back)
    {
        descriptor.backFaceStencil.stencilCompareFunction = mu::toMTLCompareFunction(dss_.stencil_func_back);
        descriptor.backFaceStencil.readMask = dss_.stencil_read_mask_back;
        descriptor.backFaceStencil.writeMask = dss_.stencil_write_mask_back;
        descriptor.backFaceStencil.stencilFailureOperation = mu::toMTLStencilOperation(dss_.stencil_fail_op_back);
        descriptor.backFaceStencil.depthFailureOperation = mu::toMTLStencilOperation(dss_.stencil_z_fail_op_back);
        descriptor.backFaceStencil.depthStencilPassOperation = mu::toMTLStencilOperation(dss_.stencil_pass_op_back);
    }
    
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)device_)->getMTLDevice() );
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
    for (const auto& attrib : is_.attributes)
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
    descriptor.vertexFunction = ((CCMTLShader*)shader_)->getVertMTLFunction();
    descriptor.fragmentFunction = ((CCMTLShader*)shader_)->getFragmentMTLFunction();
}

void CCMTLPipelineState::setFormats(MTLRenderPipelineDescriptor* descriptor)
{
    int i = 0;
    MTLPixelFormat mtlPixelFormat;
    for (const auto& colorAttachment : render_pass_->color_attachments())
    {
        mtlPixelFormat = mu::toMTLPixelFormat(colorAttachment.format);
        if (mtlPixelFormat != MTLPixelFormatInvalid)
            descriptor.colorAttachments[i].pixelFormat = mtlPixelFormat;
        
        ++i;
    }
    
    //TODO: it is hack here.
    descriptor.colorAttachments[0].pixelFormat = MTLPixelFormatBGRA8Unorm;
    
    mtlPixelFormat = mu::toMTLPixelFormat(render_pass_->depth_stencil_attachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.depthAttachmentPixelFormat = mtlPixelFormat;
    
    mtlPixelFormat = mu::toMTLPixelFormat(render_pass_->depth_stencil_attachment().format);
    if (mtlPixelFormat != MTLPixelFormatInvalid)
        descriptor.stencilAttachmentPixelFormat = mtlPixelFormat;
}

void CCMTLPipelineState::setBlendStates(MTLRenderPipelineDescriptor* descriptor)
{
    //FIXME: how to handle these two attributes?
//    GFXBlendState::is_independ
//    GFXBlendState::blend_color;
    
    descriptor.alphaToCoverageEnabled = bs_.is_a2c;
    
    int i = 0;
    for (const auto& blendTarget : bs_.targets)
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
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)device_)->getMTLDevice() );
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
    
    bindBuffer(reflection);
    
    return true;
}

void CCMTLPipelineState::bindBuffer(MTLRenderPipelineReflection* reflection)
{
    // Use uniform names to match a uniform block.
    for (MTLArgument* mtlArgument in reflection.vertexArguments)
    {
        if (!mtlArgument.isActive ||
            mtlArgument.type != MTLArgumentTypeBuffer)
        {
            continue;
        }
        
        auto bindingInfo = getBufferbinding(mtlArgument);
        if (std::get<0>(bindingInfo) != UINT_MAX)
        {
            _vertexUniformBlocks.push_back({std::get<0>(bindingInfo),
                                            std::get<1>(bindingInfo),
                                            nullptr});
        }
    }
    
    for (MTLArgument* mtlArgument in reflection.fragmentArguments)
    {
        if (!mtlArgument.isActive ||
            mtlArgument.type != MTLArgumentTypeBuffer)
        {
            continue;
        }
        
        auto bindingInfo = getBufferbinding(mtlArgument);
        if (std::get<0>(bindingInfo) != UINT_MAX)
        {
                _fragmentUniformBlocks.push_back({std::get<0>(bindingInfo),
                                                   std::get<1>(bindingInfo),
                                                   nullptr});
        }
    }
}

std::tuple<uint, uint> CCMTLPipelineState::getBufferbinding(MTLArgument* argument) const
{
    for (MTLStructMember* member in argument.bufferStructType.members)
    {
        const char* argumentName = [member.name UTF8String];
        for (const auto& block : shader_->blocks() )
        {
            for (const auto& uniform : block.uniforms)
            {
                if (std::strcmp(argumentName, uniform.name.c_str()) == 0)
                    return std::make_tuple( (int)argument.index, block.binding);
            }
        }
    }
                    
    return std::make_tuple(UINT_MAX, UINT_MAX);
}

NS_CC_END
