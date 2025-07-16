// Define module
// target_namespace means the name exported to JS, could be same as which in other modules
// audio at the last means the suffix of binding function name, different modules should use unique name
// Note: doesn't support number prefix
%module(target_namespace="jsb") play

// Disable some swig warnings, find warning number reference here ( https://www.swig.org/Doc4.1/Warnings.html )
#pragma SWIG nowarn=503,302,401,317,402

// Insert code at the beginning of generated header file (.h)
%insert(header_file) %{
#pragma once
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "vendor/google/play/PlayTask.h"
#include "vendor/google/play/TResult.h"
#include "vendor/google/play/PlayGames.h"
%}

// Insert code at the beginning of generated source file (.cpp)
%{
#include "bindings/auto/jsb_google_play_auto.h"
#include "vendor/google/play/PlayTask.h"
#include "vendor/google/play/TResult.h"
%}

%ignore cc::AchievementBuffer::createAchievement;

// ----- Import Section ------
// Brief: Import header files which are depended by 'Include Section'
// Note: 
//   %import "your_header_file.h" will not generate code for that header file
//
%import "base/Macros.h"

// ----- Include Section ------
// Brief: Include header files in which classes and methods will be bound
%include "vendor/google/play/TResult.h"
%include "vendor/google/play/PlayTask.h"
%include "vendor/google/play/GamesSignInClient.h"
%include "vendor/google/play/RecallClient.h"
%include "vendor/google/play/AchievementsClient.h"
%include "vendor/google/play/PlayGames.h"


