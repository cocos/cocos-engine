/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { ccclass, serializable } from 'cc.decorator';
import type { ParticleSystem } from '../../particle';
import { warn, js } from '../../core';
import type { Node } from '../../scene-graph/node';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { EmbeddedPlayableState, EmbeddedPlayable } from './embedded-player';

/**
 * @en
 * The embedded particle system playable. The players play particle system on a embedded player.
 * @zh
 * 粒子系统子区域播放器。此播放器在子区域上播放粒子系统。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}EmbeddedParticleSystemPlayable`)
export class EmbeddedParticleSystemPlayable extends EmbeddedPlayable {
    /**
     * @en
     * Path to the node where particle system inhabits, relative from animation context root.
     * @zh
     * 粒子系统所在的结点路径，相对于动画上下文的根节点。
     */
    @serializable
    public path = '';

    public instantiate (root: Node): EmbeddedParticleSystemPlayableState | null {
        const node = root.getChildByPath(this.path);
        if (!node) {
            warn(`Hierarchy path ${this.path} does not exists.`);
            return null;
        }
        // TODO: we shouldn't wanna know the name of `ParticleSystem` indeed.
        const ParticleSystemConstructor = js.getClassByName(`cc.ParticleSystem`) as Constructor<ParticleSystem> | undefined;
        if (!ParticleSystemConstructor) {
            warn(`Particle system is required for embedded particle system player.`);
            return null;
        }
        const particleSystem = node.getComponent(ParticleSystemConstructor);
        if (!particleSystem) {
            warn(`${this.path} does not includes a particle system component.`);
            return null;
        }
        return new EmbeddedParticleSystemPlayableState(particleSystem);
    }
}

class EmbeddedParticleSystemPlayableState extends EmbeddedPlayableState {
    constructor (particleSystem: ParticleSystem) {
        super(false);
        this._particleSystem = particleSystem;
    }

    public destroy (): void {
        // DO NOTHING
    }

    /**
     * Plays the particle system from the beginning no matter current time.
     */
    public play (): void {
        this._particleSystem.play();
    }

    /**
     * Pause the particle system no matter current time.
     */
    public pause (): void {
        this._particleSystem.stopEmitting();
    }

    /**
     * Stops the particle system.
     */
    public stop (): void {
        this._particleSystem.stopEmitting();
    }

    /**
     * Sets the speed of the particle system.
     * @param speed The speed.
     */
    public setSpeed (speed: number): void {
        this._particleSystem.simulationSpeed = speed;
    }

    private _particleSystem: ParticleSystem;
}
