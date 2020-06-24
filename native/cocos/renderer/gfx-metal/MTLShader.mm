#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLShader.h"
#include "MTLUtils.h"
#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLShader::CCMTLShader(Device *device) : Shader(device) {}
CCMTLShader::~CCMTLShader() { destroy(); }

bool CCMTLShader::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    for (const auto &stage : _stages) {
        if (!createMTLFunction(stage)) {
            destroy();
            _status = Status::FAILED;
            return false;
        }
    }

    _status = Status::SUCCESS;
    CC_LOG_INFO("%s compile succeed.", _name.c_str());
    return true;
}

void CCMTLShader::destroy() {
    if (_vertexMTLFunction) {
        [_vertexMTLFunction release];
        _vertexMTLFunction = nil;
    }

    if (_fragmentMTLFunction) {
        [_fragmentMTLFunction release];
        _fragmentMTLFunction = nil;
    }

    _status = Status::UNREADY;
}

bool CCMTLShader::createMTLFunction(const ShaderStage &stage) {
    bool isVertexShader = stage.type == ShaderType::VERTEX;
    id<MTLDevice> mtlDevice = id<MTLDevice>(((CCMTLDevice *)_device)->getMTLDevice());
    auto mtlShader = mu::compileGLSLShader2Msl(stage.source,
                                               stage.type,
                                               static_cast<CCMTLDevice *>(_device)->getMaximumSamplerUnits(),
                                               isVertexShader ? _mtlVertexSamplerBindings : _mtlFragmentSamplerBindings);
    NSString *shader = [NSString stringWithUTF8String:mtlShader.c_str()];
    NSError *error = nil;
    id<MTLLibrary> library = [mtlDevice newLibraryWithSource:shader
                                                     options:nil
                                                       error:&error];
    if (!library) {
        CC_LOG_ERROR("Can not compile %s shader: %s", isVertexShader ? "vertex" : "fragment",
                     [error.localizedFailureReason UTF8String]);
        CC_LOG_ERROR("%s", stage.source.c_str());
        return false;
    }

    if (stage.type == ShaderType::VERTEX) {
        _vertexMTLFunction = [library newFunctionWithName:@"main0"];
        if (!_vertexMTLFunction) {
            [library release];
            CC_LOG_ERROR("Can not create vertex function: main0");
            return false;
        }
    } else {
        _fragmentMTLFunction = [library newFunctionWithName:@"main0"];
        if (!_fragmentMTLFunction) {
            [library release];
            CC_LOG_ERROR("Can not create fragment function: main0");
            return false;
        }
    }

    [library release];

#ifdef DEBUG_SHADER
    if (isVertexShader) {
        _vertGlslShader = stage.source;
        _vertMtlShader = mtlShader;
    } else {
        _fragGlslShader = stage.source;
        _fragMtlShader = mtlShader;
    }
#endif
    return true;
}

} // namespace gfx
} // namespace cc
