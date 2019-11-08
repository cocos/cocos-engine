import { Asset } from './asset'
import { ccclass, property } from '../data/class-decorator';
import { RenderPipeline } from '../pipeline/render-pipeline';

@ccclass('cc.RenderPipelineAsset')
class RenderPipelineAsset extends Asset {
    @property({
        type: RenderPipeline,
    })
    public renderPipeline: RenderPipeline;
}
