import renderer from '../renderer';
import gfx from '../gfx';
import { color4 } from '../vmath';
import { Node } from '../scene-graph';

export function createGrid(app, width, length, seg) {
  // create mesh
  let vertices = [];
  let hw = width * 0.5;
  let hl = length * 0.5;
  let dw = width / seg;
  let dl = length / seg;

  for (let x = -hw; x <= hw; x += dw) {
    vertices.push(x, 0, -hl);
    vertices.push(x, 0, hl);
  }

  for (let z = -hl; z <= hl; z += dl) {
    vertices.push(-hw, 0, z);
    vertices.push(hw, 0, z);
  }

  let ia = renderer.createIA(app.device, {
    positions: vertices
  });
  ia._primitiveType = gfx.PT_LINES;

  let simplePass = new renderer.Pass('simple');
  simplePass.setDepth(true, true);
  let simpleTech = new renderer.Technique(
    ['opaque'],
    [
      { name: 'color', type: renderer.PARAM_COLOR4 }
    ],
    [simplePass]
  );
  let simpleEffect = new renderer.Effect(
    [simpleTech],
    {},
    [
      { name: 'USE_TEXTURE', value: false },
      { name: 'USE_COLOR', value: true }
    ]
  );
  simpleEffect.define('USE_COLOR', true);
  simpleEffect.setProperty('color', color4.create(0.4, 0.4, 0.4, 1.0));

  let model = new renderer.Model();
  model.setInputAssembler(ia);
  model.setEffect(simpleEffect);
  model.setNode(new Node('debug-grid'));

  return model;
}