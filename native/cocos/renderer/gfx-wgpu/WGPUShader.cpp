/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "WGPUShader.h"
#include <webgpu/webgpu.h>
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUUtils.h"
#include "gfx-base/SPIRVUtils.h"

namespace cc {
namespace gfx {
using namespace emscripten;
SPIRVUtils *CCWGPUShader::spirv = nullptr;

CCWGPUShader::CCWGPUShader() : wrapper<Shader>(val::object()) {
}

void CCWGPUShader::initialize(const ShaderInfo &info, const std::vector<std::vector<uint32_t>> &spirvs) {
    _gpuShaderObject = ccnew CCWGPUShaderObject;

    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _buffers = info.buffers;
    _samplerTextures = info.samplerTextures;
    _samplers = info.samplers;
    _textures = info.textures;
    _images = info.images;
    _subpassInputs = info.subpassInputs;

    _gpuShaderObject->name = info.name;
    for (size_t i = 0; i < info.stages.size(); i++) {
        const auto &stage = info.stages[i];
        auto *spvData = spirvs[i].data();
        size_t size = spirvs[i].size() * sizeof(uint32_t);

        WGPUShaderModuleSPIRVDescriptor spv = {};
        spv.chain.sType = WGPUSType_ShaderModuleSPIRVDescriptor;
        spv.codeSize = size;
        spv.code = spvData;
        WGPUShaderModuleDescriptor desc = {};
        desc.nextInChain = reinterpret_cast<WGPUChainedStruct *>(&spv);
        desc.label = nullptr;
        if (stage.stage == ShaderStageFlagBit::VERTEX) {
            _gpuShaderObject->wgpuShaderVertexModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else if (stage.stage == ShaderStageFlagBit::FRAGMENT) {
            _gpuShaderObject->wgpuShaderFragmentModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else if (stage.stage == ShaderStageFlagBit::COMPUTE) {
            _gpuShaderObject->wgpuShaderComputeModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else {
            printf("unsupport shader stage.");
        }
    }
}

void CCWGPUShader::doInit(const ShaderInfo &info) {
    _gpuShaderObject = ccnew CCWGPUShaderObject;
    if (!spirv) {
        spirv = SPIRVUtils::getInstance();
        spirv->initialize(2);
    }

    for (auto &stage : info.stages) {
        spirv->compileGLSL(stage.stage, "#version 450\n" + stage.source);
        _gpuShaderObject->name = info.name;

        // const auto &data = spirv->getOutputData();
        auto *spvData = spirv->getOutputData();
        size_t size = spirv->getOutputSize();

        WGPUShaderModuleSPIRVDescriptor spv = {};
        spv.chain.sType = WGPUSType_ShaderModuleSPIRVDescriptor;
        spv.codeSize = size;
        spv.code = spvData;
        WGPUShaderModuleDescriptor desc = {};
        desc.nextInChain = reinterpret_cast<WGPUChainedStruct *>(&spv);
        desc.label = nullptr;
        if (stage.stage == ShaderStageFlagBit::VERTEX) {
            _gpuShaderObject->wgpuShaderVertexModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else if (stage.stage == ShaderStageFlagBit::FRAGMENT) {
            _gpuShaderObject->wgpuShaderFragmentModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else if (stage.stage == ShaderStageFlagBit::COMPUTE) {
            _gpuShaderObject->wgpuShaderComputeModule = wgpuDeviceCreateShaderModule(CCWGPUDevice::getInstance()->gpuDeviceObject()->wgpuDevice, &desc);
        } else {
            printf("unsupport shader stage.");
        }
    }
}

void CCWGPUShader::doDestroy() {
    if (_gpuShaderObject) {
        if (_gpuShaderObject->wgpuShaderVertexModule) {
            wgpuShaderModuleRelease(_gpuShaderObject->wgpuShaderVertexModule);
        }
        if (_gpuShaderObject->wgpuShaderFragmentModule) {
            wgpuShaderModuleRelease(_gpuShaderObject->wgpuShaderFragmentModule);
        }
        if (_gpuShaderObject->wgpuShaderComputeModule) {
            wgpuShaderModuleRelease(_gpuShaderObject->wgpuShaderComputeModule);
        }
        delete _gpuShaderObject;
    }
}

} // namespace gfx
} // namespace cc