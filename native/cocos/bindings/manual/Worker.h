/**
 * Created by ihowe@outlook.com on 2023/5/31.
 * Worker on Native (only v8)
 */

#pragma once

#include <stdio.h>
#include <string>
#include <thread>
#include <deque>
#include <mutex>
#include <functional>

namespace ccex {

    class Worker{
    public:
        Worker(uint32_t _id, std::string _path);
        virtual ~Worker();
        void start();
        void terminate();

        std::string getMessage(){
            if (messageQueue.size() > 0){
                std::lock_guard<std::mutex> lock(mutex);
                std::string message = messageQueue.front();
                messageQueue.pop_front();
                return message;
            }
            return std::string("");
        }
        void postMessage(std::string message){
            std::lock_guard<std::mutex> lock(mutex);
            messageQueue.push_back(message);
        }
        std::string getEventID(){
            uint32_t evtId = (id << 24) + (eventid++);
            return std::to_string(evtId);
        }
        /**
         * 当引用_weakCount为3则销毁
         */
        void setWeak(){
            _weakCount.fetch_add(1);
            if (_weakCount == 3) {
                delete this;
            }
        }
        bool isValid(){
            return _weakCount.load() == 0;
        }
        static void destroyAll();
    public:
        std::deque<std::string> messageQueue;
        /**
         * 发送信息到主线程
         * type:0表示普通信息，1表示错误, 2 表示关闭
         * message：信息内容
         */
        std::function<void( Worker*, int,std::string)> postEventToMainThread;

        std::mutex mutex;

        std::thread worker_thread;
        uint32_t id;
        std::string path;
        int eventid;
        // 初始为0，
        std::atomic_char _weakCount;
        void *_data = nullptr;

    };
}
