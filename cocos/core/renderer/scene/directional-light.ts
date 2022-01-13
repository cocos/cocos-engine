/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

export class DirectionalLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _illuminanceHDR: number = Ambient.SUN_ILLUM;
    protected _illuminanceLDR = 1.0;

    set direction (dir: Vec3) {
        Vec3.normalize(this._dir, dir);
    }

    get direction (): Vec3 {
        return this._dir;
    }

    // in Lux(lx)
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

    get illuminanceHDR () {
        return this._illuminanceHDR;
    }
    set illuminanceHDR (value: number) {
        this._illuminanceHDR = value;
    }

    get illuminanceLDR () {
        return this._illuminanceLDR;
    }
    set illuminanceLDR (value: number) {
        this._illuminanceLDR = value;
    }

    constructor () {
        super();
        this._type = LightType.DIRECTIONAL;
    }

    public initialize () {
        super.initialize();

        this.illuminance = Ambient.SUN_ILLUM;
        this.direction = new Vec3(1.0, -1.0, -1.0);
    }

    public update () {
        if (this._node && this._node.hasChangedFlags) {
            this.direction = Vec3.transformQuat(_v3, _forward, this._node.worldRotation);
        }
    }
}
