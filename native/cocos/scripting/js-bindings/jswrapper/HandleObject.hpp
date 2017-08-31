#pragma once

namespace se {

class Object;

/**
 * HandleObject is a helper class for easily release, root and unroot an non-native-binding se::Object.

    {
        se::HandleObject obj(se::Object::createPlainObject());
        obj->setProperty(...);
        otherObject->setProperty("foo", se::Value(obj));
    }
 
    is equal to:

    {
        se::Object* obj = se::Object::createPlainObject();
        obj->root(); // root after object created to avoid object is garbage collected

        obj->setProperty(...);
        otherObject->setProperty("foo", se::Value(obj));
        
        obj->unroot(); // unroot object after obj is used.
        obj->decRef(); // Decrement referent count to avoid memory leak.
    }
 
 HandleObject should not be used to create a native binding object since the created binding object
 should be holded by JavaScript VM and released in finalize callback internally.

 */
class HandleObject
{
public:
    /**
     *  @brief The constructor of HandleObject
     *  @param[in] obj The se::Object to attach.
     */
    HandleObject(Object* obj);

    /**
     *  @brief The destructor of HandleObject
     */
    ~HandleObject();

    /**
     *  @brief The pointer operator
     *  @return The se::Object attached.
     */
    inline Object* operator->() const
    {
        return _obj;
    }

    /**
     *  @brief Gets the se::Object attached.
     *  @return The se::Object attached.
     */
    inline Object* get() const
    {
        return _obj;
    }

    /**
     *  @brief Tests whether HandleObject holds an invalid se::Object.
     *  @return true if HandleObject holds an invalid se::Object, otherwise false.
     */
    inline bool isEmpty() const
    {
        return (_obj == nullptr);
    }

private:
    Object* _obj;
    friend class Object;
};

} // namespace se {
