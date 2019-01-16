import { CachedArray } from '../../core/memop/cached-array';
import { Camera } from '../scene/camera';
import { UIBatchModel } from './ui-batch-model';

export interface IUIRenderItem {
    camera: Camera;
    batchModel: UIBatchModel;
}

export class UIRenderQueue {

    public items: CachedArray<IUIRenderItem>;

    constructor () {
        this.items = new CachedArray(64);
    }
}
