import render from '../../renderer';
export default class RenderSystem {
    constructor () {
        this._scene = new render.Scene();
    }

    init () {

    }

    update (dt) {
        this._scene.tick();
        cc.game._renderer.render(cc.game.canvas, this._scene);
        this._scene.reset();
        if (cc.director._scene) cc.director._scene.resetHasChanged();
    }

    get scene () {
        return this._scene;
    }
}
