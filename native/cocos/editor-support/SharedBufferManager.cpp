/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "SharedBufferManager.h"
#include "base/Macros.h"

MIDDLEWARE_BEGIN

SharedBufferManager::SharedBufferManager(se::Object::TypedArrayType arrayType) : _arrayType(arrayType) {
    init();
}

SharedBufferManager::~SharedBufferManager() {
    CC_SAFE_DELETE(_buffer);
}

void SharedBufferManager::afterCleanupHandle() {
    if (_buffer) {
        delete _buffer;
        _buffer = nullptr;
    }
    se::ScriptEngine::getInstance()->addAfterInitHook([this] { init(); });
}

void SharedBufferManager::init() {
    if (!_buffer) {
        _buffer = new IOTypedArray(_arrayType, INIT_RENDER_INFO_BUFFER_SIZE);
        _buffer->setResizeCallback([this] {
            if (_resizeCallback) {
                _resizeCallback();
            }
        });
    }
    se::ScriptEngine::getInstance()->addAfterCleanupHook([this] { afterCleanupHandle(); });
}

MIDDLEWARE_END
