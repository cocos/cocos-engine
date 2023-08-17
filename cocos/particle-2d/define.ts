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

import { Enum } from '../core';

/**
 * @en The Particle emitter lives forever.
 * @zh 表示发射器永久存在
 * @static
 * @readonly
 */
export const DURATION_INFINITY = -1;

/**
 * @en The starting size of the particle is equal to the ending size.
 * @zh 表示粒子的起始大小等于结束大小。
 * @static
 * @readonly
 */
export const START_SIZE_EQUAL_TO_END_SIZE = -1;

/**
 * @en The starting radius of the particle is equal to the ending radius.
 * @zh 表示粒子的起始半径等于结束半径。
 * @static
 * @readonly
 */
export const START_RADIUS_EQUAL_TO_END_RADIUS = -1;

/**
 * @en Enum for emitter modes
 * @zh 发射模式
 * @enum ParticleSystem.EmitterMode
 */
export const EmitterMode = Enum({
    /**
     * @en Uses gravity, speed, radial and tangential acceleration.
     * @zh 重力模式，模拟重力，可让粒子围绕一个中心点移近或移远。
     */
    GRAVITY: 0,
    /**
     * @en Uses radius movement + rotation.
     * @zh 半径模式，可以使粒子以圆圈方式旋转，它也可以创造螺旋效果让粒子急速前进或后退。
     */
    RADIUS: 1,
});

/**
 * @en Enum for particles movement type.
 * @zh 粒子位置类型
 * @enum ParticleSystem.PositionType
 */
export const PositionType = Enum({
    /**
     * @en
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     * @zh
     * 自由模式，相对于世界坐标，不会随粒子节点移动而移动。（可产生火焰、蒸汽等效果）
     */
    FREE: 0,

    /**
     * @en
     * In the relative mode, the particle will move with the parent node, but not with the node where the particle is.
     * For example, the coffee in the cup is steaming. Then the steam moves (forward) with the train, rather than moves with the cup.
     * @zh
     * 相对模式，粒子会跟随父节点移动，但不跟随粒子所在节点移动，例如在一列行进火车中，杯中的咖啡飘起雾气，
     * 杯子移动，雾气整体并不会随着杯子移动，但从火车整体的角度来看，雾气整体会随着火车移动。
     */
    RELATIVE: 1,

    /**
     * @en
     * Living particles are attached to the emitter and are translated along with it.
     * @zh
     * 整组模式，粒子跟随发射器移动。（不会发生拖尾）
     */
    GROUPED: 2,
});
