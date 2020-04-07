#include "MTLStd.h"
#include "MTLShader.h"
#include "MTLDevice.h"
#include "MTLUtils.h"
#import <Metal/MTLDevice.h>

NS_CC_BEGIN

CCMTLShader::CCMTLShader(GFXDevice* device) : GFXShader(device) {}
CCMTLShader::~CCMTLShader() { destroy(); }

bool CCMTLShader::initialize(const GFXShaderInfo& info)
{
    _name = info.name;
    _stages = info.stages;
    _blocks = info.blocks;
    _samplers = info.samplers;
    
    for (const auto& stage : _stages)
    {
        if (! createMTLFunction(stage) )
        {
            destroy();
            return false;
        }
    }
    
    _status = GFXStatus::SUCCESS;
        
    return true;
}

void CCMTLShader::destroy()
{
    if (_vertexMTLFunction)
    {
        [_vertexMTLFunction release];
        _vertexMTLFunction = nil;
    }
    
    if (_fragmentMTLFunction)
    {
        [_fragmentMTLFunction release];
        _fragmentMTLFunction = nil;
    }
    
    _status = GFXStatus::UNREADY;
}

bool CCMTLShader::createMTLFunction(const GFXShaderStage& stage)
{
    bool isVertexShader = stage.type == GFXShaderType::VERTEX;
    id<MTLDevice> mtlDevice = id<MTLDevice>(((CCMTLDevice*)_device)->getMTLDevice());
    auto mtlShader = mu::compileGLSLShader2Mtl(stage.source, isVertexShader);
    NSString* shader = [NSString stringWithUTF8String:mtlShader.c_str()];
    NSError* error;
    id<MTLLibrary> library = [mtlDevice newLibraryWithSource:shader
                                                     options:nil
                                                       error:&error];
    if (!library)
    {
        CC_LOG_ERROR("Can not compile %s shader: %s", isVertexShader ? "vertex" : "fragment",
                                                      [error.localizedFailureReason UTF8String]);
        CC_LOG_ERROR("%s", stage.source.c_str());
        return false;
    }
    
    if (stage.type == GFXShaderType::VERTEX)
    {
        _vertexMTLFunction = [library newFunctionWithName:@"main0"];
        if (!_vertexMTLFunction)
        {
            [library release];
            CC_LOG_ERROR("Can not create vertex function: main0");
            return false;
        }
    }
    else
    {
        _fragmentMTLFunction = [library newFunctionWithName:@"main0"];
        if (!_fragmentMTLFunction)
        {
            [library release];
            CC_LOG_ERROR("Can not create fragment function: main0");
            return false;
        }
    }
    
    [library release];
    
#ifdef DEBUG_SHADER
    if (isVertexShader)
    {
        _vertGlslShader = stage.source;
        _vertMtlShader = mtlShader;
    }
    else
    {
        _fragGlslShader = stage.source;
        _fragMtlShader = mtlShader;
    }
#endif
    
    return true;
}

NS_CC_END
