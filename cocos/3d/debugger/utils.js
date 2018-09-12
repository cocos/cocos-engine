import renderer from '../renderer';
import { vec3, color3 } from '../vmath';
import { Node } from '../scene-graph';

export function createGrid(app, width, length, seg) {
  let linePass = new renderer.Pass('line');
  linePass.setDepth(true, false);
  let lineTech = new renderer.Technique(
    ['opaque'],
    [],
    [linePass]
  );
  let lineEffect = new renderer.Effect([lineTech], {}, []);

  let model = new renderer.LineBatchModel();
  model.setNode(new Node('debug-grid'));
  model.setEffect(lineEffect);

  // create mesh
  let hw = width * 0.5;
  let hl = length * 0.5;
  let dw = width / seg;
  let dl = length / seg;

  for (let x = -hw; x <= hw; x += dw) {
    model.addLine(
      vec3.create(x, 0, -hl),       // start
      vec3.create(x, 0, hl),        // end
      color3.create(0.4, 0.4, 0.4), // color
      vec3.create(0, 1, 0));        // normal
  }

  for (let z = -hl; z <= hl; z += dl) {
    model.addLine(
      vec3.create(-hw, 0, z),       // start
      vec3.create(hw, 0, z),        // end
      color3.create(0.4, 0.4, 0.4), // color
      vec3.create(0, 1, 0));        // normal
  }

  return model;
}