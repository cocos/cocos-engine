/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.
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

export enum CommonStagePriority {
    BLOOM = 18,
    POST_PROCESS = 19,
    UI = 20
}

/**
 * @zh 前向阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum ForwardStagePriority {
    AR = 5,
    FORWARD = 10,
}

/**
 * @zh 前向渲染流程优先级。
 * @en The priority of flows in forward rendering
 */
export enum ForwardFlowPriority {
    SHADOW = 0,
    FORWARD = 1,
    UI = 10,
}

/**
 * @zh 延迟阶段优先级。
 * @en The priority of stage in forward rendering
 */
export enum DeferredStagePriority {
    GBUFFER = 10,
    LIGHTING = 15,
    TRANSPARENT = 18
}

/**
 * @zh 延迟渲染流程优先级。
 * @en The priority of flows in forward rendering
 */
export enum DeferredFlowPriority {
    SHADOW = 0,
    MAIN = 1,
    UI = 10,
}
