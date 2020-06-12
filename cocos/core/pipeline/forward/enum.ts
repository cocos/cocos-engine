/**
 * @category pipeline.forward
 */

/**
 * @zh
 * 前向阶段优先级。
 */
export enum ForwardStagePriority {
    FORWARD = 0,
}

/**
 * @zh
 * 前向渲染流程优先级。
 */
export enum ForwardFlowPriority {
    FORWARD = 0,
    DEPTH = 1,
    UI = 10,
}
