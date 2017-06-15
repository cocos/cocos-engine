#pragma once

namespace se {

    class Ref
    {
    public:
        void addRef();
        void release();
        unsigned int getReferenceCount();

    protected:
        Ref();
        virtual ~Ref();

    private:
        unsigned int _refCount;
    };

} // namespace se {
