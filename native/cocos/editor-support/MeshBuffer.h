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
#pragma once

#include "IOBuffer.h"
#include <vector>

MIDDLEWARE_BEGIN

class MeshBuffer
{
public:
    MeshBuffer(int vertexFormat);
    ~MeshBuffer();

    uint32_t getGLVB()
    {
        return _glVBArr[_bufferPos];
    }
    
    uint32_t getGLIB()
    {
        return _glIBArr[_bufferPos];
    }
    
    IOBuffer& getVB()
    {
        return _vb;
    }
    
    IOBuffer& getIB()
    {
        return _ib;
    }
    
    void uploadVB();
    void uploadIB();
    void reset();
private:
    void next();
private:
    std::vector<uint32_t> _glIBArr;
    std::vector<uint32_t> _glVBArr;
    
    std::size_t _bufferPos = 0;
    IOBuffer _vb;
    IOBuffer _ib;
};

MIDDLEWARE_END
