#pragma once
#include <cstdint>
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/NativeFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"

namespace cc {

namespace scene {
class Camera;
class DirectionalLight;
} // namespace scene

namespace gfx {
class Device;
} // namespace gfx

namespace pipeline {
class PipelineSceneData;
} // namespace pipeline

namespace render {

void setCameraUBOValues(
    const scene::Camera &camera,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &cfg,
    const scene::DirectionalLight *mainLight,
    RenderData &data);

void setLegacyTextureUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    RenderData &data);

// For use shadow map
void setShadowUBOView(
    gfx::Device &device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    const scene::DirectionalLight &mainLight,
    RenderData &data);

// For build shadow map
void setShadowUBOLightView(
    gfx::Device *device,
    const LayoutGraphData &layoutGraph,
    const pipeline::PipelineSceneData &sceneData,
    const scene::Light &light,
    uint32_t level,
    RenderData &data);

// Render graph
void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter);

// Geometry
void setupQuadVertexBuffer(gfx::Device &device, const Vec4 &viewport, float vbData[16]);

} // namespace render

} // namespace cc
