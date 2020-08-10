#include "Define.h"
namespace cc {
namespace pipeline {
gfx::UniformBlock UBOLocalBatched::BLOCK = {
    gfx::ShaderType::VERTEX,
    static_cast<uint>(UniformBinding::UBO_LOCAL),
    "CCLocalBatched",
    {{"cc_matWorlds", gfx::Type::MAT4, (uint)UBOLocalBatched::BATCHING_COUNT}}};

gfx::UniformBlock UBOGlobal::BLOCK = {
    gfx::ShaderType::ALL,
    static_cast<uint>(UniformBinding::UBO_GLOBAL),
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
        {"cc_shadowLightMatrix", gfx::Type::MAT4, 1},
        {"cc_ambientSky", gfx::Type::FLOAT4, 1},
        {"cc_ambientGround", gfx::Type::FLOAT4, 1},
        {"cc_fogColor", gfx::Type::FLOAT4, 1},
        {"cc_fogBase", gfx::Type::FLOAT4, 1},
        {"cc_fogAdd", gfx::Type::FLOAT4, 1},
    }};

} // namespace pipeline
} // namespace cc
