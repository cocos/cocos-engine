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

import { instantiate } from '../serialization';
import { CCObject, Pool } from '../core';
import { Director, director } from '../game/director';
import { Node } from '../scene-graph';
import { ParticleSystem } from './particle-system';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';

/**
 * @en Contains some util functions for particle system. Such as create and destroy particle system.
 * @zh 该类包含一些粒子系统的工具函数，例如创建和销毁粒子系统。
 */
export class ParticleUtils {
    /**
     * @en Instantiate particle system from prefab.
     * @zh 从 prefab 实例化粒子系统。
     */
    public static instantiate (prefab): CCObject {
        if (!this.registeredSceneEvent) {
            director.on(Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneUnload, this);
            this.registeredSceneEvent = true;
        }
        if (!this.particleSystemPool.has(prefab._uuid)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            this.particleSystemPool.set(prefab._uuid, new Pool<CCObject>((): any => instantiate(prefab) || new Node(), 1, (prefab): boolean => prefab.destroy()));
        }
        return this.particleSystemPool.get(prefab._uuid)!.alloc();
    }

    /**
     * @en Destroy particle system prefab.
     * @zh 销毁创建出来的粒子系统prefab。
     * @param prefab @en Particle system prefab to destroy. @zh 要销毁的粒子系统prefab。
     */
    public static destroy (prefab): void {
        if (this.particleSystemPool.has(prefab._prefab.asset._uuid)) {
            this.stop(prefab);
            this.particleSystemPool.get(prefab._prefab.asset._uuid)!.free(prefab);
        }
    }

    /**
     * @en Play particle system.
     * @zh 播放粒子系统。
     * @param rootNode @en Root node contains the particle system. @zh 包含粒子系统的根节点。
     */
    public static play (rootNode: Node): void {
        for (const ps of rootNode.getComponentsInChildren(ParticleSystem)) {
            (ps).play();
        }
    }

    /**
     * @en Stop particle system.
     * @zh 停止播放粒子系统。
     * @param rootNode @en Root node contains the particle system. @zh 包含粒子系统的根节点。
     */
    public static stop (rootNode: Node): void {
        for (const ps of rootNode.getComponentsInChildren(ParticleSystem)) {
            (ps).stop();
        }
    }

    private static particleSystemPool: Map<string, Pool<CCObject>> = new Map<string, Pool<CCObject>>();
    private static registeredSceneEvent = false;

    private static onSceneUnload (): void {
        this.particleSystemPool.forEach((value): void => value.destroy());
        this.particleSystemPool.clear();
    }
}
