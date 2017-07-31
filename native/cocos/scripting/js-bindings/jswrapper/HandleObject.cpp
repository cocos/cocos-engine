//
//  HandleObject.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 7/31/17.
//
//

#include "HandleObject.hpp"
#include "Object.hpp"

namespace se {

HandleObject::HandleObject(Object* obj)
: _obj(obj)
{
    if (_obj != nullptr)
    {
        _obj->root();
    }
}

HandleObject::~HandleObject()
{
    if (_obj != nullptr)
    {
        _obj->unroot();
        _obj->release();
    }
}

} // namespace se {
