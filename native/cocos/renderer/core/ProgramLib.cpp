/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include "renderer/core/ProgramLib.h"
#include <algorithm>
#include <cstdint>
#include <numeric>
#include <ostream>
#include "base/Log.h"
#include "core/assets/EffectAsset.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "renderer/gfx-base/SPIRVUtils.h"
#include "renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace {

int32_t getBitCount(int32_t cnt) {
    return std::ceil(std::log2(std::max(cnt, 2))); // std::max checks number types
}

bool recordAsBool(const MacroRecord::mapped_type &v) {
    if (ccstd::holds_alternative<bool>(v)) {
        return ccstd::get<bool>(v);
    }
    if (ccstd::holds_alternative<ccstd::string>(v)) {
        return ccstd::get<ccstd::string>(v) == "true";
    }
    if (ccstd::holds_alternative<int32_t>(v)) {
        return ccstd::get<int32_t>(v);
    }
    return false;
}

ccstd::string recordAsString(const MacroRecord::mapped_type &v) {
    if (ccstd::holds_alternative<bool>(v)) {
        return ccstd::get<bool>(v) ? "1" : "0";
    }
    if (ccstd::holds_alternative<ccstd::string>(v)) {
        return ccstd::get<ccstd::string>(v);
    }
    if (ccstd::holds_alternative<int32_t>(v)) {
        return std::to_string(ccstd::get<int32_t>(v));
    }
    return "";
}

ccstd::string mapDefine(const IDefineInfo &info, const ccstd::optional<MacroRecord::mapped_type> &def) {
    if (info.type == "boolean") {
        return def.has_value() ? (recordAsBool(def.value()) ? "1" : "0") : "0";
    }
    if (info.type == "string") {
        return def.has_value() ? recordAsString(def.value()) : info.options.value()[0];
    }
    if (info.type == "number") {
        return def.has_value() ? recordAsString(def.value()) : std::to_string(info.range.value()[0]);
    }
    CC_LOG_WARNING("unknown define type '%s', name: %s", info.type.c_str(), info.name.c_str());
    return "-1"; // should neven happen
}

ccstd::vector<IMacroInfo> prepareDefines(const MacroRecord &records, const ccstd::vector<IDefineRecord> &defList) {
    ccstd::vector<IMacroInfo> macros{};
    for (const auto &tmp : defList) {
        const auto &name = tmp.name;
        auto it = records.find(name);
        auto value = mapDefine(tmp, it == records.end() ? ccstd::nullopt : ccstd::optional<MacroValue>(it->second));
        bool isDefault = it == records.end() || (ccstd::holds_alternative<ccstd::string>(it->second) && ccstd::get<ccstd::string>(it->second) == "0");
        macros.emplace_back();
        auto &info = macros.back();
        info.name = name;
        info.value = value;
        info.isDefault = isDefault;
    }
    return macros;
}

ccstd::string getDefaultDefineInfo(const IDefineInfo &def) {
    if (def.type == "boolean") {
        return "0";
    }
    if (def.type == "string") {
        return def.options.value()[0];
    }
    if (def.type == "number") {
        return std::to_string(def.range.value()[0]);
    }
    CC_LOG_WARNING("unknown define type '%s', name: %s", def.type.c_str(), def.name.c_str());
    return "-1"; // should neven happen
}

ccstd::string getShaderInstanceName(const ccstd::string &name, const ccstd::vector<IMacroInfo> &macros) {
    std::stringstream ret;
    ret << name;
    for (const auto &cur : macros) {
        if (!cur.isDefault) {
            ret << "|" << cur.name << cur.value;
        }
    }
    return ret.str();
}

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

auto genHandles(const IProgramInfo &tmpl) {
    Record<ccstd::string, uint32_t> handleMap{};
    // block member handles
    for (const auto &block : tmpl.blocks) {
        const auto members = block.members;
        uint32_t offset = 0;
        for (const auto &uniform : members) {
            handleMap[uniform.name] = genHandle(block.binding,
                                                uniform.type,
                                                uniform.count,
                                                offset);
            offset += (getTypeSize(uniform.type) >> 2) * uniform.count; // assumes no implicit padding, which is guaranteed by effect compiler
        }
    }
    // samplerTexture handles
    for (const auto &samplerTexture : tmpl.samplerTextures) {
        handleMap[samplerTexture.name] = genHandle(samplerTexture.binding,
                                                   samplerTexture.type,
                                                   samplerTexture.count);
    }
    return handleMap;
}

bool dependencyCheck(const ccstd::vector<ccstd::string> &dependencies, const MacroRecord &defines) {
    for (const auto &d : dependencies) { // NOLINT(readability-use-anyofallof)
        if (d[0] == '!') {               // negative dependency
            if (defines.find(d.substr(1)) != defines.end()) {
                return false;
            }
        } else if (defines.count(d) == 0 ? true : !recordAsBool(defines.at(d))) {
            return false;
        }
    }
    return true;
}

ccstd::vector<gfx::Attribute> getActiveAttributes(const IProgramInfo &tmpl, const ITemplateInfo &tmplInfo, const MacroRecord &defines) {
    ccstd::vector<gfx::Attribute> out{};
    const auto &attributes = tmpl.attributes;
    const auto &gfxAttributes = tmplInfo.gfxAttributes;
    for (auto i = 0; i < attributes.size(); i++) {
        if (!dependencyCheck(attributes[i].defines, defines)) {
            continue;
        }
        out.emplace_back(gfxAttributes[i]);
    }
    return out;
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
}

ProgramLib::ProgramLib() {
    ProgramLib::instance = this;
}

ProgramLib::~ProgramLib() {
    ProgramLib::instance = nullptr;
}

/*static*/
ProgramLib *ProgramLib::instance = nullptr;

ProgramLib *ProgramLib::getInstance() {
    return ProgramLib::instance;
}

void ProgramLib::registerEffect(EffectAsset *effect) {
    for (auto &shader : effect->_shaders) {
        _shaderCollections[shader.name] = new ShaderCollection(shader);
    }

    for (auto &tech : effect->_techniques) {
        for (auto &pass : tech.passes) {
            // grab default property declaration if there is none
            if (pass.propertyIndex != CC_INVALID_INDEX && !pass.properties.has_value()) {
                pass.properties = tech.passes[pass.propertyIndex].properties;
            }
        }
    }
}

IProgramInfo *ProgramLib::define(IShaderInfo &shader) {
    auto &shaderCollection = _shaderCollections[shader.name];
    if (!shaderCollection) {
        shaderCollection = new ShaderCollection(shader);
    }
    return /*shaderCollection*/nullptr;
}

/**
 * @en Gets the shader template with its name
 * @zh 通过名字获取 Shader 模板
 * @param name Target shader name
 */

IProgramInfo *ProgramLib::getTemplate(const ccstd::string &name) {
    auto shaderCollection = _shaderCollections.find(name);
    if (shaderCollection != _shaderCollections.end()) {
        return shaderCollection->second->getTemplate();
    }
    return nullptr;
}

/**
 * @en Gets the shader template info with its name
 * @zh 通过名字获取 Shader 模版信息
 * @param name Target shader name
 */
ITemplateInfo *ProgramLib::getTemplateInfo(const ccstd::string &name) {
    auto shaderCollection = _shaderCollections.find(name);
    CC_ASSERT(shaderCollection != _shaderCollections.end());
    return shaderCollection->second->getTemplateInfo();
}

/**
 * @en Gets the pipeline layout of the shader template given its name
 * @zh 通过名字获取 Shader 模板相关联的管线布局
 * @param name Target shader name
 */
gfx::DescriptorSetLayout *ProgramLib::getDescriptorSetLayout(gfx::Device *device, const ccstd::string &name, bool isLocal) {
    auto shaderCollection = _shaderCollections.find(name);
    CC_ASSERT(shaderCollection != _shaderCollections.end());
    return shaderCollection->second->getDescriptorSetLayout(device, isLocal);
}

ccstd::string ProgramLib::getKey(const ccstd::string &name, const MacroRecord &defines) {
    auto shaderCollection = _shaderCollections.find(name);
    CC_ASSERT(shaderCollection != _shaderCollections.end());
    return shaderCollection->second->getKey(defines);
}

void ProgramLib::destroyShaderByDefines(const MacroRecord &defines) {
    for (auto &shaderCollection : _shaderCollections) {
        shaderCollection.second->destroyShaderByDefines(defines);
    }
}

gfx::Shader *ProgramLib::getGFXShader(gfx::Device *device, const ccstd::string &name, MacroRecord &defines,
                                      render::PipelineRuntime *pipeline, ccstd::string *keyOut) {
    auto shaderCollection = _shaderCollections.find(name);
    CC_ASSERT(shaderCollection != _shaderCollections.end());
    auto shader = shaderCollection->second->getShaderVariant(device, defines, pipeline, keyOut);
    return shader;
}

ShaderCollection::ShaderCollection(IShaderInfo shaderInfo) {
    _shaderInfo.copyFrom(shaderInfo);
    int32_t offset = 0;
    for (auto &def : _shaderInfo.defines) {
        int32_t cnt = 1;
        if (def.type == "number") {
            auto &range = def.range.value();
            cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends
            def.map = [=](const MacroValue &value) -> int32_t {
                if (ccstd::holds_alternative<int32_t>(value)) {
                    return ccstd::get<int32_t>(value) - range[0];
                }
                if (ccstd::holds_alternative<bool>(value)) {
                    return (ccstd::get<bool>(value) ? 1 : 0) - range[0];
                }
                CC_ASSERT(false); // We only support macro with int32_t type now.
                return 0;
            };
        } else if (def.type == "string") {
            cnt = getBitCount(static_cast<int32_t>(def.options.value().size()));
            def.map = [=](const MacroValue &value) -> int32_t {
                const auto *pValue = ccstd::get_if<ccstd::string>(&value);
                if (pValue != nullptr) {
                    auto idx = static_cast<int32_t>(std::find(def.options.value().begin(), def.options.value().end(), *pValue) - def.options.value().begin());
                    return std::max(0, idx);
                }
                return 0;
            };
        } else if (def.type == "boolean") {
            def.map = [](const MacroValue &value) -> int32_t {
                const auto *pBool = ccstd::get_if<bool>(&value);
                if (pBool != nullptr) {
                    return *pBool ? 1 : 0;
                }
                const auto *pInt = ccstd::get_if<int32_t>(&value);
                if (pInt != nullptr) {
                    return *pInt ? 1 : 0;
                }
                const auto *pString = ccstd::get_if<ccstd::string>(&value);
                if (pString != nullptr) {
                    return *pString != "0" || !(*pString).empty() ? 1 : 0;
                }
                return 0;
            };
        }
        def.offset = offset;
        offset += cnt;
    }
    if (offset > 31) {
        _shaderInfo.uber = true;
    }
    {
        _shaderInfo.constantMacros.clear();
        std::stringstream ss;
        for (auto &key : _shaderInfo.builtins.statistics) {
            ss << "#define " << key.first << " " << key.second << std::endl;
        }
        _shaderInfo.constantMacros = ss.str();
    }

    _templateInfo.samplerStartBinding = static_cast<int32_t>(_shaderInfo.blocks.size());
    _templateInfo.bindings = {};
    _templateInfo.blockSizes = {};

    for (const auto &block : _shaderInfo.blocks) {
        _templateInfo.blockSizes.emplace_back(getSize(block));
        _templateInfo.bindings.emplace_back();
        auto &bindingsInfo = _templateInfo.bindings.back();
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
        _templateInfo.shaderInfo.blocks.emplace_back();
        auto &blocksInfo = _templateInfo.shaderInfo.blocks.back();
        blocksInfo.set = static_cast<uint32_t>(pipeline::SetIndex::MATERIAL);
        blocksInfo.binding = block.binding;
        blocksInfo.name = block.name;
        blocksInfo.members = uniforms;
        blocksInfo.count = 1; // effect compiler guarantees block count = 1
    }
    for (const auto &samplerTexture : _shaderInfo.samplerTextures) {
        _templateInfo.bindings.emplace_back();
        auto &descriptorLayoutBindingInfo = _templateInfo.bindings.back();
        descriptorLayoutBindingInfo.binding = samplerTexture.binding;
        descriptorLayoutBindingInfo.descriptorType = gfx::DescriptorType::SAMPLER_TEXTURE;
        descriptorLayoutBindingInfo.count = samplerTexture.count;
        descriptorLayoutBindingInfo.stageFlags = samplerTexture.stageFlags;

        _templateInfo.shaderInfo.samplerTextures.emplace_back();
        auto &samplerTextureInfo = _templateInfo.shaderInfo.samplerTextures.back();
        samplerTextureInfo.set = static_cast<uint32_t>(pipeline::SetIndex::MATERIAL);
        samplerTextureInfo.binding = samplerTexture.binding;
        samplerTextureInfo.name = samplerTexture.name;
        samplerTextureInfo.type = samplerTexture.type;
        samplerTextureInfo.count = samplerTexture.count;
    }

    for (const auto &sampler : _shaderInfo.samplers) {
        _templateInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
            sampler.binding,
            gfx::DescriptorType::SAMPLER,
            sampler.count,
            sampler.stageFlags});

        _templateInfo.shaderInfo.samplers.emplace_back(gfx::UniformSampler{
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
            sampler.binding,
            sampler.name,
            sampler.count,
        });
    }

    for (const auto &texture : _shaderInfo.textures) {
        _templateInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
            texture.binding,
            gfx::DescriptorType::TEXTURE,
            texture.count,
            texture.stageFlags});

        _templateInfo.shaderInfo.textures.emplace_back(gfx::UniformTexture{
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
            texture.binding,
            texture.name,
            texture.type,
            texture.count,
        });
    }

    for (const auto &buffer : _shaderInfo.buffers) {
        _templateInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
            buffer.binding,
            gfx::DescriptorType::STORAGE_BUFFER,
            1,
            buffer.stageFlags});

        _templateInfo.shaderInfo.buffers.emplace_back(gfx::UniformStorageBuffer{
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
            buffer.binding,
            buffer.name,
            1,
            buffer.memoryAccess}); // effect compiler guarantees buffer count = 1
    }

    for (const auto &image : _shaderInfo.images) {
        _templateInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
            image.binding,
            gfx::DescriptorType::STORAGE_IMAGE,
            image.count,
            image.stageFlags});

        _templateInfo.shaderInfo.images.emplace_back(gfx::UniformStorageImage{
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
            image.binding,
            image.name,
            image.type,
            image.count,
            image.memoryAccess});
    }

    for (const auto &subpassInput : _shaderInfo.subpassInputs) {
        _templateInfo.bindings.emplace_back(gfx::DescriptorSetLayoutBinding{
            subpassInput.binding,
            gfx::DescriptorType::INPUT_ATTACHMENT,
            subpassInput.count,
            subpassInput.stageFlags});

        _templateInfo.shaderInfo.subpassInputs.emplace_back(gfx::UniformInputAttachment{
            static_cast<uint32_t>(pipeline::SetIndex::MATERIAL),
            subpassInput.binding,
            subpassInput.name,
            subpassInput.count});
    }

    _templateInfo.gfxAttributes = {};
    for (auto &attr : _shaderInfo.attributes) {
        _templateInfo.gfxAttributes.emplace_back();
        auto &info = _templateInfo.gfxAttributes.back();
        info.name = attr.name;
        info.format = attr.format;
        info.isNormalized = attr.isNormalized;
        info.stream = 0;
        info.isInstanced = attr.isInstanced;
        info.location = attr.location;
    }
    insertBuiltinBindings(_shaderInfo, _templateInfo, pipeline::localDescriptorSetLayout, "locals", nullptr);

    _templateInfo.shaderInfo.stages.emplace_back();
    auto &vertexShaderInfo = _templateInfo.shaderInfo.stages.back();
    vertexShaderInfo.stage = gfx::ShaderStageFlagBit::VERTEX;
    vertexShaderInfo.source = "";
    _templateInfo.shaderInfo.stages.emplace_back();
    auto &fragmentShaderInfo = _templateInfo.shaderInfo.stages.back();
    fragmentShaderInfo.stage = gfx::ShaderStageFlagBit::FRAGMENT;
    fragmentShaderInfo.source = "";
    _templateInfo.handleMap = genHandles(_shaderInfo);
    _templateInfo.setLayouts = {};

    std::transform(shaderInfo.defines.cbegin(), shaderInfo.defines.cend(), std::back_inserter(_defaultMacros),
                   [](const IDefineInfo &def) {
                       return IMacroInfo{def.name, getDefaultDefineInfo(def), false};
                   });

    std::for_each(_defaultMacros.cbegin(), _defaultMacros.cend(), [this](const IMacroInfo &def) {
        _templateMacros[def.name] = def.value;
    });
}

ShaderCollection::~ShaderCollection() {
#if CC_DEBUG
    for (const auto &cache : _shaderVariants) {
        if (cache.second->getRefCount() > 1) {
            CC_LOG_WARNING("ShaderCollection cache: %s ref_count is %d and may leak", cache.second->getName().c_str(), cache.second->getRefCount());
        }
    }
#endif
}


IProgramInfo *ShaderCollection::getTemplate() {
    return &_shaderInfo;
}

ITemplateInfo *ShaderCollection::getTemplateInfo() {
    return &_templateInfo;
}

gfx::Shader *ShaderCollection::getShaderVariant(gfx::Device *device, const Record<ccstd::string, MacroValue> &macros, render::PipelineRuntime *pipeline, ccstd::string *keyOut) {
    MacroRecord defines = macros;

    for (const auto &it : pipeline->getMacros()) {
        defines[it.first] = it.second;
    }

    auto key = getKey(defines);
    if (!_templateInfo.pipelineLayout) {
        getDescriptorSetLayout(device); // ensure set layouts have been created
        insertBuiltinBindings(_shaderInfo, _templateInfo, pipeline::globalDescriptorSetLayout, "globals", nullptr);
        _templateInfo.setLayouts.replace(static_cast<index_t>(pipeline::SetIndex::GLOBAL), pipeline->getDescriptorSetLayout());
        _templateInfo.pipelineLayout = device->createPipelineLayout(gfx::PipelineLayoutInfo{_templateInfo.setLayouts.get()});
    }
    ccstd::vector<IMacroInfo> macroArray = prepareDefines(defines, _shaderInfo.defines);
    _templateInfo.shaderInfo.attributes = getActiveAttributes(_shaderInfo, _templateInfo, defines);

    auto createShader = [&](gfx::Shader *shader) {
        auto *device = gfx::Device::getInstance();
        auto it = _shaderVariantSources.find(key);
        if (it != _shaderVariantSources.end()) {
            _templateInfo.shaderInfo.stages[0] = it->second.vert;
            _templateInfo.shaderInfo.stages[1] = it->second.frag;
        } else {
#if CC_SHADER_BAKE_MODE
            // TODO: yiwenxue : shader bake mode
            CC_LOG_ERROR("Missing prebake ShaderSource for %s", _shaderInfo.name.c_str());
            return nullptr;
#else
            std::stringstream ss;
            ss << std::endl;
            for (const auto &m : macroArray) {
                ss << "#define " << m.name << " " << m.value << std::endl;
            }
            auto prefix = pipeline->getConstantMacros() + _shaderInfo.constantMacros + ss.str();

            const IShaderSource *src = &_shaderInfo.glsl3;
            const auto *deviceShaderVersion = getDeviceShaderVersion(device);
            if (deviceShaderVersion) {
                src = _shaderInfo.getSource(deviceShaderVersion);
            } else {
                CC_LOG_ERROR("Invalid GFX API!");
            }
            // Shader preprocessing -- shader precompile and optimize
            gfx::SPIRVUtils *spirvUtils = gfx::SPIRVUtils::getInstance();
            std::vector<uint32_t> vertSpv, fragSpv;

            ShaderSource source{};
            std::string version;
            switch (device->getGfxAPI()) {
                case gfx::API::GLES2:
                    version = "#version 300 es\n";
                    vertSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::VERTEX, version + prefix + src->vert);
                    fragSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::FRAGMENT, version + prefix + src->frag);
                    vertSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    fragSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    source.vert.source = spirvUtils->compileSPIRV2GLSL(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    source.frag.source = spirvUtils->compileSPIRV2GLSL(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    break;

                case gfx::API::GLES3:
                    version = "#version 310 es\n";
                    vertSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::VERTEX, version + prefix + src->vert);
                    fragSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::FRAGMENT, version + prefix + src->frag);
                    vertSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    fragSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    source.vert.source = spirvUtils->compileSPIRV2GLSL(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    source.frag.source = spirvUtils->compileSPIRV2GLSL(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    break;

                case gfx::API::VULKAN:
                    version = "#version 450\n";
                    vertSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::VERTEX, version + prefix + src->vert);
                    vertSpv = spirvUtils->compressInputLocations(_templateInfo.shaderInfo.attributes);
                    fragSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::FRAGMENT, version + prefix + src->frag);
                    vertSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    fragSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    source.vert.byteCode = vertSpv;
                    source.frag.byteCode = fragSpv;
                    break;

                case gfx::API::METAL:
                    vertSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::VERTEX, prefix + src->vert);
                    fragSpv = spirvUtils->compileGLSL2SPIRV(gfx::ShaderStageFlagBit::FRAGMENT, prefix + src->frag);
                    vertSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    fragSpv = spirvUtils->optimizeSPIRV(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    source.vert.source = spirvUtils->compileSPIRV2MSL(gfx::ShaderStageFlagBit::VERTEX, vertSpv);
                    source.frag.source = spirvUtils->compileSPIRV2MSL(gfx::ShaderStageFlagBit::FRAGMENT, fragSpv);
                    break;

                default:
                    break;
            };
            _templateInfo.shaderInfo.stages[0] = source.vert;
            _templateInfo.shaderInfo.stages[1] = source.frag;
            _shaderVariantSources[key] = source;
#endif
        }
        _templateInfo.shaderInfo.name = getShaderInstanceName(_shaderInfo.name, macroArray);
        shader = device->createShader(_templateInfo.shaderInfo);
        return shader;
    };

    gfx::Shader *shader = nullptr;
    auto it = _shaderVariants.find(key);
    if (it != _shaderVariants.end()) {
        shader = it->second;
    } else {
        shader = createShader(shader);
        _shaderVariants[key] = shader;
    }
    return shader;
}

void ShaderCollection::destroyShaderByDefines(const Record<ccstd::string, MacroValue> &defines) {
    if (defines.empty()) return;
    ccstd::vector<ccstd::string> defineValues;
    for (const auto &i : defines) {
        defineValues.emplace_back(i.first + recordAsString(i.second));
    }
    ccstd::vector<ccstd::string> matchedKeys;
    for (const auto &i : _shaderVariants) {
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
        _shaderVariants[key]->destroy();
        _shaderVariants.erase(key);
    }
}

ShaderSource ShaderCollection::_getShaderSource(const ccstd::vector<IMacroInfo> &macros) {
    return {};
}

ccstd::string ShaderCollection::getKey(const MacroRecord &defines) const {
    auto &tmpl = _shaderInfo;
    auto &tmplDefs = tmpl.defines;
    if (tmpl.uber) {
        std::stringstream key;
        for (auto &tmplDef : tmplDefs) {
            auto itDef = defines.find(tmplDef.name);
            if (itDef == defines.end() || !tmplDef.map) {
                continue;
            }
            const auto &value = itDef->second;
            auto mapped = tmplDef.map(value);
            auto offset = tmplDef.offset;
            key << offset << mapped << "|";
        }
        ccstd::string ret{key.str() + std::to_string(tmpl.hash)};
        return ret;
    }
    uint32_t key = 0;
    std::stringstream ss;
    for (auto &tmplDef : tmplDefs) {
        auto itDef = defines.find(tmplDef.name);
        if (itDef == defines.end() || !tmplDef.map) {
            continue;
        }
        const auto &value = itDef->second;
        auto mapped = tmplDef.map(value);
        auto offset = tmplDef.offset;
        key |= (mapped << offset);
    }
    ss << std::hex << key << "|" << std::to_string(tmpl.hash);
    ccstd::string ret{ss.str()};
    return ret;
}

gfx::DescriptorSetLayout *ShaderCollection::getDescriptorSetLayout(gfx::Device *device, bool isLocal) {
    auto &tmpl = _shaderInfo;
    auto &tmplInfo = _templateInfo;
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

} // namespace cc
