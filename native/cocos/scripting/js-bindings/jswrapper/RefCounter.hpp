#pragma once

namespace se {

    /**
     *  This class is used to manage reference-counting providing a simple interface and a counter.
     *
     */
    class RefCounter
    {
    public:
        /**
         *  @brief Increases reference count by one.
         */
        void incRef();

        /**
         *  @brief Decrements the reference count, if it reaches zero, destroys this instance of RefCounter to release its memory.
         *  @note Please note that after calling this function, the caller should absolutely avoid to use the pointer to this instance since it may not be valid anymore.
         */
        void decRef();

        /**
         *  @brief Gets reference count.
         *  @return The reference count.
         *  @note When this goes to zero during a decRef() call, the object will auto-delete itself.
         */
        unsigned int getRefCount();

    protected:
        // Default constructor
        // Initialises the internal reference count to 1.
        RefCounter();
        // Destructor
        virtual ~RefCounter();

    private:
        unsigned int _refCount;
    };

} // namespace se {
