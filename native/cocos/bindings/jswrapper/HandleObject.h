/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include <stddef.h>

namespace se {

class Object;

/**
 * HandleObject is a helper class for easily release, root and unroot an non-native-binding se::Object.

    {
        se::HandleObject obj(se::Object::createPlainObject());
        obj->setProperty(...);
        otherObject->setProperty("foo", se::Value(obj));
    }
 
    is equal to:

    {
        se::Object* obj = se::Object::createPlainObject();
        obj->root(); // root after object created to avoid object is garbage collected

        obj->setProperty(...);
        otherObject->setProperty("foo", se::Value(obj));
        
        obj->unroot(); // unroot object after obj is used.
        obj->decRef(); // Decrement referent count to avoid memory leak.
    }
 
 HandleObject should not be used to create a native binding object since the created binding object
 should be holded by JavaScript VM and released in finalize callback internally.

 */
class HandleObject {
public:
    /**
     *  @brief The constructor of HandleObject
     *  @param[in] obj The se::Object to attach.
     */
    HandleObject(Object *obj);

    /**
     *  @brief The destructor of HandleObject
     */
    ~HandleObject();

    /**
     *  @brief The pointer operator
     *  @return The se::Object attached.
     */
    inline Object *operator->() const {
        return _obj;
    }

    /**
     *  @brief Gets the se::Object attached.
     *  @return The se::Object attached.
     */
    inline Object *get() const {
        return _obj;
    }

    /**
     *  @brief Tests whether HandleObject holds an invalid se::Object.
     *  @return true if HandleObject holds an invalid se::Object, otherwise false.
     */
    inline bool isEmpty() const {
        return (_obj == nullptr);
    }

private:
    HandleObject(const HandleObject &) = delete;
    void operator=(const HandleObject &) = delete;
    HandleObject(HandleObject &&)        = delete;
    void operator=(HandleObject &&) = delete;

    void *operator new(size_t size)       = delete;
    void  operator delete(void *, size_t) = delete;

    Object *_obj;
    friend class Object;
};

} // namespace se
