import { Material } from '../3d/assets/material';
import { GFXDevice } from '../gfx/device';
import { RenderPipeline } from './render-pipeline';
import { IRenderStageInfo, RenderStage } from './render-stage';
import { RenderView } from './render-view';

export interface IRenderFlowInfo {
    name?: string;
    priority: number;
}

export abstract class RenderFlow {

    public get device (): GFXDevice {
        return this._device;
    }

    public get pipeline (): RenderPipeline {
        return this._pipeline;
    }

    public get name (): string {
        return this._name;
    }

    public get priority (): number {
        return this._priority;
    }

    public get stages (): RenderStage[] {
        return this._stages!;
    }

    public get material (): Material {
        return this._material!;
    }

    public get name (): string {
        return this._name;
    }

    protected _device: GFXDevice;
    protected _pipeline: RenderPipeline;
    protected _name: string = '';
    protected _priority: number = 0;
    protected _stages: RenderStage[] = [];
    protected _material: Material | null = null;

    constructor (pipeline: RenderPipeline) {
        this._device = pipeline.device;
        this._pipeline = pipeline;
    }

    public abstract initialize (info: IRenderFlowInfo): boolean;
    public abstract destroy ();

    public resize (width: number, height: number) {
        for (const stage of this._stages) {
            stage.resize(width, height);
        }
    }

    public render (view: RenderView) {
        for (const stage of this._stages) {
            stage.render(view);
        }
    }

    public createStage<T extends RenderStage> (
        clazz: new(flow: RenderFlow) => T,
        info: IRenderStageInfo): RenderStage | null {

        const stage: RenderStage = new clazz(this);
        if (stage.initialize(info)) {
            this._stages.push(stage);
            this._stages.sort((a, b) => {
                return a.priority - b.priority;
            });

            return stage;
        } else {
            return null;
        }
    }

    public destroyStages () {
        for (const stage of this._stages) {
            stage.destroy();
        }
        this._stages = [];
    }
}
