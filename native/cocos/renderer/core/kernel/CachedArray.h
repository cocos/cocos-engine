#ifndef CC_CORE_KERNEL_CACHED_ARRAY_H_
#define CC_CORE_KERNEL_CACHED_ARRAY_H_

NS_CC_BEGIN

template <typename T>
class CachedArray {
 public:
  CachedArray(uint size = 1) {
    size_ = 0;
    capacity_ = std::max(size, 1U);
    array_ = new T[capacity_];
  }
  
  ~CachedArray() {
    delete [] (array_);
  }
  
  T& operator [] (int index) {
    return array_[index];
  }
  
  const T& operator [] (int index) const {
    return array_[index];
  }
  
  void Clear() {
    // memset(array_, 0, size_ * sizeof(T));
    size_ = 0;
  }
  
  void Push(T item) {
    if (size_ >= capacity_) {
      T* temp = array_;
      array_ = new T[capacity_*2];
      for (uint i = 0; i < capacity_; ++i) {
        array_[i] = temp[i];
      }
      capacity_ *= 2;
      delete [] (temp);
    }
    array_[size_++] = item;
  }
  
  T Pop() {
    return array_[size_--];
  }
  
  uint Size() const {
    return size_;
  }
  
  void Concat(const CachedArray<T>& array) {
    if (size_ + array.Size() >= capacity_) {
      T* temp = array_;
      uint size = std::max(capacity_*2, size_ + array.Size());
      array_ = new T[size];
      for (uint i = 0; i < capacity_; ++i) {
        array_[i] = temp[i];
      }
      capacity_ = size;
      delete [] (temp);
    }
    for (uint i = 0; i < array.Size(); ++i) {
      array_[size_++] = array[i];
    }
  }
  
 private:
  uint size_ = 0;
  uint capacity_ = 0;
  T* array_ = nullptr;
};

NS_CC_END

#endif // CC_CORE_KERNEL_CACHED_ARRAY_H_
