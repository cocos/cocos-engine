//
// Created by liangshuochen on 09/06/2017.
//

#include "ConstraintData.h"

DRAGONBONES_NAMESPACE_BEGIN

void ConstraintData::_onClear()
{
    order = 0;
    name = "";
    target = nullptr;
    root = nullptr;
    bone = nullptr;
}

void IKConstraintData::_onClear()
{
    ConstraintData::_onClear();

    scaleEnabled = false;
    bendPositive = false;
    weight = 1.0f;
}

DRAGONBONES_NAMESPACE_END
