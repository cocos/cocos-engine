/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { legacyCC } from '../../global-exports';
import { Vec3 } from '../../math';
import { Ambient } from './ambient';
import { Light, LightType } from './light';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();

/**
 * @en Render the abstraction of light in the scene, which is a fill light source in the scene. Non main light source,
 * each scene is allowed to have multiple fill light sources without shadows.
 * @zh 渲染场景中的光的抽象，这是场景中的补充光源。非主光源，每个场景允许有多个补充光源，不包含阴影。
 */
export class RangedDirectionalLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _illuminanceHDR: number = Ambient.SUN_ILLUM;
    protected _illuminanceLDR = 1.0;

    /**
     * @en The direction vector of the light
     * @zh 光源的方向
     */
    set direction (dir: Vec3) {
        Vec3.normalize(this._dir, dir);
    }
    get direction (): Vec3 {
        return this._dir;
    }

    /**
     * @en The illuminance of the light in Lux(lx)
     * @zh 光源的辐照度，单位是 Lux(lx)
     */
    get illuminance (): number {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            return this._illuminanceHDR;
        } else {
            return this._illuminanceLDR;
        }
    }
    set illuminance (value: number) {
        const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
        if (isHDR) {
            this.illuminanceHDR = value;
        } else {
            this.illuminanceLDR = value;
        }
    }

    /**
     * @en The illuminance of the light in HDR mode
     * @zh HDR 模式下光源的辐照度
     */
    get illuminanceHDR () {
        return this._illuminanceHDR;
    }
    set illuminanceHDR (value: number) {
        this._illuminanceHDR = value;
    }

    /**
     * @en The illuminance of the light in LDR mode
     * @zh LDR 模式下光源的辐照度
     */
    get illuminanceLDR () {
        return this._illuminanceLDR;
    }
    set illuminanceLDR (value: number) {
        this._illuminanceLDR = value;
    }

    constructor () {
        super();
        this._type = LightType.RANGEDDIR;
    }

    public initialize () {
        super.initialize();

        this.illuminance = Ambient.SUN_ILLUM;
        this.direction = new Vec3(1.0, -1.0, -1.0);
    }

    /**
     * @en Update the direction
     * @zh 更新方向
     */
    public update () {
        if (this._node && this._node.hasChangedFlags) {
            this.direction = Vec3.transformQuat(_v3, _forward, this._node.worldRotation);
        }
    }
}
