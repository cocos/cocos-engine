/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#include "AssemblerBase.hpp"

RENDERER_BEGIN

AssemblerBase::AssemblerBase()
{
    
}

AssemblerBase::~AssemblerBase()
{
    if (_jsDirty)
    {
        _jsDirty->unroot();
        _jsDirty->decRef();
        _jsDirty = nullptr;
    }
    _dirty = nullptr;
    _dirtyLen = 0;
}

void AssemblerBase::setDirty(se_object_ptr jsDirty)
{
    if (_jsDirty == jsDirty) return;
    
    if (_jsDirty)
    {
        _jsDirty->unroot();
        _jsDirty->decRef();
        _jsDirty = nullptr;
    }
    
    if (jsDirty == nullptr) return;
    
    _jsDirty = jsDirty;
    _jsDirty->root();
    _jsDirty->incRef();
    _dirty = nullptr;
    _dirtyLen = 0;
    _jsDirty->getTypedArrayData((uint8_t**)&_dirty, &_dirtyLen);
}

RENDERER_END
