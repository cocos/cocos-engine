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

#include "scene/Pass.h"
#include "base/std/hash/hash.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/renderer/pipeline/custom/RenderingModule.h"
#include "core/Root.h"
#include "core/assets/EffectAsset.h"
#include "core/assets/TextureBase.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/platform/Debug.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/custom/details/GslUtils.h"
#include "renderer/core/PassUtils.h"
#include "renderer/core/ProgramLib.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "renderer/pipeline/Define.h"
#include "renderer/pipeline/InstancedBuffer.h"
#include "scene/Define.h"

namespace cc {
namespace scene {

namespace {

constexpr uint32_t INVALID_ID = 0xFFFFFFFF;

ccstd::hash_t serializeBlendState(const gfx::BlendState &bs) {
    ccstd::hash_t hashValue{2};
    ccstd::hash_combine(hashValue, bs.isA2C);
    for (const auto &t : bs.targets) {
        ccstd::hash_combine(hashValue, t.blend);
        ccstd::hash_combine(hashValue, t.blendEq);
        ccstd::hash_combine(hashValue, t.blendAlphaEq);
        ccstd::hash_combine(hashValue, t.blendColorMask);
        ccstd::hash_combine(hashValue, t.blendSrc);
        ccstd::hash_combine(hashValue, t.blendDst);
        ccstd::hash_combine(hashValue, t.blendSrcAlpha);
        ccstd::hash_combine(hashValue, t.blendDstAlpha);
    }
    return hashValue;
}

ccstd::hash_t serializeRasterizerState(const gfx::RasterizerState &rs) {
    ccstd::hash_t hashValue{2};
    ccstd::hash_combine(hashValue, rs.cullMode);
    ccstd::hash_combine(hashValue, rs.depthBias);
    ccstd::hash_combine(hashValue, rs.isFrontFaceCCW);
    return hashValue;
}

ccstd::hash_t serializeDepthStencilState(const gfx::DepthStencilState &dss) {
    ccstd::hash_t hashValue{2};
    ccstd::hash_combine(hashValue, dss.depthTest);
    ccstd::hash_combine(hashValue, dss.depthWrite);
    ccstd::hash_combine(hashValue, dss.depthFunc);
    ccstd::hash_combine(hashValue, dss.stencilTestFront);
    ccstd::hash_combine(hashValue, dss.stencilFuncFront);
    ccstd::hash_combine(hashValue, dss.stencilRefFront);
    ccstd::hash_combine(hashValue, dss.stencilReadMaskFront);
    ccstd::hash_combine(hashValue, dss.stencilFailOpFront);
    ccstd::hash_combine(hashValue, dss.stencilZFailOpFront);
    ccstd::hash_combine(hashValue, dss.stencilPassOpFront);
    ccstd::hash_combine(hashValue, dss.stencilWriteMaskFront);
    ccstd::hash_combine(hashValue, dss.stencilTestBack);
    ccstd::hash_combine(hashValue, dss.stencilFuncBack);
    ccstd::hash_combine(hashValue, dss.stencilRefBack);
    ccstd::hash_combine(hashValue, dss.stencilReadMaskBack);
    ccstd::hash_combine(hashValue, dss.stencilFailOpBack);
    ccstd::hash_combine(hashValue, dss.stencilZFailOpBack);
    ccstd::hash_combine(hashValue, dss.stencilPassOpBack);
    ccstd::hash_combine(hashValue, dss.stencilWriteMaskBack);
    return hashValue;
}

} // namespace

/*static*/
void Pass::fillPipelineInfo(Pass *pass, const IPassInfoFull &info) {
    if (info.priority.has_value()) {
        pass->_priority = static_cast<pipeline::RenderPriority>(info.priority.value());
    }
    if (info.primitive.has_value()) {
        pass->_primitive = info.primitive.value();
    }
    if (info.stage.has_value()) {
        pass->_stage = info.stage.value();
    }
    if (info.dynamicStates.has_value()) {
        pass->_dynamicStates = info.dynamicStates.value();
    }
    if (info.phase.has_value()) {
        pass->_phaseString = info.phase.value();
        pass->_phase = pipeline::getPhaseID(pass->_phaseString);
    }

    if (info.blendState.has_value()) {
        info.blendState.value().assignToGFXBlendState(pass->_blendState);
    }

    if (info.rasterizerState.has_value()) {
        info.rasterizerState.value().assignToGFXRasterizerState(pass->_rs);
    }

    if (info.depthStencilState.has_value()) {
        info.depthStencilState.value().assignToGFXDepthStencilState(pass->_depthStencilState);
    }
}

/* static */
ccstd::hash_t Pass::getPassHash(Pass *pass) {
    ccstd::hash_t hashValue{666};
    ccstd::hash_combine(hashValue, pass->_primitive);
    ccstd::hash_combine(hashValue, pass->_dynamicStates);
    ccstd::hash_combine(hashValue, serializeBlendState(pass->_blendState));
    ccstd::hash_combine(hashValue, serializeDepthStencilState(pass->_depthStencilState));
    ccstd::hash_combine(hashValue, serializeRasterizerState(pass->_rs));

    const auto *programLib = render::getProgramLibrary();
    if (programLib) {
        const auto &shaderKey = programLib->getKey(pass->_phaseID, pass->getProgram(), pass->getDefines());
        ccstd::hash_combine(hashValue, pass->_phaseID);
        ccstd::hash_range(hashValue, shaderKey.begin(), shaderKey.end());
    } else {
        const ccstd::string &shaderKey = ProgramLib::getInstance()->getKey(pass->getProgram(), pass->getDefines());
        ccstd::hash_range(hashValue, shaderKey.begin(), shaderKey.end());
    }

    return hashValue;
}

Pass::Pass() : Pass(Root::getInstance()) {}

Pass::Pass(Root *root) {
    _device = root->getDevice();
    _root = root;
    _phaseString = "default";
    _phase = pipeline::getPhaseID(_phaseString);
}

Pass::~Pass() {
    destroy();
}

void Pass::initialize(const IPassInfoFull &info) {
    doInit(info);
    resetUBOs();
    resetTextures();
    tryCompile();
}

uint32_t Pass::getHandle(const ccstd::string &name, uint32_t offset /* = 0 */, gfx::Type targetType /* = gfx::Type::UNKNOWN */) const {
    uint32_t handle = 0;
    auto iter = _propertyHandleMap.find(name); // handle = _propertyHandleMap[name];
    if (iter == _propertyHandleMap.end()) {
        return 0;
    }

    handle = iter->second;

    if (targetType != gfx::Type::UNKNOWN) {
        handle = customizeType(handle, targetType);
    } else if (offset) {
        handle = customizeType(handle, static_cast<gfx::Type>(static_cast<uint32_t>(getTypeFromHandle(handle)) - offset));
    }
    return handle + offset;
}

uint32_t Pass::getBinding(const ccstd::string &name) const {
    uint32_t handle = getHandle(name);
    if (0 == handle) {
        return -1;
    }
    return Pass::getBindingFromHandle(handle);
}

void Pass::setUniform(uint32_t handle, const MaterialProperty &value) {
    const uint32_t binding = Pass::getBindingFromHandle(handle);
    const gfx::Type type = Pass::getTypeFromHandle(handle);
    const uint32_t ofs = Pass::getOffsetFromHandle(handle);
    auto &block = _blocks[binding];
#if CC_DEBUG
    auto validatorIt = type2validator.find(type);
    if (validatorIt != type2validator.end()) {
        if (!validatorIt->second(value)) {
            const ccstd::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
            debug::errorID(12011, binding, stack.c_str());
        }
    }
#endif

    auto writerIt = type2writer.find(type);
    if (writerIt != type2writer.end()) {
        writerIt->second(block.data, value, static_cast<int>(ofs));
    }

    _rootBufferDirty = true;
}

MaterialProperty Pass::getUniform(uint32_t handle) const {
    MaterialProperty out;
    const uint32_t binding = Pass::getBindingFromHandle(handle);
    const gfx::Type type = Pass::getTypeFromHandle(handle);
    const uint32_t ofs = Pass::getOffsetFromHandle(handle);
    const auto &block = _blocks[binding];
    auto iter = type2reader.find(type);
    if (iter != type2reader.end()) {
        iter->second(block.data, out, static_cast<int>(ofs));
    }
    return out;
}

void Pass::setUniformArray(uint32_t handle, const MaterialPropertyList &value) {
    const uint32_t binding = Pass::getBindingFromHandle(handle);
    const gfx::Type type = Pass::getTypeFromHandle(handle);
    const uint32_t stride = gfx::getTypeSize(type) >> 2;
    auto &block = _blocks[binding];
    uint32_t ofs = Pass::getOffsetFromHandle(handle);
    for (size_t i = 0; i < value.size(); i++, ofs += stride) {
        if (value[i].index() == 0) {
            continue;
        }
        auto iter = type2writer.find(type);
        if (iter != type2writer.end()) {
            iter->second(block.data, value[i], static_cast<int>(ofs));
        }
    }
    _rootBufferDirty = true;
}

void Pass::bindTexture(uint32_t binding, gfx::Texture *value, uint32_t index) {
    _descriptorSet->bindTexture(binding, value, index);
}

void Pass::bindSampler(uint32_t binding, gfx::Sampler *value, uint32_t index) {
    _descriptorSet->bindSampler(binding, value, index);
}

void Pass::setDynamicState(gfx::DynamicStateFlagBit state, float value) {
    auto &ds = _dynamics[static_cast<uint32_t>(state)];
    if (ds.value == value) {
        return;
    }

    ds.value = value;
    ds.dirty = true;
}

void Pass::overridePipelineStates(const IPassInfo & /*original*/, const PassOverrides & /*overrides*/) {
    CC_LOG_WARNING("base pass cannot override states, please use pass instance instead.");
}

void Pass::update() {
    if (_descriptorSet == nullptr) {
        debug::errorID(12006);
        return;
    }

    if (_rootBufferDirty && _rootBuffer) {
        _rootBuffer->update(_rootBlock->getData(), _rootBlock->byteLength());
        _rootBufferDirty = false;
    }
    _descriptorSet->update();
}

pipeline::InstancedBuffer *Pass::getInstancedBuffer(int32_t extraKey) {
    auto iter = _instancedBuffers.find(extraKey);
    if (iter != _instancedBuffers.end()) {
        return iter->second.get();
    }
    auto *instancedBuffer = ccnew pipeline::InstancedBuffer(this);
    _instancedBuffers[extraKey] = instancedBuffer;
    return instancedBuffer;
}

void Pass::destroy() {
    if (!_buffers.empty()) {
        for (const auto &u : _shaderInfo->blocks) {
            _buffers[u.binding]->destroy();
        }
    }

    _buffers.clear();

    if (_rootBuffer) {
        _rootBuffer->destroy();
        _rootBuffer = nullptr;
    }

    for (auto &ib : _instancedBuffers) {
        ib.second->destroy();
    }
    _instancedBuffers.clear();

    // NOTE: There may be many passes reference the same descriptor set,
    // so here we can't use _descriptorSet->destroy() to release it.
    // Its type is IntrusivePtr<gfx::DescriptorSet>, so just set it to nullptr,
    // and let its destructor to destroy it.
    _descriptorSet = nullptr;
}

void Pass::resetUniform(const ccstd::string &name) {
    const uint32_t handle = getHandle(name);
    if (0 == handle) {
        return;
    }
    const gfx::Type type = Pass::getTypeFromHandle(handle);
    const uint32_t binding = Pass::getBindingFromHandle(handle);
    const uint32_t ofs = Pass::getOffsetFromHandle(handle);
    const uint32_t count = Pass::getCountFromHandle(handle);
    auto &block = _blocks[binding];
    ccstd::optional<IPropertyValue> givenDefaultOpt;
    auto iter = _properties.find(name);
    if (iter != _properties.end()) {
        givenDefaultOpt = iter->second.value;
    }

    if (givenDefaultOpt.has_value()) {
        const auto &value = givenDefaultOpt.value();
        if (ccstd::holds_alternative<ccstd::vector<float>>(value)) {
            const auto &floatArr = ccstd::get<ccstd::vector<float>>(value);
            auto iter = type2writer.find(type);
            if (iter != type2writer.end()) {
                CC_ASSERT_EQ(floatArr.size(), 2);
                iter->second(block.data, toMaterialProperty(type, floatArr), static_cast<int32_t>(ofs));
            }
        }
    }

    _rootBufferDirty = true;
}

void Pass::resetTexture(const ccstd::string &name) {
    resetTexture(name, 0);
}

void Pass::resetTexture(const ccstd::string &name, uint32_t index) {
    const uint32_t handle = getHandle(name);
    if (0 == handle) {
        return;
    }
    const gfx::Type type = Pass::getTypeFromHandle(handle);
    const uint32_t binding = Pass::getBindingFromHandle(handle);
    ccstd::string texName;
    const IPropertyInfo *info = nullptr;
    auto iter = _properties.find(name);
    if (iter != _properties.end()) {
        if (iter->second.value.has_value()) {
            info = &iter->second;
            const ccstd::string *pStrVal = ccstd::get_if<ccstd::string>(&iter->second.value.value());
            if (pStrVal != nullptr) {
                texName = (*pStrVal) + getStringFromType(type);
            }
        }
    }

    if (texName.empty()) {
        texName = getDefaultStringFromType(type);
    }

    auto *textureBase = BuiltinResMgr::getInstance()->get<TextureBase>(texName);
    gfx::Texture *texture = textureBase != nullptr ? textureBase->getGFXTexture() : nullptr;
    ccstd::optional<gfx::SamplerInfo> samplerInfo;
    if (info != nullptr && info->samplerHash.has_value()) {
        samplerInfo = gfx::Sampler::unpackFromHash(info->samplerHash.value());
    } else if (textureBase != nullptr) {
        samplerInfo = textureBase->getSamplerInfo();
    }

    if (samplerInfo.has_value()) {
        auto *sampler = _device->getSampler(samplerInfo.value());
        _descriptorSet->bindSampler(binding, sampler, index);
        _descriptorSet->bindTexture(binding, texture, index);
    } else {
        CC_LOG_WARNING("sampler hash could not be found!");
    }
}

void Pass::resetUBOs() {
    auto updateBuffer = [&](const IBlockInfo &u) {
        uint32_t ofs = 0;
        for (const auto &cur : u.members) {
            const auto &block = _blocks[u.binding];
            auto iter = _properties.find(cur.name);
            const auto &value =
                (iter != _properties.end() && iter->second.value.has_value()
                     ? ccstd::get<ccstd::vector<float>>(iter->second.value.value())
                     : getDefaultFloatArrayFromType(cur.type));
            const uint32_t size = (gfx::getTypeSize(cur.type) >> 2) * cur.count;
            for (size_t k = 0; (k + value.size()) <= size; k += value.size()) {
                std::copy(value.begin(), value.end(), block.data + ofs + k);
            }
            ofs += size;
        }
    };
    for (const auto &u : _shaderInfo->blocks) {
        updateBuffer(u);
    }
    _rootBufferDirty = true;
}

void Pass::resetTextures() {
    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        const auto &set = _shaderInfo->descriptors.at(
            static_cast<size_t>(pipeline::SetIndex::MATERIAL));
        for (const auto &combined : set.samplerTextures) {
            for (int32_t j = 0; j < combined.count; j++) {
                resetTexture(combined.name, j);
            }
        }
    } else {
        for (const auto &u : _shaderInfo->samplerTextures) {
            for (int32_t j = 0; j < u.count; j++) {
                resetTexture(u.name, j);
            }
        }
    }
}

bool Pass::tryCompile() {
    if (_root->getPipeline() == nullptr) {
        return false;
    }

    syncBatchingScheme();
    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        auto *shaderProxy = programLib->getProgramVariant(_device, _phaseID, _programName, _defines);
        if (!shaderProxy) {
            CC_LOG_WARNING("create shader %s failed", _programName.c_str());
            return false;
        }
        _shader = shaderProxy->getShader();
        _pipelineLayout = programLib->getPipelineLayout(_device, _phaseID, _programName);
    } else {
        auto *shader = ProgramLib::getInstance()->getGFXShader(_device, _programName, _defines, _root->getPipeline());
        if (!shader) {
            CC_LOG_WARNING("create shader %s failed", _programName.c_str());
            return false;
        }
        _shader = shader;
        _pipelineLayout = ProgramLib::getInstance()->getTemplateInfo(_programName)->pipelineLayout;
    }

    _hash = Pass::getPassHash(this);
    return true;
}

gfx::Shader *Pass::getShaderVariant() {
    return getShaderVariant({});
}

gfx::Shader *Pass::getShaderVariant(const ccstd::vector<IMacroPatch> &patches) {
    if (!_shader && !tryCompile()) {
        CC_LOG_WARNING("pass resources incomplete");
        return nullptr;
    }

    if (patches.empty()) {
        return _shader;
    }
#if CC_EDITOR
    for (const auto &patch : patches) {
        std::size_t pos = patch.name.find_first_of("CC_");
        if (pos != 0) { // not startsWith CC_
            CC_LOG_WARNING("cannot patch non-builtin macros");
            return nullptr;
        }
    }
#endif

    auto *pipeline = _root->getPipeline();
    for (const auto &patch : patches) {
        _defines[patch.name] = patch.value;
    }

    if (isBlend()) {
        _defines["CC_IS_TRANSPARENCY_PASS"] = MacroValue(true);
    }

    gfx::Shader *shader = nullptr;
    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        const auto *program = programLib->getProgramVariant(_device, _phaseID, _programName, _defines);
        if (program) {
            shader = program->getShader();
        }
    } else {
        shader = ProgramLib::getInstance()->getGFXShader(_device, _programName, _defines, pipeline);
    }

    for (const auto &patch : patches) {
        auto iter = _defines.find(patch.name);
        if (iter != _defines.end()) {
            _defines.erase(iter);
        }
    }
    return shader;
}

bool Pass::isBlend() {
    bool isBlend = false;
    for (const auto target : _blendState.targets) {
        if (target.blend) {
            isBlend = true;
        }
    }

    return isBlend;
}

IPassInfoFull Pass::getPassInfoFull() const {
    IPassInfoFull ret;
    ret.passIndex = _passIndex;
    ret.defines = _defines;

    ret.program = _programName;
    ret.propertyIndex = _propertyIndex;
    ret.properties = _properties;
    ret.priority = static_cast<int32_t>(_priority);

    ret.primitive = _primitive;
    ret.stage = _stage;

    RasterizerStateInfo rsInfo;
    rsInfo.fromGFXRasterizerState(_rs);
    ret.rasterizerState = rsInfo;

    DepthStencilStateInfo dsInfo;
    dsInfo.fromGFXDepthStencilState(_depthStencilState);
    ret.depthStencilState = dsInfo;

    BlendStateInfo bsInfo;
    bsInfo.fromGFXBlendState(_blendState);
    ret.blendState = bsInfo;

    ret.dynamicStates = _dynamicStates;
    ret.phase = _phaseString;

    ret.passID = _passID;
    ret.subpassID = _subpassID;
    ret.phaseID = _phaseID;

    return ret;
}

void Pass::setState(const gfx::BlendState &bs, const gfx::DepthStencilState &dss, const gfx::RasterizerState &rs, gfx::DescriptorSet *ds) {
    // cjh how to control lifecycle?
    _blendState = bs;
    _depthStencilState = dss;
    _rs = rs;
    _descriptorSet = ds;
}

void Pass::doInit(const IPassInfoFull &info, bool /*copyDefines*/ /* = false */) {
    auto *programLib = ProgramLib::getInstance();
    _priority = pipeline::RenderPriority::DEFAULT;
    _stage = pipeline::RenderPassStage::DEFAULT;
    auto *programLib2 = render::getProgramLibrary();
    if (programLib2) {
        const auto *rendering = render::getRenderingModule();
        CC_EXPECTS(rendering);
        if (info.phaseID != INVALID_ID) {
            _passID = info.passID;
            _subpassID = info.subpassID;
            _phaseID = info.phaseID;
        } else {
            if (info.pass) {
                _passID = rendering->getPassID(*info.pass);
            } else {
                _passID = rendering->getPassID("default");
            }
            CC_ENSURES(_passID != INVALID_ID);
            if (info.subpass) {
                CC_EXPECTS(!info.subpass->empty());
                _subpassID = rendering->getSubpassID(_passID, *info.subpass);
                CC_ENSURES(_subpassID != INVALID_ID);
            }
            if (info.phase) {
                _phaseID = rendering->getPhaseID(getSubpassOrPassID(), *info.phase);
            } else {
                _phaseID = rendering->getPhaseID(getSubpassOrPassID(), "default");
            }
        }
        if (_passID == INVALID_ID) {
            CC_LOG_ERROR("Invalid pass ID");
            return;
        }
        if (info.subpass && _subpassID == INVALID_ID) {
            CC_LOG_ERROR("Invalid subpass ID");
            return;
        }
        if (_phaseID == INVALID_ID) {
            CC_LOG_ERROR("Invalid phase ID");
            return;
        }
    }
    _phaseString = "default";
    _phase = pipeline::getPhaseID(_phaseString);
    _primitive = gfx::PrimitiveMode::TRIANGLE_LIST;

    _passIndex = info.passIndex;
    _propertyIndex = info.propertyIndex.has_value() ? info.propertyIndex.value() : info.passIndex;
    _programName = info.program;
    _defines = info.defines; // cjh c++ always does copy by assignment.  copyDefines ? ({ ...info.defines }) : info.defines;
    // init shader info
    if (programLib2) {
        CC_EXPECTS(_phaseID != INVALID_ID);
        _shaderInfo = &programLib2->getProgramInfo(_phaseID, _programName);
    } else {
        _shaderInfo = programLib->getTemplate(info.program);
    }
    if (info.properties.has_value()) {
        _properties = info.properties.value();
    }

    // init gfx
    gfx::Device *device = _device;
    Pass::fillPipelineInfo(this, info);
    if (info.stateOverrides.has_value()) {
        Pass::fillPipelineInfo(this, IPassInfoFull(info.stateOverrides.value()));
    }

    // init descriptor set
    gfx::DescriptorSetInfo dsInfo;
    if (programLib2) {
        CC_EXPECTS(_phaseID != INVALID_ID);
        dsInfo.layout = &programLib2->getMaterialDescriptorSetLayout(
            _device, _phaseID, _programName);
    } else {
        dsInfo.layout = programLib->getDescriptorSetLayout(_device, info.program);
    }
    _descriptorSet = _device->createDescriptorSet(dsInfo);

    // calculate total size required
    const auto &blocks = _shaderInfo->blocks;
    const auto *tmplInfo =
        programLib2
            ? nullptr
            : programLib->getTemplateInfo(info.program);
    const auto &blockSizes = [&]() -> const auto & {
        if (programLib2) {
            return programLib2->getBlockSizes(_phaseID, _programName);
        }
        return tmplInfo->blockSizes;
    }
    ();
    const auto &handleMap = [&]() -> const auto & {
        if (programLib2) {
            CC_EXPECTS(_phaseID != INVALID_ID);
            return programLib2->getHandleMap(_phaseID, _programName);
        }
        return tmplInfo->handleMap;
    }
    ();

    // build uniform blocks
    if (programLib2) {
        const auto &shaderInfo = programLib2->getShaderInfo(_phaseID, _programName);
        buildMaterialUniformBlocks(shaderInfo.blocks, blockSizes);
    } else {
        buildUniformBlocks(blocks, blockSizes);
    }

    // store handles
    _propertyHandleMap = handleMap;
    auto &directHandleMap = _propertyHandleMap;
    ccstd::unordered_map<ccstd::string, uint32_t> indirectHandleMap;
    for (const auto &properties : _properties) {
        if (!properties.second.handleInfo.has_value()) {
            continue;
        }

        const auto &propVal = properties.second.handleInfo.value();
        indirectHandleMap[properties.first] = getHandle(std::get<0>(propVal), std::get<1>(propVal), std::get<2>(propVal));
    }

    utils::mergeToMap(directHandleMap, indirectHandleMap);
}

namespace {

void calculateTotalSize(
    gfx::Device *device, const uint32_t lastSize,
    IntrusivePtr<gfx::Buffer> &rootBuffer,
    IntrusivePtr<ArrayBuffer> &rootBlock,
    ccstd::vector<uint32_t> &startOffsets) {
    uint32_t totalSize = !startOffsets.empty() ? (startOffsets[startOffsets.size() - 1] + lastSize) : 0;
    if (totalSize > 0) {
        gfx::BufferInfo bufferInfo;
        bufferInfo.usage = gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST;
        bufferInfo.memUsage = gfx::MemoryUsageBit::DEVICE;
        // https://bugs.chromium.org/p/chromium/issues/detail?id=988988
        const auto alignment = device->getCapabilities().uboOffsetAlignment;
        bufferInfo.size = static_cast<int32_t>(std::ceil(static_cast<float>(totalSize) / static_cast<float>(alignment))) * alignment;
        rootBuffer = device->createBuffer(bufferInfo);
        rootBlock = ccnew ArrayBuffer(totalSize);
    }
}

} // namespace

void Pass::buildUniformBlock(
    uint32_t binding, int32_t size,
    gfx::BufferViewInfo &bufferViewInfo,
    ccstd::vector<uint32_t> &startOffsets,
    size_t &count) {
    const auto alignment = _device->getCapabilities().uboOffsetAlignment;
    bufferViewInfo.buffer = _rootBuffer;
    bufferViewInfo.offset = startOffsets[count++];
    bufferViewInfo.range = static_cast<int32_t>(std::ceil(static_cast<float>(size) / static_cast<float>(alignment))) * alignment;
    if (binding >= _buffers.size()) {
        _buffers.resize(binding + 1);
    }
    auto *bufferView = _device->createBuffer(bufferViewInfo);
    _buffers[binding] = bufferView;
    // non-builtin UBO data pools, note that the effect compiler
    // guarantees these bindings to be consecutive, starting from 0 and non-array-typed
    if (binding >= _blocks.size()) {
        _blocks.resize(binding + 1);
    }
    _blocks[binding].data = reinterpret_cast<float *>(const_cast<uint8_t *>(_rootBlock->getData()) + bufferViewInfo.offset);
    _blocks[binding].count = size / 4;
    _blocks[binding].offset = bufferViewInfo.offset / 4;
    _descriptorSet->bindBuffer(binding, bufferView);
}

void Pass::buildMaterialUniformBlocks(
    const ccstd::vector<gfx::UniformBlock> &blocks,
    const ccstd::vector<int32_t> &blockSizes) {
    gfx::Device *device = _device;
    const auto alignment = device->getCapabilities().uboOffsetAlignment;
    ccstd::vector<uint32_t> startOffsets;
    startOffsets.reserve(blocks.size());
    uint32_t lastSize = 0;
    uint32_t lastOffset = 0;
    for (size_t i = 0; i < blocks.size(); i++) {
        const auto &block = blocks[i];
        if (static_cast<pipeline::SetIndex>(block.set) != pipeline::SetIndex::MATERIAL) {
            continue;
        }
        const auto &size = blockSizes[i];
        startOffsets.emplace_back(lastOffset);
        lastOffset += static_cast<int32_t>(std::ceil(static_cast<float>(size) / static_cast<float>(alignment))) * alignment;
        lastSize = size;
    }

    // create gfx buffer resource
    if (lastSize != 0) {
        calculateTotalSize(device, lastSize, _rootBuffer, _rootBlock, startOffsets);
    }

    // create buffer views
    gfx::BufferViewInfo bufferViewInfo{};
    for (size_t i = 0, count = 0; i < blocks.size(); i++) {
        const auto &block = blocks[i];
        if (static_cast<pipeline::SetIndex>(block.set) != pipeline::SetIndex::MATERIAL) {
            continue;
        }
        const auto binding = block.binding;
        int32_t size = blockSizes[i];
        buildUniformBlock(binding, size, bufferViewInfo, startOffsets, count);
    }
}

void Pass::buildUniformBlocks(
    const ccstd::vector<IBlockInfo> &blocks,
    const ccstd::vector<int32_t> &blockSizes) {
    gfx::Device *device = _device;
    const auto alignment = device->getCapabilities().uboOffsetAlignment;
    ccstd::vector<uint32_t> startOffsets;
    startOffsets.reserve(blocks.size());
    uint32_t lastSize = 0;
    uint32_t lastOffset = 0;
    for (size_t i = 0; i < blocks.size(); i++) {
        const auto &size = blockSizes[i];
        startOffsets.emplace_back(lastOffset);
        lastOffset += static_cast<int32_t>(std::ceil(static_cast<float>(size) / static_cast<float>(alignment))) * alignment;
        lastSize = size;
    }

    // create gfx buffer resource
    calculateTotalSize(device, lastSize, _rootBuffer, _rootBlock, startOffsets);

    // create buffer views
    gfx::BufferViewInfo bufferViewInfo;
    for (size_t i = 0, count = 0; i < blocks.size(); i++) {
        const auto binding = blocks[i].binding;
        int32_t size = blockSizes[i];
        buildUniformBlock(binding, size, bufferViewInfo, startOffsets, count);
    }
}

void Pass::syncBatchingScheme() {
    auto iter = _defines.find("USE_INSTANCING");
    if (iter != _defines.end()) {
        if (_device->hasFeature(gfx::Feature::INSTANCED_ARRAYS) && macroRecordAsBool(iter->second)) {
            _batchingScheme = BatchingSchemes::INSTANCING;
        } else {
            iter->second = false;
            _batchingScheme = BatchingSchemes::NONE;
        }
    } else {
        _batchingScheme = BatchingSchemes::NONE;
    }
}

void Pass::initPassFromTarget(Pass *target, const gfx::DepthStencilState &dss, ccstd::hash_t hashFactor) {
    _priority = target->_priority;
    _stage = target->_stage;
    _phase = target->_phase;
    _passID = target->_passID;
    _subpassID = target->_subpassID;
    _phaseID = target->_phaseID;
    _batchingScheme = target->_batchingScheme;
    _primitive = target->_primitive;
    _dynamicStates = target->_dynamicStates;
    _blendState = *target->getBlendState();
    _depthStencilState = dss;
    _descriptorSet = target->_descriptorSet;
    _rs = *target->getRasterizerState();
    _passIndex = target->_passIndex;
    _propertyIndex = target->_propertyIndex;
    _programName = target->getProgram();
    _defines = target->_defines;
    _shaderInfo = target->_shaderInfo; // cjh how to release?
    _properties = target->_properties;

    _blocks = target->_blocks;
    _dynamics = target->_dynamics;

    _shader = target->_shader;

    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        _pipelineLayout = programLib->getPipelineLayout(_device, _phaseID, _programName);
    } else {
        _pipelineLayout = ProgramLib::getInstance()->getTemplateInfo(_programName)->pipelineLayout;
    }
    _hash = target->_hash ^ hashFactor;
}

void Pass::updatePassHash() {
    _hash = Pass::getPassHash(this);
}

const gfx::DescriptorSetLayout *Pass::getLocalSetLayout() const {
    auto *programLib = render::getProgramLibrary();
    if (programLib) {
        return &programLib->getLocalDescriptorSetLayout(_device, _phaseID, _programName);
    }
    return ProgramLib::getInstance()->getDescriptorSetLayout(_device, _programName, true);
}

} // namespace scene
} // namespace cc
