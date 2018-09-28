import renderer from '../../renderer';
import { Layers, find } from '../../scene-graph';
import Mesh from '../assets/mesh';
import gfx from '../../renderer/gfx/index';
// import parseLevel from '../loaders/utils/level-parser';

function createJointsTexture(skinning) {
  const jointCount = skinning.jointIndices.length;

  // Set jointsTexture.
  // A squared texture with side length N(N > 1) multiples of 2 can store
  // 2 ^ (2 * N - 2) matrices.
  // We support most 1024 joints.
  let size;
  if (jointCount > 1024) {
    throw "To many joints(more than 1024).";
  } else if (jointCount > 256) {
    size = 64;
  } else if (jointCount > 64) {
    size = 32;
  } else if (jointCount > 16) {
    size = 16;
  } else if (jointCount > 4) {
    size = 8;
  } else {
    size = 4;
  }

  let texture = new gfx.Texture2D(cc.game._renderContext, size, size, 'rgba32f');
  texture.minFilter = 'nearest';
  texture.magFilter = 'nearest';
  texture.wrapS = 'clamp';
  texture.wrapT = 'clamp';
  texture.mipmap = false;
  texture.writable = true;
  texture.commit();

  return texture;
}

function createMesh(app, data) {
  let ia = renderer.createIA(cc.game._renderContext, data);
  let meshAsset = new Mesh();
  meshAsset._subMeshes = [ia];
  meshAsset._minPos = data.minPos;
  meshAsset._maxPos = data.maxPos;

  return meshAsset;
}

export default {
  createJointsTexture,
  createMesh,

//   parseLevel,

//   walk: sceneUtils.walk,
//   flat: sceneUtils.flat,
  find: find,
  Layers: Layers,
};
