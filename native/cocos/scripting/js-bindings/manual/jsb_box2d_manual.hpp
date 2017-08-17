#pragma once

#include "Box2D/Box2D.h"

#include <vector>

namespace se {
    class Object;
    class Value;
}

bool register_all_box2d_manual(se::Object* obj);

bool array_of_b2Fixture_to_seval(const std::vector<b2Fixture*>& fixtures, se::Value* ret);
bool array_of_b2Vec2_to_seval(const std::vector<b2Vec2>& vs, se::Value* ret);
