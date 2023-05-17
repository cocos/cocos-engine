/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include <type_traits>

/* This macro is used for checking whether a member function exists in a class in compiling time.
Usage:
 If we have a class called `MyClass` as follows:

 ```c++
 class MyClass {
 public:
    int myMethod(bool a, float b) { return 100; }
 };
```

Test code:
```c++
 #include "base/HasMemberFunction.h"

 CC_DEFINE_HAS_MEMBER_FUNC(myMethod)

 template <typename T>
 void myTest(T* arg0) {
    if constexpr (has_myMethod<T, int(bool, float)>::value) {
        // <1>: DO SOMETHING if T owns `myMethod` function.
        // ...
    } else {
        // <2>: DO SOMETHING if T doesn't own `myMethod` function.
        // ...
    }
 }

 static int myTestEntry() {
    MyClass a;
    myTest(&a); // --> Go to <1>
    int b;
    myTest(&b; // --> Go to <2>
 }

```
*/

#define CC_DEFINE_HAS_MEMBER_FUNC(memFunc)                                    \
    template <typename, typename T>                                           \
    struct has_##memFunc {                                                    \
        static_assert(                                                        \
            std::integral_constant<T, false>::value,                          \
            "Second template parameter needs to be of function type.");       \
    };                                                                        \
                                                                              \
    template <typename C, typename Ret, typename... Args>                     \
    struct has_##memFunc<C, Ret(Args...)> {                                   \
    private:                                                                  \
        template <typename T>                                                 \
        static constexpr auto check(T*)                                       \
            -> typename std::is_same<                                         \
                decltype(std::declval<T>().memFunc(std::declval<Args>()...)), \
                Ret>::type;                                                   \
                                                                              \
        template <typename>                                                   \
        static constexpr std::false_type check(...);                          \
        typedef decltype(check<C>(0)) type;                                   \
                                                                              \
    public:                                                                   \
        static constexpr bool value = type::value;                            \
    };

namespace cc {

CC_DEFINE_HAS_MEMBER_FUNC(setScriptObject)
CC_DEFINE_HAS_MEMBER_FUNC(getScriptObject)

} // namespace cc
