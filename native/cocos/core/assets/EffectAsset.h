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

#pragma once

#include <string>
#include <tuple>
#include <unordered_map>
#include "cocos/base/Optional.h"

#include "base/Value.h"
#include "core/Types.h"
#include "core/assets/Asset.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXShader.h"
#include "renderer/core/PassUtils.h"
#include "renderer/gfx-base/GFXDef.h"
#include "renderer/pipeline/Define.h"
//#include "scene/Define.h"

namespace cc {

using IPropertyHandleInfo = std::tuple<std::string, uint32_t, gfx::Type>;

using IPropertyValue = cc::optional<cc::variant<std::vector<float>, std::string>>;

struct IPropertyInfo {
    int32_t                           type;        // auto-extracted from shader
    cc::optional<IPropertyHandleInfo> handleInfo;  // auto-generated from 'target'
    cc::optional<uint64_t>            samplerHash; // auto-generated from 'sampler'
    IPropertyValue                    value;       // default value
    cc::optional<bool>                linear;      // whether to convert the input to linear space first before applying
};

struct IPassInfoFull;

struct RasterizerStateInfo {
    cc::optional<bool> isDiscard;
    cc::optional<bool> isFrontFaceCCW;
    cc::optional<bool> depthBiasEnabled;
    cc::optional<bool> isDepthClip;
    cc::optional<bool> isMultisample;

    cc::optional<gfx::PolygonMode> polygonMode;
    cc::optional<gfx::ShadeModel>  shadeModel;
    cc::optional<gfx::CullMode>    cullMode;

    cc::optional<float> depthBias;
    cc::optional<float> depthBiasClamp;
    cc::optional<float> depthBiasSlop;
    cc::optional<float> lineWidth;

    void fromGFXRasterizerState(const gfx::RasterizerState &rs) {
        isDiscard        = rs.isDiscard;
        isFrontFaceCCW   = rs.isFrontFaceCCW;
        depthBiasEnabled = rs.depthBiasEnabled;
        isDepthClip      = rs.isDepthClip;
        isMultisample    = rs.isMultisample;

        polygonMode = rs.polygonMode;
        shadeModel  = rs.shadeModel;
        cullMode    = rs.cullMode;

        depthBias      = rs.depthBias;
        depthBiasClamp = rs.depthBiasClamp;
        depthBiasSlop  = rs.depthBiasSlop;
        lineWidth      = rs.lineWidth;
    }

    void assignToGFXRasterizerState(gfx::RasterizerState &rs) const {
        if (isDiscard.has_value()) {
            rs.isDiscard = isDiscard.value();
        }
        if (isFrontFaceCCW.has_value()) {
            rs.isFrontFaceCCW = isFrontFaceCCW.value();
        }
        if (depthBiasEnabled.has_value()) {
            rs.depthBiasEnabled = depthBiasEnabled.value();
        }
        if (isDepthClip.has_value()) {
            rs.isDepthClip = isDepthClip.value();
        }
        if (isMultisample.has_value()) {
            rs.isMultisample = isMultisample.value();
        }
        if (polygonMode.has_value()) {
            rs.polygonMode = polygonMode.value();
        }
        if (shadeModel.has_value()) {
            rs.shadeModel = shadeModel.value();
        }
        if (cullMode.has_value()) {
            rs.cullMode = cullMode.value();
        }
        if (depthBias.has_value()) {
            rs.depthBias = depthBias.value();
        }
        if (depthBiasClamp.has_value()) {
            rs.depthBiasClamp = depthBiasClamp.value();
        }
        if (depthBiasSlop.has_value()) {
            rs.depthBiasSlop = depthBiasSlop.value();
        }
        if (lineWidth.has_value()) {
            rs.lineWidth = lineWidth.value();
        }
    }
};

struct DepthStencilStateInfo {
    cc::optional<bool> depthTest;
    cc::optional<bool> depthWrite;
    cc::optional<bool> stencilTestFront;
    cc::optional<bool> stencilTestBack;

    cc::optional<gfx::ComparisonFunc> depthFunc;
    cc::optional<gfx::ComparisonFunc> stencilFuncFront;
    cc::optional<uint>                stencilReadMaskFront;
    cc::optional<uint>                stencilWriteMaskFront;
    cc::optional<gfx::StencilOp>      stencilFailOpFront;
    cc::optional<gfx::StencilOp>      stencilZFailOpFront;
    cc::optional<gfx::StencilOp>      stencilPassOpFront;
    cc::optional<uint>                stencilRefFront;

    cc::optional<gfx::ComparisonFunc> stencilFuncBack;
    cc::optional<uint>                stencilReadMaskBack;
    cc::optional<uint>                stencilWriteMaskBack;
    cc::optional<gfx::StencilOp>      stencilFailOpBack;
    cc::optional<gfx::StencilOp>      stencilZFailOpBack;
    cc::optional<gfx::StencilOp>      stencilPassOpBack;
    cc::optional<uint>                stencilRefBack;

    void fromGFXDepthStencilState(const gfx::DepthStencilState &ds) {
        depthTest        = ds.depthTest;
        depthWrite       = ds.depthWrite;
        stencilTestFront = ds.stencilTestFront;
        stencilTestBack  = ds.stencilTestBack;

        depthFunc             = ds.depthFunc;
        stencilFuncFront      = ds.stencilFuncFront;
        stencilReadMaskFront  = ds.stencilReadMaskFront;
        stencilWriteMaskFront = ds.stencilWriteMaskFront;
        stencilFailOpFront    = ds.stencilFailOpFront;
        stencilZFailOpFront   = ds.stencilZFailOpFront;
        stencilPassOpFront    = ds.stencilPassOpFront;
        stencilRefFront       = ds.stencilRefFront;

        stencilFuncBack      = ds.stencilFuncBack;
        stencilReadMaskBack  = ds.stencilReadMaskBack;
        stencilWriteMaskBack = ds.stencilWriteMaskBack;
        stencilFailOpBack    = ds.stencilFailOpBack;
        stencilZFailOpBack   = ds.stencilZFailOpBack;
        stencilPassOpBack    = ds.stencilPassOpBack;
        stencilRefBack       = ds.stencilRefBack;
    }

    void assignToGFXDepthStencilState(gfx::DepthStencilState &ds) const {
        if (depthTest.has_value()) {
            ds.depthTest = depthTest.value();
        }
        if (depthWrite.has_value()) {
            ds.depthWrite = depthWrite.value();
        }
        if (stencilTestFront.has_value()) {
            ds.stencilTestFront = stencilTestFront.value();
        }
        if (stencilTestBack.has_value()) {
            ds.stencilTestBack = stencilTestBack.value();
        }
        if (depthFunc.has_value()) {
            ds.depthFunc = depthFunc.value();
        }
        if (stencilFuncFront.has_value()) {
            ds.stencilFuncFront = stencilFuncFront.value();
        }
        if (stencilReadMaskFront.has_value()) {
            ds.stencilReadMaskFront = stencilReadMaskFront.value();
        }
        if (stencilWriteMaskFront.has_value()) {
            ds.stencilWriteMaskFront = stencilWriteMaskFront.value();
        }
        if (stencilFailOpFront.has_value()) {
            ds.stencilFailOpFront = stencilFailOpFront.value();
        }
        if (stencilZFailOpFront.has_value()) {
            ds.stencilZFailOpFront = stencilZFailOpFront.value();
        }
        if (stencilPassOpFront.has_value()) {
            ds.stencilPassOpFront = stencilPassOpFront.value();
        }
        if (stencilRefFront.has_value()) {
            ds.stencilRefFront = stencilRefFront.value();
        }
        if (stencilFuncBack.has_value()) {
            ds.stencilFuncBack = stencilFuncBack.value();
        }
        if (stencilReadMaskBack.has_value()) {
            ds.stencilReadMaskBack = stencilReadMaskBack.value();
        }
        if (stencilWriteMaskBack.has_value()) {
            ds.stencilWriteMaskBack = stencilWriteMaskBack.value();
        }
        if (stencilFailOpBack.has_value()) {
            ds.stencilFailOpBack = stencilFailOpBack.value();
        }
        if (stencilZFailOpBack.has_value()) {
            ds.stencilZFailOpBack = stencilZFailOpBack.value();
        }
        if (stencilPassOpBack.has_value()) {
            ds.stencilPassOpBack = stencilPassOpBack.value();
        }
        if (stencilRefBack.has_value()) {
            ds.stencilRefBack = stencilRefBack.value();
        }
    }
};

struct BlendTargetInfo {
    cc::optional<bool>             blend;
    cc::optional<gfx::BlendFactor> blendSrc;
    cc::optional<gfx::BlendFactor> blendDst;
    cc::optional<gfx::BlendOp>     blendEq;
    cc::optional<gfx::BlendFactor> blendSrcAlpha;
    cc::optional<gfx::BlendFactor> blendDstAlpha;
    cc::optional<gfx::BlendOp>     blendAlphaEq;
    cc::optional<gfx::ColorMask>   blendColorMask;

    void fromGFXBlendTarget(const gfx::BlendTarget &target) {
        blend          = target.blend;
        blendSrc       = target.blendSrc;
        blendDst       = target.blendDst;
        blendEq        = target.blendEq;
        blendSrcAlpha  = target.blendSrcAlpha;
        blendDstAlpha  = target.blendDstAlpha;
        blendAlphaEq   = target.blendAlphaEq;
        blendColorMask = target.blendColorMask;
    }

    void assignToGFXBlendTarget(gfx::BlendTarget &target) const {
        if (blend.has_value()) {
            target.blend = blend.value();
        }
        if (blendSrc.has_value()) {
            target.blendSrc = blendSrc.value();
        }
        if (blendDst.has_value()) {
            target.blendDst = blendDst.value();
        }
        if (blendEq.has_value()) {
            target.blendEq = blendEq.value();
        }
        if (blendSrcAlpha.has_value()) {
            target.blendSrcAlpha = blendSrcAlpha.value();
        }
        if (blendDstAlpha.has_value()) {
            target.blendDstAlpha = blendDstAlpha.value();
        }
        if (blendAlphaEq.has_value()) {
            target.blendAlphaEq = blendAlphaEq.value();
        }
        if (blendColorMask.has_value()) {
            target.blendColorMask = blendColorMask.value();
        }
    }
};

using BlendTargetInfoList = std::vector<BlendTargetInfo>;

struct BlendStateInfo {
    cc::optional<bool>                isA2C;
    cc::optional<bool>                isIndepend;
    cc::optional<gfx::Color>          blendColor;
    cc::optional<BlendTargetInfoList> targets;

    void fromGFXBlendState(const gfx::BlendState &bs) {
        isA2C      = bs.isA2C;
        isIndepend = bs.isIndepend;
        blendColor = bs.blendColor;
        size_t len = bs.targets.size();
        if (len > 0) {
            BlendTargetInfoList targetsList(len);
            for (size_t i = 0; i < len; ++i) {
                targetsList[i].fromGFXBlendTarget(bs.targets[i]);
            }
            targets = targetsList;
        }
    }

    void assignToGFXBlendState(gfx::BlendState &bs) const {
        if (targets.has_value()) {
            const auto &targetsVal = targets.value();
            bs.targets.resize(targetsVal.size());
            for (size_t i = 0, len = targetsVal.size(); i < len; ++i) {
                targetsVal[i].assignToGFXBlendTarget(bs.targets[i]);
            }
        }

        if (isA2C.has_value()) {
            bs.isA2C = isA2C.value();
        }

        if (isIndepend.has_value()) {
            bs.isIndepend = isIndepend.value();
        }

        if (blendColor.has_value()) {
            bs.blendColor = blendColor.value();
        }
    }
};

// Pass instance itself are compliant to IPassStates too
struct IPassStates {
    cc::optional<int32_t>                   priority;
    cc::optional<gfx::PrimitiveMode>        primitive;
    cc::optional<pipeline::RenderPassStage> stage;
    cc::optional<RasterizerStateInfo>       rasterizerState;
    cc::optional<DepthStencilStateInfo>     depthStencilState;
    cc::optional<BlendStateInfo>            blendState;
    cc::optional<gfx::DynamicStateFlags>    dynamicStates;
    cc::optional<std::string>               phase;

    IPassStates() = default;
    explicit IPassStates(const IPassInfoFull &o);
    IPassStates &operator=(const IPassInfoFull &o);
    void         overrides(const IPassInfoFull &o);
};
using PassOverrides = IPassStates;

using PassPropertyInfoMap = std::unordered_map<std::string, IPropertyInfo>;

struct IPassInfoFull final { //cjh } : public IPassInfo {
    // IPassStates
    cc::optional<int32_t>                   priority;
    cc::optional<gfx::PrimitiveMode>        primitive;
    cc::optional<pipeline::RenderPassStage> stage;
    cc::optional<RasterizerStateInfo>       rasterizerState;
    cc::optional<DepthStencilStateInfo>     depthStencilState;
    cc::optional<BlendStateInfo>            blendState;
    cc::optional<gfx::DynamicStateFlags>    dynamicStates;
    cc::optional<std::string>               phase;
    // IPassInfo
    std::string                       program; // auto-generated from 'vert' and 'frag'
    cc::optional<MacroRecord>         embeddedMacros;
    index_t                           propertyIndex{CC_INVALID_INDEX};
    cc::optional<std::string>         switch_;
    cc::optional<PassPropertyInfoMap> properties;

    // IPassInfoFull
    // generated part
    index_t                     passIndex{0};
    MacroRecord                 defines;
    cc::optional<PassOverrides> stateOverrides;

    IPassInfoFull() = default;
    explicit IPassInfoFull(const IPassStates &o) {
        *this = o;
    }
    IPassInfoFull &operator=(const IPassStates &o) {
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
};

using IPassInfo = IPassInfoFull;

struct ITechniqueInfo {
    std::vector<IPassInfoFull> passes;
    cc::optional<std::string>  name;
};

struct IBlockInfo {
    int32_t                   binding{-1};
    std::string               name;
    std::vector<gfx::Uniform> members;
    gfx::ShaderStageFlags     stageFlags{gfx::ShaderStageFlags::NONE};
};

struct ISamplerTextureInfo {
    int32_t               binding{-1};
    std::string           name;
    gfx::Type             type{gfx::Type::UNKNOWN};
    uint32_t              count{0};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct ITextureInfo {
    uint32_t              set{0};
    int32_t               binding{-1};
    std::string           name;
    gfx::Type             type{gfx::Type::UNKNOWN};
    uint32_t              count{0};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct ISamplerInfo {
    uint32_t              set{0};
    int32_t               binding{-1};
    std::string           name;
    uint32_t              count{0};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct IBufferInfo {
    int32_t               binding{-1};
    std::string           name;
    gfx::MemoryAccess     memoryAccess{gfx::MemoryAccess::NONE};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct IImageInfo {
    int32_t               binding{-1};
    std::string           name;
    gfx::Type             type{gfx::Type::UNKNOWN};
    uint32_t              count{0};
    gfx::MemoryAccess     memoryAccess{gfx::MemoryAccess::NONE};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct IInputAttachmentInfo {
    uint32_t              set{0};
    int32_t               binding{-1};
    std::string           name;
    uint32_t              count{0};
    gfx::ShaderStageFlags stageFlags{gfx::ShaderStageFlags::NONE};
};

struct IAttributeInfo {
    std::string name;
    gfx::Format format{gfx::Format::UNKNOWN};
    bool        isNormalized{false};
    uint32_t    stream{0U};
    bool        isInstanced{false};
    uint32_t    location{0U};

    std::vector<std::string> defines;
};

struct IDefineInfo {
    std::string                            name;
    std::string                            type;
    cc::optional<std::vector<int32_t>>     range; //cjh number is float?  ?: number[];
    cc::optional<std::vector<std::string>> options;
    cc::optional<std::string>              defaultVal;
};

struct IBuiltin {
    std::string              name;
    std::vector<std::string> defines;
};

struct IBuiltinInfo {
    std::vector<IBuiltin> buffers;
    std::vector<IBuiltin> blocks;
    std::vector<IBuiltin> samplerTextures;
    std::vector<IBuiltin> images;
};

using BuiltinsStatisticsType = std::unordered_map<std::string, int32_t>;

struct IBuiltins {
    IBuiltinInfo           globals;
    IBuiltinInfo           locals;
    BuiltinsStatisticsType statistics;
};

struct IShaderSource {
    std::string vert;
    std::string frag;
};

struct IShaderInfo {
    std::string                       name;
    uint64_t                          hash{0xFFFFFFFFFFFFFFFFULL}; //cjh hash is 64 bit?
    IShaderSource                     glsl4;
    IShaderSource                     glsl3;
    IShaderSource                     glsl1;
    IBuiltins                         builtins;
    std::vector<IDefineInfo>          defines;
    std::vector<IAttributeInfo>       attributes;
    std::vector<IBlockInfo>           blocks;
    std::vector<ISamplerTextureInfo>  samplerTextures;
    std::vector<ISamplerInfo>         samplers;
    std::vector<ITextureInfo>         textures;
    std::vector<IBufferInfo>          buffers;
    std::vector<IImageInfo>           images;
    std::vector<IInputAttachmentInfo> subpassInputs;

    const IShaderSource *getSource(const std::string &version) const {
        if (version == "glsl1") return &glsl1;
        if (version == "glsl3") return &glsl3;
        if (version == "glsl4") return &glsl4;
        return nullptr;
    }
};

using IPreCompileInfoValueType = cc::variant<std::vector<bool>, std::vector<int32_t>, std::vector<std::string>>;
using IPreCompileInfo          = std::unordered_map<std::string, IPreCompileInfoValueType>;

class EffectAsset final : public Asset {
public:
    using Super = Asset;

    EffectAsset()           = default;
    ~EffectAsset() override = default;
    /**
     * @en Register the effect asset to the static map
     * @zh 将指定 effect 注册到全局管理器。
     */
    static void registerAsset(EffectAsset *asset);

    /**
     * @en Unregister the effect asset from the static map
     * @zh 将指定 effect 从全局管理器移除。
     */
    static void remove(const std::string &name);
    static void remove(EffectAsset *asset);

    /**
     * @en Get the effect asset by the given name.
     * @zh 获取指定名字的 effect 资源。
     */
    static EffectAsset *get(const std::string &name);

    using RegisteredEffectAssetMap = std::unordered_map<std::string, IntrusivePtr<EffectAsset>>;
    /**
     * @en Get all registered effect assets.
     * @zh 获取所有已注册的 effect 资源。
     */
    static RegisteredEffectAssetMap &getAll() { return EffectAsset::effects; }

    inline void setTechniques(const std::vector<ITechniqueInfo> &val) { _techniques = val; }
    inline void setShaders(const std::vector<IShaderInfo> &val) { _shaders = val; }
    inline void setCombinations(const std::vector<IPreCompileInfo> &val) { _combinations = val; }

    inline const std::vector<ITechniqueInfo> & getTechniques() const { return _techniques; }
    inline const std::vector<IShaderInfo> &    getShaders() const { return _shaders; }
    inline const std::vector<IPreCompileInfo> &getCombinations() const { return _combinations; }

    /*
    @serializable
    @editorOnly
     */
    bool hideInEditor = false;

    /**
     * @en The loaded callback which should be invoked by the [[Loader]], will automatically register the effect.
     * @zh 通过 [[Loader]] 加载完成时的回调，将自动注册 effect 资源。
     */
    void onLoaded() override;
    bool destroy() override;
    void initDefault(const cc::optional<std::string> &uuid) override;
    bool validate() const override;

protected:
    static std::vector<MacroRecord> doCombine(const std::vector<MacroRecord> &cur, const IPreCompileInfo &info, IPreCompileInfo::iterator iter);
    static std::vector<MacroRecord> generateRecords(const std::string &key, const IPreCompileInfoValueType &value);
    static std::vector<MacroRecord> insertInfoValue(const std::vector<MacroRecord> &records,
                                                    const std::string &             key,
                                                    const IPreCompileInfoValueType &value);

    void precompile();

    // We need make it to public for deserialization
public:
    /**
     * @en The techniques used by the current effect.
     * @zh 当前 effect 的所有可用 technique。

    @serializable
    @editable*/
    std::vector<ITechniqueInfo> _techniques;

    /**
     * @en The shaders used by the current effect.
     * @zh 当前 effect 使用的所有 shader。

    @serializable
    @editable*/
    std::vector<IShaderInfo> _shaders;

    /**
     * @en The preprocess macro combinations for the shader
     * @zh 每个 shader 需要预编译的宏定义组合。

    @serializable
    @editable*/
    std::vector<IPreCompileInfo> _combinations;
    //
protected:
    static RegisteredEffectAssetMap effects; //cjh TODO: how to clear when game exits.

    CC_DISALLOW_COPY_MOVE_ASSIGN(EffectAsset);

    friend class EffectAssetDeserializer;
    friend class Material;
    friend class ProgramLib;
    friend class MaterialInstance;
    friend class BuiltinResMgr;
};

} // namespace cc
