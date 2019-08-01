/**
 * @hidden
 */

import { ParticleSystemComponent } from '..';
import { CCObject } from '../../../core/data/object';
import { Node } from '../../../scene-graph';
import { Pool } from '../../memop';

export class ParticleUtils {
    /**
     * instantiate
     */
    public static instantiate (prefab) {
        if (!this.registeredSceneEvent) {
            cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneUnload, this);
            this.registeredSceneEvent = true;
        }
        if (!this.particleSystemPool.has(prefab._uuid)) {
            this.particleSystemPool.set(prefab._uuid, new Pool<CCObject>(() => {
                return cc.instantiate(prefab);
            }, 1));
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
        for (const ps of rootNode.getComponentsInChildren(cc.ParticleSystemComponent)) {
            (ps as ParticleSystemComponent).play();
        }
    }

    public static stop (rootNode: Node) {
        for (const ps of rootNode.getComponentsInChildren(cc.ParticleSystemComponent)) {
            (ps as ParticleSystemComponent).stop();
        }
    }

    private static particleSystemPool: Map<string, Pool<CCObject>> = new Map<string, Pool<CCObject>>();
    private static registeredSceneEvent: boolean = false;

    private static onSceneUnload () {
        this.particleSystemPool.forEach((value) => {
            value.clear((prefab) => {
                prefab.destroy();
            });
        });
        this.particleSystemPool.clear();
    }
}
