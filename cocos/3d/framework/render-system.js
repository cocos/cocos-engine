import render from '../../renderer';
export default class RenderSystem {
    constructor () {
        this._scene = new render.Scene();
    }

    init () {

    }

    add (comp) {

    }

    remove (comp) {

    }

    update (dt) {
        cc.render.render(this._scene);
        this._scene.reset();
    }

    get scene () {
        return this._scene;
    }
}
