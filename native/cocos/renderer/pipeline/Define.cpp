/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "Define.h"
#include "cocos/bindings/jswrapper/SeApi.h"
#include "gfx/GFXDevice.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
uint GLOBAL_SET = static_cast<uint>(SetIndex::GLOBAL);
uint MATERIAL_SET = static_cast<uint>(SetIndex::MATERIAL);
uint LOCAL_SET = static_cast<uint>(SetIndex::LOCAL);

DescriptorSetLayoutInfos globalDescriptorSetLayout;
DescriptorSetLayoutInfos localDescriptorSetLayout;
const String UBOGlobal::NAME = "CCGlobal";
const gfx::DescriptorSetLayoutBinding UBOGlobal::DESCRIPTOR = {
    UBOGlobal::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
};
const gfx::UniformBlock UBOGlobal::LAYOUT = {
    GLOBAL_SET,
    UBOGlobal::BINDING,
    UBOGlobal::NAME,
    {
        {"cc_time", gfx::Type::FLOAT4, 1},
        {"cc_screenSize", gfx::Type::FLOAT4, 1},
        {"cc_nativeSize", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String UBOLocalBatched::NAME = "CCLocalBatched";
const gfx::DescriptorSetLayoutBinding UBOLocalBatched::DESCRIPTOR = {
    UBOLocalBatched::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOLocalBatched::LAYOUT = {
    LOCAL_SET,
    UBOLocalBatched::BINDING,
    UBOLocalBatched::NAME,
    {
        {"cc_matWorlds", gfx::Type::MAT4, static_cast<uint>(UBOLocalBatched::BATCHING_COUNT)},
    },
    1,
};

const String UBOCamera::NAME = "CCCamera";
const gfx::DescriptorSetLayoutBinding UBOCamera::DESCRIPTOR = {
    UBOCamera::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
};
const gfx::UniformBlock UBOCamera::LAYOUT = {
    GLOBAL_SET,
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
    },
    1,
};

const String UBOShadow::NAME = "CCShadow";
const gfx::DescriptorSetLayoutBinding UBOShadow::DESCRIPTOR = {
    UBOShadow::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::ALL,
};
const gfx::UniformBlock UBOShadow::LAYOUT = {
    GLOBAL_SET,
    UBOShadow::BINDING,
    UBOShadow::NAME,
    {
        {"cc_matLightPlaneProj", gfx::Type::MAT4, 1},
        {"cc_matLightViewProj", gfx::Type::MAT4, 1},
        {"cc_shadowColor", gfx::Type::FLOAT4, 1},
        {"cc_shadowInfo", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String UBOLocal::NAME = "CCLocal";
const gfx::DescriptorSetLayoutBinding UBOLocal::DESCRIPTOR = {
    UBOLocal::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOLocal::LAYOUT = {
    LOCAL_SET,
    UBOLocal::BINDING,
    UBOLocal::NAME,
    {
        {"cc_matWorld", gfx::Type::MAT4, 1},
        {"cc_matWorldIT", gfx::Type::MAT4, 1},
        {"cc_lightingMapUVParam", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String UBOForwardLight::NAME = "CCForwardLight";
const gfx::DescriptorSetLayoutBinding UBOForwardLight::DESCRIPTOR = {
    UBOForwardLight::BINDING,
    gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformBlock UBOForwardLight::LAYOUT = {
    LOCAL_SET,
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

const String UBOSkinningTexture::NAME = "CCSkinningTexture";
const gfx::DescriptorSetLayoutBinding UBOSkinningTexture::DESCRIPTOR = {
    UBOSkinningTexture::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOSkinningTexture::LAYOUT = {
    LOCAL_SET,
    UBOSkinningTexture::BINDING,
    UBOSkinningTexture::NAME,
    {
        {"cc_jointTextureInfo", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String UBOSkinningAnimation::NAME = "CCSkinningAnimation";
const gfx::DescriptorSetLayoutBinding UBOSkinningAnimation::DESCRIPTOR = {
    UBOSkinningAnimation::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOSkinningAnimation::LAYOUT = {
    LOCAL_SET,
    UBOSkinningAnimation::BINDING,
    UBOSkinningAnimation::NAME,
    {
        {"cc_jointAnimInfo", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String UBOSkinning::NAME = "CCSkinning";
const gfx::DescriptorSetLayoutBinding UBOSkinning::DESCRIPTOR = {
    UBOSkinning::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOSkinning::LAYOUT = {
    LOCAL_SET,
    UBOSkinning::BINDING,
    UBOSkinning::NAME,
    {
        {"cc_joints", gfx::Type::FLOAT4, JOINT_UNIFORM_CAPACITY * 3},
    },
    1,
};

const uint UBOMorph::COUNT_BASE_4_BYTES = 4 * std::ceil(UBOMorph::MAX_MORPH_TARGET_COUNT / 4) + 4;
const uint UBOMorph::SIZE = UBOMorph::COUNT_BASE_4_BYTES * 4;
const String UBOMorph::NAME = "CCMorph";
const gfx::DescriptorSetLayoutBinding UBOMorph::DESCRIPTOR = {
    UBOMorph::BINDING,
    gfx::DescriptorType::UNIFORM_BUFFER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformBlock UBOMorph::LAYOUT = {
    LOCAL_SET,
    UBOMorph::BINDING,
    UBOMorph::NAME,
    {
        {"cc_displacementWeights", gfx::Type::FLOAT4, static_cast<uint>(UBOMorph::MAX_MORPH_TARGET_COUNT / 4)},
        {"cc_displacementWeights", gfx::Type::FLOAT4, 1},
    },
    1,
};

const String SHADOWMAP::NAME = "cc_shadowMap";
const gfx::DescriptorSetLayoutBinding SHADOWMAP::DESCRIPTOR = {
    SHADOWMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SHADOWMAP::LAYOUT = {
    GLOBAL_SET,
    SHADOWMAP::BINDING,
    SHADOWMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SAMPLERGBUFFERALBEDOMAP::NAME = "cc_gbuffer_albedoMap";
const gfx::DescriptorSetLayoutBinding SAMPLERGBUFFERALBEDOMAP::DESCRIPTOR = {
    SAMPLERGBUFFERALBEDOMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SAMPLERGBUFFERALBEDOMAP::LAYOUT = {
    GLOBAL_SET,
    SAMPLERGBUFFERALBEDOMAP::BINDING,
    SAMPLERGBUFFERALBEDOMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SAMPLERGBUFFERPOSITIONMAP::NAME = "cc_gbuffer_positionMap";
const gfx::DescriptorSetLayoutBinding SAMPLERGBUFFERPOSITIONMAP::DESCRIPTOR = {
    SAMPLERGBUFFERPOSITIONMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SAMPLERGBUFFERPOSITIONMAP::LAYOUT = {
    GLOBAL_SET,
    SAMPLERGBUFFERPOSITIONMAP::BINDING,
    SAMPLERGBUFFERPOSITIONMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SAMPLERGBUFFERNORMALMAP::NAME = "cc_gbuffer_normalMap";
const gfx::DescriptorSetLayoutBinding SAMPLERGBUFFERNORMALMAP::DESCRIPTOR = {
    SAMPLERGBUFFERNORMALMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SAMPLERGBUFFERNORMALMAP::LAYOUT = {
    GLOBAL_SET,
    SAMPLERGBUFFERNORMALMAP::BINDING,
    SAMPLERGBUFFERNORMALMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SAMPLERGBUFFEREMISSIVEMAP::NAME = "cc_gbuffer_emissiveMap";
const gfx::DescriptorSetLayoutBinding SAMPLERGBUFFEREMISSIVEMAP::DESCRIPTOR = {
    SAMPLERGBUFFEREMISSIVEMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SAMPLERGBUFFEREMISSIVEMAP::LAYOUT = {
    GLOBAL_SET,
    SAMPLERGBUFFEREMISSIVEMAP::BINDING,
    SAMPLERGBUFFEREMISSIVEMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SAMPLERLIGHTINGRESULTMAP::NAME = "cc_lighting_resultMap";
const gfx::DescriptorSetLayoutBinding SAMPLERLIGHTINGRESULTMAP::DESCRIPTOR = {
    SAMPLERLIGHTINGRESULTMAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SAMPLERLIGHTINGRESULTMAP::LAYOUT = {
    GLOBAL_SET,
    SAMPLERLIGHTINGRESULTMAP::BINDING,
    SAMPLERLIGHTINGRESULTMAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String ENVIRONMENT::NAME = "cc_environment";
const gfx::DescriptorSetLayoutBinding ENVIRONMENT::DESCRIPTOR = {
    ENVIRONMENT::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler ENVIRONMENT::LAYOUT = {
    GLOBAL_SET,
    ENVIRONMENT::BINDING,
    ENVIRONMENT::NAME,
    gfx::Type::SAMPLER_CUBE,
    1,
};

const String SPOT_LIGHTING_MAP::NAME = "cc_spotLightingMap";
const gfx::DescriptorSetLayoutBinding SPOT_LIGHTING_MAP::DESCRIPTOR = {
    SPOT_LIGHTING_MAP::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SPOT_LIGHTING_MAP::LAYOUT = {
    GLOBAL_SET,
    SPOT_LIGHTING_MAP::BINDING,
    SPOT_LIGHTING_MAP::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String JOINT_TEXTURE::NAME = "cc_jointTexture";
const gfx::DescriptorSetLayoutBinding JOINT_TEXTURE::DESCRIPTOR = {
    JOINT_TEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformSampler JOINT_TEXTURE::LAYOUT = {
    LOCAL_SET,
    JOINT_TEXTURE::BINDING,
    JOINT_TEXTURE::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String POSITION_MORPH::NAME = "cc_PositionDisplacements";
const gfx::DescriptorSetLayoutBinding POSITION_MORPH::DESCRIPTOR = {
    POSITION_MORPH::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformSampler POSITION_MORPH::LAYOUT = {
    LOCAL_SET,
    POSITION_MORPH::BINDING,
    POSITION_MORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String NORMAL_MORPH::NAME = "cc_NormalDisplacements";
const gfx::DescriptorSetLayoutBinding NORMAL_MORPH::DESCRIPTOR = {
    NORMAL_MORPH::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformSampler NORMAL_MORPH::LAYOUT = {
    LOCAL_SET,
    NORMAL_MORPH::BINDING,
    NORMAL_MORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String TANGENT_MORPH::NAME = "cc_TangentDisplacements";
const gfx::DescriptorSetLayoutBinding TANGENT_MORPH::DESCRIPTOR = {
    TANGENT_MORPH::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::VERTEX,
};
const gfx::UniformSampler TANGENT_MORPH::LAYOUT = {
    LOCAL_SET,
    TANGENT_MORPH::BINDING,
    TANGENT_MORPH::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String LIGHTMAP_TEXTURE::NAME = "cc_lightingMap";
const gfx::DescriptorSetLayoutBinding LIGHTMAP_TEXTURE::DESCRIPTOR = {
    LIGHTMAP_TEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler LIGHTMAP_TEXTURE::LAYOUT = {
    LOCAL_SET,
    LIGHTMAP_TEXTURE::BINDING,
    LIGHTMAP_TEXTURE::NAME,
    gfx::Type::SAMPLER2D,
    1,
};

const String SPRITE_TEXTURE::NAME = "cc_spriteTexture";
const gfx::DescriptorSetLayoutBinding SPRITE_TEXTURE::DESCRIPTOR = {
    SPRITE_TEXTURE::BINDING,
    gfx::DescriptorType::SAMPLER,
    1,
    gfx::ShaderStageFlagBit::FRAGMENT,
};
const gfx::UniformSampler SPRITE_TEXTURE::LAYOUT = {
    LOCAL_SET,
    static_cast<uint>(ModelLocalBindings::SAMPLER_SPRITE),
    "cc_spriteTexture",
    gfx::Type::SAMPLER2D,
    1,
};

uint genSamplerHash(const gfx::SamplerInfo &info) {
    uint hash = 0;
    hash |= static_cast<uint>(info.minFilter);
    hash |= static_cast<uint>(info.magFilter) << 2;
    hash |= static_cast<uint>(info.mipFilter) << 4;
    hash |= static_cast<uint>(info.addressU) << 6;
    hash |= static_cast<uint>(info.addressV) << 8;
    hash |= static_cast<uint>(info.addressW) << 10;
    hash |= static_cast<uint>(info.maxAnisotropy) << 12;
    hash |= static_cast<uint>(info.cmpFunc) << 16;
    hash |= static_cast<uint>(info.minLOD) << 20;
    hash |= static_cast<uint>(info.maxLOD) << 24;
    hash |= static_cast<uint>(info.mipLODBias) << 28;
    return hash;
}

static uint defaultSamplerHash = genSamplerHash(gfx::SamplerInfo());

map<uint, gfx::Sampler *> samplerCache;
gfx::Sampler *getSampler(uint hash) {
    if (hash == 0) {
        hash = defaultSamplerHash;
    }

    auto sampler = samplerCache[hash];
    if (sampler) {
        return sampler;
    }

    gfx::SamplerInfo info;
    info.minFilter = static_cast<gfx::Filter>(hash & 3);
    info.magFilter = static_cast<gfx::Filter>((hash >> 2) & 3);
    info.mipFilter = static_cast<gfx::Filter>((hash >> 4) & 3);
    info.addressU = static_cast<gfx::Address>((hash >> 6) & 3);
    info.addressV = static_cast<gfx::Address>((hash >> 8) & 3);
    info.addressW = static_cast<gfx::Address>((hash >> 10) & 3);
    info.maxAnisotropy = ((hash >> 12) & 15);
    info.cmpFunc = static_cast<gfx::ComparisonFunc>((hash >> 16) & 15);
    info.minLOD = ((hash >> 20) & 15);
    info.maxLOD = ((hash >> 24) & 15);
    info.mipLODBias = ((hash >> 28) & 15);

    sampler = gfx::Device::getInstance()->createSampler(std::move(info));
    return sampler;
}

uint SKYBOX_FLAG = static_cast<uint>(gfx::ClearFlagBit::STENCIL) << 1;

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

uint getPhaseID(const String &phase) {
    se::Object *globalObj = se::ScriptEngine::getInstance()->getGlobalObject();

    se::Value nrValue;
    if (!globalObj->getProperty("nr", &nrValue)) {
        CC_LOG_ERROR("getPhaseID: failed to get nr property.");
        return 0;
    }
    se::Object *nrObjct = nrValue.toObject();
    se::Value nrPhase;
    if (!nrObjct->getProperty("getPhaseID", &nrPhase)) {
        CC_LOG_ERROR("getPhaseID: failed to get getPhaseID property.");
        return 0;
    }
    se::ValueArray args;
    args.push_back(se::Value(phase));
    se::Value nrResult;
    nrPhase.toObject()->call(args, nullptr, &nrResult);
    return nrResult.toUint();
}
} // namespace pipeline
} // namespace cc
