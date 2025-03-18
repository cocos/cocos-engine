/****************************************************************************
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*****************************************************************************/
export interface OnCanceledListener {
    onCanceled(): void;
}

export interface OnCompleteListener<TResult, TContinuationResult = void> {
    onComplete(result: TaskHelper<TResult, TContinuationResult>): void;
}

export interface OnFailureListener {
    onFailure(e: jsb.PlayException): void;
}

export interface OnSuccessListener<TResult> {
    onSuccess(result: TResult): void;
}

export interface ContinuationHelper<TResult, TContinuationResult> {
    then(task: TaskHelper<TResult, TContinuationResult>): TContinuationResult;
}

export interface TaskHelper<TResult, TContinuationResult = void> {
    addOnCanceledListener(listener: OnCanceledListener): TaskHelper<TResult, TContinuationResult>;
    addOnCompleteListener(listener: OnCompleteListener<TResult, TContinuationResult>): TaskHelper<TResult, TContinuationResult>;
    addOnFailureListener(listener: OnFailureListener): TaskHelper<TResult, TContinuationResult>;
    addOnSuccessListener(listener: OnSuccessListener<TResult>): TaskHelper<TResult, TContinuationResult>;
    continueWith(result: ContinuationHelper<TResult, TContinuationResult>): TaskHelper<TContinuationResult>;
    continueWithTask (result: TaskHelper<TContinuationResult, TaskHelper<TContinuationResult>>): TaskHelper<TContinuationResult>;
    getResult(): TResult | null;
    isCanceled(): boolean;
    isComplete(): boolean;
    isSuccessful(): boolean;
}
