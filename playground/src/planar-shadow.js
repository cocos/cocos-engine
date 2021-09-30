const scene = new cc.Scene();
const root = new cc.Node();
root.parent = scene;
const altitude = 0;
root.setPosition(0, altitude, 0);

const cameraNode = new cc.Node('Camera');
cameraNode.parent = root;
cameraNode.setPosition(-16, 2, 16);
cameraNode.setRotationFromEuler(-12, -63, 0);
cameraNode.addComponent(cc.Camera);
cameraNode.addComponent(window.FirstPersonCamera);

const lightNode = new cc.Node('Light');
lightNode.parent = root;
lightNode.setPosition(-10, 10, -10);
lightNode.setRotationFromEuler(-50, 0, 0);
lightNode.addComponent('cc.DirectionalLight');

const material = new cc.Material();
material.initialize({ effectName: 'standard' });

const manifest = [
  { name: 'box', pos: cc.v3(0, 1, 10) },
  { name: 'sphere', pos: cc.v3(5, 1, 15) },
  { name: 'cylinder', pos: cc.v3(-5, 1, 5) },
  { name: 'torus', pos: cc.v3(5, 1, 5) },
  { name: 'cone', pos: cc.v3(-5, 1, 15) },
  { name: 'plane', pos: cc.v3(0, 0, 0), param: { width: 100, length: 100 } },
];
const models = {};
for (const info of manifest) {
  const modelNode = new cc.Node(`${info.name}`);
  modelNode.parent = root;
  const modelComp = modelNode.addComponent('cc.MeshRenderer');
  modelComp.material = info.mat || material;
  modelComp.mesh = cc.utils.createMesh(cc.primitives[info.name](info.param));
  if (info.name !== 'plane') modelComp.shadowCastingMode = cc.ModelComponent.ShadowCastingMode.ON;
  modelNode.setPosition(info.pos);
  models[info.name] = modelComp;
}

const qt = cc.Quat.fromEuler(cc.quat(), 10, 20, 0);
models.plane.node.setRotation(qt);

scene.globals.shadows.enabled = true;
scene.globals.shadows.setPlaneFromNode(models.plane.node);
scene.globals.shadows.shadowColor = cc.color('#2a4e90');

cc.director.runSceneImmediate(scene);
