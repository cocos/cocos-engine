import Component from '../../Components/CCComponent';

class RenderSystemActorListener {
    constructor() {
        this._renderSystem = null;
    }

    onRenderableComponentCreated(comp) {
        if(this._renderSystem === null) {
            this._renderSystem = cc.director._renderSystem;
        }
        comp._system = this._renderSystem;
        comp._scene = this._renderSystem.scene;
    }
}

let listener = new RenderSystemActorListener();

export default class RenderSystemActor extends Component {
    constructor() {
        super();
        this._system = null;
        this._scene = null;
        listener.onRenderableComponentCreated(this);
    }

    // todo add implementation
    get renderSystem() {
        return this._system;
    }

    // todo add scene
    get scene() {
        return this._scene;
    }
};
