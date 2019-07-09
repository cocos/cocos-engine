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

#include "ParallelTask.hpp"

RENDERER_BEGIN

ParallelTask::ParallelTask()
{
    
}

ParallelTask::~ParallelTask()
{
    destroy();
}

void ParallelTask::init(int threadNum)
{
    _finished = false;
    _threadNum = threadNum;
    
    _tasks.resize(_threadNum);
    _threads.resize(_threadNum);
    _runFlags = new uint8_t[_threadNum];
    memset(_runFlags, RunFlag::Stop, sizeof(uint8_t) * _threadNum);
    
    for(auto i = 0; i < _threadNum; i++)
    {
        setThread(i);
    }
}

void ParallelTask::pushTask(int tid, const Task& task)
{
    if (tid >= 0 && tid < _tasks.size())
    {
        _tasks[tid].push_back(task);
    }
}

void ParallelTask::clearTasks()
{
    for(std::size_t i = 0, n = _tasks.size(); i < n; i++)
    {
        _tasks[i].clear();
    }
}

uint8_t* ParallelTask::getRunFlag()
{
    return _runFlags;
}

void ParallelTask::destroy()
{
    _finished = true;
    beginAllThreads();
    for (int i = 0, n = (int)_threads.size(); i < n; ++i)
    {
        joinThread(i);
    }
    _tasks.clear();
    _threads.clear();
    delete _runFlags;
    _runFlags = nullptr;
    _threadNum = 0;
}

void ParallelTask::stopAllThreads()
{
    if (!_runFlags) return;
    memset(_runFlags, RunFlag::Stop, sizeof(uint8_t) * _threadNum);
}

void ParallelTask::beginAllThreads()
{
    if (!_runFlags) return;
    memset(_runFlags, RunFlag::Begin, sizeof(uint8_t) * _threadNum);
    
    {
        std::unique_lock<std::mutex> lock(_mutex);
        _cv.notify_all();
    }
}

void ParallelTask::waitAllThreads()
{
    std::unique_lock<std::mutex> lock(_mutex);
    _cv.wait(lock, [this]() {
        if (!_runFlags) return true;
        for (auto i = 0; i < _threadNum; i++)
        {
            if (_runFlags[i] == RunFlag::Begin) return false;
        }
        return true;
    });
}

void ParallelTask::joinThread(int tid)
{
    if (tid < 0 || tid >= (int)_threads.size())
    {
        return;
    }
    
    if (_threads[tid]->joinable())
    {
        _threads[tid]->join();
    }
}

void ParallelTask::setThread(int tid)
{
    auto f = [this, tid]() {
        uint8_t& runFlag = _runFlags[tid];
        if (!runFlag) return;
        
        auto& taskQueue = _tasks[tid];
        std::size_t idx = 0;
        std::size_t taskCount = 0;
        
        while (!_finished)
        {
            switch (runFlag)
            {
                case RunFlag::Begin:
                    for (idx = 0, taskCount = taskQueue.size(); idx < taskCount; idx++)
                    {
                        const Task& task = taskQueue[idx];
                        task(tid);
                    }
                    runFlag = RunFlag::Stop;
                    
                    {
                        std::unique_lock<std::mutex> lock(_mutex);
                        _cv.notify_all();
                    }
                break;
                case RunFlag::Stop:
                {
                    std::unique_lock<std::mutex> lock(_mutex);
                    _cv.wait(lock, [this, &runFlag]()
                    {
                        return runFlag == RunFlag::Begin || _finished;
                    });
                }
                break;
            }
        }
    };
    _threads[tid].reset(new(std::nothrow) std::thread(f));
}

RENDERER_END
