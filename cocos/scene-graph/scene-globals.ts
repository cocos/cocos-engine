/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
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

import { TextureCube } from '../3d/assets/texture-cube';
import { ccclass, property } from '../core/data/class-decorator';
import { Color } from '../core/value-types';
import { color4 } from '../core/vmath';
import { Ambient } from '../renderer/scene/ambient';
import { RenderScene } from '../renderer/scene/render-scene';
import { Skybox } from '../renderer/scene/skybox';

@ccclass('cc.AmbientInfo')
export class AmbientInfo {
    @property
    protected _skyColor = new Color(51, 128, 204, 1.0);
    @property
    protected _skyIllum = 1.0;
    @property
    protected _groundAlbedo = new Color(51, 51, 51, 255);

    protected _resource: Ambient | null = null;

    @property({ type: Color })
    set skyColor (val: Color) {
        this._skyColor = val;
        if (this._resource) { color4.array(this._resource.skyColor, this.skyColor); }
    }
    get skyColor () {
        return this._skyColor;
    }

    @property({ type: Number })
    set skyIllum (val: number) {
        this._skyIllum = val;
        if (this._resource) { this._resource.skyIllum = this.skyIllum; }
    }
    get skyIllum () {
        return this._skyIllum;
    }

    @property({ type: Color })
    set groundAlbedo (val: Color) {
        this._groundAlbedo = val;
        if (this._resource) { color4.array(this._resource.groundAlbedo, this.groundAlbedo); }
    }
    get groundAlbedo () {
        return this._groundAlbedo;
    }

    set renderScene (rs: RenderScene) {
        this._resource = rs.ambient;
        this.skyColor = this._skyColor;
        this.skyIllum = this._skyIllum;
        this.groundAlbedo = this._groundAlbedo;
    }
}
cc.AmbientInfo = AmbientInfo;

@ccclass('cc.SkyboxInfo')
export class SkyboxInfo {
    @property
    protected _cubemap: TextureCube | null = null;
    @property
    protected _isRGBE: boolean = false;
    @property
    protected _enabled: boolean = false;

    protected _resource: Skybox | null = null;

    @property({ type: Boolean })
    set enabled (val) {
        this._enabled = val;
        if (this._resource) { this._resource.enabled = this._enabled; }
    }
    get enabled () {
        return this._enabled;
    }

    @property({ type: TextureCube })
    set cubemap (val) {
        this._cubemap = val;
        if (this._resource) { this._resource.cubemap = this._cubemap; }
    }
    get cubemap () {
        return this._cubemap;
    }

    @property({ type: Boolean })
    set isRGBE (val) {
        this._isRGBE = val;
        if (this._resource) { this._resource.isRGBE = this._isRGBE; }
    }
    get isRGBE () {
        return this._isRGBE;
    }

    set renderScene (val: RenderScene) {
        this._resource = val.skybox;
        this.isRGBE = this._isRGBE;
        this.cubemap = this._cubemap;
        this.enabled = this._enabled;
    }
}
cc.SkyboxInfo = SkyboxInfo;

@ccclass('cc.SceneGlobals')
export class SceneGlobals {
    @property({ type: AmbientInfo })
    public ambient = new AmbientInfo();
    @property({ type: SkyboxInfo })
    public skybox = new SkyboxInfo();

    set renderScene (rs: RenderScene) {
        this.ambient.renderScene = rs;
        this.skybox.renderScene = rs;
    }
}
cc.SceneGlobals = SceneGlobals;
