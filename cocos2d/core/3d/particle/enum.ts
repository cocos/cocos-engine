import Enum  from '../../platform/CCEnum';

/**
 * @enum ParticleSystem3DAssembler.Space
 */
export const Space = Enum({
    World: 0,
    Local: 1,
    Custom: 2,
});

/**
 * 粒子的生成模式
 * @enum ParticleSystem3DAssembler.RenderMode
 */
export const RenderMode = Enum({

    /**
     * 粒子始终面向摄像机
     */
    Billboard: 0,

    /**
     * 粒子始终面向摄像机但会根据参数进行拉伸
     */
    StrecthedBillboard: 1,

    /**
     * 粒子始终与 XZ 平面平行
     */
    HorizontalBillboard: 2,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机
     */
    VerticalBillboard: 3,

    /**
     * 粒子保持模型本身状态
     */
    Mesh: 4,
});

/**
 * 粒子发射器类型
 * @enum shapeModule.ShapeType
 */
export const ShapeType = Enum({
    /**
     * 立方体类型粒子发射器
     * @property {Number} Box
     */
    Box: 0,

    /**
     * 圆形粒子发射器
     * @property {Number} Circle
     */
    Circle: 1,

    /**
     * 圆锥体粒子发射器
     * @property {Number} Cone
     */
    Cone: 2,

    /**
     * 球体粒子发射器
     * @property {Number} Sphere
     */
    Sphere: 3,

    /**
     * 半球体粒子发射器
     * @property {Number} Hemisphere
     */
    Hemisphere: 4,
});

/**
 * 粒子从发射器的哪个部位发射
 * @enum shapeModule.EmitLocation
 */
export const EmitLocation = Enum({
    /**
     * 基础位置发射（仅对 Circle 类型及 Cone 类型的粒子发射器适用）
     * @property {Number} Base
     */
    Base: 0,

    /**
     * 边框位置发射（仅对 Box 类型及 Circle 类型的粒子发射器适用）
     * @property {Number} Edge
     */
    Edge: 1,

    /**
     * 表面位置发射（对所有类型的粒子发射器都适用）
     * @property {Number} Shell
     */
    Shell: 2,

    /**
     * 内部位置发射（对所有类型的粒子发射器都适用）
     * @property {Number} Volume
     */
    Volume: 3,
});

/**
 * 粒子在扇形区域的发射方式
 * @enum shapeModule.ArcMode
 */
export const ArcMode = Enum({
    /**
     * 随机位置发射
     * @property {Number} Random
     */
    Random: 0,

    /**
     * 沿某一方向循环发射，每次循环方向相同
     * @property {Number} Loop
     */
    Loop: 1,

    /**
     * 循环发射，每次循环方向相反
     * @property {Number} PingPong
     */
    PingPong: 2,
});

/**
 * 选择如何为粒子系统生成轨迹
 * @enum trailModule.TrailMode
 */
export const TrailMode = Enum({
    /**
     * 粒子模式<bg>
     * 创建一种效果，其中每个粒子在其路径中留下固定的轨迹
     */
    Particles: 0,

    /**
     * 带模式<bg>
     * 根据其生命周期创建连接每个粒子的轨迹带
     */
    Ribbon: 1,
});

/**
 * 纹理填充模式
 * @enum trailModule.TextureMode
 */
export const TextureMode = Enum({
    /**
     * 拉伸填充纹理
     */
    Stretch: 0,

    /**
     * 重复填充纹理
     */
    Repeat: 1,
});
