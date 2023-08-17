/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "bindings/utils/BindingUtils.h"
#include "bindings/jswrapper/SeApi.h"

namespace cc::bindings {

NativeMemorySharedToScriptActor::~NativeMemorySharedToScriptActor() {
    destroy();
}

void NativeMemorySharedToScriptActor::initialize(void* ptr, uint32_t byteLength) {
    CC_ASSERT_NULL(_sharedArrayBufferObject);
    // The callback of freeing buffer is empty since the memory is managed in native,
    // the external array buffer just holds a reference to the memory.
    _sharedArrayBufferObject = se::Object::createExternalArrayBufferObject(ptr, byteLength, [](void* /*contents*/, size_t /*byteLength*/, void* /*userData*/) {});
    _sharedArrayBufferObject->root();
}

void NativeMemorySharedToScriptActor::destroy() {
    if (_sharedArrayBufferObject != nullptr) {
        _sharedArrayBufferObject->unroot();
        _sharedArrayBufferObject->decRef();
        _sharedArrayBufferObject = nullptr;
    }
}

} // namespace cc::bindings
