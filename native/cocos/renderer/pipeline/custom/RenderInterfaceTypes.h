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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/core/ArrayBuffer.h"
#include "cocos/core/assets/EffectAsset.h"
#include "cocos/renderer/core/PassUtils.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/custom/CustomTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"

namespace cc {

class Mat4;
class Mat4;
class Quaternion;
class Vec4;
class Vec3;
class Vec2;

namespace pipeline {

class GlobalDSManager;
class PipelineSceneData;
class GeometryRenderer;

} // namespace pipeline

namespace scene {

class DirectionalLight;
class SpotLight;
class Model;
class RenderScene;
class RenderWindow;

} // namespace scene

namespace render {

constexpr bool ENABLE_SUBPASS = true;
constexpr bool ENABLE_GPU_DRIVEN = false;

} // namespace render

} // namespace cc

namespace cc {

namespace render {

class PipelineRuntime {
public:
    PipelineRuntime() noexcept = default;
    PipelineRuntime(PipelineRuntime&& rhs) = delete;
    PipelineRuntime(PipelineRuntime const& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime&& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime const& rhs) = delete;
    virtual ~PipelineRuntime() noexcept = default;

    virtual bool activate(gfx::Swapchain *swapchain) = 0;
    virtual bool destroy() noexcept = 0;
    virtual void render(const ccstd::vector<scene::Camera*> &cameras) = 0;
    virtual gfx::Device *getDevice() const = 0;
    virtual const MacroRecord &getMacros() const = 0;
    virtual pipeline::GlobalDSManager *getGlobalDSManager() const = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout() const = 0;
    virtual gfx::DescriptorSet *getDescriptorSet() const = 0;
    virtual const ccstd::vector<gfx::CommandBuffer*> &getCommandBuffers() const = 0;
    virtual pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual const ccstd::string &getConstantMacros() const = 0;
    virtual scene::Model *getProfiler() const = 0;
    virtual void setProfiler(scene::Model *profiler) = 0;
    virtual pipeline::GeometryRenderer *getGeometryRenderer() const = 0;
    virtual float getShadingScale() const = 0;
    virtual void setShadingScale(float scale) = 0;
    virtual const ccstd::string &getMacroString(const ccstd::string &name) const = 0;
    virtual int32_t getMacroInt(const ccstd::string &name) const = 0;
    virtual bool getMacroBool(const ccstd::string &name) const = 0;
    virtual void setMacroString(const ccstd::string &name, const ccstd::string &value) = 0;
    virtual void setMacroInt(const ccstd::string &name, int32_t value) = 0;
    virtual void setMacroBool(const ccstd::string &name, bool value) = 0;
    virtual void onGlobalPipelineStateChanged() = 0;
    virtual void setValue(const ccstd::string &name, int32_t value) = 0;
    virtual void setValue(const ccstd::string &name, bool value) = 0;
    virtual bool isOcclusionQueryEnabled() const = 0;
    virtual void resetRenderQueue(bool reset) = 0;
    virtual bool isRenderQueueReset() const = 0;
};

enum class PipelineType {
    BASIC,
    STANDARD,
};

enum class SubpassCapabilities : uint32_t {
    NONE = 0,
    INPUT_DEPTH_STENCIL = 1 << 0,
    INPUT_COLOR = 1 << 1,
    INPUT_COLOR_MRT = 1 << 2,
};

constexpr SubpassCapabilities operator|(const SubpassCapabilities lhs, const SubpassCapabilities rhs) noexcept {
    return static_cast<SubpassCapabilities>(static_cast<uint32_t>(lhs) | static_cast<uint32_t>(rhs));
}

constexpr SubpassCapabilities operator&(const SubpassCapabilities lhs, const SubpassCapabilities rhs) noexcept {
    return static_cast<SubpassCapabilities>(static_cast<uint32_t>(lhs) & static_cast<uint32_t>(rhs));
}

constexpr SubpassCapabilities& operator|=(SubpassCapabilities& lhs, const SubpassCapabilities rhs) noexcept {
    return lhs = lhs | rhs;
}

constexpr SubpassCapabilities& operator&=(SubpassCapabilities& lhs, const SubpassCapabilities rhs) noexcept {
    return lhs = lhs & rhs;
}

constexpr bool operator!(SubpassCapabilities e) noexcept {
    return e == static_cast<SubpassCapabilities>(0);
}

constexpr bool any(SubpassCapabilities e) noexcept {
    return !!e;
}

struct PipelineCapabilities {
    SubpassCapabilities subpass{SubpassCapabilities::NONE};
};

class RenderNode {
public:
    RenderNode() noexcept = default;
    RenderNode(RenderNode&& rhs) = delete;
    RenderNode(RenderNode const& rhs) = delete;
    RenderNode& operator=(RenderNode&& rhs) = delete;
    RenderNode& operator=(RenderNode const& rhs) = delete;
    virtual ~RenderNode() noexcept = default;

    virtual ccstd::string getName() const = 0;
    virtual void setName(const ccstd::string &name) = 0;
    /**
     * @beta function signature might change
     */
    virtual void setCustomBehavior(const ccstd::string &name) = 0;
};

class Setter : public RenderNode {
public:
    Setter() noexcept = default;

    virtual void setMat4(const ccstd::string &name, const Mat4 &mat) = 0;
    virtual void setQuaternion(const ccstd::string &name, const Quaternion &quat) = 0;
    virtual void setColor(const ccstd::string &name, const gfx::Color &color) = 0;
    virtual void setVec4(const ccstd::string &name, const Vec4 &vec) = 0;
    virtual void setVec2(const ccstd::string &name, const Vec2 &vec) = 0;
    virtual void setFloat(const ccstd::string &name, float v) = 0;
    virtual void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) = 0;
    virtual void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    virtual void setTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    virtual void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    virtual void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    virtual void setSampler(const ccstd::string &name, gfx::Sampler *sampler) = 0;
};

class RenderQueueBuilder : public Setter {
public:
    RenderQueueBuilder() noexcept = default;

    /**
     * @deprecated method will be removed in 3.9.0
     */
    virtual void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) = 0;
    virtual void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    virtual void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    virtual void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    /**
     * @beta function signature might change
     */
    virtual void addCustomCommand(std::string_view customBehavior) = 0;
    void addSceneOfCamera(scene::Camera *camera, LightInfo light) {
        addSceneOfCamera(camera, std::move(light), SceneFlags::NONE);
    }
    void addFullscreenQuad(Material *material, uint32_t passID) {
        addFullscreenQuad(material, passID, SceneFlags::NONE);
    }
    void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID) {
        addCameraQuad(camera, material, passID, SceneFlags::NONE);
    }
    void clearRenderTarget(const ccstd::string &name) {
        clearRenderTarget(name, {});
    }
};

class BasicRenderPassBuilder : public Setter {
public:
    BasicRenderPassBuilder() noexcept = default;

    virtual void addRenderTarget(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) = 0;
    virtual void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) = 0;
    virtual void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler, uint32_t plane) = 0;
    virtual RenderQueueBuilder *addQueue(QueueHint hint, const ccstd::string &phaseName) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    virtual void setVersion(const ccstd::string &name, uint64_t version) = 0;
    virtual bool getShowStatistics() const = 0;
    virtual void setShowStatistics(bool enable) = 0;
    void addRenderTarget(const ccstd::string &name) {
        addRenderTarget(name, gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, {});
    }
    void addRenderTarget(const ccstd::string &name, gfx::LoadOp loadOp) {
        addRenderTarget(name, loadOp, gfx::StoreOp::STORE, {});
    }
    void addRenderTarget(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp) {
        addRenderTarget(name, loadOp, storeOp, {});
    }
    void addDepthStencil(const ccstd::string &name) {
        addDepthStencil(name, gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp) {
        addDepthStencil(name, loadOp, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp) {
        addDepthStencil(name, loadOp, storeOp, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth) {
        addDepthStencil(name, loadOp, storeOp, depth, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil) {
        addDepthStencil(name, loadOp, storeOp, depth, stencil, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName) {
        addTexture(name, slotName, nullptr, 0);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) {
        addTexture(name, slotName, sampler, 0);
    }
    RenderQueueBuilder *addQueue() {
        return addQueue(QueueHint::NONE, "default");
    }
    RenderQueueBuilder *addQueue(QueueHint hint) {
        return addQueue(hint, "default");
    }
};

class BasicPipeline : public PipelineRuntime {
public:
    BasicPipeline() noexcept = default;

    virtual PipelineType getType() const = 0;
    virtual PipelineCapabilities getCapabilities() const = 0;
    virtual void beginSetup() = 0;
    virtual void endSetup() = 0;
    virtual bool containsResource(const ccstd::string &name) const = 0;
    virtual uint32_t addRenderWindow(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) = 0;
    virtual void updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) = 0;
    virtual uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) = 0;
    virtual void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) = 0;
    virtual void beginFrame() = 0;
    virtual void update(const scene::Camera *camera) = 0;
    virtual void endFrame() = 0;
    virtual BasicRenderPassBuilder *addRenderPass(uint32_t width, uint32_t height, const ccstd::string &passName) = 0;
    virtual BasicRenderPassBuilder *addMultisampleRenderPass(uint32_t width, uint32_t height, uint32_t count, uint32_t quality, const ccstd::string &passName) = 0;
    virtual void addResolvePass(const ccstd::vector<ResolvePair> &resolvePairs) = 0;
    virtual void addCopyPass(const ccstd::vector<CopyPair> &copyPairs) = 0;
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) = 0;
    uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height) {
        return addRenderTarget(name, format, width, height, ResourceResidency::MANAGED);
    }
    uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height) {
        return addDepthStencil(name, format, width, height, ResourceResidency::MANAGED);
    }
    void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height) {
        updateRenderTarget(name, width, height, gfx::Format::UNKNOWN);
    }
    void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height) {
        updateDepthStencil(name, width, height, gfx::Format::UNKNOWN);
    }
    BasicRenderPassBuilder *addRenderPass(uint32_t width, uint32_t height) {
        return addRenderPass(width, height, "default");
    }
    BasicRenderPassBuilder *addMultisampleRenderPass(uint32_t width, uint32_t height, uint32_t count, uint32_t quality) {
        return addMultisampleRenderPass(width, height, count, quality, "default");
    }
};

class RenderSubpassBuilder : public Setter {
public:
    RenderSubpassBuilder() noexcept = default;

    virtual void addRenderTarget(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) = 0;
    virtual void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) = 0;
    virtual void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler, uint32_t plane) = 0;
    virtual void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    virtual RenderQueueBuilder *addQueue(QueueHint hint, const ccstd::string &phaseName) = 0;
    virtual bool getShowStatistics() const = 0;
    virtual void setShowStatistics(bool enable) = 0;
    /**
     * @beta function signature might change
     */
    virtual void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) = 0;
    void addRenderTarget(const ccstd::string &name, AccessType accessType) {
        addRenderTarget(name, accessType, "", gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, {});
    }
    void addRenderTarget(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) {
        addRenderTarget(name, accessType, slotName, gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, {});
    }
    void addRenderTarget(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, gfx::LoadOp loadOp) {
        addRenderTarget(name, accessType, slotName, loadOp, gfx::StoreOp::STORE, {});
    }
    void addRenderTarget(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp) {
        addRenderTarget(name, accessType, slotName, loadOp, storeOp, {});
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType) {
        addDepthStencil(name, accessType, "", "", gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName) {
        addDepthStencil(name, accessType, depthSlotName, "", gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName) {
        addDepthStencil(name, accessType, depthSlotName, stencilSlotName, gfx::LoadOp::CLEAR, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName, gfx::LoadOp loadOp) {
        addDepthStencil(name, accessType, depthSlotName, stencilSlotName, loadOp, gfx::StoreOp::STORE, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp) {
        addDepthStencil(name, accessType, depthSlotName, stencilSlotName, loadOp, storeOp, 1, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth) {
        addDepthStencil(name, accessType, depthSlotName, stencilSlotName, loadOp, storeOp, depth, 0, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &depthSlotName, const ccstd::string &stencilSlotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil) {
        addDepthStencil(name, accessType, depthSlotName, stencilSlotName, loadOp, storeOp, depth, stencil, gfx::ClearFlagBit::DEPTH_STENCIL);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName) {
        addTexture(name, slotName, nullptr, 0);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) {
        addTexture(name, slotName, sampler, 0);
    }
    RenderQueueBuilder *addQueue() {
        return addQueue(QueueHint::NONE, "default");
    }
    RenderQueueBuilder *addQueue(QueueHint hint) {
        return addQueue(hint, "default");
    }
};

class MultisampleRenderSubpassBuilder : public RenderSubpassBuilder {
public:
    MultisampleRenderSubpassBuilder() noexcept = default;

    virtual void resolveRenderTarget(const ccstd::string &source, const ccstd::string &target) = 0;
    virtual void resolveDepthStencil(const ccstd::string &source, const ccstd::string &target, gfx::ResolveMode depthMode, gfx::ResolveMode stencilMode) = 0;
    void resolveDepthStencil(const ccstd::string &source, const ccstd::string &target) {
        resolveDepthStencil(source, target, gfx::ResolveMode::SAMPLE_ZERO, gfx::ResolveMode::SAMPLE_ZERO);
    }
    void resolveDepthStencil(const ccstd::string &source, const ccstd::string &target, gfx::ResolveMode depthMode) {
        resolveDepthStencil(source, target, depthMode, gfx::ResolveMode::SAMPLE_ZERO);
    }
};

class ComputeQueueBuilder : public Setter {
public:
    ComputeQueueBuilder() noexcept = default;

    virtual void addDispatch(uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, Material *material, uint32_t passID) = 0;
    void addDispatch(uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) {
        addDispatch(threadGroupCountX, threadGroupCountY, threadGroupCountZ, nullptr, 0);
    }
    void addDispatch(uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, Material *material) {
        addDispatch(threadGroupCountX, threadGroupCountY, threadGroupCountZ, material, 0);
    }
};

class ComputeSubpassBuilder : public Setter {
public:
    ComputeSubpassBuilder() noexcept = default;

    virtual void addRenderTarget(const ccstd::string &name, const ccstd::string &slotName) = 0;
    virtual void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler, uint32_t plane) = 0;
    virtual void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual ComputeQueueBuilder *addQueue(const ccstd::string &phaseName) = 0;
    /**
     * @beta function signature might change
     */
    virtual void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) = 0;
    void addTexture(const ccstd::string &name, const ccstd::string &slotName) {
        addTexture(name, slotName, nullptr, 0);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) {
        addTexture(name, slotName, sampler, 0);
    }
    ComputeQueueBuilder *addQueue() {
        return addQueue("default");
    }
};

class RenderPassBuilder : public BasicRenderPassBuilder {
public:
    RenderPassBuilder() noexcept = default;

    virtual void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    /**
     * @beta function signature might change
     */
    virtual void addMaterialTexture(const ccstd::string &resourceName, gfx::ShaderStageFlagBit flags) = 0;
    virtual RenderSubpassBuilder *addRenderSubpass(const ccstd::string &subpassName) = 0;
    virtual MultisampleRenderSubpassBuilder *addMultisampleRenderSubpass(uint32_t count, uint32_t quality, const ccstd::string &subpassName) = 0;
    virtual ComputeSubpassBuilder *addComputeSubpass(const ccstd::string &subpassName) = 0;
    /**
     * @beta function signature might change
     */
    virtual void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) = 0;
    void addMaterialTexture(const ccstd::string &resourceName) {
        addMaterialTexture(resourceName, gfx::ShaderStageFlagBit::VERTEX | gfx::ShaderStageFlagBit::FRAGMENT);
    }
    ComputeSubpassBuilder *addComputeSubpass() {
        return addComputeSubpass("");
    }
};

class ComputePassBuilder : public Setter {
public:
    ComputePassBuilder() noexcept = default;

    virtual void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler, uint32_t plane) = 0;
    virtual void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName) = 0;
    virtual void addMaterialTexture(const ccstd::string &resourceName, gfx::ShaderStageFlagBit flags) = 0;
    virtual ComputeQueueBuilder *addQueue(const ccstd::string &phaseName) = 0;
    /**
     * @beta function signature might change
     */
    virtual void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) = 0;
    void addTexture(const ccstd::string &name, const ccstd::string &slotName) {
        addTexture(name, slotName, nullptr, 0);
    }
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) {
        addTexture(name, slotName, sampler, 0);
    }
    void addMaterialTexture(const ccstd::string &resourceName) {
        addMaterialTexture(resourceName, gfx::ShaderStageFlagBit::COMPUTE);
    }
    ComputeQueueBuilder *addQueue() {
        return addQueue("default");
    }
};

class SceneVisitor {
public:
    SceneVisitor() noexcept = default;
    SceneVisitor(SceneVisitor&& rhs) = delete;
    SceneVisitor(SceneVisitor const& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor&& rhs) = delete;
    SceneVisitor& operator=(SceneVisitor const& rhs) = delete;
    virtual ~SceneVisitor() noexcept = default;

    virtual const pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    virtual void setViewport(const gfx::Viewport &vp) = 0;
    virtual void setScissor(const gfx::Rect &rect) = 0;
    virtual void bindPipelineState(gfx::PipelineState *pso) = 0;
    virtual void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) = 0;
    virtual void bindInputAssembler(gfx::InputAssembler *ia) = 0;
    virtual void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) = 0;
    virtual void draw(const gfx::DrawInfo &info) = 0;
};

class SceneTask {
public:
    SceneTask() noexcept = default;
    SceneTask(SceneTask&& rhs) = delete;
    SceneTask(SceneTask const& rhs) = delete;
    SceneTask& operator=(SceneTask&& rhs) = delete;
    SceneTask& operator=(SceneTask const& rhs) = delete;
    virtual ~SceneTask() noexcept = default;

    virtual TaskType getTaskType() const noexcept = 0;
    virtual void start() = 0;
    virtual void join() = 0;
    virtual void submit() = 0;
};

class SceneTransversal {
public:
    SceneTransversal() noexcept = default;
    SceneTransversal(SceneTransversal&& rhs) = delete;
    SceneTransversal(SceneTransversal const& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal&& rhs) = delete;
    SceneTransversal& operator=(SceneTransversal const& rhs) = delete;
    virtual ~SceneTransversal() noexcept = default;

    virtual SceneTask *transverse(SceneVisitor *visitor) const = 0;
};

class Pipeline : public BasicPipeline {
public:
    Pipeline() noexcept = default;

    virtual uint32_t addStorageBuffer(const ccstd::string &name, gfx::Format format, uint32_t size, ResourceResidency residency) = 0;
    virtual uint32_t addStorageTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual uint32_t addShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height, ResourceResidency residency) = 0;
    virtual void updateStorageBuffer(const ccstd::string &name, uint32_t size, gfx::Format format) = 0;
    virtual void updateStorageTexture(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) = 0;
    virtual void updateShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height) = 0;
    RenderPassBuilder *addRenderPass(uint32_t width, uint32_t height, const ccstd::string &passName) override = 0 /* covariant */;
    virtual ComputePassBuilder *addComputePass(const ccstd::string &passName) = 0;
    virtual void addUploadPass(ccstd::vector<UploadPair> &uploadPairs) = 0;
    virtual void addMovePass(const ccstd::vector<MovePair> &movePairs) = 0;
    /**
     * @beta function signature might change
     */
    virtual uint32_t addCustomBuffer(const ccstd::string &name, const gfx::BufferInfo &info, const std::string &type) = 0;
    /**
     * @beta function signature might change
     */
    virtual uint32_t addCustomTexture(const ccstd::string &name, const gfx::TextureInfo &info, const std::string &type) = 0;
    uint32_t addStorageBuffer(const ccstd::string &name, gfx::Format format, uint32_t size) {
        return addStorageBuffer(name, format, size, ResourceResidency::MANAGED);
    }
    uint32_t addStorageTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height) {
        return addStorageTexture(name, format, width, height, ResourceResidency::MANAGED);
    }
    uint32_t addShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height) {
        return addShadingRateTexture(name, width, height, ResourceResidency::MANAGED);
    }
    void updateStorageBuffer(const ccstd::string &name, uint32_t size) {
        updateStorageBuffer(name, size, gfx::Format::UNKNOWN);
    }
    void updateStorageTexture(const ccstd::string &name, uint32_t width, uint32_t height) {
        updateStorageTexture(name, width, height, gfx::Format::UNKNOWN);
    }
};

class PipelineBuilder {
public:
    PipelineBuilder() noexcept = default;
    PipelineBuilder(PipelineBuilder&& rhs) = delete;
    PipelineBuilder(PipelineBuilder const& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder&& rhs) = delete;
    PipelineBuilder& operator=(PipelineBuilder const& rhs) = delete;
    virtual ~PipelineBuilder() noexcept = default;

    virtual void setup(const ccstd::vector<scene::Camera*> &cameras, BasicPipeline *pipeline) = 0;
};

class RenderingModule {
public:
    RenderingModule() noexcept = default;
    RenderingModule(RenderingModule&& rhs) = delete;
    RenderingModule(RenderingModule const& rhs) = delete;
    RenderingModule& operator=(RenderingModule&& rhs) = delete;
    RenderingModule& operator=(RenderingModule const& rhs) = delete;
    virtual ~RenderingModule() noexcept = default;

    virtual uint32_t getPassID(const ccstd::string &name) const = 0;
    virtual uint32_t getSubpassID(uint32_t passID, const ccstd::string &name) const = 0;
    virtual uint32_t getPhaseID(uint32_t subpassOrPassID, const ccstd::string &name) const = 0;
};

class Factory {
public:
    static RenderingModule* init(gfx::Device* deviceIn, const ccstd::vector<unsigned char>& bufferIn);
    static void destroy(RenderingModule* renderingModule) noexcept;
    static Pipeline *createPipeline();
};

} // namespace render

} // namespace cc

// clang-format on
