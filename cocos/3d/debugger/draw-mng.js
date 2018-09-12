import { vec3, color3, mat4 } from '../vmath';
import { LinkedArray } from '../memop';
import { Node } from '../scene-graph';
import gfx from '../gfx';
import renderer from '../renderer';
import { sphere, wireframe } from '../primitives';

let _right = vec3.create(1, 0, 0);
let _up = vec3.create(0, 1, 0);
let _forward = vec3.create(0, 0, 1);
let _v3_tmp = vec3.create(0, 0, 0);
let _v3_tmp2 = vec3.create(0, 0, 0);
let _c3_tmp = color3.create();

export default class DrawMng {
  constructor(app) {
    this._app = app;

    // debug view
    this._view2D = new renderer.View();
    this._view2D._clearFlags = 0;
    this._view2D._cullingByID = true;
    this._view2D._stages = [
      'opaque'
    ];

    this._lines = new LinkedArray(() => {
      return {
        start: vec3.create(0, 0, 0),
        end: vec3.create(0, 0, 0),
        color: color3.create(),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,
        is2D: false,

        _prev: null,
        _next: null,
      };
    }, 2000);

    this._rects = new LinkedArray(() => {
      return {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        color: color3.create(),
        duration: 0.0,
        timer: 0.0,

        _prev: null,
        _next: null,
      };
    }, 2000);

    this._axesList = new LinkedArray(() => {
      return {
        pos: vec3.create(0, 0, 0),
        up: vec3.create(0, 0, 0),
        right: vec3.create(0, 0, 0),
        forward: vec3.create(0, 0, 0),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,
        is2D: false,

        _prev: null,
        _next: null,
      };
    }, 2000);

    let wireframePass = new renderer.Pass('wireframe');
    wireframePass.setDepth(true, true);
    let wireframeTech = new renderer.Technique(
      ['opaque'],
      [
        { name: 'color', type: renderer.PARAM_COLOR3 }
      ],
      [wireframePass]
    );
    let wireframeEffect = new renderer.Effect([wireframeTech], {}, []);
    wireframeEffect.setProperty('color', color3.create(1, 1, 1));

    this._primitives = new LinkedArray(() => {
      return {
        model: (() => {
          let model = new renderer.Model();
          let node = new Node();
          model.setNode(node);
          model.setEffect(wireframeEffect);

          return model;
        })(),
        duration: 0.0,
        depthTest: false,
        timer: 0.0,

        _prev: null,
        _next: null,
      };
    }, 2000);

    let linePass = new renderer.Pass('line');
    linePass.setDepth(true, false);
    let lineTech = new renderer.Technique(
      ['opaque'],
      [],
      [linePass]
    );
    let lineEffect = new renderer.Effect([lineTech], {}, []);

    let lineBatchModel = new renderer.LineBatchModel();
    lineBatchModel.setNode(new Node('debug-lines'));
    lineBatchModel.setEffect(lineEffect);

    //
    let lineBatchModel2D = new renderer.LineBatchModel();
    lineBatchModel2D.setNode(new Node('debug-lines-2d'));
    lineBatchModel2D.setEffect(lineEffect);

    //
    let sphereData = sphere(1.0, {
      segments: 20,
    });
    sphereData.uvs = null;
    sphereData.indices = wireframe(sphereData.indices);
    this._sphereIA = renderer.createIA(app.device, sphereData);
    this._sphereIA._primitiveType = gfx.PT_LINES;

    //
    this._lineBatchModel = lineBatchModel;
    this._lineBatchModel2D = lineBatchModel2D;
  }

  start () {
    this._app.scene.addView(this._view2D);
    this._app.scene.addModel(this._lineBatchModel);
    this._app.scene.addModel(this._lineBatchModel2D);
  }

  stop () {
    this._app.scene.removeView(this._view2D);
    this._app.scene.removeModel(this._lineBatchModel);
    this._app.scene.removeModel(this._lineBatchModel2D);

    this._primitives.forEach(item => {
      item.model.setInputAssembler(null);
      this._app.scene.removeModel(item.model);
      this._primitives.remove(item);
    });
  }

  /**
   *
   */
  tick() {
    let dt = this._app.deltaTime;
    let canvasWidth = this._app._canvas.width;
    let canvasHeight = this._app._canvas.height;

    // update view
    mat4.ortho(this._view2D._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
    mat4.copy(this._view2D._matViewProj, this._view2D._matProj);
    mat4.invert(this._view2D._matInvViewProj, this._view2D._matProj);
    this._view2D._rect.x = this._view2D._rect.y = 0;
    this._view2D._rect.w = canvasWidth;
    this._view2D._rect.h = canvasHeight;

    //
    this._lineBatchModel.clear();
    this._lineBatchModel2D.clear();
    this._lineBatchModel2D._viewID = this._view2D._id;

    // lines
    this._lines.forEach(item => {
      if (item.timer > item.duration) {
        this._lines.remove(item);
        return;
      }

      if (item.is2D) {
        this._lineBatchModel2D.addLine(item.start, item.end, item.color);
      } else if (item.depthTest) {
        this._lineBatchModel.addLine(item.start, item.end, item.color);
      } else {
        console.warn('We have not support it yet');
        // this._lineBatchModelNoDepth.addLine(start, end, color, duration);
      }

      item.timer += dt;
    });

    // rects
    this._rects.forEach(item => {
      if (item.timer > item.duration) {
        this._rects.remove(item);
        return;
      }

      this._lineBatchModel2D.addLine(
        vec3.set(_v3_tmp, item.x, item.y, 0.0),
        vec3.set(_v3_tmp2, item.x, item.y + item.h, 0.0),
        item.color
      );
      this._lineBatchModel2D.addLine(
        vec3.set(_v3_tmp, item.x, item.y + item.h, 0.0),
        vec3.set(_v3_tmp2, item.x + item.w, item.y + item.h, 0.0),
        item.color
      );
      this._lineBatchModel2D.addLine(
        vec3.set(_v3_tmp, item.x + item.w, item.y + item.h, 0.0),
        vec3.set(_v3_tmp2, item.x + item.w, item.y, 0.0),
        item.color
      );
      this._lineBatchModel2D.addLine(
        vec3.set(_v3_tmp, item.x + item.w, item.y, 0.0),
        vec3.set(_v3_tmp2, item.x, item.y, 0.0),
        item.color
      );

      item.timer += dt;
    });

    // axes list
    this._axesList.forEach(item => {
      if (item.timer > item.duration) {
        this._axesList.remove(item);
        return;
      }

      if (item.is2D) {
        this._lineBatchModel2D.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
        this._lineBatchModel2D.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
        this._lineBatchModel2D.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
      } else if (item.depthTest) {
        this._lineBatchModel.addLine(item.pos, item.up, color3.set(_c3_tmp, 1, 0, 0));
        this._lineBatchModel.addLine(item.pos, item.right, color3.set(_c3_tmp, 0, 1, 0));
        this._lineBatchModel.addLine(item.pos, item.forward, color3.set(_c3_tmp, 0, 0, 1));
      } else {
        console.warn('We have not support it yet');
        // this._linesModelNoDepth.addLine(start, end, color, duration);
      }

      item.timer += dt;
    });

    // primitives
    this._primitives.forEach(item => {
      if (item.timer > item.duration) {
        item.model.setInputAssembler(null);
        this._app.scene.removeModel(item.model);

        this._primitives.remove(item);
        return;
      }

      item.timer += dt;
    });
  }

  addLine(start, end, color, duration = 0.0, depthTest = true, is2D = false) {
    let line = this._lines.add();

    vec3.copy(line.start, start);
    vec3.copy(line.end, end);
    color3.copy(line.color, color);
    line.duration = duration;
    line.depthTest = depthTest;
    line.timer = 0.0;
    line.is2D = is2D;

    if (is2D) {
      line.start.z = 0.0;
      line.end.z = 0.0;
    }
  }

  addRect2D(x, y, width, height, color, duration = 0.0) {
    let rect = this._rects.add();

    rect.x = x;
    rect.y = y;
    rect.w = width;
    rect.h = height;
    color3.copy(rect.color, color);
    rect.duration = duration;
    rect.timer = 0.0;
  }

  addAxes(pos, rotation, scale, duration = 0.0, depthTest = true, is2D = false) {
    let axes = this._axesList.add();

    vec3.copy(axes.pos, pos);

    vec3.transformQuat(_v3_tmp, _right, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.right, _v3_tmp);

    vec3.transformQuat(_v3_tmp, _up, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.up, _v3_tmp);

    vec3.transformQuat(_v3_tmp, _forward, rotation);
    vec3.scaleAndAdd(_v3_tmp, pos, _v3_tmp, scale),
    vec3.copy(axes.forward, _v3_tmp);

    axes.duration = duration;
    axes.depthTest = depthTest;
    axes.timer = 0.0;
    axes.is2D = is2D;
  }

  addSphere(pos, radius, color, duration = 0.0, depthTest = true) {
    let primitive = this._primitives.add();
    primitive.model.setInputAssembler(this._sphereIA);
    primitive.model._node.setLocalPos(pos);
    primitive.model._node.setLocalScale(radius, radius, radius);

    primitive.duration = duration;
    primitive.depthTest = depthTest;
    primitive.timer = 0.0;

    this._app.scene.addModel(primitive.model);
  }
}