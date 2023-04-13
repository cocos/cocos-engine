/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

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

namespace se {

/**
     *  This class is used to manage reference-counting providing a simple interface and a counter.
     *
     */
class RefCounter {
public:
    /**
         *  @brief Increases reference count by one.
         */
    void incRef();

    /**
         *  @brief Decrements the reference count, if it reaches zero, destroys this instance of RefCounter to release its memory.
         *  @note Please note that after calling this function, the caller should absolutely avoid to use the pointer to this instance since it may not be valid anymore.
         */
    void decRef();

    /**
         *  @brief Gets reference count.
         *  @return The reference count.
         *  @note When this goes to zero during a decRef() call, the object will auto-delete itself.
         */
    unsigned int getRefCount();

protected:
    // Default constructor
    // Initialises the internal reference count to 1.
    RefCounter();
    // Destructor
    virtual ~RefCounter();

private:
    unsigned int _refCount;
};

} // namespace se
