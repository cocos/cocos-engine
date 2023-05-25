import { ccenum } from '../../../../core';

/**
 * @zh
 * 表示某些姿势图结点在接受变换输入（包括整个变换或者单独的位置旋转）时，
 * 该变换所在的空间。
 * @en
 * Represents the space of input transforms(including whole transform or individual position or rotation)
 * accepted by certain pose graph nodes.
 */
export enum TransformSpace {
    /**
     * @zh 表示该变换是在世界空间中描述的。
     * @en Indicates the transform is described in world space.
     */
    WORLD,

    /**
     * @zh 表示该变换是在动画图所在组件（即动画控制器组件）的所属结点的本地空间中描述的。
     * @en Indicates the transform is described in local space of the node
     * to which the animation graph's belonging component(ie. the animation controller) is attached.
     */
    COMPONENT,

    /**
     * @zh 表示该变换是在应用到的目标结点的父结点的本地空间中描述的。
     * @en Indicates the transform is described in local space of the applying node(bone).
     */
    PARENT,

    /**
     * @zh 表示该变换是在应用到的目标结点的本地空间中描述的。
     * @en Indicates the transform is described in local space of the applying node(bone).
     */
    LOCAL,
}

ccenum(TransformSpace);
