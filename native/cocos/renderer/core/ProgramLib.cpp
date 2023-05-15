/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "renderer/core/ProgramLib.h"
#include <algorithm>
#include <cstdint>
#include <numeric>
#include <ostream>
#include "ProgramUtils.h"
#include "base/Log.h"
#include "core/assets/EffectAsset.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace {

void insertBuiltinBindings(const IProgramInfo &tmpl, ITemplateInfo &tmplInfo, const pipeline::DescriptorSetLayoutInfos &source,
                           const ccstd::string &type, ccstd::vector<gfx::DescriptorSetLayoutBinding> *outBindings) {
    CC_ASSERT(type == "locals" || type == "globals");
    const auto &target = type == "globals" ? tmpl.builtins.globals : tmpl.builtins.locals;

    // Blocks
    ccstd::vector<gfx::UniformBlock> tempBlocks{};
    for (const auto &b : target.blocks) {
        auto infoIt = source.blocks.find(b.name);
        if (infoIt == source.blocks.end()) {
            CC_LOG_WARNING("builtin UBO '%s' not available !", b.name.c_str());
            continue;
        }
        const auto &info = infoIt->second;
        const auto bindingsIter = std::find_if(source.bindings.begin(), source.bindings.end(), [&info](const auto &bd) -> bool { return bd.binding == info.binding; });
        if (bindingsIter == source.bindings.end()) {
            CC_LOG_WARNING("builtin UBO '%s' not available !", b.name.c_str());
            continue;
        }

        tempBlocks.emplace_back(info);

        if (outBindings != nullptr && std::count_if(outBindings->begin(), outBindings->end(), [&bindingsIter](const auto &b) { return b.binding == bindingsIter->binding; }) == 0) {
            outBindings->emplace_back(*bindingsIter);
        }
    }
    tmplInfo.shaderInfo.blocks.insert(tmplInfo.shaderInfo.blocks.begin(), tempBlocks.begin(), tempBlocks.end());

    // SamplerTextures
    ccstd::vector<gfx::UniformSamplerTexture> tempSamplerTextures;
    for (const auto &s : target.samplerTextures) {
        auto infoIt = source.samplers.find(s.name);
        if (infoIt == source.samplers.end()) {
            CC_LOG_WARNING("builtin samplerTexture '%s' not available !", s.name.c_str());
            continue;
        }
        const auto &info = infoIt->second;
        const auto binding = std::find_if(source.bindings.begin(), source.bindings.end(), [&info](const auto &bd) {
            return bd.binding == info.binding;
        });
        if (binding == source.bindings.end() || !(binding->descriptorType & gfx::DESCRIPTOR_SAMPLER_TYPE)) {
            CC_LOG_WARNING("builtin samplerTexture '%s' not available !", s.name.c_str());
            continue;
        }
        tempSamplerTextures.emplace_back(info);
        if (outBindings != nullptr && std::count_if(outBindings->begin(), outBindings->end(), [&binding](const auto &b) { return b.binding == binding->binding; }) == 0) {
            outBindings->emplace_back(*binding);
        }
    }

    tmplInfo.shaderInfo.samplerTextures.insert(tmplInfo.shaderInfo.samplerTextures.begin(), tempSamplerTextures.begin(), tempSamplerTextures.end());
    if (outBindings != nullptr) {
        std::stable_sort(outBindings->begin(), outBindings->end(), [](const auto &a, const auto &b) {
            return a.binding < b.binding;
        });
    }
}

int32_t getSize(const IBlockInfo &block) {
    auto s = 0;
    for (const auto &m : block.members) {
        s += static_cast<int>(getTypeSize(m.type) * m.count);
    }
    return s;
}

} // namespace

const char *getDeviceShaderVersion(const gfx::Device *device) {
    switch (device->getGfxAPI()) {
        case gfx::API::GLES2:
        case gfx::API::WEBGL:
            return "glsl1";
        case gfx::API::GLES3:
        case gfx::API::WEBGL2:
            return "glsl3";
        default:
            return "glsl4";
    }
}

//
static void copyDefines(const ccstd::vector<IDefineInfo> &from, ccstd::vector<IDefineRecord> &to) {
    to.resize(from.size());
    for (size_t i = 0, len = from.size(); i < len; ++i) {
        to[i].name = from[i].name;
        to[i].type = from[i].type;
        to[i].range = from[i].range;
        to[i].options = from[i].options;
        to[i].defaultVal = from[i].defaultVal;
    }
}

// IProgramInfo
void IProgramInfo::copyFrom(const IShaderInfo &o) {
    name = o.name;
    hash = o.hash;
    glsl4 = o.glsl4;
    glsl3 = o.glsl3;
    glsl1 = o.glsl1;
    builtins = o.builtins;
    copyDefines(o.defines, defines);
    blocks = o.blocks;
    samplerTextures = o.samplerTextures;
    attributes = o.attributes;
    samplers = o.samplers;
    textures = o.textures;
    buffers = o.buffers;
    images = o.images;
    subpassInputs = o.subpassInputs;
    descriptors = o.descriptors;
}

ProgramLib::ProgramLib() {
    ProgramLib::instance = this;
}

ProgramLib::~ProgramLib() {
    ProgramLib::instance = nullptr;
#if CC_DEBUG
    for (const auto &cache : _cache) {
        if (cache.second->getRefCount() > 1) {
            CC_LOG_WARNING("ProgramLib cache: %s ref_count is %d and may leak", cache.second->getName().c_str(), cache.second->getRefCount());
        }
    }
#endif
}

//
/*static*/

ProgramLib *ProgramLib::instance = nullptr;

ProgramLib *ProgramLib::getInstance() {
    return ProgramLib::instance;
}

void ProgramLib::registerEffect(EffectAsset *effect) {
    for (auto &shader : effect->_shaders) {
        auto *tmpl = define(shader);
        tmpl->effectName = effect->getName();
    }
    render::addEffectDefaultProperties(*effect);
}

IProgramInfo *ProgramLib::define(IShaderInfo &shader) {
    auto itCurrTmpl = _templates.find(shader.name);
    if (itCurrTmpl != _templates.end() && itCurrTmpl->second.hash == shader.hash) {
        return &itCurrTmpl->second;
    }

    IProgramInfo &tmpl = _templates[shader.name];
    tmpl.copyFrom(shader);

    render::populateMacros(tmpl);

    if (_templateInfos.count(tmpl.hash) == 0) {
        ITemplateInfo tmplInfo{};
        // cache material-specific descriptor set layout
        tmplInfo.samplerStartBinding = static_cast<int32_t>(tmpl.blocks.size());
        tmplInfo.bindings = {};
        tmplInfo.blockSizes = {};
        for (const auto &block : tmpl.blocks) {
            tmplInfo.blockSizes.emplace_back(getSize(block));
            tmplInfo.bindings.emplace_back();
            auto &bindingsInfo = tmplInfo.bindings.back();
            bindingsInfo.binding = block.binding;
            bindingsInfo.descriptorType = gfx::DescriptorType::UNIFORM_BUFFER;
            bindingsInfo.count = 1;
            bindingsInfo.stageFlags = block.stageFlags;
            ccstd::vector<gfx::Uniform> uniforms;
            {
                // construct uniforms
                uniforms.reserve(block.members.size());
                for (const auto &member : block.members) {
                    uniforms.emplace_back();
                    auto &info = uniforms.back();
                    info.name = member.name;
                    info.type = member.type;
                    info.count = member.count;
                }
            }
            tmplInfo.shaderInfo.blocks.emplace_back();
            auto &blocksInfo = tmplInfo.shaderInfo.blocks.back();
            blocksInfo.set = static_cast<uint32_t>(pipeline::SetIndex::MATERIAL);
            blocksInfo.binding = block.binding;
            blocksInfo.name = block.name;
            blocksInfo.members = uniforms;
            blocksInfo.count = 1; // effect compiler guarantees block count = 1
        }
        for (const auto &samplerTexture : tmpl.samplerTextures) {
            tmplInfo.bindings.emplace_back();
            auto &descriptorLayoutBindingInfo = tmplInfo.bindings.back();
            descriptorLayoutBindingInfo.binding = samplerTexture.binding;
            descriptorLayoutBindingInfo.descriptorType = gfx::DescriptorType::SAMPLER_TEXTURE;
            descriptorLayoutBindingInfo.count = samplerTexture.count;
            descriptorLayoutBindingInfo.stageFlags = samplerTexture.stageFlags;

            tmplInfo.shaderInfo.samplerTextures.emplace_back();
            auto &samplerTextureInfo = tmplInfo.shaderInfo.samplerTextures.back();
            samplerTextureInfo.set = static_cast<uint32_t>(pipeline::SetIndex::MATERIAL);
            samplerTextureInfo.binding = samplerTexture.binding;
            samplerTextureInfo.name = samplerTexture.name;
            samplerTextureInfo.type = samplerTexture.type;
            samplerTextureInfo.count = samplerTexture.count;
        }

        for (const auto &sampler : tmpl.samplers) {
            tmplInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
                sampler.binding,
                gfx::DescriptorType::SAMPLER,
                sampler.count,
                sampler.stageFlags});

            tmplInfo.shaderInfo.samplers.emplace_back(gfx::UniformSampler{
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                sampler.binding,
                sampler.name,
                sampler.count,
            });
        }

        for (const auto &texture : tmpl.textures) {
            tmplInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
                texture.binding,
                gfx::DescriptorType::TEXTURE,
                texture.count,
                texture.stageFlags});

            tmplInfo.shaderInfo.textures.emplace_back(gfx::UniformTexture{
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                texture.binding,
                texture.name,
                texture.type,
                texture.count,
            });
        }

        for (const auto &buffer : tmpl.buffers) {
            tmplInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
                buffer.binding,
                gfx::DescriptorType::STORAGE_BUFFER,
                1,
                buffer.stageFlags});

            tmplInfo.shaderInfo.buffers.emplace_back(gfx::UniformStorageBuffer{
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                buffer.binding,
                buffer.name,
                1,
                buffer.memoryAccess}); // effect compiler guarantees buffer count = 1
        }

        for (const auto &image : tmpl.images) {
            tmplInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
                image.binding,
                gfx::DescriptorType::STORAGE_IMAGE,
                image.count,
                image.stageFlags});

            tmplInfo.shaderInfo.images.emplace_back(gfx::UniformStorageImage{
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                image.binding,
                image.name,
                image.type,
                image.count,
                image.memoryAccess});
        }

        for (const auto &subpassInput : tmpl.subpassInputs) {
            tmplInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
                subpassInput.binding,
                gfx::DescriptorType::INPUT_ATTACHMENT,
                subpassInput.count,
                subpassInput.stageFlags});

            tmplInfo.shaderInfo.subpassInputs.emplace_back(gfx::UniformInputAttachment{
                static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
                subpassInput.binding,
                subpassInput.name,
                subpassInput.count});
        }

        tmplInfo.gfxAttributes = {};
        for (auto &attr : tmpl.attributes) {
            tmplInfo.gfxAttributes.emplace_back();
            auto &info = tmplInfo.gfxAttributes.back();
            info.name = attr.name;
            info.format = attr.format;
            info.isNormalized = attr.isNormalized;
            info.stream = 0;
            info.isInstanced = attr.isInstanced;
            info.location = attr.location;
        }
        insertBuiltinBindings(tmpl, tmplInfo, pipeline::localDescriptorSetLayout, "locals", nullptr);

        tmplInfo.shaderInfo.stages.emplace_back();
        auto &vertexShaderInfo = tmplInfo.shaderInfo.stages.back();
        vertexShaderInfo.stage = gfx::ShaderStageFlagBit::VERTEX;
        vertexShaderInfo.source = "";
        tmplInfo.shaderInfo.stages.emplace_back();
        auto &fragmentShaderInfo = tmplInfo.shaderInfo.stages.back();
        fragmentShaderInfo.stage = gfx::ShaderStageFlagBit::FRAGMENT;
        fragmentShaderInfo.source = "";
        tmplInfo.handleMap = render::genHandles(tmpl);
        tmplInfo.setLayouts = {};

        _templateInfos[tmpl.hash] = tmplInfo;
    }
    return &tmpl;
}

/**
 * @en Gets the shader template with its name
 * @zh 通过名字获取 Shader 模板
 * @param name Target shader name
 */

const IProgramInfo *ProgramLib::getTemplate(const ccstd::string &name) const {
    auto it = _templates.find(name);
    return it != _templates.end() ? &it->second : nullptr;
}

/**
 * @en Gets the shader template info with its name
 * @zh 通过名字获取 Shader 模版信息
 * @param name Target shader name
 */

ITemplateInfo *ProgramLib::getTemplateInfo(const ccstd::string &name) {
    auto it = _templates.find(name);
    CC_ASSERT(it != _templates.end());
    auto hash = it->second.hash;
    auto itInfo = _templateInfos.find(hash);
    return itInfo != _templateInfos.end() ? &itInfo->second : nullptr;
}

/**
 * @en Gets the pipeline layout of the shader template given its name
 * @zh 通过名字获取 Shader 模板相关联的管线布局
 * @param name Target shader name
 */
gfx::DescriptorSetLayout *ProgramLib::getDescriptorSetLayout(gfx::Device *device, const ccstd::string &name, bool isLocal) {
    auto itTmpl = _templates.find(name);
    CC_ASSERT(itTmpl != _templates.end());
    const auto &tmpl = itTmpl->second;
    auto itTplInfo = _templateInfos.find(tmpl.hash);
    if (itTplInfo == _templateInfos.end()) {
        return nullptr;
    }

    auto &tmplInfo = itTplInfo->second;
    if (tmplInfo.setLayouts.empty()) {
        gfx::DescriptorSetLayoutInfo info;
        tmplInfo.setLayouts.resize(static_cast<size_t>(pipeline::SetIndex::COUNT));
        info.bindings = tmplInfo.bindings;
        tmplInfo.setLayouts.replace(static_cast<index_t>(pipeline::SetIndex::MATERIAL), device->createDescriptorSetLayout(info));
        info.bindings = pipeline::localDescriptorSetLayout.bindings;
        tmplInfo.setLayouts.replace(static_cast<index_t>(pipeline::SetIndex::LOCAL), device->createDescriptorSetLayout(info));
    }
    return tmplInfo.setLayouts.at(isLocal ? static_cast<uint32_t>(pipeline::SetIndex::LOCAL) : static_cast<uint32_t>(pipeline::SetIndex::MATERIAL));
}

ccstd::string ProgramLib::getKey(const ccstd::string &name, const MacroRecord &defines) {
    auto itTpl = _templates.find(name);
    CC_ASSERT(itTpl != _templates.end());
    auto &tmpl = itTpl->second;
    return render::getVariantKey(tmpl, defines);
}

void ProgramLib::destroyShaderByDefines(const MacroRecord &defines) {
    if (defines.empty()) return;
    ccstd::vector<ccstd::string> defineValues;
    for (const auto &i : defines) {
        defineValues.emplace_back(i.first + macroRecordAsString(i.second));
    }
    ccstd::vector<ccstd::string> matchedKeys;
    for (const auto &i : _cache) {
        bool matched = true;
        for (const auto &v : defineValues) {
            if (i.first.find(v) == ccstd::string::npos) {
                matched = false;
                break;
            }
        }
        if (matched) {
            matchedKeys.emplace_back(i.first);
        }
    }
    for (const auto &key : matchedKeys) {
        CC_LOG_DEBUG("destroyed shader %s", key.c_str());
        _cache[key]->destroy();
        _cache.erase(key);
    }
}

gfx::Shader *ProgramLib::getGFXShader(gfx::Device *device, const ccstd::string &name, MacroRecord &defines,
                                      render::PipelineRuntime *pipeline, ccstd::string *keyOut) {
    for (const auto &it : pipeline->getMacros()) {
        defines[it.first] = it.second;
    }

    ccstd::string key;
    if (!keyOut) {
        key = getKey(name, defines);
    } else {
        key = *keyOut;
    }
    auto itRes = _cache.find(key);
    if (itRes != _cache.end()) {
        //        CC_LOG_DEBUG("Found ProgramLib::_cache[%s]=%p, defines: %d", key.c_str(), itRes->second, defines.size());
        return itRes->second;
    }

    auto itTpl = _templates.find(name);
    CC_ASSERT(itTpl != _templates.end());

    const auto &tmpl = itTpl->second;
    const auto itTplInfo = _templateInfos.find(tmpl.hash);
    CC_ASSERT(itTplInfo != _templateInfos.end());
    auto &tmplInfo = itTplInfo->second;

    if (!tmplInfo.pipelineLayout) {
        getDescriptorSetLayout(device, name); // ensure set layouts have been created
        insertBuiltinBindings(tmpl, tmplInfo, pipeline::globalDescriptorSetLayout, "globals", nullptr);
        tmplInfo.setLayouts.replace(static_cast<index_t>(pipeline::SetIndex::GLOBAL), pipeline->getDescriptorSetLayout());
        tmplInfo.pipelineLayout = device->createPipelineLayout(gfx::PipelineLayoutInfo{tmplInfo.setLayouts.get()});
    }

    ccstd::vector<IMacroInfo> macroArray = render::prepareDefines(defines, tmpl.defines);
    std::stringstream ss;
    ss << std::endl;
    for (const auto &m : macroArray) {
        ss << "#define " << m.name << " " << m.value << std::endl;
    }
    auto prefix = pipeline->getConstantMacros() + tmpl.constantMacros + ss.str();

    const IShaderSource *src = &tmpl.glsl3;
    const auto *deviceShaderVersion = getDeviceShaderVersion(device);
    if (deviceShaderVersion) {
        src = tmpl.getSource(deviceShaderVersion);
    } else {
        CC_LOG_ERROR("Invalid GFX API!");
    }
    tmplInfo.shaderInfo.stages[0].source = prefix + src->vert;
    tmplInfo.shaderInfo.stages[1].source = prefix + src->frag;

    // strip out the active attributes only, instancing depend on this
    tmplInfo.shaderInfo.attributes = render::getActiveAttributes(tmpl, tmplInfo.gfxAttributes, defines);

    tmplInfo.shaderInfo.name = render::getShaderInstanceName(name, macroArray);
    tmplInfo.shaderInfo.hash = tmpl.hash;
    auto *shader = device->createShader(tmplInfo.shaderInfo);
    _cache[key] = shader;
    //    CC_LOG_DEBUG("ProgramLib::_cache[%s]=%p, defines: %d", key.c_str(), shader, defines.size());
    return shader;
}

} // namespace cc
