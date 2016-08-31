#include "2d/CCLabelTTF.h"

NS_CC_BEGIN

LabelTTF::LabelTTF()
: _renderLabel(nullptr)
{
    setAnchorPoint(Vec2::ANCHOR_MIDDLE);
    setCascadeColorEnabled(true);
    setCascadeOpacityEnabled(true);
    _renderLabel = Label::create();
    _renderLabel->setAnchorPoint(Vec2::ANCHOR_BOTTOM_LEFT);
    addChild(_renderLabel);
}

Label* LabelTTF::getRenderLabel() const {
    return _renderLabel;
}

NS_CC_END