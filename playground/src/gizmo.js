const scene = new cc.Scene('scene');

const cameraNode = new cc.Node('camera');
cameraNode.parent = scene;
cameraNode.setPosition(20, 20, 20);
cameraNode.lookAt(cc.v3());
cameraNode.addComponent(window.FirstPersonCamera);
cameraNode.addComponent(cc.Camera);

const material = new cc.Material();
material.initialize({
  effectName: 'unlit',
  defines: { USE_COLOR: true },
});
const material2 = new cc.Material();
material2.initialize({
  effectName: 'unlit',
  defines: { USE_COLOR: true },
  states: {
    depthStencilState: { depthTest: false, depthWrite: false },
    rasterizerState: { cullMode: cc.gfx.CullMode.NONE },
    blendState: { targets: [
      { blend: true, blendDst: cc.gfx.BlendFactor.ONE_MINUS_SRC_ALPHA, blendDstAlpha: cc.gfx.BlendFactor.ONE_MINUS_SRC_ALPHA },
    ] },
  },
});

const createArrow = (color, rotation) => {
  const arrow = new cc.Node('arrow');
  arrow.setRotation(rotation);
  const arrowHead = new cc.Node('arrowHead');
  arrowHead.parent = arrow;
  arrowHead.setPosition(0, 10, 0);
  const headModel = arrowHead.addComponent('cc.MeshRenderer');
  headModel.mesh = cc.utils.createMesh(cc.primitives.cone());
  headModel.material = material;
  headModel.material.setProperty('color', color);
  const arrowBody = new cc.Node('arrowBody');
  arrowBody.parent = arrow;
  const bodyModel = arrowBody.addComponent('cc.MeshRenderer');
  bodyModel.mesh = cc.utils.createMesh({
    positions: [0, 0, 0, 0, 10, 0],
    indices: [0, 1],
    primitiveMode: cc.gfx.PrimitiveMode.LINE_LIST,
  });

  bodyModel.material = material;
  bodyModel.material.overridePipelineStates({ primitive: cc.gfx.PrimitiveMode.LINE_LIST });
  bodyModel.material.setProperty('color', color);
  return arrow;
};
const createBorderPlane = (color, position, rotation) => {
  const borderPlane = new cc.Node('borderPlane');
  borderPlane.setPosition(position);
  borderPlane.setRotation(rotation);
  const plane = new cc.Node('plane');
  plane.parent = borderPlane;
  const planeModel = plane.addComponent('cc.MeshRenderer');
  const mesh = planeModel.mesh = cc.utils.createMesh(cc.primitives.quad());
  const submesh = mesh.renderingSubMeshes[0];

  const vbInfo = mesh.struct.vertexBundles[0].view;
  submesh.vbuffer = mesh.data.buffer.slice(vbInfo.offset, vbInfo.offset + vbInfo.length);
  const ibInfo = mesh.struct.primitives[0].indexView;
  submesh.ibuffer = mesh.data.buffer.slice(ibInfo.offset, ibInfo.offset + ibInfo.length);

  planeModel.material = material2;
  planeModel.material.setProperty('color', cc.color(0, 0, 0, 0).lerp(color, 0.5));
  const border = new cc.Node('border');
  border.parent = borderPlane;
  const borderModel = border.addComponent('cc.MeshRenderer');
  borderModel.mesh = cc.utils.createMesh({
    positions: [0.5, 0.5, 0, 0, 0.5, 0, 0.5, 0, 0],
    indices: [0, 1, 0, 2],
    primitiveMode: cc.gfx.PrimitiveMode.LINE_LIST,
  });
  borderModel.material = material;
  borderModel.material.overridePipelineStates({ primitive: cc.gfx.PrimitiveMode.LINE_LIST });
  borderModel.material.setProperty('color', color);
  return borderPlane;
};

const moveTool = new cc.Node('moveTool');
moveTool.parent = scene;
createArrow(cc.Color.RED, cc.Quat.fromEuler(new cc.Quat(), 90, 0, 0)).parent = moveTool;
createArrow(cc.Color.GREEN, cc.Quat.fromEuler(new cc.Quat(), 0, 0, 0)).parent = moveTool;
createArrow(cc.Color.BLUE, cc.Quat.fromEuler(new cc.Quat(), 0, 0, -90)).parent = moveTool;
createBorderPlane(cc.Color.RED, cc.v3(0.5, 0.5, 0), cc.Quat.fromEuler(new cc.Quat(), 0, 0, 0)).parent = moveTool;
createBorderPlane(cc.Color.GREEN, cc.v3(0.5, 0, 0.5), cc.Quat.fromEuler(new cc.Quat(), -90, -90, 0)).parent = moveTool;
createBorderPlane(cc.Color.BLUE, cc.v3(0, 0.5, 0.5), cc.Quat.fromEuler(new cc.Quat(), 90, 0, 90)).parent = moveTool;

const vel = cc.v3(); const speed = 0.1; const keys = 'IKJLOUR';
const KEYCODE = new Array(keys.length).fill(0).reduce((acc, _, i) => (acc[keys[i]] = keys.charCodeAt(i), acc), {});
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (e) => {
  if      (e.keyCode === KEYCODE.I) vel.z =  speed;
  else if (e.keyCode === KEYCODE.K) vel.z = -speed;
  else if (e.keyCode === KEYCODE.J) vel.x =  speed;
  else if (e.keyCode === KEYCODE.L) vel.x = -speed;
  else if (e.keyCode === KEYCODE.O) vel.y =  speed;
  else if (e.keyCode === KEYCODE.U) vel.y = -speed;
});
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (e) => {
  if      (e.keyCode === KEYCODE.I) vel.z = 0;
  else if (e.keyCode === KEYCODE.K) vel.z = 0;
  else if (e.keyCode === KEYCODE.J) vel.x = 0;
  else if (e.keyCode === KEYCODE.L) vel.x = 0;
  else if (e.keyCode === KEYCODE.O) vel.y = 0;
  else if (e.keyCode === KEYCODE.U) vel.y = 0;
  else if (e.keyCode === KEYCODE.R) moveTool.active = !moveTool.active;
});
cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, () => {
  moveTool.setPosition(cc.Vec3.add(moveTool._lpos, moveTool._lpos, vel));
});

cc.director.runSceneImmediate(scene);
