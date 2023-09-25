/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
#include "gfx-base/GFXDef-common.h"
#define USE_NATIVE_SPIRV 0
#if USE_NATIVE_SPIRV
    #include "gfx-base/SPIRVUtils.h"
    #ifndef SPIRV_CROSS_EXCEPTIONS_TO_ASSERTIONS
        #define SPIRV_CROSS_EXCEPTIONS_TO_ASSERTIONS
    #endif
    #include "spirv_cross/spirv_msl.hpp"
#endif

namespace cc {
namespace gfx {
using namespace emscripten;
SPIRVUtils *CCWGPUShader::spirv = nullptr;

CCWGPUShader::CCWGPUShader() : Shader() {
}

CCWGPUShader::~CCWGPUShader() {
    doDestroy();
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
        size_t size = spirvs[i].size();

        WGPUShaderModuleSPIRVDescriptor spv = {};
        spv.chain.sType = WGPUSType_ShaderModuleSPIRVDescriptor;
        spv.codeSize = size;
        spv.code = spvData;
        WGPUShaderModuleDescriptor desc = {};
        desc.nextInChain = reinterpret_cast<WGPUChainedStruct *>(&spv);
        desc.label = _name.c_str();
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

void CCWGPUShader::initWithWGSL(const ShaderInfo& info) {
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
        WGPUShaderModuleWGSLDescriptor wgslDesc = {};
        wgslDesc.chain.sType = WGPUSType_ShaderModuleWGSLDescriptor;
        wgslDesc.code = stage.source.c_str();
        WGPUShaderModuleDescriptor desc = {};
        desc.nextInChain = reinterpret_cast<WGPUChainedStruct *>(&wgslDesc);
        desc.label = _name.c_str();
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

const std::string spirvProcess(const uint32_t *data, size_t size, const UniformSamplerTextureList &list) {
#if USE_NATIVE_SPIRV
    spirv_cross::CompilerMSL compiler(data, size);
    auto executionModel = compiler.get_execution_model();

    auto active = compiler.get_active_interface_variables();
    spirv_cross::ShaderResources resources = compiler.get_shader_resources(active);
    compiler.set_enabled_interface_variables(std::move(active));

    // Set some options.
    spirv_cross::CompilerMSL::Options options;
    options.enable_decoration_binding = true;
    options.set_msl_version(2, 3, 0);
    compiler.set_msl_options(options);

    printf("size should be eq %d ,%d\n", list.size(), resources.sampled_images.size());

    for (size_t i = 0; i < resources.sampled_images.size(); ++i) {
        const auto &sampler = resources.sampled_images[i];
        auto set = compiler.get_decoration(sampler.id, spv::DecorationDescriptorSet);
        auto binding = compiler.get_decoration(sampler.id, spv::DecorationBinding);
        int size = 1;
        // const spirv_cross::SPIRType &type = msl.get_type(sampler.type_id);
        // if (type.array_size_literal[0]) {
        //     size = type.array[0];
        // }

        // for (int i = 0; i < size; ++i) {
        spirv_cross::MSLResourceBinding newBinding;
        newBinding.stage = executionModel;
        newBinding.desc_set = set;
        newBinding.binding = list[i].binding;
        newBinding.msl_texture = binding;
        newBinding.msl_sampler = binding + 16;
        compiler.add_msl_resource_binding(newBinding);

        // if (gpuShader->samplers.find(mappedBinding) == gpuShader->samplers.end()) {
        //     gpuShader->samplers[mappedBinding] = {sampler.name, set, binding, newBinding.msl_texture, newBinding.msl_sampler, shaderType};
        // } else {
        //     gpuShader->samplers[mappedBinding].stages |= shaderType;
        // }
        // ++gpuShader->samplerIndex;
        // }
    }

    const std::string &msl = compiler.compile();
    return msl;
#else
    return std::string{};
#endif
}

void CCWGPUShader::doInit(const ShaderInfo &info) {
    initWithWGSL(info);
#if USE_NATIVE_SPIRV
    _gpuShaderObject = ccnew CCWGPUShaderObject;
    if (!spirv) {
        spirv = SPIRVUtils::getInstance();
        spirv->initialize(1);
    }
    _gpuShaderObject->name = info.name;
    for (auto &stage : info.stages) {
        spirv->compileGLSL(stage.stage, "#version 450\n" + stage.source);
        // const auto &data = spirv->getOutputData();

        std::string glsl = spirvProcess(spirv->getOutputData(), spirv->getOutputSize() / sizeof(uint32_t), _samplerTextures);
        spirv->compileGLSL(stage.stage, glsl);
        auto *spvData = spirv->getOutputData();
        size_t size = spirv->getOutputSize() / sizeof(uint32_t);

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
// printf("sahdername: %s\n", info.name.c_str());
#endif
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
        _gpuShaderObject = nullptr;
    }
}

} // namespace gfx
} // namespace cc
