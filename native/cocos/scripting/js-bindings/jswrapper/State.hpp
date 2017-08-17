#pragma once

#include "Value.hpp"

namespace se {

    class Object;

    /**
     *  State represents an environment while a function or an accesstor is invoked from JavaScript.
     */
    class State final
    {
    public:
        /**
         *  @brief Gets void* pointer of `this` object's private data.
         *  @return A void* pointer of `this` object's private data.
         */
        void* nativeThisObject() const;

        /**
         *  @brief Gets the arguments of native binding functions or accesstors.
         *  @return The arguments of native binding functions or accesstors.
         */
        const ValueArray& args() const;

        /**
         *  @brief Gets the JavaScript `this` object wrapped in se::Object.
         *  @return The JavaScript `this` object wrapped in se::Object.
         */
        Object* thisObject();

        /**
         *  @brief Gets the return value reference. Used for setting return value for a function.
         *  @return The return value reference.
         */
        Value& rval();

        // Private API used in wrapper
        /**
         *  @brief
         *  @param[in]
         *  @return
         */
        State();

        /**
         *  @brief
         *  @param[in]
         *  @return
         */
        ~State();

        /**
         *  @brief
         *  @param[in]
         *  @return
         */
        State(void* nativeThisObject);

        /**
         *  @brief
         *  @param[in]
         *  @return
         */
        State(void* nativeThisObject, const ValueArray& args);

        /**
         *  @brief
         *  @param[in]
         *  @return
         */
        State(Object* thisObject, const ValueArray& args);
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
