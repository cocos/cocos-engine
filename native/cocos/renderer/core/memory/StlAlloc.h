#ifndef CC_CORE_STL_ALLOC_H_
#define CC_CORE_STL_ALLOC_H_

#include "MemDef.h"
#include <queue>
#include <set>

NS_CC_BEGIN

// Base STL allocator class.
template<typename T>
struct STLAllocatorBase {
  // base class for generic allocators
	typedef T value_type;
};

// Base STL allocator class. (const T version).
template<typename T>
struct STLAllocatorBase<const T> {
  // base class for generic allocators for const T
	typedef T value_type;
};

template<typename T, typename AllocPolicy>
class SA : public STLAllocatorBase<T> {
 public:
	/// define our types, as per ISO C++
	typedef STLAllocatorBase<T>			  Base;
	typedef typename Base::value_type	value_type;
	typedef value_type*					      pointer;
	typedef const value_type*			    const_pointer;
	typedef value_type&					      reference;
	typedef const value_type&			    const_reference;
	typedef std::size_t					      size_type;
	typedef std::ptrdiff_t				    difference_type;


	/// the standard rebind mechanism
	template <typename U>
	struct rebind {
		typedef SA<U, AllocPolicy> other;
	};

	/// ctor
	inline explicit SA() {}

	/// dtor
	virtual ~SA() {}

	/// copy ctor - done component wise
	inline SA(SA const&) {}

	/// cast
	template <typename U>
	inline SA(SA<U, AllocPolicy> const&) {}

	/// cast
	template <typename U, typename P>
	inline SA(SA<U, P> const&) {}

	inline pointer allocate(size_type count, typename std::allocator<void>::const_pointer ptr = 0) {
		(void)ptr;

		// convert request to bytes
		register size_type sz = count * sizeof(T);
		return static_cast<pointer>(AllocPolicy::AllocateBytes(sz));
	}

	inline void deallocate(pointer ptr, size_type) {
		AllocPolicy::DeallocateBytes(ptr);
	}

	pointer address(reference x) const {
		return &x;
	}

	const_pointer address(const_reference x) const {
		return &x;
	}

	size_type max_size() const throw() {
		return size_t(-1) / sizeof(T);
	}

#if __cplusplus >= 201103L
	template<typename Up, typename... Args>
	void construct(Up* p, Args&&... args) {
		::new((void *)p) Up(std::forward<Args>(args)...);
	}

	template<typename Up>
	void destroy(Up* p) {
		p->~Up();
	}
#else
	void construct(pointer p, const T& val) {
		// call placement new
		::new((void *)p) T(val);
	}

	void destroy(pointer p) {
		// do we have to protect against non-classes here?
		// some articles suggest yes, some no
		p->~T();
	}
#endif
};

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template<typename T, typename T2, typename P>
inline bool operator ==(SA<T,P> const&, SA<T2,P> const&) {
	// same alloc policy (P), memory can be freed
	return true;
}

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template<typename T, typename P, typename OtherAllocator>
inline bool operator ==(SA<T,P> const&, OtherAllocator const&) {
	return false;
}
/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template<typename T, typename T2, typename P>
inline bool operator!=(SA<T,P> const&, SA<T2,P> const&) {
	// same alloc policy (P), memory can be freed
	return false;
}

/// determine equality, can memory from another allocator
/// be released by this allocator, (ISO C++)
template<typename T, typename P, typename OtherAllocator>
inline bool operator!=(SA<T,P> const&, OtherAllocator const&) {
	return true;
}

////////////////////////////////////////////////////////////////////
extern CC_CORE_API SA<char, STLAP> stl_char_allocator;

// for stl containers.
template <typename T, typename A = SA<T, STLAP>>
struct vector {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::vector<T, A> type;
	typedef typename std::vector<T, A>::iterator iterator;
	typedef typename std::vector<T, A>::const_iterator const_iterator;
#else
	typedef typename std::vector<T> type;
	typedef typename std::vector<T>::iterator iterator;
	typedef typename std::vector<T>::const_iterator const_iterator;
#endif
};

template <typename T, typename A = SA<T, STLAP> >
struct list {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::list<T, A> type;
	typedef typename std::list<T, A>::iterator iterator;
	typedef typename std::list<T, A>::const_iterator const_iterator;
#else
	typedef typename std::list<T> type;
	typedef typename std::list<T>::iterator iterator;
	typedef typename std::list<T>::const_iterator const_iterator;
#endif
};

template <typename T, typename A = SA<T, STLAP> >
struct queue {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::queue<T, A> type;
	typedef typename std::queue<T, A>::iterator iterator;
	typedef typename std::queue<T, A>::const_iterator const_iterator;
#else
	typedef typename std::queue<T> type;
	typedef typename std::queue<T>::iterator iterator;
	typedef typename std::queue<T>::const_iterator const_iterator;
#endif
};

template <typename T, typename C = typename vector<T>::type, typename P = std::less<typename C::value_type>>
struct priority_queue {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::priority_queue<T, C, P> type;
#else
	typedef typename std::priority_queue<T, C, P> type;
#endif
};

template <typename T, typename A = SA<T, STLAP> >
struct deque {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::deque<T, A> type;
	typedef typename std::deque<T, A>::iterator iterator;
	typedef typename std::deque<T, A>::const_iterator const_iterator;
#else
	typedef typename std::deque<T> type;
	typedef typename std::deque<T>::iterator iterator;
	typedef typename std::deque<T>::const_iterator const_iterator;
#endif
};

template <typename T, typename P = std::less<T>, typename A = SA<T, STLAP>>
struct set {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::set<T, P, A> type;
	typedef typename std::set<T, P, A>::iterator iterator;
	typedef typename std::set<T, P, A>::const_iterator const_iterator;
#else
	typedef typename std::set<T, P> type;
	typedef typename std::set<T, P>::iterator iterator;
	typedef typename std::set<T, P>::const_iterator const_iterator;
#endif
};

template <typename K, typename V, typename P = std::less<K>, typename A = SA<std::pair<const K, V>, STLAP> >
struct map {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::map<K, V, P, A> type;
	typedef typename std::map<K, V, P, A>::iterator iterator;
	typedef typename std::map<K, V, P, A>::const_iterator const_iterator;
#else
	typedef typename std::map<K, V, P> type;
	typedef typename std::map<K, V, P>::iterator iterator;
	typedef typename std::map<K, V, P>::const_iterator const_iterator;
#endif
};

template <typename K, typename V, typename P = std::less<K>, typename A = SA<std::pair<const K, V>, STLAP> >
struct multimap {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::multimap<K, V, P, A> type;
	typedef typename std::multimap<K, V, P, A>::iterator iterator;
	typedef typename std::multimap<K, V, P, A>::const_iterator const_iterator;
#else
	typedef typename std::multimap<K, V, P> type;
	typedef typename std::multimap<K, V, P>::iterator iterator;
	typedef typename std::multimap<K, V, P>::const_iterator const_iterator;
#endif
};

template <typename K, typename V, typename H = std::hash<K>, typename P = std::equal_to<K>, typename A = SA<std::pair<const K, V>, STLAP>>
struct unordered_map {
#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
	typedef typename std::unordered_map<K, V, H, P, A> type;
	typedef typename std::unordered_map<K, V, H, P, A>::iterator iterator;
	typedef typename std::unordered_map<K, V, H, P, A>::const_iterator const_iterator;
#else
	typedef typename std::unordered_map<K, V, H, P> type;
	typedef typename std::unordered_map<K, V, H, P>::iterator iterator;
	typedef typename std::unordered_map<K, V, H, P>::const_iterator const_iterator;
#endif
};

#define StdStringT(T) std::basic_string<T, std::char_traits<T>, std::allocator<T> >	
#define CustomMemoryStringT(T) std::basic_string<T, std::char_traits<T>, SA<T, STLAP> >

template<typename T>
bool operator <(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0,l.length(), o.c_str(), o.length()) < 0;
}
template<typename T>
bool operator <(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0,l.length(), o.c_str(), o.length()) < 0;
}
template<typename T>
bool operator <=(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(),o.length()) <= 0;
}
template<typename T>
bool operator <=(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) <= 0;
}
template<typename T>
bool operator >(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) > 0;
}
template<typename T>
bool operator >(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) > 0;
}
template<typename T>
bool operator >=(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) >= 0;
}
template<typename T>
bool operator >=(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) >= 0;
}

template<typename T>
bool operator ==(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) == 0;
}
template<typename T> bool operator ==(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) == 0;
}

template<typename T>
bool operator !=(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length())!=0;
}
template<typename T>
bool operator !=(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return l.compare(0, l.length(), o.c_str(), o.length()) != 0;
}

template<typename T>
CustomMemoryStringT(T) operator +=(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return CustomMemoryStringT(T)(l) += o.c_str();
}
template<typename T>
CustomMemoryStringT(T) operator +=(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return CustomMemoryStringT(T)(l.c_str()) += o.c_str();
}

template<typename T>
CustomMemoryStringT(T) operator +(const CustomMemoryStringT(T)& l, const StdStringT(T)& o) {
	return CustomMemoryStringT(T)(l) += o.c_str();
}

template<typename T>
CustomMemoryStringT(T) operator +(const StdStringT(T)& l, const CustomMemoryStringT(T)& o) {
	return CustomMemoryStringT(T)(l.c_str()) += o.c_str();
}

template<typename T>
CustomMemoryStringT(T) operator +(const T* l, const CustomMemoryStringT(T)& o) {
	return CustomMemoryStringT(T)(l) += o;
}

#undef StdStringT
#undef CustomMemoryStringT

#if (CC_STL_MEMORY_ALLOCATOR == CC_STL_MEMORY_ALLOCATOR_CUSTOM)
typedef std::basic_string<char, std::char_traits<char>, SA<char, STLAP>> String;
typedef std::basic_string<wchar_t, std::char_traits<wchar_t>, SA<wchar_t, STLAP>>	WString;
#else
typedef std::string  String;
typedef std::wstring WString;
#endif

typedef vector<String>::type		StringArray;

NS_CC_END

#endif // CC_CORE_STL_ALLOC_H_
