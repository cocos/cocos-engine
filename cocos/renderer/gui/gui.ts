import { Root } from '../../core/root';

export class GUI {

    public get root (): Root {
        return this._root;
    }

    private _root: Root;

    constructor (root: Root) {
        this._root = root;
    }

    public frameMove (deltaTime: number) {
    }
}
