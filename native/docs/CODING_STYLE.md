# ![][1] C++ coding style

_v0.1 - Last updated March 22, 2021_

_Forked from [Google's C++ coding style](https://google.github.io/styleguide/cppguide.html.md)_

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*
- [Header Files](#header-files)
  - [The #pragma Guard](#the-pragma-guard)
  - [Forward Declarations](#forward-declarations)
  - [Inline Functions](#inline-functions)
  - [The -inl.h Files](#the--inlh-files)
  - [Function Parameter Ordering](#function-parameter-ordering)
  - [Names and Order of Includes](#names-and-order-of-includes)
- [Scoping](#scoping)
  - [Namespaces](#namespaces)
  - [Internal Linkage](#internal-linkage)
  - [Nonmember, Static Member, and Global Functions](#nonmember-static-member-and-global-functions)
  - [Local Variables](#local-variables)
  - [Static and Global Variables](#static-and-global-variables)
    - [Decision on destrcution:](#decision-on-destrcution)
    - [Decision on initialization](#decision-on-initialization)
    - [Common patterns](#common-patterns)
  - [thread_local variables](#thread_local-variables)
- [Classes](#classes)
  - [Doing Work in Constructors](#doing-work-in-constructors)
  - [Implicit Conversions](#implicit-conversions)
  - [Copyable and Movable Types](#copyable-and-movable-types)
  - [Structs vs. Classes](#structs-vs-classes)
  - [Structs vs. Pairs and Tuples](#structs-vs-pairs-and-tuples)
  - [Inheritance](#inheritance)
  - [Operator Overloading](#operator-overloading)
  - [Access Control](#access-control)
  - [Declaration Order](#declaration-order)
  - [Explicitly declare all constructors, destructor and assignment operators](#explicitly-declare-all-constructors-destructor-and-assignment-operators)
- [Functions](#functions)
  - [Inputs and Outputs](#inputs-and-outputs)
  - [Write Short Functions](#write-short-functions)
  - [Function Overloading](#function-overloading)
  - [Default Arguments](#default-arguments)
- [Other C++ Features](#other-c-features)
  - [Rvalue references](#rvalue-references)
  - [Friends](#friends)
  - [Exceptions](#exceptions)
  - [noexcept](#noexcept)
  - [Casting](#casting)
  - [Streams](#streams)
  - [Preincrement and Predecrement](#preincrement-and-predecrement)
  - [Use of const](#use-of-const)
    - [Where to put the const](#where-to-put-the-const)
  - [Use of constexpr](#use-of-constexpr)
  - [Integer Types](#integer-types)
  - [64-bit Portability](#64-bit-portability)
  - [Preprocessor Macros](#preprocessor-macros)
  - [0 and nullptr/NULL](#0-and-nullptrnull)
  - [Type Deduction (including auto)](#type-deduction-including-auto)
  - [Lambda Expressions](#lambda-expressions)
  - [Template Metaprogramming](#template-metaprogramming)
  - [Boost](#boost)
  - [Naming](#naming)
  - [File Names](#file-names)
  - [Type Names](#type-names)
  - [Variable Names](#variable-names)
    - [Common Variable names](#common-variable-names)
    - [Class Data Members](#class-data-members)
  - [Struct Data Members](#struct-data-members)
  - [Constant Names](#constant-names)
  - [Function Names](#function-names)
  - [Namespace Names](#namespace-names)
  - [Enumerator Names](#enumerator-names)
  - [Macro Names](#macro-names)
  - [Braced initialization](#braced-initialization)
- [Formatting](#formatting)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Header Files

In general, every `.cpp` file should have an associated `.h` file. There are some common exceptions, such as unittests and small `.cpp` files containing just a `main()` function.

Correct use of header files can make a huge difference to the readability, size and performance of your code.

The following rules will guide you through the various pitfalls of using header files.

## The #pragma Guard

All header files should have `#pragma once` guards to prevent multiple inclusion.

```cpp
#pragma once
```

## Forward Declarations

You may forward declare ordinary classes in order to avoid unnecessary `#includes`.

**Definition:** A "forward declaration" is a declaration of a class, function, or template without an associated definition. #include lines can often be replaced with forward declarations of whatever symbols are actually used by the client code.

**Pros:**

* Unnecessary #includes force the compiler to open more files and process more input.
* They can also force your code to be recompiled more often, due to changes in the header.

**Cons:**

* It can be difficult to determine the correct form of a forward declaration in the presence of features like templates, typedefs, default parameters, and using declarations.
* It can be difficult to determine whether a forward declaration or a full #include is needed for a given piece of code, particularly when implicit conversion operations are involved. In extreme cases, replacing an #include with a forward declaration can silently change the meaning of code.
* Forward declaring multiple symbols from a header can be more verbose than simply `#include`ing the header.
* Forward declarations of functions and templates can prevent the header owners from making otherwise-compatible changes to their APIs; for example, widening a parameter type, or adding a template parameter with a default value.
* Forward declaring symbols from namespace `std::` usually yields undefined behavior.
* Structuring code to enable forward declarations (e.g. using pointer members instead of object members) can make the code slower and more complex.
* The practical efficiency benefits of forward declarations are unproven.

**Decision:**

* When using a function declared in a header file, always #include that header.
* When using a class template, prefer to #include its header file.
* When using an ordinary class, relying on a forward declaration is OK, but be wary of situations where a forward declaration may be insufficient or incorrect; when in doubt, just #include the appropriate header.
* Do not replace data members with pointers just to avoid an #include.

Always #include the file that actually provides the declarations/definitions you need; do not rely on the symbol being brought in transitively via headers not directly included. One exception is that `Myfile.cpp` may rely on #includes and forward declarations from its corresponding header file `Myfile.h`.

## Inline Functions

Define functions inline only when they are small, say, 10 lines or less.

**Definition:**

You can declare functions in a way that allows the compiler to expand them inline rather than calling them through the usual function call mechanism.

**Pros:** 

Inlining a function can generate more efficient object code, as long as the inlined function is small. Feel free to inline accessors and mutators, and other short, performance-critical functions.

**Cons:** 

Overuse of inlining can actually make programs slower. Depending on a function's size, inlining it can cause the code size to increase or decrease. Inlining a very small accessor function will usually decrease code size while inlining a very large function can dramatically increase code size. On modern processors smaller code usually runs faster due to better use of the instruction cache.

**Decision:**

A decent rule of thumb is to not inline a function if it is more than 10 lines long. Beware of destructors, which are often longer than they appear because of implicit member- and base-destructor calls!

Another useful rule of thumb: it's typically not cost effective to inline functions with loops or switch statements (unless, in the common case, the loop or switch statement is never executed).

It is important to know that functions are not always inlined even if they are declared as such; for example, virtual and recursive functions are not normally inlined. Usually recursive functions should not be inline. The main reason for making a virtual function inline is to place its definition in the class, either for convenience or to document its behavior, e.g., for accessors and mutators.

## The -inl.h Files

You may use file names with a `-inl.h` suffix to define complex inline functions when needed.

The definition of an inline function needs to be in a header file, so that the compiler has the definition available for inlining at the call sites. However, implementation code properly belongs in `.cpp` files, and we do not like to have much actual code in `.h` files unless there is a readability or performance advantage.

If an inline function definition is short, with very little, if any, logic in it, you should put the code in your `.h` file. For example, accessors and mutators should certainly be inside a class definition. More complex inline functions may also be put in a `.h` file for the convenience of the implementer and callers, though if this makes the .h file too unwieldy you can instead put that code in a separate `-inl.h` file. This separates the implementation from the class definition, while still allowing the implementation to be included where necessary.

Another use of `-inl.h` files is for definitions of function templates. This can be used to keep your template definitions easy to read.

Do not forget that a `-inl.h` file requires a #pragma guard just like any other header file.

## Function Parameter Ordering

When defining a function, parameter order is: inputs, then outputs.

Parameters to C/C++ functions are either input to the function, output from the function, or both. Input parameters are usually `values` or `const references`, while output and input/output parameters will be `non-const pointers` . When ordering function parameters, put all input-only parameters before any output parameters. In particular, do not add new parameters to the end of the function just because they are new; place new input-only parameters before the output parameters.

This is not a hard-and-fast rule. Parameters that are both input and output (often classes/structs) muddy the waters, and, as always, consistency with related functions may require you to bend the rule.

## Names and Order of Includes

Use standard order for readability and to avoid hidden dependencies: C library, C++ library, other libraries' `.h`, your project's `.h`.

All of a project's header files should be listed as descendants of the project's source directory without use of UNIX directory shortcuts . (the current directory) or .. (the parent directory). For example, google-awesome-project/src/base/logging.h should be included as

```cpp
#include "base/logging.h"
```

In `dir/foo.cpp` or `dir/foo_test.cpp`, whose main purpose is to implement or test the stuff in `dir2/foo2.h`, order your includes as follows:

* dir2/foo2.h (preferred location — see details below).
* C system files.
* C++ system files.
* Other libraries' .h files.
* Your project's .h files.

With the preferred ordering, if `dir2/foo2.h` omits any necessary includes, the build of `dir/foo.cpp` or `dir/foo_test.cpp` will break. Thus, this rule ensures that build breaks show up first for the people working on these files, not for innocent people in other packages.

`dir/foo.cpp` and `dir2/foo2.h` are often in the same directory (e.g. `base/basictypes_test.cpp` and `base/basictypes.h`), but can be in different directories too.

Within each section the includes should be ordered alphabetically. Note that older code might not conform to this rule and should be fixed when convenient.

For example, the includes in `engine-native/cocos/math/Math.cpp` might look like this:

```cpp
#include "math/Math.h"  // Preferred location.

#include <algorithm>
#include <cmath>
#include <cstring>
#include <cctype>

#include "base/basictypes.h"
#include "base/commandlineflags.h"
#include "foo/public/bar.h"
```

Exception: sometimes, system-specific code needs conditional includes. Such code can put conditional includes after other includes. Of course, keep your system-specific code small and localized. Example:

```cpp
#include "foo/public/fooserver.h"

#include "base/port.h" 

// For LANG_CXX11.
#ifdef LANG_CXX11
#include <initializer_list>
#endif  // LANG_CXX11
```

# Scoping

## Namespaces

With few exceptions, place code in a namespace. Namespaces should have unique names based on the project name, and possibly its path. Do not use using-directives (e.g., `using namespace foo`). Do not use inline namespaces. For unnamed namespaces, see [Internal Linkage](#internal-linkage).

**Definition:**

 Namespaces subdivide the global scope into distinct, named scopes, and so are useful for preventing name collisions in the global scope.

**Pros**

Namespaces provide a method for preventing name conflicts in large programs while allowing most code to use reasonably short names.

For example, if two different projects have a class Foo in the global scope, these symbols may collide at compile time or at runtime. If each project places their code in a namespace, `project1::Foo` and `project2::Foo` are now distinct symbols that do not collide, and code within each project's namespace can continue to refer to Foo without the prefix.

Inline namespaces automatically place their names in the enclosing scope. Consider the following snippet, for example:

```c++
namespace outer {
inline namespace inner {
  void foo();
}  // namespace inner
}  // namespace outer
```
The expressions `outer::inner::foo()` and `outer::foo()` are interchangeable. Inline namespaces are primarily intended for ABI compatibility across versions.

**Cons**

Namespaces can be confusing, because they complicate the mechanics of figuring out what definition a name refers to.

Inline namespaces, in particular, can be confusing because names aren't actually restricted to the namespace where they are declared. They are only useful as part of some larger versioning policy.

In some contexts, it's necessary to repeatedly refer to symbols by their fully-qualified names. For deeply-nested namespaces, this can add a lot of clutter.

**Decision**

Namespaces should be used as follows:

- Follow the rules on [Namesapce Names](#namespace-names).
- Terminate multi-line namespaces with comments as shown in the given examples.
- Do not declare anything in namespace std, including forward declarations of standard library classes. Declaring entities in namespace std is undefined behavior, i.e., not portable. To declare entities from the standard library, include the appropriate header file.
- You may not use a using-directive to make all names from a namespace available.
  ```c++
  // Forbidden -- This pollutes the namespace.
  using namespace foo;
  ```
- Do not use Namespace aliases at namespace scope in header files except in explicitly marked internal-only namespaces, because anything imported into a namespace in a header file becomes part of the public API exported by that file.
  ```c++
  // Shorten access to some commonly used names in .cpp files.
  namespace baz = ::foo::bar::baz;
  ```
  ```c++
  // Shorten access to some commonly used names (in a .h file).
  namespace librarian {
  namespace impl {  // Internal, not part of the API.
  namespace sidetable = ::pipeline_diagnostics::sidetable;
  }  // namespace impl

  inline void myInlineFunction() {
  // namespace alias local to a function (or method).
  namespace baz = ::foo::bar::baz;
  ...
  }
  }  // namespace librarian
  ```
- Do not use inline namespaces.

## Internal Linkage

When definitions in a `.cpp` file do not need to be referenced outside that file, give them internal linkage by placing them in an unnamed namespace or declaring them static. Do not use either of these constructs in .h files.

**Definition:**

All declarations can be given internal linkage by placing them in unnamed namespaces. Functions and variables can also be given internal linkage by declaring them static. This means that anything you're declaring can't be accessed from another file. If a different file declares something with the same name, then the two entities are completely independent.

**Decision:**

Use of internal linkage in `.cpp` files is encouraged for all code that does not need to be referenced elsewhere. Do not use internal linkage in `.h` files.

Format unnamed namespaces like named namespaces. In the terminating comment, leave the namespace name empty:
```c++
namespace {
...
}  // namespace
```

## Nonmember, Static Member, and Global Functions

Prefer placing nonmember functions in a namespace; use completely global functions rarely. Do not use a class simply to group static members. Static methods of a class should generally be closely related to instances of the class or the class's static data.

**Pros:**

Nonmember and static member functions can be useful in some situations. Putting nonmember functions in a namespace avoids polluting the global namespace.

**Cons:**

Nonmember and static member functions may make more sense as members of a new class, especially if they access external resources or have significant dependencies.

**Decision:**

Sometimes it is useful to define a function not bound to a class instance. Such a function can be either a static member or a nonmember function. Nonmember functions should not depend on external variables, and should nearly always exist in a namespace. Do not create classes only to group static members; this is no different than just giving the names a common prefix, and such grouping is usually unnecessary anyway.

If you define a nonmember function and it is only needed in its `.cpp` file, use [Internal Linkage](#internal-linkage) to limit its scope.

## Local Variables

Place a function's variables in the narrowest scope possible, and initialize variables in the declaration.

C++ allows you to declare variables anywhere in a function. We encourage you to declare them in as local a scope as possible, and as close to the first use as possible. This makes it easier for the reader to find the declaration and see what type the variable is and what it was initialized to. In particular, initialization should be used instead of declaration and assignment, e.g.

```cpp
int i;
i = f();      // Bad -- initialization separate from declaration.

int j = g();  // Good -- declaration has initialization.

vector<int> v;
v.push_back(1);  // Prefer initializing using brace initialization.
v.push_back(2);

vector<int> v = {1, 2};  // Good -- v starts initialized.
```

Variables needed for if, while and for statements should normally be declared within those statements, so that such variables are confined to those scopes. E.g.:

```cpp
while (const char* p = strchr(str, '/')) str = p + 1;
```

There is one caveat: if the variable is an object, its constructor is invoked every time it enters scope and is created, and its destructor is invoked every time it goes out of scope.

```cpp
// Inefficient implementation:
for (int i = 0; i < 1000000; ++i) {
    Foo f;  // My ctor and dtor get called 1000000 times each.
    f.doSomething(i);
}

It may be more efficient to declare such a variable used in a loop outside that loop:

Foo f;  // My ctor and dtor get called once each.
for (int i = 0; i < 1000000; ++i) {
    f.doSomething(i);
}
```

## Static and Global Variables

Objects with [static storage duration](https://en.cppreference.com/w/cpp/language/storage_duration#Storage_duration) are forbidden unless they are [trivially destructible](https://en.cppreference.com/w/cpp/types/is_destructible). Informally this means that the destructor does not do anything, even taking member and base destructors into account. More formally it means that the type has no user-defined or virtual destructor and that all bases and non-static members are trivially destructible. Static function-local variables may use dynamic initialization. Use of dynamic initialization for static class member variables or variables at namespace scope is discouraged, but allowed in limited circumstances; see below for details.

As a rule of thumb: a global variable satisfies these requirements if its declaration, considered in isolation, could be constexpr.

**Pros:**

Global and static variables are very useful for a large number of applications: named constants, auxiliary data structures internal to some translation unit, command-line flags, logging, registration mechanisms, background infrastructure, etc.

**Cons:**

Global and static variables that use dynamic initialization or have non-trivial destructors create complexity that can easily lead to hard-to-find bugs. Dynamic initialization is not ordered across translation units, and neither is destruction (except that destruction happens in reverse order of initialization). When one initialization refers to another variable with static storage duration, it is possible that this causes an object to be accessed before its lifetime has begun (or after its lifetime has ended). Moreover, when a program starts threads that are not joined at exit, those threads may attempt to access objects after their lifetime has ended if their destructor has already run.

**Decision:**

### Decision on destrcution:

When destructors are trivial, their execution is not subject to ordering at all (they are effectively not "run"); otherwise we are exposed to the risk of accessing objects after the end of their lifetime. Therefore, we only allow objects with static storage duration if they are trivially destructible. Fundamental types (like pointers and int) are trivially destructible, as are arrays of trivially destructible types. Note that variables marked with constexpr are trivially destructible.

```c++
const int kNum = 10;  // allowed

struct X { int n; };
const X kX[] = {{1}, {2}, {3}};  // allowed

void foo() {
  static const char* const kMessages[] = {"hello", "world"};  // allowed
}

// allowed: constexpr guarantees trivial destructor
constexpr std::array<int, 3> kArray = {{1, 2, 3}};
```
```c++
// bad: non-trivial destructor
const std::string kFoo = "foo";

// bad for the same reason, even though kBar is a reference (the
// rule also applies to lifetime-extended temporary objects)
const std::string& kBar = StrCat("a", "b", "c");

void bar() {
  // bad: non-trivial destructor
  static std::map<int, int> kData = {{1, 0}, {2, 0}, {3, 0}};
}
```
Note that references are not objects, and thus they are not subject to the constraints on destructibility. The constraint on dynamic initialization still applies, though. In particular, a function-local static reference of the form `static T& t = *new T;` is allowed.

### Decision on initialization

Initialization is a more complex topic. This is because we must not only consider whether class constructors execute, but we must also consider the evaluation of the initializer:

```c++
int n = 5;    // fine
int m = f();  // ? (depends on f)
Foo x;        // ? (depends on Foo::Foo)
Bar y = g();  // ? (depends on g and on Bar::Bar)
```

All but the first statement expose us to indeterminate initialization ordering.

The concept we are looking for is called constant initialization in the formal language of the C++ standard. It means that the initializing expression is a constant expression, and if the object is initialized by a constructor call, then the constructor must be specified as constexpr, too:

```c++
struct Foo { constexpr Foo(int) {} };

int n = 5;  // fine, 5 is a constant expression
Foo x(2);   // fine, 2 is a constant expression and the chosen constructor is constexpr
Foo a[] = { Foo(1), Foo(2), Foo(3) };  // fine
```

Constant initialization is always allowed. Constant initialization of static storage duration variables should be marked with constexpr. Any non-local static storage duration variable that is not so marked should be presumed to have dynamic initialization, and reviewed very carefully.

By contrast, the following initializations are problematic:
```c++
// Some declarations used below.
time_t time(time_t*);      // not constexpr!
int f();                   // not constexpr!
struct Bar { Bar() {} };

// Problematic initializations.
time_t m = time(nullptr);  // initializing expression not a constant expression
Foo y(f());                // ditto
Bar b;                     // chosen constructor Bar::Bar() not constexpr
```

Dynamic initialization of nonlocal variables is discouraged, and in general it is forbidden. However, we do permit it if no aspect of the program depends on the sequencing of this initialization with respect to all other initializations. Under those restrictions, the ordering of the initialization does not make an observable difference. For example:

```c++
int p = getpid();  // allowed, as long as no other static variable
                   // uses p in its own initialization
```

Dynamic initialization of static local variables is allowed (and common).

### Common patterns

- Global strings: if you require a global or static string constant, consider using a simple character array, or a char pointer to the first element of a string literal. String literals have static storage duration already and are usually sufficient.
- Maps, sets, and other dynamic containers: if you require a static, fixed collection, such as a set to search against or a lookup table, you cannot use the dynamic containers from the standard library as a static variable, since they have non-trivial destructors. Instead, consider a simple array of trivial types, e.g., an array of arrays of ints (for a "map from int to int"), or an array of pairs (e.g., pairs of `int` and `const char*`). For small collections, linear search is entirely sufficient (and efficient, due to memory locality). If necessary, keep the collection in sorted order and use a binary search algorithm. If you do really prefer a dynamic container from the standard library, consider using a function-local static pointer, as described below.
- Static variables of custom types: if you require static, constant data of a type that you need to define yourself, give the type a trivial destructor and a constexpr constructor.
- If all else fails, you can create an object dynamically and never delete it by using a function-local static pointer or reference (e.g., `static const auto& impl = *new T(args...);`).


## thread_local variables

thread_local variables that aren't declared inside a function must be initialized with a true compile-time constant. Prefer thread_local over other ways of defining thread-local data.

**Definition:**

Starting with C++11, variables can be declared with the thread_local specifier:
```c++
thread_local Foo foo = ...;
```

Such a variable is actually a collection of objects, so that when different threads access it, they are actually accessing different objects. thread_local variables are much like [static storage duration variables](#static_storage_duration_variables) in many respects. For instance, they can be declared at namespace scope, inside functions, or as static class members, but not as ordinary class members.

thread_local variable instances are initialized much like static variables, except that they must be initialized separately for each thread, rather than once at program startup. This means that thread_local variables declared within a function are safe, but other thread_local variables are subject to the same initialization-order issues as static variables (and more besides).

thread_local variable instances are destroyed when their thread terminates, so they do not have the destruction-order issues of static variables.

**Pros:**
- Thread-local data is inherently safe from races (because only one thread can ordinarily access it), which makes thread_local useful for concurrent programming.
- thread_local is the only standard-supported way of creating thread-local data.

**Cons:**
- Accessing a thread_local variable may trigger execution of an unpredictable and uncontrollable amount of other code.
- thread_local variables are effectively global variables, and have all the drawbacks of global variables other than lack of thread-safety.
- The memory consumed by a thread_local variable scales with the number of running threads (in the worst case), which can be quite large in a program.
- An ordinary class member cannot be thread_local.
- thread_local may not be as efficient as certain compiler intrinsics.

**Decision:**

thread_local variables inside a function have no safety concerns, so they can be used without restriction. Note that you can use a function-scope thread_local to simulate a class- or namespace-scope thread_local by defining a function or static method that exposes it:

```c++
Foo& MyThreadLocalFoo() {
  thread_local Foo result = ComplicatedInitialization();
  return result;
}
```

thread_local variables at class or namespace scope must be initialized with a true compile-time constant (i.e., they must have no dynamic initialization).

thread_local should be preferred over other mechanisms for defining thread-local data.

# Classes

Classes are the fundamental unit of code in C++. Naturally, we use them extensively. This section lists the main dos and don'ts you should follow when writing a class.

## Doing Work in Constructors

Avoid virtual method calls in constructors, and avoid initialization that can fail if you can't signal an error.

**Definition:**

It is possible to perform initialization in the body of the constructor.

**Pros:**
- No need to worry about whether the class has been initialized or not.
- Objects that are fully initialized by constructor call can be const and may also be easier to use with standard containers or algorithms.

**Cons:**
- If the work calls virtual functions, these calls will not get dispatched to the subclass implementations. Future modification to your class can quietly introduce this problem even if your class is not currently subclassed, causing much confusion.
- There is no easy way for constructors to signal errors, short of crashing the program (not always appropriate) or using exceptions (which are forbidden).
- If the work fails, we now have an object whose initialization code failed, so it may be an unusual state requiring a bool IsValid() state checking mechanism (or similar) which is easy to forget to call.
- You cannot take the address of a constructor, so whatever work is done in the constructor cannot easily be handed off to, for example, another thread.

**Decision:**

Constructors should never call virtual functions. If appropriate for your code , terminating the program may be an appropriate error handling response. Otherwise, consider a factory function or Init() method as described in [TotW #42](https://abseil.io/tips/42). Avoid Init() methods on objects with no other states that affect which public methods may be called (semi-constructed objects of this form are particularly hard to work with correctly).


## Implicit Conversions

Do not define implicit conversions. Use the explicit keyword for conversion operators and single-argument constructors.

**Definition:**

Implicit conversions allow an object of one type (called the source type) to be used where a different type (called the destination type) is expected, such as when passing an int argument to a function that takes a double parameter.

In addition to the implicit conversions defined by the language, users can define their own, by adding appropriate members to the class definition of the source or destination type. An implicit conversion in the source type is defined by a type conversion operator named after the destination type (e.g., `operator bool()`). An implicit conversion in the destination type is defined by a constructor that can take the source type as its only argument (or only argument with no default value).

The explicit keyword can be applied to a constructor or (since C++11) a conversion operator, to ensure that it can only be used when the destination type is explicit at the point of use, e.g., with a cast. This applies not only to implicit conversions, but to C++11's list initialization syntax:
```c++
class Foo {
  explicit Foo(int x, double y);
  ...
};

void Func(Foo f);
```

```c++
Func({42, 3.14});  // Error
```

This kind of code isn't technically an implicit conversion, but the language treats it as one as far as explicit is concerned.

**Pros:**
- Implicit conversions can make a type more usable and expressive by eliminating the need to explicitly name a type when it's obvious.
- Implicit conversions can be a simpler alternative to overloading, such as when a single function with a string_view parameter takes the place of separate overloads for `std::string` and `const char*`.
- List initialization syntax is a concise and expressive way of initializing objects.

**Cons:**
- Implicit conversions can hide type-mismatch bugs, where the destination type does not match the user's expectation, or the user is unaware that any conversion will take place.
- Implicit conversions can make code harder to read, particularly in the presence of overloading, by making it less obvious what code is actually getting called.
- Constructors that take a single argument may accidentally be usable as implicit type conversions, even if they are not intended to do so.
- When a single-argument constructor is not marked explicit, there's no reliable way to tell whether it's intended to define an implicit conversion, or the author simply forgot to mark it.
- Implicit conversions can lead to call-site ambiguities, especially when there are bidirectional implicit conversions. This can be caused either by having two types that both provide an implicit conversion, or by a single type that has both an implicit constructor and an implicit type conversion operator.
- List initialization can suffer from the same problems if the destination type is implicit, particularly if the list has only a single element.

**Decision:**

Type conversion operators, and constructors that are callable with a single argument, must be marked explicit in the class definition. As an exception, copy and move constructors should not be explicit, since they do not perform type conversion.

Implicit conversions can sometimes be necessary and appropriate for types that are designed to be interchangeable, for example when objects of two types are just different representations of the same underlying value. In that case, contact your project leads to request a waiver of this rule.

Constructors that cannot be called with a single argument may omit explicit. Constructors that take a single `std::initializer_list` parameter should also omit explicit, in order to support copy-initialization (e.g., `MyType m = {1, 2};`).


## Copyable and Movable Types

A class's public API must make clear whether the class is copyable, move-only, or neither copyable nor movable. Support copying and/or moving if these operations are clear and meaningful for your type.

**Definition:**

A movable type is one that can be initialized and assigned from temporaries.

A copyable type is one that can be initialized or assigned from any other object of the same type (so is also movable by definition), with the stipulation that the value of the source does not change. `std::unique_ptr<int>` is an example of a movable but not copyable type (since the value of the source `std::unique_ptr<int>` must be modified during assignment to the destination). int and std::string are examples of movable types that are also copyable. (For int, the move and copy operations are the same; for std::string, there exists a move operation that is less expensive than a copy.)

For user-defined types, the copy behavior is defined by the copy constructor and the copy-assignment operator. Move behavior is defined by the move constructor and the move-assignment operator, if they exist, or by the copy constructor and the copy-assignment operator otherwise.

The copy/move constructors can be implicitly invoked by the compiler in some situations, e.g., when passing objects by value.

**Pros:**

Objects of copyable and movable types can be passed and returned by value, which makes APIs simpler, safer, and more general. Unlike when passing objects by pointer or reference, there's no risk of confusion over ownership, lifetime, mutability, and similar issues, and no need to specify them in the contract. It also prevents non-local interactions between the client and the implementation, which makes them easier to understand, maintain, and optimize by the compiler. Further, such objects can be used with generic APIs that require pass-by-value, such as most containers, and they allow for additional flexibility in e.g., type composition.

Copy/move constructors and assignment operators are usually easier to define correctly than alternatives like `clone()`, `copyFrom()` or `swap()`, because they can be generated by the compiler, either implicitly or with `= default`. They are concise, and ensure that all data members are copied. Copy and move constructors are also generally more efficient, because they don't require heap allocation or separate initialization and assignment steps, and they're eligible for optimizations such as [copy elision](https://en.cppreference.com/w/cpp/language/copy_elision).

Move operations allow the implicit and efficient transfer of resources out of rvalue objects. This allows a plainer coding style in some cases.

**Cons:**

Some types do not need to be copyable, and providing copy operations for such types can be confusing, nonsensical, or outright incorrect. Types representing singleton objects (Registerer), objects tied to a specific scope (Cleanup), or closely coupled to object identity (Mutex) cannot be copied meaningfully. Copy operations for base class types that are to be used polymorphically are hazardous, because use of them can lead to [object slicing](https://en.wikipedia.org/wiki/Object_slicing). Defaulted or carelessly-implemented copy operations can be incorrect, and the resulting bugs can be confusing and difficult to diagnose.

Copy constructors are invoked implicitly, which makes the invocation easy to miss. This may cause confusion for programmers used to languages where pass-by-reference is conventional or mandatory. It may also encourage excessive copying, which can cause performance problems.

**Decision:**

Every class's public interface must make clear which copy and move operations the class supports. This should usually take the form of explicitly declaring and/or deleting the appropriate operations in the public section of the declaration.

Specifically, a copyable class should explicitly declare the copy operations, a move-only class should explicitly declare the move operations, and a non-copyable/movable class should explicitly delete the copy operations. A copyable class may also declare move operations in order to support efficient moves. Explicitly declaring or deleting all four copy/move operations is permitted, but not required. If you provide a copy or move assignment operator, you must also provide the corresponding constructor.

```c++
class Copyable {
 public:
  Copyable(const Copyable& other) = default;
  Copyable& operator=(const Copyable& other) = default;

  // The implicit move operations are suppressed by the declarations above.
  // You may explicitly declare move operations to support efficient moves.
};

class MoveOnly {
 public:
  MoveOnly(MoveOnly&& other) = default;
  MoveOnly& operator=(MoveOnly&& other) = default;

  // The copy operations are implicitly deleted, but you can
  // spell that out explicitly if you want:
  MoveOnly(const MoveOnly&) = delete;
  MoveOnly& operator=(const MoveOnly&) = delete;
};

class NotCopyableOrMovable {
 public:
  // Not copyable or movable
  NotCopyableOrMovable(const NotCopyableOrMovable&) = delete;
  NotCopyableOrMovable& operator=(const NotCopyableOrMovable&)
      = delete;

  // The move operations are implicitly disabled, but you can
  // spell that out explicitly if you want:
  NotCopyableOrMovable(NotCopyableOrMovable&&) = delete;
  NotCopyableOrMovable& operator=(NotCopyableOrMovable&&)
      = delete;
};
```

These declarations/deletions can be omitted only if they are obvious:
- If the class has no private section, like a struct or an interface-only base class, then the copyability/movability can be determined by the copyability/movability of any public data members.
- If a base class clearly isn't copyable or movable, derived classes naturally won't be either. An interface-only base class that leaves these operations implicit is not sufficient to make concrete subclasses clear.
- Note that if you explicitly declare or delete either the constructor or assignment operation for copy, the other copy operation is not obvious and must be declared or deleted. Likewise for move operations.

A type should not be copyable/movable if the meaning of copying/moving is unclear to a casual user, or if it incurs unexpected costs. Move operations for copyable types are strictly a performance optimization and are a potential source of bugs and complexity, so avoid defining them unless they are significantly more efficient than the corresponding copy operations. If your type provides copy operations, it is recommended that you design your class so that the default implementation of those operations is correct. Remember to review the correctness of any defaulted operations as you would any other code.

Due to the risk of slicing, prefer to avoid providing a public assignment operator or copy/move constructor for a class that's intended to be derived from (and prefer to avoid deriving from a class with such members). If your base class needs to be copyable, provide a public virtual clone() method, and a protected copy constructor that derived classes can use to implement it.

## Structs vs. Classes

Use a struct only for passive objects that carry data; everything else is a class.

The struct and class keywords behave almost identically in C++. We add our own semantic meanings to each keyword, so you should use the appropriate keyword for the data-type you're defining.

structs should be used for passive objects that carry data, and may have associated constants, but lack any functionality other than access/setting the data members. The accessing/setting of fields is done by directly accessing the fields rather than through method invocations. Methods should not provide behavior but should only be used to set up the data members, e.g., `constructor`, `destructor`, `initialize()`, `reset()`, `validate()`.

If more functionality is required, a class is more appropriate. If in doubt, make it a class.

For consistency with STL, you can use struct instead of class for stateless types, such as traits, template metafunctions, and some functors.

Note that member variables in structs and classes have different naming rules.

## Structs vs. Pairs and Tuples

Prefer to use a struct instead of a pair or a tuple whenever the elements can have meaningful names.

While using pairs and tuples can avoid the need to define a custom type, potentially saving work when writing code, a meaningful field name will almost always be much clearer when reading code than .first, .second, or `std::get<X>`. While C++14's introduction of `std::get<Type>` to access a tuple element by type rather than index (when the type is unique) can sometimes partially mitigate this, a field name is usually substantially clearer and more informative than a type.

Pairs and tuples may be appropriate in generic code where there are not specific meanings for the elements of the pair or tuple. Their use may also be required in order to interoperate with existing code or APIs.

## Inheritance

Composition is often more appropriate than inheritance. When using inheritance, make it public.

**Definition:**

When a sub-class inherits from a base class, it includes the definitions of all the data and operations that the base class defines. "Interface inheritance" is inheritance from a pure abstract base class (one with no state or defined methods); all other inheritance is "implementation inheritance".

**Pros:**

Implementation inheritance reduces code size by re-using the base class code as it specializes an existing type. Because inheritance is a compile-time declaration, you and the compiler can understand the operation and detect errors. Interface inheritance can be used to programmatically enforce that a class expose a particular API. Again, the compiler can detect errors, in this case, when a class does not define a necessary method of the API.

**Cons:**

For implementation inheritance, because the code implementing a sub-class is spread between the base and the sub-class, it can be more difficult to understand an implementation. The sub-class cannot override functions that are not virtual, so the sub-class cannot change implementation.

Multiple inheritance is especially problematic, because it often imposes a higher performance overhead (in fact, the performance drop from single inheritance to multiple inheritance can often be greater than the performance drop from ordinary to virtual dispatch), and because it risks leading to "diamond" inheritance patterns, which are prone to ambiguity, confusion, and outright bugs.

**Decision:**

All inheritance should be public. If you want to do private inheritance, you should be including an instance of the base class as a member instead.

Do not overuse implementation inheritance. Composition is often more appropriate. Try to restrict use of inheritance to the "is-a" case: Bar subclasses Foo if it can reasonably be said that Bar "is a kind of" Foo.

Limit the use of protected to those member functions that might need to be accessed from subclasses. Note that data members should be private.

Explicitly annotate overrides of virtual functions or virtual destructors with exactly one of an override or (less frequently) final specifier. Do not use virtual when declaring an override. Rationale: A function or destructor marked override or final that is not an override of a base class virtual function will not compile, and this helps catch common errors. The specifiers serve as documentation; if no specifier is present, the reader has to check all ancestors of the class in question to determine if the function or destructor is virtual or not.

Multiple inheritance is permitted, but multiple implementation inheritance is strongly discouraged.

## Operator Overloading

Overload operators judiciously. Do not use user-defined literals.

**Definition:**

C++ permits user code to declare overloaded versions of the built-in operators using the operator keyword, so long as one of the parameters is a user-defined type. The operator keyword also permits user code to define new kinds of literals using operator" ", and to define type-conversion functions such as operator bool(). 

**Pros:**

Operator overloading can make code more concise and intuitive by enabling user-defined types to behave the same as built-in types. Overloaded operators are the idiomatic names for certain operations (e.g., ==, <, =, and <<), and adhering to those conventions can make user-defined types more readable and enable them to interoperate with libraries that expect those names.

User-defined literals are a very concise notation for creating objects of user-defined types.

**Cons:**

- Providing a correct, consistent, and unsurprising set of operator overloads requires some care, and failure to do so can lead to confusion and bugs.
Overuse of operators can lead to obfuscated code, particularly if the overloaded operator's semantics don't follow convention.
- The hazards of function overloading apply just as much to operator overloading, if not more so.
- Operator overloads can fool our intuition into thinking that expensive operations are cheap, built-in operations.
- Finding the call sites for overloaded operators may require a search tool that's aware of C++ syntax, rather than e.g., grep.
- If you get the argument type of an overloaded operator wrong, you may get a different overload rather than a compiler error. For example, foo < bar may do one thing, while `&foo < &bar` does something totally different.
- Certain operator overloads are inherently hazardous. Overloading unary & can cause the same code to have different meanings depending on whether the overload declaration is visible. Overloads of &&, ||, and , (comma) cannot match the evaluation-order semantics of the built-in operators.
- Operators are often defined outside the class, so there's a risk of different files introducing different definitions of the same operator. If both definitions are linked into the same binary, this results in undefined behavior, which can manifest as subtle run-time bugs.
- User-defined literals (UDLs) allow the creation of new syntactic forms that are unfamiliar even to experienced C++ programmers, such as "Hello World"sv as a shorthand for `std::string_view("Hello World")`. Existing notations are clearer, though less terse.
- Because they can't be namespace-qualified, uses of UDLs also require use of either using-directives (which we ban) or using-declarations (which we ban in header files except when the imported names are part of the interface exposed by the header file in question). Given that header files would have to avoid UDL suffixes, we prefer to avoid having conventions for literals differ between header files and source files.

**Decision:**

Define overloaded operators only if their meaning is obvious, unsurprising, and consistent with the corresponding built-in operators. For example, use | as a bitwise- or logical-or, not as a shell-style pipe.

Define operators only on your own types. More precisely, define them in the same headers, .cc files, and namespaces as the types they operate on. That way, the operators are available wherever the type is, minimizing the risk of multiple definitions. If possible, avoid defining operators as templates, because they must satisfy this rule for any possible template arguments. If you define an operator, also define any related operators that make sense, and make sure they are defined consistently. For example, if you overload <, overload all the comparison operators, and make sure < and > never return true for the same arguments.

Prefer to define non-modifying binary operators as non-member functions. If a binary operator is defined as a class member, implicit conversions will apply to the right-hand argument, but not the left-hand one. It will confuse your users if a < b compiles but b < a doesn't.

Don't go out of your way to avoid defining operator overloads. For example, prefer to define ==, =, and <<, rather than `equals()`, `copyFrom()`, and `printTo()`. Conversely, don't define operator overloads just because other libraries expect them. For example, if your type doesn't have a natural ordering, but you want to store it in a `std::set`, use a custom comparator rather than overloading <.

Do not overload &&, ||, , (comma), or unary &. Do not overload operator"", i.e., do not introduce user-defined literals. Do not use any such literals provided by others (including the standard library).

Type conversion operators are covered in the section on implicit conversions. The = operator is covered in the section on copy constructors. Overloading << for use with streams is covered in the section on streams. See also the rules on function overloading, which apply to operator overloading as well.

## Access Control

Make classes' data members private, unless they are constants. This simplifies reasoning about invariants, at the cost of some easy boilerplate in the form of accessors (usually const) if necessary.

For technical reasons, we allow data members of a test fixture class defined in a .cpp file to be protected when using Google Test). If a test fixture class is defined outside of the .cpp file it is used in, for example in a .h file, make data members private.

## Declaration Order

Group similar declarations together, placing public parts earlier.

A class definition should usually start with a public: section, followed by protected:, then private:. Omit sections that would be empty.

Within each section, prefer grouping similar kinds of declarations together, and prefer the following order: types (including typedef, using, and nested structs and classes), constants, factory functions, constructors and assignment operators, destructor, all other methods, data members.

Do not put large method definitions inline in the class definition. Usually, only trivial or performance-critical, and very short, methods may be defined inline. See Inline Functions for more details.

## Explicitly declare all constructors, destructor and assignment operators

Compiler will implicitly generates these functions if they are not explicitly declared:
- constructor
- destructor
- copy constructor
- move constructor
- copy assignment operator
- move assignment operator

Should explicitly declare these functions, if some functions are not needed, should declare them as `delete`, for example:
```c++
class Foo {
public:
    Foo() = default;
    ~Foo() = default;
    Foo(const Foo &) = delete;
    Foo(Foo &&) = delete;
    Foo &operator(const Foo &) = delete;
    Foo &operator(Foo &&) = delete;
};
```

# Functions

## Inputs and Outputs

The output of a C++ function is naturally provided via a return value and sometimes via output parameters (or in/out parameters).

Prefer using return values over output parameters: they improve readability, and often provide the same or better performance.

Prefer to return by value or, failing that, return by reference. Avoid returning a pointer unless it can be null.

Parameters are either inputs to the function, outputs from the function, or both. Non-optional input parameters should usually be values or const references, while non-optional output and input/output parameters should usually be references (which cannot be null).

Avoid defining functions that require a const reference parameter to outlive the call, because const reference parameters bind to temporaries. Instead, find a way to eliminate the lifetime requirement (for example, by copying the parameter), or pass it by const pointer and document the lifetime and non-null requirements.

When ordering function parameters, put all input-only parameters before any output parameters. In particular, do not add new parameters to the end of the function just because they are new; place new input-only parameters before the output parameters. This is not a hard-and-fast rule. Parameters that are both input and output muddy the waters, and, as always, consistency with related functions may require you to bend the rule. Variadic functions may also require unusual parameter ordering.

## Write Short Functions

Prefer small and focused functions.

We recognize that long functions are sometimes appropriate, so no hard limit is placed on functions length. If a function exceeds about 40 lines, think about whether it can be broken up without harming the structure of the program.

Even if your long function works perfectly now, someone modifying it in a few months may add new behavior. This could result in bugs that are hard to find. Keeping your functions short and simple makes it easier for other people to read and modify your code.

You could find long and complicated functions when working with some code. Do not be intimidated by modifying existing code: if working with such a function proves to be difficult, you find that errors are hard to debug, or you want to use a piece of it in several different contexts, consider breaking up the function into smaller and more manageable pieces.

## Function Overloading

Use overloaded functions (including constructors) only if a reader looking at a call site can get a good idea of what is happening without having to first figure out exactly which overload is being called.

**Definition:**

You may write a function that takes a const std::string& and overload it with another that takes const char*. However, in this case consider std::string_view instead.

```c++
class MyClass {
 public:
  void Analyze(const std::string &text);
  void Analyze(const char *text, size_t textlen);
};
```

**Pros:**

Overloading can make code more intuitive by allowing an identically-named function to take different arguments. It may be necessary for templatized code, and it can be convenient for Visitors.

Overloading based on const or ref qualification may make utility code more usable, more efficient, or both. (See [TotW 148](https://abseil.io/tips/148) for more.)

**Cons:**

If a function is overloaded by the argument types alone, a reader may have to understand C++'s complex matching rules in order to tell what's going on. Also many people are confused by the semantics of inheritance if a derived class overrides only some of the variants of a function.

**Decision:**

You may overload a function when there are no semantic differences between variants. These overloads may vary in types, qualifiers, or argument count. However, a reader of such a call must not need to know which member of the overload set is chosen, only that something from the set is being called. If you can document all entries in the overload set with a single comment in the header, that is a good sign that it is a well-designed overload set.

## Default Arguments

Default arguments are allowed on non-virtual functions when the default is guaranteed to always have the same value. Follow the same restrictions as for function overloading, and prefer overloaded functions if the readability gained with default arguments doesn't outweigh the downsides below.

**Pros:**

Often you have a function that uses default values, but occasionally you want to override the defaults. Default parameters allow an easy way to do this without having to define many functions for the rare exceptions. Compared to overloading the function, default arguments have a cleaner syntax, with less boilerplate and a clearer distinction between 'required' and 'optional' arguments.

**Cons:**

Defaulted arguments are another way to achieve the semantics of overloaded functions, so all the reasons not to overload functions apply.

The defaults for arguments in a virtual function call are determined by the static type of the target object, and there's no guarantee that all overrides of a given function declare the same defaults.

Default parameters are re-evaluated at each call site, which can bloat the generated code. Readers may also expect the default's value to be fixed at the declaration instead of varying at each call.

Function pointers are confusing in the presence of default arguments, since the function signature often doesn't match the call signature. Adding function overloads avoids these problems.

**Decision:**

Default arguments are banned on virtual functions, where they don't work properly, and in cases where the specified default might not evaluate to the same value depending on when it was evaluated. (For example, don't write `void f(int n = counter++);`.)

In some other cases, default arguments can improve the readability of their function declarations enough to overcome the downsides above, so they are allowed. When in doubt, use overloads.

# Other C++ Features

## Rvalue references

Use rvalue references only in certain special cases listed below.



**Definition:** 

Rvalue references are a type of reference that can only bind to temporary objects. The syntax is similar to traditional reference syntax. For example, `void f(std::string&& s)`; declares a function whose argument is an rvalue reference to a `std::string`.

When the token '&&' is applied to an unqualified template argument in a function parameter, special template argument deduction rules apply. Such a reference is called forwarding reference.

**Pros:**

- Defining a move constructor (a constructor taking an rvalue reference to the class type) makes it possible to move a value instead of copying it. If v1 is a `std::vector<std::string>`, for example, then `auto v2(std::move(v1))` will probably just result in some simple pointer manipulation instead of copying a large amount of data. In many cases this can result in a major performance improvement.
- Rvalue references make it possible to implement types that are movable but not copyable, which can be useful for types that have no sensible definition of copying but where you might still want to pass them as function arguments, put them in containers, etc.
- std::move is necessary to make effective use of some standard-library types, such as `std::unique_ptr`.
- Forwarding references which use the rvalue reference token, make it possible to write a generic function wrapper that forwards its arguments to another function, and works whether or not its arguments are temporary objects and/or const. This is called 'perfect forwarding'.

**Cons:**

- Rvalue references are not yet widely understood. Rules like reference collapsing and the special deduction rule for forwarding references are somewhat obscure.
- Rvalue references are often misused. Using rvalue references is counter-intuitive in signatures where the argument is expected to have a valid specified state after the function call, or where no move operation is performed.

**Decision:**

Do not use rvalue references (or apply the && qualifier to methods), except as follows:
- You may use them to define move constructors and move assignment operators (as described in Copyable and Movable Types).
- You may use them to define &&-qualified methods that logically "consume" *this, leaving it in an unusable or empty state. Note that this applies only to method qualifiers (which come after the closing parenthesis of the function signature); if you want to "consume" an ordinary function parameter, prefer to pass it by value.
- You may use forwarding references in conjunction with `std::forward`, to support perfect forwarding.
- You may use them to define pairs of overloads, such as one taking Foo&& and the other taking const Foo&. Usually the preferred solution is just to pass by value, but an overloaded pair of functions sometimes yields better performance and is sometimes necessary in generic code that needs to support a wide variety of types. As always: if you're writing more complicated code for the sake of performance, make sure you have evidence that it actually helps.

## Friends

We allow use of friend classes and functions, within reason.

Friends should usually be defined in the same file so that the reader does not have to look in another file to find uses of the private members of a class. A common use of friend is to have a FooBuilder class be a friend of Foo so that it can construct the inner state of Foo correctly, without exposing this state to the world. In some cases it may be useful to make a unittest class a friend of the class it tests.

Friends extend, but do not break, the encapsulation boundary of a class. In some cases this is better than making a member public when you want to give only one other class access to it. However, most classes should interact with other classes solely through their public members.

## Exceptions

We do not use C++ exceptions.

## noexcept

Specify noexcept when it is useful and correct.

**Definition:**

The noexcept specifier is used to specify whether a function will throw exceptions or not. If an exception escapes from a function marked noexcept, the program crashes via std::terminate.

The noexcept operator performs a compile-time check that returns true if an expression is declared to not throw any exceptions.

**Pros:**

- Specifying move constructors as noexcept improves performance in some cases, e.g., `std::vector<T>::resize()` moves rather than copies the objects if T's move constructor is noexcept.
- Specifying noexcept on a function can trigger compiler optimizations in environments where exceptions are enabled, e.g., compiler does not have to generate extra code for stack-unwinding, if it knows that no exceptions can be thrown due to a noexcept specifier.

**Cons:**
- In projects following this guide that have exceptions disabled it is hard to ensure that noexcept specifiers are correct, and hard to define what correctness even means.
- It's hard, if not impossible, to undo noexcept because it eliminates a guarantee that callers may be relying on, in ways that are hard to detect.

**Decision:**

You may use noexcept when it is useful for performance if it accurately reflects the intended semantics of your function, i.e., that if an exception is somehow thrown from within the function body then it represents a fatal error. You can assume that noexcept on move constructors has a meaningful performance benefit. If you think there is significant performance benefit from specifying noexcept on some other function, please discuss it with your project leads.

Prefer unconditional noexcept if exceptions are completely disabled (i.e., most Google C++ environments). Otherwise, use conditional noexcept specifiers with simple conditions, in ways that evaluate false only in the few cases where the function could potentially throw. The tests might include type traits check on whether the involved operation might throw (e.g., `std::is_nothrow_move_constructible` for move-constructing objects), or on whether allocation can throw. Note in many cases the only possible cause for an exception is allocation failure (we believe move constructors should not throw except due to allocation failure), and there are many applications where it’s appropriate to treat memory exhaustion as a fatal error rather than an exceptional condition that your program should attempt to recover from. Even for other potential failures you should prioritize interface simplicity over supporting all possible exception throwing scenarios: instead of writing a complicated noexcept clause that depends on whether a hash function can throw, for example, simply document that your component doesn’t support hash functions throwing and make it unconditionally noexcept.

## Casting

Use C++-style casts like `static_cast<float>(double_value)`, or brace initialization for conversion of arithmetic types like `int64 y = int64{1} << 42`. Do not use cast formats like `(int)x` unless the cast is to void. You may use cast formats like `T(x)` only when `T` is a class type.

**Definition:**

C++ introduced a different cast system from C that distinguishes the types of cast operations.

**Pros:**

The problem with C casts is the ambiguity of the operation; sometimes you are doing a conversion (e.g., (int)3.5) and sometimes you are doing a cast (e.g., (int)"hello"). Brace initialization and C++ casts can often help avoid this ambiguity. Additionally, C++ casts are more visible when searching for them.

**Cons:**

The C++-style cast syntax is verbose and cumbersome.

**Decision:**

In general, do not use C-style casts. Instead, use these C++-style casts when explicit type conversion is necessary.

- Use brace initialization to convert arithmetic types (e.g., `int64{x}`). This is the safest approach because code will not compile if conversion can result in information loss. The syntax is also concise.
- Use static_cast as the equivalent of a C-style cast that does value conversion, when you need to explicitly up-cast a pointer from a class to its superclass, or when you need to explicitly cast a pointer from a superclass to a subclass. In this last case, you must be sure your object is actually an instance of the subclass.
- Use const_cast to remove the const qualifier (see const).
- Use reinterpret_cast to do unsafe conversions of pointer types to and from integer and other pointer types, including void*. Use this only if you know what you are doing and you understand the aliasing issues.

## Streams

Use streams where appropriate, and stick to "simple" usages. Overload << for streaming only for types representing values, and write only the user-visible value, not any implementation details.

**Definition:**

Streams are the standard I/O abstraction in C++, as exemplified by the standard header <iostream>. They are widely used in Google code, mostly for debug logging and test diagnostics.

**Pros:**

The << and >> stream operators provide an API for formatted I/O that is easily learned, portable, reusable, and extensible. printf, by contrast, doesn't even support `std::string`, to say nothing of user-defined types, and is very difficult to use portably. printf also obliges you to choose among the numerous slightly different versions of that function, and navigate the dozens of conversion specifiers.

Streams provide first-class support for console I/O via `std::cin`, `std::cout`, `std::cerr`, and `std::clog`. The C APIs do as well, but are hampered by the need to manually buffer the input.

**Cons:**

- Stream formatting can be configured by mutating the state of the stream. Such mutations are persistent, so the behavior of your code can be affected by the entire previous history of the stream, unless you go out of your way to restore it to a known state every time other code might have touched it. User code can not only modify the built-in state, it can add new state variables and behaviors through a registration system.
- It is difficult to precisely control stream output, due to the above issues, the way code and data are mixed in streaming code, and the use of operator overloading (which may select a different overload than you expect).
- The practice of building up output through chains of << operators interferes with internationalization, because it bakes word order into the code, and streams' support for localization is flawed.
- The streams API is subtle and complex, so programmers must develop experience with it in order to use it effectively.
- Resolving the many overloads of << is extremely costly for the compiler. When used pervasively in a large code base, it can consume as much as 20% of the parsing and semantic analysis time.

**Decision:**

Use streams only when they are the best tool for the job. This is typically the case when the I/O is ad-hoc, local, human-readable, and targeted at other developers rather than end-users. Be consistent with the code around you, and with the codebase as a whole; if there's an established tool for your problem, use that tool instead. In particular, logging libraries are usually a better choice than `std::cerr` or `std::clog` for diagnostic output, and the equivalent are usually a better choice than `std::stringstream`.

Avoid using streams for I/O that faces external users or handles untrusted data. Instead, find and use the appropriate templating libraries to handle issues like internationalization, localization, and security hardening.

If you do use streams, avoid the stateful parts of the streams API (other than error state), such as `imbue()`, xalloc(), and `registerCallback()`. Use explicit formatting functions rather than stream manipulators or formatting flags to control formatting details such as number base, precision, or padding.

Overload << as a streaming operator for your type only if your type represents a value, and << writes out a human-readable string representation of that value. Avoid exposing implementation details in the output of <<; if you need to print object internals for debugging, use named functions instead (a method named `debugString()` is the most common convention).

## Preincrement and Predecrement

Use the prefix form (++i) of the increment and decrement operators unless you need postfix semantics.

**Definition:**

When a variable is incremented (`++i` or `i++`) or decremented (`--i` or `i--`) and the value of the expression is not used, one must decide whether to preincrement (decrement) or postincrement (decrement).

**Pros:**

A postfix increment/decrement expression evaluates to the value as it was before it was modified. This can result in code that is more compact but harder to read. The prefix form is generally more readable, is never less efficient, and can be more efficient because it doesn't need to make a copy of the value as it was before the operation.

**Cons:**

The tradition developed, in C, of using post-increment, even when the expression value is not used, especially in for loops.

**Decision:**

Use prefix increment/decrement, unless the code explicitly needs the result of the postfix increment/decrement expression.

## Use of const

In APIs, use const whenever it makes sense. constexpr is a better choice for some uses of const.

**Definition:**

Declared variables and parameters can be preceded by the keyword const to indicate the variables are not changed (e.g., `const int foo`). Class functions can have the const qualifier to indicate the function does not change the state of the class member variables (e.g., `class Foo { int Bar(char c) const; };`).

**Pros:**

Easier for people to understand how variables are being used. Allows the compiler to do better type checking, and, conceivably, generate better code. Helps people convince themselves of program correctness because they know the functions they call are limited in how they can modify your variables. Helps people know what functions are safe to use without locks in multi-threaded programs.

**Cons:**

const is viral: if you pass a const variable to a function, that function must have const in its prototype (or the variable will need a const_cast). This can be a particular problem when calling library functions.

**Decision:**

We strongly recommend using const in APIs (i.e., on function parameters, methods, and non-local variables) wherever it is meaningful and accurate. This provides consistent, mostly compiler-verified documentation of what objects an operation can mutate. Having a consistent and reliable way to distinguish reads from writes is critical to writing thread-safe code, and is useful in many other contexts as well. In particular:
- If a function guarantees that it will not modify an argument passed by reference or by pointer, the corresponding function parameter should be a reference-to-const (const T&) or pointer-to-const (const T*), respectively.
- For a function parameter passed by value, const has no effect on the caller, thus is not recommended in function declarations. See [TotW #109](https://abseil.io/tips/109).
- Declare methods to be const unless they alter the logical state of the object (or enable the user to modify that state, e.g., by returning a non-const reference, but that's rare), or they can't safely be invoked concurrently.
- Using const on local variables is neither encouraged nor discouraged.

All of a class's const operations should be safe to invoke concurrently with each other. If that's not feasible, the class must be clearly documented as "thread-unsafe".

### Where to put the const

Put const first, for example, prefer `const int *foo` to `int const *foo`.

## Use of constexpr

Use constexpr to define true constants or to ensure constant initialization.

**Definition:**

Some variables can be declared constexpr to indicate the variables are true constants, i.e., fixed at compilation/link time. Some functions and constructors can be declared constexpr which enables them to be used in defining a constexpr variable.

**Pros:**

Use of constexpr enables definition of constants with floating-point expressions rather than just literals; definition of constants of user-defined types; and definition of constants with function calls.

**Cons:**

Prematurely marking something as constexpr may cause migration problems if later on it has to be downgraded. Current restrictions on what is allowed in constexpr functions and constructors may invite obscure workarounds in these definitions.

**Decision:**

constexpr definitions enable a more robust specification of the constant parts of an interface. Use constexpr to specify true constants and the functions that support their definitions. Avoid complexifying function definitions to enable their use with constexpr. Do not use constexpr to force inlining.

## Integer Types

Of the built-in C++ integer types, the only one used is int. If a program needs a variable of a different size, use a precise-width integer type from <stdint.h>, such as int16_t. If your variable represents a value that could ever be greater than or equal to 2^31 (2GiB), use a 64-bit type such as int64_t. Keep in mind that even if your value won't ever be too large for an int, it may be used in intermediate calculations which may require a larger type. When in doubt, choose a larger type.

**Definition:**

C++ does not specify the sizes of integer types like int. Typically people assume that short is 16 bits, int is 32 bits, long is 32 bits and long long is 64 bits.

**Pros:**

Uniformity of declaration.

**Cons:**

The sizes of integral types in C++ can vary based on compiler and architecture.

**Decision:**

<cstdint> defines types like int16_t, uint32_t, int64_t, etc. You should always use those in preference to short, unsigned long long and the like, when you need a guarantee on the size of an integer. Of the C integer types, only int should be used. When appropriate, you are welcome to use standard types like size_t and ptrdiff_t.

We use int very often, for integers we know are not going to be too big, e.g., loop counters. Use plain old int for such things. You should assume that an int is at least 32 bits, but don't assume that it has more than 32 bits. If you need a 64-bit integer type, use int64_t or uint64_t.

For integers we know can be "big", use int64_t.

If your code is a container that returns a size, be sure to use a type that will accommodate any possible usage of your container. When in doubt, use a larger type rather than a smaller type.

Use care when converting integer types. Integer conversions and promotions can cause undefined behavior, leading to security bugs and other problems.

## 64-bit Portability

Code should be 64-bit and 32-bit friendly. Bear in mind problems of printing, comparisons, and structure alignment.
- Correct portable printf() conversion specifiers for some integral typedefs rely on macro expansions that we find unpleasant to use and impractical to require (the PRI macros from <cinttypes>). Unless there is no reasonable alternative for your particular case, try to avoid or even upgrade APIs that rely on the printf family. Instead use a library supporting typesafe numeric formatting, such as StrCat or Substitute for fast simple conversions, or std::ostream.
- Unfortunately, the PRI macros are the only portable way to specify a conversion for the standard bitwidth typedefs (e.g., int64_t, uint64_t, int32_t, uint32_t, etc). Where possible, avoid passing arguments of types specified by bitwidth typedefs to printf-based APIs. Note that it is acceptable to use typedefs for which printf has dedicated length modifiers, such as `size_t (z)`, `ptrdiff_t (t)`, and `maxint_t (j)`.
- Remember that `sizeof(void *) != sizeof(int)`. Use intptr_t if you want a pointer-sized integer.
You may need to be careful with structure alignments, particularly for structures being stored on disk. Any class/structure with a int64_t/uint64_t member will by default end up being 8-byte aligned on a 64-bit system. If you have such structures being shared on disk between 32-bit and 64-bit code, you will need to ensure that they are packed the same on both architectures. Most compilers offer a way to alter structure alignment. For gcc, you can use `__attribute__((packed))`. MSVC offers `#pragma pack()` and `__declspec(align())`.
- Use braced-initialization as needed to create 64-bit constants. For example:
```c++
int64_t my_value{0x123456789};
uint64_t my_mask{3ULL << 48};
```

## Preprocessor Macros

Avoid defining macros, especially in headers; prefer inline functions, enums, and const variables. Name macros with a project-specific prefix. Do not use macros to define pieces of a C++ API.

Macros mean that the code you see is not the same as the code the compiler sees. This can introduce unexpected behavior, especially since macros have global scope.

The problems introduced by macros are especially severe when they are used to define pieces of a C++ API, and still more so for public APIs. Every error message from the compiler when developers incorrectly use that interface now must explain how the macros formed the interface. Refactoring and analysis tools have a dramatically harder time updating the interface. As a consequence, we specifically disallow using macros in this way. For example, avoid patterns like:
```c++
class WOMBAT_TYPE(Foo) {
  // ...

 public:
  EXPAND_PUBLIC_WOMBAT_API(Foo)

  EXPAND_WOMBAT_COMPARISONS(Foo, ==, <)
};
```

Luckily, macros are not nearly as necessary in C++ as they are in C. Instead of using a macro to inline performance-critical code, use an inline function. Instead of using a macro to store a constant, use a const variable. Instead of using a macro to "abbreviate" a long variable name, use a reference. Instead of using a macro to conditionally compile code ... well, don't do that at all (except, of course, for the #pragma guards to prevent double inclusion of header files). It makes testing much more difficult.

Macros can do things these other techniques cannot, and you do see them in the codebase, especially in the lower-level libraries. And some of their special features (like stringifying, concatenation, and so forth) are not available through the language proper. But before using a macro, consider carefully whether there's a non-macro way to achieve the same result. If you need to use a macro to define an interface, contact your project leads to request a waiver of this rule.

The following usage pattern will avoid many problems with macros; if you use macros, follow it whenever possible:

- Don't define macros in a .h file.
#define macros right before you use them, and #undef them right after.
- Do not just #undef an existing macro before replacing it with your own; instead, pick a name that's likely to be unique.
- Try not to use macros that expand to unbalanced C++ constructs, or at least document that behavior well.
- Prefer not using ## to generate function/class/variable names.

Exporting macros from headers (i.e., defining them in a header without #undefing them before the end of the header) is extremely strongly discouraged. If you do export a macro from a header, it must have a globally unique name. To achieve this, it must be named with a prefix consisting of your project's namespace name (but upper case).

## 0 and nullptr/NULL

Use nullptr for pointers, and '\0' for chars (and not the 0 literal).

For pointers (address values), use nullptr, as this provides type-safety.

Use '\0' for the null character. Using the correct type makes the code more readable.

Never use NULL.

## Type Deduction (including auto)

Use type deduction only if it makes the code clearer to readers who aren't familiar with the project, or if it makes the code safer. Do not use it merely to avoid the inconvenience of writing an explicit type.

**Definition:**

There are several contexts in which C++ allows (or even requires) types to be deduced by the compiler, rather than spelled out explicitly in the code:

**Pros:**

- C++ type names can be long and cumbersome, especially when they involve templates or namespaces.
- When a C++ type name is repeated within a single declaration or a small code region, the repetition may not be aiding readability.
- It is sometimes safer to let the type be deduced, since that avoids the possibility of unintended copies or type conversions.

**Cons:**

C++ code is usually clearer when types are explicit, especially when type deduction would depend on information from distant parts of the code. In expressions like:

```c++
auto foo = x.add_foo();
auto i = y.Find(key);
```

it may not be obvious what the resulting types are if the type of y isn't very well known, or if y was declared many lines earlier.

Programmers have to understand when type deduction will or won't produce a reference type, or they'll get copies when they didn't mean to.

If a deduced type is used as part of an interface, then a programmer might change its type while only intending to change its value, leading to a more radical API change than intended.

**Decision:**

The fundamental rule is: use type deduction only to make the code clearer or safer, and do not use it merely to avoid the inconvenience of writing an explicit type. When judging whether the code is clearer, keep in mind that your readers are not necessarily on your team, or familiar with your project, so types that you and your reviewer experience as unnecessary clutter will very often provide useful information to others. For example, you can assume that the return type of make_unique<Foo>() is obvious, but the return type of MyWidgetFactory() probably isn't.

These principles apply to all forms of type deduction, but the details vary, as described in the following sections.

## Lambda Expressions

Use lambda expressions where appropriate. Prefer explicit captures when the lambda will escape the current scope.

**Pros:**

- Lambdas are much more concise than other ways of defining function objects to be passed to STL algorithms, which can be a readability improvement.
- Appropriate use of default captures can remove redundancy and highlight important exceptions from the default.
- Lambdas, std::function, and std::bind can be used in combination as a general purpose callback mechanism; they make it easy to write functions that take bound functions as arguments.

**Cons:**

- Variable capture in lambdas can be a source of dangling-pointer bugs, particularly if a lambda escapes the current scope.
- Default captures by value can be misleading because they do not prevent dangling-pointer bugs. - Capturing a pointer by value doesn't cause a deep copy, so it often has the same lifetime issues as capture by reference. This is especially confusing when capturing 'this' by value, since the use of 'this' is often implicit.
- Captures actually declare new variables (whether or not the captures have initializers), but they look nothing like any other variable declaration syntax in C++. In particular, there's no place for the variable's type, or even an auto placeholder (although init captures can indicate it indirectly, e.g., with a cast). This can make it difficult to even recognize them as declarations.
- Init captures inherently rely on type deduction, and suffer from many of the same drawbacks as auto, with the additional problem that the syntax doesn't even cue the reader that deduction is taking place.
- It's possible for use of lambdas to get out of hand; very long nested anonymous functions can make code harder to understand.

**Decision:**

- Use lambda expressions where appropriate, with formatting as described below.
- Prefer explicit captures if the lambda may escape the current scope. For example, instead of:
```c++
{
  Foo foo;
  ...
  executor->Schedule([&] { Frobnicate(foo); })
  ...
}
// BAD! The fact that the lambda makes use of a reference to `foo` and
// possibly `this` (if `Frobnicate` is a member function) may not be
// apparent on a cursory inspection. If the lambda is invoked after
// the function returns, that would be bad, because both `foo`
// and the enclosing object could have been destroyed.
```

prefer to write:
```c++
{
  Foo foo;
  ...
  executor->Schedule([&foo] { Frobnicate(foo); })
  ...
}
// BETTER - The compile will fail if `Frobnicate` is a member
// function, and it's clearer that `foo` is dangerously captured by
// reference.
```
- Use default capture by reference ([&]) only when the lifetime of the lambda is obviously shorter than any potential captures.
- Use default capture by value ([=]) only as a means of binding a few variables for a short lambda, where the set of captured variables is obvious at a glance. Prefer not to write long or complex lambdas with default capture by value.
- Use captures only to actually capture variables from the enclosing scope. Do not use captures with initializers to introduce new names, or to substantially change the meaning of an existing name. Instead, declare a new variable in the conventional way and then capture it, or avoid the lambda shorthand and define a function object explicitly.
- See the section on type deduction for guidance on specifying the parameter and return types.

## Template Metaprogramming

Avoid complicated template programming.

## Boost

Use only approved libraries from the Boost library collection.

//TODO: add using boost libs

## Naming

Optimize for readability using names that would be clear even to people on a different team.

Use names that describe the purpose or intent of the object. Do not worry about saving horizontal space as it is far more important to make your code immediately understandable by a new reader. Minimize the use of abbreviations that would likely be unknown to someone outside your project (especially acronyms and initialisms). Do not abbreviate by deleting letters within a word. As a rule of thumb, an abbreviation is probably OK if it's listed in Wikipedia. Generally speaking, descriptiveness should be proportional to the name's scope of visibility. For example, n may be a fine name within a 5-line function, but within the scope of a class, it's likely too vague.
```c++
class MyClass {
 public:
  int countFooErrors(const std::vector<Foo>& foos) {
    int n = 0;  // Clear meaning given limited scope and context
    for (const auto& foo : foos) {
      ...
      ++n;
    }
    return n;
  }
  void doSomethingImportant() {
    std::string fqdn = ...;  // Well-known abbreviation for Fully Qualified Domain Name
  }
 private:
  const int _maxAllowedConnections = ...;  // Clear meaning within context
};
```

```c++
class MyClass {
 public:
  int countFooErrors(const std::vector<Foo>& foos) {
    int totalNumberOfFooErrors = 0;  // Overly verbose given limited scope and context
    for (int fooIndex = 0; fooIndex < foos.size(); ++fooIndex) {  // Use idiomatic `i`
      ...
      ++totalNumberOfFooErrors;
    }
    return totalNumberOfFooErrors;
  }
  void doSomethingImportant() {
    int cstmrId = ...;  // Deletes internal letters
  }
 private:
  const int _num = ...;  // Unclear meaning within broad scope
};
```

Note that certain universally-known abbreviations are OK, such as i for an iteration variable and T for a template parameter.

## File Names

Filenames start with a capital letter and have a capital letter for each new word can include dashes (-). 

Examples of acceptable file names:
- MyUsefulClass.cpp
- Application-mac.mm


C++ files should end in `.cpp` and header files should end in `.h`. Files that rely on being textually included at specific points should end in .inc.

Do not use filenames that already exist in `/usr/include`, such as `db.h`.

In general, make your filenames very specific. For example, use `HttpServerLogs.h` rather than `logs.h`. A very common case is to have a pair of files called, e.g., `FooBar.h` and `FooBar.cpp`, defining a class called `FooBar`.

## Type Names

Type names start with a capital letter and have a capital letter for each new word, with no underscores: `MyExcitingClass`, `MyExcitingEnum`.

The names of all types — classes, structs, type aliases, enums, and type template parameters — have the same naming convention. Type names should start with a capital letter and have a capital letter for each new word. No underscores. For example:
```c++
// classes and structs
class UrlTable { ...
class UrlTableTester { ...
struct UrlTableProperties { ...

// typedefs
typedef hash_map<UrlTableProperties *, std::string> PropertiesMap;

// using aliases
using PropertiesMap = hash_map<UrlTableProperties *, std::string>;

// enums
enum class UrlTableError { ...
```

## Variable Names

The names of variables (including function parameters) and data members start with a lowercase letter and have a capital letter for each new word.

### Common Variable names

For example:
```c++
std::string tableName;  // OK.

```

```c++
std::string table_Name;   // Bad - has underscore.
```


### Class Data Members

Data members of classes, both static and non-static, are named like ordinary nonmember variables, but with a prefix underscore.
```c++
class TableInfo {
  ...
 private:
  std::string _tableName;  // OK.
  static Pool<TableInfo>* _pool;  // OK.
};
```

## Struct Data Members

Data members of structs, both static and non-static, are named like ordinary nonmember variables. They do not have the prefix underscores that data members in classes have.
```c++
struct UrlTableProperties {
  std::string name;
  int numEntries;
  static Pool<UrlTableProperties>* pool;
};
```

## Constant Names
Variables declared constexpr or const, and whose value is fixed for the duration of the program, then use all capital letters and connect each word with under scores. For example:
```c++
const int DAYS_IN_A_WEEK = 7;
const int ANDRDOI8_0_0 = 24;  // Android 8.0.0
```

## Function Names

Regular functions have mixed case; accessors and mutators may be named like variables.

Ordinarily, functions should start with a lowercase letter and have a capital letter for each new word.
```c++
addTableEntry()
deleteUrl()
openFileOrDie()
```

Accessors and mutators (get and set functions) may be named like variables. These often correspond to actual member variables, but this is not required. For example, `int count()` and `void setCount(int count)`.

## Namespace Names

Namespace names are all lower-case, with words separated by underscores. Top-level namespace names are based on the project name . Avoid collisions between nested namespaces and well-known top-level namespaces.

## Enumerator Names

Enumerators (for both scoped and unscoped enums) should be named like constants. That is, ENUM_NAME.
```c++
enum class AlternateUrlTableError {
  OK = 0,
  OUT_OF_MEMORY = 1,
  MALFORMED_INPUT = 2,
};
```

## Macro Names

You're not really going to define a macro, are you? If you do, they're like this: MY_MACRO_THAT_SCARES_SMALL_CHILDREN_AND_ADULTS_ALIKE.
```c++
#define ROUND(x) ...
#define PI_ROUNDED 3.0
```

## Braced initialization

C++ provides braced initialization since C++11. It is a uniform initialization. And it will prohibit implicit narrowing conversions, for example:
```c++
double x, y, z;
...
int sum1{ x + y + z}; // error! sum of doubles may not be expressible as int.
```

So use braced initialization as possible.

# Formatting

There is `.clang-format` file in the root of repo, please use clang format to format the codes before sending a pull request.

[1]: https://user-images.githubusercontent.com/1503156/112012067-d5cdf580-8b63-11eb-819a-1c32cf253b25.png

