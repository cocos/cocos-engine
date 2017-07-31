#pragma once

namespace se {

class Object;

class HandleObject
{
public:
    HandleObject(Object* obj);
    ~HandleObject();

    inline Object* operator->() const
    {
        return _obj;
    }

    inline Object* get() const
    {
        return _obj;
    }

    inline bool isEmpty() const
    {
        return (_obj == nullptr);
    }

private:
    Object* _obj;
    friend class Object;
};

} // namespace se {
