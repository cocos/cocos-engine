#include "Define.h"
#include "gfx/GFXDevice.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {

const BlockInfo UBOGlobal::BLOCK = {
    {static_cast<uint>(SetIndex::GLOBAL),
     static_cast<uint>(PipelineGlobalBindings::UBO_GLOBAL),
     "CCGlobal",
     {
         {"cc_time", gfx::Type::FLOAT4, 1},
         {"cc_screenSize", gfx::Type::FLOAT4, 1},
         {"cc_screenScale", gfx::Type::FLOAT4, 1},
         {"cc_nativeSize", gfx::Type::FLOAT4, 1},
         {"cc_matView", gfx::Type::MAT4, 1},
         {"cc_matViewInv", gfx::Type::MAT4, 1},
         {"cc_matProj", gfx::Type::MAT4, 1},
         {"cc_matProjInv", gfx::Type::MAT4, 1},
         {"cc_matViewProj", gfx::Type::MAT4, 1},
         {"cc_matViewProjInv", gfx::Type::MAT4, 1},
         {"cc_cameraPos", gfx::Type::FLOAT4, 1},
         {"cc_exposure", gfx::Type::FLOAT4, 1},
         {"cc_mainLitDir", gfx::Type::FLOAT4, 1},
         {"cc_mainLitColor", gfx::Type::FLOAT4, 1},
         {"cc_ambientSky", gfx::Type::FLOAT4, 1},
         {"cc_ambientGround", gfx::Type::FLOAT4, 1},
         {"cc_fogColor", gfx::Type::FLOAT4, 1},
         {"cc_fogBase", gfx::Type::FLOAT4, 1},
         {"cc_fogAdd", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::ALL,
    }};

const BlockInfo UBOLocalBatched::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_LOCAL),
     "CCLocalBatched",
     {
         {"cc_matWorlds", gfx::Type::MAT4, static_cast<uint>(UBOLocalBatched::BATCHING_COUNT)},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::ALL,
    }};

const BlockInfo UBOShadow::BLOCK = {
    {static_cast<uint>(SetIndex::GLOBAL),
     static_cast<uint>(PipelineGlobalBindings::UBO_SHADOW),
     "CCShadow",
     {
         {"cc_matLightPlaneProj", gfx::Type::MAT4, 1},
         {"cc_matLightViewProj", gfx::Type::MAT4, 1},
         {"cc_shadowColor", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::ALL,
    }};

const BlockInfo UBOLocal::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_LOCAL),
     "CCLocal",
     {
         {"cc_matWorld", gfx::Type::MAT4, 1},
         {"cc_matWorldIT", gfx::Type::MAT4, 1},
         {"cc_lightingMapUVParam", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const BlockInfo UBOForwardLight::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_FORWARD_LIGHTS),
     "CCForwardLight",
     {
         {"cc_lightPos", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
         {"cc_lightColor", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
         {"cc_lightSizeRangeAngle", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
         {"cc_lightDir", gfx::Type::FLOAT4, static_cast<uint>(UBOForwardLight::LIGHTS_PER_PASS)},
     },
     1},
    {
        gfx::DescriptorType::DYNAMIC_UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::FRAGMENT,
    }};

const BlockInfo UBOSkinningTexture::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_SKINNING_TEXTURE),
     "CCSkinningTexture",
     {
         {"cc_jointTextureInfo", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const BlockInfo UBOSkinningAnimation::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_SKINNING_ANIMATION),
     "CCSkinningAnimation",
     {
         {"cc_jointAnimInfo", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const BlockInfo UBOSkinning::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_SKINNING_TEXTURE),
     "CCSkinning",
     {
         {"cc_joints", gfx::Type::FLOAT4, JOINT_UNIFORM_CAPACITY * 3},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const uint UBOMorph::MAX_MORPH_TARGET_COUNT = 60;
const uint UBOMorph::OFFSET_OF_WEIGHTS = 0;
const uint UBOMorph::OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH = 4 * UBOMorph::MAX_MORPH_TARGET_COUNT;
const uint UBOMorph::OFFSET_OF_DISPLACEMENT_TEXTURE_HEIGHT = UBOMorph::OFFSET_OF_DISPLACEMENT_TEXTURE_WIDTH + 4;
const uint UBOMorph::COUNT_BASE_4_BYTES = 4 * std::ceil(UBOMorph::MAX_MORPH_TARGET_COUNT / 4) + 4;
const uint UBOMorph::SIZE = UBOMorph::COUNT_BASE_4_BYTES * 4;
const BlockInfo UBOMorph::BLOCK = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::UBO_MORPH),
     "CCMorph",
     {
         {"cc_displacementWeights", gfx::Type::FLOAT4, static_cast<uint>(UBOMorph::MAX_MORPH_TARGET_COUNT / 4)},
         {"cc_displacementWeights", gfx::Type::FLOAT4, 1},
     },
     1},
    {
        gfx::DescriptorType::UNIFORM_BUFFER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const SamplerInfo UNIFORM_SHADOWMAP = {
    {static_cast<uint>(SetIndex::GLOBAL),
     static_cast<uint>(PipelineGlobalBindings::SAMPLER_SHADOWMAP),
     "cc_shadowMap",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::FRAGMENT,
    }};

const SamplerInfo UNIFORM_ENVIRONMENT = {
    {static_cast<uint>(SetIndex::GLOBAL),
     static_cast<uint>(PipelineGlobalBindings::SAMPLER_ENVIRONMENT),
     "cc_environment",
     gfx::Type::SAMPLER_CUBE,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::FRAGMENT,
    }};

const SamplerInfo UniformJointTexture = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_JOINTS),
     "cc_jointTexture",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const SamplerInfo UniformPositionMorphTexture = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_MORPH_POSITION),
     "cc_PositionDisplacements",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const SamplerInfo UniformNormalMorphTexture = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_MORPH_NORMAL),
     "cc_NormalDisplacements",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const SamplerInfo UniformTangentMorphTexture = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_MORPH_TANGENT),
     "cc_TangentDisplacements",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::VERTEX,
    }};

const SamplerInfo UniformLightingMapSampler = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_LIGHTING_MAP),
     "cc_lightingMap",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::FRAGMENT,
    }};

const SamplerInfo UniformSpriteSampler = {
    {static_cast<uint>(SetIndex::LOCAL),
     static_cast<uint>(ModelLocalBindings::SAMPLER_SPRITE),
     "cc_spriteTexture",
     gfx::Type::SAMPLER2D,
     1},
    {
        gfx::DescriptorType::SAMPLER,
        1,
        gfx::ShaderStageFlagBit::FRAGMENT,
    }};

DescriptorSetLayoutInfos globalDescriptorSetLayout;
DescriptorSetLayoutInfos localDescriptorSetLayout;

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
    return 0;
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

int aabb_plane(const AABB *aabb, const Plane *plane) {
    const auto &halfExtents = aabb->halfExtents;
    auto r = halfExtents.x * std::abs(plane->normal.x) +
             halfExtents.y * std::abs(plane->normal.y) +
             halfExtents.z * std::abs(plane->normal.z);
    auto dot = Vec3::dot(plane->normal, aabb->center);
    if (dot + r < plane->distance) {
        return -1;
    } else if (dot - r > plane->distance) {
        return 0;
    }
    return 1;
};

bool aabb_frustum(const AABB *aabb, const Frustum *frustum) {
    for (size_t i = 0; i < PLANE_LENGTH; i++) {
        // frustum plane normal points to the inside
        if (aabb_plane(aabb, &frustum->planes[i]) == -1) {
            return 0;
        }
    } // completely outside
    return 1;
}

uint SKYBOX_FLAG = static_cast<uint>(gfx::ClearFlagBit::STENCIL) << 1;

map<String, uint> PassPhase::phases;
uint PassPhase::phaseNum = 0;

} // namespace pipeline
} // namespace cc
