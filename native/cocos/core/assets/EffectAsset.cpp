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

#include "core/assets/EffectAsset.h"
#include "core/Root.h"
#include "renderer/core/ProgramLib.h"

namespace cc {

IPassStates::IPassStates(const IPassInfoFull &o) {
    *this = o;
}

IPassStates &IPassStates::operator=(const IPassInfoFull &o) {
    priority          = o.priority;
    primitive         = o.primitive;
    stage             = o.stage;
    rasterizerState   = o.rasterizerState;
    depthStencilState = o.depthStencilState;
    blendState        = o.blendState;
    dynamicStates     = o.dynamicStates;
    phase             = o.phase;
    return *this;
}

void IPassStates::overrides(const IPassInfoFull &o) {
    if (o.priority.has_value()) {
        this->priority = o.priority.value();
    }
    if (o.primitive.has_value()) {
        this->primitive = o.primitive.value();
    }
    if (o.stage.has_value()) {
        this->stage = o.stage.value();
    }
    if (o.rasterizerState.has_value()) {
        this->rasterizerState = o.rasterizerState.value();
    }
    if (o.depthStencilState.has_value()) {
        this->depthStencilState = o.depthStencilState.value();
    }
    if (o.blendState.has_value()) {
        this->blendState = o.blendState.value();
    }
    if (o.dynamicStates.has_value()) {
        this->dynamicStates = o.dynamicStates.value();
    }
    if (o.phase.has_value()) {
        this->phase = o.phase.value();
    }
}

EffectAsset::RegisteredEffectAssetMap EffectAsset::effects;

/* static */
void EffectAsset::registerAsset(EffectAsset *asset) {
    if (asset == nullptr) {
        return;
    }

    EffectAsset::effects.emplace(asset->getName(), asset);
}

/* static */
void EffectAsset::remove(const std::string &name) {
    auto iter = EffectAsset::effects.find(name);
    if (iter != EffectAsset::effects.end() && iter->second->getName() == name) {
        EffectAsset::effects.erase(iter);
        return;
    }

    iter = EffectAsset::effects.begin();
    for (; iter != EffectAsset::effects.end(); ++iter) {
        if (iter->second->getUuid() == name) {
            break;
        }
    }

    if (iter != EffectAsset::effects.end()) {
        EffectAsset::effects.erase(iter);
    }
}

/* static */
void EffectAsset::remove(EffectAsset *asset) {
    if (asset == nullptr) {
        return;
    }

    auto iter = EffectAsset::effects.find(asset->getName());
    if (iter != EffectAsset::effects.end() && iter->second == asset) {
        EffectAsset::effects.erase(iter);
    }
}

/* static */
EffectAsset *EffectAsset::get(const std::string &name) {
    auto iter = EffectAsset::effects.find(name);
    if (iter != EffectAsset::effects.end()) {
        return iter->second;
    }

    iter = EffectAsset::effects.begin();
    for (; iter != EffectAsset::effects.end(); ++iter) {
        if (iter->second->getUuid() == name) {
            return iter->second;
        }
    }
    return nullptr;
}

void EffectAsset::onLoaded() {
    ProgramLib::getInstance()->registerEffect(this);
    EffectAsset::registerAsset(this);
    //cjh TODO:    if (!EDITOR){
    //cjh    legacyCC.game.once(legacyCC.Game.EVENT_ENGINE_INITED, this._precompile, this);
    // }
}

bool EffectAsset::destroy() {
    EffectAsset::remove(this);
    return Super::destroy();
}

void EffectAsset::initDefault(const cc::optional<std::string> &uuid) {
    Super::initDefault(uuid);
    const auto *effect = EffectAsset::get("unlit");
    _name              = "unlit";
    _shaders           = effect->_shaders;
    _combinations      = effect->_combinations;
    _techniques        = effect->_techniques; //cjh TODO: shared_ptr ?
}

bool EffectAsset::validate() const {
    return !_techniques.empty() && !_shaders.empty();
}

void EffectAsset::precompile() {
    Root *root = Root::getInstance();
    for (index_t i = 0; i < _shaders.size(); ++i) {
        auto shader = _shaders[i];
        if (i >= _combinations.size()) {
            continue;
        }

        auto combination = _combinations[i];
        if (combination.empty()) {
            continue;
        }

        // TODO(minggo): do unit test
        std::vector<MacroRecord> defines = EffectAsset::doCombine(std::vector<MacroRecord>(), combination, combination.begin());
        for (auto &define : defines) {
            ProgramLib::getInstance()->getGFXShader(root->getDevice(), shader.name, define, root->getPipeline());
        }
    }
}

/*
// input

const combination = {
USE_TEXTURE: [true, false],
COLOR_MODE: [0, 1, 2, 3],
ROUGHNESS_CHANNEL: ['r', 'g', 'b'],
};
 
// output

const defines = [
                 {
                 USE_TEXTURE: true,
                 COLOR_MODE: 0,
                 ROUGHNESS_CHANNEL: 'r'
                 },
                 {
                 USE_TEXTURE: true,
                 COLOR_MODE: 0,
                 ROUGHNESS_CHANNEL: 'g'
                 },
                 {
                 USE_TEXTURE: true,
                 COLOR_MODE: 0,
                 ROUGHNESS_CHANNEL: 'b'
                 },
                 {
                 USE_TEXTURE: true,
                 COLOR_MODE: 1,
                 ROUGHNESS_CHANNEL: 'r'
                 },
                 // ... all the combinations (2x4x3 in this case)
                 ];
 */
std::vector<MacroRecord> EffectAsset::doCombine(const std::vector<MacroRecord> &cur, const IPreCompileInfo &info, IPreCompileInfo::iterator iter) { //NOLINT(misc-no-recursion)
    if (iter == info.end()) {
        return cur;
    }

    const IPreCompileInfoValueType &values = iter->second;
    const std::string &             key    = iter->first;

    std::vector<MacroRecord> records;
    if (cur.empty()) {
        records = EffectAsset::generateRecords(key, values);
    } else {
        records = EffectAsset::insertInfoValue(cur, key, values);
    }

    return EffectAsset::doCombine(records, info, ++iter);
}

std::vector<MacroRecord> EffectAsset::generateRecords(const std::string &key, const IPreCompileInfoValueType &value) {
    std::vector<MacroRecord> ret;
    if (const auto *boolValues = cc::get_if<std::vector<bool>>(&value)) {
        for (const bool value : *boolValues) {
            MacroRecord record;
            record[key] = value;
            ret.emplace_back(record);
        }
    } else if (const auto *intValues = cc::get_if<std::vector<int32_t>>(&value)) {
        for (const int32_t value : *intValues) {
            MacroRecord record;
            record[key] = value;
            ret.emplace_back(record);
        }
    } else if (const auto *stringValues = cc::get_if<std::vector<std::string>>(&value)) {
        for (const std::string &value : *stringValues) {
            MacroRecord record;
            record[key] = value;
            ret.emplace_back(record);
        }
    } else {
        CC_ASSERT(false);
    }

    return ret;
}

std::vector<MacroRecord> EffectAsset::insertInfoValue(const std::vector<MacroRecord> &records,
                                                      const std::string &             key,
                                                      const IPreCompileInfoValueType &value) {
    std::vector<MacroRecord> ret;
    for (const auto &record : records) {
        if (const auto *boolValues = cc::get_if<std::vector<bool>>(&value)) {
            for (const bool value : *boolValues) {
                MacroRecord tmpRecord = record;
                tmpRecord[key]        = value;
                ret.emplace_back(tmpRecord);
            }
        } else if (const auto *intValues = cc::get_if<std::vector<int32_t>>(&value)) {
            for (const int32_t value : *intValues) {
                MacroRecord tmpRecord = record;
                tmpRecord[key]        = value;
                ret.emplace_back(tmpRecord);
            }
        } else if (const auto *stringValues = cc::get_if<std::vector<std::string>>(&value)) {
            for (const std::string &value : *stringValues) {
                MacroRecord tmpRecord = record;
                tmpRecord[key]        = value;
                ret.emplace_back(tmpRecord);
            }
        } else {
            CC_ASSERT(false);
        }
    }

    return ret;
}

} // namespace cc
