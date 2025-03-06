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
****************************************************************************/

#pragma once

#include <unordered_map>
#include "base/RefCounted.h"
#include "vendor/google/common/ScopedListener.h"

namespace se {
class Object;
}
namespace cc {
class TaskException : public RefCounted {
public:
    ~TaskException();
    const std::string& getMessage() const {
        return _detailMessage;
    }
    const std::string& toString() const {
        return _toString;
    }
    const std::string& getLocalizedMessage() const {
        return getMessage();
    }
    void printStackTrace();
private:
    friend class PlayTask;
    int _exceptionId{0};
    std::string _detailMessage;
    std::string _toString;
};

class PlayTask : public RefCounted {
public:
    PlayTask(int taskId);
    ~PlayTask();
    PlayTask* addOnCanceledListener(se::Object* listener);
    PlayTask* addOnCompleteListener(se::Object* listener);
    PlayTask* addOnFailureListener(se::Object* listener);
    PlayTask* addOnSuccessListener(se::Object* listener);

    PlayTask* continueWith(se::Object* listener);
    void getResult(se::Object* listener);
    bool isCanceled();
    bool isComplete();
    bool isSuccessful();

protected:
    friend class PlayTaskManager;
    void onTaskCanceled(int listerId);
    void onTaskComplete(int listerId, int nextTaskId);
    void onTaskFailure(int listerId, void* obj, int exceptionId);
    void onTaskSuccess(int listerId, void* obj);
    void* onTaskContinueWith(int listerId, int nextTaskId);
    void callJSfuncWithJObject(se::Object* listener, const char* functionName, void* obj);

private:
    int getNextListenerId();
    int addListener(se::Object* listener);

private:
    static int _nextListnerId;
    int _taskId{0};
    std::unordered_map<int, scopedListener> _listeners;
};

} // namespace cc
