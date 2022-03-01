import { RenderPipeline } from '..';
import { DescriptorSetLayout } from '../../gfx';
import { MacroRecord } from '../../renderer';
import { Model } from '../../renderer/scene';
import { PipelineSceneData } from '../pipeline-scene-data';
import { PipelineRuntime } from './pipeline';

export class LegacyPipelineRuntime extends PipelineRuntime {
    constructor (pipeline: RenderPipeline) {
        super();
        this._pipeline = pipeline;
    }
    public get macros (): MacroRecord {
        return this._pipeline.macros;
    }
    public get descriptorSetLayout (): DescriptorSetLayout {
        return this._pipeline.descriptorSetLayout;
    }
    public get pipelineSceneData (): PipelineSceneData {
        return this._pipeline.pipelineSceneData;
    }
    public get constantMacros (): string {
        return this._pipeline.constantMacros;
    }
    public get profiler (): Model | null {
        return this._pipeline.profiler;
    }
    public set profiler (profiler: Model | null) {
        this._pipeline.profiler = profiler;
    }
    _pipeline: RenderPipeline;
}
