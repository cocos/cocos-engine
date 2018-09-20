/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import System from '../ecs/system';
import { FixedArray } from '../memop';
/**
 * @typedef {import('./animation-component').default} AnimationComponent
 */

export default class AnimationSystem extends System {
  constructor() {
    super();

    this._anims = new FixedArray(200);
  }

  add(comp) {
    this._anims.push(comp);
  }

  remove(comp) {
    this._anims.fastRemove(this._anims.indexOf(comp));
  }

//   update() {
//     for (let i = 0; i < this._anims.length; ++i) {
//       let anim = this._anims.data[i];
//       if (!anim.enabled) {
//         continue;
//       }
//       if (!anim.skeleton) {
//         // console.error(`Animation component depends on skinning model component.`);
//         let skeleton = findSkeleton(anim._entity);
//         anim.skeleton = skeleton;
//       }
//       if (anim.skeleton) {
//         anim._animCtrl.tick(this._app.deltaTime);
//       }
//     }
//   }
}
