import Component from '../../Components/CCComponent';

export default class RenderableComponent extends Component {
    constructor() {
        this._system = RenderableComponent.system;
        this._scene = this._system.scene;
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
