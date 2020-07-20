/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { RenderStage } from '../pipeline/render-stage';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

@ccclass('cc.RenderStageAsset')
export default class RenderStageAsset extends Asset {
    @property({
        type: RenderStage,
    })
    public renderStage: RenderStage | null = null;
}

legacyCC.RenderPipelineAsset = RenderStageAsset;
