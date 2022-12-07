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

import { instantiate } from '../serialization';
import { CCObject, Pool } from '../core';
import { Director, director } from '../game/director';
import { Node } from '../scene-graph';
import { ParticleSystem } from './particle-system';
import CurveRange from './animator/curve-range';
import Gradient from './animator/gradient';
import GradientRange from './animator/gradient-range';

export class ParticleUtils {
    /**
     * @en instantiate particle system from prefab
     * @zh 从 prefab 实例化粒子系统
     */
    public static instantiate (prefab) {
        if (!this.registeredSceneEvent) {
            director.on(Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneUnload, this);
            this.registeredSceneEvent = true;
        }
        if (!this.particleSystemPool.has(prefab._uuid)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.particleSystemPool.set(prefab._uuid, new Pool<CCObject>(() => instantiate(prefab) || new Node(), 1, (prefab) => prefab.destroy()));
        }
        return this.particleSystemPool.get(prefab._uuid)!.alloc();
    }

    public static destroy (prefab) {
        if (this.particleSystemPool.has(prefab._prefab.asset._uuid)) {
            this.stop(prefab);
            this.particleSystemPool.get(prefab._prefab.asset._uuid)!.free(prefab);
        }
    }

    public static play (rootNode: Node) {
        for (const ps of rootNode.getComponentsInChildren(ParticleSystem)) {
            (ps).play();
        }
    }

    public static stop (rootNode: Node) {
        for (const ps of rootNode.getComponentsInChildren(ParticleSystem)) {
            (ps).stop();
        }
    }

    /**
     * @en judge if the CurveRange use TwoCurves or TwoConstants
     * @zh 判断粒子的CurveRange是否使用了 TwoCurves 或者 TwoConstants
     */
    public static isCurveTwoValues (curve: CurveRange): boolean {
        const Mode = CurveRange.Mode;
        switch (curve.mode) {
        case Mode.TwoCurves:
        case Mode.TwoConstants:
            return true;
        default:
            return false;
        }
    }
    /**
     * @en judge if the GradientRange TwoValues use TwoGradients or TwoColors
     * @zh 判断粒子的 GradientRange 是否使用了 TwoGradients 或者 TwoColors
     */
    public static isGradientTwoValues (color: GradientRange): boolean {
        const Mode = GradientRange.Mode;
        switch (color.mode) {
        case Mode.TwoGradients:
        case Mode.TwoColors:
            return true;
        default:
            return false;
        }
    }

    private static particleSystemPool: Map<string, Pool<CCObject>> = new Map<string, Pool<CCObject>>();
    private static registeredSceneEvent = false;

    private static onSceneUnload () {
        this.particleSystemPool.forEach((value) => value.destroy());
        this.particleSystemPool.clear();
    }
}
