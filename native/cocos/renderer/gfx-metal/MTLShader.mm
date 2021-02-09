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
#include "MTLShader.h"
#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLShader::CCMTLShader(Device *device) : Shader(device) {}

bool CCMTLShader::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    _gpuShader = CC_NEW(CCMTLGPUShader);

    for (const auto &stage : _stages) {
        if (!createMTLFunction(stage)) {
            destroy();
            return false;
        }
    }

    setAvailableBufferBindingIndex();

    CC_LOG_INFO("%s compile succeed.", _name.c_str());
    return true;
}

void CCMTLShader::destroy() {
    id<MTLFunction> vertFunc = _vertexMTLFunction;
    _vertexMTLFunction = nil;
    id<MTLFunction> fragFunc = _fragmentMTLFunction;
    _fragmentMTLFunction = nil;

    CC_SAFE_DELETE(_gpuShader);

    std::function<void(void)> destroyFunc = [=]() {
        if (vertFunc) {
            [vertFunc release];
        }
        if (fragFunc) {
            [fragFunc release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

bool CCMTLShader::createMTLFunction(const ShaderStage &stage) {
    bool isVertexShader = stage.stage == ShaderStageFlagBit::VERTEX;
    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice *>(_device)->getMTLDevice());
    auto mtlShader = mu::compileGLSLShader2Msl(stage.source,
                                               stage.stage,
                                               _device,
                                               _gpuShader);

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

    if (stage.stage == ShaderStageFlagBit::VERTEX) {
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

uint CCMTLShader::getAvailableBufferBindingIndex(ShaderStageFlagBit stage, uint stream) {
    if (stage & ShaderStageFlagBit::VERTEX) {
        return _availableVertexBufferBindingIndex.at(stream);
    }

    if (stage & ShaderStageFlagBit::FRAGMENT) {
        return _availableFragmentBufferBindingIndex.at(stream);
    }

    CC_LOG_ERROR("getAvailableBufferBindingIndex: invalid shader stage %d", stage);
    return 0;
}

void CCMTLShader::setAvailableBufferBindingIndex() {
    uint usedVertexBufferBindingIndexes = 0;
    uint usedFragmentBufferBindingIndexes = 0;
    uint vertexBindingCount = 0;
    uint fragmentBindingCount = 0;
    for (const auto &block : _gpuShader->blocks) {
        if (block.second.stages & ShaderStageFlagBit::VERTEX) {
            vertexBindingCount++;
            usedVertexBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
        if (block.second.stages & ShaderStageFlagBit::FRAGMENT) {
            fragmentBindingCount++;
            usedFragmentBufferBindingIndexes |= 1 << block.second.mappedBinding;
        }
    }

    auto maxBufferBindingIndex = static_cast<CCMTLDevice *>(_device)->getMaximumBufferBindingIndex();
    _availableVertexBufferBindingIndex.resize(maxBufferBindingIndex - vertexBindingCount);
    _availableFragmentBufferBindingIndex.resize(maxBufferBindingIndex - fragmentBindingCount);
    uint availableVertexBufferBit = ~usedVertexBufferBindingIndexes;
    uint availableFragmentBufferBit = ~usedFragmentBufferBindingIndexes;
    int theBit = maxBufferBindingIndex - 1;
    uint i = 0, j = 0;
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
