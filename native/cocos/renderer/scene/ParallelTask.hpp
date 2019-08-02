/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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

#pragma once

#include "../Macro.h"
#include <vector>
#include <stdint.h>
#include <functional>
#include <thread>
#include <memory>
#include <condition_variable>
#include <mutex>

RENDERER_BEGIN

class ParallelTask
{
public:
    
    enum RunFlag{
        Begin = 0x00,
        Stop = 0x01,
    };
    
    typedef std::function<void(int)> Task;
    
    ParallelTask();
    virtual ~ParallelTask();
    
    void pushTask(int tid, const Task& task);
    void clearTasks();
    
    uint8_t* getRunFlag();
    
    void init(int threadNum);
    void destroy();
    
    void waitAllThreads();
    void stopAllThreads();
    void beginAllThreads();
private:
    void joinThread(int tid);
    void setThread(int tid);
private:
    std::vector<std::vector<Task>> _tasks;
    std::vector<std::unique_ptr<std::thread>> _threads;
    
    uint8_t* _runFlags = nullptr;
    bool _finished = false;
    int _threadNum = 0;
    
    std::mutex _mutex;
    std::condition_variable _cv;
};

RENDERER_END
