import renderer from '../renderer';
import OrbitCamera from './orbit-camera';
import DrawMng from './draw-mng';
import { createGrid } from './utils';
import Input from '../input';
import utils from '../misc/utils';

export default class Debugger {
  /**
   * @param {App} app
   */
  constructor(app) {
    this._state = 'sleep';
    this._app = app;
    this._drawMng = new DrawMng(app);
    this._debugInput = new Input(app.view.canvas, {
      lock: Input.LOCK_WHEN_PRESSED,
      enabled: false,
    });

    // debug camera
    this._orbit = new OrbitCamera(this._debugInput);
    this._camera = new renderer.Camera();
    this._camera.setColor(0.3, 0.3, 0.3, 1);
    this._camera.setNode(this._orbit._node);
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);

    // grid
    this._grid = createGrid(app, 100, 100, 100);
  }

  start() {
    if (this._state !== 'sleep') {
      return;
    }

    this._state = 'enter';
  }

  stop() {
    if (this._state === 'sleep') {
      return;
    }

    this._state = 'fade2normal';
  }

  tick() {
    if (this._state === 'sleep') {
      return;
    }

    let name = `_${this._state}`;
    let fn = this[name];
    if (!fn) {
      console.warn(`Unknown state ${this._state}`);
      return;
    }

    this[name]();
  }

  postTick() {
    // update draw-mng before rendering after all systems ticked
    this._drawMng.tick();
  }

  // ====================
  // debug draw
  // ====================

  drawLine(start, end, color, duration, depthTest) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addLine(start, end, color, duration, depthTest, false);
  }

  drawLine2D(start, end, color, duration) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addLine(start, end, color, duration, false, true);
  }

  drawRect(x, y, w, h, color, duration) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addRect2D(x, y, w, h, color, duration);
  }

  drawAxes(pos, rotation, scale, duration, depthTest) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addAxes(pos, rotation, scale, duration, depthTest, false);
  }

  drawAxes2D(pos, rotation, scale, duration) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addAxes(pos, rotation, scale, duration, false, true);
  }

  drawSphere(pos, radius, color, duration, depthTest) {
    if ( this._state !== 'debug') {
      return;
    }
    this._drawMng.addSphere(pos, radius, color, duration, depthTest);
  }

  // ====================
  // internal states
  // ====================

  _enter() {
    let mainCam = null;
    utils.walk(this._app.activeLevel, ent => {
      mainCam = ent.getComp('Camera');
      if (mainCam) {
        return false;
      }
      return true;
    });

    if (!mainCam) {
      return;
    }

    this._app.input.enabled = false;
    this._debugInput.enabled = true;

    // setup debug camera
    this._orbit._node.setLocalPos(mainCam._entity._lpos);
    this._orbit._node.setLocalRot(mainCam._entity._lrot);
    this._orbit._node.setLocalScale(mainCam._entity._lscale);
    this._orbit.reset();
    this._app.scene.setDebugCamera(this._camera);

    //
    this._app.scene.addModel(this._grid);

    //
    this._drawMng.start();

    //
    this._state = 'fade2debug';
  }

  _fade2debug() {
    this._state = 'debug';
  }

  _debug() {
    let dt = this._app.deltaTime;

    // update orbit camera
    this._orbit.tick(dt);
    this._debugInput.reset();
  }

  _fade2normal() {
    this._state = 'exit';
  }

  _exit() {
    this._debugInput.enabled = false;
    this._app.input.enabled = true;

    this._app.scene.removeModel(this._grid);

    // restore runtime states
    this._app.scene.setDebugCamera(null);

    //
    this._drawMng.stop();

    //
    this._state = 'sleep';
  }
}