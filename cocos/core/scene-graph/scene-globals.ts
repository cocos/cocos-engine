/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category scene-graph
 */

import { TextureCube } from '../assets/texture-cube';
import { ccclass, property } from '../data/class-decorator';
import { CCBoolean } from '../data/utils/attribute';
import { legacyCC } from '../global-exports';

/**
 * @en Skybox related information
 * @zh 天空盒相关信息
 */
@ccclass('cc.SkyboxInfo')
export class SkyboxInfo {
    @property(TextureCube)
    protected _envmap: TextureCube | null = null;
    @property
    protected _isRGBE = false;
    @property
    protected _enabled = false;
    @property
    protected _useIBL = false;

    /**
     * @en Whether activate skybox in the scene
     * @zh 是否启用天空盒？
     */
    @property({ type: CCBoolean })
    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @en Whether use environment lighting
     * @zh 是否启用环境光照？
     */
    @property({ type: CCBoolean })
    set useIBL (val) {
        this._useIBL = val;
    }
    get useIBL () {
        return this._useIBL;
    }

    /**
     * @en The texture cube used for the skybox
     * @zh 使用的立方体贴图
     */
    @property({ type: TextureCube })
    set envmap (val) {
        this._envmap = val;
    }
    get envmap () {
        return this._envmap;
    }

    /**
     * @en Whether enable RGBE data support in skybox shader
     * @zh 是否需要开启 shader 内的 RGBE 数据支持？
     */
    @property({ type: CCBoolean })
    set isRGBE (val) {
        this._isRGBE = val;
    }
    get isRGBE () {
        return this._isRGBE;
    }
}
legacyCC.SkyboxInfo = SkyboxInfo;
