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
    /**
     * @deprecated since 3.8, please use Space.WORLD instead
     */
    World = WORLD,

    LOCAL,
    /**
     * @deprecated since 3.8, please use Space.LOCAL instead
     */
    Local = LOCAL,

    CUSTOM,
    /**
     * @deprecated since 3.8, please use Space.CUSTOM instead
     */
    Custom = CUSTOM,
}

/**
 * @en Particle emitter culling mode
 * @zh 粒子的剔除模式。
 * @enum ParticleSystem.CullingMode
 */
export enum CullingMode {
    PAUSE,
    /**
     * @deprecated since 3.8, please use CullingMode.PAUSE instead
     */
    Pause = PAUSE,

    PAUSE_AND_CATCHUP,
    /**
     * @deprecated since 3.8, please use CullingMode.PAUSE_AND_CATCHUP instead
     */
    PauseAndCatchup = PAUSE_AND_CATCHUP,

    ALWAYS_SIMULATE,
    /**
     * @deprecated since 3.8, please use CullingMode.ALWAYS_SIMULATE instead
     */
    AlwaysSimulate = ALWAYS_SIMULATE,
}

/**
 * @en Particle emitter alignment space
 * @zh 粒子的对齐模式。
 * @enum ParticleSystemRenderer.AlignmentSpace
 */
export enum AlignmentSpace {
    WORLD,
    /**
     * @deprecated since 3.8, please use AlignmentSpace.WORLD instead
     */
    World = WORLD,

    LOCAL,
    /**
     * @deprecated since 3.8, please use AlignmentSpace.LOCAL instead
     */
    Local = LOCAL,

    VIEW,
    /**
     * @deprecated since 3.8, please use AlignmentSpace.VIEW instead
     */
    View = VIEW,
}

/**
 * 粒子的生成模式。
 * @enum ParticleSystemRenderer.RenderMode
 */
export enum RenderMode {
    /**
     * 粒子始终面向摄像机。
     */
    BILLBOARD,
    /**
     * @deprecated since v3.8, please use RenderMode.BILLBOARD instead
     */
    Billboard = BILLBOARD,

    /**
     * 粒子始终面向摄像机但会根据参数进行拉伸。
     */
    STRETCHED_BILLBOARD,

    /**
     * @deprecated since v3.8, please use RenderMode.STRETCHED_BILLBOARD instead
     */
    StrecthedBillboard = STRETCHED_BILLBOARD,

    /**
     * 粒子始终与 XZ 平面平行。
     */
    HORIZONTAL_BILLBOARD,

    /**
     * @deprecated since v3.8, please use RenderMode.HORIZONTAL_BILLBOARD instead
     */
    HorizontalBillboard = HORIZONTAL_BILLBOARD,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机。
     */
    VERTICAL_BILLBOARD,

    /**
     * @deprecated since v3.8, please use RenderMode.VERTICAL_BILLBOARD instead
     */
    VerticalBillboard = VERTICAL_BILLBOARD,

    /**
     * 粒子保持模型本身状态。
     */
    MESH,

    /**
     * @deprecated since v3.8, please use RenderMode.MESH instead
     */
    Mesh = MESH,
}

/**
 * 粒子发射器类型。
 * @enum shapeModule.ShapeType
 */
export enum ShapeType {
    /**
     * 立方体类型粒子发射器。
     */
    BOX,

    /**
     * @deprecated since v3.8, please use ShapeType.BOX instead
     */
    Box = BOX,

    /**
     * 圆形粒子发射器。
     */
    CIRCLE,

    /**
     * @deprecated since v3.8, please use ShapeType.CIRCLE instead
     */
    Circle = CIRCLE,

    /**
     * 圆锥体粒子发射器。
     */
    Cone: 2,

    /**
     * 球体粒子发射器。
     */
    Sphere: 3,

    /**
     * 半球体粒子发射器。
     */
    Hemisphere: 4,
});

/**
 * 粒子从发射器的哪个部位发射。
 * @enum shapeModule.EmitLocation
 */
export const EmitLocation = Enum({
    /**
     * 基础位置发射（仅对 Circle 类型及 Cone 类型的粒子发射器适用）。
     */
    Base: 0,

    /**
     * 边框位置发射（仅对 Box 类型及 Circle 类型的粒子发射器适用）。
     */
    Edge: 1,

    /**
     * 表面位置发射（对所有类型的粒子发射器都适用）。
     */
    Shell: 2,

    /**
     * 内部位置发射（对所有类型的粒子发射器都适用）。
     */
    Volume: 3,
});

/**
 * 粒子在扇形区域的发射方式。
 * @enum shapeModule.ArcMode
 */
export const ArcMode = Enum({
    /**
     * 随机位置发射。
     */
    Random: 0,

    /**
     * 沿某一方向循环发射，每次循环方向相同。
     */
    Loop: 1,

    /**
     * 循环发射，每次循环方向相反。
     */
    PingPong: 2,
});

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
