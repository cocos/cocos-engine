import Asset from './asset';

// TODO:
// import gltfUtils from '../loaders/utils/gltf-utils';
// import ModelComponent from '../framework/model-component';
// import SkinningModelComponent from '../framework/skinning-model-component';

export default class Gltf extends Asset {
  constructor() {
    super();

    this._nodes = null; // [gltfNode, ...]
    this._meshes = null; // [Mesh, ...]
    this._joints = null; // Joints
  }

  subAsset(localID) {
    let id = parseInt(localID.substring(1));
    if (localID[0] === 'm') {
      return this._meshes[id];
    }

    if (localID === 'joints') {
      return this._joints;
    }

    return null;
  }

  // TODO:
  // instantiate(app) {
  //   let entities = gltfUtils.createEntities(this._app, this._nodes);
  //   for (let i = 0; i < this._nodes.length; ++i) {
  //     let gltfNode = this._nodes[i];
  //     if (gltfNode.mesh) {
  //       let mesh = this._meshes[gltfNode.mesh];

  //       let ctor = ModelComponent;
  //       if (mesh.skinning) {
  //         ctor = SkinningModelComponent;
  //       }

  //       let comp = new ctor();
  //       comp._app = app;
  //       comp._entity = entities[i];
  //       comp.mesh = mesh;

  //       // invoke onInit
  //       if (comp.onInit) {
  //         comp.onInit();
  //       }
  //     }
  //   }
  // }
}