// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// engine at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="jsb") engine

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "core/data/Object.h"
#include "core/data/JSBNativeDataHolder.h"
#include "platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"
#include "platform/interfaces/modules/Device.h"
#include "platform/interfaces/modules/ISystemWindow.h"
#include "platform/interfaces/modules/ISystemWindowManager.h"
#include "platform/FileUtils.h"
#include "platform/SAXParser.h"
#include "math/Vec2.h"
#include "math/Vec3.h"
#include "math/Vec4.h"
#include "math/Mat3.h"
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Color.h"
#include "profiler/DebugRenderer.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_cocos_auto.h"
#include "bindings/auto/jsb_gfx_auto.h"
%}

// ----- Ignore Section Begin ------
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
%ignore cc::RefCounted;

%rename("$ignore", regextarget=1, fullname=1) "cc::Vec2::.*[^2]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Vec3::.*[^3]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Vec3::t.*$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Vec4::.*[^4]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Mat3::.*[^3]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Mat4::.*[^4]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Quaternion::.*[^n]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Color::.*[^r]$";
%rename("$ignore", regextarget=1, fullname=1) "cc::Color::r$";

namespace cc {
//%ignore ISystemWindowManager;

%ignore ICanvasRenderingContext2D::Delegate;
%ignore ICanvasRenderingContext2D::setCanvasBufferUpdatedCallback;
%ignore ICanvasRenderingContext2D::fillText;
%ignore ICanvasRenderingContext2D::strokeText;
%ignore ICanvasRenderingContext2D::fillRect;
%ignore ICanvasRenderingContext2D::measureText;

%ignore FileUtils::getFileData;
%ignore FileUtils::setFilenameLookupDictionary;
%ignore FileUtils::destroyInstance;
%ignore FileUtils::getFullPathCache;
%ignore FileUtils::getContents;
%ignore FileUtils::listFilesRecursively;
%ignore FileUtils::setDelegate;

%ignore Device::getDeviceMotionValue;

%ignore ResizableBuffer;

%ignore Vec2::compOp;

%ignore SAXDelegator;
%ignore SAXParser::parse(const char* xmlData, size_t dataLength);
%ignore SAXParser::setDelegator;
%ignore SAXParser::startElement;
%ignore SAXParser::endElement;
%ignore SAXParser::textHandler;

%ignore DebugRenderer::activate;
%ignore DebugRenderer::render;
%ignore DebugRenderer::destroy;
%ignore DebugRenderer::update;

%ignore DebugFontInfo;
%ignore DebugRendererInfo;

%ignore JSBNativeDataHolder::getData;
%ignore JSBNativeDataHolder::setData;

%ignore CCObject::setScriptObject;
%ignore CCObject::getScriptObject;

}



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

%rename(_destroy) cc::CCObject::destroy;
%rename(_destroyImmediate) cc::CCObject::destroyImmediate;
// %rename(CanvasRenderingContext2D) cc::ICanvasRenderingContext2D;
// %rename(CanvasGradient) cc::ICanvasGradient;
%rename(PlistParser) cc::SAXParser;

%rename(Quat) cc::Quaternion;


// ----- Module Macro Section ------
// Brief: Generated code should be wrapped inside a macro
// Usage:
//  1. Configure for class
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
//  2. Configure for member function or attribute
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
// Note: Should be placed before 'Attribute Section'

%module_macro(CC_USE_DEBUG_RENDERER) cc::DebugTextInfo;
%module_macro(CC_USE_DEBUG_RENDERER) cc::DebugRenderer;


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
%attribute_writeonly(cc::ICanvasRenderingContext2D, float, width, setWidth);
%attribute_writeonly(cc::ICanvasRenderingContext2D, float, height, setHeight);
%attribute_writeonly(cc::ICanvasRenderingContext2D, float, lineWidth, setLineWidth);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, fillStyle, setFillStyle);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, font, setFont);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, globalCompositeOperation, setGlobalCompositeOperation);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, lineCap, setLineCap);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, strokeStyle, setStrokeStyle);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, lineJoin, setLineJoin);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, textAlign, setTextAlign);
%attribute_writeonly(cc::ICanvasRenderingContext2D, ccstd::string&, textBaseline, setTextBaseline);

%attribute(cc::CCObject, ccstd::string&, name, getName, setName);
%attribute(cc::CCObject, cc::CCObject::Flags, hideFlags, getHideFlags, setHideFlags);
%attribute(cc::CCObject, bool, isValid, isValid);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"
%import "base/RefCounted.h"
%import "base/memory/Memory.h"
%import "base/Data.h"
%import "base/Value.h"

%import "math/MathBase.h"
%import "math/Geometry.h"

%include "math/Vec2.h"
%include "math/Color.h"
%include "math/Vec3.h"
%include "math/Vec4.h"
%include "math/Mat3.h"
%include "math/Mat4.h"
%include "math/Quaternion.h"

%import "platform/interfaces/modules/IScreen.h"
%import "platform/interfaces/modules/ISystem.h"
%import "platform/interfaces/modules/INetwork.h"



// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "core/data/Object.h"
%include "core/data/JSBNativeDataHolder.h"

%include "platform/interfaces/modules/canvas/ICanvasRenderingContext2D.h"
%include "platform/interfaces/modules/canvas/CanvasRenderingContext2D.h"
%include "platform/interfaces/modules/Device.h"
%include "platform/interfaces/modules/ISystemWindow.h"
%include "platform/interfaces/modules/ISystemWindowManager.h"
%include "platform/FileUtils.h"
%include "platform/SAXParser.h"

%include "profiler/DebugRenderer.h"

