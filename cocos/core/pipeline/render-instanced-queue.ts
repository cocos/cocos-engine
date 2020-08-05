/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { InstancedBuffer } from './instanced-buffer';
import { GFXDevice, GFXRenderPass, GFXPipelineState, GFXBuffer } from '../gfx';
import { PipelineStateManager } from './pipeline-state-manager';
import { BindingLayoutPool, PSOCIView, PSOCIPool } from '../renderer/core/memory-pools';
import { IRenderObject, UBOForwardLight } from './define';
import { LightType, Light } from '../renderer/scene/light';
import { IMacroPatch, Pass } from '../renderer/core/pass';

const spherePatches: IMacroPatch[] = [
    { name: 'CC_FORWARD_ADD', value: true },
];
const spotPatches: IMacroPatch[] = [
    { name: 'CC_FORWARD_ADD', value: true },
    { name: 'CC_SPOTLIGHT', value: true },
];

/**
 * @en Render queue for instanced batching
 * @zh 渲染合批队列。
 */
export class RenderInstancedQueue {

    /**
     * @en A set of instanced buffer
     * @zh Instance 合批缓存集合。
     */
    public queue = new Set<InstancedBuffer>();

    private static _lightPsoCreateInfos: number[] = [];

    public static getLightPipelineCreateInfo (renderObj: IRenderObject, subModelIdx: number, pass: Pass,
        validLights: Light[], lightGFXBuffers: GFXBuffer[], lightIdx: number): number {
        if (!this._lightPsoCreateInfos[lightIdx]) {
            const modelPatches = renderObj.model.getMacroPatches(subModelIdx);
            const light = validLights[lightIdx];
            const lightBuffer = lightGFXBuffers[lightIdx];

            let fullPatches: IMacroPatch[] = [];
            switch (light.type) {
                case LightType.SPHERE:
                    fullPatches = modelPatches ? spherePatches.concat(modelPatches) : spherePatches;
                    break;
                case LightType.SPOT:
                    fullPatches = modelPatches ? spotPatches.concat(modelPatches) : spotPatches;
                    break;
            }

            const psoci = pass.createPipelineStateCI(fullPatches)!;
            this._lightPsoCreateInfos[lightIdx] = psoci;
            renderObj.model.updateLocalBindings(psoci, subModelIdx);
            const bindingLayout = BindingLayoutPool.get(PSOCIPool.get(psoci, PSOCIView.BINDING_LAYOUT));
            bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, lightBuffer);
            bindingLayout.update();
        }

        return this._lightPsoCreateInfos[lightIdx];
    }

    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */
    public clear () {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            res.value.clear();
            res = it.next();
        }
        this.queue.clear();
    }

    /**
     * @en Record command buffer for the current queue
     * @zh 记录命令缓冲。
     * @param cmdBuff The command buffer to store the result
     */
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        const it = this.queue.values(); let res = it.next();
        while (!res.done) {
            const { instances, psoci } = res.value;
            if (psoci) {
                res.value.uploadBuffers();
                let lastPSO: GFXPipelineState | null = null;
                for (let b = 0; b < instances.length; ++b) {
                    const instance = instances[b];
                    if (!instance.count) { continue; }
                    const pso = PipelineStateManager.getOrCreatePipelineState(device, psoci, renderPass, instance.ia);
                    if (lastPSO !== pso) {
                        cmdBuff.bindPipelineState(pso);
                        cmdBuff.bindBindingLayout(BindingLayoutPool.get(PSOCIPool.get(psoci, PSOCIView.BINDING_LAYOUT)));
                        lastPSO = pso;
                    }
                    cmdBuff.bindInputAssembler(instance.ia);
                    cmdBuff.draw(instance.ia);
                }
            }
            res = it.next();
        }
    }
}
