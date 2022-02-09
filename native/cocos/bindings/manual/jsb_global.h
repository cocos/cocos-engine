/****************************************************************************
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

#include "base/CoreStd.h"
#include "bindings/jswrapper/PrivateObject.h"
#include "jsb_global_init.h"

template <typename T, class... Args>
inline typename std::enable_if<std::is_base_of<cc::Object, T>::value, T>::type *
jsb_override_new(Args &&...args) { //NOLINT(readability-identifier-naming)
    //create object in gfx way
    return CC_NEW(T(std::forward<Args>(args)...));
}

template <typename T>
inline typename std::enable_if<std::is_base_of<cc::Object, T>::value, void>::type
jsb_override_delete(T *arg) { //NOLINT(readability-identifier-naming)
    //create object in gfx way
    CC_DELETE(arg);
}

template <typename T, class... Args>
inline typename std::enable_if<!std::is_base_of<cc::Object, T>::value, T>::type *
jsb_override_new(Args &&...args) { //NOLINT(readability-identifier-naming)
    //create object in the default way
    return new T(std::forward<Args>(args)...);
}

template <typename T>
inline typename std::enable_if<!std::is_base_of<cc::Object, T>::value, void>::type
jsb_override_delete(T *arg) { //NOLINT(readability-identifier-naming)
    //create object in gfx way
    delete (arg);
}

template <typename T, typename... ARGS>
typename std::enable_if<std::is_base_of<cc::RefCounted, T>::value, se::PrivateObjectBase *>::type
jsb_make_private_object(ARGS &&...args) { //NOLINT(readability-identifier-naming)
    //return se::raw_private_data(new T(std::forward<ARGS>(args)...));
    return se::ccshared_private_object(new T(std::forward<ARGS>(args)...));
}

template <typename T, typename... ARGS>
typename std::enable_if<!std::is_base_of<cc::RefCounted, T>::value, se::PrivateObjectBase *>::type
jsb_make_private_object(ARGS &&...args) { //NOLINT(readability-identifier-naming)
    return se::shared_private_object(std::make_shared<T>(std::forward<ARGS>(args)...));
}

#define JSB_MAKE_PRIVATE_OBJECT(kls, ...) jsb_make_private_object<kls>(__VA_ARGS__)
#define JSB_ALLOC(kls, ...)               jsb_override_new<kls>(__VA_ARGS__)
#define JSB_FREE(kls)                     jsb_override_delete(kls)
namespace se {
class Class;
class Value;
} // namespace se

bool jsb_register_global_variables(se::Object *global); //NOLINT(readability-identifier-naming)

bool jsb_set_extend_property(const char *ns, const char *clsName);                  //NOLINT(readability-identifier-naming)
bool jsb_run_script(const std::string &filePath, se::Value *rval = nullptr);        //NOLINT(readability-identifier-naming)
bool jsb_run_script_module(const std::string &filePath, se::Value *rval = nullptr); //NOLINT(readability-identifier-naming)

bool jsb_global_load_image(const std::string &path, const se::Value &callbackVal); //NOLINT(readability-identifier-naming)
