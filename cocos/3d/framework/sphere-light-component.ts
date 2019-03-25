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
import { LightType, nt2lm } from '../../renderer/scene/light';
import { RenderScene } from '../../renderer/scene/render-scene';
import { SphereLight } from '../../renderer/scene/sphere-light';
import { LightComponent } from './light-component';

@ccclass('cc.SphereLightComponent')
@menu('Components/SphereLightComponent')
@executeInEditMode
export class SphereLightComponent extends LightComponent {

    @property
    protected _size = 0.15;
    @property
    protected _luminance = 1700 / nt2lm(this._size);
    @property
    protected _useLuminance = false;
    @property
    protected _range = 1;

    protected _type = LightType.SPHERE;
    protected _light: SphereLight | null = null;

    @property
    get luminousPower () {
        return this._luminance * nt2lm(this._size);
    }
    set luminousPower (val) {
        if (this._useLuminance) { return; }
        this._luminance = val / nt2lm(this._size);
        if (this._light) { this._light.setLuminousPower(val, this._size); }
    }

    @property
    get luminance () {
        return this._luminance;
    }
    set luminance (val) {
        if (!this._useLuminance) { return; }
        this._luminance = val;
        if (this._light) { this._light.luminance = val; }
    }

    @property
    get useLuminance () {
        return this._useLuminance;
    }
    set useLuminance (val) {
        this._useLuminance = val;
    }

    /**
     * !#en The light size, used for spot and point light
     *
     * !#ch 针对聚光灯和点光源设置光源大小
     */
    @property
    get size () {
        return this._size;
    }
    set size (val) {
        this._size = val;
        if (this._light) { this._light.size = val; }
    }

    /**
     * !#en The light range, used for spot and point light
     *
     * !#ch 针对聚光灯和点光源设置光源范围
     */
    @property
    get range () {
        return this._range;
    }
    set range (val) {
        this._range = val;
        if (this._light) { this._light.range = val; }
    }

    protected _createLight (scene?: RenderScene) {
        if (!this.node.scene) { return; }
        if (!scene) { scene = this._getRenderScene(); }
        if (this._light && scene.sphereLights.find((c) => c === this._light)) { return; }
        this._light = scene.createSphereLight(this.name, this.node);
        if (!this._light) {
            console.warn('we don\'t support this many lights in forward pipeline.');
            return;
        }
        this._light.luminance = this._luminance;
        this.size = this._size;
        this.range = this._range;
        super._createLight(scene);
    }

    protected _destroyLight (scene?: RenderScene) {
        if (!this.node.scene || !this._light) { return; }
        if (!scene) { scene = this._getRenderScene(); }
        scene.destroySphereLight(this._light);
        super._destroyLight(scene);
    }
}
