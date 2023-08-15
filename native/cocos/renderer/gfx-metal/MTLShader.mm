/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#import "MTLDevice.h"
#import "MTLGPUObjects.h"
#import "MTLShader.h"
#import "MTLRenderPass.h"
#import <Metal/MTLDevice.h>
#import "gfx-base/SPIRVUtils.h"
#include "base/Log.h"

namespace cc {
namespace gfx {

SPIRVUtils* CCMTLShader::spirv = nullptr;

CCMTLShader::CCMTLShader() : Shader() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLShader::~CCMTLShader() {
    destroy();
}

const CCMTLGPUShader *CCMTLShader::gpuShader(CCMTLRenderPass *renderPass, uint32_t subPass)
{
    if (_gpuShader != nullptr) {
        return _gpuShader;
    }
    _gpuShader = ccnew CCMTLGPUShader;
    for (const auto& stage : _stages) {
        if (!createMTLFunction(stage, renderPass, subPass)) {
            destroy();
            return nullptr;
        }
    }

    setAvailableBufferBindingIndex();

    CC_LOG_INFO("%s compile succeed.", _name.c_str());

    // Clear shader source after they're uploaded to GPU
    for (auto &stage : _stages) {
        stage.source.clear();
        stage.source.shrink_to_fit();
    }
    return _gpuShader;
}

void CCMTLShader::doInit(const ShaderInfo& info) {
    _specializedFragFuncs = [[NSMutableDictionary alloc] init];
    // spirv-cross for input attachment needs RenderPass to build [[color(index)]],
    // build gpu shader only when there is no subPass input.
//    if (!checkInputAttachment(info)) {
//        gpuShader(nullptr, 0);
//    }
}

void CCMTLShader::doDestroy() {
    id<MTLLibrary> vertLib = _vertLibrary;
    _vertLibrary = nil;
    id<MTLLibrary> fragLib = _fragLibrary;
    _fragLibrary = nil;
    id<MTLLibrary> cmptLib = _cmptLibrary;
    _cmptLibrary = nil;

    id<MTLFunction> vertFunc = _vertFunction;
    _vertFunction = nil;
    id<MTLFunction> fragFunc = _fragFunction;
    _fragFunction = nil;
    id<MTLFunction> cmptFunc = _cmptFunction;
    _cmptFunction = nil;

    if (_gpuShader) {
        [_gpuShader->shaderSrc release];
        CC_SAFE_DELETE(_gpuShader);
    }

    // [_specializedFragFuncs release];
    NSMutableDictionary<NSString*, id<MTLFunction>>* specFragFuncs = nil;
    if (_specializedFragFuncs) {
        specFragFuncs = _specializedFragFuncs;
        _specializedFragFuncs = nil;
    }

    std::function<void(void)> destroyFunc = [=]() {
        if ([specFragFuncs count] > 0) {
            for (NSString* key in [specFragFuncs allKeys]) {
                [[specFragFuncs valueForKey:key] release];
            }
        }
        [specFragFuncs release];

        if (vertFunc) {
            [vertFunc release];
        }
        if (fragFunc) {
            [fragFunc release];
        }
        if (cmptFunc) {
            [cmptFunc release];
        }

        if (vertLib) {
            [vertLib release];
        }
        if (fragLib) {
            [fragLib release];
        }
        if (cmptLib) {
            [cmptLib release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

bool CCMTLShader::checkInputAttachment(const ShaderInfo& info) const {
    return !info.subpassInputs.empty();
}

bool CCMTLShader::createMTLFunction(const ShaderStage& stage, CCMTLRenderPass *renderPass, uint32_t subPass) {
    bool isVertexShader = false;
    bool isFragmentShader = false;
    bool isComputeShader = false;

    if (stage.stage == ShaderStageFlagBit::VERTEX) {
        isVertexShader = true;
    } else if (stage.stage == ShaderStageFlagBit::FRAGMENT) {
        isFragmentShader = true;
    } else if (stage.stage == ShaderStageFlagBit::COMPUTE) {
        isComputeShader = true;
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    if (!spirv) {
        spirv = SPIRVUtils::getInstance();
        spirv->initialize(2); // vulkan >= 1.2  spirv >= 1.5
    }

    spirv->compileGLSL(stage.stage, "#version 450\n#define CC_USE_METAL 1\n" + stage.source);
    if (stage.stage == ShaderStageFlagBit::VERTEX) spirv->compressInputLocations(_attributes);

    auto* spvData = spirv->getOutputData();
    size_t unitSize = sizeof(std::remove_pointer<decltype(spvData)>::type);

    static const ccstd::vector<uint32_t> emptyBuffer;
    const auto &drawBuffer = renderPass != nullptr ? renderPass->getDrawBuffer(subPass) : emptyBuffer;
    const auto &readBuffer = renderPass != nullptr ? renderPass->getReadBuffer(subPass) : emptyBuffer;
    ccstd::string mtlShaderSrc = mu::spirv2MSL(spirv->getOutputData(), spirv->getOutputSize() / unitSize, stage.stage,
        _gpuShader, renderPass, subPass);

    NSString* shader = [NSString stringWithUTF8String:mtlShaderSrc.c_str()];
    NSError* error = nil;
    MTLCompileOptions* opts = [[MTLCompileOptions alloc] init];
    //opts.languageVersion = MTLLanguageVersion2_3;
    id<MTLLibrary>& library = isVertexShader ? _vertLibrary : isFragmentShader ? _fragLibrary : _cmptLibrary;
    ccstd::string shaderStage = isVertexShader ? "vertex" : isFragmentShader ? "fragment" : "compute";

    if (isFragmentShader) {
        if (@available(iOS 11.0, *)) {
            library = [mtlDevice newLibraryWithSource:shader options:opts error:&error];
            if (!library) {
                CC_LOG_ERROR("Can not compile %s shader: %s", shaderStage.c_str(), [[error localizedDescription] UTF8String]);
                CC_LOG_ERROR("%s", stage.source.c_str());
                [opts release];
                return false;
            }
        } else {
            //delayed instance and pretend tobe specialized function.
            _gpuShader->specializeColor = false;
            _gpuShader->shaderSrc = [shader retain];
            [opts release];
            CC_ASSERT(_gpuShader->shaderSrc != nil);
            return true;
        }
    } else {
        library = [mtlDevice newLibraryWithSource:shader options:opts error:&error];
        if (!library) {
            CC_LOG_ERROR("Can not compile %s shader: %s", shaderStage.c_str(), [[error localizedDescription] UTF8String]);
            CC_LOG_ERROR("%s", stage.source.c_str());
            [opts release];
            return false;
        }
    }

    [opts release];

    if (isVertexShader) {
        _vertFunction = [library newFunctionWithName:@"main0"];
        if (!_vertFunction) {
            [library release];
            CC_LOG_ERROR("Can not create vertex function: main0");
            return false;
        }
    } else if (isFragmentShader) {
        _fragFunction = [library newFunctionWithName:@"main0"];
        if (!_fragFunction) {
            [library release];
            CC_LOG_ERROR("Can not create fragment function: main0");
            return false;
        }
    } else if (isComputeShader) {
        _cmptFunction = [library newFunctionWithName:@"main0"];
        if (!_cmptFunction) {
            [library release];
            CC_LOG_ERROR("Can not create compute function: main0");
            return false;
        }
    } else {
        [library release];
        CC_LOG_ERROR("Shader type not supported yet!");
        return false;
    }

#ifdef DEBUG_SHADER
    if (isVertexShader) {
        _vertGlslShader = stage.source;
        _vertMtlShader = mtlShader;
    } else if (isFragmenShader) {
        _fragGlslShader = stage.source;
        _fragMtlShader = mtlShader;
    } else if (isComputeShader) {
        _cmptGlslShader = stage.source;
        _cmptMtlShader = mtlShader;
    }
#endif
    return true;
}

id<MTLFunction> CCMTLShader::getSpecializedFragFunction(uint32_t* index, int* val, uint32_t count) {
    uint32_t notEvenHash = 0;
    for (size_t i = 0; i < count; i++) {
        notEvenHash += val[i] * std::pow(10, index[i]);
    }
    NSString* hashStr = [NSString stringWithFormat:@"%d", notEvenHash];
    id<MTLFunction> specFunc = [_specializedFragFuncs objectForKey:hashStr];

    if (!specFunc) {
        if (_gpuShader->specializeColor) {
            MTLFunctionConstantValues* constantValues = [MTLFunctionConstantValues new];
            for (size_t i = 0; i < count; i++) {
                [constantValues setConstantValue:&val[i] type:MTLDataTypeInt atIndex:index[i]];
            }

            NSError* error = nil;
            id<MTLFunction> specFragFunc = [_fragLibrary newFunctionWithName:@"main0" constantValues:constantValues error:&error];
            [constantValues release];
            if (!specFragFunc) {
                CC_LOG_ERROR("Can not specialize shader: %s", [[error localizedDescription] UTF8String]);
            }
            [_specializedFragFuncs setObject:specFragFunc forKey:hashStr];
        } else {
            NSString* res = nil;
            for (size_t i = 0; i < count; i++) {
                NSString* targetStr = [NSString stringWithFormat:@"(indexOffset%u)", static_cast<unsigned int>(i)];
                NSString* index = [NSString stringWithFormat:@"(%u)", static_cast<unsigned int>(i)];
                res = [_gpuShader->shaderSrc stringByReplacingOccurrencesOfString:targetStr withString:index];
            }
            id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
            NSError* error = nil;
            MTLCompileOptions* opts = [[MTLCompileOptions alloc] init];
            // always current
            if (_fragLibrary) {
                [_fragLibrary release];
            }
            _fragLibrary = [mtlDevice newLibraryWithSource:res options:opts error:&error];
            if (!_fragLibrary) {
                CC_LOG_ERROR("Can not compile frag shader: %s", [[error localizedDescription] UTF8String]);
            }
            [opts release];
            _fragFunction = [_fragLibrary newFunctionWithName:@"main0"];
            if (!_fragFunction) {
                [_fragLibrary release];
                CC_LOG_ERROR("Can not create fragment function: main0");
            }

            [_specializedFragFuncs setObject:_fragFunction forKey:hashStr];
        }
    }
    return [_specializedFragFuncs valueForKey:hashStr];
}

uint32_t CCMTLShader::getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint32_t stream) {
    if (hasFlag(stage, ShaderStageFlagBit::VERTEX)) {
        return _availableVertexBufferBindingIndex.at(stream);
    }

    if (hasFlag(stage, ShaderStageFlagBit::FRAGMENT)) {
        return _availableFragmentBufferBindingIndex.at(stream);
    }

    CC_LOG_ERROR("getAvailableBufferBindingIndex: invalid shader stage %d", stage);
    return 0;
}

void CCMTLShader::setAvailableBufferBindingIndex() {
    uint32_t usedVertexBufferBindingIndexes = 0;
    uint32_t usedFragmentBufferBindingIndexes = 0;
    uint32_t vertexBindingCount = 0;
    uint32_t fragmentBindingCount = 0;
    for (const auto& block : _gpuShader->blocks) {
        if (hasFlag(block.second.stages, ShaderStageFlagBit::VERTEX)) {
            vertexBindingCount++;
            usedVertexBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
        if (hasFlag(block.second.stages, ShaderStageFlagBit::FRAGMENT)) {
            fragmentBindingCount++;
            usedFragmentBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
    }

    auto maxBufferBindingIndex = CCMTLDevice::getInstance()->getMaximumBufferBindingIndex();
    _availableVertexBufferBindingIndex.resize(maxBufferBindingIndex - vertexBindingCount);
    _availableFragmentBufferBindingIndex.resize(maxBufferBindingIndex - fragmentBindingCount);
    uint32_t availableVertexBufferBit = ~usedVertexBufferBindingIndexes;
    uint32_t availableFragmentBufferBit = ~usedFragmentBufferBindingIndexes;
    int theBit = maxBufferBindingIndex - 1;
    uint32_t i = 0, j = 0;
    for (; theBit >= 0; theBit--) {
        if ((availableVertexBufferBit & (1 << theBit))) {
            _availableVertexBufferBindingIndex[i++] = theBit;
        }

        if ((availableFragmentBufferBit & (1 << theBit))) {
            _availableFragmentBufferBindingIndex[j++] = theBit;
        }
    }
}

} // namespace gfx
} // namespace cc
