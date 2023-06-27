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
/* eslint-disable max-len */
import { Material } from '../../asset/assets';
import { Camera } from '../../render-scene/scene/camera';
import { GeometryRenderer } from '../geometry-renderer';
import { Buffer, BufferInfo, ClearFlagBit, Color, CommandBuffer, DescriptorSet, DescriptorSetLayout, Device, DrawInfo, Format, InputAssembler, LoadOp, PipelineState, Rect, ResolveMode, Sampler, ShaderStageFlagBit, StoreOp, Swapchain, Texture, TextureInfo, Viewport } from '../../gfx';
import { GlobalDSManager } from '../global-descriptor-set-manager';
import { Mat4, Quat, Vec2, Vec4 } from '../../core/math';
import { MacroRecord } from '../../render-scene/core/pass-utils';
import { PipelineSceneData } from '../pipeline-scene-data';
import { AccessType, CopyPair, LightInfo, MovePair, QueueHint, ResolvePair, ResourceResidency, SceneFlags, TaskType, UpdateFrequency, UploadPair } from './types';
import { RenderWindow } from '../../render-scene/core/render-window';
import { Model } from '../../render-scene/scene';

/**
 * @internal
 * @en PipelineRuntime is the runtime of both classical and custom pipelines.
 * It is used internally and should not be called directly.
 * @zh PipelineRuntime是经典管线以及自定义管线的运行时。
 * 属于内部实现，用户不应直接调用。
 */
export interface PipelineRuntime {
    /**
     * @en Activate PipelineRuntime with default swapchain
     * @zh 用默认交换链初始化PipelineRuntime
     */
    activate (swapchain: Swapchain): boolean;
    /**
     * @en Destroy resources of PipelineRuntime
     * @zh 销毁PipelineRuntime所持资源
     */
    destroy (): boolean;
    /**
     * @en Render contents of cameras
     * @zh 根据相机进行绘制
     */
    render (cameras: Camera[]): void;
    /**
     * @en Get graphics device
     * @zh 获得图形设备
     */
    readonly device: Device;
    /**
     * @en Get user macros
     * @zh 获得用户宏列表
     */
    readonly macros: MacroRecord;
    /**
     * @en Get global descriptor set manager
     * @zh 获得全局(Global)级别描述符集(DescriptorSet)管理器
     */
    readonly globalDSManager: GlobalDSManager;
    /**
     * @en Get global descriptor set layout
     * @zh 获得全局(Global)级别描述符集的布局(DescriptorSet Layout)
     */
    readonly descriptorSetLayout: DescriptorSetLayout;
    /**
     * @en Get global descriptor set
     * @zh 获得全局(Global)级别描述符集(DescriptorSet)
     */
    readonly descriptorSet: DescriptorSet;
    /**
     * @en Get command buffers of render pipeline
     * @zh 获得渲染管线的命令缓冲(CommandBuffer)列表
     */
    readonly commandBuffers: CommandBuffer[];
    /**
     * @en Get scene data of render pipeline.
     * Scene data contains render configurations of the current scene.
     * @zh 获得渲染管线相关的场景数据，此场景数据一般包含渲染所需配置信息
     */
    readonly pipelineSceneData: PipelineSceneData;
    /**
     * @en Get constant macros.
     * Constant macro is platform-dependent and immutable.
     * @zh 获得常量宏列表，常量宏平台相关且无法修改
     */
    readonly constantMacros: string;
    /**
     * @en Get profiler model.
     * This model is used to render profile information in Debug mode.
     * @zh 获得分析工具(Profiler)的渲染实例，用于Debug模式下显示调试与性能检测信息
     */
    profiler: Model | null;
    /**
     * @en Get geometry renderer.
     * Geometry renderer is used to render procedural geometries.
     * @zh 获得几何渲染器(GeometryRenderer)，几何渲染器用于程序化渲染基础几何图形
     */
    readonly geometryRenderer: GeometryRenderer | null;
    /**
     * @en Get shading scale.
     * Shading scale affects shading texels per pixel.
     * @zh 获得渲染倍率(ShadingScale)，每像素(pixel)绘制的纹素(texel)会根据渲染倍率进行调整。
     */
    shadingScale: number;
    /**
     * @en Get macro as string.
     * @zh 根据宏名获得字符串
     * @param name @en Name of macro @zh 宏的名字
     */
    getMacroString (name: string): string;
    /**
     * @en Get macro as integer.
     * @zh 根据宏名获得整型
     * @param name @en Name of macro @zh 宏的名字
     */
    getMacroInt (name: string): number;
    /**
     * @en Get macro as boolean.
     * @zh 根据宏名获得布尔值
     * @param name @en Name of macro @zh 宏的名字
     */
    getMacroBool (name: string): boolean;
    /**
     * @en Assign string value to macro.
     * @zh 给宏赋值字符串
     * @param name @en Name of macro @zh 宏的名字
     */
    setMacroString (name: string, value: string): void;
    /**
     * @en Assign integer value to macro.
     * @zh 给宏赋值整型
     * @param name @en Name of macro @zh 宏的名字
     */
    setMacroInt (name: string, value: number): void;
    /**
     * @en Assign boolean value to macro.
     * @zh 给宏赋值布尔值
     * @param name @en Name of macro @zh 宏的名字
     */
    setMacroBool (name: string, value: boolean): void;
    /**
     * @en Trigger pipeline state change event
     * @zh 触发管线状态更新事件
     */
    onGlobalPipelineStateChanged (): void;
}

/**
 * @en Type of render pipeline.
 * Different types of pipeline have different hardward capabilities and interfaces.
 * @zh 管线类型，不同类型的管线具有不同的硬件能力与接口
 */
export enum PipelineType {
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
}

export function getPipelineTypeName (e: PipelineType): string {
    switch (e) {
    case PipelineType.BASIC:
        return 'BASIC';
    case PipelineType.STANDARD:
        return 'STANDARD';
    default:
        return '';
    }
}

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
export enum SubpassCapabilities {
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
}

/**
 * @en Pipeline capabilities.
 * The following capabilities are partially supported on different hardware and graphics backends.
 * @zh 管线能力。根据硬件与后端，支持的特性会有所不同
 */
export class PipelineCapabilities {
    subpass: SubpassCapabilities = SubpassCapabilities.NONE;
}

/**
 * @en Base class of render graph node.
 * A node of render graph represents a specific type of rendering operation.
 * A render graph consists of these nodes and form a forest(which is a set of trees).
 * @zh RenderGraph中节点的基类，每个RenderGraph节点代表一种渲染操作，并构成一个森林(一组树)
 */
export interface RenderNode {
    /**
     * @en Get debug name of current node.
     * @zh 获得当前节点调试用的名字
     */
    name: string;
    /**
     * @experimental
     */
    setCustomBehavior (name: string): void;
}

/**
 * @en Render node which supports setting uniforms and descriptors.
 * @zh 节点支持设置常量值(uniform/constant)与描述符
 */
export interface Setter extends RenderNode {
    /**
     * @en Set matrix4x4 常量(uniform) which consists of 16 floats (64 bytes).
     * @zh 设置4x4矩阵，常量(uniform)有16个float (64 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setMat4 (name: string, mat: Mat4): void;
    /**
     * @en Set quaternion uniform which consists of 4 floats (16 bytes).
     * @zh 设置四元数向量，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setQuaternion (name: string, quat: Quat): void;
    /**
     * @en Set color uniform which consists of 4 floats (16 bytes).
     * @zh 设置颜色值，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setColor (name: string, color: Color): void;
    /**
     * @en Set vector4 uniform which consists of 4 floats (16 bytes).
     * @zh 设置vector4向量，常量(uniform)有4个float (16 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setVec4 (name: string, vec: Vec4): void;
    /**
     * @en Set vector2 uniform which consists of 2 floats (8 bytes).
     * @zh 设置vector2向量，常量(uniform)有2个float (8 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setVec2 (name: string, vec: Vec2): void;
    /**
     * @en Set float uniform (4 bytes).
     * @zh 设置浮点值 (4 bytes)
     * @param name @en uniform name in shader. @zh 填写着色器中的常量(uniform)名字
     */
    setFloat (name: string, v: number): void;
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
    setArrayBuffer (name: string, arrayBuffer: ArrayBuffer): void;
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
    setBuffer (name: string, buffer: Buffer): void;
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
    setTexture (name: string, texture: Texture): void;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    setReadWriteBuffer (name: string, buffer: Buffer): void;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    setReadWriteTexture (name: string, texture: Texture): void;
    /**
     * @en Set sampler descriptor.
     * Type of the sampler should match the one in shader.
     * @zh 设置采样器描述符。类型需要与着色器中的一致。
     * 不匹配会引起未定义行为。
     * @param name @en descriptor name in shader. @zh 填写着色器中的描述符(descriptor)名字
     */
    setSampler (name: string, sampler: Sampler): void;
}

/**
 * @en Render queue
 * A render queue is an abstraction of graphics commands submission.
 * Only when the graphics commands in a render queue are all submitted,
 * the next render queue will start submitting.
 * @zh 渲染队列。渲染队列是图形命令提交的抽象。
 * 只有一个渲染队列中的渲染命令全部提交完，才会开始提交下一个渲染队列中的命令。
 */
export interface RenderQueueBuilder extends Setter {
    /**
     * @deprecated Method will be removed in 3.9.0
     * @en Render the scene the camera is looking at.
     * @zh 渲染当前相机指向的场景。
     * @param camera @en Required camera @zh 所需相机
     * @param light @en Lighting information of the scene @zh 场景光照信息
     * @param sceneFlags @en Rendering flags of the scene @zh 场景渲染标志位
     */
    addSceneOfCamera (
        camera: Camera,
        light: LightInfo,
        sceneFlags?: SceneFlags): void;
    /**
     * @en Render a full-screen quad.
     * @zh 渲染全屏四边形
     * @param material @en The material used for shading @zh 着色所需材质
     * @param passID @en Material pass ID @zh 材质通道ID
     * @param sceneFlags @en Rendering flags of the quad @zh Quad所需场景渲染标志位
     */
    addFullscreenQuad (
        material: Material,
        passID: number,
        sceneFlags?: SceneFlags): void;
    /**
     * @en Render a full-screen quad from the camera view.
     * @zh 从相机视角渲染全屏四边形
     * @param camera @en The required camera @zh 所需相机
     * @param material @en The material used for shading @zh 着色所需材质
     * @param passID @en Material pass ID @zh 材质通道ID
     * @param sceneFlags @en Rendering flags of the quad @zh Quad所需场景渲染标志位
     */
    addCameraQuad (
        camera: Camera,
        material: Material,
        passID: number,
        sceneFlags?: SceneFlags): void;
    /**
     * @en Clear current render target.
     * @zh 清除当前渲染目标
     * @param name @en The name of the render target @zh 渲染目标的名字
     * @param color @en The clearing color @zh 用来清除与填充的颜色
     */
    clearRenderTarget (name: string, color?: Color): void;
    /**
     * @en Set rendering viewport.
     * @zh 设置渲染视口
     * @param viewport @en The required viewport @zh 所需视口
     */
    setViewport (viewport: Viewport): void;
    /**
     * @experimental
     */
    addCustomCommand (customBehavior: string): void;
}

/**
 * @en Basic render pass.
 * @zh 基础光栅通道
 */
export interface BasicRenderPassBuilder extends Setter {
    /**
     * @en Add render target for rasterization
     * The render target must have registered in pipeline.
     * @zh 添加光栅化渲染目标，渲染目标必须已注册。
     * @param name @en name of the render target @zh 渲染目标的名字
     * @param loadOp @en Type of load operation @zh 读取操作的类型
     * @param storeOp @en Type of store operation @zh 写入操作的类型
     * @param color @en The clear color to use when loadOp is Clear @zh 读取操作为清除时，所用颜色
     */
    addRenderTarget (
        name: string,
        loadOp?: LoadOp,
        storeOp?: StoreOp,
        color?: Color): void;
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
    addDepthStencil (
        name: string,
        loadOp?: LoadOp,
        storeOp?: StoreOp,
        depth?: number,
        stencil?: number,
        clearFlags?: ClearFlagBit): void;
    /**
     * @en Add texture for sampling
     * The texture must have registered in pipeline.
     * @zh 添加采样用的贴图，贴图必须已注册。
     * @param name @en name of the texture @zh 贴图的注册名
     * @param slotName @en name of descriptor in the shader @zh 着色器中描述符的名字
     * @param sampler @en the sampler to use @zh 采样器名字
     * @param plane @en the image plane ID to sample (color|depth|stencil|video) @zh 需要采样的贴图平面(颜色|深度|模板|视频)
     */
    addTexture (
        name: string,
        slotName: string,
        sampler?: Sampler | null,
        plane?: number): void;
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
    addQueue (hint?: QueueHint, phaseName?: string): RenderQueueBuilder;
    /**
     * @en Set rendering viewport.
     * @zh 设置渲染视口
     * @param viewport @en The required viewport @zh 所需视口
     */
    setViewport (viewport: Viewport): void;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    setVersion (name: string, version: number): void;
    /**
     * @en show statistics on screen
     * @zh 在屏幕上渲染统计数据
     */
    showStatistics: boolean;
}

/**
 * @en BasicPipeline
 * @zh 基础渲染管线
 */
export interface BasicPipeline extends PipelineRuntime {
    readonly type: PipelineType;
    readonly capabilities: PipelineCapabilities;
    beginSetup (): void;
    endSetup (): void;
    containsResource (name: string): boolean;
    addRenderWindow (
        name: string,
        format: Format,
        width: number,
        height: number,
        renderWindow: RenderWindow): number;
    updateRenderWindow (name: string, renderWindow: RenderWindow): void;
    addRenderTarget (
        name: string,
        format: Format,
        width: number,
        height: number,
        residency?: ResourceResidency): number;
    addDepthStencil (
        name: string,
        format: Format,
        width: number,
        height: number,
        residency?: ResourceResidency): number;
    updateRenderTarget (
        name: string,
        width: number,
        height: number,
        format?: Format): void;
    updateDepthStencil (
        name: string,
        width: number,
        height: number,
        format?: Format): void;
    beginFrame (): void;
    update (camera: Camera): void;
    endFrame (): void;
    addRenderPass (
        width: number,
        height: number,
        passName?: string): BasicRenderPassBuilder;
    addMultisampleRenderPass (
        width: number,
        height: number,
        count: number,
        quality: number,
        passName?: string): BasicRenderPassBuilder;
    /**
     * @deprecated Method will be removed in 3.9.0
     */
    addResolvePass (resolvePairs: ResolvePair[]): void;
    addCopyPass (copyPairs: CopyPair[]): void;
    getDescriptorSetLayout (shaderName: string, freq: UpdateFrequency): DescriptorSetLayout | null;
}

export interface RenderSubpassBuilder extends Setter {
    addRenderTarget (
        name: string,
        accessType: AccessType,
        slotName?: string,
        loadOp?: LoadOp,
        storeOp?: StoreOp,
        color?: Color): void;
    addDepthStencil (
        name: string,
        accessType: AccessType,
        depthSlotName?: string,
        stencilSlotName?: string,
        loadOp?: LoadOp,
        storeOp?: StoreOp,
        depth?: number,
        stencil?: number,
        clearFlags?: ClearFlagBit): void;
    addTexture (
        name: string,
        slotName: string,
        sampler?: Sampler | null,
        plane?: number): void;
    addStorageBuffer (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addStorageImage (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    setViewport (viewport: Viewport): void;
    addQueue (hint?: QueueHint, phaseName?: string): RenderQueueBuilder;
    showStatistics: boolean;
    /**
     * @experimental
     */
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void;
}

export interface MultisampleRenderSubpassBuilder extends RenderSubpassBuilder {
    resolveRenderTarget (source: string, target: string): void;
    resolveDepthStencil (
        source: string,
        target: string,
        depthMode?: ResolveMode,
        stencilMode?: ResolveMode): void;
}

export interface ComputeQueueBuilder extends Setter {
    addDispatch (
        threadGroupCountX: number,
        threadGroupCountY: number,
        threadGroupCountZ: number,
        material?: Material,
        passID?: number): void;
}

export interface ComputeSubpassBuilder extends Setter {
    addRenderTarget (name: string, slotName: string): void;
    addTexture (
        name: string,
        slotName: string,
        sampler?: Sampler | null,
        plane?: number): void;
    addStorageBuffer (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addStorageImage (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addQueue (phaseName?: string): ComputeQueueBuilder;
    /**
     * @experimental
     */
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void;
}

export interface RenderPassBuilder extends BasicRenderPassBuilder {
    addStorageBuffer (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addStorageImage (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    /**
     * @beta Feature is under development
     */
    addMaterialTexture (resourceName: string, flags?: ShaderStageFlagBit): void;
    /**
     * @beta Feature is under development
     */
    addRenderSubpass (subpassName: string): RenderSubpassBuilder;
    /**
     * @beta Feature is under development
     */
    addMultisampleRenderSubpass (
        count: number,
        quality: number,
        subpassName: string): MultisampleRenderSubpassBuilder;
    /**
     * @experimental
     */
    addComputeSubpass (subpassName?: string): ComputeSubpassBuilder;
    /**
     * @experimental
     */
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void;
}

export interface ComputePassBuilder extends Setter {
    addTexture (
        name: string,
        slotName: string,
        sampler?: Sampler | null,
        plane?: number): void;
    addStorageBuffer (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addStorageImage (
        name: string,
        accessType: AccessType,
        slotName: string): void;
    addMaterialTexture (resourceName: string, flags?: ShaderStageFlagBit): void;
    addQueue (phaseName?: string): ComputeQueueBuilder;
    /**
     * @experimental
     */
    setCustomShaderStages (name: string, stageFlags: ShaderStageFlagBit): void;
}

export interface SceneVisitor {
    readonly pipelineSceneData: PipelineSceneData;
    setViewport (vp: Viewport): void;
    setScissor (rect: Rect): void;
    bindPipelineState (pso: PipelineState): void;
    bindInputAssembler (ia: InputAssembler): void;
    draw (info: DrawInfo): void;

    bindDescriptorSet (set: number, descriptorSet: DescriptorSet, dynamicOffsets?: number[]): void;
    updateBuffer (buffer: Buffer, data: ArrayBuffer, size?: number): void;
}

export interface SceneTask {
    readonly taskType: TaskType;
    start (): void;
    join (): void;
    submit (): void;
}

export interface SceneTransversal {
    transverse (visitor: SceneVisitor): SceneTask;
}

export interface Pipeline extends BasicPipeline {
    addStorageBuffer (
        name: string,
        format: Format,
        size: number,
        residency?: ResourceResidency): number;
    addStorageTexture (
        name: string,
        format: Format,
        width: number,
        height: number,
        residency?: ResourceResidency): number;
    addShadingRateTexture (
        name: string,
        width: number,
        height: number,
        residency?: ResourceResidency): number;
    updateStorageBuffer (
        name: string,
        size: number,
        format?: Format): void;
    updateStorageTexture (
        name: string,
        width: number,
        height: number,
        format?: Format): void;
    updateShadingRateTexture (
        name: string,
        width: number,
        height: number): void;
    addRenderPass (
        width: number,
        height: number,
        passName: string): RenderPassBuilder;
    addComputePass (passName: string): ComputePassBuilder;
    addUploadPass (uploadPairs: UploadPair[]): void;
    addMovePass (movePairs: MovePair[]): void;
    /**
     * @experimental
     */
    addCustomBuffer (
        name: string,
        info: BufferInfo,
        type: string): number;
    /**
     * @experimental
     */
    addCustomTexture (
        name: string,
        info: TextureInfo,
        type: string): number;
}

export interface PipelineBuilder {
    setup (cameras: Camera[], pipeline: BasicPipeline): void;
}

export interface RenderingModule {
    getPassID (name: string): number;
    getSubpassID (passID: number, name: string): number;
    getPhaseID (subpassOrPassID: number, name: string): number;
}
