import Component from '../../Components/CCComponent';

export default class RenderableComponent extends Component {
    constructor() {
        super();
        this._system = null;
        this._scene = null;
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
