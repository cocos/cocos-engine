import render from '../../renderer';
export default class RenderSystem {
    constructor () {
        this._scene = new render.Scene();
    }

    init () {

    }

    update (dt) {
        cc.game._renderer.render(this._scene);
        this._scene.reset();
    }

    get scene () {
        return this._scene;
    }
}
