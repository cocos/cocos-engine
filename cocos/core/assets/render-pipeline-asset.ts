/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

@ccclass('cc.RenderPipelineAsset')
export default class RenderPipelineAsset extends Asset {
    @property({
        type: RenderPipeline,
    })
    public renderPipeline: RenderPipeline | null = null;
}

legacyCC.RenderPipelineAsset = RenderPipelineAsset;
