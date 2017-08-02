#pragma once

#include "Value.hpp"

namespace se {

    class Object;

    class State final
    {
    public:
        State();
        ~State();
        State(void* nativeThisObject);
        State(void* nativeThisObject, const ValueArray& args);
        State(Object* thisObject, const ValueArray& args);

        void* nativeThisObject() const;
        const ValueArray& args() const;
        Object* thisObject();
        Value& rval();
    private:

        // Disable copy/move constructor, copy/move assigment
        State(const State&);
        State(State&&);
        State& operator=(const State&);
        State& operator=(State&&);

        void* _nativeThisObject;  //weak ref
        Object* _thisObject; //weak ref
        const ValueArray* _args; //weak ref
        Value _retVal; //weak ref
    };
}
