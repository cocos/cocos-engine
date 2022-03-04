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
#include "core/data/deserializer/EffectAssetDeserializer.h"
#include "base/Log.h"
#include "core/assets/EffectAsset.h"

namespace cc {

template <typename T>
using DeserializeArrayElementCallback = std::function<void(const rapidjson::Value &, T &)>;

template <typename T>
static void deserializeArray(const rapidjson::Value &valArray, std::vector<T> &cValArray, const DeserializeArrayElementCallback<T> &deserializeArrayElement) {
    CC_ASSERT(valArray.IsArray());
    index_t i = 0;
    cValArray.resize(valArray.Size());
    for (const auto &val : valArray.GetArray()) {
        deserializeArrayElement(val, cValArray[i]);
        ++i;
    }
}

static void deserializeArray(const rapidjson::Value &valArray, std::vector<std::string> &cValArray) {
    deserializeArray<std::string>(valArray, cValArray, [](const rapidjson::Value &val, std::string &cVal) {
        cVal = val.GetString();
    });
}

static void deserializeArray(const rapidjson::Value &valArray, std::vector<bool> &cValArray) {
    CC_ASSERT(valArray.IsArray());
    index_t i = 0;
    cValArray.resize(valArray.Size());
    // note: candidate function not viable: no known conversion from 'std::__1::vector<bool>::reference' (aka '__bit_reference<std::__1::vector<bool>>') to 'bool &' for 2nd argument

    for (const auto &val : valArray.GetArray()) {
        cValArray[i] = val.GetBool();
        ++i;
    }
}

template <typename T, typename Enabled = std::enable_if_t<!std::is_same<std::string, T>::value && !std::is_same<bool, T>::value, T>>
static void deserializeArray(const rapidjson::Value &valArray, std::vector<T> &cValArray) {
    DeserializeArrayElementCallback<T> cb{[](const rapidjson::Value &val, T &cVal) {
        cVal = val.Get<T>();
    }};
    deserializeArray<T>(valArray, cValArray, cb);
}

static MacroRecord jsonToMacroRecord(const rapidjson::Value &embeddedMacrosVal) {
    MacroRecord cEmbeddedMacros;
    for (const auto &macro : embeddedMacrosVal.GetObject()) {
        const auto *name  = macro.name.GetString();
        const auto &value = macro.value;

        // using MacroValue = cc::variant<int32_t, float, bool, std::string>;
        // MacroValue only support one of int32_t, float, bool, std::string
        if (value.IsInt()) {
            cEmbeddedMacros.emplace(name, value.GetInt());
            //            CC_LOG_DEBUG(">> embeddedMacros[%s]=%d", name, value.GetInt());
        } else if (value.IsInt64()) {
            cEmbeddedMacros.emplace(name, static_cast<int32_t>(value.GetInt64())); //cjh TODO: need int64?
                                                                                   //            CC_LOG_DEBUG(">> embeddedMacros[%s]=%ld", name, value.GetInt64());
        } else if (value.IsBool()) {
            cEmbeddedMacros.emplace(name, value.GetBool());
            //            CC_LOG_DEBUG(">> embeddedMacros[%s]=%d", name, static_cast<int32_t>(value.GetBool()));
        } else if (value.IsString()) {
            cEmbeddedMacros.emplace(name, value.GetString());
            //            CC_LOG_DEBUG(">> embeddedMacros[%s]=%s", name, value.GetString());
        } else {
            CC_LOG_WARNING("Unknown macro value type: %s", name);
        }
    }

    return cEmbeddedMacros;
}

static IPropertyHandleInfo jsonToPropertyHandleInfo(const rapidjson::Value &handleInfoVal) {
    if (handleInfoVal.IsArray()) {
        // using IPropertyHandleInfo = std::tuple<std::string, uint32_t, gfx::Type>;
        std::string t0;
        uint32_t    t1 = 0;
        gfx::Type   t2 = gfx::Type::UNKNOWN;
        int32_t     i  = 0;

        for (const auto &e : handleInfoVal.GetArray()) {
            switch (i) {
                case 0:
                    t0 = e.GetString();
                    break;
                case 1:
                    t1 = e.GetUint();
                    break;
                case 2:
                    t2 = static_cast<gfx::Type>(e.GetUint());
                    break;
                default:
                    break;
            }

            ++i;
        }

        return IPropertyHandleInfo{t0, t1, t2};
    }

    return {};
}

static IPropertyInfo jsonToPropertyInfo(const rapidjson::Value &propertyInfoVal) {
    IPropertyInfo ret;

    ret.type = propertyInfoVal["type"].GetInt();

    if (propertyInfoVal.HasMember("value")) {
        const auto &val = propertyInfoVal["value"];
        if (val.IsArray()) {
            std::vector<float> arr;
            arr.reserve(val.GetArray().Size());
            for (const auto &e : val.GetArray()) {
                if (e.IsNumber()) {
                    arr.emplace_back(e.GetFloat());
                }
            }
            ret.value = std::move(arr);
        } else if (val.IsString()) {
            ret.value = val.GetString();
        } else {
            CC_ASSERT(false);
        }
    }

    if (propertyInfoVal.HasMember("handleInfo")) {
        ret.handleInfo = jsonToPropertyHandleInfo(propertyInfoVal["handleInfo"]);
        // using IPropertyHandleInfo = std::tuple<std::string, uint32_t, gfx::Type>;
        //        CC_LOG_DEBUG("handleInfo: %s, %u, %u", std::get<0>(ret.handleInfo.value()).c_str(), std::get<1>(ret.handleInfo.value()), static_cast<uint32_t>(std::get<2>(ret.handleInfo.value())));
    }

    if (propertyInfoVal.HasMember("samplerHash")) {
        ret.samplerHash = propertyInfoVal.GetUint64();
        //        CC_LOG_DEBUG("samplerHash: %lu", ret.samplerHash.value());
    }

    return ret;
}

static PassPropertyInfoMap jsonToPassPropertyInfoMap(const rapidjson::Value &propertyInfoMapVal) {
    PassPropertyInfoMap propertyInfoMap;

    for (const auto &propertyVal : propertyInfoMapVal.GetObject()) {
        const auto *name  = propertyVal.name.GetString();
        const auto &value = propertyVal.value;
        propertyInfoMap.emplace(name, jsonToPropertyInfo(value));
    }

    return propertyInfoMap;
}

static RasterizerStateInfo jsonToRasterizerState(const rapidjson::Value &rasterizerStateVal) {
    RasterizerStateInfo rasterizerState;

    CC_ASSERT(rasterizerStateVal.IsObject());

    if (rasterizerStateVal.HasMember("cullMode")) {
        rasterizerState.cullMode = static_cast<gfx::CullMode>(rasterizerStateVal["cullMode"].GetInt());
        //        CC_LOG_DEBUG("cullMode: %d", static_cast<int32_t>(rasterizerState->cullMode));
    }

    if (rasterizerStateVal.HasMember("isDiscard")) {
        rasterizerState.isDiscard = rasterizerStateVal["isDiscard"].GetUint();
    }

    if (rasterizerStateVal.HasMember("polygonMode")) {
        rasterizerState.polygonMode = static_cast<gfx::PolygonMode>(rasterizerStateVal["polygonMode"].GetInt());
    }

    if (rasterizerStateVal.HasMember("shadeModel")) {
        rasterizerState.shadeModel = static_cast<gfx::ShadeModel>(rasterizerStateVal["shadeModel"].GetInt());
    }

    if (rasterizerStateVal.HasMember("isFrontFaceCCW")) {
        rasterizerState.isFrontFaceCCW = rasterizerStateVal["isFrontFaceCCW"].GetUint();
    }

    if (rasterizerStateVal.HasMember("depthBiasEnabled")) {
        rasterizerState.depthBiasEnabled = rasterizerStateVal["depthBiasEnabled"].GetUint();
    }

    if (rasterizerStateVal.HasMember("depthBias")) {
        rasterizerState.depthBias = rasterizerStateVal["depthBias"].GetFloat();
    }

    if (rasterizerStateVal.HasMember("depthBiasClamp")) {
        rasterizerState.depthBiasClamp = rasterizerStateVal["depthBiasClamp"].GetFloat();
    }

    if (rasterizerStateVal.HasMember("depthBiasSlop")) {
        rasterizerState.depthBiasSlop = rasterizerStateVal["depthBiasSlop"].GetFloat();
    }

    if (rasterizerStateVal.HasMember("isDepthClip")) {
        rasterizerState.isDepthClip = rasterizerStateVal["isDepthClip"].GetUint();
    }

    if (rasterizerStateVal.HasMember("isMultisample")) {
        rasterizerState.isMultisample = rasterizerStateVal["isMultisample"].GetUint();
    }

    if (rasterizerStateVal.HasMember("lineWidth")) {
        rasterizerState.lineWidth = rasterizerStateVal["lineWidth"].GetFloat();
    }

    return rasterizerState;
}

static DepthStencilStateInfo jsonToDepthStencilState(const rapidjson::Value &val) {
    DepthStencilStateInfo dss;

    CC_ASSERT(val.IsObject());

    if (val.HasMember("depthTest")) {
        dss.depthTest = val["depthTest"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("depthWrite")) {
        dss.depthWrite = val["depthWrite"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("depthFunc")) {
        dss.depthFunc = static_cast<gfx::ComparisonFunc>(val["depthFunc"].GetInt());
    }

    if (val.HasMember("stencilTestFront")) {
        dss.stencilTestFront = val["stencilTestFront"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("stencilFuncFront")) {
        dss.stencilFuncFront = static_cast<gfx::ComparisonFunc>(val["stencilFuncFront"].GetInt());
    }

    if (val.HasMember("stencilReadMaskFront")) {
        dss.stencilReadMaskFront = val["stencilReadMaskFront"].GetUint();
    }

    if (val.HasMember("stencilWriteMaskFront")) {
        dss.stencilWriteMaskFront = val["stencilWriteMaskFront"].GetUint();
    }

    if (val.HasMember("stencilFailOpFront")) {
        dss.stencilFailOpFront = static_cast<gfx::StencilOp>(val["stencilFailOpFront"].GetUint());
    }

    if (val.HasMember("stencilZFailOpFront")) {
        dss.stencilZFailOpFront = static_cast<gfx::StencilOp>(val["stencilZFailOpFront"].GetUint());
    }

    if (val.HasMember("stencilPassOpFront")) {
        dss.stencilPassOpFront = static_cast<gfx::StencilOp>(val["stencilPassOpFront"].GetUint());
    }

    if (val.HasMember("stencilRefFront")) {
        dss.stencilRefFront = val["stencilRefFront"].GetUint();
    }

    if (val.HasMember("stencilTestBack")) {
        dss.stencilTestBack = val["stencilTestBack"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("stencilFuncBack")) {
        dss.stencilFuncBack = static_cast<gfx::ComparisonFunc>(val["stencilFuncBack"].GetInt());
    }

    if (val.HasMember("stencilReadMaskBack")) {
        dss.stencilReadMaskBack = val["stencilReadMaskBack"].GetUint();
    }

    if (val.HasMember("stencilWriteMaskBack")) {
        dss.stencilWriteMaskBack = val["stencilWriteMaskBack"].GetUint();
    }

    if (val.HasMember("stencilFailOpBack")) {
        dss.stencilFailOpBack = static_cast<gfx::StencilOp>(val["stencilFailOpBack"].GetInt());
    }

    if (val.HasMember("stencilZFailOpBack")) {
        dss.stencilZFailOpBack = static_cast<gfx::StencilOp>(val["stencilZFailOpBack"].GetInt());
    }

    if (val.HasMember("stencilPassOpBack")) {
        dss.stencilPassOpBack = static_cast<gfx::StencilOp>(val["stencilPassOpBack"].GetInt());
    }

    if (val.HasMember("stencilRefBack")) {
        dss.stencilWriteMaskBack = val["stencilRefBack"].GetUint();
    }

    return dss;
}

static void jsonToBlendTarget(const rapidjson::Value &val, BlendTargetInfo *outBlendTarget) {
    if (outBlendTarget == nullptr) {
        return;
    }

    CC_ASSERT(val.IsObject());

    if (val.HasMember("blend")) {
        outBlendTarget->blend = val["blend"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("blendSrc")) {
        outBlendTarget->blendSrc = static_cast<gfx::BlendFactor>(val["blendSrc"].GetInt());
    }

    if (val.HasMember("blendDst")) {
        outBlendTarget->blendDst = static_cast<gfx::BlendFactor>(val["blendDst"].GetInt());
    }

    if (val.HasMember("blendEq")) {
        outBlendTarget->blendEq = static_cast<gfx::BlendOp>(val["blendEq"].GetInt());
    }

    if (val.HasMember("blendSrcAlpha")) {
        outBlendTarget->blendSrcAlpha = static_cast<gfx::BlendFactor>(val["blendSrcAlpha"].GetInt());
    }

    if (val.HasMember("blendDstAlpha")) {
        outBlendTarget->blendDstAlpha = static_cast<gfx::BlendFactor>(val["blendDstAlpha"].GetInt());
    }

    if (val.HasMember("blendAlphaEq")) {
        outBlendTarget->blendAlphaEq = static_cast<gfx::BlendOp>(val["blendAlphaEq"].GetInt());
    }

    if (val.HasMember("blendColorMask")) {
        outBlendTarget->blendColorMask = static_cast<gfx::ColorMask>(val["blendColorMask"].GetInt());
    }
}

static void deserializeGfxColor(const rapidjson::Value &color, cc::optional<gfx::Color> &gfxColor) {
    if (gfxColor.has_value()) {
        if (color.HasMember("x")) {
            gfxColor->x = color["x"].GetFloat();
        }

        if (color.HasMember("y")) {
            gfxColor->y = color["y"].GetFloat();
        }

        if (color.HasMember("z")) {
            gfxColor->z = color["z"].GetFloat();
        }

        if (color.HasMember("w")) {
            gfxColor->w = color["w"].GetFloat();
        }
    }
}

static BlendStateInfo jsonToBlendState(const rapidjson::Value &val) {
    CC_ASSERT(val.IsObject());

    BlendStateInfo bs;

    if (val.HasMember("isA2C")) {
        bs.isA2C = val["isA2C"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("isIndepend")) {
        bs.isIndepend = val["isIndepend"].GetBool() ? 1 : 0;
    }

    if (val.HasMember("blendColor")) {
        deserializeGfxColor(val["blendColor"], bs.blendColor);
    }

    if (val.HasMember("targets")) {
        if (val["targets"].IsArray()) {
            const auto &        targetsVal = val["targets"].GetArray();
            BlendTargetInfoList targets;
            targets.resize(targetsVal.Size());
            int32_t i = 0;
            for (const auto &targetVal : targetsVal) {
                jsonToBlendTarget(targetVal, &targets[i]);
                ++i;
            }

            bs.targets = targets;
        }
    }

    return bs;
}

static void deserializePass(const rapidjson::Value &passVal, IPassInfoFull &cPass) {
    // Filling IPassInfo is enough, the properties in IPassInfoFull will be assigned in Material::createPasses
    CC_ASSERT(passVal.IsObject());

    // IPassInfo
    cPass.program = passVal["program"].GetString();
    // CC_LOG_DEBUG("program: %s", cPass.program.c_str());
    if (passVal.HasMember("embeddedMacros")) {
        cPass.embeddedMacros = jsonToMacroRecord(passVal["embeddedMacros"]);
    }

    if (passVal.HasMember("propertyIndex")) {
        cPass.propertyIndex = passVal["propertyIndex"].GetInt();
        //                                    CC_LOG_DEBUG("propertyIndex: %d", cPass.propertyIndex);
    }

    if (passVal.HasMember("switch")) {
        cPass.switch_ = passVal["switch"].GetString();
        //                                    CC_LOG_DEBUG("switch: %s", cPass.switch_.value().c_str());
    }

    if (passVal.HasMember("properties")) {
        cPass.properties = jsonToPassPropertyInfoMap(passVal["properties"]);
    }

    // IPassStates
    if (passVal.HasMember("priority")) {
        cPass.priority = passVal["priority"].GetInt();
        //                                    CC_LOG_DEBUG("priority: %d", cPass.priority.value());
    }

    if (passVal.HasMember("primitive")) {
        cPass.primitive = static_cast<gfx::PrimitiveMode>(passVal["primitive"].GetInt());
    }

    if (passVal.HasMember("stage")) {
        cPass.stage = static_cast<pipeline::RenderPassStage>(passVal["stage"].GetInt());
    }

    if (passVal.HasMember("rasterizerState")) {
        cPass.rasterizerState = jsonToRasterizerState(passVal["rasterizerState"]);
    }

    if (passVal.HasMember("depthStencilState")) {
        cPass.depthStencilState = jsonToDepthStencilState(passVal["depthStencilState"]);
    }

    if (passVal.HasMember("blendState")) {
        cPass.blendState = jsonToBlendState(passVal["blendState"]);
    }

    if (passVal.HasMember("dynamicStates")) {
        cPass.dynamicStates = static_cast<gfx::DynamicStateFlags>(passVal["dynamicStates"].GetInt());
    }

    if (passVal.HasMember("phase")) {
        cPass.phase = passVal["phase"].GetString();
        //        CC_LOG_DEBUG("phase: %s", cPass.phase.value().c_str());
    }
}

static void deserializeTechnique(const rapidjson::Value &technique, ITechniqueInfo &cTechnique) {
    if (technique.IsObject()) {
        if (technique.HasMember("name")) {
            cTechnique.name = technique["name"].GetString();
            // CC_LOG_DEBUG("tech name: %s", _techniques[techIndex].name.value().c_str());
        }

        if (technique.HasMember("passes")) {
            const auto &passesVal = technique["passes"];
            deserializeArray<IPassInfoFull>(passesVal, cTechnique.passes, deserializePass);
        }
    }
}

static void deserializeShaderBuiltin(const rapidjson::Value &builtinVal, IBuiltin &cBuiltin) {
    CC_ASSERT(builtinVal.IsObject());

    if (builtinVal.HasMember("name")) {
        cBuiltin.name = builtinVal["name"].GetString();
    }

    if (builtinVal.HasMember("defines")) {
        deserializeArray(builtinVal["defines"], cBuiltin.defines);
    }
}

static void deserializeShaderBuiltinInfo(const rapidjson::Value &builtinInfoVal, IBuiltinInfo &cBuiltinInfo) {
    CC_ASSERT(builtinInfoVal.IsObject());

    if (builtinInfoVal.HasMember("blocks")) {
        deserializeArray<IBuiltin>(builtinInfoVal["blocks"], cBuiltinInfo.blocks, deserializeShaderBuiltin);
    }

    if (builtinInfoVal.HasMember("samplerTextures")) {
        deserializeArray<IBuiltin>(builtinInfoVal["samplerTextures"], cBuiltinInfo.samplerTextures, deserializeShaderBuiltin);
    }
}

static void deserializeShaderBuiltinsStatistics(const rapidjson::Value &statisticsVal, BuiltinsStatisticsType &cStatistics) {
    CC_ASSERT(statisticsVal.IsObject());

    for (const auto &e : statisticsVal.GetObject()) {
        cStatistics[e.name.GetString()] = e.value.GetInt();
    }
}

static void deserializeShaderBuiltins(const rapidjson::Value &builtinsVal, IBuiltins &cBuiltins) {
    CC_ASSERT(builtinsVal.IsObject());

    if (builtinsVal.HasMember("globals")) {
        deserializeShaderBuiltinInfo(builtinsVal["globals"], cBuiltins.globals);
    }

    if (builtinsVal.HasMember("locals")) {
        deserializeShaderBuiltinInfo(builtinsVal["locals"], cBuiltins.locals);
    }

    if (builtinsVal.HasMember("statistics")) {
        deserializeShaderBuiltinsStatistics(builtinsVal["statistics"], cBuiltins.statistics);
    }
}
//

static void deserializeShaderDefine(const rapidjson::Value &defineVal, IDefineInfo &cDefine) {
    CC_ASSERT(defineVal.IsObject());

    if (defineVal.HasMember("name")) {
        cDefine.name = defineVal["name"].GetString();
    }

    if (defineVal.HasMember("type")) {
        cDefine.type = defineVal["type"].GetString();
    }

    if (defineVal.HasMember("range")) {
        auto &      cRange   = cDefine.range;
        const auto &rangeVal = defineVal["range"];

        cRange = std::vector<int32_t>{};
        deserializeArray(rangeVal, cRange.value());
    }

    if (defineVal.HasMember("options")) {
        auto &      cOptions   = cDefine.options;
        const auto &optionsVal = defineVal["options"];

        cOptions = std::vector<std::string>{};
        deserializeArray(optionsVal, cOptions.value());
    }

    if (defineVal.HasMember("default")) {
        cDefine.defaultVal = defineVal["default"].GetString();
    }
}

//

static void deserializeMember(const rapidjson::Value &memberVal, gfx::Uniform &cMember) {
    CC_ASSERT(memberVal.IsObject());

    if (memberVal.HasMember("name")) {
        cMember.name = memberVal["name"].GetString();
    }

    if (memberVal.HasMember("type")) {
        cMember.type = static_cast<gfx::Type>(memberVal["type"].GetInt());
    }

    if (memberVal.HasMember("count")) {
        cMember.count = memberVal["count"].GetUint();
    }
}

static void deserializeShaderBlock(const rapidjson::Value &blockVal, IBlockInfo &cBlock) {
    CC_ASSERT(blockVal.IsObject());

    if (blockVal.HasMember("binding")) {
        cBlock.binding = blockVal["binding"].GetInt();
    }

    if (blockVal.HasMember("name")) {
        cBlock.name = blockVal["name"].GetString();
    }

    if (blockVal.HasMember("members")) {
        deserializeArray<gfx::Uniform>(blockVal["members"], cBlock.members, deserializeMember);
    }

    if (blockVal.HasMember("stageFlags")) {
        cBlock.stageFlags = static_cast<gfx::ShaderStageFlags>(blockVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderSamplerTexture(const rapidjson::Value &samplerTextureVal, ISamplerTextureInfo &cSamplerTexture) {
    CC_ASSERT(samplerTextureVal.IsObject());

    if (samplerTextureVal.HasMember("binding")) {
        cSamplerTexture.binding = samplerTextureVal["binding"].GetInt();
    }

    if (samplerTextureVal.HasMember("name")) {
        cSamplerTexture.name = samplerTextureVal["name"].GetString();
    }

    if (samplerTextureVal.HasMember("type")) {
        cSamplerTexture.type = static_cast<gfx::Type>(samplerTextureVal["type"].GetInt());
    }

    if (samplerTextureVal.HasMember("count")) {
        cSamplerTexture.count = samplerTextureVal["count"].GetUint();
    }

    if (samplerTextureVal.HasMember("stageFlags")) {
        cSamplerTexture.stageFlags = static_cast<gfx::ShaderStageFlags>(samplerTextureVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderSampler(const rapidjson::Value &samplerVal, ISamplerInfo &cSampler) {
    CC_ASSERT(samplerVal.IsObject());

    if (samplerVal.HasMember("set")) {
        cSampler.set = samplerVal["set"].GetUint();
    }

    if (samplerVal.HasMember("binding")) {
        cSampler.binding = samplerVal["binding"].GetInt();
    }

    if (samplerVal.HasMember("name")) {
        cSampler.name = samplerVal["name"].GetString();
    }

    if (samplerVal.HasMember("count")) {
        cSampler.count = samplerVal["count"].GetUint();
    }

    if (samplerVal.HasMember("stageFlags")) {
        cSampler.stageFlags = static_cast<gfx::ShaderStageFlags>(samplerVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderTexture(const rapidjson::Value &textureVal, ITextureInfo &cTexture) {
    CC_ASSERT(textureVal.IsObject());

    if (textureVal.HasMember("set")) {
        cTexture.set = textureVal["set"].GetUint();
    }

    if (textureVal.HasMember("binding")) {
        cTexture.binding = textureVal["binding"].GetInt();
    }

    if (textureVal.HasMember("name")) {
        cTexture.name = textureVal["name"].GetString();
    }

    if (textureVal.HasMember("type")) {
        cTexture.type = static_cast<gfx::Type>(textureVal["type"].GetInt());
    }

    if (textureVal.HasMember("count")) {
        cTexture.count = textureVal["count"].GetUint();
    }

    if (textureVal.HasMember("stageFlags")) {
        cTexture.stageFlags = static_cast<gfx::ShaderStageFlags>(textureVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderBuffer(const rapidjson::Value &bufferVal, IBufferInfo &cBuffer) {
    CC_ASSERT(bufferVal.IsObject());

    if (bufferVal.HasMember("binding")) {
        cBuffer.binding = bufferVal["binding"].GetInt();
    }

    if (bufferVal.HasMember("name")) {
        cBuffer.name = bufferVal["name"].GetString();
    }

    if (bufferVal.HasMember("memoryAccess")) {
        cBuffer.memoryAccess = static_cast<gfx::MemoryAccess>(bufferVal["memoryAccess"].GetInt());
    }

    if (bufferVal.HasMember("stageFlags")) {
        cBuffer.stageFlags = static_cast<gfx::ShaderStageFlags>(bufferVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderImage(const rapidjson::Value &imageVal, IImageInfo &cImage) {
    CC_ASSERT(imageVal.IsObject());

    if (imageVal.HasMember("binding")) {
        cImage.binding = imageVal["binding"].GetInt();
    }

    if (imageVal.HasMember("name")) {
        cImage.name = imageVal["name"].GetString();
    }

    if (imageVal.HasMember("type")) {
        cImage.type = static_cast<gfx::Type>(imageVal["type"].GetInt());
    }

    if (imageVal.HasMember("count")) {
        cImage.count = imageVal["count"].GetUint();
    }

    if (imageVal.HasMember("memoryAccess")) {
        cImage.memoryAccess = static_cast<gfx::MemoryAccess>(imageVal["memoryAccess"].GetInt());
    }

    if (imageVal.HasMember("stageFlags")) {
        cImage.stageFlags = static_cast<gfx::ShaderStageFlags>(imageVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderInputAttachment(const rapidjson::Value &inputAttachmentVal, IInputAttachmentInfo &cInputAttachment) {
    CC_ASSERT(inputAttachmentVal.IsObject());

    if (inputAttachmentVal.HasMember("set")) {
        cInputAttachment.set = inputAttachmentVal["set"].GetUint();
    }

    if (inputAttachmentVal.HasMember("binding")) {
        cInputAttachment.binding = inputAttachmentVal["binding"].GetInt();
    }

    if (inputAttachmentVal.HasMember("name")) {
        cInputAttachment.name = inputAttachmentVal["name"].GetString();
    }

    if (inputAttachmentVal.HasMember("count")) {
        cInputAttachment.count = inputAttachmentVal["count"].GetUint();
    }

    if (inputAttachmentVal.HasMember("stageFlags")) {
        cInputAttachment.stageFlags = static_cast<gfx::ShaderStageFlags>(inputAttachmentVal["stageFlags"].GetInt());
    }
}

static void deserializeShaderAttribute(const rapidjson::Value &gfxAttributeVal, IAttributeInfo &cAttribute) {
    CC_ASSERT(gfxAttributeVal.IsObject());

    if (gfxAttributeVal.HasMember("name")) {
        cAttribute.name = gfxAttributeVal["name"].GetString();
    }

    if (gfxAttributeVal.HasMember("format")) {
        cAttribute.format = static_cast<gfx::Format>(gfxAttributeVal["format"].GetInt());
    }

    if (gfxAttributeVal.HasMember("isNormalized")) {
        cAttribute.isNormalized = gfxAttributeVal["isNormalized"].GetBool();
    }

    if (gfxAttributeVal.HasMember("stream")) {
        cAttribute.stream = gfxAttributeVal["stream"].GetUint();
    }

    if (gfxAttributeVal.HasMember("isInstanced")) {
        cAttribute.isNormalized = gfxAttributeVal["isInstanced"].GetBool();
    }

    if (gfxAttributeVal.HasMember("location")) {
        cAttribute.location = gfxAttributeVal["location"].GetUint();
    }
}

static void deserializeShaderAttributeInfo(const rapidjson::Value &attributeVal, IAttributeInfo &cAttributeInfo) {
    CC_ASSERT(attributeVal.IsObject());

    deserializeShaderAttribute(attributeVal, cAttributeInfo);
    if (attributeVal.HasMember("defines")) {
        deserializeArray(attributeVal["defines"], cAttributeInfo.defines);
    }
}

static void deserializeShader(const rapidjson::Value &shaderVal, IShaderInfo &cShader) {
    CC_ASSERT(shaderVal.IsObject());

    cShader.name = shaderVal["name"].GetString();
    cShader.hash = shaderVal["hash"].GetUint64();
    //NOTE: glsl1, glsl3, glsl4 are not initialized here

    deserializeShaderBuiltins(shaderVal["builtins"], cShader.builtins);
    deserializeArray<IDefineInfo>(shaderVal["defines"], cShader.defines, deserializeShaderDefine);
    deserializeArray<IAttributeInfo>(shaderVal["attributes"], cShader.attributes, deserializeShaderAttributeInfo);
    deserializeArray<IBlockInfo>(shaderVal["blocks"], cShader.blocks, deserializeShaderBlock);
    deserializeArray<ISamplerTextureInfo>(shaderVal["samplerTextures"], cShader.samplerTextures, deserializeShaderSamplerTexture);
    deserializeArray<ISamplerInfo>(shaderVal["samplers"], cShader.samplers, deserializeShaderSampler);
    deserializeArray<ITextureInfo>(shaderVal["textures"], cShader.textures, deserializeShaderTexture);
    deserializeArray<IBufferInfo>(shaderVal["buffers"], cShader.buffers, deserializeShaderBuffer);
    deserializeArray<IImageInfo>(shaderVal["images"], cShader.images, deserializeShaderImage);
    deserializeArray<IInputAttachmentInfo>(shaderVal["subpassInputs"], cShader.subpassInputs, deserializeShaderInputAttachment);
}

static void deserializePreCompileInfoValue(const rapidjson::Value &infoVal, IPreCompileInfoValueType &cInfo) {
    if (infoVal.IsBool()) {
        std::vector<bool> boolInfo;
        deserializeArray(infoVal, boolInfo);
        cInfo = std::move(boolInfo);
    } else if (infoVal.IsInt()) {
        std::vector<int32_t> intInfo;
        deserializeArray(infoVal, intInfo);
        cInfo = std::move(intInfo);
    } else if (infoVal.IsString()) {
        std::vector<std::string> strInfo;
        deserializeArray(infoVal, strInfo);
        cInfo = std::move(strInfo);
    } else {
        CC_ASSERT(false);
    }
}

static void deserializeCombination(const rapidjson::Value &combinationVal, IPreCompileInfo &cCombination) {
    CC_ASSERT(combinationVal.IsObject());
    for (const auto &e : combinationVal.GetObject()) {
        IPreCompileInfoValueType info;
        deserializePreCompileInfoValue(e.value, info);
        cCombination.emplace(e.name.GetString(), info);
    }
}

void EffectAssetDeserializer::deserialize(const rapidjson::Value &serializedData, Asset *asset) {
    CC_ASSERT(serializedData.IsObject());
    auto *effectAsset = dynamic_cast<EffectAsset *>(asset);
    CC_ASSERT(effectAsset != nullptr);

    effectAsset->_name = serializedData["name"].GetString(); //cjh TODO: name needs to be deserialize in CCObject class.
                                                             //    CC_LOG_DEBUG("EffectAsset::deserialize: %s", _name.c_str());
    if (serializedData.HasMember("techniques")) {
        deserializeArray<ITechniqueInfo>(serializedData["techniques"], effectAsset->_techniques, deserializeTechnique);
    }

    if (serializedData.HasMember("shaders")) {
        deserializeArray<IShaderInfo>(serializedData["shaders"], effectAsset->_shaders, deserializeShader);
    }

    if (serializedData.HasMember("combinations")) {
        deserializeArray<IPreCompileInfo>(serializedData["combinations"], effectAsset->_combinations, deserializeCombination);
    }
}

} // namespace cc
