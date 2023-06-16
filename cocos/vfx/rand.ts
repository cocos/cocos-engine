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

import { Vec2, Vec3 } from '../core';

export function Rand1 (seed1: number, seed2: number, seed3: number) {
    let x = ((Math.imul(seed1, 1664525) >>> 0) + 1013904223) >>> 0;
    let y = ((Math.imul(seed2, 1664525) >>> 0) + 1013904223) >>> 0;
    let z = ((Math.imul(seed3, 1664525) >>> 0) + 1013904223) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;
    y = ((Math.imul(x, z) >>> 0) + y) >>> 0;
    z = ((Math.imul(x, y) >>> 0) + z) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;

    return (x >>> 8) / 16777216.0;
}

export function Rand2 (out: Vec2, seed1: number, seed2: number, seed3: number) {
    let x = ((Math.imul(seed1, 1664525) >>> 0) + 1013904223) >>> 0;
    let y = ((Math.imul(seed2, 1664525) >>> 0) + 1013904223) >>> 0;
    let z = ((Math.imul(seed3, 1664525) >>> 0) + 1013904223) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;
    y = ((Math.imul(x, z) >>> 0) + y) >>> 0;
    z = ((Math.imul(x, y) >>> 0) + z) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;
    y = ((Math.imul(x, z) >>> 0) + y) >>> 0;

    out.x = (x >>> 8) / 16777216.0;
    out.y = (y >>> 8) / 16777216.0;
}

export function Rand3 (out: Vec3, seed1: number, seed2: number, seed3: number) {
    let x = ((Math.imul(seed1, 1664525) >>> 0) + 1013904223) >>> 0;
    let y = ((Math.imul(seed2, 1664525) >>> 0) + 1013904223) >>> 0;
    let z = ((Math.imul(seed3, 1664525) >>> 0) + 1013904223) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;
    y = ((Math.imul(x, z) >>> 0) + y) >>> 0;
    z = ((Math.imul(x, y) >>> 0) + z) >>> 0;
    x = ((Math.imul(y, z) >>> 0) + x) >>> 0;
    y = ((Math.imul(x, z) >>> 0) + y) >>> 0;
    z = ((Math.imul(x, y) >>> 0) + z) >>> 0;

    out.x = (x >>> 8) / 16777216.0;
    out.y = (y >>> 8) / 16777216.0;
    out.z = (z >>> 8) / 16777216.0;
}

export function RandRanged1 (min: number, max: number, seed1: number, seed2: number, seed3: number) {
    return min + (max - min) * Rand1(seed1, seed2, seed3);
}
