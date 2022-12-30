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

import { EventTarget } from '../../cocos/core';

type OperationMethod = (...args: any[]) => Promise<void>;
export interface OperationInfo {
    id: number;
    func: OperationMethod;
    args: any[],
    invoking: boolean,
}

export interface OperationQueueable {
    _operationQueue: OperationInfo[];
    _eventTarget: EventTarget;
}

let operationId = 0;
function _tryCallingRecursively<T extends OperationQueueable> (target: T, opInfo: OperationInfo) {
    if (opInfo.invoking) {
        return;
    }
    opInfo.invoking = true;
    opInfo.func.call(target, ...opInfo.args).then(() => {
        opInfo.invoking = false;
        target._operationQueue.shift();
        target._eventTarget.emit(opInfo.id.toString());
        const nextOpInfo: OperationInfo = target._operationQueue[0];
        nextOpInfo && _tryCallingRecursively(target, nextOpInfo);
    }).catch((e) => {});
}

/**
 * This is a method decorator for media player class such as Audio or Video.
 * Most of the operations in media player are asynchronous.
 * When all these asynchronous operations are called concurrently, they need to be queued.
 *
 * Note: the decorated class need to implement the interface `OperationQueueable`
 * and the decorated method should be declared as `(...args: any[]): Promise<void>`.
 *
 * When you apply `enqueueOperation` on a method, remember to provide a pure operation implementation.
 * It means that, for example, you can't call stop in the implementation of play operation,
 * because that would cause the operation deadlock.
 */
export function enqueueOperation<T extends OperationQueueable> (target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<OperationMethod>): void {
    const originalOperation = descriptor.value!;
    descriptor.value = function (...args: any[]): Promise<void> {
        return new Promise((resolve) => {
            const id = operationId++;
            const instance = this as OperationQueueable;
            // enqueue operation
            instance._operationQueue.push({
                id,
                func: originalOperation,
                args,
                invoking: false,
            });
            // call resolve when this operation id is finishied
            instance._eventTarget.once(id.toString(), resolve);
            const opInfo: OperationInfo = instance._operationQueue[0];
            _tryCallingRecursively(instance, opInfo);
        });
    };
}
