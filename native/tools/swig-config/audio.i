// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// audio at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="jsb") audio

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "audio/graph_based/AudioContext.h"
#include "audio/graph_based/AudioBuffer.h"
#include "audio/graph_based/AudioDestinationNode.h"
#include "audio/graph_based/AudioNode.h"
#include "audio/graph_based/AudioScheduledSourceNode.h"
#include "audio/graph_based/GainNode.h"
#include "audio/graph_based/StereoPannerNode.h"
#include "audio/graph_based/SourceNode.h"
#include "audio/graph_based/BaseAudioContext.h"

%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_audio_auto.h"
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
// %ignore cc::AudioEngine::getPCMHeader;
// %ignore cc::AudioEngine::getOriginalPCMBuffer;
// %ignore cc::AudioEngine::getPCMBufferByFormat;
%ignore cc::BaseAudioContext::getInnerContext;


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



// ----- Module Macro Section ------
// Brief: Generated code should be wrapped inside a macro
// Usage:
//  1. Configure for class
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::GeometryRenderer;
//  2. Configure for member function or attribute
//    %module_macro(CC_USE_GEOMETRY_RENDERER) cc::pipeline::RenderPipeline::geometryRenderer;
// Note: Should be placed before 'Attribute Section'

// Write your code bellow



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
// AudioContext
%attribute(cc::AudioContext, double, baseLatency, baseLatency);
%attribute(cc::AudioContext, double, outputLatency, outputLatency);

// AudioBuffer
%attribute(cc::AudioBuffer, double, duration, duration);
%attribute(cc::AudioBuffer, size_t, length, length);
%attribute(cc::AudioBuffer, uint32_t, numberOfChannels, numberOfChannels);
%attribute(cc::AudioBuffer, uint32_t, sampleRate, sampleRate);
// AudioNode
%attribute(cc::AudioNode, uint32_t, numberOfInputs, numberOfChannels);
%attribute(cc::AudioNode, uint32_t, numberOfOutputs, numberOfOutputs);
%attribute(cc::AudioNode, uint32_t, channelCount, channelCount, setChannelCount);
%attribute(cc::AudioNode, uint32_t, channelCountMode, channelCountMode, setChannelCountMode);
%attribute(cc::AudioNode, uint32_t, channelInterpretation, channelInterpretation, setChannelInterpretation);
// AudioDestinationNode
%attribute(cc::AudioDestinationNode, uint32_t, maxChannelCount, maxChannelCount, setMaxChannelCount);
// AudioParam
%attribute(cc::AudioParam, float, value, value, setValue);
%attribute(cc::AudioParam, float, defaultValue, defaultValue);
%attribute(cc::AudioParam, float, maxValue, maxValue)
%attribute(cc::AudioParam, float, minValue, minValue)
// BaseAudioContext
%attribute(cc::BaseAudioContext, double, currentTime, currentTime);
%attribute(cc::BaseAudioContext, cc::AudioDestinationNode, destination, destination);
%attribute(cc::BaseAudioContext, float, sampleRate, sampleRate);
%attribute(cc::BaseAudioContext, uint32_t, state, state);
// GainNode
%attribute(cc::GainNode, cc::AudioParam*, gain, gain);
// StereoPannerNode
%attribute(cc::StereoPannerNode, cc::AudioParam*, pan, pan);
// SourceNode
%attribute(cc::SourceNode, cc::AudioParam*, detune, detune);
%attribute(cc::SourceNode, cc::AudioParam*, playbackRate, playbackRate);
%attribute(cc::SourceNode, bool, loop, loop, setLoop);
%attribute(cc::SourceNode, float, currentTime, currentTime, setCurrentTime);
%attribute(cc::SourceNode, float, loopStart, loopStart, setLoopStart);
%attribute(cc::SourceNode, float, loopEnd, loopEnd, setLoopEnd);

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "audio/Export.h"




// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
// %include "audio/include/AudioEngine.h"
%include "audio/graph_based/AudioContext.h"
%include "audio/graph_based/AudioBuffer.h"
%include "audio/graph_based/AudioDestinationNode.h"
%include "audio/graph_based/AudioNode.h"
%include "audio/graph_based/AudioScheduledSourceNode.h"
%include "audio/graph_based/GainNode.h"
%include "audio/graph_based/StereoPannerNode.h"
%include "audio/graph_based/SourceNode.h"
%include "audio/graph_based/BaseAudioContext.h"

