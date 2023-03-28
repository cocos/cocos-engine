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

import { Enum } from '../core/value-types';

export enum Space {
    WORLD,
    // /**
    //  * @deprecated since 3.8, please use Space.WORLD instead
    //  */
    // World = WORLD,

    LOCAL,
    // /**
    //  * @deprecated since 3.8, please use Space.LOCAL instead
    //  */
    // Local = LOCAL,

    CUSTOM,
    // /**
    //  * @deprecated since 3.8, please use Space.CUSTOM instead
    //  */
    // Custom = CUSTOM,
}

/**
 * @en Particle emitter culling mode
 * @zh 粒子的剔除模式。
 */
export enum CullingMode {
    PAUSE,
    // /**
    //  * @deprecated since 3.8, please use CullingMode.PAUSE instead
    //  */
    // Pause = PAUSE,

    PAUSE_AND_CATCHUP,
    // /**
    //  * @deprecated since 3.8, please use CullingMode.PAUSE_AND_CATCHUP instead
    //  */
    // PauseAndCatchup = PAUSE_AND_CATCHUP,

    ALWAYS_SIMULATE,
    // /**
    //  * @deprecated since 3.8, please use CullingMode.ALWAYS_SIMULATE instead
    //  */
    // AlwaysSimulate = ALWAYS_SIMULATE,
}

/**
 * @en Particle emitter alignment space
 * @zh 粒子的对齐模式。
 * @enum ParticleSystemRenderer.AlignmentSpace
 */
export enum AlignmentSpace {
    WORLD,
    // /**
    //  * @deprecated since 3.8, please use AlignmentSpace.WORLD instead
    //  */
    // World = WORLD,

    LOCAL,
    // /**
    //  * @deprecated since 3.8, please use AlignmentSpace.LOCAL instead
    //  */
    // Local = LOCAL,

    VIEW,
    // /**
    //  * @deprecated since 3.8, please use AlignmentSpace.VIEW instead
    //  */
    // View = VIEW,
}

/**
 * 选择如何为粒子系统生成轨迹。
 * @enum trailModule.TrailMode
 */
export const TrailMode = Enum({
    /**
     * 粒子模式<bg>。
     * 创建一种效果，其中每个粒子在其路径中留下固定的轨迹。
     */
    Particles: 0,

    /**
     * 带模式<bg>。
     * 根据其生命周期创建连接每个粒子的轨迹带。
     */
    // Ribbon: 1,
});

/**
 * 纹理填充模式。
 * @enum trailModule.TextureMode
 */
export const TextureMode = Enum({
    /**
     * 拉伸填充纹理。
     */
    Stretch: 0,

    /**
     * 重复填充纹理。
     */
    // Repeat: 1,
});

export const ModuleRandSeed = {
    LIMIT: 23541,
    SIZE: 39825,
    TEXTURE: 90794,
    COLOR: 91041,
    FORCE: 212165,
    ROTATION: 125292,
    VELOCITY_X: 197866,
    VELOCITY_Y: 156497,
    VELOCITY_Z: 984136,
};
