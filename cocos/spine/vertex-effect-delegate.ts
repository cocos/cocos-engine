/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import spine from './lib/spine-core.js';

/**
 * @en
 * The delegate of spine vertex effect.
 * @zh
 * Spine 顶点动画代理。
 * @class VertexEffectDelegate
 */
export class VertexEffectDelegate {
    /**
     * @internal
     * @deprecated Since v3.7.2, this is an engine private variable that will be removed in the future.
     */
    name = 'sp.VertexEffectDelegate';
    /**
     * @en Spine vertex effect object instance.
     * @zh Spine 顶点特效对象实例。
     */
    _vertexEffect: spine.VertexEffect;
    private _interpolation: spine.Interpolation;
    private _effectType: string;

    constructor () {
        this._vertexEffect = null!;
        this._interpolation = null!;
        this._effectType = 'none';
    }

    /**
     * @en Clears vertex effect.
     * @zh 清空顶点特效。
     */
    clear (): void {
        this._vertexEffect = null!;
        this._interpolation = null!;
        this._effectType = 'none';
    }

    /**
     * @en Inits delegate with jitter effect.
     * @zh 设置顶点抖动特效。
     * @param {Number} jitterX
     * @param {Number} jitterY
     * @return {spine.VertexEffect} @en Return a vertex effect type of jitter. @zh 返回一个 jitter 类型的顶点特效对象实例。
     */
    initJitter (jitterX: number, jitterY: number): spine.VertexEffect {
        this._effectType = 'jitter';
        this._vertexEffect = new spine.JitterEffect(jitterX, jitterY);
        return this._vertexEffect;
    }

    /**
     * @en Inits delegate with swirl effect.
     * @zh 设置顶点漩涡特效。
     * @method initSwirlWithPow
     * @param {Number} radius
     * @param {Number} power
     * @return {sp.spine.JitterEffect} @en Return a vertex effect type of swirl. @zh 返回一个 swirl 类型的顶点特效对象实例。
     */
    initSwirlWithPow (radius: number, power: number): spine.VertexEffect {
        this._effectType = 'swirl';
        this._interpolation = new spine.Pow(power);
        this._vertexEffect = new spine.SwirlEffect(radius, this._interpolation);
        return this._vertexEffect;
    }

    /**
     * @en Inits delegate with swirl effect.
     * @zh 设置顶点漩涡特效。
     * @method initSwirlWithPowOut
     * @param {Number} radius
     * @param {Number} power
     * @return {sp.spine.SwirlEffect} @en Return a vertex effect type of swirl. @zh 返回一个 swirl 类型的顶点特效对象实例。
     */
    initSwirlWithPowOut (radius: number, power: number): spine.VertexEffect {
        this._effectType = 'swirl';
        this._interpolation = new spine.PowOut(power);
        this._vertexEffect = new spine.SwirlEffect(radius, this._interpolation);
        return this._vertexEffect;
    }

    /**
     * @en Gets jitter vertex effect.
     * @zh 获取顶点抖动特效。
     * @method getJitterVertexEffect
     * @return {sp.spine.JitterEffect}
     */
    getJitterVertexEffect (): spine.VertexEffect {
        return this._vertexEffect;
    }

    /**
     * @en Gets swirl vertex effect.
     * @zh 获取顶点漩涡特效。
     * @method getSwirlVertexEffect
     * @return {sp.spine.SwirlEffect}
     */
    getSwirlVertexEffect (): spine.VertexEffect {
        return this._vertexEffect;
    }

    /**
     * @en Gets vertex effect.
     * @zh 获取顶点特效。
     * @method getVertexEffect
     * @return {sp.spine.JitterEffect|sp.spine.SwirlEffect}
     */
    getVertexEffect (): spine.VertexEffect {
        return this._vertexEffect;
    }

    /**
     * @en Gets effect type.
     * @zh 获取特效类型。
     * @method getEffectType
     * @return {String}
     */
    getEffectType (): string {
        return this._effectType;
    }
}
