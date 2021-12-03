/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "Define.h"
#include "bindings/jswrapper/SeApi.h"
#include "gfx-base/GFXDevice.h"

namespace cc {
namespace pipeline {

int globalUBOCount     = static_cast<int>(PipelineGlobalBindings::SAMPLER_SHADOWMAP);
int globalSamplerCount = static_cast<int>(PipelineGlobalBindings::COUNT) - globalUBOCount;

int localUBOCount     = static_cast<int>(ModelLocalBindings::SAMPLER_JOINTS);
int localSamplerCount = static_cast<int>(ModelLocalBindings::COUNT) - localUBOCount;

uint globalSet   = static_cast<uint>(SetIndex::GLOBAL);
uint materialSet = static_cast<uint>(SetIndex::MATERIAL);
uint localSet    = static_cast<uint>(SetIndex::LOCAL);

gfx::BindingMappingInfo bindingMappingInfo = {
    {0, globalUBOCount + localUBOCount, globalUBOCount},
    {-globalUBOCount, globalSamplerCount + localSamplerCount, globalSamplerCount - localUBOCount},
    1,
};

DescriptorSetLayoutInfos              globalDescriptorSetLayout;
DescriptorSetLayoutInfos              localDescriptorSetLayout;
const String                          UBOGlobal::NAME       = "CCGlobal";
const gfx::DescriptorSetLayoutBinding UBOGlobal::DESCRIPTOR = {
    UBOGlobal::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
    {},
};
const gfx::UniformBlock UBOGlobal::LAYOUT = {
    globalSet,
    UBOGlobal::BINDING,
    UBOGlobal::NAME,
    {
        {"cc_time", gfx::Type::FLOAT4, 1},
        {"cc_screenSize", gfx::Type::FLOAT4, 1},
        {"cc_nativeSize", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOLocalBatched::NAME       = "CCLocalBatched";
const gfx::DescriptorSetLayoutBinding UBOLocalBatched::DESCRIPTOR = {
    UBOLocalBatched::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformBlock UBOLocalBatched::LAYOUT = {
    localSet,
    UBOLocalBatched::BINDING,
    UBOLocalBatched::NAME,
    {
        {"cc_matWorlds", gfx::Type::MAT4, static_cast<uint>(UBOLocalBatched::BATCHING_COUNT)},
    },
    1,
};

const String                          UBOCamera::NAME       = "CCCamera";
const gfx::DescriptorSetLayoutBinding UBOCamera::DESCRIPTOR = {
    UBOCamera::BINDING,
    gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
    {},
};
const gfx::UniformBlock UBOCamera::LAYOUT = {
    globalSet,
    UBOCamera::BINDING,
    UBOCamera::NAME,
    {
        {"cc_matView", gfx::Type::MAT4, 1},
        {"cc_matViewInv", gfx::Type::MAT4, 1},
        {"cc_matProj", gfx::Type::MAT4, 1},
        {"cc_matProjInv", gfx::Type::MAT4, 1},
        {"cc_matViewProj", gfx::Type::MAT4, 1},
        {"cc_matViewProjInv", gfx::Type::MAT4, 1},
        {"cc_cameraPos", gfx::Type::FLOAT4, 1},
        {"cc_screenScale", gfx::Type::FLOAT4, 1},
        {"cc_exposure", gfx::Type::FLOAT4, 1},
        {"cc_mainLitDir", gfx::Type::FLOAT4, 1},
        {"cc_mainLitColor", gfx::Type::FLOAT4, 1},
        {"cc_ambientSky", gfx::Type::FLOAT4, 1},
        {"cc_ambientGround", gfx::Type::FLOAT4, 1},
        {"cc_fogColor", gfx::Type::FLOAT4, 1},
        {"cc_fogBase", gfx::Type::FLOAT4, 1},
        {"cc_fogAdd", gfx::Type::FLOAT4, 1},
        {"cc_nearFar", gfx::Type::FLOAT4, 1},
        {"cc_viewPort", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOShadow::NAME       = "CCShadow";
const gfx::DescriptorSetLayoutBinding UBOShadow::DESCRIPTOR = {
    UBOShadow::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
    {},
};
const gfx::UniformBlock UBOShadow::LAYOUT = {
    globalSet,
    UBOShadow::BINDING,
    UBOShadow::NAME,
    {
        {"cc_matLightPlaneProj", gfx::Type::MAT4, 1},
        {"cc_matLightView", gfx::Type::MAT4, 1},
        {"cc_matLightViewProj", gfx::Type::MAT4, 1},
        {"cc_shadowInvProjDepthInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowProjDepthInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowProjInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowNFLSInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowWHPBInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowLPNNInfo", gfx::Type::FLOAT4, 1},
        {"cc_shadowColor", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOLocal::NAME       = "CCLocal";
const gfx::DescriptorSetLayoutBinding UBOLocal::DESCRIPTOR = {
    UBOLocal::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX | gfx::ShaderStageFlagBit::COMPUTE,
    {},
};
const gfx::UniformBlock UBOLocal::LAYOUT = {
    localSet,
    UBOLocal::BINDING,
    UBOLocal::NAME,
    {
        {"cc_matWorld", gfx::Type::MAT4, 1},
        {"cc_matWorldIT", gfx::Type::MAT4, 1},
        {"cc_lightingMapUVParam", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOWorldBound::NAME       = "CCWorldBound";
const gfx::DescriptorSetLayoutBinding UBOWorldBound::DESCRIPTOR = {
    UBOWorldBound::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX | gfx::ShaderStageFlagBit::COMPUTE,
    {},
};
const gfx::UniformBlock UBOWorldBound::LAYOUT = {
    localSet,
    UBOWorldBound::BINDING,
    UBOWorldBound::NAME,
    {
        {"cc_worldBoundCenter", gfx::Type::FLOAT4, 1},
        {"cc_worldBoundHalfExtents", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOForwardLight::NAME       = "CCForwardLight";
const gfx::DescriptorSetLayoutBinding UBOForwardLight::DESCRIPTOR = {
    UBOForwardLight::BINDING,
    gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformBlock UBOForwardLight::LAYOUT = {
    localSet,
    UBOForwardLight::BINDING,
    UBOForwardLight::NAME,
    {
        {"cc_lightPos", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
        {"cc_lightColor", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
        {"cc_lightSizeRangeAngle", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
        {"cc_lightDir", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
    },
    1,
};

const String                          UBOSkinningTexture::NAME       = "CCSkinningTexture";
const gfx::DescriptorSetLayoutBinding UBOSkinningTexture::DESCRIPTOR = {
    UBOSkinningTexture::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformBlock UBOSkinningTexture::LAYOUT = {
    localSet,
    UBOSkinningTexture::BINDING,
    UBOSkinningTexture::NAME,
    {
        {"cc_jointTextureInfo", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOSkinningAnimation::NAME       = "CCSkinningAnimation";
const gfx::DescriptorSetLayoutBinding UBOSkinningAnimation::DESCRIPTOR = {
    UBOSkinningAnimation::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformBlock UBOSkinningAnimation::LAYOUT = {
    localSet,
    UBOSkinningAnimation::BINDING,
    UBOSkinningAnimation::NAME,
    {
        {"cc_jointAnimInfo", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOSkinning::NAME       = "CCSkinning";
const gfx::DescriptorSetLayoutBinding UBOSkinning::DESCRIPTOR = {
    UBOSkinning::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformBlock UBOSkinning::LAYOUT = {
    localSet,
    UBOSkinning::BINDING,
    UBOSkinning::NAME,
    {
        {"cc_joints", gfx::Type::FLOAT4, JOINT_UNIFORM_CAPACITY * 3},
    },
    1,
};

const uint                            UBOMorph::COUNT_BASE_4_BYTES = static_cast<uint>(4 * std::ceil(UBOMorph::MAX_MORPH_TARGET_COUNT / 4) + 4);
const uint                            UBOMorph::SIZE               = UBOMorph::COUNT_BASE_4_BYTES * 4;
const String                          UBOMorph::NAME               = "CCMorph";
const gfx::DescriptorSetLayoutBinding UBOMorph::DESCRIPTOR         = {
    UBOMorph::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformBlock UBOMorph::LAYOUT = {
    localSet,
    UBOMorph::BINDING,
    UBOMorph::NAME,
    {
        {"cc_displacementWeights", gfx::Type::FLOAT4, static_cast<uint>(UBOMorph::MAX_MORPH_TARGET_COUNT / 4)},
        {"cc_displacementWeights", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          UBOUILocal::NAME       = "CCMorph";
const gfx::DescriptorSetLayoutBinding UBOUILocal::DESCRIPTOR = {
    UBOUILocal::BINDING,
    gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOUILocal::LAYOUT = {
    localSet,
    UBOUILocal::BINDING,
    UBOUILocal::NAME,
    {
        {"cc_local_data", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String                          SHADOWMAP::NAME       = "cc_shadowMap";
const gfx::DescriptorSetLayoutBinding SHADOWMAP::DESCRIPTOR = {
    SHADOWMAP::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture SHADOWMAP::LAYOUT = {
    globalSet,
    SHADOWMAP::BINDING,
    SHADOWMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          ENVIRONMENT::NAME       = "cc_environment";
const gfx::DescriptorSetLayoutBinding ENVIRONMENT::DESCRIPTOR = {
    ENVIRONMENT::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture ENVIRONMENT::LAYOUT = {
    globalSet,
    ENVIRONMENT::BINDING,
    ENVIRONMENT::NAME,
    gfx::Type::SAMPLER_CUBE,
    1,
};

const String                          SPOTLIGHTINGMAP::NAME       = "cc_spotLightingMap";
const gfx::DescriptorSetLayoutBinding SPOTLIGHTINGMAP::DESCRIPTOR = {
    SPOTLIGHTINGMAP::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture SPOTLIGHTINGMAP::LAYOUT = {
    globalSet,
    SPOTLIGHTINGMAP::BINDING,
    SPOTLIGHTINGMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          DIFFUSEMAP::NAME       = "cc_diffuseMap";
const gfx::DescriptorSetLayoutBinding DIFFUSEMAP::DESCRIPTOR = {
    DIFFUSEMAP::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture DIFFUSEMAP::LAYOUT = {
    globalSet,
    DIFFUSEMAP::BINDING,
    DIFFUSEMAP::NAME,
    gfx::Type::SAMPLER_CUBE,
    1,
};

const String                          JOINTTEXTURE::NAME       = "cc_jointTexture";
const gfx::DescriptorSetLayoutBinding JOINTTEXTURE::DESCRIPTOR = {
    JOINTTEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformSamplerTexture JOINTTEXTURE::LAYOUT = {
    localSet,
    JOINTTEXTURE::BINDING,
    JOINTTEXTURE::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          POSITIONMORPH::NAME       = "cc_PositionDisplacements";
const gfx::DescriptorSetLayoutBinding POSITIONMORPH::DESCRIPTOR = {
    POSITIONMORPH::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformSamplerTexture POSITIONMORPH::LAYOUT = {
    localSet,
    POSITIONMORPH::BINDING,
    POSITIONMORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          NORMALMORPH::NAME       = "cc_NormalDisplacements";
const gfx::DescriptorSetLayoutBinding NORMALMORPH::DESCRIPTOR = {
    NORMALMORPH::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformSamplerTexture NORMALMORPH::LAYOUT = {
    localSet,
    NORMALMORPH::BINDING,
    NORMALMORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          TANGENTMORPH::NAME       = "cc_TangentDisplacements";
const gfx::DescriptorSetLayoutBinding TANGENTMORPH::DESCRIPTOR = {
    TANGENTMORPH::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
    {},
};
const gfx::UniformSamplerTexture TANGENTMORPH::LAYOUT = {
    localSet,
    TANGENTMORPH::BINDING,
    TANGENTMORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          LIGHTMAPTEXTURE::NAME       = "cc_lightingMap";
const gfx::DescriptorSetLayoutBinding LIGHTMAPTEXTURE::DESCRIPTOR = {
    LIGHTMAPTEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture LIGHTMAPTEXTURE::LAYOUT = {
    localSet,
    LIGHTMAPTEXTURE::BINDING,
    LIGHTMAPTEXTURE::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String                          SPRITETEXTURE::NAME       = "cc_spriteTexture";
const gfx::DescriptorSetLayoutBinding SPRITETEXTURE::DESCRIPTOR = {
    SPRITETEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture SPRITETEXTURE::LAYOUT = {
    localSet,
    static_cast<uint>(ModelLocalBindings::SAMPLER_SPRITE),
    "cc_spriteTexture",
    gfx::Type::SAMPLER2D,
    1,
};

const String                          REFLECTIONTEXTURE::NAME       = "cc_reflectionTexture";
const gfx::DescriptorSetLayoutBinding REFLECTIONTEXTURE::DESCRIPTOR = {
    REFLECTIONTEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER_TEXTURE,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
    {},
};
const gfx::UniformSamplerTexture REFLECTIONTEXTURE::LAYOUT = {
    localSet,
    static_cast<uint>(ModelLocalBindings::SAMPLER_REFLECTION),
    "cc_reflectionTexture",
    gfx::Type::SAMPLER2D,
    1,
};

const String                          REFLECTIONSTORAGE::NAME       = "cc_reflectionStorage";
const gfx::DescriptorSetLayoutBinding REFLECTIONSTORAGE::DESCRIPTOR = {
    REFLECTIONSTORAGE::BINDING,
    gfx::DescriptorType::STORAGE_IMAGE,
    1,
    gfx::ShaderStageFlagBit::COMPUTE,
    {},
};
const gfx::UniformStorageImage REFLECTIONSTORAGE::LAYOUT = {
    localSet,
    static_cast<uint>(ModelLocalBindings::STORAGE_REFLECTION),
    "cc_reflectionStorage",
    gfx::Type::IMAGE2D,
    1,
};

uint skyboxFlag = static_cast<uint>(gfx::ClearFlagBit::STENCIL) << 1;

uint nextPow2(uint val) {
    --val;
    val |= (val >> 1);
    val |= (val >> 2);
    val |= (val >> 4);
    val |= (val >> 8);
    val |= (val >> 16);
    ++val;
    return val;
}

bool supportsHalfFloatTexture(gfx::Device *device) {
    return device->hasFeature(gfx::Feature::COLOR_HALF_FLOAT) &&
           device->hasFeature(gfx::Feature::TEXTURE_HALF_FLOAT) &&
           device->getGfxAPI() != gfx::API::GLES2;
}

bool supportsFloatTexture(gfx::Device *device) {
    return device->hasFeature(gfx::Feature::COLOR_FLOAT) &&
           device->hasFeature(gfx::Feature::TEXTURE_FLOAT) &&
           device->getGfxAPI() != gfx::API::GLES2;
}

uint getPhaseID(const String &phase) {
    se::Object *globalObj = se::ScriptEngine::getInstance()->getGlobalObject();

    se::Value nrValue;
    if (!globalObj->getProperty("nr", &nrValue)) {
        CC_LOG_ERROR("getPhaseID: failed to get nr property.");
        return 0;
    }
    se::Object *nrObjct = nrValue.toObject();
    se::Value   nrPhase;
    if (!nrObjct->getProperty("getPhaseID", &nrPhase)) {
        CC_LOG_ERROR("getPhaseID: failed to get getPhaseID property.");
        return 0;
    }
    se::ValueArray args;
    args.push_back(se::Value(phase));
    se::Value nrResult;
    nrPhase.toObject()->call(args, nullptr, &nrResult);
    return nrResult.toUint32();
}
} // namespace pipeline
} // namespace cc
