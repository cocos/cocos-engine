/****************************************************************************
 Copyright (c) 2024 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

package google.play;
import android.util.Log;

import androidx.annotation.NonNull;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.GlobalObject;
import com.google.android.gms.games.AuthenticationResult;
import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;

import com.google.android.gms.games.GamesSignInClient;
import com.google.android.gms.games.PlayGames;
import com.google.android.gms.games.PlayGamesSdk;
import com.google.android.gms.tasks.Continuation;
import com.google.android.gms.tasks.OnCanceledListener;
import com.google.android.gms.tasks.Task;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicReference;

import google.billing.GoogleBilling;

public final class TaskManager {
    private static final String TAG = TaskManager.class.getSimpleName();
    private static Map<Integer, Task<?>> _taskMap = new HashMap<>();
    private static Map<Integer, Exception> _exceptionsMap = new HashMap<>();
    private static int _nextTaskId = 0;
    private static int _nextExceptionId = 0;

    private static native void onTaskCanceled(int taskId, int listenerId);
    private static native void onTaskComplete(int taskId, int listenerId, int nextTaskId);
    private static native void onTaskFailure(int taskId, int listenerId, Object obj, int nextExceptionId);
    private static native void onTaskSuccess(int taskId, int listenerId, Object obj);

    private static native Object onContinueWith(int taskId, int listenerId, int nextTaskId);

    static int putTask(Task<?> task) {
        int taskId = ++_nextTaskId;
        _taskMap.put(taskId, task);
        return taskId;
    }

    static void removeTask(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            _taskMap.remove(taskId);
        }
    }

    static void removeTaskException(int exceptionId) {
        if(_exceptionsMap.containsKey(exceptionId)) {
            _exceptionsMap.remove(exceptionId);
        }
    }

    static Task<?> getTask(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            return _taskMap.get(taskId);
        }
        return null;
    }
    static Object getResult(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            return _taskMap.get(taskId).getResult();
        }
        return null;
    }
    static boolean isCanceled(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            return _taskMap.get(taskId).isCanceled();
        }
        return false;
    }
    static boolean isSuccessful(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            return _taskMap.get(taskId).isSuccessful();
        }
        return false;
    }
    static boolean isComplete(int taskId) {
        if(_taskMap.containsKey(taskId)) {
            return _taskMap.get(taskId).isComplete();
        }
        return false;
    }

    static int addOnCanceledListener(int taskId, int listenerId) {
        if(!_taskMap.containsKey(taskId)) {
            Log.e(TAG, "Called task id does not exist");
            return -1;
        }
        Task<?> newTask = _taskMap.get(taskId).addOnCanceledListener(()->{
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    onTaskCanceled(taskId, listenerId);
                }
            });
        });

        return putTask(newTask);
    }

    static int addOnCompleteListener(int taskId, int listenerId) {
        if(!_taskMap.containsKey(taskId)) {
            Log.e(TAG, "Called task id does not exist");
            return -1;
        }
        Task<?> newTask = _taskMap.get(taskId).addOnCompleteListener((var)->{
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    int nextTaskId = putTask(var);
                    onTaskComplete(taskId, listenerId, nextTaskId);
                }
            });
        });

        return putTask(newTask);
    }
    static int addOnFailureListener(int taskId, int listenerId) {
        if(!_taskMap.containsKey(taskId)) {
            Log.e(TAG, "Called task id does not exist");
            return -1;
        }
        Task<?> newTask = _taskMap.get(taskId).addOnFailureListener((var)->{
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    int nextExceptionId = ++_nextExceptionId;
                    _exceptionsMap.put(nextExceptionId, var);
                    onTaskFailure(taskId, listenerId, var, nextExceptionId);
                }
            });
        });
        return putTask(newTask);
    }
    static int addOnSuccessListener(int taskId, int listenerId) {
        if(!_taskMap.containsKey(taskId)) {
            Log.e(TAG, "Called task id does not exist");
            return -1;
        }
        Task<?> newTask = _taskMap.get(taskId).addOnSuccessListener((var)->{
            CocosHelper.runOnGameThread(new Runnable() {
                @Override
                public void run() {
                    onTaskSuccess(taskId, listenerId, var);
                }
            });
        });
        return putTask(newTask);
    }


    private static <TResult, TContinuationResult> Task<TContinuationResult> continueWithTaskForAny(
        Task<TResult> task, final Continuation<TResult, TContinuationResult> continuation) {

        return task.continueWith(new Continuation<TResult, TContinuationResult>() {
            @Override
            public TContinuationResult then(Task<TResult> task) throws Exception {
                return continuation.then(task);
            }
        });
    }
    static int continueWith(int taskId, int listenerId) {
        if(!_taskMap.containsKey(taskId)) {
            Log.e(TAG, "Called task id does not exist");
            return -1;
        }
        Task<Object> task = (Task<Object>)_taskMap.get(taskId);
        Task<?> newTask = task.continueWith(new Continuation<Object, Object>() {
            @Override
            public Object then(Task<Object> task) throws Exception {
                final CountDownLatch latch = new CountDownLatch(1);
                final AtomicReference<Object> resultHolder = new AtomicReference<>();
                int calllbackTaksId = putTask(task);
                if (task.isSuccessful()) {
                    CocosHelper.runOnGameThread(new Runnable() {
                        @Override
                        public void run() {
                            int calllbackTaksId = putTask(task);
                            resultHolder.set(onContinueWith(taskId, listenerId, calllbackTaksId));
                            latch.countDown();
                        }
                    });
                    latch.await();
                } else {
                    // 失败时的处理
                    resultHolder.set(null);
                }
                return resultHolder.get();
            }
        });
        return putTask(newTask);
    }
}






































