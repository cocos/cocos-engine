/**
 * Created by ihowe@outlook.com on 2023/5/31.
 * Worker on Native (only v8)
 */

#include <unordered_map>
#include "jsb_worker_maunal.h"
#include "Worker.h"

#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/engine/BaseEngine.h"

const std::string workerjs = R"(
(function(root){if(!root.workerImp){return;}
const worker_instance=new Map();workerImp.instances=worker_instance;workerImp.globalMessage=function(id,type,data){let lworker=worker_instance.get(id);if(lworker){switch(type){case 0:{let event=JSON.parse(data);lworker.onmessage&&lworker.onmessage(event);break;}
case 1:{lworker.onerror&&lworker.onerror(data);break;}
case 2:{lworker.onmessage=null;lworker.onerror=null;worker_instance.delete(id);break;}}}}
let id_count=1;class Worker{_path="";_options=null;_id=0;constructor(aURL,options){this._path=aURL;this._options=options;this._id=id_count++;worker_instance.set(this._id,this);workerImp.js_constructor(this._id,aURL);}
postMessage(message){workerImp.js_postMessage(this._id,JSON.stringify({data:message}));}
terminate(){workerImp.js_terminate(this._id);worker_instance.delete(this._id);this.onmessage=null;this.onerror=null;}}
root.Worker=Worker;console.log("Worker Initialization completed !");})(window)
)";

namespace {
    class WorkerImp {
    public:
        WorkerImp():workerImpObj(nullptr){
            _scheduler = CC_CURRENT_ENGINE()->getScheduler();
        }
        virtual ~WorkerImp(){
            std::lock_guard<std::mutex> lock(workers_mutex);
            for (auto ite = workers.begin(); ite != workers.end(); ++ite) {
                ite->second->setWeak();
            }
            workers.clear();
            globalMessage.setUndefined();
            workerImpObj = nullptr;
        }
        void postEventToMain(uint32_t id, int type, std::string data){
            if (type == 2){
                std::lock_guard<std::mutex> lock(workers_mutex);
                auto ite = workers.find(id);
                if (ite != workers.end()){
                    auto worker = ite->second;
                    workers.erase(ite);
                    worker->setWeak();
                }
            }
            if (!_scheduler || !workerImpObj) {
                return;
            }
            // CC_LOG_DEBUG("worker : postMessageToGame   workerid = %d",id);
            auto func = [id,type,data,this]() {
                se::AutoHandleScope hs; // fix v8
                if (globalMessage.isUndefined() && workerImpObj) {
                    workerImpObj->getProperty("globalMessage", &globalMessage);
                }
                if (globalMessage.isNullOrUndefined()){
                    return;
                }
                se::ValueArray args;
                args.push_back(se::Value(id));
                args.push_back(se::Value(type));
                args.push_back(se::Value(data));
                globalMessage.toObject()->call(args, workerImpObj);
            };
            _scheduler->performFunctionInCocosThread(func);
        }

        ccex::Worker * createWorker(uint32_t id, std::string jspath){
            auto* worker = new ccex::Worker(id,jspath);
            std::lock_guard<std::mutex> lock(workers_mutex);
            workers.emplace(id, worker);
            return worker;
        }
        ccex::Worker * getWorker(uint32_t id){
            std::lock_guard<std::mutex> lock(workers_mutex);
            auto ite = workers.find(id);
            if (ite != workers.end()){
                return ite->second;
            }
            return nullptr;
        }
        void terminate(uint32_t id){
            std::lock_guard<std::mutex> lock(workers_mutex);
            auto ite = workers.find(id);
            if (ite != workers.end()){
                auto worker = ite->second;
                workers.erase(ite);
                worker->setWeak();
                worker->terminate();
            }
        }
    public:
        se::Value globalMessage;
        se::Object *workerImpObj;
        cc::BaseEngine::SchedulerPtr _scheduler;
        std::mutex workers_mutex;
        std::unordered_map<uintptr_t, ccex::Worker*> workers;
    };
    WorkerImp * _workerImp = nullptr;

    void worker_eventHandler(ccex::Worker* worker,int type,std::string message ){
        if (_workerImp != nullptr){
            _workerImp->postEventToMain(worker->id,type,message);
        }
    }
}

namespace {
    static bool js_worker_constructor(se::State &s) { // NOLINT
        const auto &args = s.args();
        size_t argc = args.size();
        bool ok = true;
        if (argc == 2 && _workerImp) {
            uint32_t id;
            std::string path;
            ok = sevalue_to_native(args[0], &id);
            ok &= sevalue_to_native(args[1], &path);
            auto worker = _workerImp->createWorker(id,path);
            worker->postEventToMainThread = worker_eventHandler;
            worker->start();
            return ok;
        }
        return false;
    }
    SE_BIND_FUNC(js_worker_constructor)

    static bool js_worker_postMessage(se::State &s) { // NOLINT
        const auto &args = s.args();
        size_t argc = args.size();
        bool ok = true;
        if (argc == 2 && _workerImp) {
            uint32_t id;
            ok = sevalue_to_native(args[0], &id);
            auto worker = _workerImp->getWorker(id);
            if (worker && worker->isValid()){
                std::string message;
                ok &= sevalue_to_native(args[1], &message);
                worker->postMessage(message);
            }else{
                CC_LOG_WARNING("worker(#%d) is invalid!",id);
            }
            return ok;
        }
        return false;
    }
    SE_BIND_FUNC(js_worker_postMessage)

    static bool js_worker_terminate(se::State &s) { // NOLINT
        const auto &args = s.args();
        size_t argc = args.size();
        bool ok = true;
        if (argc == 1 && _workerImp) {
            uint32_t id;
            ok = sevalue_to_native(args[0], &id);
            _workerImp->terminate(id);
            return ok;
        }
        return false;
    }
    SE_BIND_FUNC(js_worker_terminate)
}

bool jsb_register_worker(se::Object* g){
    CC_LOG_DEBUG("jsb_register_worker ");
    auto* se = se::ScriptEngine::getInstance();
    se::AutoHandleScope hs;
    auto workerImpObj = se::Object::createPlainObject();
    auto global = se->getGlobalObject();
    global->setProperty("workerImp", se::Value(workerImpObj));
    _workerImp = new WorkerImp();
    _workerImp->workerImpObj = workerImpObj;
    workerImpObj->defineFunction("js_constructor", _SE(js_worker_constructor));
    workerImpObj->defineFunction("js_postMessage", _SE(js_worker_postMessage));
    workerImpObj->defineFunction("js_terminate", _SE(js_worker_terminate));
    se->evalString(workerjs.c_str(), (uint32_t)(workerjs.size()), nullptr,"worker.js");
    se->addBeforeCleanupHook([]() {
        ccex::Worker::destroyAll();
        delete _workerImp;
        _workerImp = nullptr;
    });
    return true;
}
