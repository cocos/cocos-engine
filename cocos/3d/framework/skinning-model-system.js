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
import { System } from '../ecs';
import { FixedArray } from '../memop';
import { _decorator } from '../../core/data/index';
const { ccclass, property } = _decorator;

/**
 * !#en Skinning Model Component Management System
 * 
 * !#ch 皮肤模型管理系统
 * @class SkinningModelSystem
 * @extends System
 */
@ccclass('cc.SkinningModelSystem')
export default class SkinningModelSystem extends System {
  constructor() {
    super();

    this._comps = new FixedArray(200);
  }

  /**
   * !# Add skinning model component
   * 
   * !#ch 添加需要统一管理的皮肤模型
   * @param {SkinningModelComponent} comp 
   */
  add(comp) {
    this._comps.push(comp);
  }

  /**
   * !# Add skinning model component
   * 
   * !#ch 添加需要统一管理的皮肤模型
   * @param {SkinningModelComponent} comp 
   */
  remove(comp) {
    this._comps.fastRemove(this._comps.indexOf(comp));
  }

//   update() {
//     for (let i = 0; i < this._comps.length; ++i) {
//       let comp = this._comps.data[i];
//       if (comp.enabled === false) {
//         continue;
//       }

//       comp._updateMatrices();
//     }
//   }
}
