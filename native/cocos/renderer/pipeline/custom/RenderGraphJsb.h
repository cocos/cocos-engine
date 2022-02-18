// clang-format off
#pragma once
#include "cocos/bindings/manual/jsb_conversions.h"
#include "cocos/renderer/pipeline/custom/RenderCommonJsb.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"

bool nativevalue_to_se(const cc::render::RasterView &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::ComputeView &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::CopyPair &from, se::Value &to, se::Object *ctx); // NOLINT

bool nativevalue_to_se(const cc::render::MovePair &from, se::Value &to, se::Object *ctx); // NOLINT

// if function overload is used, android build fails
template <>
bool sevalue_to_native(const se::Value &from, cc::render::RasterView *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::ComputeView *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::CopyPair *to, se::Object *ctx); // NOLINT

template <>
bool sevalue_to_native(const se::Value &from, cc::render::MovePair *to, se::Object *ctx); // NOLINT

// clang-format on
