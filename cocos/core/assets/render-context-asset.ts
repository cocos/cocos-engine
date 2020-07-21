/**
 * @category asset
 */

import { ccclass, property } from '../data/class-decorator';
import { Asset } from './asset';
import { RenderContext } from '../pipeline/render-context';

@ccclass('cc.RenderContextAsset')
export default class RenderContextAsset extends Asset {
    @property({
        type: RenderContext,
    })
    public renderContext: RenderContext | null = null;
}
