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
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { DirectionalLight } from '../../renderer/scene/directional-light';
import { LightType } from '../../renderer/scene/light';
import { RenderScene } from '../../renderer/scene/render-scene';
import { LightComponent } from './light-component';

@ccclass('cc.DirectionalLightComponent')
@menu('Components/DirectionalLightComponent')
@executeInEditMode
export class DirectionalLightComponent extends LightComponent {

    @property
    protected _illuminance = 65000;

    protected _type = LightType.DIRECTIONAL;
    protected _light: DirectionalLight | null = null;

    /**
     * !#en The light source intensity
     *
     * !#ch 光源强度
     */
    @property({ unit: 'lx' })
    get illuminance () {
        return this._illuminance;
    }
    set illuminance (val) {
        this._illuminance = val;
        if (this._light) { this._light.illuminance = this._illuminance; }
    }

    protected _createLight (scene?: RenderScene) {
        if (!this.node.scene) { return; }
        if (!scene) { scene = this._getRenderScene(); }
        if (scene.mainLight.node.activeInHierarchy) {
            console.warn('there can be only one directional(main) light.');
            return;
        }
        this._light = scene.mainLight;
        this.illuminance = this._illuminance;
        super._createLight(scene);
    }

    protected _destroyLight (scene?: RenderScene) {
        if (!this.node.scene || !this._light) { return; }
        this._light.enabled = false;
        if (!scene) { scene = this._getRenderScene(); }
        this._light.node = scene.defaultMainLightNode;
        super._destroyLight(scene);
    }
}
