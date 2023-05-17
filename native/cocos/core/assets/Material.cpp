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

#include "core/assets/Material.h"

#include "base/Utils.h"
#include "core/Root.h"
#include "core/assets/EffectAsset.h"
#include "core/builtin/BuiltinResMgr.h"
#include "core/platform/Debug.h"
#include "math/Color.h"
#include "renderer/pipeline/helper/Utils.h"
#include "scene/Pass.h"
namespace cc {

/* static */
ccstd::hash_t Material::getHashForMaterial(Material *material) {
    if (material == nullptr) {
        return 0;
    }

    ccstd::hash_t hash = 0U;
    const auto &passes = *material->_passes;
    for (const auto &pass : passes) {
        hash ^= pass->getHash();
    }
    return hash;
}

Material::Material() {
    _passes = std::make_shared<ccstd::vector<IntrusivePtr<scene::Pass>>>();
}

Material::~Material() = default;

void Material::initialize(const IMaterialInfo &info) {
    auto &passes = *_passes;
    if (!passes.empty()) {
        debug::warnID(12005);
        return;
    }

    if (!_defines.empty()) {
        _defines.clear();
    }
    if (!_states.empty()) {
        _states.clear();
    }
    if (!_props.empty()) {
        _props.clear();
    }

    fillInfo(info);
    update();
}

void Material::reset(const IMaterialInfo &info) { // to be consistent with other assets
    initialize(info);
}

bool Material::destroy() {
    doDestroy();
    return Super::destroy();
}

void Material::doDestroy() {
    auto &passes = *_passes;
    if (!passes.empty()) {
        for (const auto &pass : passes) {
            pass->destroy();
        }
    }
    passes.clear();
    emit<PassesUpdated>();
}

void Material::recompileShaders(const MacroRecord & /*overrides*/, index_t /*passIdx*/) {
    CC_ABORT();
    CC_LOG_WARNING("Shaders in material asset '%s' cannot be modified at runtime, please instantiate the material first.", _name.c_str());
}

void Material::overridePipelineStates(const PassOverrides & /*overrides*/, index_t /*passIdx*/) {
    CC_ABORT();
    CC_LOG_WARNING("Pipeline states in material asset '%s' cannot be modified at runtime, please instantiate the material first.", _name.c_str());
}

void Material::onLoaded() {
    update();
}

void Material::resetUniforms(bool clearPasses /* = true */) {
    const auto &passes = *_passes;
    _props.resize(passes.size());

    if (!clearPasses) {
        return;
    }

    for (const auto &pass : passes) {
        pass->resetUBOs();
        pass->resetTextures();
    }
}

void Material::setProperty(const ccstd::string &name, const MaterialPropertyVariant &val, index_t passIdx /* = CC_INVALID_INDEX */) {
    const auto &passes = *_passes;
    bool success = false;
    if (passIdx == CC_INVALID_INDEX) { // try set property for all applicable passes
        size_t len = passes.size();
        for (size_t i = 0; i < len; i++) {
            const auto &pass = passes[i];
            if (uploadProperty(pass, name, val)) {
                _props[pass->getPropertyIndex()][name] = val;
                success = true;
            }
        }
    } else {
        if (passIdx >= passes.size()) {
            CC_LOG_WARNING("illegal pass index: %d.", passIdx);
            return;
        }

        const auto &pass = passes[passIdx];
        if (uploadProperty(pass, name, val)) {
            _props[pass->getPropertyIndex()][name] = val;
            success = true;
        }
    }

    if (!success) {
        CC_LOG_WARNING("illegal property name: %s.", name.c_str());
    }
}

void Material::setPropertyNull(const ccstd::string &name, index_t passIdx) {
    MaterialPropertyVariant val;
    setProperty(name, val, passIdx);
}

#define CC_MATERIAL_SETPROPERTY_IMPL(funcNameSuffix, type)                                                                     \
    void Material::setProperty##funcNameSuffix(const ccstd::string &name, type val, index_t passIdx /* = CC_INVALID_INDEX*/) { \
        setProperty(name, val, passIdx);                                                                                       \
    }

CC_MATERIAL_SETPROPERTY_IMPL(Float32, float)
CC_MATERIAL_SETPROPERTY_IMPL(Int32, int32_t)
CC_MATERIAL_SETPROPERTY_IMPL(Vec2, const Vec2 &)
CC_MATERIAL_SETPROPERTY_IMPL(Vec3, const Vec3 &)
CC_MATERIAL_SETPROPERTY_IMPL(Vec4, const Vec4 &)
CC_MATERIAL_SETPROPERTY_IMPL(Color, const cc::Color &)
CC_MATERIAL_SETPROPERTY_IMPL(Mat3, const Mat3 &)
CC_MATERIAL_SETPROPERTY_IMPL(Mat4, const Mat4 &)
CC_MATERIAL_SETPROPERTY_IMPL(Quaternion, const Quaternion &)
CC_MATERIAL_SETPROPERTY_IMPL(TextureBase, TextureBase *)
CC_MATERIAL_SETPROPERTY_IMPL(GFXTexture, gfx::Texture *)

#undef CC_MATERIAL_SETPROPERTY_IMPL

#define CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(funcNameSuffix, type)                                                                                           \
    void Material::setProperty##funcNameSuffix##Array(const ccstd::string &name, const ccstd::vector<type> &val, index_t /*passIdx = CC_INVALID_INDEX*/) { \
        MaterialPropertyList propertyArr;                                                                                                                  \
        propertyArr.reserve(val.size());                                                                                                                   \
        for (const auto &e : val) {                                                                                                                        \
            propertyArr.emplace_back(e);                                                                                                                   \
        }                                                                                                                                                  \
        setProperty(name, propertyArr);                                                                                                                    \
    }

CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Float32, float)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Int32, int32_t)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Vec2, Vec2)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Vec3, Vec3)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Vec4, Vec4)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Color, Color)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Mat3, Mat3)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Mat4, Mat4)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(Quaternion, Quaternion)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(TextureBase, TextureBase *)
CC_MATERIAL_SETPROPERTY_ARRAY_IMPL(GFXTexture, gfx::Texture *)

#undef CC_MATERIAL_SETPROPERTY_ARRAY_IMPL

const MaterialPropertyVariant *Material::getProperty(const ccstd::string &name, index_t passIdx) const {
    if (passIdx == CC_INVALID_INDEX) { // try get property in all possible passes
        const auto &propsArray = _props;
        size_t len = propsArray.size();
        for (size_t i = 0; i < len; i++) {
            const auto &props = propsArray[i];
            auto iter = props.find(name);
            if (iter != props.end()) {
                return &iter->second;
            }
        }
    } else {
        if (passIdx >= _props.size()) {
            CC_LOG_WARNING("illegal pass index: %d.", passIdx);
            return nullptr;
        }

        const auto &passes = *_passes;
        const auto &props = _props[passes[passIdx]->getPropertyIndex()];
        auto iter = props.find(name);
        if (iter != props.end()) {
            return &iter->second;
        }
    }
    return nullptr;
}

void Material::fillInfo(const IMaterialInfo &info) {
    if (info.technique != ccstd::nullopt) {
        _techIdx = info.technique.value();
    }

    if (info.effectAsset != nullptr) {
        _effectAsset = info.effectAsset;
    } else if (info.effectName != ccstd::nullopt) {
        _effectAsset = EffectAsset::get(info.effectName.value());
    }

    if (info.defines != ccstd::nullopt) {
        prepareInfo(info.defines.value(), _defines);
    }
    if (info.states != ccstd::nullopt) {
        prepareInfo(info.states.value(), _states);
    }
}

void Material::copy(const Material *mat, IMaterialInfo *overrides) {
    if (mat == nullptr) {
        return;
    }

    _techIdx = mat->_techIdx;
    _props.resize(mat->_props.size());
    for (size_t i = 0, len = mat->_props.size(); i < len; ++i) {
        _props[i] = mat->_props[i];
    }
    _defines.resize(mat->_defines.size());
    for (size_t i = 0, len = mat->_defines.size(); i < len; ++i) {
        _defines[i] = mat->_defines[i];
    }
    _states.resize(mat->_states.size());
    for (size_t i = 0, len = mat->_states.size(); i < len; ++i) {
        _states[i] = mat->_states[i];
    }
    _effectAsset = mat->_effectAsset;
    if (overrides) {
        fillInfo(*overrides);
    }
    update();
}

void Material::update(bool keepProps /* = true*/) {
    if (_effectAsset) {
        *_passes = createPasses();
        CC_ASSERT(!_effectAsset->_techniques.empty());
        // handle property values
        size_t totalPasses = _effectAsset->_techniques[_techIdx].passes.size();
        _props.resize(totalPasses);
        if (keepProps) {
            auto cb = [this](auto *pass, size_t i) {
                if (i >= _props.size()) {
                    _props.resize(i + 1);
                }

                auto &props = _props[i];

                if (pass->getPropertyIndex() != CC_INVALID_INDEX) {
                    props = _props[pass->getPropertyIndex()];
                }

                for (const auto &prop : props) {
                    uploadProperty(pass, prop.first, prop.second);
                }
            };

            const auto &passes = *_passes;
            for (size_t i = 0, len = passes.size(); i < len; ++i) {
                cb(passes[i].get(), i);
            }
        }

        emit<PassesUpdated>();
    }
    _hash = Material::getHashForMaterial(this);
}

ccstd::vector<IntrusivePtr<scene::Pass>> Material::createPasses() {
    ccstd::vector<IntrusivePtr<scene::Pass>> passes;
    ITechniqueInfo *tech = nullptr;
    if (_techIdx < _effectAsset->_techniques.size()) {
        tech = &_effectAsset->_techniques[_techIdx];
    }

    if (tech == nullptr) {
        return passes;
    }

    size_t passNum = tech->passes.size();
    for (size_t k = 0; k < passNum; ++k) {
        auto &passInfo = tech->passes[k];
        index_t propIdx = passInfo.passIndex = static_cast<index_t>(k);

        if (propIdx >= _defines.size()) {
            _defines.resize(propIdx + 1);
        }
        passInfo.defines = _defines[propIdx];
        auto &defines = passInfo.defines;

        if (propIdx >= _states.size()) {
            _states.resize(propIdx + 1);
        }
        passInfo.stateOverrides = _states[propIdx];

        if (passInfo.propertyIndex.has_value()) {
            utils::mergeToMap(defines, _defines[passInfo.propertyIndex.value()]);
        }

        if (passInfo.embeddedMacros.has_value()) {
            utils::mergeToMap(defines, passInfo.embeddedMacros.value());
        }

        if (passInfo.switch_.has_value() && defines.find(passInfo.switch_.value()) == defines.end()) {
            continue;
        }

        auto *pass = ccnew scene::Pass(Root::getInstance());
        pass->initialize(passInfo);
        passes.emplace_back(pass);
    }
    return passes;
}

bool Material::uploadProperty(scene::Pass *pass, const ccstd::string &name, const MaterialPropertyVariant &val) {
    uint32_t handle = pass->getHandle(name);
    if (!handle) {
        return false;
    }

    const auto type = scene::Pass::getTypeFromHandle(handle);
    if (type < gfx::Type::SAMPLER1D) {
        if (val.index() == MATERIAL_PROPERTY_INDEX_LIST) {
            pass->setUniformArray(handle, ccstd::get<MaterialPropertyList>(val));
        } else if (val.index() == MATERIAL_PROPERTY_INDEX_SINGLE) {
            const auto &passProps = pass->getProperties();
            auto iter = passProps.find(name);
            if (iter != passProps.end() && iter->second.linear.has_value()) {
                CC_ASSERT(ccstd::holds_alternative<MaterialProperty>(val));
                const auto &prop = ccstd::get<MaterialProperty>(val);
                Vec4 srgb;
                if (ccstd::holds_alternative<cc::Color>(prop)) {
                    srgb = ccstd::get<cc::Color>(prop).toVec4();
                } else if (ccstd::holds_alternative<Vec4>(prop)) {
                    srgb = ccstd::get<Vec4>(prop);
                } else {
                    CC_ABORT();
                }

                Vec4 linear;
                pipeline::srgbToLinear(&linear, srgb);
                linear.w = srgb.w;
                pass->setUniform(handle, linear);
            } else {
                pass->setUniform(handle, ccstd::get<MaterialProperty>(val));
            }
        } else {
            pass->resetUniform(name);
        }
    } else if (val.index() == MATERIAL_PROPERTY_INDEX_LIST) {
        const auto &textureArray = ccstd::get<MaterialPropertyList>(val);
        for (size_t i = 0; i < textureArray.size(); i++) {
            bindTexture(pass, handle, textureArray[i], static_cast<index_t>(i));
        }
    } else if (val.index() == MATERIAL_PROPERTY_INDEX_SINGLE) {
        bindTexture(pass, handle, ccstd::get<MaterialProperty>(val));
    } else {
        pass->resetTexture(name);
    }
    return true;
}

void Material::bindTexture(scene::Pass *pass, uint32_t handle, const MaterialProperty &val, uint32_t index) {
    if (pass == nullptr) {
        return;
    }

    const uint32_t binding = scene::Pass::getBindingFromHandle(handle);
    if (const auto *pTexture = ccstd::get_if<IntrusivePtr<gfx::Texture>>(&val)) {
        pass->bindTexture(binding, const_cast<gfx::Texture *>(pTexture->get()), index);
    } else if (const auto *pTextureBase = ccstd::get_if<IntrusivePtr<TextureBase>>(&val)) {
        auto *textureBase = pTextureBase->get();
        gfx::Texture *texture = nullptr;
        if (textureBase != nullptr) {
            texture = textureBase->getGFXTexture();
        }

        if (texture == nullptr) {
            CC_LOG_WARNING("Material(%p, %s)::bindTexture failed, texture is nullptr", this, _uuid.c_str());
            return;
        }

        if (texture->getWidth() == 0 || texture->getHeight() == 0) {
            CC_LOG_WARNING("Material(%p, %s)::bindTexture failed, texture size is 0", this, _uuid.c_str());
            return;
        }
        pass->bindTexture(binding, texture, index);
        pass->bindSampler(binding, textureBase->getGFXSampler(), index);
    }
}

void Material::initDefault(const ccstd::optional<ccstd::string> &uuid) {
    Super::initDefault(uuid);
    MacroRecord defines{{"USE_COLOR", true}};
    IMaterialInfo info;
    info.effectName = ccstd::string{"builtin-unlit"};
    info.defines = IMaterialInfo::DefinesType{defines};
    initialize(info);
    setProperty("mainColor", Color{0xFF, 0x00, 0xFF, 0xFF});
}

bool Material::validate() const {
    return _effectAsset != nullptr && !_effectAsset->isDefault() && !_passes->empty();
}

} // namespace cc
