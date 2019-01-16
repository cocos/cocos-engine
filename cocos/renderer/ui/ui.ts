
import { MeshBuffer} from './mesh-buffer';
// import { vfmt3D } from '../../2d/renderer/webgl/vertex-format';
import { RecyclePool } from '../../3d/memop/recycle-pool';
import { Root } from '../../core/root';
import { RenderScene } from '../scene/render-scene';
import { UIBatchModel } from './ui-batch-model';

export class UI {
    // private _buffer: MeshBuffer | null = new MeshBuffer(this, vfmt3D);
    private _batchedModels: UIBatchModel[] = [];
    private _iaPool: RecyclePool | null = new RecyclePool(16, () => {
        // return this._root.device.createInputAssembler({

        // });
    });
    private _modelPool: RecyclePool | null = new RecyclePool(16, () => {
        return this._scene.createModel(UIBatchModel);
    });
    private _scene: RenderScene;

    constructor (private _root: Root) {
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
    }

    public initialize () {
        return true;
    }

    public destroy () {
        // this._reset();
    }

    public addScreen (comp) {
    }

    public removeScreen (comp) {
    }

    public update (dt: number) {
        const models = this._emit();
        this._render(models);
    }

    private _emit (): UIBatchModel[] {
        return this._batchedModels;
    }

    private _render (models: UIBatchModel[]) {

    }
}
