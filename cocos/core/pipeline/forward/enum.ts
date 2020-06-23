/**
 * @category pipeline
 */

/**
 * @zh 前向阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum ForwardStagePriority {
    FORWARD = 0,
}

/**
 * @zh 前向渲染流程优先级。
 * @en The priority of flows in forward rendering 
 */
export enum ForwardFlowPriority {
    FORWARD = 0,
    UI = 10,
}
