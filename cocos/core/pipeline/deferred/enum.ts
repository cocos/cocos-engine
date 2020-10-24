/**
 * @category pipeline
 */

/**
 * @zh 前向阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum DeferredStagePriority {
    GBUFFER = 10,
    LIGHTING = 15,
    TRANSPARENT = 18,
    UI = 20
}

/**
 * @zh 前向渲染流程优先级。
 * @en The priority of flows in forward rendering
 */
export enum DeferredFlowPriority {
    SHADOW = 0,
    GBUFFER = 1,
    LIGHTING = 5,
    UI = 10,
}
