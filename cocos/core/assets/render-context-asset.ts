/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';
import { RenderContext } from '../pipeline/render-context';

@ccclass('cc.RenderPipelineAsset')
export default class RenderContextAsset extends Asset {
    @property({
        type: RenderContext,
    })
    public renderContext: RenderContext | null = null;
}

legacyCC.RenderContextAsset = RenderContextAsset;
