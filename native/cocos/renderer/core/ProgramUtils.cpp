/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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
#include "ProgramUtils.h"

namespace cc {

namespace render {

namespace {

int32_t getBitCount(int32_t cnt) {
    return std::ceil(std::log2(std::max(cnt, 2))); // std::max checks number types
}

template <class ShaderInfoT>
ccstd::unordered_map<ccstd::string, uint32_t> genHandlesImpl(const ShaderInfoT &tmpl) {
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

} // namespace render

} // namespace cc
