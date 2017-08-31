//
//  Ref.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 4/27/17.
//
//

#include "RefCounter.hpp"

namespace se {

    void RefCounter::incRef()
    {
        ++_refCount;
    }

    void RefCounter::decRef()
    {
        --_refCount;
        if (_refCount == 0)
        {
            delete this;
        }
    }

    unsigned int RefCounter::getRefCount()
    {
        return _refCount;
    }

    RefCounter::RefCounter()
    : _refCount(1)
    {
    }

    RefCounter::~RefCounter()
    {
    }

} // namespace se {
