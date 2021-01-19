/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { IRenderPass, localDescriptorSetLayout, UBODeferredLight, SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { Color, Rect, Shader } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { DeferredStagePriority } from './enum';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { LightingFlow } from './lighting-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';
import { PlanarShadowQueue } from './planar-shadow-queue';
import { Material } from '../../assets/material';
import { ShaderPool } from '../../renderer/core/memory-pools';
import { PipelineStateManager } from '../pipeline-state-manager';
import { PipelineState } from '../../gfx/pipeline-state';
import { sphere, intersect } from '../../geometry';
import { Vec3, Vec4 } from '../../math';
import { Buffer, BufferUsageBit, MemoryUsageBit, BufferInfo, BufferViewInfo, DescriptorSet, DescriptorSetLayoutInfo,
    DescriptorSetLayout, DescriptorSetInfo } from '../../gfx';
import { UBOForwardLight } from '../define';
import { ClearFlag } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';
import { Pass } from '../../renderer/core/pass';
import { Camera } from 'cocos/core/renderer/scene';
import { builtinResMgr } from 'cocos/core';

const colors: Color[] = [ new Color(0, 0, 0, 1) ];
const LIGHTINGPASS_INDEX = 1;

/**
 * @en The lighting render stage
 * @zh 前向渲染阶段。
 */
@ccclass('LightingStage')
export class LightingStage extends RenderStage {

    private _deferredLitsBufs: Buffer = null!;
    private _maxDeferredLights = UBODeferredLight.LIGHTS_PER_PASS;
    private _lightBufferData!: Float32Array;
    private _lightMeterScale: number = 10000.0;
    private _descriptorSet: DescriptorSet = null!;
    private _descriptorSetLayout!: DescriptorSetLayout;

    private _renderArea = new Rect();
    private declare _additiveLightQueue: RenderAdditiveLightQueue;
    private declare _planarQueue: PlanarShadowQueue;
    private _tansprarentPhaseID = getPhaseID('deferred-transparent');

    @type(Material)
    @serializable
    @displayOrder(3)
    private _deferredMaterial: Material | null = null;

    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    public static initInfo: IRenderStageInfo = {
        name: 'LightingStage',
        priority: DeferredStagePriority.LIGHTING,
        tag: 0,
        renderQueues: [
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default', 'planarShadow'],
            },
        ]
    };

    set material (val) {
        if (this._deferredMaterial === val) {
            return
        }

        this._deferredMaterial = val;
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
        return true;
    }

    public gatherLights(camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        const cmdBuff = pipeline.commandBuffers[0];

        const sphereLights = camera.scene!.sphereLights;
        const spotLights = camera.scene!.spotLights;
        const _sphere = sphere.create(0, 0, 0, 1);
        const _vec4Array = new Float32Array(4);
        const exposure = camera.exposure;

        let idx = 0;
        let elementLen = Vec4.length; // sizeof(vec4) / sizeof(float32) 
        let fieldLen = elementLen * this._maxDeferredLights;

        for (let i = 0; i < sphereLights.length && idx < this._maxDeferredLights; i++, ++idx) {
            const light = sphereLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos 
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, idx * elementLen);
                
                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }

                if (pipeline.isHDR) {
                    _vec4Array[3] = light.luminance * pipeline.fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                }

                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);

                // cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = 0.0;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);
            }
        }

        for (let i = 0; i < spotLights.length && idx < this._maxDeferredLights; i++, ++idx) {
            const light = spotLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 0);

                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (pipeline.isHDR) {
                    _vec4Array[3] = light.luminance * pipeline.fpScale * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                }
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);                

                //cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = light.spotAngle;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);

                // cc_lightDir
                Vec3.toArray(_vec4Array, light.direction);
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 3);
            }
        }

        // the count of lights is set to cc_lightDir[0].w
        var offset = fieldLen * 3 + 3;
        this._lightBufferData.set([idx], offset);

        cmdBuff.updateBuffer(this._deferredLitsBufs, this._lightBufferData);
    }

    public activate (pipeline: DeferredPipeline, flow: LightingFlow) {
        super.activate(pipeline, flow);

        const device = pipeline.device;

        // init descriptorSet 
        //layout(set = 2, binding = 1) uniform CCForwardLight {
        //        highp vec4 cc_lightPos[LIGHTS_PER_PASS]; // xyz: pos, w: isSpotLight
        //        vec4 cc_lightColor[LIGHTS_PER_PASS]; // xyz: color, w: intensity
        //        vec4 cc_lightSizeRangeAngle[LIGHTS_PER_PASS]; // x: size, y: range, z: spotAngle
        //        vec4 cc_lightDir[LIGHTS_PER_PASS]; // xyz: dir
        //};
        // total buffer size = sizeof(vec4) * 4 * _maxDeferredLights
        var totalSize = Float32Array.BYTES_PER_ELEMENT * 4 * 4 * this._maxDeferredLights;
        totalSize = Math.ceil(totalSize / device.uboOffsetAlignment) * device.uboOffsetAlignment;

        this._deferredLitsBufs = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            totalSize,
            device.uboOffsetAlignment
        ));

        const deferredLitsBufView = device.createBuffer(new BufferViewInfo(this._deferredLitsBufs, 0, totalSize));
        this._lightBufferData = new Float32Array(totalSize / Float32Array.BYTES_PER_ELEMENT);

        const layoutInfo = new DescriptorSetLayoutInfo(localDescriptorSetLayout.bindings);
        this._descriptorSetLayout = device.createDescriptorSetLayout(layoutInfo);
        this._descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(this._descriptorSetLayout));
        this._descriptorSet.bindBuffer(UBOForwardLight.BINDING, deferredLitsBufView);

        // activate queue
        for (let i = 0; i < this.renderQueues.length; i++) {
            let phase = 0;
            for (let j = 0; j < this.renderQueues[i].stages.length; j++) {
                phase |= getPhaseID(this.renderQueues[i].stages[j]);
            }
            let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
            switch (this.renderQueues[i].sortMode) {
                case RenderQueueSortMode.BACK_TO_FRONT:
                    sortFunc = transparentCompareFn;
                    break;
                case RenderQueueSortMode.FRONT_TO_BACK:
                    sortFunc = opaqueCompareFn;
                    break;
            }

            this._renderQueues[i] = new RenderQueue({
                isTransparent: this.renderQueues[i].isTransparent,
                phases: phase,
                sortFunc,
            });
        }

        this._planarQueue = new PlanarShadowQueue(this._pipeline as DeferredPipeline);
    }


    public destroy () {
        this._deferredLitsBufs.destroy();
        this._deferredLitsBufs = null!;
        this._descriptorSet = null!;
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        const device = pipeline.device;

        const cmdBuff = pipeline.commandBuffers[0];

        // light信息
        this.gatherLights(camera);
        this._descriptorSet.update();
        this._planarQueue.gatherShadowPasses(camera, cmdBuff);

        const dynamicOffsets: number[] = [0];
        cmdBuff.bindDescriptorSet(SetIndex.LOCAL, this._descriptorSet, dynamicOffsets);

        const vp = camera.viewport;
        // render area is not oriented
        const w = camera.window!.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.height : camera.width;
        const h = camera.window!.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.width : camera.height;
        this._renderArea.x = vp.x * w;
        this._renderArea.y = vp.y * h;
        this._renderArea.width = vp.width * w * pipeline.shadingScale;
        this._renderArea.height = vp.height * h * pipeline.shadingScale;

        if (camera.clearFlag & ClearFlag.COLOR) {
            if (pipeline.isHDR) {
                SRGBToLinear(colors[0], camera.clearColor);
                const scale = pipeline.fpScale / camera.exposure;
                colors[0].x *= scale;
                colors[0].y *= scale;
                colors[0].z *= scale;
            } else {
                colors[0].x = camera.clearColor.x;
                colors[0].y = camera.clearColor.y;
                colors[0].z = camera.clearColor.z;
            }
        }

        colors[0].w = camera.clearColor.w;

        const framebuffer = (this._flow as LightingFlow).lightingFrameBuffer;
        const renderPass = framebuffer.renderPass;

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        // Lighting
        var pass: Pass;
        var shader: Shader;
        const builinDeferred = builtinResMgr.get<Material>('builtin-deferred-material');
        if (builinDeferred) {
            pass = builinDeferred.passes[1];
            shader = ShaderPool.get(pass.getShaderVariant());
        } else {
            pass = this._deferredMaterial!.passes[LIGHTINGPASS_INDEX];
            shader = ShaderPool.get(this._deferredMaterial!.passes[LIGHTINGPASS_INDEX].getShaderVariant());
        }

        const inputAssembler = pipeline.quadIAOffscreen;
        var pso:PipelineState|null = null;
        if (pass != null && shader != null && inputAssembler != null)
        {
            pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
        }

        if(pso != null)
        {
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        // planarQueue
        this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        // Transparent
        this._renderQueues.forEach(this.renderQueueClearFunc);

        const renderObjects = pipeline.renderObjects;
        let m = 0; let p = 0; let k = 0;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            const subModels = ro.model.subModels;
            for (m = 0; m < subModels.length; ++m) {
                const subModel = subModels[m];
                const passes = subModel.passes;
                for (p = 0; p < passes.length; ++p) {
                    const pass = passes[p];
                    if (pass.phase !== this._tansprarentPhaseID) continue;
                    for (k = 0; k < this._renderQueues.length; k++) {
                        this._renderQueues[k].insertRenderPass(ro, m, p);
                    }
                }
            }
        }

        this._renderQueues.forEach(this.renderQueueSortFunc);
        for (let i = 0; i < this.renderQueues.length; i++) {
            this._renderQueues[i].recordCommandBuffer(device, renderPass, cmdBuff);
        }

        cmdBuff.endRenderPass();
    }

    /**
     * @en Clear the given render queue
     * @zh 清空指定的渲染队列
     * @param rq The render queue
     */
    protected renderQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }

    /**
     * @en Sort the given render queue
     * @zh 对指定的渲染队列执行排序
     * @param rq The render queue
     */
    protected renderQueueSortFunc (rq: RenderQueue) {
        rq.sort();
    }
}
