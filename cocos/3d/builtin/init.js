import renderer from '../renderer';
import * as primitives from '../primitives';

import Mesh from '../assets/mesh';
import Material from '../assets/material';
import Texture2D from '../assets/texture-2d';
import TextureCube from '../assets/texture-cube';
import Effect from '../assets/effect';
import Sprite from '../assets/sprite';
import { vec3 } from '../vmath';

import effectJsons from './effects/index';

export default function (device) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');

  // ============================
  // builtin textures
  // ============================

  // default texture canvas fill
  canvas.width = canvas.height = 128;
  context.fillStyle = '#ddd';
  context.fillRect(0, 0, 128, 128);
  context.fillStyle = '#555';
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = '#555';
  context.fillRect(64, 64, 64, 64);

  // default-texture
  let defaultTexture = new Texture2D(device);
  defaultTexture.mipmap = true;
  defaultTexture.wrapS = 'repeat';
  defaultTexture.wrapT = 'repeat';
  defaultTexture.setImage(0, canvas);
  defaultTexture.commit();
  defaultTexture._uuid = 'default-texture';
  defaultTexture._loaded = true;

  // default-texture-cube
  let defaultTextureCube = new TextureCube(device);
  defaultTextureCube.setImages(
    [[canvas, canvas, canvas, canvas, canvas, canvas]]
  );
  defaultTextureCube.commit();
  defaultTextureCube._uuid = 'default-texture-cube';
  defaultTextureCube._loaded = true;

  // black texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#000';
  context.fillRect(0, 0, 2, 2);

  // black-texture
  let blackTexture = new Texture2D(device);
  blackTexture.mipmap = false;
  blackTexture.wrapS = 'repeat';
  blackTexture.wrapT = 'repeat';
  blackTexture.minFilter = 'nearest';
  blackTexture.magFilter = 'nearest';
  blackTexture.setImage(0, canvas);
  blackTexture.commit();
  blackTexture._uuid = 'black-texture';
  blackTexture._loaded = true;

  // white texture canvas fill
  canvas.width = canvas.height = 2;
  context.fillStyle = '#fff';
  context.fillRect(0, 0, 2, 2);

  // white-texture
  let whiteTexture = new Texture2D(device);
  whiteTexture.mipmap = false;
  whiteTexture.wrapS = 'repeat';
  whiteTexture.wrapT = 'repeat';
  whiteTexture.minFilter = 'nearest';
  whiteTexture.magFilter = 'nearest';
  whiteTexture.setImage(0, canvas);
  whiteTexture.commit();
  whiteTexture._uuid = 'white-texture';
  whiteTexture._loaded = true;

  // ============================
  // builtin sprites
  // ============================

  // default-sprites
  let defaultSprite = new Sprite();
  defaultSprite._texture = whiteTexture;
  defaultSprite.width = whiteTexture.width;
  defaultSprite.height = whiteTexture.height;
  defaultSprite.commit();
  defaultSprite._uuid = 'default-sprite';
  defaultSprite._loaded = true;

  // ============================
  // builtin meshes
  // ============================

  // builtin-cube
  let cubeMesh = new Mesh();
  cubeMesh._subMeshes = new Array(1);
  let cubeDesc = primitives.box(1, 1, 1, {
    widthSegments: 1,
    heightSegments: 1,
    lengthSegments: 1,
  });
  cubeMesh._subMeshes[0] = renderer.createIA(device, cubeDesc);
  cubeMesh._uuid = 'builtin-cube';
  cubeMesh._loaded = true;
  cubeMesh._minPos = vec3.clone(cubeDesc.minPos);
  cubeMesh._maxPos = vec3.clone(cubeDesc.maxPos);

  // builtin-sphere
  let sphereMesh = new Mesh();
  sphereMesh._subMeshes = new Array(1);
  let sphereDesc = primitives.sphere(0.5, {
    segments: 64,
  });
  sphereMesh._subMeshes[0] = renderer.createIA(device, sphereDesc);
  sphereMesh._uuid = 'builtin-sphere';
  sphereMesh._loaded = true;
  sphereMesh._minPos = vec3.clone(sphereDesc.minPos);
  sphereMesh._maxPos = vec3.clone(sphereDesc.maxPos);

  // builtin-cylinder
  let cylinderMesh = new Mesh();
  cylinderMesh._subMeshes = new Array(1);
  let cylinderDesc = primitives.cylinder(0.5, 0.5, 2, {
    radialSegments: 20,
    capped: true,
  });
  cylinderMesh._subMeshes[0] = renderer.createIA(device, cylinderDesc);
  cylinderMesh._uuid = 'builtin-cylinder';
  cylinderMesh._loaded = true;
  cylinderMesh._minPos = vec3.clone(cylinderDesc.minPos);
  cylinderMesh._maxPos = vec3.clone(cylinderDesc.maxPos);

  // builtin-plane
  let planeMesh = new Mesh();
  planeMesh._subMeshes = new Array(1);
  let planeDesc = primitives.plane(10, 10, {
    uSegments: 10,
    vSegments: 10,
  });
  planeMesh._subMeshes[0] = renderer.createIA(device, planeDesc);
  planeMesh._uuid = 'builtin-plane';
  planeMesh._loaded = true;
  planeMesh._minPos = vec3.clone(planeDesc.minPos);
  planeMesh._maxPos = vec3.clone(planeDesc.maxPos);

  // builtin-capsule
  let capsuleMesh = new Mesh();
  capsuleMesh._subMeshes = new Array(1);
  let capsuleDesc = primitives.capsule(0.5, 0.5, 2, {
    heightSegments: 30,
    sides: 20,
  });
  capsuleMesh._subMeshes[0] = renderer.createIA(device, capsuleDesc);
  capsuleMesh._uuid = 'builtin-capsule';
  capsuleMesh._loaded = true;
  capsuleMesh._minPos = vec3.clone(capsuleDesc.minPos);
  capsuleMesh._maxPos = vec3.clone(capsuleDesc.maxPos);

  // ============================
  // builtin effects
  // ============================

  let effects = {};
  for (let i = 0; i < effectJsons.length; ++i) {
    let effectJson = effectJsons[i];
    let effect = new Effect();
    effect._name = effectJson.name;
    effect._uuid = `builtin-effect-${effectJson.name}`;
    effect._loaded = true;
    effect.techniques = effectJson.techniques;
    effect.properties = effectJson.properties;
    effect.defines = effectJson.defines;
    effect.dependencies = effectJson.dependencies ? effectJson.dependencies : [];
    effects[effect._uuid] = effect;
  }

  // ============================
  // builtin materials
  // ============================

  let materials = {};
  [
    'sprite',
    'font'
  ].forEach(name => {
    let mat = new Material();
    mat.effect = effects[`builtin-effect-${name}`];
    mat._uuid = `builtin-material-${name}`;
    mat._loaded = true;
    materials[mat._uuid] = mat;
  });

  //
  return Object.assign({
    [defaultTexture._uuid]: defaultTexture,
    [defaultTextureCube._uuid]: defaultTextureCube,
    [blackTexture._uuid]: blackTexture,
    [whiteTexture._uuid]: whiteTexture,
    [defaultSprite._uuid]: defaultSprite,
    [cubeMesh._uuid]: cubeMesh,
    [sphereMesh._uuid]: sphereMesh,
    [cylinderMesh._uuid]: cylinderMesh,
    [planeMesh._uuid]: planeMesh,
    [capsuleMesh._uuid]: capsuleMesh,
  }, effects, materials);
}