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
    
    if(!createGPUPipelineState())
    {
        _status = GFXStatus::FAILED;
        return false;
    }
    _status = GFXStatus::SUCCESS;
    return true;
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
    _status = GFXStatus::UNREADY;
}

bool CCMTLPipelineState::createGPUPipelineState()
{
    _GPUPipelieState = CC_NEW(CCMTLGPUPipelineState);
    if (!_GPUPipelieState)
    {
        CC_LOG_ERROR("CCMTLPipelineState: CC_NEW CCMTLGPUPipelineState failed.");
        return false;
    }
    
    if (!createMTLRenderPipelineState() ) return false;
    
    // Application can run with wrong depth/stencil state.
    if(!createMTLDepthStencilState()) return false;

    _GPUPipelieState->mtlDepthStencilState = _mtlDepthStencilState;
    _GPUPipelieState->mtlRenderPipelineState = _mtlRenderPipelineState;
    _GPUPipelieState->cullMode = mu::toMTLCullMode(_rasterizerState.cullMode);
    _GPUPipelieState->fillMode = mu::toMTLTriangleFillMode(_rasterizerState.polygonMode);
    _GPUPipelieState->depthClipMode = mu::toMTLDepthClipMode(_rasterizerState.isDepthClip);
    _GPUPipelieState->winding = mu::toMTLWinding(_rasterizerState.isFrontFaceCCW);
    _GPUPipelieState->stencilRefFront = _depthStencilState.stencilRefFront;
    _GPUPipelieState->stencilRefBack = _depthStencilState.stencilRefBack;
    _GPUPipelieState->primitiveType = mu::toMTLPrimitiveType(_primitive);
        
    return true;
}

bool CCMTLPipelineState::createMTLDepthStencilState()
{
    MTLDepthStencilDescriptor* descriptor = [[MTLDepthStencilDescriptor alloc] init];
    if(descriptor == nil)
    {
        CC_LOG_ERROR("CCMTLPipelineState: MTLDepthStencilDescriptor could not be allocated.");
        return false;
    }

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
        descriptor.frontFaceStencil = nil;
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
        descriptor.backFaceStencil = nil;
    }
    
    id<MTLDevice> mtlDevice = id<MTLDevice>( ((CCMTLDevice*)_device)->getMTLDevice() );
    _mtlDepthStencilState = [mtlDevice newDepthStencilStateWithDescriptor:descriptor];
    
    if (!_mtlDepthStencilState)
    {
        CC_LOG_ERROR("Failed to create MTLDepthStencilState.");
        return false;
    }
    return true;
}

bool CCMTLPipelineState::createMTLRenderPipelineState()
{
    bool ret = true;
    MTLRenderPipelineDescriptor* descriptor = [[MTLRenderPipelineDescriptor alloc] init];
    if(descriptor == nil)
    {
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

void CCMTLPipelineState::setVertexDescriptor(MTLRenderPipelineDescriptor* descriptor)
{
    // attributes

    auto mtlAttributes = static_cast<CCMTLShader*>(_shader)->getVertMTLFunction().vertexAttributes;
    if (mtlAttributes == nil)
        return;
    
    std::vector<std::tuple<int /**vertexBufferBindingIndex*/, uint /**stream*/>> layouts;
    std::unordered_map<int /**vertexBufferBindingIndex*/, std::tuple<uint /**stride*/, bool /**isInstanced*/>> map;
    const uint DEFAULT_VERTEX_BUFFER_INDEX = 30;
    uint streamOffsets[GFX_MAX_VERTEX_ATTRIBUTES] = {0};
    bool matched = false;
    for (MTLVertexAttribute* attrib in mtlAttributes)
    {
        auto attributeIndex = attrib.attributeIndex;
        matched = false;
        for (const auto& inputAttrib : _inputState.attributes)
        {
            if (inputAttrib.name.compare([attrib.name UTF8String]) == 0)
            {
                descriptor.vertexDescriptor.attributes[attributeIndex].format = mu::toMTLVertexFormat(inputAttrib.format, inputAttrib.isNormalized);
                descriptor.vertexDescriptor.attributes[attributeIndex].offset = streamOffsets[inputAttrib.stream];
                //FIXME: because translated metal shader binds argument buffers from 0. So bind vertex buffer to max buffer index: 30.
                auto bufferIndex = DEFAULT_VERTEX_BUFFER_INDEX - inputAttrib.stream;
                descriptor.vertexDescriptor.attributes[attributeIndex].bufferIndex = bufferIndex;
                
                streamOffsets[inputAttrib.stream] += GFX_FORMAT_INFOS[(int)inputAttrib.format].size;
                auto tuple = std::make_tuple(bufferIndex, inputAttrib.stream);
                if(std::find(layouts.begin(), layouts.end(), tuple) == layouts.end())
                    layouts.emplace_back(tuple);
                map[bufferIndex] = std::make_tuple(streamOffsets[inputAttrib.stream], inputAttrib.isInstanced);
                matched = true;
                break;
            }
        }
        if (!matched)
        {
            CC_LOG_ERROR("Attribute %s is missing.", [attrib.name UTF8String]);
            assert(false);
        }
    }
    
    // layouts
    for (const auto& layout : layouts) {
        auto index = std::get<0>(layout);
        descriptor.vertexDescriptor.layouts[index].stride = std::get<0>(map[index]);
        descriptor.vertexDescriptor.layouts[index].stepFunction = std::get<1>(map[index]) ? MTLVertexStepFunctionPerInstance : MTLVertexStepFunctionPerVertex;
        descriptor.vertexDescriptor.layouts[index].stepRate = 1;
    }
    _GPUPipelieState->vertexBufferBindingInfo = std::move(layouts);
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
    NSError* nsError;
    _mtlRenderPipelineState = [mtlDevice newRenderPipelineStateWithDescriptor: descriptor error:&nsError];
    if (!_mtlRenderPipelineState)
    {
        CC_LOG_ERROR("Failed to create MTLRenderPipelineState: %s", [nsError.localizedDescription UTF8String]);
        return false;;
    }

    return true;
}

NS_CC_END
