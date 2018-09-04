import { Component } from '../ecs';
import renderer from '../renderer';
import { box } from '../primitives';
import Material from '../assets/material';
import enums from '../renderer';

export default class SkyboxComponent extends Component {
  constructor() {
    super();

    this._model = new renderer.Model();
    this._attachedCamera = null;

    /**
     * **@schema** The material of the model
     * @type {Material}
     */
    this.material = this._material;
    /**
     * **@schema** The material of the model
     * @type {TextureCube}
     */
    this.cubeMap = this._cubeMap;
  }
  
  onInit() {
    this._model.setNode(this._entity);

    let ia = renderer.createIA(this._app.device, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.setInputAssembler(ia);

    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._app.assets.get('builtin-effect-skybox');
    }

    this._updateMaterialParams();
    this._model.setEffect(this._material.effectInst);
  }

  onEnable() {
    if (this._entity != null) {
      let cameraComponent = this._entity.getComp('Camera');
      if (cameraComponent != null && (cameraComponent._clearFlags & enums.CLEAR_SKYBOX)) {
        this._attachedCamera = cameraComponent._camera;
        this._attachedCamera._clearModel = this._model;
      }
    }
  }

  onDisable() {
    if (this._attachedCamera != null) {
      this._attachedCamera._clearModel = null;
      this._attachedCamera = null;
    }
  }

  _updateMaterialParams() {
    if (this._material === null || this._material === undefined) {
      return;
    }
    if (this._cubeMap !== null && this._cubeMap !== undefined) {
      this._material.setProperty('cubeMap', this._cubeMap);
    }
  }
}

SkyboxComponent.schema = {
  material: {
    type: 'asset',
    default: null,
    set(val) {
      this._material = val;
      if (!this._material) return;
      this._updateMaterialParams();
      this._model.setEffect(val.effectInst);
    }
  },

  cubeMap: {
    type: 'asset',
    default: null,
    set(val) {
      this._cubeMap = val;
      this._updateMaterialParams();
    }
  }
};