import { Component } from '../ecs';
import renderer from '../renderer';
import { toRadian } from '../vmath';

export default class CameraComponent extends Component {
  constructor() {
    super();

    this._camera = new renderer.Camera();
  }
  onInit() {
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);
    this._camera.setNode(this._entity);

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
    this._app.scene.addCamera(this._camera);
  }

  onDisable() {
    this._app.scene.removeCamera(this._camera);
  }
}

CameraComponent.schema = {
  projection: {
    type: 'enums',
    default: 'perspective',
    options: ['ortho', 'perspective'],
    set(val) {
      this._projection = val;

      let type = renderer.PROJ_PERSPECTIVE;
      if (this._projection === 'ortho') {
        type = renderer.PROJ_ORTHO;
      }
      this._camera.setType(type);
    }
  },

  priority: {
    type: 'number',
    default: 0,
    set(val) {
      this._priority = val;
      this._camera.setPriority(val);
    }
  },

  // fov (in angle)
  fov: {
    type: 'number',
    default: 45,
    set(val) {
      this._fov = val;
      this._camera.setFov(toRadian(val));
    }
  },

  // orthoHeight
  orthoHeight: {
    type: 'number',
    default: 10,
    set(val) {
      this._orthoHeight = val;
      this._camera.setOrthoHeight(val);
    }
  },

  // near
  near: {
    type: 'number',
    default: 0.01,
    set(val) {
      this._near = val;
      this._camera.setNear(val);
    }
  },

  // far
  far: {
    type: 'number',
    default: 1000.0,
    set(val) {
      this._far = val;
      this._camera.setFar(val);
    }
  },

  // color
  color: {
    type: 'color4',
    default: [0.2, 0.3, 0.47, 1],
    set(val) {
      this._color = val;
      this._camera.setColor(val.r, val.g, val.b, val.a);
    }
  },

  // depth
  depth: {
    type: 'number',
    default: 1,
    set(val) {
      this._depth = val;
      this._camera.setDepth(val);
    }
  },

  // stencil
  stencil: {
    type: 'number',
    default: 0,
    set(val) {
      this._stencil = val;
      this._camera.setStencil(val);
    }
  },

  // clearFlags
  clearFlags: {
    type: 'number',
    default: 3, // enums.CLEAR_COLOR | enums.CLEAR_DEPTH;
    set(val) {
      this._clearFlags = val;
      this._camera.setClearFlags(val);
    }
  },

  // rect
  rect: {
    type: 'rect',
    default: [0, 0, 1, 1],
    set(val) {
      this._rect = val;
      this._camera.setRect(val[0], val[1], val[2], val[3]);
    }
  },
};