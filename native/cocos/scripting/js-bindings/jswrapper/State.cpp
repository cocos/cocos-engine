//
//  State.cpp
//  cocos2d_js_bindings
//
//  Created by guanghui on 5/27/17.
//
//

#include "State.hpp"
#include "Object.hpp"

namespace se {

    State::State()
    : _nativeThisObject(nullptr)
    , _thisObject(nullptr)
    , _args(nullptr)
    {
        
    }
    
    State::~State()
    {
        SAFE_RELEASE(_thisObject);
    }
    
    State::State(void* nativeThisObject)
    : _nativeThisObject(nativeThisObject)
    , _thisObject(nullptr)
    , _args(nullptr)
    {
    }
    
    State::State(void* nativeThisObject, const ValueArray& args)
    : _nativeThisObject(nativeThisObject)
    , _thisObject(nullptr)
    , _args(&args)
    {
    }
    
    State::State(Object* thisObject, const ValueArray& args)
    : _nativeThisObject(nullptr)
    , _thisObject(thisObject) //FIXME: need to retain thisObject, and remove addRef in constructor and ctor bindings code.
    , _args(&args)
    {
    }
    
    void* State::nativeThisObject() const
    {
        return _nativeThisObject;
    }

    const ValueArray& State::args() const
    {
        if (_args != nullptr)
        {
            return *(_args);
        }
        return EmptyValueArray;
    }

    Object* State::thisObject()
    {
        if (nullptr == _thisObject && nullptr != _nativeThisObject)
        {
            _thisObject = se::Object::getObjectWithPtr(_nativeThisObject);
        }
        // _nativeThisObject in Static method will be nullptr
//        assert(_thisObject != nullptr);
        return _thisObject;
    }
    
    Value& State::rval()
    {
        return _retVal;
    }
} // namespace se {
