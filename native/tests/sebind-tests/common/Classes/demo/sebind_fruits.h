#pragma once

#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_conversions.h"
#include "bindings/manual/jsb_global.h"

#include "Coconut.h"
#include "Fruit.h"

JSB_REGISTER_OBJECT_TYPE(demo::Fruit);
JSB_REGISTER_OBJECT_TYPE(demo::Coconut);

bool jsb_register_fruits(se::Object *);