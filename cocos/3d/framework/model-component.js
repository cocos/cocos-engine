import { Component } from '../ecs';
import renderer from '../renderer';

export default class ModelComponent extends Component {
  onInit() {
    this._models = [];

    /**
     * **@schema** The material of the model
     * @type {Material}
     */
    this.materials = this._materials;
    /**
     * **@schema** The mesh of the model
     * @type {Mesh}
     */
    this.mesh = this._mesh;
    /**
     * **@schema** The shadow casting mode
     * @type {string}
     */
    this.shadowCastingMode = this._shadowCastingMode;
    /**
     * **@schema** Does this model receive shadows?
     * @type {boolean}
     */
    this.receiveShadows = this._receiveShadows;
  }

  onEnable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.addModel(this._models[i]);
    }
  }

  onDisable() {
    for (let i = 0; i < this._models.length; ++i) {
      this._app.scene.removeModel(this._models[i]);
    }
  }

  getMaterial(idx) {
    if (this._materials.length === 0) {
      return null;
    }

    if (idx < this._materials.length) {
      return this._materials[idx];
    }

    return this._materials[this._materials.length - 1];
  }

  get material() {
    return this.getMaterial(0);
  }
  set material(val) {
    if (this._materials.length === 1 && this._materials[0] === val) {
      return;
    }

    this._materials[0] = val;

    if (this._models.length > 0) {
      this._models[0].setEffect(val.effectInst);
    }
  }

  _updateModels() {
    let meshCount = this._mesh ? this._mesh.subMeshCount : 0;
    let oldModels = this._models;

    this._models = new Array(meshCount);
    for (let i = 0; i < meshCount; ++i) {
      let model = new renderer.Model();
      model.createBoundingShape(this._mesh._minPos, this._mesh._maxPos);
      this._models[i] = model;
    }

    this._updateModelParams();

    if (this.enabled) {
      for (let i = 0; i < oldModels.length; ++i) {
        this._app.scene.removeModel(oldModels[i]);
      }
      for (let i = 0; i < this._models.length; ++i) {
        this._app.scene.addModel(this._models[i]);
      }
    }
  }

  _updateModelParams() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models[i];
      let material = this.getMaterial(i);
      let inputAssembler = this._mesh.getSubMesh(i);

      model.setInputAssembler(inputAssembler);
      model.setEffect(material ? material.effectInst : null);
      model.setNode(this._entity);
    }
  }

  _updateCastShadow() {
    if (this._shadowCastingMode === 'off') {
      for (let i = 0; i < this._models.length; ++i) {
        let model = this._models[i];
        model._castShadow = false;
      }
    } else if (this._shadowCastingMode === 'on') {
      for (let i = 0; i < this._models.length; ++i) {
        let model = this._models[i];
        model._castShadow = true;
      }
    } else {
      console.warn(`ShadowCastingMode ${this._shadowCastingMode} is not supported.`);
    }
  }

  _updateReceiveShadow() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models[i];
      if (model._defines['USE_SHADOW_MAP'] != undefined) {
        model._effect.define('USE_SHADOW_MAP', this._receiveShadows);
      }
    }
  }
}

ModelComponent.schema = {
  materials: {
    type: 'asset',
    default: [],
    array: true,
    set(val) {
      this._materials = val;
      this._updateModelParams();
    }
  },

  mesh: {
    type: 'asset',
    default: null,
    set(val) {
      this._mesh = val;
      this._updateModels();
    }
  },

  shadowCastingMode: {
    type: 'enums',
    default: 'off',
    options: [
      'off',
      'on',
      'twoSided',
      'shadowsOnly'
    ],
    set(val) {
      this._shadowCastingMode = val;
      this._updateCastShadow();
    }
  },

  receiveShadows: {
    type: 'boolean',
    default: false,
    set(val) {
      this._receiveShadows = val;
      this._updateReceiveShadow();
    }
  }
};