## Introduction

From Cocos Creator  3.7.0，we switch the approch of generating JS binding code from [bindings-generator](https://github.com/cocos/cocos-engine/tree/d08a11244d2a31da1aac7af7d2aa8f1b6152e30c/native/tools/bindings-generator) to [Swig](https://www.swig.org). Swig has many benefits in generating glue code by parsing  its custom `interface` file (IDL) which is compatible with `c++`. For more about why we switch to Swig, you could refer to [the issue](https://github.com/cocos/cocos-engine/issues/10792) .

## Re-generate JS Binding Code

- Make sure you have installed NodeJS ( `>= v8.9.4` )

- Open Terminal ( macOS / Linux) or Command Line Tool ( Windows ), navigate to `engine/cocos/native/tools/swig-config`

- Run `node genbindings.js`

- If succeed, you'll see the text:

   ```
   ======================================================================
       Congratulations, JS binding code was generated successfully!
   ======================================================================
   ```

- If failed, you need to check the output and figure whether there're some errors in `.i` files.

## Bind a New Module in Engine Step by Step

- For instance, we add a new module with two `.h` files located in `engine/native/cocos/my-new-module`

  ```c++
  #pragma once
  
  // NOTE: The '#include<...>' at the following will not be parsed by swig by default
  #include "ForImportOnly.h"
  //
  
  // Uncomment the following line if you wanna test MyNewBaseClass::getChild.
  // #define ENABLE_GET_CHILD 1
  
  namespace cc {
      class MY_DLL ClassToBeIgnored {
      public:
          void hello() {};
      };
  
      // MyGrandFather will not be bound since it's defined in ForImportOnly.h and Swig will not generate glue code for it.
      class MY_DLL MyNewBaseClass : public my_sub_ns::MyGrandFather {
      public:
          MyNewBaseClass() = default;
          virtual ~MyNewBaseClass() = default;
          
          void fooBase(int a, bool b) {
              printf("fooBase: %d, %d\n", a, (int)b);
          }
          inline void setEnabled(bool v) { _enabled = v; }
          inline bool isEnabled() const { return _enabled; }
  
          inline void setIntValue(int v) { _intValue = v; }
          inline int getIntValue() const { return _intValue; }
  
          inline void setIntAttributeToBeIgnored(int v) { _intAttributeToBeIgnored = v; }
          inline int getIntAttributeToBeIgnored() const { return _intAttributeToBeIgnored; }
  
          void methodToBeIgnored();
  
          float floatPropertyToBeIgnored{0.F};
          int publicProperty{123};
  
          // Only return valid object if ENABLE_GET_CHILD is defined, 
          // otherwise, return undefined to JS.
          MyNewBaseClass* getChild() const { 
              auto* p = new MyNewBaseClass();
              p->_intValue = 1234;
              p->_enabled = false;
              return p;
          }
  
      private:
          int _intValue{100};
          int _intAttributeToBeIgnored{200};
          bool _enabled{true};
      };
  
      class MY_DLL MyNewSubClass : public MyNewBaseClass {
      public:
          void fooSub(const std::string& v) {
              printf("fooSub: %s\n", v.c_str());
          }
  
          void methodBeforeRenamed(int a, int b) {
              printf("methodBeforeRenamed: %d, %d\n", a, b);
          }
  
          my_sub_ns::DeclareClass* getDeclareClass() const { return new my_sub_ns::DeclareClass(); }
      };
  
      class MY_DLL MyModuleSpecificClass {
      public:
          void foo() {
              printf("MyModuleSpecificClass::foo\n");
          }
      };
  
      class MY_DLL TestMyModuleSpecificMethod {
      public:
          MyModuleSpecificClass* getModuleSpecificClass() { return nullptr; }
          void foo() {
              printf("TestMyModuleSpecificMethod::foo\n");
          }
      };
  }
  ```

  `engine/native/cocos/my-new-module/ForImportOnly.h`

  ```c++
  #pragma once
  
  // NOTE: The '#include<...>' at the following will not be parsed by swig by default
  #include <stdio.h>
  #include <stdlib.h>
  #include <string>
  
  #define MY_DLL
  
  namespace cc::my_sub_ns {
      class DeclareClass {
      public:
          void foo() {}
      };
  
      class MyGrandFather {
      protected:
          MyGrandFather() = default;
          virtual ~MyGrandFather() = default;
      public:
          void helloGrandFather() {
              printf("helloGrandFather\n");
          };
      };
  }
  ```

- Add a new swig interface file in `engine/native/cocos/tools/swig-config` directory, e.g. `my_new_module.i` which its content:

  ```c++
  // Define module
  // target_namespace means the name exported to JS, could be same as which in other modules
  // my_new_module at the last means the suffix of binding function name, different modules should use unique name
  // Note: doesn't support number prefix
  %module(target_namespace="my_ns") my_new_module
  
  // Insert code at the beginning of generated header file (.h)
  %insert(header_file) %{
  #pragma once
  #include "bindings/jswrapper/SeApi.h"
  #include "bindings/manual/jsb_conversions.h"
  #include "my-new-module/MyNewModule.h"
  %}
  
  // Insert code at the beginning of generated source file (.cpp)
  %{
  #include "bindings/auto/jsb_my_new_module_auto.h"
  %}
  
  // ----- Ignore Section ------
  // Brief: Classes, methods or attributes need to be ignored
  //
  // Usage:
  //
  //  %ignore your_namespace::your_class_name;
  //  %ignore your_namespace::your_class_name::your_method_name;
  //  %ignore your_namespace::your_class_name::your_attribute_name;
  //
  // Note: 
  //  1. 'Ignore Section' should be placed before attribute definition and %import/%include
  //  2. namespace is needed
  //
  
  %ignore cc::ClassToBeIngored;
  // We don't wanna MyGrandFather to be the parent of MyNewBaseClass, so ignore it.
  %ignore cc::my_sub_ns::MyGrandFather;
  
  %ignore cc::MyNewBaseClass::methodToBeIgnored;
  %ignore cc::MyNewBaseClass::floatPropertyToBeIgnored;
  %ignore cc::MyNewBaseClass::intAttributeToBeIgnored;
  
  // ----- Rename Section ------
  // Brief: Classes, methods or attributes needs to be renamed
  //
  // Usage:
  //
  //  %rename(rename_to_name) your_namespace::original_class_name;
  //  %rename(rename_to_name) your_namespace::original_class_name::method_name;
  //  %rename(rename_to_name) your_namespace::original_class_name::attribute_name;
  // 
  // Note:
  //  1. 'Rename Section' should be placed before attribute definition and %import/%include
  //  2. namespace is needed
  
  %rename(foo) cc::MyNewBaseClass::fooBase;
  %rename(hello) cc::MyNewSubClass::methodBeforeRenamed;
  
  // ----- Module Macro Section ------
  // Brief: Generated code should be wrapped inside a macro
  // Usage:
  //  1. Configure for class
  //    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
  //  2. Configure for member function or attribute
  //    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
  // Note: Should be placed before 'Attribute Section'
  
  // Write your code bellow
  %module_macro(USE_MY_MODULE_SPCIFIC_CLASS) cc::MyModuleSpecificClass;
  %module_macro(USE_MY_MODULE_SPCIFIC_CLASS) cc::TestMyModuleSpecificMethod::getModuleSpecificClass;
  %module_macro(ENABLE_GET_CHILD) cc::MyNewBaseClass::getChild;
  
  // ----- Attribute Section ------
  // Brief: Define attributes ( JS properties with getter and setter )
  // Usage:
  //  1. Define an attribute without setter
  //    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name)
  //  2. Define an attribute with getter and setter
  //    %attribute(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_getter_name, cpp_setter_name)
  //  3. Define an attribute without getter
  //    %attribute_writeonly(your_namespace::your_class_name, cpp_member_variable_type, js_property_name, cpp_setter_name)
  //
  // Note:
  //  1. Don't need to add 'const' prefix for cpp_member_variable_type 
  //  2. The return type of getter should keep the same as the type of setter's parameter
  //  3. If using reference, add '&' suffix for cpp_member_variable_type to avoid generated code using value assignment
  //  4. 'Attribute Section' should be placed before 'Import Section' and 'Include Section'
  //
  %attribute(cc::MyNewBaseClass, bool, enabled, isEnabled, setEnabled);
  %attribute(cc::MyNewBaseClass, int, intValue, getIntValue, setIntValue);
  %attribute(cc::MyNewBaseClass, int, intAttributeToBeIgnored, getIntAttributeToBeIgnored, setIntAttributeToBeIgnored);
  
  // ----- Import Section ------
  // Brief: Import header files which are depended by 'Include Section'
  // Note: 
  //   %import "your_header_file.h" will not generate code for that header file
  //
  
  %import "cocos/my-new-module/ForImportOnly.h"
  // If we don't import ForImportOnly.h here, MY_DLL defined inside it
  // will not be known by Swig, an error will be triggered like the following:
  //
  // MyNewModule.h:16: Error: Syntax error in input(1).
  
  
  // ----- Include Section ------
  // Brief: Include header files in which classes and methods will be bound
  %include "cocos/my-new-module/MyNewModule.h"
  ```

- Open`engine/cocos/native/tools/swig-config/genbindings.js` file

- Find the following code and add `my_new_module.i` at the end

  ```js
  const swigConfigMap = [
      [ '2d.i', 'jsb_2d_auto.cpp' ],
      ...
      ...
      [ 'renderer.i', 'jsb_render_auto.cpp' ],
      // Add the new module config here
    	[ 'my_new_module', 'jsb_my_new_module_auto.cpp' ],
  ];
  ```

- Generate bindings

  ```bash
  cd engine/native/tools/swig-config
  node genbindings.js
  ```

- Modify `engine/cocos/native/CMakeLists.txt`, add `jsb_my_new_module_auto.cpp`

  ```cmake
  ######## auto
  cocos_source_files(
      NO_WERROR   NO_UBUILD   cocos/bindings/auto/jsb_my_new_module_auto.cpp # Added
                              cocos/bindings/auto/jsb_my_new_module_auto.h # Added
      NO_WERROR   NO_UBUILD   cocos/bindings/auto/jsb_cocos_auto.cpp
                              cocos/bindings/auto/jsb_cocos_auto.h
      ......
  ```

- Open jsb_module_register.cpp, register our new module

  ```c++
  ......
  #if CC_USE_PHYSICS_PHYSX
      #include "cocos/bindings/auto/jsb_physics_auto.h"
  #endif
  #include "cocos/bindings/auto/jsb_my_new_module_auto.h" // Add this line
  
  bool jsb_register_all_modules() {
      se::ScriptEngine *se = se::ScriptEngine::getInstance();
      ......
      se->addRegisterCallback(register_all_my_new_module); // Add this line
  
      se->addAfterCleanupHook([]() {
          cc::DeferredReleasePool::clear();
          JSBClassType::cleanup();
      });
      return true;   
  }
  ```

  

- Add test code in your project's script

  ```typescript
  const sub = new my_ns.MyNewSubClass();
  sub.foo(111, false);
  sub.fooSub("hello foo sub");
  sub.hello(334, 564);
  
  console.log('public property: ' + sub.publicProperty);
  console.log('attribute int value: ' + sub.intValue);
  console.log('attribute enabled: ' + sub.enabled);
  
  const child = sub.getChild();
  if (child) {
      console.log('child.intValue=' + child.intValue);
      console.log('child.enabled=' + child.enabled);
  } else {
      console.error('child is invalid: ' + child);
  }
  
  const moduleTest = new my_ns.TestMyModuleSpecificMethod();
  console.log('getModuleSpecificClass: ' + moduleTest.getModuleSpecificClass());
  ```

- Re-run project, if it succeeds, you will get the following output:

  ```
  fooBase: 111, 0
  fooSub: hello foo sub
  methodBeforeRenamed: 334, 564
  17:25:10 [DEBUG]: D/ JS: public property: 123
  17:25:10 [DEBUG]: D/ JS: attribute int value: 100
  17:25:10 [DEBUG]: D/ JS: attribute enabled: true
  17:25:10 [DEBUG]: D/ JS: [ERROR]: child is invalid: undefined
  17:25:10 [DEBUG]: D/ JS: getModuleSpecificClass: undefined
  ```

  **Note: We configure `getChild` should be controlled by module macro ``ENABLE_GET_CHILD` and it's disabled by default. So invoking `getChild` in JS will return `undefined` value.**

- Test c++ module configuration

  - Open MyNewModule.h, uncomment `ENABLE_GET_CHILD` definition

    ```c++
    // Uncomment the following line if you wanna test MyNewBaseClass::getChild.
    #define ENABLE_GET_CHILD 1
    
    namespace cc {
        class MY_DLL ClassToBeIgnored {
        public:
            void hello() {};
        };
    ```

  - Re-run project, we could get the correct value of `child` now, child values are `child.intValue=1234, child.enabled=false`

    ```
    fooBase: 111, 0
    fooSub: hello foo sub
    methodBeforeRenamed: 334, 564
    17:28:49 [DEBUG]: D/ JS: public property: 123
    17:28:49 [DEBUG]: D/ JS: attribute int value: 100
    17:28:49 [DEBUG]: D/ JS: attribute enabled: true
    17:28:49 [DEBUG]: D/ JS: child.intValue=1234
    17:28:49 [DEBUG]: D/ JS: child.enabled=false
    17:28:49 [DEBUG]: D/ JS: getModuleSpecificClass: undefined
    ```

    