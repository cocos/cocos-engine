/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

#pragma once

#include "../config.h"

#if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8

    #include "../PrivateObject.h"
    #include "Base.h"

namespace se {

class ObjectWrap {
public:
    ObjectWrap();
    ~ObjectWrap();

    bool init(v8::Local<v8::Object> handle, Object *parent, bool registerWeak);
    using FinalizeFunc = void (*)(Object *seObj);
    void setFinalizeCallback(FinalizeFunc finalizeCb);

    v8::Local<v8::Object>       handle();
    v8::Local<v8::Object>       handle(v8::Isolate *isolate);
    v8::Persistent<v8::Object> &persistent();

    void         wrap(void *nativeObj, uint32_t fieldIndex);
    static void *unwrap(v8::Local<v8::Object> handle, uint32_t fieldIndex);
    /* Ref() marks the object as being attached to an event loop.
         * Refed objects will not be garbage collected, even if
         * all references are lost.
         */
    void ref();

    /* Unref() marks an object as detached from the event loop.  This is its
         * default state.  When an object with a "weak" reference changes from
         * attached to detached state it will be freed. Be careful not to access
         * the object after making this call as it might be gone!
         * (A "weak reference" means an object that only has a
         * persistent handle.)
         *
         * DO NOT CALL THIS FROM DESTRUCTOR
         */
    void unref();

private:
    static void weakCallback(const v8::WeakCallbackInfo<Object> &data);

    void makeWeak();

    int                        _refs{0}; // ro
    v8::Persistent<v8::Object> _handle;
    FinalizeFunc               _finalizeCb{nullptr};
    Object *                   _parent{nullptr};

    bool _registerWeak{false};
};

} // namespace se

#endif // #if SCRIPT_ENGINE_TYPE == SCRIPT_ENGINE_V8
