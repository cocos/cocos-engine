//
//  Ref.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 4/27/17.
//
//

#include "Ref.hpp"

namespace se {

    void Ref::addRef()
    {
        ++_refCount;
    }

    void Ref::release()
    {
        --_refCount;
        if (_refCount == 0)
        {
            delete this;
        }
    }

    unsigned int Ref::getReferenceCount()
    {
        return _refCount;
    }

    Ref::Ref()
    : _refCount(1)
    {

    }

    Ref::~Ref()
    {

    }

} // namespace se {
