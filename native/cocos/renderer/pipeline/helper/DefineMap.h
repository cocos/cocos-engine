/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
#pragma once

#include "../../core/CoreStd.h"
#include "base/Macros.h"
#include "cocos/bindings/jswrapper/Object.h"

using namespace std;
namespace cc {
namespace pipeline {

class CC_DLL DefineMap final : public Object {
public:
    DefineMap();
    ~DefineMap();

    CC_INLINE se::Object *getObject() const { return _jsbMacros; }
    CC_INLINE void getValue(const String &name, se::Value *value) const { _jsbMacros->getProperty(name.c_str(), value); }

    template <class T, class RET = void>
    ENABLE_IF_T3_RET(float, bool, String)
    setValue(const String &name, const T &value) { se::Value v(value); _jsbMacros->setProperty(name.c_str(), v); }

private:
    se::Object *_jsbMacros = nullptr;
};

} // namespace pipeline
} // namespace cc
