import Asset from './asset';

export default class Mesh extends Asset {
  constructor() {
    super();

    this._subMeshes = null; // [renderer.InputAssemblers]
    this._skinning = null; // {jointIndices, bindposes}

    this._minPos = null; // vec3
    this._maxPos = null; // vec3
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // destroy vertex buffer
    this._subMeshes[0]._vertexBuffer.destroy();

    // destroy index buffers
    for (let i = 0; i < this._subMeshes.length; ++i) {
      let mesh = this._subMeshes[i];
      mesh._indexBuffer.destroy();
    }

    this._subMeshes = null;

    super.unload();
  }

  get skinning() {
    return this._skinning;
  }

  get subMeshCount() {
    return this._subMeshes.length;
  }

  getSubMesh(idx) {
    return this._subMeshes[idx];
  }

  // TODO
  // updateData () {
  //   // store the data
  //   if (this._persist) {
  //     if (this._data) {
  //       this._data.set(data, offset);
  //     } else {
  //       this._data = data;
  //     }
  //   }
  // }
}