// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { FixedArray, RecyclePool } from '../../3d/memop';
import { ray, triangle, intersect } from '../../3d/geom-utils';
import Layers from '../../scene-graph/layers';
import { vec3, mat4 } from '../../core/vmath';
import gfx from '../../renderer/gfx';

/**
 * A representation of the scene
 */
class Scene {
  /**
   * Setup a default empty scene
   */
  constructor(app) {
    this._lights = new FixedArray(16);
    this._models = new FixedArray(16);
    this._cameras = new FixedArray(16);
    this._debugCamera = null;
    this._app = app;

    // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
    this._views = [];
  }

  _add(pool, item) {
    if (item._poolID !== -1) {
      return;
    }

    pool.push(item);
    item._poolID = pool.length - 1;
  }

  _remove(pool, item) {
    if (item._poolID === -1) {
      return;
    }

    pool.data[pool.length-1]._poolID = item._poolID;
    pool.fastRemove(item._poolID);
    item._poolID = -1;
  }

  /**
   * update built-in bounding shapes if needed,
   * used in the frustum culling process
   */
  tick() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models.data[i];
      model._updateTransform();
    }
  }

  /**
   * reset the model viewIDs
   */
  reset() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models.data[i];
      model._viewID = -1;
    }
  }

  /**
   * Set the debug camera
   * @param {Camera} cam the debug camera
   */
  setDebugCamera(cam) {
    this._debugCamera = cam;
  }

  /**
   * Get the count of registered cameras
   * @returns {number} camera count
   */
  getCameraCount() {
    return this._cameras.length;
  }

  /**
   * Get the specified camera
   * @param {number} idx camera index
   * @returns {Camera} the specified camera
   */
  getCamera(idx) {
    return this._cameras.data[idx];
  }

  /**
   * register a camera
   * @param {Camera} camera the new camera
   */
  addCamera(camera) {
    this._add(this._cameras, camera);
  }

  /**
   * remove a camera
   * @param {Camera} camera the camera to be removed
   */
  removeCamera(camera) {
    this._remove(this._cameras, camera);
  }

  /**
   * Get the count of registered model
   * @returns {number} model count
   */
  getModelCount() {
    return this._models.length;
  }

  /**
   * Get the specified model
   * @param {number} idx model index
   * @returns {Model} the specified model
   */
  getModel(idx) {
    return this._models.data[idx];
  }

  /**
   * register a model
   * @param {Model} model the new model
   */
  addModel(model) {
    this._add(this._models, model);
  }

  /**
   * remove a model
   * @param {Model} model the model to be removed
   */
  removeModel(model) {
    this._remove(this._models, model);
  }

  /**
   * Get the count of registered light
   * @returns {number} light count
   */
  getLightCount() {
    return this._lights.length;
  }

  /**
   * Get the specified light
   * @param {number} idx light index
   * @returns {Light} the specified light
   */
  getLight(idx) {
    return this._lights.data[idx];
  }

  /**
   * register a light
   * @param {Light} light the new light
   */
  addLight(light) {
    this._add(this._lights, light);
  }

  /**
   * remove a light
   * @param {Light} light the light to be removed
   */
  removeLight(light) {
    this._remove(this._lights, light);
  }

  /**
   * register a view
   * @param {View} view the new view
   */
  addView(view) {
    if (this._views.indexOf(view) === -1) {
      this._views.push(view);
    }
  }

  /**
   * remove a view
   * @param {View} view the view to be removed
   */
  removeView(view) {
    let idx = this._views.indexOf(view);
    if (idx !== -1) {
      this._views.splice(idx, 1);
    }
  }
}

if (CC_EDITOR) {
  /**
   * Cast a ray into the scene, record all the intersected models in the result array
   * @param {Ray} worldRay the testing ray
   * @param {Object[]} results the results array
   * @param {number} mask the layer mask to filter the models
   * @return {Object[]} the results array
   */
  Scene.prototype.raycast = (function() {
    let modelRay = ray.create();
    let v3 = vec3.create();
    let m4 = mat4.create();
    let distance = Infinity;
    let tri = triangle.create();
    let pool = new RecyclePool(() => {
      return { node: null, distance: Infinity };
    }, 8);
    let results = [];
    return function(worldRay, mask = Layers.RaycastMask) {
      pool.reset();
      for (let i = 0; i < this._models.length; i++) {
        let m = this._models.data[i], node = m._node;
        if (!cc.Layers.check(node._layer, mask) || !m._bsModelSpace) continue;
        // transform ray back to model space
        mat4.invert(m4, node.getWorldMatrix(m4));
        vec3.transformMat4(modelRay.o, worldRay.o, m4);
        vec3.normalize(modelRay.d, vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));
        // broadphase
        if ((distance = intersect.ray_aabb(modelRay, m._bsModelSpace)) <= 0) continue;
        let ia = m._inputAssembler;
        if (ia._primitiveType == gfx.PT_TRIANGLES) {
          // narrowphase
          distance = Infinity;
          let vb = ia._vertexBuffer[gfx.ATTR_POSITION];
          let ib = ia._indexBuffer._data, sides = ia.doubleSided;
          for (let j = 0; j < ib.length; j += 3) {
            let i0 = ib[j] * 3, i1 = ib[j + 1] * 3, i2 = ib[j + 2] * 3;
            vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
            vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
            let dist = intersect.ray_triangle(modelRay, tri, sides);
            if (dist <= 0 || dist > distance) continue;
            distance = dist;
          }
        }
        if (distance < Infinity) {
          let r = pool.add();
          r.node = node;
          r.distance = distance * vec3.magnitude(vec3.mul(v3, modelRay.d, node._scale));
          results[pool.length - 1] = r;
        }
      }
      results.length = pool.length;
      return results;
    };
  })();
}

export default Scene;
