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
#include "ProgramUtils.h"

namespace cc {

namespace render {

namespace {

int32_t getBitCount(int32_t cnt) {
    return std::ceil(std::log2(std::max(cnt, 2))); // std::max checks number types
}

template <class ShaderInfoT>
ccstd::unordered_map<ccstd::string, uint32_t> genHandlesImpl(const ShaderInfoT &tmpl) {
    ccstd::unordered_map<ccstd::string, uint32_t> handleMap{};
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

} // namespace

void populateMacros(IProgramInfo &tmpl) {
    // calculate option mask offset
    int32_t offset = 0;
    for (auto &def : tmpl.defines) {
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
                CC_ABORT(); // We only support macro with int32_t type now.
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
        tmpl.uber = true;
    }
    // generate constant macros
    {
        tmpl.constantMacros.clear();
        std::stringstream ss;
        for (auto &key : tmpl.builtins.statistics) {
            ss << "#define " << key.first << " " << key.second << std::endl;
        }
        tmpl.constantMacros = ss.str();
    }
}

ccstd::unordered_map<ccstd::string, uint32_t> genHandles(const IProgramInfo &tmpl) {
    return genHandlesImpl(tmpl);
}

ccstd::unordered_map<ccstd::string, uint32_t> genHandles(const gfx::ShaderInfo &tmpl) {
    return genHandlesImpl(tmpl);
}

ccstd::string getVariantKey(const IProgramInfo &tmpl, const MacroRecord &defines) {
    const auto &tmplDefs = tmpl.defines;
    if (tmpl.uber) {
        std::stringstream key;
        for (const auto &tmplDef : tmplDefs) {
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
    for (const auto &tmplDef : tmplDefs) {
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

namespace {

ccstd::string mapDefine(const IDefineInfo &info, const ccstd::optional<MacroRecord::mapped_type> &def) {
    if (info.type == "boolean") {
        return def.has_value() ? (macroRecordAsBool(def.value()) ? "1" : "0") : "0";
    }
    if (info.type == "string") {
        return def.has_value() ? macroRecordAsString(def.value()) : info.options.value()[0];
    }
    if (info.type == "number") {
        return def.has_value() ? macroRecordAsString(def.value()) : std::to_string(info.range.value()[0]);
    }
    CC_LOG_WARNING("unknown define type '%s', name: %s", info.type.c_str(), info.name.c_str());
    return "-1"; // should neven happen
}

bool dependencyCheck(const ccstd::vector<ccstd::string> &dependencies, const MacroRecord &defines) {
    for (const auto &d : dependencies) { // NOLINT(readability-use-anyofallof)
        if (d[0] == '!') {               // negative dependency
            if (defines.find(d.substr(1)) != defines.end()) {
                return false;
            }
        } else if (defines.count(d) == 0 ? true : !macroRecordAsBool(defines.at(d))) {
            return false;
        }
    }
    return true;
}

template <class Vector>
ccstd::vector<gfx::Attribute> getActiveAttributesImpl(
    const IProgramInfo &tmpl,
    const Vector &gfxAttributes, const MacroRecord &defines) {
    ccstd::vector<gfx::Attribute> out{};
    const auto &attributes = tmpl.attributes;
    for (auto i = 0; i < attributes.size(); i++) {
        if (!dependencyCheck(attributes[i].defines, defines)) {
            continue;
        }
        out.emplace_back(gfxAttributes[i]);
    }
    return out;
}

} // namespace

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

ccstd::vector<gfx::Attribute> getActiveAttributes(
    const IProgramInfo &tmpl,
    const ccstd::vector<gfx::Attribute> &gfxAttributes, const MacroRecord &defines) {
    return getActiveAttributesImpl(tmpl, gfxAttributes, defines);
}

ccstd::vector<gfx::Attribute> getActiveAttributes(
    const IProgramInfo &tmpl,
    const ccstd::pmr::vector<gfx::Attribute> &gfxAttributes, const MacroRecord &defines) {
    return getActiveAttributesImpl(tmpl, gfxAttributes, defines);
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

void addEffectDefaultProperties(EffectAsset &effect) {
    for (auto &tech : effect._techniques) {
        for (auto &pass : tech.passes) {
            // grab default property declaration if there is none
            if (pass.propertyIndex.has_value() && !pass.properties.has_value()) {
                pass.properties = tech.passes[pass.propertyIndex.value()].properties;
            }
        }
    }
}

} // namespace render

} // namespace cc
