import * as renderer from '../../renderer';
export default class RenderSystem {
    constructor () {
        this._scene = new renderer.Scene();
    }

    init () {

    }

    update (dt) {
        this._scene.tick();
        cc.game._renderer.render(this._scene);
        this._scene.reset();
        if (cc.director._scene) cc.director._scene.resetHasChanged();
    }

    get scene () {
        return this._scene;
    }
}
