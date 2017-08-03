#pragma once

namespace se {

    /**
     *  Ref class represent reference counting stuff, instance will be deleted while its reference count is zero.
     */
    class Ref
    {
    public:
        /**
         *  @brief Increases reference count by one.
         */
        void addRef();

        /**
         *  @brief Decrease reference count by one.
         */
        void release();

        /**
         *  @brief Gets reference count.
         *  @return The reference count.
         */
        unsigned int getReferenceCount();

    protected:
        Ref();
        virtual ~Ref();

    private:
        unsigned int _refCount;
    };

} // namespace se {
