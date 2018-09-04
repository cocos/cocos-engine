import { Component } from '../ecs';
import renderer from '../renderer';
import { toRadian } from '../vmath';

export default class LightComponent extends Component {
  constructor() {
    super();

    this._light = new renderer.Light();
  }

  onInit() {
    this._light.setNode(this._entity);

    /**
     * **@schema** The light source type
     * @type {string}
     */
    this.type = this._type;
    /**
     * **@schema** The light source color
     * @type {color3}
     */
    this.color = this._color;
    /**
     * **@schema** The light source intensity
     * @type {number}
     */
    this.intensity = this._intensity;
    /**
     * **@schema** The light range, used for spot and point light
     * @type {number}
     */
    this.range = this._range;
    /**
     * **@schema** The spot light cone angle
     * @type {number}
     */
    this.spotAngle = this._spotAngle;
    /**
     * **@schema** The spot light exponential
     * @type {number}
     */
    this.spotExp = this._spotExp;
    /**
     * **@schema** The shadow type
     * @type {string}
     */
    this.shadowType = this._shadowType;
    /**
     * **@schema** The shadow resolution
     * @type {number}
     */
    this.shadowResolution = this._shadowResolution;
    /**
     * **@schema** The shadow darkness
     * @type {number}
     */
    this.shadowDarkness = this._shadowDarkness;
    /**
     * **@schema** The shadow min depth
     * @type {number}
     */
    this.shadowMinDepth = this._shadowMinDepth;
    /**
     * **@schema** The shadow max depth
     * @type {number}
     */
    this.shadowMaxDepth = this._shadowMaxDepth;
    /**
     * **@schema** The shadow depth scale
     * @type {number}
     */
    this.shadowDepthScale = this._shadowDepthScale;
    /**
     * **@schema** The shadow frustum size
     * @type {number}
     */
    this.shadowFrustumSize = this._shadowFrustumSize;
    /**
     * **@schema** The shadow bias
     * @type {number}
     */
    this.shadowBias = this._shadowBias;
  }

  onEnable() {
    this._app.scene.addLight(this._light);
  }

  onDisable() {
    this._app.scene.removeLight(this._light);
  }
}

LightComponent.schema = {
  type: {
    type: 'enums',
    default: 'directional',
    options: ['directional', 'point', 'spot'],
    set(val) {
      this._type = val;

      let type = renderer.LIGHT_DIRECTIONAL;
      if (this._type === 'point') {
        type = renderer.LIGHT_POINT;
      } else if (this._type === 'spot') {
        type = renderer.LIGHT_SPOT;
      }
      this._light.setType(type);
    }
  },

  color: {
    type: 'color3',
    default: [1, 1, 1],
    set(val) {
      this._color = val;
      this._light.setColor(val.r, val.g, val.b);
    }
  },

  intensity: {
    type: 'number',
    default: 1,
    set(val) {
      this._intensity = val;
      this._light.setIntensity(val);
    }
  },

  range: {
    type: 'number',
    default: 1,
    set(val) {
      this._range = val;
      this._light.setRange(val);
    }
  },

  spotAngle: {
    type: 'number',
    default: 60,
    set(val) {
      this._spotAngle = val;
      this._light.setSpotAngle(toRadian(val));
    }
  },

  spotExp: {
    type: 'number',
    default: 1,
    set(val) {
      this._spotExp = val;
      this._light.setSpotExp(val);
    }
  },

  shadowType: {
    type: 'enums',
    default: 'none',
    options: ['none', 'hard', 'soft'],
    set(val) {
      this._shadowType = val;

      let type = renderer.SHADOW_NONE;
      if (val === 'hard') {
        type = renderer.SHADOW_HARD;
      } else if (val === 'soft') {
        type = renderer.SHADOW_SOFT;
      }
      this._light.setShadowType(type);
    }
  },

  shadowResolution: {
    type: 'number',
    default: 1024,
    set(val) {
      this._shadowResolution = val;
      this._light.setShadowResolution(val);
    }
  },

  shadowDarkness: {
    type: 'number',
    default: 0.5,
    set(val) {
      this._shadowDarkness = val;
      this._light.setShadowDarkness(val);
    }
  },

  shadowMinDepth: {
    type: 'number',
    default: 1,
    set(val) {
      this._shadowMinDepth = val;
      this._light.setShadowMinDepth(val);
    }
  },

  shadowMaxDepth: {
    type: 'number',
    default: 1000,
    set(val) {
      this._shadowMaxDepth = val;
      this._light.setShadowMaxDepth(val);
    }
  },

  shadowDepthScale: {
    type: 'number',
    default: 250,
    set(val) {
      this._shadowDepthScale = val;
      this._light.setShadowDepthScale(val);
    }
  },

  shadowFrustumSize: {
    type: 'number',
    default: 50,
    set(val) {
      this._shadowFrustumSize = val;
      this._light.setShadowFrustumSize(val);
    }
  },

  shadowBias: {
    type: 'number',
    default: 0.0005,
    set(val) {
      this._shadowBias = val;
      this._light.setShadowBias(val);
    }
  }
};