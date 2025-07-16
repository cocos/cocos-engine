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

import { TaskHelper, ContinuationHelper, OnCompleteListener, OnCanceledListener, OnFailureListener, OnSuccessListener } from './task';

/**
 * TaskManager is responsible for managing the lifecycle of tasks.
 *
 * Example usage in TypeScript:
 *
 * task.addOnSuccessListener({
 *     onSuccess: (result: google.play.AuthenticationResult): void => {
 *         console.log('Authenticated: ', result.isAuthenticated());
 *     },
 * });
 *
 * Ideally, after invoking this function, the callback should be awaited.
 * However, in TypeScript, if the task object is not stored, it may be released
 * before the callback is executed. To prevent this, a class is needed to manage
 * the tasks being listened to.
 */
class TaskManager<TResult, TContinuationResult = void> {
    private tasks: Map<number, GooglePlayTask<TResult, TContinuationResult>> = new Map<number, GooglePlayTask<TResult, TContinuationResult>>();
    private nextTaskId: number = 0;
    addTask (task: GooglePlayTask<TResult, TContinuationResult>, taskId: number | null = null): void {
        if (typeof taskId === 'number') {
            this.tasks.set(taskId, task);
        } else {
            this.tasks.set(this.getNextTaskId(), task);
        }
    }

    getNextTaskId (): number {
        return this.nextTaskId++;
    }

    removeTask (taskId: number): void {
        this.tasks.delete(taskId);
    }
}

export class GooglePlayTask<TResult, TContinuationResult = void> implements TaskHelper<TResult, TContinuationResult> {
    private _nativeTask: jsb.PlayTask;
    public static taskMgr: TaskManager<any, any> = new TaskManager<any, any>();
    constructor (task: jsb.PlayTask) {
        this._nativeTask = task;
    }

    addOnCanceledListener (listener: OnCanceledListener): TaskHelper<TResult, TContinuationResult> {
        const taskId = GooglePlayTask.taskMgr.getNextTaskId();
        const newNativeTask = this._nativeTask.addOnCanceledListener({
            onCanceled: (): void => {
                listener.onCanceled();
                GooglePlayTask.taskMgr.removeTask(taskId);
            },
        });
        const newTask = new GooglePlayTask<TResult, TContinuationResult>(newNativeTask);
        GooglePlayTask.taskMgr.addTask(newTask, taskId);
        return newTask;
    }

    addOnCompleteListener (listener: OnCompleteListener<TResult, TContinuationResult>): TaskHelper<TResult, TContinuationResult> {
        const taskId = GooglePlayTask.taskMgr.getNextTaskId();
        const newNativeTask = this._nativeTask.addOnCompleteListener({
            onComplete: (result: jsb.PlayTask): void => {
                listener.onComplete(new GooglePlayTask<TResult, TContinuationResult>(result));
                GooglePlayTask.taskMgr.removeTask(taskId);
            },
        });
        const newTask = new GooglePlayTask<TResult, TContinuationResult>(newNativeTask);
        GooglePlayTask.taskMgr.addTask(newTask, taskId);
        return newTask;
    }

    addOnFailureListener (listener: OnFailureListener): TaskHelper<TResult, TContinuationResult> {
        const taskId = GooglePlayTask.taskMgr.getNextTaskId();
        const newNativeTask = this._nativeTask.addOnFailureListener({
            onFailure: (result: jsb.PlayException): void => {
                listener.onFailure(result);
                GooglePlayTask.taskMgr.removeTask(taskId);
            },
        });

        const newTask = new GooglePlayTask<TResult, TContinuationResult>(newNativeTask);
        GooglePlayTask.taskMgr.addTask(newTask, taskId);
        return newTask;
    }

    addOnSuccessListener (continuation: OnSuccessListener<TResult>): TaskHelper<TResult, TContinuationResult> {
        const taskId = GooglePlayTask.taskMgr.getNextTaskId();
        const newNativeTask = this._nativeTask.addOnSuccessListener({
            onSuccess: (result: any): void => {
                continuation.onSuccess(result as TResult);
                GooglePlayTask.taskMgr.removeTask(taskId);
            },
        });
        const newTask = new GooglePlayTask<TResult, TContinuationResult>(newNativeTask);
        GooglePlayTask.taskMgr.addTask(newTask, taskId);
        return newTask;
    }

    continueWith (continuation: ContinuationHelper<TResult, TContinuationResult>): TaskHelper<TContinuationResult> {
        const newNativeTask = this._nativeTask.continueWith({
            then: (result: jsb.PlayTask): TContinuationResult => {
                const newTask = new GooglePlayTask<TResult, TContinuationResult>(result);
                GooglePlayTask.taskMgr.addTask(newTask);
                return continuation.then(newTask);
            },
        });
        const newTask = new GooglePlayTask<TContinuationResult>(newNativeTask);
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }

    continueWithTask (continuation: TaskHelper<TContinuationResult, GooglePlayTask<TContinuationResult>>): TaskHelper<TContinuationResult> {
        throw new Error('Method not implemented.');
    }

    getResult (): TResult | null {
        // Since getResult can return any type, it is not possible to directly return an arbitrary type to TypeScript in C++.
        // Therefore, a solution was implemented:
        //    a callback function is set up to receive a value of type any.
        //    In C++, this callback function can be called with any type, and it will handle automatic type conversion.
        let anyType: TResult | null = null;
        this._nativeTask.getResult({
            onSuccess: (result: any): void => {
                anyType = result as TResult;
            },
        });
        return anyType;
    }

    isCanceled (): boolean {
        return this._nativeTask.isCanceled();
    }
    isComplete (): boolean {
        return this._nativeTask.isComplete();
    }
    isSuccessful (): boolean {
        return this._nativeTask.isSuccessful();
    }
}

export class GamesSignInClientHelper {
    isAuthenticated (): TaskHelper<jsb.AuthenticationResult> {
        const newTask = new GooglePlayTask<jsb.AuthenticationResult>(jsb.PlayGames.getGamesSignInClient().isAuthenticated());
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }

    requestServerSideAccess (serverClientId: string, forceRefreshToken: boolean): TaskHelper<string> {
        const newTask = new GooglePlayTask<string>(jsb.PlayGames.getGamesSignInClient().requestServerSideAccess(serverClientId, forceRefreshToken));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }

    signIn (): TaskHelper<jsb.AuthenticationResult> {
        const newTask = new GooglePlayTask<jsb.AuthenticationResult>(jsb.PlayGames.getGamesSignInClient().signIn());
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
}

export class AchievementsClientHelper {
    showAchievements (): void {
        jsb.PlayGames.getAchievementsClient().showAchievements();
    }

    incrementImmediate (id: string, numSteps: number): TaskHelper<boolean> {
        const newTask = new GooglePlayTask<boolean>(jsb.PlayGames.getAchievementsClient().incrementImmediate(id, numSteps));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
    load (forceReload: boolean): TaskHelper<jsb.AnnotatedData> {
        const newTask = new GooglePlayTask<jsb.AnnotatedData>(jsb.PlayGames.getAchievementsClient().load(forceReload));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
    revealImmediate (id: string): TaskHelper<void> {
        const newTask = new GooglePlayTask<void>(jsb.PlayGames.getAchievementsClient().revealImmediate(id));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
    setStepsImmediate (id: string, numSteps: number): TaskHelper<boolean> {
        const newTask = new GooglePlayTask<boolean>(jsb.PlayGames.getAchievementsClient().setStepsImmediate(id, numSteps));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
    unlockImmediate (id: string): TaskHelper<void> {
        const newTask = new GooglePlayTask<void>(jsb.PlayGames.getAchievementsClient().unlockImmediate(id));
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
    increment (id: string, numSteps: number): void {
        jsb.PlayGames.getAchievementsClient().increment(id, numSteps);
    }

    reveal (id: string): void {
        jsb.PlayGames.getAchievementsClient().reveal(id);
    }

    setSteps (id: string, numSteps: number): void {
        jsb.PlayGames.getAchievementsClient().setSteps(id, numSteps);
    }

    unlock (id: string): void {
        jsb.PlayGames.getAchievementsClient().unlock(id);
    }
}

export class RecallClientHelper {
    requestRecallAccess (): TaskHelper<jsb.RecallAccess> {
        const newTask = new GooglePlayTask<jsb.RecallAccess>(jsb.PlayGames.getRecallClient().requestRecallAccess());
        GooglePlayTask.taskMgr.addTask(newTask);
        return newTask;
    }
}

export class PlayGamesHelper {
    private static achievementsClient: AchievementsClientHelper = new AchievementsClientHelper();
    private static gamesSignInClient: GamesSignInClientHelper = new GamesSignInClientHelper();
    private static recallClient: RecallClientHelper = new RecallClientHelper();
    public static getAchievementsClient (): AchievementsClientHelper {
        return this.achievementsClient;
    }
    public static getGamesSignInClient (): GamesSignInClientHelper {
        return this.gamesSignInClient;
    }
    public static getRecallClient (): RecallClientHelper {
        return this.recallClient;
    }
}
