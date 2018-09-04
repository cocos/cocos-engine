'use strict';

import { Node } from '../scene-graph';
import { vec3, mat3, quat } from '../vmath';

const damping = 10.0;
const moveSpeed = 10.0;

const v3_f = vec3.create(0, 0, -1);
const v3_r = vec3.create(1, 0, 0);
const v3_u = vec3.create(0, 1, 0);

let rot3x3 = mat3.create();

let front = vec3.create(0, 0, 0);
let right = vec3.create(0, 0, 0);
let up = vec3.create(0, 1, 0);
let front2 = vec3.create(0, 0, 0);
let right2 = vec3.create(0, 0, 0);

export default class OrbitCamera {
  constructor(input) {
    this._input = input;
    this._node = new Node('debug-camera');
    this._node.setLocalPos(10, 10, 10);
    this._node.lookAt(vec3.create(0, 0, 0));

    this._df = 0;
    this._dr = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;
    this._rotX = 0;
    this._rotY = 0;

    this._curRot = quat.create();
    this._destRot = quat.create();

    this._curEye = vec3.create(0, 0, 0);
    this._destEye = vec3.create(0, 0, 0);

    this._node.getWorldRot(this._curRot);
    this._destRot = quat.clone(this._curRot);

    this._node.getWorldPos(this._curEye);
    this._destEye = vec3.clone(this._curEye);
  }

  reset() {
    this._df = 0;
    this._dr = 0;
    this._du = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;
    this._rotX = 0;
    this._rotY = 0;

    this._node.getWorldRot(this._curRot);
    this._destRot = quat.clone(this._curRot);

    this._node.getWorldPos(this._curEye);
    this._destEye = vec3.clone(this._curEye);
  }

  tick(dt) {
    let input = this._input;

    this._handleMouseAndKeyboard();

    if (input.hasTouch) {
      this._handleTouches();
    }
    this._lerp(dt);
  }

  _handleMouseAndKeyboard() {
    let input = this._input;

    this._df = 0;
    this._dr = 0;
    this._du = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;
    this._rotX = 0;
    this._rotY = 0;

    if (input.mousepress('left') && input.mousepress('right')) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._panX = dx;
      this._panY = dy;

    } else if (input.mousepress('left')) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._rotY = -dx * 0.002;
      this._panZ = dy;

    } else if (input.mousepress('right')) {
      let dx = input.mouseDeltaX;
      let dy = input.mouseDeltaY;

      this._rotY = -dx * 0.002;
      this._rotX = dy * 0.002;
    }

    if (input.keypress('w')) {
      this._df += 1;
    }
    if (input.keypress('s')) {
      this._df -= 1;
    }
    if (input.keypress('a')) {
      this._dr -= 1;
    }
    if (input.keypress('d')) {
      this._dr += 1;
    }
    if (input.keypress('q')) {
      this._du -= 1;
    }
    if (input.keypress('e')) {
      this._du += 1;
    }

    if (input.mouseScrollY) {
      this._df -= input.mouseScrollY * 0.05;
    }
  }

  _handleTouches() {
    let input = this._input;

    this._df = 0;
    this._dr = 0;
    this._panX = 0;
    this._panY = 0;
    this._panZ = 0;
    this._rotX = 0;
    this._rotY = 0;

    if (input.touchCount === 1) {
      let touch = input.getTouchInfo(0);
      let dx = touch.dx;
      let dy = touch.dy;

      if (touch.prevX === 0 && touch.prevY === 0) {
        dx = 0;
        dy = 0;
      }

      this._rotY = -dx * 0.002;
      this._rotX = dy * 0.002;

    } else if (input.touchCount === 2) {
      let touch0 = input.getTouchInfo(0);
      let touch1 = input.getTouchInfo(1);
      let lenCur = Math.sqrt((touch0.x - touch1.x) * (touch0.x - touch1.x) + (touch0.y - touch1.y) * (touch0.y - touch1.y));
      let lenPrev = Math.sqrt((touch0.prevX - touch1.prevX) * (touch0.prevX - touch1.prevX) + (touch0.prevY - touch1.prevY) * (touch0.prevY - touch1.prevY));
      let dLen = Math.abs(lenCur - lenPrev);

      if ((touch0.dx != 0 || touch0.dy != 0) && (touch1.dx != 0 || touch1.dy != 0) && dLen < 100) {
        if (lenCur > lenPrev) {
          this._df += dLen;
        } else {
          this._df -= dLen;
        }
      }

      if (touch1.phase === 2 || touch0.phase === 2) {
        input.touchCount = 2;
      }

    } else if (input.touchCount === 3) {
      let touch0 = input.getTouchInfo(0);
      let dx = touch0.dx;
      let dy = touch0.dy;
      if (dx < 100 && dy < 100) {
        this._rotY = -dx * 0.002;
        this._panZ = -dy;
      }
    }
  }

  _lerp(dt) {
    const panX = this._panX;
    const panY = this._panY;
    const panZ = this._panZ;
    let eye = this._destEye;
    let rot = this._destRot;

    // calculate curRot
    quat.rotateX(rot, rot, this._rotX);
    quat.rotateAround(rot, rot, v3_u, this._rotY);
    quat.slerp(this._curRot, this._curRot, rot, dt * damping);

    // calculate curEye
    mat3.fromQuat(rot3x3, this._curRot);

    vec3.transformMat3(front, v3_f, rot3x3);
    vec3.transformMat3(right, v3_r, rot3x3);

    //
    if (this._df !== 0) {
      vec3.scaleAndAdd(eye, eye, front, this._df * dt * moveSpeed);
    }

    if (this._dr !== 0) {
      vec3.scaleAndAdd(eye, eye, right, this._dr * dt * moveSpeed);
    }

    if (this._du !== 0) {
      vec3.scaleAndAdd(eye, eye, up, this._du * dt * moveSpeed);
    }

    if (panZ !== 0) {
      vec3.copy(front2, front);
      front2.y = 0.0;
      vec3.normalize(front2, front2);
      vec3.scaleAndAdd(eye, eye, front2, panZ * dt * moveSpeed);
    }

    if (panX !== 0) {
      vec3.copy(right2, right);
      right2.y = 0.0;
      vec3.normalize(right2, right2);
      vec3.scaleAndAdd(eye, eye, right2, panX * dt * moveSpeed);
    }

    if (panY !== 0) {
      vec3.scaleAndAdd(eye, eye, v3_u, panY * dt * moveSpeed);
    }

    vec3.lerp(this._curEye, this._curEye, eye, dt * damping);

    //
    this._node.setWorldPos(this._curEye);
    this._node.setWorldRot(this._curRot);
  }

}