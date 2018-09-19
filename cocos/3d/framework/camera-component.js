import RenderableComponent from './renderable-component';
import _decorator from '../../core/data/class-decorator';
import renderer from '../../renderer';
import { toRadian, color4 } from '../../core/vmath';
import Rect from '../../core/value-types/rect';
const { ccclass, property } = _decorator;

@ccclass('CameraComponent')
export default class CameraComponent extends RenderableComponent {

    constructor() {
        super();
        this._system = CameraComponent.system;
        this._scene = this._system.scene;
        this._projection = 'perspective';
        this._priority = 0;
        this._fov = 45;
        this._orthoHeight = 10;
        this._near = 0.01;
        this._far = 1000.0;
        this._color = new color4(0.2, 0.3, 0.47, 1.0);
        this._depth = 1.0;
        this._stencil = 0;
        this._clearFlags = renderer.CLEAR_COLOR | renderer.CLEAR_DEPTH;
        this._rect = new Rect(0, 0, 1, 1);
        this._camera = new renderer.Camera();
    }

    @property
    get projection() {
        return this._projection;
    }
    set projection(val) {
        this._projection = val;
        let type = renderer.PROJ_PERSPECTIVE;
        if (this._projection === 'ortho') {
            type = renderer.PROJ_ORTHO;
        }
        this._camera.setType(this._projection);
    }

    @property
    get priority() {
        return this._priority;
    }
    set priority(val) {
        this._priority = val;
        this._camera.setPriority(this._priority);
    }

    @property
    get fov() {
        return this._fov;
    }
    set fov(val) {
        this._fov = val;
        this._camera.setFov(toRadian(this._fov));
    }

    @property
    get orthoHeight() {
        return this._orthoHeight;
    }
    set orthoHeight(val) {
        this._orthoHeight = val;
        this._camera.setOrthoHeight(this._orthoHeight);
    }

    @property
    get near() {
        return this._near;
    }

    set near(val) {
        this._near = val;
        this._camera.setNear(this._near);
    }

    @property
    get far() {
        return this._far;
    }
    set far(val) {
        this._far = val;
        this._camera.setFar(this._far);
    }

    @property
    get color() {
        return this._color;
    }

    set color(val) {
        this._color.r = val.r;
        this._color.g = val.g;
        this._color.b = val.b;
        this._color.a = val.a;
        let color = this._color;
        this._camera.setColor(color.r, color.g, color.b, color.a);
    }

    @property
    get depth() {
        return this._depth;
    }
    set depth(val) {
        this._depth = val;
        this._camera.setDepth(this._depth);
    }

    @property
    get stencil() {
        return this._stencil;
    }

    set stencil(val) {
        this._stencil = val;
        this._camera.setStencil(this._stencil);
    }

    @property
    get clearFlags() {
        return this._clearFlags;
    }

    set clearFlags(val) {
        this._clearFlags = val;
        this._camera.setClearFlags(this._clearFlags);
    }

    @property
    get rect() {
        return this._rect;
    }

    set rect(val) {
        this._rect.set(val);
        this._camera.setRect(this._rect);
    }

    onLoad() {
        this._camera.setStages([
            'opaque',
            'transparent'
        ]);
        this._camera.setNode(this.node);

        /**
         * **@schema** The projection type of the camera
         * @type {string}
         */
        this.projection = this._projection;
        /**
         * **@schema** The camera priority
         * @type {number}
         */
        this.priority = this._priority;
        /**
         * **@schema** The camera field of view
         * @type {number}
         */
        this.fov = this._fov;
        /**
         * **@schema** The camera height when in orthogonal mode
         * @type {number}
         */
        this.orthoHeight = this._orthoHeight;
        /**
         * **@schema** The near clipping distance of the camera
         * @type {number}
         */
        this.near = this._near;
        /**
         * **@schema** The far clipping distance of the camera
         * @type {number}
         */
        this.far = this._far;
        /**
         * **@schema** The clearing color of the camera
         * @type {color4}
         */
        this.color = this._color;
        /**
         * **@schema** The clearing depth value of the camera
         * @type {number}
         */
        this.depth = this._depth;
        /**
         * **@schema** The clearing stencil value of the camera
         * @type {number}
         */
        this.stencil = this._stencil;
        /**
         * **@schema** The clearing flags of this camera
         * @type {number}
         */
        this.clearFlags = this._clearFlags;
        /**
         * **@schema** The screen rect of the camera
         * @type {Object}
         */
        this.rect = this._rect;
    }

    onEnable() {
        this.scene.addCamera(this._camera);
    }

    onDisable() {
        this.scene.removeCamera(this._camera);
    }
}


