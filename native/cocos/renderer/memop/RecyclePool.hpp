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

#ifndef RecyclePool_hpp
#define RecyclePool_hpp

#include <stdio.h>
#include "../Macro.h"
#include "../base/CCVector.h"

RENDERER_BEGIN
template<typename T>
class RecyclePool
{
public:
    typedef std::function<T*()> RecycleFunc;
    
    RecyclePool(RecycleFunc func, int size)
    : _data()
    {
        _count = 0;
        _func = func;
        _data.resize(size);
        
        for (int i = 0; i < size; i++)
        {
            _data[i] = func();
        }
    }
    
    ~RecyclePool()
    {
        for (size_t i = 0, len = _data.size(); i < len; i++)
        {
            delete _data[i];
        }
        
        _data.clear();
    }
    
    const T* getData(size_t index) const
    {
        if (index >= _count)
        {
            RENDERER_LOGW("Failed to get data %d, index not found.", index);
            return nullptr;
        }
        
        return _data[index];
    }
    
    const size_t getLength() const
    {
        return _count;
    }
    
    void reset()
    {
        _count = 0;
    }
    
    T* add()
    {
        int size = (int)_data.size();
        if (_count >= size)
        {
            resize(size * 2);
        }
        
        return _data[_count++];
    }
    
    void resize(int size)
    {
        if (size > _data.size())
        {
            for (int i = (int)_data.size(); i < size; i++)
            {
                T* data = _func();
                _data.push_back(data);
            }
        }
    }
    
    void remove(int index)
    {
        if (index >= _count)
        {
            return;
        }
        
        int last = _count - 1;
        T tmp = _data[index];
        _data[index] = _data[last];
        _data[last] = tmp;
        _count -= 1;
    }
private:
    size_t _count = 0;
    RecycleFunc _func;
    std::vector<T*> _data;

    
};
RENDERER_END

#endif /* RecyclePool_hpp */
