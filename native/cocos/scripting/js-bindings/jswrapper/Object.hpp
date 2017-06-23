#pragma once

#include "config.hpp"

#ifdef SCRIPT_ENGINE_SM
#include "sm/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_V8
#include "v8/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_JSC
#include "jsc/Object.hpp"
#endif

#ifdef SCRIPT_ENGINE_CHAKRACORE
#include "chakracore/Object.hpp"
#endif

namespace se {

    class StackRootedObject
    {
    public:
        StackRootedObject(Object* obj)
        {
            assert(obj != nullptr);
            if (!obj->isRooted())
            {
                _obj = obj;
                _obj->addRef();
                LOGD("%s, switchToRooted!", __FUNCTION__);
                _obj->switchToRooted();
            }
            else
            {
                _obj = nullptr;
            }
        }

        ~StackRootedObject()
        {
            if (_obj != nullptr)
            {
                _obj->switchToUnrooted();
                _obj->release();
            }
        }

    private:
        StackRootedObject(const StackRootedObject&) = delete;
        StackRootedObject(StackRootedObject&&) = delete;
        StackRootedObject& operator=(const StackRootedObject&) = delete;
        StackRootedObject& operator=(StackRootedObject&&) = delete;
        void* operator new(size_t size) = delete;

        Object* _obj;
    };


} // namespace se {
