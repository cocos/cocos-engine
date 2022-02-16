// clang-format off
#pragma once
#include "bindings/manual/jsb_conversions.h"
#include "renderer/pipeline/custom/RenderCommonJsb.h"
#include "renderer/pipeline/custom/RenderGraphFwd.h"

bool nativevalue_to_se(const cc::render::RasterView &from, se::Value &to, se::Object *ctx); // NOLINT
