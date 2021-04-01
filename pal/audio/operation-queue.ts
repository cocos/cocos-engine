export interface OperationInfo {
    id: number;
    name: string;
    args: any[],
    invoking: boolean,
}

let operationId = 0;

/**
 * This is an operation queue decorator for media player class such as Audio or Video.
 * Most of the operations in media player are asynchronous.
 * When all these asynchronous operations are called concurrently, they need to be queued.
 * 
 * Note: the decorated class need to implement a private property `_eventTarget: EventTarget`
 * and each operation function should be declared as `(...args: any[]): Promise<void>`
 * 
 * When you apply `EnqueueOperationDecorator` on a class, remember to provide a pure operation implementation.
 * It means that, for example, you can't call stop in the implementation of play operation,
 * because that would cause the operation deadlock.
 * 
 * @param operationList operation name array that need to be queued when called concurrently
 * @returns Function
 */
export function EnqueueOperationDecorator<TFunction extends Constructor<any>>(target: TFunction): TFunction | void {
    return class DecoratedPlayer extends target {
        private _operationQueue: OperationInfo[] = [];
        private _tryCallingRecursively (opInfo: OperationInfo) {
            if (opInfo.invoking) {
                return;
            }
            opInfo.invoking = true;
            super[opInfo.name]?.call(this, ...opInfo.args).then(() => {
                opInfo.invoking = false;
                this._operationQueue.shift();
                this._eventTarget.emit(opInfo.id.toString());
                // try to call the next operation in queue
                let nextOpInfo: OperationInfo = this._operationQueue[0];
                nextOpInfo && this._tryCallingRecursively(nextOpInfo);
            });            
        };
        private _wrapOperation (operationName: string, ...args: any[]): Promise<void> {
            return new Promise(resolve => {
                let id = operationId++;
                // Enqueue an operation
                this._operationQueue.push({
                    id,
                    name: operationName,
                    args,
                    invoking: false,
                });
                // call resolve when this operation id is finishied
                this._eventTarget.once(id.toString(), resolve);
                let opInfo: OperationInfo = this._operationQueue[0];
                this._tryCallingRecursively(opInfo);
            });
        }
        
        play (): Promise<void> {
            return this._wrapOperation('play');
        }

        stop (): Promise<void> {
            return this._wrapOperation('stop');
        }

        pause (): Promise<void> {
            return this._wrapOperation('pause');
        }

        seek (time: number): Promise<void> {
            return this._wrapOperation('seek');
        }
    }
}
