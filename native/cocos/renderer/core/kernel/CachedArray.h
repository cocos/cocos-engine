#ifndef CC_CORE_KERNEL_CACHED_ARRAY_H_
#define CC_CORE_KERNEL_CACHED_ARRAY_H_

namespace cc {

template <typename T>
class CachedArray {
 public:
  CachedArray(uint size = 1) {
    _size = 0;
    _capacity = std::max(size, 1U);
    _array = new T[_capacity];
  }
  
  ~CachedArray() {
    delete [] (_array);
  }
  
  T& operator [] (int index) {
    return _array[index];
  }
  
  const T& operator [] (int index) const {
    return _array[index];
  }
  
  void clear() {
    // memset(_array, 0, _size * sizeof(T));
    _size = 0;
  }
  
  void push(T item) {
    if (_size >= _capacity) {
      T* temp = _array;
      _array = new T[_capacity*2];
      for (uint i = 0; i < _capacity; ++i) {
        _array[i] = temp[i];
      }
      _capacity *= 2;
      delete [] (temp);
    }
    _array[_size++] = item;
  }
  
  T pop() {
    return _array[--_size];
  }
  
  uint size() const {
    return _size;
  }
  
  void concat(const CachedArray<T>& array) {
    if (_size + array.size() >= _capacity) {
      T* temp = _array;
      uint size = std::max(_capacity*2, _size + array.size());
      _array = new T[size];
      for (uint i = 0; i < _capacity; ++i) {
        _array[i] = temp[i];
      }
      _capacity = size;
      delete [] (temp);
    }
    for (uint i = 0; i < array.size(); ++i) {
      _array[_size++] = array[i];
    }
  }
  
 private:
  uint _size = 0;
  uint _capacity = 0;
  T* _array = nullptr;
};

}

#endif // CC_CORE_KERNEL_CACHED_ARRAY_H_
