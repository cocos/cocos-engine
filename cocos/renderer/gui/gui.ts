import { Root } from '../../core/root';
import { RenderScene } from '../scene/render-scene';

export class GUI {

    public get root (): Root {
        return this._root;
    }

    public get scene (): RenderScene {
        return this._scene;
    }

    private _root: Root;
    private _scene: RenderScene;

    constructor (root: Root) {
        this._root = root;
        this._scene = this._root.createScene({
            name: 'GUIScene',
        });
    }

    public frameMove (deltaTime: number) {
    }
}
