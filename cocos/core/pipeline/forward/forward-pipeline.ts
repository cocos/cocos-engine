/**
 * @category pipeline
 */

import { ccclass, property } from '../../data/class-decorator';
import { RenderPipeline } from '../render-pipeline';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { Root } from '../../root';
import { ForwardRenderContext } from './forward-render-context';
import { RenderTextureConfig, MaterialConfig } from '../pipeline-serialization';

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    @property({
        type: [RenderTextureConfig],
    })
    public renderTextures: RenderTextureConfig[] = [];
    @property({
        type: [MaterialConfig],
    })
    public materials: MaterialConfig[] = [];

    public initialize () {
        super.initialize();
        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this._flows.push(forwardFlow);
    }

    public activate (root: Root): boolean {
        if (!super.activate(root)) {
            return false;
        }

        if (!this._renderContext.initialize(this)) {
            console.error('ForwardPipeline startup failed!');
            return false;
        }

        const uiFlow = new UIFlow();
        uiFlow.initialize(UIFlow.initInfo);
        this._flows.push(uiFlow);
        uiFlow.activate(this._renderContext);

        return true;
    }

    public destroy () {
        super.destroy();
    }

    protected getRenderContext () {
        return new ForwardRenderContext();
    }
}
