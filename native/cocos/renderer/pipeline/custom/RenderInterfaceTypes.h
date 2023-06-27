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

/**
 * @internal
 * @en PipelineRuntime is the runtime of both classical and custom pipelines.
 * It is used internally and should not be called directly.
 * @zh PipelineRuntime是经典管线以及自定义管线的运行时。
 * 属于内部实现，用户不应直接调用。
 */
class PipelineRuntime {
public:
    PipelineRuntime() noexcept = default;
    PipelineRuntime(PipelineRuntime&& rhs) = delete;
    PipelineRuntime(PipelineRuntime const& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime&& rhs) = delete;
    PipelineRuntime& operator=(PipelineRuntime const& rhs) = delete;
    virtual ~PipelineRuntime() noexcept = default;

    /**
     * @en Activate PipelineRuntime with default swapchain
     * @zh 用默认交换链初始化PipelineRuntime
     */
    virtual bool activate(gfx::Swapchain *swapchain) = 0;
    /**
     * @en Destroy resources of PipelineRuntime
     * @zh 销毁PipelineRuntime所持资源
     */
    virtual bool destroy() noexcept = 0;
    /**
     * @en Render contents of cameras
     * @zh 根据相机进行绘制
     */
    virtual void render(const ccstd::vector<scene::Camera*> &cameras) = 0;
    /**
     * @en Get graphics device
     * @zh 获得图形设备
     */
    virtual gfx::Device *getDevice() const = 0;
    /**
     * @en Get user macros
     * @zh 获得用户宏列表
     */
    virtual const MacroRecord &getMacros() const = 0;
    /**
     * @en Get global descriptor set manager
     * @zh 获得全局(Global)级别描述符集(DescriptorSet)管理器
     */
    virtual pipeline::GlobalDSManager *getGlobalDSManager() const = 0;
    /**
     * @en Get global descriptor set layout
     * @zh 获得全局(Global)级别描述符集的布局(DescriptorSet Layout)
     */
    virtual gfx::DescriptorSetLayout *getDescriptorSetLayout() const = 0;
    /**
     * @en Get global descriptor set
     * @zh 获得全局(Global)级别描述符集(DescriptorSet)
     */
    virtual gfx::DescriptorSet *getDescriptorSet() const = 0;
    /**
     * @en Get command buffers of render pipeline
     * @zh 获得渲染管线的命令缓冲(CommandBuffer)列表
     */
    virtual const ccstd::vector<gfx::CommandBuffer*> &getCommandBuffers() const = 0;
    /**
     * @en Get scene data of render pipeline.
     * Scene data contains render configurations of the current scene.
     * @zh 获得渲染管线相关的场景数据，此场景数据一般包含渲染所需配置信息
     */
    virtual pipeline::PipelineSceneData *getPipelineSceneData() const = 0;
    /**
     * @en Get constant macros.
     * Constant macro is platform-dependent and immutable.
     * @zh 获得常量宏列表，常量宏平台相关且无法修改
     */
    virtual const ccstd::string &getConstantMacros() const = 0;
    /**
     * @en Get profiler model.
     * This model is used to render profile information in Debug mode.
     * @zh 获得分析工具(Profiler)的渲染实例，用于Debug模式下显示调试与性能检测信息
     */
    virtual scene::Model *getProfiler() const = 0;
    virtual void setProfiler(scene::Model *profiler) = 0;
    /**
     * @en Get geometry renderer.
     * Geometry renderer is used to render procedural geometries.
     * @zh 获得几何渲染器(GeometryRenderer)，几何渲染器用于程序化渲染基础几何图形
     */
    virtual pipeline::GeometryRenderer *getGeometryRenderer() const = 0;
    /**
     * @en Get shading scale.
     * Shading scale affects shading texels per pixel.
     * @zh 获得渲染倍率(ShadingScale)，每像素(pixel)绘制的纹素(texel)会根据渲染倍率进行调整。
     */
    virtual float getShadingScale() const = 0;
    virtual void setShadingScale(float scale) = 0;
    /**
     * @en Get macro as string.
     * @zh 根据宏名获得字符串
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual const ccstd::string &getMacroString(const ccstd::string &name) const = 0;
    /**
     * @en Get macro as integer.
     * @zh 根据宏名获得整型
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual int32_t getMacroInt(const ccstd::string &name) const = 0;
    /**
     * @en Get macro as boolean.
     * @zh 根据宏名获得布尔值
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual bool getMacroBool(const ccstd::string &name) const = 0;
    /**
     * @en Assign string value to macro.
     * @zh 给宏赋值字符串
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual void setMacroString(const ccstd::string &name, const ccstd::string &value) = 0;
    /**
     * @en Assign integer value to macro.
     * @zh 给宏赋值整型
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual void setMacroInt(const ccstd::string &name, int32_t value) = 0;
    /**
     * @en Assign boolean value to macro.
     * @zh 给宏赋值布尔值
     * @param name @en Name of macro @zh 宏的名字
     */
    virtual void setMacroBool(const ccstd::string &name, bool value) = 0;
    /**
     * @en Trigger pipeline state change event
     * @zh 触发管线状态更新事件
     */
    virtual void onGlobalPipelineStateChanged() = 0;
    virtual void setValue(const ccstd::string &name, int32_t value) = 0;
    virtual void setValue(const ccstd::string &name, bool value) = 0;
    virtual bool isOcclusionQueryEnabled() const = 0;
    virtual void resetRenderQueue(bool reset) = 0;
    virtual bool isRenderQueueReset() const = 0;
};

/**
 * @en Type of render pipeline.
 * Different types of pipeline have different hardward capabilities and interfaces.
 * @zh 管线类型，不同类型的管线具有不同的硬件能力与接口
 */
enum class PipelineType {
    /**
     * @en Basic render pipeline.
     * Basic render pipeline is available on all platforms.
     * The corresponding interface is {@link BasicPipeline}
     * @zh 基础渲染管线，全平台支持。对应接口为 {@link BasicPipeline}
     */
    BASIC,
    /**
     * @en Standard render pipeline.
     * Standard render pipeline supports compute shader and subpass rendering.
     * It works well on Tile-based GPUs and is available on all native platforms.
     * Vulkan, GLES3 and Metal backends are supported.
     * The corresponding interface is {@link Pipeline}
     * @zh 标准渲染管线.
     * 标准渲染管线支持计算着色器(Compute Shader)与次通道渲染(Subpass rendering)。
     * 能充分利用Tile-based GPU，支持所有原生平台并对移动平台特别优化。
     * 支持Vulkan、GLES3、Metal图形后端。
     * 对应接口为{@link Pipeline}
     */
    STANDARD,
};

/**
 * @en Render subpass capabilities.
 * Tile-based GPUs support reading color or depth_stencil attachment in pixel shader.
 * Our implementation is based-on Vulkan abstraction (aka input attachment),
 * and it is emulated on other graphics backends.
 * For example, in GLES3 we have used various framebuffer fetch (FBF) extensions.
 * As a result, different backends and hardwares support different input attachment features.
 * User should inspect pipeline capabilities when implementing tile-based rendering algorithms.
 * Using unsupported feature is undefined behaviour.
 * @zh 次通道渲染能力
 * Tile-based GPU可以在像素着色器读取当前像素的值。
 * 我们的抽象方式基于Vulkan的input attachment，并在其他图形后端模拟了这个功能。
 * 比如在GLES3上，我们使用了多种framebuffer fetch (FBF) 扩展来实现这个功能。
 * 所以对于不同的硬件以及图形API，支持的能力是略有不同的。
 * 在编写渲染算法时，应该查询当前设备的能力，来选择合适的tile-based算法。
 * 使用硬件不支持的特性，会导致未定义行为。
 */
enum class SubpassCapabilities : uint32_t {
    NONE = 0,
    /**
     * @en Supports read depth/stencil value at current pixel.
     * @zh 支持读取当前像素的depth/stencil值
     */
    INPUT_DEPTH_STENCIL = 1 << 0,
    /**
     * @en Supports read color value 0 at current pixel.
     * @zh 支持读取当前像素第0个颜色值
     */
    INPUT_COLOR = 1 << 1,
    /**
     * @en Supports read color values at current pixel.
     * @zh 支持读取当前像素任意颜色值
     */
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

/**
 * @en Pipeline capabilities.
 * The following capabilities are partially supported on different hardware and graphics backends.
 * @zh 管线能力。根据硬件与后端，支持的特性会有所不同
 */
struct PipelineCapabilities {
    SubpassCapabilities subpass{SubpassCapabilities::NONE};
};

/**
 * @en Base class of render graph node.
 * A node of render graph represents a specific type of rendering operation.
 * A render graph consists of these nodes and form a forest(which is a set of trees).
 * @zh RenderGraph中节点的基类，每个RenderGraph节点代表一种渲染操作，并构成一个森林(一组树)
 */
class RenderNode {
public:
    RenderNode() noexcept = default;
    RenderNode(RenderNode&& rhs) = delete;
    RenderNode(RenderNode const& rhs) = delete;
    RenderNode& operator=(RenderNode&& rhs) = delete;
    RenderNode& operator=(RenderNode const& rhs) = delete;
    virtual ~RenderNode() noexcept = default;

    /**
     * @en Get debug name of current node.
     * @zh 获得当前节点调试用的名字
     */
    virtual ccstd::string getName() const = 0;
    virtual void setName(const ccstd::string &name) = 0;
    /**
     * @experimental
     */
    virtual void setCustomBehavior(const ccstd::string &name) = 0;
};

/**
 * @en Render node which supports setting uniforms and descriptors.
 * @zh 节点支持设置常量值(uniform/constant)与描述符
 */
class Setter : public RenderNode {
public:
    Setter() noexcept = default;

    /**
     * @en Set matrix4x4 常量(uniform) which consists of 16 floats (64 bytes).
     * @zh 设置4x4矩阵，常量(uniform)有16个float (64 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setMat4(const ccstd::string &name, const Mat4 &mat) = 0;
    /**
     * @en Set quaternion uniform which consists of 4 floats (16 bytes).
     * @zh 设置四元数向量，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setQuaternion(const ccstd::string &name, const Quaternion &quat) = 0;
    /**
     * @en Set color uniform which consists of 4 floats (16 bytes).
     * @zh 设置颜色值，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setColor(const ccstd::string &name, const gfx::Color &color) = 0;
    /**
     * @en Set vector4 uniform which consists of 4 floats (16 bytes).
     * @zh 设置vector4向量，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setVec4(const ccstd::string &name, const Vec4 &vec) = 0;
    /**
     * @en Set vector2 uniform which consists of 2 floats (8 bytes).
     * @zh 设置vector2向量，常量(uniform)有2个float (8 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setVec2(const ccstd::string &name, const Vec2 &vec) = 0;
    /**
     * @en Set float uniform (4 bytes).
     * @zh 设置浮点值 (4 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    virtual void setFloat(const ccstd::string &name, float v) = 0;
    /**
     * @en Set uniform array.
     * Size and type of the data should match the corresponding uniforms in the shader.
     * Mismatches will cause undefined behaviour.
     * Memory alignment is not required.
     * @zh 设置数组。类型与大小需要与着色器中的常量(uniform)相匹配，不匹配会引起未定义行为。
     * 内存地址不需要对齐。
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     * @param arrayBuffer @en array of bytes @zh byte数组
     */
    virtual void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) = 0;
    /**
     * @en Set buffer descriptor.
     * Size and type of the buffer should match the one in shader.
     * Buffer should be in read states and satisfy shader stage visibilities.
     * Mismatches will cause undefined behaviour.
     * @zh 设置缓冲(buffer)描述符。大小与类型需要与着色器中的一致，处于只读状态且着色阶段可见。
     * 不匹配会引起未定义行为。
     * @param name @en descriptor name in shader. @zh 填写着色器中的描述符(descriptor)名字
     * @param buffer @en readonly buffer @zh 只读的缓冲
     */
    virtual void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    /**
     * @en Set texture descriptor.
     * Type of the texture should match the one in shader.
     * Texture should be in read states and satisfy shader stage visibilities.
     * Mismatches will cause undefined behaviour.
     * @zh 设置贴图描述符。类型需要与着色器中的一致，处于只读状态且着色阶段可见。
     * 不匹配会引起未定义行为。
     * @param name @en descriptor name in shader. @zh 填写着色器中的描述符(descriptor)名字
     * @param texture @en readonly texture @zh 只读的贴图
     */
    virtual void setTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    virtual void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) = 0;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    virtual void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) = 0;
    /**
     * @en Set sampler descriptor.
     * Type of the sampler should match the one in shader.
     * @zh 设置采样器描述符。类型需要与着色器中的一致。
     * 不匹配会引起未定义行为。
     * @param name @en descriptor name in shader. @zh 填写着色器中的描述符(descriptor)名字
     */
    virtual void setSampler(const ccstd::string &name, gfx::Sampler *sampler) = 0;
};

/**
 * @en Render queue
 * A render queue is an abstraction of graphics commands submission.
 * Only when the graphics commands in a render queue are all submitted,
 * the next render queue will start submitting.
 * @zh 渲染队列。渲染队列是图形命令提交的抽象。
 * 只有一个渲染队列中的渲染命令全部提交完，才会开始提交下一个渲染队列中的命令。
 */
class RenderQueueBuilder : public Setter {
public:
    RenderQueueBuilder() noexcept = default;

    /**
     * @deprecated Method will be removed in 3.9.0
     * @en Render the scene the camera is looking at.
     * @zh 渲染当前相机指向的场景。
     * @param camera @en Required camera @zh 所需相机
     * @param light @en Lighting information of the scene @zh 场景光照信息
     * @param sceneFlags @en Rendering flags of the scene @zh 场景渲染标志位
     */
    virtual void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) = 0;
    /**
     * @en Render a full-screen quad.
     * @zh 渲染全屏四边形
     * @param material @en The material used for shading @zh 着色所需材质
     * @param passID @en Material pass ID @zh 材质通道ID
     * @param sceneFlags @en Rendering flags of the quad @zh Quad所需场景渲染标志位
     */
    virtual void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    /**
     * @en Render a full-screen quad from the camera view.
     * @zh 从相机视角渲染全屏四边形
     * @param camera @en The required camera @zh 所需相机
     * @param material @en The material used for shading @zh 着色所需材质
     * @param passID @en Material pass ID @zh 材质通道ID
     * @param sceneFlags @en Rendering flags of the quad @zh Quad所需场景渲染标志位
     */
    virtual void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) = 0;
    /**
     * @en Clear current render target.
     * @zh 清除当前渲染目标
     * @param name @en The name of the render target @zh 渲染目标的名字
     * @param color @en The clearing color @zh 用来清除与填充的颜色
     */
    virtual void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) = 0;
    /**
     * @en Set rendering viewport.
     * @zh 设置渲染视口
     * @param viewport @en The required viewport @zh 所需视口
     */
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    /**
     * @experimental
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

/**
 * @en Basic render pass.
 * @zh 基础光栅通道
 */
class BasicRenderPassBuilder : public Setter {
public:
    BasicRenderPassBuilder() noexcept = default;

    /**
     * @en Add render target for rasterization
     * The render target must have registered in pipeline.
     * @zh 添加光栅化渲染目标，渲染目标必须已注册。
     * @param name @en name of the render target @zh 渲染目标的名字
     * @param loadOp @en Type of load operation @zh 读取操作的类型
     * @param storeOp @en Type of store operation @zh 写入操作的类型
     * @param color @en The clear color to use when loadOp is Clear @zh 读取操作为清除时，所用颜色
     */
    virtual void addRenderTarget(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) = 0;
    /**
     * @en Add depth stencil for rasterization
     * The depth stencil must have registered in pipeline.
     * @zh 添加光栅化深度模板缓冲，深度模板缓冲必须已注册。
     * @param name @en name of the depth stencil @zh 渲染目标的名字
     * @param loadOp @en Type of load operation @zh 读取操作的类型
     * @param storeOp @en Type of store operation @zh 写入操作的类型
     * @param depth @en Depth value used to clear @zh 用于清除的深度值
     * @param stencil @en Stencil value used to clear @zh 用于清除的模板值
     * @param clearFlags @en To clear depth, stencil or both @zh 清除分量：深度、模板、两者。
     */
    virtual void addDepthStencil(const ccstd::string &name, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) = 0;
    /**
     * @en Add texture for sampling
     * The texture must have registered in pipeline.
     * @zh 添加采样用的贴图，贴图必须已注册。
     * @param name @en name of the texture @zh 贴图的注册名
     * @param slotName @en name of descriptor in the shader @zh 着色器中描述符的名字
     * @param sampler @en the sampler to use @zh 采样器名字
     * @param plane @en the image plane ID to sample (color|depth|stencil|video) @zh 需要采样的贴图平面(颜色|深度|模板|视频)
     */
    virtual void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler, uint32_t plane) = 0;
    /**
     * @en Add render queue.
     * Every render queue has a hint type, such as NONE, OPAQUE, MASK or BLEND.
     * User should only add objects of this hint type to the render queue.
     * Objects of mixed types might cause downgrading of performance.
     * The order of render queues should be adjusted according to the hardward and algorithms,
     * in order to reach peak performance.
     * For example, [1.opaque, 2.mask, 3.blend] might result in best performance on mobile platforms.
     * This hint is for validation only and has no effect on rendering.
     *
     * Every render queue has a phase name. Only objects of the same phase name will be rendered.
     *
     * @zh 添加渲染队列
     * 每个渲染队列有一个用途提示，例如无提示(NONE)、不透明(OPAQUE)、遮罩(MASK)和混合(BLEND)。
     * 每个队列最好只渲染相匹配的对象，混合不同类型的对象，会造成性能下降。
     * 不同类型队列的渲染顺序，需要根据硬件类型与渲染算法进行调整，以到达最高性能。
     * 比如在移动平台上，先渲染OPAQUE，再渲染MASK、最后渲染BLEND可能会有最好的性能。
     * 用途提示只用于问题检测，对渲染流程没有任何影响。
     *
     * 每个队列有一个相位(phase)名字，具有相同相位名字的物件才会被渲染。
     *
     * @param hint @en Usage hint of the queue @zh 用途的提示
     * @param phaseName @en The name of the phase declared in effect. Default value is 'default' @zh effect中相位(phase)的名字，不填为'default'。
     */
    virtual RenderQueueBuilder *addQueue(QueueHint hint, const ccstd::string &phaseName) = 0;
    /**
     * @en Set rendering viewport.
     * @zh 设置渲染视口
     * @param viewport @en The required viewport @zh 所需视口
     */
    virtual void setViewport(const gfx::Viewport &viewport) = 0;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    virtual void setVersion(const ccstd::string &name, uint64_t version) = 0;
    /**
     * @en show statistics on screen
     * @zh 在屏幕上渲染统计数据
     */
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

/**
 * @en BasicPipeline
 * @zh 基础渲染管线
 */
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
    /**
     * @deprecated Method will be removed in 3.9.0
     */
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
     * @experimental
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
     * @experimental
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
     * @beta Feature is under development
     */
    virtual void addMaterialTexture(const ccstd::string &resourceName, gfx::ShaderStageFlagBit flags) = 0;
    /**
     * @beta Feature is under development
     */
    virtual RenderSubpassBuilder *addRenderSubpass(const ccstd::string &subpassName) = 0;
    /**
     * @beta Feature is under development
     */
    virtual MultisampleRenderSubpassBuilder *addMultisampleRenderSubpass(uint32_t count, uint32_t quality, const ccstd::string &subpassName) = 0;
    /**
     * @experimental
     */
    virtual ComputeSubpassBuilder *addComputeSubpass(const ccstd::string &subpassName) = 0;
    /**
     * @experimental
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
     * @experimental
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
     * @experimental
     */
    virtual uint32_t addCustomBuffer(const ccstd::string &name, const gfx::BufferInfo &info, const std::string &type) = 0;
    /**
     * @experimental
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
