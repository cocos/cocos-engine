/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include "GFXDef.h"

namespace cc {
namespace gfx {

class GFXObject {
public:
    explicit GFXObject(ObjectType type);
    virtual ~GFXObject() = default;

    inline ObjectType getObjectType() const { return _objectType; }
    inline uint32_t getObjectID() const { return _objectID; }
    inline uint32_t getTypedID() const { return _typedID; }

    inline static uint32_t getObjectID(const GFXObject *obj) {
        return obj == nullptr ? INVALID_OBJECT_ID : obj->getObjectID();
    }

protected:
    template <typename T>
    static uint32_t generateObjectID() noexcept {
        static uint32_t generator = 1 << 16;
        return ++generator;
    }

    static constexpr uint32_t INVALID_OBJECT_ID = 0;
    ObjectType _objectType = ObjectType::UNKNOWN;
    uint32_t _objectID = 0U;

    uint32_t _typedID = 0U; // inited by sub-classes
};

} // namespace gfx
} // namespace cc
