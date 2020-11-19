/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { IRenderPass, localDescriptorSetLayout, UBODeferredLight, SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { Color, Rect } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
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
import { Vec3 } from '../../math';
import { Buffer, BufferUsageBit, MemoryUsageBit, BufferInfo, BufferViewInfo, DescriptorSet, DescriptorSetLayoutInfo, 
    DescriptorSetLayout, DescriptorSetInfo } from '../../gfx';
import { UBOForwardLight } from '../define';
import { ClearFlag } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';

const colors: Color[] = [ new Color(0, 0, 0, 1) ];
const LIGHTINGPASS_INDEX = 1;

/**
 * @en The lighting render stage
 * @zh 前向渲染阶段。
 */
@ccclass('LightingStage')
export class LightingStage extends RenderStage {

    private _deferredLitsBufs: Buffer = null!;
    private _maxDeferredLights = 10;
    private _lightBufferData!: Float32Array;
    private _lightBufferStride: number = 0;
    private _lightBufferElementCount: number = 0;
    private _lightMeterScale: number = 10000.0;
    private _descriptorSet: DescriptorSet = null!;
    private _descriptorSetLayout!: DescriptorSetLayout;
    private totalLits: number = 0;

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
    
    constructor () {
        super();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
        return true;
    }
    
    public gatherLights(view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        const cmdBuff = pipeline.commandBuffers[0];

        const sphereLights = view.camera.scene!.sphereLights;
        const spotLights = view.camera.scene!.spotLights;
        const _sphere = sphere.create(0, 0, 0, 1);
        const _vec4Array = new Float32Array(4);
        const exposure = view.camera.exposure;

        this.totalLits = UBODeferredLight.LIGHTS_PER_PASS;
        let idx = 0;
        let fieldLenth = 4;
        let totalFieldLenth = fieldLenth * this.totalLits;

        for (let i = 0; i < sphereLights.length; i++, ++idx) {
            const light = sphereLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, idx * fieldLenth);

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

                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 1);
                
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = 0.0;
                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 2);
            }
        }
        for (let i = 0; i < spotLights.length; i++, ++idx) {
            const light = spotLights[i];
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 0);

                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = light.spotAngle;
                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 2);

                Vec3.toArray(_vec4Array, light.direction);
                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 3);

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
                this._lightBufferData.set(_vec4Array, idx * fieldLenth + totalFieldLenth * 1);
            }
        }

        _vec4Array[0] = sphereLights.length + spotLights.length;
        _vec4Array[1] = 0;
        _vec4Array[2] = 0;
        _vec4Array[3] = 0;
        this._lightBufferData.set(_vec4Array, totalFieldLenth * 4);

        cmdBuff.updateBuffer(this._deferredLitsBufs, this._lightBufferData);
    }

    public activate (pipeline: DeferredPipeline, flow: LightingFlow) {
        super.activate(pipeline, flow);

        const device = pipeline.device;        

        // init descriptorSet
        this._lightBufferStride = Math.ceil(UBOForwardLight.SIZE / device.uboOffsetAlignment) * device.uboOffsetAlignment;
        this._lightBufferElementCount = this._lightBufferStride / Float32Array.BYTES_PER_ELEMENT;

        this._deferredLitsBufs = this._flow.pipeline.device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            this._lightBufferStride * this._maxDeferredLights,
            this._lightBufferStride,
        ));
            
        let len = this._lightBufferElementCount * this._maxDeferredLights + 0;
        const deferredLitsBufView = device.createBuffer(new BufferViewInfo(this._deferredLitsBufs, 0, len * 4));
        this._lightBufferData = new Float32Array(this._lightBufferElementCount * this._maxDeferredLights + 0);  
        
        const layoutInfo = new DescriptorSetLayoutInfo(localDescriptorSetLayout.bindings);
        this._descriptorSetLayout = device.createDescriptorSetLayout(layoutInfo);
        this._descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(this._descriptorSetLayout));
        this._descriptorSet.bindBuffer(UBODeferredLight.BINDING, deferredLitsBufView);

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
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        const device = pipeline.device;

        const cmdBuff = pipeline.commandBuffers[0];

        // light信息
        this.gatherLights(view);
        this._descriptorSet.update()        
        this._planarQueue.gatherShadowPasses(view, cmdBuff);
        cmdBuff.bindDescriptorSet(SetIndex.LOCAL, this._descriptorSet);

        const camera = view.camera;
        const vp = camera.viewport;
        // render area is not oriented
        const w = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.height : camera.width;
        const h = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.width : camera.height;
        this._renderArea!.x = vp.x * w;
        this._renderArea!.y = vp.y * h;
        this._renderArea!.width = vp.width * w * pipeline.shadingScale;
        this._renderArea!.height = vp.height * h * pipeline.shadingScale;
        
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
        const pass = this._deferredMaterial!.passes[LIGHTINGPASS_INDEX];
        const shader = ShaderPool.get(this._deferredMaterial!.passes[LIGHTINGPASS_INDEX].getShaderVariant());

        const inputAssembler = pipeline.quadIA;
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
