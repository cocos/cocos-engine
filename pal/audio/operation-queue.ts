import { EventTarget } from "../../cocos/core";

export interface OperationInfo {
    id: number;
    name: string;
    args: any[],
    invoking: boolean,
}

export interface OperationQueueable {
    _operationQueue: OperationInfo[];
    _eventTarget: EventTarget;
}
type OperationMethod = (...args: any[]) => Promise<void>;
interface OriginalOperationMap {
    [key: string]: OperationMethod | undefined;
}

let operationId = 0;

/**
 * This method creates a decorator which is for methods in media player class such as Audio or Video.
 * Most of the operations in media player are asynchronous.
 * When all these asynchronous operations are called concurrently, they need to be queued.
 *
 * Note: the decorated target need to implement the interface `OperationQueueable`
 * and the decorated method should be declared as `(...args: any[]): Promise<void>`.
 *
 * When you apply `enqueueOperation` on a method, remember to provide a pure operation implementation.
 * It means that, for example, you can't call stop in the implementation of play operation,
 * because that would cause the operation deadlock.
 * 
 * @returns MethodDecorator
 */
export function createEnqueueOperationDecorator () {
    let originalOperationMap: OriginalOperationMap = {};
    function _tryCallingRecursively<T extends OperationQueueable>(target: T, opInfo: OperationInfo) {
        if (opInfo.invoking) {
            return;
        }
        opInfo.invoking = true;
        originalOperationMap[opInfo.name]?.call(target, ...opInfo.args).then(() => {
            opInfo.invoking = false;
            target._operationQueue.shift();
            target._eventTarget.emit(opInfo.id.toString());
            const nextOpInfo: OperationInfo = target._operationQueue[0];
            nextOpInfo && _tryCallingRecursively(target, nextOpInfo);
        });
    }

    return function enqueueOperation<T extends OperationQueueable>(target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<OperationMethod>): void {
        originalOperationMap[propertyKey] = descriptor.value;
        descriptor.value = function (...args: any[]): Promise<void> { 
            return new Promise((resolve) => {
                const id = operationId++;
                let instance = this as OperationQueueable;
                instance._operationQueue.push({
                    id,
                    name: propertyKey,
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
}
