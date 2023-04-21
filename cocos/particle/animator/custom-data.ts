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

import { Enum, Mat4, pseudoRandom } from '../../core';
import { ccclass, displayOrder, serializable, type, visible } from '../../core/data/decorators';
import { Particle, ParticleModuleBase, PARTICLE_MODULE_NAME } from '../particle';
import { ParticleSystem } from '../particle-system';
import CurveRange from './curve-range';
import GradientRange from './gradient-range';

export const DataType = Enum({
    Vector: 0,
    Color: 1,
});

const CUSTOM_RND_SEED = 1918318;

@ccclass('cc.CustomDataModule')
export class CustomDataModule extends ParticleModuleBase {
    @serializable
    _enable = false;
    /**
     * @zh 是否启用。
     */
    @displayOrder(0)
    public get enable () {
        return this._enable;
    }

    public set enable (val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
        this.target.setUseCustom(this._enable);
        this.target.updateRenderMode();
    }

    @type(DataType)
    @serializable
    @displayOrder(1)
    public dataType1 = DataType.Color;

    @type(DataType)
    @serializable
    @displayOrder(2)
    public dataType2 = DataType.Color;

    @type(GradientRange)
    @serializable
    @displayOrder(3)
    @visible(function (this: CustomDataModule): boolean { return this.dataType1 === DataType.Color; })
    public data1Color: GradientRange = new GradientRange();

    @type(GradientRange)
    @serializable
    @displayOrder(4)
    @visible(function (this: CustomDataModule): boolean { return this.dataType2 === DataType.Color; })
    public data2Color: GradientRange = new GradientRange();

    @type(CurveRange)
    @serializable
    @displayOrder(5)
    @visible(function (this: CustomDataModule): boolean { return this.dataType1 === DataType.Vector; })
    public data1X: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(6)
    @visible(function (this: CustomDataModule): boolean { return this.dataType1 === DataType.Vector; })
    public data1Y: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(7)
    @visible(function (this: CustomDataModule): boolean { return this.dataType1 === DataType.Vector; })
    public data1Z: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(8)
    @visible(function (this: CustomDataModule): boolean { return this.dataType1 === DataType.Vector; })
    public data1W: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(9)
    @visible(function (this: CustomDataModule): boolean { return this.dataType2 === DataType.Vector; })
    public data2X: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(10)
    @visible(function (this: CustomDataModule): boolean { return this.dataType2 === DataType.Vector; })
    public data2Y: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(11)
    @visible(function (this: CustomDataModule): boolean { return this.dataType2 === DataType.Vector; })
    public data2Z: CurveRange = new CurveRange();

    @type(CurveRange)
    @serializable
    @displayOrder(12)
    @visible(function (this: CustomDataModule): boolean { return this.dataType2 === DataType.Vector; })
    public data2W: CurveRange = new CurveRange();

    public name = PARTICLE_MODULE_NAME.CUSTOM;

    constructor () {
        super();
        this.needUpdate = true;
    }

    public update (ps: ParticleSystem, space: number, worldTransform: Mat4) {
        this.data1Color.bake();
        this.data1X.bake();
        this.data1Y.bake();
        this.data1Z.bake();
        this.data1W.bake();
        this.data2Color.bake();
        this.data2X.bake();
        this.data2Y.bake();
        this.data2Z.bake();
        this.data2W.bake();
    }

    public animate (p: Particle, dt: number) {
        const normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        if (this.dataType1 === DataType.Color) {
            const randomColor1 = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 1));
            const color1 = this.data1Color.evaluate(normalizedTime, randomColor1);
            p.custom1.set(color1.r / 255.0, color1.g / 255.0, color1.b / 255.0, color1.a / 255.0);
        } else {
            const randomX = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 3));
            const randomY = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 4));
            const randomZ = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 5));
            const randomW = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 6));
            const x = this.data1X.evaluate(normalizedTime, randomX);
            const y = this.data1Y.evaluate(normalizedTime, randomY);
            const z = this.data1Z.evaluate(normalizedTime, randomZ);
            const w = this.data1W.evaluate(normalizedTime, randomW);
            p.custom1.set(x, y, z, w);
        }

        if (this.dataType2 === DataType.Color) {
            const randomColor2 = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 2));
            const color2 = this.data2Color.evaluate(normalizedTime, randomColor2);
            p.custom2.set(color2.r / 255.0, color2.g / 255.0, color2.b / 255.0, color2.a / 255.0);
        } else {
            const randomX = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 7));
            const randomY = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 8));
            const randomZ = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 9));
            const randomW = pseudoRandom(p.randomSeed ^ (CUSTOM_RND_SEED + 10));
            const x = this.data2X.evaluate(normalizedTime, randomX);
            const y = this.data2Y.evaluate(normalizedTime, randomY);
            const z = this.data2Z.evaluate(normalizedTime, randomZ);
            const w = this.data2W.evaluate(normalizedTime, randomW);
            p.custom2.set(x, y, z, w);
        }
    }
}
