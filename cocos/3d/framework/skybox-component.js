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
import renderer from '../../renderer/index';
import { box } from '../primitive/index';
import Material from '../assets/material';
import { ccclass, property, menu } from '../../core/data/class-decorator';
import TextureCube from '../assets/texture-cube';
import Component from '../../components/CCComponent';

/**
 * !#en The Skybox Component
 *
 * !#ch 天空盒组件
 * @class SkyboxComponent
 * @extends Component
 */
@ccclass('cc.SkyboxComponent')
@menu('Components/SkyboxComponent')
export default class SkyboxComponent extends Component {

  @property
  _cubemap = null;
  @property
  _rgbeTexture = false;

  @property({
    type: TextureCube,
    displayName: 'Cubemap'
  })
  get cubemap() {
    return this._cubemap;
  }

  set cubemap(val) {
    this._cubemap = val;
    this._updateMaterialParams();
  }

  @property({
    type: Boolean,
    displayName: 'RGBE Texture'
  })
  set rgbeTexture(v) {
    this._rgbeTexture = v;
    this._updateMaterialParams();
  }
  get rgbeTexture() {
    return this._rgbeTexture;
  }

  constructor() {
    super();

    this._model = new renderer.Model();
    this._attachedCamera = null;
  }

  onLoad() {
    this._model.setNode(this.node);

    let ia = renderer.createIA(cc.game._renderContext, box(2, 2, 2, {
      widthSegments: 1,
      heightSegments: 1,
      lengthSegments: 1,
    }));
    this._model.setInputAssembler(ia);

    if (!this._material) {
      this._material = new Material();
      let skyboxEffect = cc.EffectAsset.get('builtin-effect-skybox');
      if (skyboxEffect) this._material.effectAsset = skyboxEffect;
    }

    this._updateMaterialParams();
    this._model.setEffect(this._material.effect);
  }

  onEnable() {
    if (this.node != null) {
      let cameraComponent = this.getComponent(cc.CameraComponent);
      if (cameraComponent != null && (cameraComponent._clearFlags & renderer.CLEAR_SKYBOX)) {
        this._attachedCamera = cameraComponent._camera;
        this._attachedCamera._clearModel = this._model;
      }
    }
  }

  onDisable() {
    if (this._attachedCamera != null) {
      this._attachedCamera._clearModel = null;
      this._attachedCamera = null;
    }
  }

  _updateMaterialParams() {
    if (this._material === null || this._material === undefined) {
      return;
    }
    if (this._cubemap !== null && this._cubemap !== undefined) {
      this._material.setProperty('cubeMap', this._cubemap);
    }
    this._material.define('USE_RGBE_CUBEMAP', this._rgbeTexture);
  }
}
