import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { IWebGL2GPUPipelineLayout } from './webgl2-gpu-objects';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';

export class WebGL2PipelineLayout extends GFXPipelineLayout {

    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGL2GPUPipelineLayout | null = null;

    public initialize (info: IGFXPipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        let idx = 0;
        for (let i = 0; i < this._setLayouts.length - 1; i++) {
            const setLayout = this._setLayouts[i] as WebGL2DescriptorSetLayout;
            const dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
            const bindings = setLayout.bindings;
            const indices: number[] = [];
            for (let j = 0, k = 0; j < bindings.length; j++) {
                if (dynamicBindings[k] === j) {
                    indices.push(idx);
                    while (dynamicBindings[k] === j) k++, idx++;
                } else {
                    indices.push(-1);
                }
            }

            dynamicOffsetIndices.push(indices);
        }

        this._gpuPipelineLayout = {
            setLayouts: this._setLayouts,
            dynamicOffsetIndices,
        };

        return true;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
