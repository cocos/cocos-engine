import { Pool } from '../../../renderer/memop';

export class ParticleUtils {
    static particleSystemPool = {};
    static registeredSceneEvent = false;

    /**
     * instantiate
     */
    static instantiate (prefab) {
        if (!this.registeredSceneEvent) {
            cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.onSceneUnload, this);
            this.registeredSceneEvent = true;
        }
        if (!this.particleSystemPool.has(prefab._uuid)) {
            this.particleSystemPool.set(prefab._uuid, new Pool(() => {
                return cc.instantiate(prefab);
            }, 1));
        }
        return this.particleSystemPool.get(prefab._uuid).alloc();
    }

    static destroy (prefab) {
        if (this.particleSystemPool.has(prefab._prefab.asset._uuid)) {
            this.stop(prefab);
            this.particleSystemPool.get(prefab._prefab.asset._uuid).free(prefab);
        }
    }

    static onSceneUnload () {
        for (const p of this.particleSystemPool.values()) {
            p.clear((prefab) => {
                prefab.destroy();
            });
        }
        this.particleSystemPool.clear();
    }

    static play (rootNode) {
        for (const ps of rootNode.getComponentsInChildren(cc.ParticleSystem3D)) {
            ps.play();
        }
    }

    static stop (rootNode) {
        for (const ps of rootNode.getComponentsInChildren(cc.ParticleSystem3D)) {
            ps.stop();
        }
    }
}
