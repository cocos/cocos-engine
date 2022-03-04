cc.AssetLibrary.init({
  libraryPath: 'library',
  rawAssetsBase: 'library',
  rawAssets: {
    assets: {
      // https://github.com/cocos-creator/example-3d/blob/master/show-cases/assets/effects/test.effect
      '97051ce4-0cc9-4ae0-a584-d73943d7c11a': ['test', 'cc.EffectAsset'],
    },
  },
});

const scene = new cc.Scene();

const cameraNode = new cc.Node('Camera');
cameraNode.parent = scene;
cameraNode.setPosition(6, 0, 2);
cameraNode.setRotationFromEuler(0, 70, 0);
cameraNode.addComponent(cc.Camera);
cameraNode.addComponent(window.FirstPersonCamera);

const modelNode = new cc.Node('test');
modelNode.parent = scene;
const modelComp = modelNode.addComponent('cc.MeshRenderer');
modelComp.mesh = cc.utils.createMesh(cc.primitives.sphere());
cc.director.runSceneImmediate(scene);

cc.loader.loadRes('test', cc.EffectAsset, (err, effect) => {
  const material = new cc.Material();
  material.initialize({ effectAsset: effect });
  modelComp.material = material;
});
